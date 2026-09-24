const assert = require('node:assert/strict');
const base = process.env.SEO_BASE_URL || 'http://localhost:3101';
async function get(path, status = 200) {
 const r = await fetch(base + path, { redirect: 'manual' });
 assert.equal(r.status, status, path);
 const html = await r.text();
 const data = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s);
 return { r, html, props: data && JSON.parse(data[1]).props.pageProps };
}
(async () => {
 const paths = ['/nieruchomosci/hiszpania','/nieruchomosci/hiszpania/apartments','/nieruchomosci/hiszpania/costa-blanca','/nieruchomosci/hiszpania/costa-blanca/apartments','/nieruchomosci/hiszpania/costa-del-sol/houses','/nieruchomosci/hiszpania/costa-calida/villas','/nieruchomosci/hiszpania/costa-de-almeria','/nieruchomosci/cypr','/en/properties/spain/costa-blanca/apartments'];
 for (const path of paths) {
  const { html, props } = await get(path);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
  assert.ok(html.includes(`rel="canonical" href="https://onesta.com.pl${path}"`));
  assert.ok(html.includes('name="robots" content="index, follow"'));
  if(path.endsWith('/apartments')) assert.ok(props.properties.every(p => p.type.toLowerCase() === 'apartment'));
 }
 const filtered = await get('/nieruchomosci/hiszpania/costa-blanca/apartments?beds=2&pool=true&maxPrice=400000&page=2');
 assert.ok(filtered.props.properties.every(p => p.beds === 2 && p.pool && p.price <= 400000));
 assert.ok(filtered.html.includes('rel="canonical" href="https://onesta.com.pl/nieruchomosci/hiszpania/costa-blanca/apartments?page=2"'));
 assert.ok(filtered.html.includes('name="robots" content="noindex, follow"'));
 for (const source of ['/properties?country=Spain&region=Costa+Blanca&type=Apartment&beds=2','/properties/spain?region=Costa+Blanca&type=Apartment&beds=2','/nieruchomosci/hiszpania?region=Costa+Blanca&type=Apartment&beds=2','/en/properties/hiszpania/costa-blanca?type=Apartment&beds=2']) {
  const { r } = await get(source, 308);
  const destination = r.headers.get('location');
  assert.equal(destination, source.startsWith('/en') ? '/en/properties/spain/costa-blanca/apartments?beds=2' : '/nieruchomosci/hiszpania/costa-blanca/apartments?beds=2');
  await get(destination);
 }
 await get('/nieruchomosci/hiszpania/unknown', 404);
 await get('/nieruchomosci/hiszpania/quad-houses', 404);
 await get('/nieruchomosci/hiszpania/costa-blanca/torrevieja');
 const { html } = await get('/nieruchomosci/hiszpania');
 const detail = html.match(/href="([^"]*\?id=[^"]*)"/)[1].replaceAll('&amp;','&');
 await get(detail);
 console.log('PASS: 9 clean routes, real filtered data, 308 compatibility, 404, canonical, robots, legacy city and property detail.');
})().catch(error => { console.error(error); process.exitCode = 1; });
