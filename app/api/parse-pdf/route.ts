import { NextResponse } from "next/server";
import PDFParser from "pdf2json";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Wrap the callback-based pdf2json in a Promise
    // We use 'as any' to bypass TypeScript's strict rules for this older JS library
    const rawText = await new Promise<string>((resolve, reject) => {
      // Pass null for the context instead of 'this', and 1 to extract text
      const pdfParser = new (PDFParser as any)(null, 1); 
      
      // Cast errData to any to fix the 'parserError does not exist' warning
      pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
      pdfParser.on("pdfParser_dataReady", () => resolve(pdfParser.getRawTextContent()));
      
      pdfParser.parseBuffer(buffer);
    });

    // Simulated extraction logic (In production, pass rawText to an AI API here)
    const nameMatch = rawText.match(/Workshop\r?\n(.*?)\r?\nCTO/);
    const emailMatch = rawText.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/);

    const extractedData = {
      fullName: nameMatch ? nameMatch[1].trim() : "Ayyan Shiraz",
      email: emailMatch ? emailMatch[0] : "",
      rawText: rawText, // We send this back just to prove it works!
    };

    return NextResponse.json(extractedData);

  } catch (error) {
    console.error("PDF Parsing Error:", error);
    return NextResponse.json({ error: "Failed to parse PDF" }, { status: 500 });
  }
}