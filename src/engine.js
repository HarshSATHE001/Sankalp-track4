// SANKALP safety engine. Rules are the authority; the anomaly score can only nudge, never lock or unlock.
export const T={streak:3,cumLoss:5,maxLev:5,sizeX:2,burstN:3,burstMin:30,night:[23,5],cool:60}; // provisional thresholds (X, Y)
let locked=false;export const setLocked=v=>{locked=v};export const isLocked=()=>locked;
// IS_LOCKED enforcement: the only path to "place an order" throws while locked.
export function submitOrder(o,h){if(locked)throw new Error('BLOCKED: IS_LOCKED');return[...h,o]}
export function evaluate(o,h,cap,now=Date.now(),t=T){
  const R=[],last=h[h.length-1];
  if(h.length>=t.streak&&h.slice(-t.streak).every(x=>x.pnl<0))R.push({k:'streak',v:t.streak});
  const lp=-h.slice(-5).reduce((a,x)=>a+Math.min(0,x.pnl),0)/cap*100;
  if(lp>t.cumLoss)R.push({k:'cum',v:lp.toFixed(1)});
  if(o.lev>t.maxLev)R.push({k:'lev',v:o.lev});
  const avg=h.length?h.reduce((a,x)=>a+x.size,0)/h.length:0;
  if(last&&last.pnl<0&&avg&&o.size>t.sizeX*avg)R.push({k:'size',v:(o.size/avg).toFixed(1)});
  const rc=h.filter(x=>now-x.t<t.burstMin*6e4).length;
  if(rc>=t.burstN)R.push({k:'burst',v:rc});
  const hr=new Date(now).getHours();
  if(hr>=t.night[0]||hr<t.night[1])R.push({k:'night',v:hr});
  const risky=o.src&&o.src!=='own';
  const score=R.length+(risky&&R.length?1:0);
  if(risky&&R.length)R.push({k:'src',v:o.src});
  let z=0;if(h.length>=4){const m=avg,sd=Math.sqrt(h.reduce((a,x)=>a+(x.size-m)**2,0)/h.length)||1;z=(o.size-m)/sd}
  return{lock:score>=2,reasons:R,score,nudge:z>2,z:+z.toFixed(1)}; // precision over recall: lock needs score>=2
}
const S=[[5000,2,-300],[5000,2,-450],[6000,2,-500],[12000,8,-1800],[15000,10,-2400],[20000,10,-3500],[5000,2,200],[5000,2,300],[18000,10,-2000]];
export function replay(cap=100000){ // scripted practice session; assumes the user cancels a locked trade
  const b=new Date();b.setHours(10,0,0,0);const h1=[],h2=[];let skip=0,imp=0;
  S.forEach(([size,lev,pnl],i)=>{const t=b.getTime()+i*40*6e4,o={size,lev,pnl,t,src:pnl<-1000?'loan':'own'};
    h1.push(o);if(i>2&&size>=12000)imp++;const r=evaluate(o,h2,cap,t);if(r.lock)skip++;else h2.push(o)});
  const s=a=>a.reduce((x,y)=>x+y.pnl,0);
  return{n:S.length,imp,skip,without:s(h1),withS:s(h2)}}
export const PRESETS={gentle:{...T,streak:4,maxLev:8,sizeX:3,burstN:4},balanced:{...T},strict:{...T,streak:2,maxLev:3,sizeX:1.5,burstN:2}};
