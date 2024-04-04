import fs from "fs";

export default async function POST(req, res, properties) {
  fs.writeFileSync("./public/properties.json", JSON.stringify(req.body.properties));
  res.json(200);
}
