export default async function GET(req: any, res: any) {
  // 84 / 15982 / OMS;

  try {
    let result = await fetch("https://api.asari.pro/site/listing?listingId=84/15982/OMS", {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "multipart/form-data",
        SiteAuth: "68870:9f3vO7R8BLF4ra05tgO5cD38m41a6bLniXn0C4o5",
      },
    });

    const data = await result.json();
    console.log(data);

    res.json({ list: data });
  } catch (err) {
    console.log(err);
    res.json({ list: err, status: 400 });
  }
}
