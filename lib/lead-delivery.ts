export async function deliverLead(lead:Record<string,unknown>,config:{webhook?:string;webhookSecret?:string;resendKey?:string;from:string;to:string},send:typeof fetch=fetch){
 const requests:Promise<Response>[]=[];
 if(config.webhook)requests.push(send(config.webhook,{method:'POST',headers:{'Content-Type':'application/json',...(config.webhookSecret?{Authorization:`Bearer ${config.webhookSecret}`}:{})},body:JSON.stringify(lead),signal:AbortSignal.timeout(10000)}));
 if(config.resendKey)requests.push(send('https://api.resend.com/emails',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${config.resendKey}`,'Idempotency-Key':`lead-${lead.id}`},body:JSON.stringify({from:config.from,to:[config.to],subject:'New Chaffee Exteriors service request',text:Object.entries(lead).map(([key,value])=>`${key}: ${typeof value==='object'?JSON.stringify(value):value}`).join('\n')}),signal:AbortSignal.timeout(10000)}));
 const results=await Promise.allSettled(requests);
 return {delivered:results.some(r=>r.status==='fulfilled'&&r.value.ok),attempted:results.length,failed:results.filter(r=>r.status==='rejected'||!r.value.ok).length};
}
