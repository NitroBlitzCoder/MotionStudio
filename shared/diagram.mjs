import {z} from 'zod';
const n=(min,max)=>z.number().finite().min(min).max(max);
export const shapeSchema=z.object({type:z.enum(['rectangle','ellipse','arrow','text']),x:n(0,1200),y:n(0,800),width:n(1,1200),height:n(1,800),x2:n(0,1200),y2:n(0,800),label:z.string().max(160),fill:z.string().regex(/^#[0-9a-f]{6}$/i),stroke:z.string().regex(/^#[0-9a-f]{6}$/i)}).superRefine((s,ctx)=>{if(s.type!=='arrow'&&(s.x+s.width>1200||s.y+s.height>800))ctx.addIssue({code:'custom',message:'Shape extends beyond artboard'})});
export const diagramSchema=z.object({explanation:z.string().max(1200),uncertainties:z.array(z.string().max(300)).max(10),shapes:z.array(shapeSchema).max(40)});
