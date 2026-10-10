import {FilesetResolver,HandLandmarker} from '@mediapipe/tasks-vision';
export type Hand={side:string;x:number;y:number;pinch:number};
export async function startHands(video:HTMLVideoElement,onFrame:(hands:Hand[],ms:number)=>void,onError:(message:string)=>void){
 const previous=new Map<string,{x:number;y:number;time:number}>();
 let stream:MediaStream|undefined,landmarker:HandLandmarker|undefined,frame=0,stopped=false,last=-1;
 const stop=()=>{stopped=true;cancelAnimationFrame(frame);stream?.getTracks().forEach(t=>t.stop());video.srcObject=null;landmarker?.close()};
 try{
 stream=await navigator.mediaDevices.getUserMedia({video:{width:640,height:480,facingMode:'user'},audio:false});video.srcObject=stream;await video.play();
 const files=await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.32/wasm');
 landmarker=await HandLandmarker.createFromOptions(files,{baseOptions:{modelAssetPath:'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',delegate:'CPU'},runningMode:'VIDEO',numHands:2,minHandDetectionConfidence:.65,minTrackingConfidence:.65});
 function tick(){if(stopped)return;try{if(video.currentTime!==last&&video.readyState>=2){last=video.currentTime;const t=performance.now(),r=landmarker!.detectForVideo(video,t);const hands=r.landmarks.map((lm,i)=>{const span=Math.hypot(lm[5].x-lm[17].x,lm[5].y-lm[17].y);return {confidence:r.handedness[i][0].score,side:r.handedness[i][0].categoryName,x:1-lm[8].x,y:lm[8].y,pinch:Math.hypot(lm[4].x-lm[8].x,lm[4].y-lm[8].y)/Math.max(span,.01)}}).filter(h=>h.confidence>=.65);
 // Prefer spatial continuity over a one-frame handedness flip. Pause ambiguous overlap.
 const distance=(a:Hand,b:Hand)=>Math.hypot(a.x-b.x,a.y-b.y);
 if(hands.length===2&&distance(hands[0],hands[1])<.10){onFrame([],performance.now()-t)}else{
 const a=previous.get('Left'),b=previous.get('Right');
 if(hands.length===2&&a&&b&&t-a.time<220&&t-b.time<220){const direct=Math.hypot(hands[0].x-a.x,hands[0].y-a.y)+Math.hypot(hands[1].x-b.x,hands[1].y-b.y),reverse=Math.hypot(hands[1].x-a.x,hands[1].y-a.y)+Math.hypot(hands[0].x-b.x,hands[0].y-b.y);if(Math.min(direct,reverse)<.55){hands[0].side=direct<=reverse?'Left':'Right';hands[1].side=direct<=reverse?'Right':'Left'}}
 if(hands.length===1){const candidates=[...previous].filter(([,v])=>t-v.time<220).map(([side,v])=>({side,d:Math.hypot(hands[0].x-v.x,hands[0].y-v.y)})).sort((a,b)=>a.d-b.d);if(candidates[0]?.d<.16)hands[0].side=candidates[0].side}
 const unique=hands.filter((h,i)=>hands.findIndex(v=>v.side===h.side)===i);for(const h of unique)previous.set(h.side,{x:h.x,y:h.y,time:t});onFrame(unique,performance.now()-t)}}frame=requestAnimationFrame(tick)}catch(e){stop();onError(String(e))}}
 tick();return stop;
 }catch(e){stop();throw e}
}
