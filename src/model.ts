import {z} from 'zod';
export const W=1200,H=800;
export const tools=['pen','brush','marker','eraser'] as const;
export type Tool=typeof tools[number];
export type Point={x:number;y:number};
const point=z.object({x:z.number().finite().min(-100).max(W+100),y:z.number().finite().min(-100).max(H+100)});
export const projectSchema=z.object({version:z.literal(1),background:z.string().regex(/^#[0-9a-f]{6}$/i),strokes:z.array(z.object({tool:z.enum(tools),color:z.string().regex(/^#[0-9a-f]{6}$/i),size:z.number().min(1).max(120),opacity:z.number().min(0).max(1),points:z.array(point).max(100000)})).max(10000),photo:z.object({src:z.string().max(14000000).regex(/^data:image\/(png|jpeg|webp);base64,/),x:z.number().finite().min(-5000).max(5000),y:z.number().finite().min(-5000).max(5000),scale:z.number().min(.05).max(5),rotation:z.number().min(-180).max(180),brightness:z.number().min(0).max(200),contrast:z.number().min(0).max(200),saturation:z.number().min(0).max(200),visible:z.boolean()}).nullable(),inkVisible:z.boolean()});
export type Project=z.infer<typeof projectSchema>;
export type Stroke=Project['strokes'][number];
export const blank=():Project=>({version:1,background:'#ffffff',strokes:[],photo:null,inkVisible:true});
const images=new Map<string,HTMLImageElement>();
export function preload(src:string){return new Promise<HTMLImageElement>((resolve,reject)=>{const old=images.get(src);if(old)return resolve(old);const im=new Image();im.onload=()=>{images.set(src,im);resolve(im)};im.onerror=()=>reject(new Error('Unable to decode image'));im.src=src})}
export function render(canvas:HTMLCanvasElement,p:Project,draft?:Stroke|null){
 const c=canvas.getContext('2d')!;c.clearRect(0,0,W,H);c.fillStyle=p.background;c.fillRect(0,0,W,H);
 const ph=p.photo,im=ph&&images.get(ph.src);if(ph?.visible&&im){c.save();c.translate(W/2+ph.x,H/2+ph.y);c.rotate(ph.rotation*Math.PI/180);c.filter=`brightness(${ph.brightness}%) contrast(${ph.contrast}%) saturate(${ph.saturation}%)`;const s=Math.min(W/im.width,H/im.height)*ph.scale;c.drawImage(im,-im.width*s/2,-im.height*s/2,im.width*s,im.height*s);c.restore()}
 if(!p.inkVisible)return;
 const ink=document.createElement('canvas');ink.width=W;ink.height=H;const g=ink.getContext('2d')!;
 for(const s of [...p.strokes,...(draft?[draft]:[])]){if(!s.points.length)continue;g.save();g.globalCompositeOperation=s.tool==='eraser'?'destination-out':'source-over';g.globalAlpha=s.opacity*(s.tool==='marker'?.35:1);g.strokeStyle=s.color;g.fillStyle=s.color;g.lineWidth=s.size;g.lineJoin='round';g.lineCap='round';if(s.tool==='brush'){g.shadowColor=s.color;g.shadowBlur=s.size/6}g.beginPath();g.moveTo(s.points[0].x,s.points[0].y);for(const pt of s.points.slice(1))g.lineTo(pt.x,pt.y);if(s.points.length===1){g.arc(s.points[0].x,s.points[0].y,s.size/2,0,Math.PI*2);g.fill()}else g.stroke();g.restore()}
 c.drawImage(ink,0,0);
}
