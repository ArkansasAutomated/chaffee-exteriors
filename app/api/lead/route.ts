import {NextResponse} from 'next/server';
import {estimate,serviceNames,type Service} from '@/lib/pricing';
import {deliverLead} from '@/lib/lead-delivery';
import {site} from '@/lib/site.config';

type Result={status:number;error?:string;id?:string};

const SITE_HOST=new URL(site.url).host;
const ALLOWED_HOSTS=new Set([SITE_HOST,`www.${SITE_HOST}`]);

function originAllowed(request:Request){
 const origin=request.headers.get('origin');
 if(!origin||origin==='null')return true; // same-origin form posts from some browsers send no Origin
 let host:string;try{host=new URL(origin).host}catch{return false}
 const requestHost=request.headers.get('x-forwarded-host')||request.headers.get('host');
 if(host===requestHost||ALLOWED_HOSTS.has(host))return true;
 if(host.endsWith('.vercel.app'))return true; // Vercel preview + production aliases
 return process.env.NODE_ENV!=='production'&&/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host);
}

async function handle(body:Record<string,any>):Promise<Result>{
 if(body.website)return {status:400,error:'Unable to accept this request.'};
 const valid=(v:unknown,max:number,min=1)=>typeof v==='string'&&v.trim().length>=min&&v.length<=max;
 if(!valid(body.name,100,2)||!valid(body.address,250,8)||!valid(body.phone,20)||body.phone.replace(/\D/g,'').length!==10||!Object.hasOwn(serviceNames,body.service)||!Number.isInteger(body.stories)||body.stories<1||body.stories>3||!Number.isInteger(body.size)||body.size<0||body.size>3||!/^\d{4}-\d{2}-\d{2}$/.test(body.date)||!Number.isFinite(Date.parse(body.date)))return {status:400,error:'Check your name, address, ten-digit phone number, and preferred date.'};
 const webhook=process.env.LEAD_WEBHOOK_URL,resendKey=process.env.RESEND_API_KEY,secret=process.env.TURNSTILE_SECRET_KEY;
 const unavailable=`Online requests are temporarily unavailable. Call ${site.PHONE_MAIN}.`;
 if((!webhook&&!resendKey)||!secret)return {status:503,error:unavailable};
 try{
  if(!valid(body.turnstileToken,2048))return {status:400,error:'Please complete the security check.'};
  const check=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret,response:body.turnstileToken}),signal:AbortSignal.timeout(8000)});const verified=await check.json();if(!verified.success)return {status:400,error:'Security check expired. Please try again.'};
  const utm=Object.fromEntries(['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].filter(k=>valid(body.utm?.[k],200)).map(k=>[k,body.utm[k]]));
  const intent=['service','membership','commercial','new-home'].includes(body.intent)?body.intent:'service';
  const lead={intent,id:crypto.randomUUID(),createdAt:new Date().toISOString(),name:body.name.trim(),phone:body.phone.replace(/\D/g,''),address:body.address.trim(),date:body.date,service:body.service as Service,stories:body.stories,size:body.size,estimate:intent==='service'?estimate(body.service,body.stories,body.size,site.LICENSED):null,smsConsent:body.smsConsent===true,consentVersion:'2026-09-28',source:valid(body.source,1000)?body.source:site.url,utm,gutters:['Yes','Some','No'].includes(body.gutters)?body.gutters:undefined};
  const delivery=await deliverLead(lead,{webhook,webhookSecret:process.env.LEAD_WEBHOOK_SECRET,resendKey,from:process.env.RESEND_FROM||site.RESEND_FROM,to:site.EMAIL});
  if(!delivery.delivered)throw new Error('Delivery failed');
  if(delivery.failed)console.error('Lead delivery channel failed; alternate channel accepted the lead.',{id:lead.id});
  return {status:200,id:lead.id};
 }catch{return {status:502,error:unavailable}}
}

const esc=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));

// Plain HTML response for browsers that submitted the form without JavaScript.
function page(result:Result){
 const ok=result.status===200;
 const heading=ok?'Got it. We’ll be in touch shortly.':'We couldn’t send that request.';
 const text=ok?'Need us sooner? Call us.':`${result.error||'Please try again.'}`;
 const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${ok?'Request received':'Request not sent'} | ${site.name}</title><style>body{margin:0;font-family:system-ui,sans-serif;background:#f7f6ef;color:#172d35;display:grid;place-items:center;min-height:100vh;padding:24px}main{max-width:520px}h1{font-size:32px;line-height:1.1}a.b{display:inline-block;background:#bf4824;color:#fff;padding:16px 22px;text-decoration:none;font-weight:700;margin:8px 12px 0 0}a{color:#42695b}</style></head><body><main><h1>${esc(heading)}</h1><p>${esc(text)}</p><a class="b" href="${site.PHONE_HREF}">Call ${site.PHONE_MAIN}</a><a href="/">Back to ${site.name}</a></main></body></html>`;
 return new Response(html,{status:result.status,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});
}

export async function POST(request:Request){
 if(Number(request.headers.get('content-length'))>12000)return NextResponse.json({error:'Request too large.'},{status:413});
 if(!originAllowed(request))return NextResponse.json({error:'Invalid origin.'},{status:403});
 const type=request.headers.get('content-type')||'';
 const isForm=type.includes('application/x-www-form-urlencoded')||type.includes('multipart/form-data');
 let body:Record<string,any>;
 try{
  if(isForm){
   const f=await request.formData();
   const get=(k:string)=>{const v=f.get(k);return typeof v==='string'?v:undefined};
   body={name:get('name'),phone:get('phone'),address:get('address'),date:get('date'),service:get('service')||'cleaning',stories:Number(get('stories')||1),size:Number(get('size')||0),intent:get('intent'),gutters:get('gutters'),website:get('website'),smsConsent:get('smsConsent')==='on',turnstileToken:get('cf-turnstile-response'),source:request.headers.get('referer')||undefined};
  }else{
   const raw=await request.text();if(raw.length>12000)return NextResponse.json({error:'Request too large.'},{status:413});
   body=JSON.parse(raw);
  }
 }catch{return isForm?page({status:400,error:'Invalid request.'}):NextResponse.json({error:'Invalid request.'},{status:400})}
 if(!body||typeof body!=='object'||Array.isArray(body))return NextResponse.json({error:'Invalid request.'},{status:400});
 const result=await handle(body);
 if(isForm)return page(result);
 return result.status===200?NextResponse.json({ok:true,id:result.id}):NextResponse.json({error:result.error},{status:result.status});
}
