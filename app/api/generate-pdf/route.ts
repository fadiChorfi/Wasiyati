import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import puppeteer from "puppeteer";

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
  templateName?: string;
  outputFileName?: string;
  fields?: WillFields;
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fillTemplate(html: string, fields: WillFields): string {
  let filled = html;

  for (const [key, value] of Object.entries(fields)) {
    const safe = escapeHtml(value == null ? "" : String(value));
    filled = filled.replaceAll(`{{${key}}}`, safe);
  }

  filled = filled.replace(/\{\{[^}]+\}\}/g, "");
  return filled;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as GenerateHtmlPdfBody;
    const fields = body.fields ?? {};
    const templateName = body.templateName ?? "general-will.html";
    const outputFileName = body.outputFileName ?? "will.pdf";

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

    const filledHtml = fillTemplate(templateHtml, fields);

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(filledHtml, { waitUntil: "load" });
      await page.emulateMediaType("print");

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "18mm", bottom: "18mm", left: "16mm", right: "16mm" },
      });

      return new NextResponse(Buffer.from(pdfBuffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${outputFileName}"`,
          "Content-Length": String(pdfBuffer.byteLength),
        },
      });
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error("[generate-pdf] unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "PDF generation failed" },
      { status: 500 },
    );
  }
}
