import {diagramSchema} from '../shared/diagram.mjs';
const coordinate=(max)=>({type:'number',minimum:0,maximum:max});
export const outputSchema={type:'object',properties:{explanation:{type:'string'},uncertainties:{type:'array',items:{type:'string'},maxItems:10},shapes:{type:'array',maxItems:40,items:{type:'object',properties:{type:{type:'string',enum:['rectangle','ellipse','arrow','text']},x:coordinate(1200),y:coordinate(800),width:coordinate(1200),height:coordinate(800),x2:coordinate(1200),y2:coordinate(800),label:{type:'string'},fill:{type:'string',description:'Six-digit hex RGB, such as #ffffff'},stroke:{type:'string',description:'Six-digit hex RGB, such as #171c2c'}},required:['type','x','y','width','height','x2','y2','label','fill','stroke']}}},required:['explanation','uncertainties','shapes']};
const number=v=>typeof v==='string'&&v.trim()!==''?Number(v):v;
const color=v=>typeof v==='string'&&/^#[a-f\d]{3}$/i.test(v)?'#'+v.slice(1).split('').map(c=>c+c).join(''):v;
/** Normalize representation and bounds only; never invent labels or connections. */
export function normalizeDiagram(input){
 if(!input||typeof input!=='object'||!Array.isArray(input.shapes))return diagramSchema.parse(input);
 let adjusted=false;
 const shapes=input.shapes.map(raw=>{
  if(!raw||typeof raw!=='object')return raw;
  const s={...raw};for(const k of ['x','y','width','height','x2','y2'])if(s[k]!==undefined)s[k]=number(s[k]);
  s.fill=color(s.fill);s.stroke=color(s.stroke);
  if(s.type!=='arrow'){s.x2=0;s.y2=0}
  else if([s.x,s.y,s.x2,s.y2].every(Number.isFinite)){s.width=Math.max(1,Math.min(1200,Math.abs(s.x2-s.x)));s.height=Math.max(1,Math.min(800,Math.abs(s.y2-s.y)))}
  if([s.x,s.y,s.width,s.height].every(Number.isFinite)){
   // Reject implausible coordinate systems; tolerate modest overflow/rounding.
   if(s.x>=-120&&s.x<=1320&&s.y>=-80&&s.y<=880&&s.width>=0&&s.width<=1320&&s.height>=0&&s.height<=880){
    const before=[s.x,s.y,s.width,s.height].join(',');
    s.width=Math.max(1,Math.min(1200,s.width));s.height=Math.max(1,Math.min(800,s.height));
    s.x=Math.max(0,Math.min(s.type==='arrow'?1200:1200-s.width,s.x));s.y=Math.max(0,Math.min(s.type==='arrow'?800:800-s.height,s.y));
    if(before!==[s.x,s.y,s.width,s.height].join(','))adjusted=true;
   }
  }
  if(s.type==='arrow'){for(const [k,max] of [['x2',1200],['y2',800]])if(Number.isFinite(s[k])&&s[k]>=-max*.1&&s[k]<=max*1.1){const v=Math.max(0,Math.min(max,s[k]));if(v!==s[k])adjusted=true;s[k]=v}}
  return s;
 });
 const normalized={...input,uncertainties:input.uncertainties??[],shapes};
 const result=diagramSchema.parse(normalized);
 if(adjusted)result.uncertainties=[...result.uncertainties.slice(0,9),'Some geometry was adjusted to fit the artboard. Review object placement before applying.'];
 return result;
}
export function validationSummary(error){return error?.issues?.slice(0,4).map(i=>`${i.path.join('.')}: ${i.message}`).join('; ')||'Invalid diagram JSON';}
