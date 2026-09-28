import assert from 'node:assert/strict';
import {deliverLead} from '../lib/lead-delivery.ts';
const config={webhook:'https://crm.example.test',resendKey:'test-only',from:'test@example.test',to:'owner@example.test'};
for(const [crm,email,accepted] of [[200,200,true],[500,200,true],[200,500,true],[500,500,false]] as const){
 const seen:string[]=[];
 const send=(async(url:Parameters<typeof fetch>[0])=>{seen.push(String(url));return new Response('',{status:String(url).includes('resend')?email:crm})}) as typeof fetch;
 const result=await deliverLead({id:'test',name:'Test'},config,send);assert.equal(result.delivered,accepted);assert.equal(seen.length,2,'both delivery channels must be attempted');
}
assert.equal((await deliverLead({}, {from:'',to:''})).delivered,false);
const send=(async(url:Parameters<typeof fetch>[0])=>{if(String(url).includes('crm'))throw new Error('network');return new Response('{}',{status:200})}) as typeof fetch;
assert.equal((await deliverLead({id:'test'},config,send)).delivered,true);
console.log('Delivery checks passed: both channels, either failure, network error, no configuration. No real messages sent.');
