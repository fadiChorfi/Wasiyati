import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error:
        "PDF generation is now handled client-side. Use the browser's print feature.",
    },
    { status: 501 },
  );
}
