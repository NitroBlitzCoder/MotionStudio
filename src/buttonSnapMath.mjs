/** Coordinates and radii use CSS pixels, independent of canvas resolution. */
export const SNAP={capture:16,release:40,dwell:70,cooldown:180};
export function emptySnap(cooldownUntil=0){return {locked:null,candidate:null,since:0,cooldownUntil}}
export function stepSnap(state,point,targets,now,allowAcquire=true){
 const distance=t=>Math.hypot(point.x-t.x,point.y-t.y);
 if(state.locked!==null){const t=targets.find(t=>t.id===state.locked);if(t&&distance(t)<=SNAP.release)return {state,point:{x:t.x,y:t.y},target:t.id};return {state:emptySnap(now+SNAP.cooldown),point,target:null}}
 if(!allowAcquire||now<state.cooldownUntil)return {state:{...state,candidate:null,since:0},point,target:null};
 const t=targets.filter(t=>distance(t)<=Math.min(SNAP.capture,t.radius??SNAP.capture)).sort((a,b)=>distance(a)-distance(b))[0];
 if(!t)return {state:{...state,candidate:null,since:0},point,target:null};
 if(state.candidate!==t.id)return {state:{...state,candidate:t.id,since:now},point,target:null};
 if(now-state.since<SNAP.dwell)return {state,point,target:null};
 return {state:{...state,locked:t.id,candidate:null},point:{x:t.x,y:t.y},target:t.id};
}
