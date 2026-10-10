export async function api(path:string,body?:unknown){const r=await fetch('/api/'+path,body===undefined?{}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok){const e=await r.json().catch(()=>({error:r.statusText}));throw new Error(e.error||'Request failed')}return r.json()}
export type Event={id:string;time:string;kind:string;value:number|null};
export const session=crypto.randomUUID();
let queue:Event[]=[];
export function event(kind:string,value:number|null=null){queue.push({id:crypto.randomUUID(),time:new Date().toISOString(),kind,value});if(queue.length>2000)queue.shift()}
let flushing=false;
export async function flush(){if(flushing||!queue.length)return;flushing=true;const batch=queue.slice(0,100);try{await api('events',{session,events:batch});queue.splice(0,batch.length)}finally{flushing=false}}
