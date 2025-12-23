import fs from "fs";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Możesz zwiększyć do większej wartości, np. '50mb'
    },
  },
};

export default async function POST(req: any, res: any, properties: any) {
  fs.writeFileSync("./public/properties.json", JSON.stringify(req.body.properties));
  res.json(200);
}
