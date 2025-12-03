import { NextResponse } from "next/server";
import {
  TextractClient,
  AnalyzeDocumentCommand,
} from "@aws-sdk/client-textract";


const textract = new TextractClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});


export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (file.type === "text/plain") {
  // Handle plain text file manually
  const text = await file.text();

  // Example: parse key=value pairs
  const keyValuePairs: Record<string, string> = {};
  text.split(/\r?\n/).forEach(line => {
    const [key, value] = line.split("=").map(s => s?.trim());
    if (key && value) keyValuePairs[key] = value;
  });

  return NextResponse.json({ success: true, keyValuePairs });
}


    const bytes = Buffer.from(await file.arrayBuffer());

    const command = new AnalyzeDocumentCommand({
      Document: { Bytes: bytes },
      FeatureTypes: ["FORMS"], 
    });

    const response = await textract.send(command);
    const blocks = response.Blocks || [];

    const keyMap: Record<string, any> = {};
    const valueMap: Record<string, any> = {};
    const keyValuePairs: Record<string, string> = {};

    for (const block of blocks) {
      if (block.BlockType === "KEY_VALUE_SET") {
        if (block.EntityTypes?.includes("KEY")) keyMap[block.Id!] = block;
        else valueMap[block.Id!] = block;
      }
    }

    for (const keyId in keyMap) {
      const keyBlock = keyMap[keyId];
      const valueId =
        keyBlock.Relationships?.find((r: any) => r.Type === "VALUE")?.Ids?.[0];
      const valueBlock = valueMap[valueId || ""];

      const keyText = getText(keyBlock, blocks);
      const valueText = getText(valueBlock, blocks);

      if (keyText && valueText) {
        keyValuePairs[keyText] = valueText;
      }
    }
    console.log(keyValuePairs)
    return NextResponse.json({ success: true, keyValuePairs });
  } catch (err: any) {
    console.error("Textract error:", err);
    return NextResponse.json(
      { error: err.message ?? "Textract failed" },
      { status: 500 }
    );
  }
}

function getText(block: any, allBlocks: any[]) {
  if (!block?.Relationships) return "";
  let text = "";
  for (const rel of block.Relationships) {
    if (rel.Type === "CHILD") {
      for (const id of rel.Ids || []) {
        const word = allBlocks.find((b) => b.Id === id);
        if (word?.BlockType === "WORD") text += word.Text + " ";
      }
    }
  }
  return text.trim();
}
