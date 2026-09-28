import assert from 'node:assert/strict';
const base=process.env.TEST_URL||'http://127.0.0.1:3000';
const paths=['/','/gutter-cleaning','/gutter-guards','/gutter-repair','/soft-wash','/membership','/realtors','/about','/contact','/lp/gutter-cleaning','/lp/gutter-guards','/lp/chaffee-new-home','/privacy','/sms'];
for(const path of paths){const r=await fetch(base+path);assert.equal(r.status,200,path);const html=await r.text();assert.equal((html.match(/<h1[ >]/g)||[]).length,1,path+' one h1');assert(html.includes('rel="canonical"'),path+' canonical');if(path.startsWith('/lp/'))assert(html.includes('noindex'),path+' noindex');}
assert.equal((await fetch(base+'/gutter-installation')).status,404);
assert.equal((await fetch(base+'/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'})).status,400);
const result=await fetch(base+'/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'Preview Test',phone:'4795550123',address:'123 Test Lane, Fort Smith, AR',date:'2026-12-01',service:'guards',stories:1,size:1})});
assert.equal(result.status,503,'Unconfigured delivery must fail clearly');
assert.equal((await result.json()).error,'Online requests are temporarily unavailable. Call (479) 492-4232.');
const sitemap=await (await fetch(base+'/sitemap.xml')).text();
for(const excluded of ['/lp/','/privacy','/sms'])assert(!sitemap.includes(excluded));
assert((await (await fetch(base+'/robots.txt')).text()).includes('Disallow: /lp/'));
console.log('Smoke checks passed: 14 pages, metadata, installation 404, invalid request and unconfigured delivery.');
