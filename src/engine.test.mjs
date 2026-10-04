import {evaluate,replay,setLocked,submitOrder} from './engine.js';import assert from 'node:assert';
const now=new Date();now.setHours(14,0,0,0);const t=now.getTime();
const h=[-400,-700,-900].map((p,i)=>({t:t-(3-i)*40*6e4,size:5000,lev:2,pnl:p}));
const r=evaluate({size:15000,lev:10,src:'loan'},h,1e5,t);
assert(r.lock&&r.reasons.some(x=>x.k==='streak'),'Ramesh scenario must lock');
assert(!evaluate({size:5000,lev:2,src:'own'},[],1e5,t).lock,'calm order must not lock');
setLocked(true);assert.throws(()=>submitOrder({},[]),/IS_LOCKED/);setLocked(false);
const p=replay();assert(p.skip>0&&p.withS>p.without);console.log('ok',r.reasons.map(x=>x.k),p);
