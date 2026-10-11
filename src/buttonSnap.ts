import {emptySnap,stepSnap} from './buttonSnapMath.mjs';
import type {Point} from './model';
/** Only real, enabled, visible, unobstructed HTML buttons are eligible. */
export function createButtonSnap(){
 let state=emptySnap();let marked:HTMLButtonElement|null=null;let counter=0;
 const ids=new WeakMap<HTMLButtonElement,number>();
 function mark(button:HTMLButtonElement|null){if(marked!==button){marked?.classList.remove('left-hand-locked');button?.classList.add('left-hand-locked');marked=button}}
 function reset(){state=emptySnap();mark(null)}
 function update(point:Point,now:number,allowAcquire:boolean){
  const nodes=new Map<number,HTMLButtonElement>();
  const targets=[...document.querySelectorAll<HTMLButtonElement>('button')].flatMap(button=>{
   if(button.disabled||button.closest('[inert]')||button.getAttribute('aria-disabled')==='true')return [];
   const r=button.getBoundingClientRect(),css=getComputedStyle(button);
   if(r.width<1||r.height<1||css.visibility!=='visible'||Number(css.opacity)===0)return [];
   const x=r.left+r.width/2,y=r.top+r.height/2;
   if(x<0||x>innerWidth||y<0||y>innerHeight)return [];
   const top=document.elementFromPoint(x,y);if(!top||!button.contains(top))return [];
   let id=ids.get(button);if(id===undefined){id=counter++;ids.set(button,id)}nodes.set(id,button);
   return [{id,x,y,radius:Math.min(16,Math.min(r.width,r.height)/2+3)}];
  });
  const result=stepSnap(state,point,targets,now,allowAcquire);state=result.state;
  const button=result.target===null?null:nodes.get(result.target)??null;mark(button);
  return {point:result.point,button};
 }
 return {update,reset};
}
