import prices from './pricing.json' with {type:'json'};
export const serviceNames = {cleaning:'Gutter cleaning',guards:'Gutter guards',house:'House soft wash',roof:'Roof soft wash',repair:'Gutter repair'};
export type Service = keyof typeof serviceNames;
export function estimate(service:Service,stories:number,size:number,licensed=false):{low:number|null;high:number|null;custom:boolean}{
 const custom={low:null,high:null,custom:true};
 if(!Object.hasOwn(serviceNames,service)||!Number.isInteger(stories)||stories<1||stories>3||!Number.isInteger(size)||size<0||size>3)return custom;
 if(service==='repair'||service==='roof'&&stories===3)return custom;
 const base=service==='guards'?Math.max(prices.guards.minimum,prices.guards.perFoot[stories-1]*prices.linearFeet[size]):prices[service as 'cleaning'|'house'|'roof'][stories-1][size];
 const minimum=service==='guards'?prices.guards.minimum:service==='cleaning'?149:service==='house'?299:399;
 const low=Math.max(minimum,Math.round(base*.9)),high=Math.round(base*1.1);
 return !licensed&&high>1999?custom:{low,high,custom:false};
}
