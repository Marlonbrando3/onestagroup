import fs from "fs";

export default async function POST(req: any, res: any, properties: any) {
  fs.writeFileSync("./public/properties.json", JSON.stringify(req.body.properties));
  res.json(200);
}
