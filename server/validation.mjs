import {z} from 'zod';
export const actionSchema=z.discriminatedUnion('type',[
 z.object({type:z.literal('color'),value:z.string().regex(/^#[0-9a-f]{6}$/i)}),
 z.object({type:z.literal('size'),value:z.number().min(1).max(120)}),
 z.object({type:z.literal('opacity'),value:z.number().min(.05).max(1)}),
 z.object({type:z.literal('tool'),value:z.enum(['pen','brush','marker','eraser'])}),
 z.object({type:z.enum(['brightness','contrast','saturation']),value:z.number().min(0).max(200)})
]);
export const proposalSchema=z.object({explanation:z.string().max(1200),actions:z.array(actionSchema).max(8)});
export const eventsSchema=z.object({session:z.string().uuid(),events:z.array(z.object({id:z.string().uuid(),time:z.string().datetime(),kind:z.enum(['stroke','undo','redo','tool','settings','photo','tracking_lost','inference_ms','ai_apply','clear','load']),value:z.number().finite().nullable()})).max(100)});
