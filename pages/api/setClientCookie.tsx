import { setCookie, getCookie } from "cookies-next";
import { cryptoRandomStringAsync } from "crypto-random-string";

export default async function POST(req: any, res: any) {
  const string = await cryptoRandomStringAsync({ length: 17 });

  const cookie = await getCookie("ONESTABACIS", { req, res });
  // console.log(cookie);

  if (cookie !== undefined) {
    res.json({ msg: "exists", status: 200 });
  } else {
    setCookie("ONESTABACIS", string, { req, res, maxAge: 6000 * 60 * 24 });
    res.json({ msg: "AddCookie", status: 202 });
  }

  //   // const params = await req.json();
  //   try {
  //     let result = await fetch(`https://api.asari.pro/site/listing?id=${req.body.id}`, {
  //       method: "GET",
  //       cache: "no-store",
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //         SiteAuth: "68870:9f3vO7R8BLF4ra05tgO5cD38m41a6bLniXn0C4o5",
  //       },
  //     });

  //     const data = await result.json();
  //     console.log(data);

  //     res.json({ list: data });
  //   } catch (err) {
  //     console.log(err);
  //     res.json({ list: err, status: 400 });
  //   }
  res.json({ msg: "Działa" });
}
