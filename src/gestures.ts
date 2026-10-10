import {FilesetResolver,HandLandmarker} from '@mediapipe/tasks-vision';
export type Hand={side:string;x:number;y:number;pinch:number};
export async function startHands(video:HTMLVideoElement,onFrame:(hands:Hand[],ms:number)=>void,onError:(message:string)=>void){
 let stream:MediaStream|undefined,landmarker:HandLandmarker|undefined,frame=0,stopped=false,last=-1;
 const stop=()=>{stopped=true;cancelAnimationFrame(frame);stream?.getTracks().forEach(t=>t.stop());video.srcObject=null;landmarker?.close()};
 try{
 stream=await navigator.mediaDevices.getUserMedia({video:{width:640,height:480,facingMode:'user'},audio:false});video.srcObject=stream;await video.play();
 const files=await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.32/wasm');
 landmarker=await HandLandmarker.createFromOptions(files,{baseOptions:{modelAssetPath:'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',delegate:'CPU'},runningMode:'VIDEO',numHands:2,minHandDetectionConfidence:.65,minTrackingConfidence:.65});
 function tick(){if(stopped)return;try{if(video.currentTime!==last&&video.readyState>=2){last=video.currentTime;const t=performance.now(),r=landmarker!.detectForVideo(video,t);onFrame(r.landmarks.map((lm,i)=>{const span=Math.hypot(lm[5].x-lm[17].x,lm[5].y-lm[17].y);return {side:r.handedness[i][0].categoryName,x:1-lm[8].x,y:lm[8].y,pinch:Math.hypot(lm[4].x-lm[8].x,lm[4].y-lm[8].y)/Math.max(span,.01)}}),performance.now()-t)}frame=requestAnimationFrame(tick)}catch(e){stop();onError(String(e))}}
 tick();return stop;
 }catch(e){stop();throw e}
}
