// Encrypted local store: PBKDF2(PIN) -> AES-GCM key (non-extractable). Nothing leaves the browser.
const en=new TextEncoder(),de=new TextDecoder();
const b64=b=>btoa(String.fromCharCode(...new Uint8Array(b))),ub=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
let key=null;export const EMPTY={h:[],j:[],m:{locks:0,cancel:0,proceed:0,jl:0},g:null};
export async function unlock(pin){let s=localStorage.getItem('sk_salt');
  if(!s){s=b64(crypto.getRandomValues(new Uint8Array(16)));localStorage.setItem('sk_salt',s)}
  const km=await crypto.subtle.importKey('raw',en.encode(pin),'PBKDF2',false,['deriveKey']);
  key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:ub(s),iterations:150000,hash:'SHA-256'},km,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
  try{return await load()}catch{key=null;return null}}
async function load(){const v=localStorage.getItem('sk_log');if(!v)return structuredClone(EMPTY);const[i,c]=v.split('.');
  return JSON.parse(de.decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:ub(i)},key,ub(c))))}
export async function save(d){const iv=crypto.getRandomValues(new Uint8Array(12));
  localStorage.setItem('sk_log',b64(iv)+'.'+b64(await crypto.subtle.encrypt({name:'AES-GCM',iv},key,en.encode(JSON.stringify(d)))))}
export const wipe=()=>{localStorage.removeItem('sk_log');localStorage.removeItem('sk_salt');key=null};
