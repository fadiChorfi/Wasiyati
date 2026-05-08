import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import os from "os";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

// ── Field map type ───────────────────────────────────────────────────────────
type WillFields = {
  testator_full_name?: string | null;
  testator_birth_date?: string | null;
  testator_birth_place?: string | null;
  testator_profession?: string | null;
  testator_residence?: string | null;
  testator_national_id?: string | null;
  testator_id_issue_date?: string | null;
  testator_id_issue_place?: string | null;
  beneficiary_full_name?: string | null;
  beneficiary_relationship?: string | null;
  subject_of_will?: string | null;
  witness_1?: string | null;
  witness_2?: string | null;
  witness_1_sig?: string | null;
  witness_2_sig?: string | null;
  place?: string | null;
  created_at?: string | null;
  [key: string]: string | number | null | undefined;
};

type GenerateHtmlPdfBody = {
  templateName?: string;   // e.g. "general-will.html"
  outputFileName?: string; // e.g. "will-123.pdf"
  fields?: WillFields;
};

// ── Fill HTML template with field values ─────────────────────────────────────
function fillTemplate(html: string, fields: WillFields): string {
  let filled = html;

  for (const [key, value] of Object.entries(fields)) {
    const safe = escapeHtml(value == null ? "" : String(value));
    // Replace {{key}} placeholders
    filled = filled.replaceAll(`{{${key}}}`, safe);
  }

  // Any remaining {{...}} placeholders → empty string (don't leave raw tokens)
  filled = filled.replace(/\{\{[^}]+\}\}/g, "");

  return filled;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ── API Route ─────────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  let tmpHtmlPath: string | null = null;
  let tmpPdfPath: string | null = null;

  try {
    const body = (await req.json()) as GenerateHtmlPdfBody;
    const fields        = body.fields        ?? {};
    const templateName  = body.templateName  ?? "general-will.html";
    const outputFileName = body.outputFileName ?? "will.pdf";

    // ── 1. Load HTML template ──────────────────────────────────────────────
    const templatePath = path.join(
      process.cwd(),
      "public",
      "docs",
      "templates",
      templateName,
    );

    let templateHtml: string;
    try {
      templateHtml = await fs.readFile(templatePath, "utf-8");
    } catch {
      return NextResponse.json(
        { success: false, error: `Template not found: ${templateName}` },
        { status: 404 },
      );
    }

    // ── 2. Fill placeholders ───────────────────────────────────────────────
    const filledHtml = fillTemplate(templateHtml, fields);

    // ── 3. Write filled HTML to tmp file ──────────────────────────────────
    const tmpDir  = os.tmpdir();
    const uid     = Date.now() + "-" + Math.random().toString(36).slice(2);
    tmpHtmlPath   = path.join(tmpDir, `will-${uid}.html`);
    tmpPdfPath    = path.join(tmpDir, `will-${uid}.pdf`);

    await fs.writeFile(tmpHtmlPath, filledHtml, "utf-8");

    // ── 4. Run wkhtmltopdf ─────────────────────────────────────────────────
    const wkhtmlArgs = [
      // Page setup
      "--page-size",    "A4",
      "--orientation",  "Portrait",
      "--encoding",     "UTF-8",

      // Margins (match original PDF padding ~50pt ≈ 18mm)
      "--margin-top",    "18mm",
      "--margin-bottom", "18mm",
      "--margin-left",   "18mm",
      "--margin-right",  "18mm",

      // Arabic / RTL support
      "--enable-local-file-access",
      "--disable-smart-shrinking",

      // Disable JS (not needed, speeds up render)
      "--no-background",

      // Input/output
      tmpHtmlPath,
      tmpPdfPath,
    ];

    try {
      await execFileAsync("wkhtmltopdf", wkhtmlArgs);
    } catch (err) {
      console.error("[generate-pdf] wkhtmltopdf failed:", err);
      return NextResponse.json(
        { success: false, error: "PDF generation failed" },
        { status: 500 },
      );
    }

    // ── 5. Read generated PDF and return ──────────────────────────────────
    const pdfBytes = await fs.readFile(tmpPdfPath);

    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type":        "application/pdf",
        "Content-Disposition": `attachment; filename="${outputFileName}"`,
        "Content-Length":      String(pdfBytes.byteLength),
      },
    });
  } catch (error) {
    console.error("[generate-pdf] unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "Unexpected error" },
      { status: 500 },
    );
  } finally {
    // ── 6. Cleanup tmp files ───────────────────────────────────────────────
    if (tmpHtmlPath) fs.unlink(tmpHtmlPath).catch(() => null);
    if (tmpPdfPath)  fs.unlink(tmpPdfPath).catch(() => null);
  }
}