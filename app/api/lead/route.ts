import {NextResponse} from 'next/server';
import {estimate,serviceNames,type Service} from '@/lib/pricing';
import {deliverLead} from '@/lib/lead-delivery';
import {site} from '@/lib/site.config';
export async function POST(request:Request){
 if(Number(request.headers.get('content-length'))>12000)return NextResponse.json({error:'Request too large.'},{status:413});
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin&&origin!==site.url)return NextResponse.json({error:'Invalid origin.'},{status:403});
 let body;try{const raw=await request.text();if(raw.length>12000)return NextResponse.json({error:'Request too large.'},{status:413});body=JSON.parse(raw)}catch{return NextResponse.json({error:'Invalid request.'},{status:400})}
 if(!body||typeof body!=='object'||Array.isArray(body))return NextResponse.json({error:'Invalid request.'},{status:400});
 if(body.website)return NextResponse.json({error:'Unable to accept this request.'},{status:400});
 const valid=(v:unknown,max:number,min=1)=>typeof v==='string'&&v.trim().length>=min&&v.length<=max;
 if(!valid(body.name,100,2)||!valid(body.address,250,8)||!valid(body.phone,20)||body.phone.replace(/\D/g,'').length!==10||!Object.hasOwn(serviceNames,body.service)||!Number.isInteger(body.stories)||body.stories<1||body.stories>3||!Number.isInteger(body.size)||body.size<0||body.size>3||!/^\d{4}-\d{2}-\d{2}$/.test(body.date)||!Number.isFinite(Date.parse(body.date)))return NextResponse.json({error:'Check your name, address, ten-digit phone number, and preferred date.'},{status:400});
 const webhook=process.env.LEAD_WEBHOOK_URL,resendKey=process.env.RESEND_API_KEY,secret=process.env.TURNSTILE_SECRET_KEY;
 const unavailable=`Online requests are temporarily unavailable. Call ${site.PHONE_MAIN}.`;
 if((!webhook&&!resendKey)||!secret)return NextResponse.json({error:unavailable},{status:503});
 try{
 if(!valid(body.turnstileToken,2048))return NextResponse.json({error:'Please complete the security check.'},{status:400});
 const check=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret,response:body.turnstileToken}),signal:AbortSignal.timeout(8000)});const verified=await check.json();if(!verified.success)return NextResponse.json({error:'Security check expired. Please try again.'},{status:400});
 const utm=Object.fromEntries(['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].filter(k=>valid(body.utm?.[k],200)).map(k=>[k,body.utm[k]]));
 const intent=['service','membership','commercial','new-home'].includes(body.intent)?body.intent:'service';
 const lead={intent,id:crypto.randomUUID(),createdAt:new Date().toISOString(),name:body.name.trim(),phone:body.phone.replace(/\D/g,''),address:body.address.trim(),date:body.date,service:body.service as Service,stories:body.stories,size:body.size,estimate:intent==='service'?estimate(body.service,body.stories,body.size,site.LICENSED):null,smsConsent:body.smsConsent===true,consentVersion:'2026-09-28',source:valid(body.source,1000)?body.source:site.url,utm,gutters:['Yes','Some','No'].includes(body.gutters)?body.gutters:undefined};
 const delivery=await deliverLead(lead,{webhook,webhookSecret:process.env.LEAD_WEBHOOK_SECRET,resendKey,from:process.env.RESEND_FROM||site.RESEND_FROM,to:site.EMAIL});
 if(!delivery.delivered)throw new Error('Delivery failed');
 if(delivery.failed)console.error('Lead delivery channel failed; alternate channel accepted the lead.',{id:lead.id});
 return NextResponse.json({ok:true,id:lead.id});
 }catch{return NextResponse.json({error:unavailable},{status:502})}
}
