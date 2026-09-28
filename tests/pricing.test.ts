import assert from 'node:assert/strict';
import {estimate,serviceNames} from '../lib/pricing.ts';
for(const service of Object.keys(serviceNames) as (keyof typeof serviceNames)[])for(let stories=1;stories<=3;stories++)for(let size=0;size<4;size++){
 const result=estimate(service,stories,size);assert(result.custom?result.low===null&&result.high===null:result.low!<=result.high!&&result.high!<=1999);
}
assert.deepEqual(estimate('guards',1,1),{low:null,high:null,custom:true});
assert.equal(estimate('guards',1,1,true).high,2112);
assert.equal(estimate('roof',3,0).custom,true);
assert.equal(estimate('cleaning',0,0).custom,true);
assert.deepEqual(estimate('cleaning',1,0),{low:149,high:164,custom:false});
console.log('Pricing checks passed: all services, sizes, floors, cap and flag behavior.');
