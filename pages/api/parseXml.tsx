import { XMLParser } from "fast-xml-parser";
import fs from "fs";

async function runImport() {
  const response = await fetch(
    "https://spain.metainmo.com/storage/feeds/kyero/390f186f-fc8e-4098-8a1c-4e19fb65a325.xml",
  );

  if (!response.ok) {
    throw new Error("TWOJA STARA");
  }

  const xmlData = await response.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
  });

  const parsed = parser.parse(xmlData);

  fs.writeFileSync("parsed-output.json", JSON.stringify(parsed, null, 2));
}

// runImport();
