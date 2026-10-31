import { useEffect, useRef, useState } from 'react';
import { isOnPuttingGreen } from './greens';
import { isOnBunker } from './bunkers';
import { cartDirection, type CartDirection, findRoute, isDriveable, simplifyRoute, type Point } from './navigation';
export function useCart() {
  const initial={x:250,y:320};
  const [position,setPosition]=useState(initial);
  const [facing,setFacing]=useState<CartDirection>(1);
  const facingRef=useRef<CartDirection>(1),speed=useRef(0);
  const [driving,setDriving]=useState(false);
  const [wheelStep,setWheelStep]=useState(0);
  const odometer=useRef(0);
  const moving=useRef(false), pending=useRef<Point|null>(null);
  const [tracks,setTracks]=useState<Point[]>([]);
  const [destination,setDestination]=useState<Point|null>(null);
  const [message,setMessage]=useState('');
  const current=useRef<Point>(initial), frame=useRef(0);
  const noticeTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  function notify(text:string,duration=4500){
    if(noticeTimer.current)clearTimeout(noticeTimer.current);
    setMessage(text);
    noticeTimer.current=setTimeout(()=>setMessage(''),duration);
  }
  useEffect(()=>()=>{cancelAnimationFrame(frame.current);if(noticeTimer.current)clearTimeout(noticeTimer.current);},[]);
  function driveTo(end:Point) {
    const rawRoute=findRoute(current.current,end);
    if(!rawRoute){notify(isOnPuttingGreen(end)?'Greens are for golfers. Please keep the cart on the fairway or paths.':isOnBunker(end)?'Please keep the cart out of sand bunkers. Choose a fairway or path.':isDriveable(end)?'There is no clear route to that spot. Choose another fairway or path.':'Choose an open fairway or path, clear of water, trees, and buildings.');return;}
    // Brake along the existing safe route before committing a sharp redirect.
    // Repeated clicks replace the pending target without resetting the braking phase.
    if(moving.current){pending.current=end;setDestination(end);notify('Changing course.',1800);return;}
    pending.current=null;
    const route=simplifyRoute(current.current,rawRoute);
    cancelAnimationFrame(frame.current);setDestination(end);notify('On my way.',1800);
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){current.current=end;speed.current=0;setPosition(end);setTracks([]);setDestination(null);setDriving(false);notify('Arrived.',2200);return;}
    if(!route.length){speed.current=0;setDriving(false);setDestination(null);return;}
    setDriving(true);moving.current=true;let index=0,previous=0,lastPaint=0,lastTrack={...current.current},turnElapsed=0;
    const lengthsAfter=route.map(()=>0);
    for(let i=route.length-2;i>=0;i--)lengthsAfter[i]=lengthsAfter[i+1]+Math.hypot(route[i+1].x-route[i].x,route[i+1].y-route[i].y);
    const tick=(now:number)=>{
      const dt=Math.min(previous?(now-previous)/1000:0,0.04);previous=now;
      const next=route[index];
      // Upright eight-way sprites turn one view at a time while stopped, rather
      // than snapping 180 degrees or sliding sideways at cruising speed.
      const desired=cartDirection(next.x-current.current.x,next.y-current.current.y,facingRef.current);
      if(!pending.current && speed.current===0 && desired!==facingRef.current){
        turnElapsed+=dt;
        if(turnElapsed>=.065){
          const delta=(desired-facingRef.current+8)%8;
          facingRef.current=((facingRef.current+(delta<=4?1:7))%8) as CartDirection;
          setFacing(facingRef.current);turnElapsed=0;
        }
        frame.current=requestAnimationFrame(tick);return;
      }
      const remaining=Math.hypot(next.x-current.current.x,next.y-current.current.y)+lengthsAfter[index];
      const cornerDistance=Math.hypot(next.x-current.current.x,next.y-current.current.y);
      // Brief speed check at a corner, without a long floaty ease-in/ease-out.
      const cruise=index<route.length-1 && cornerDistance<14 ? 72 : 92;
      const targetSpeed=pending.current?0:Math.min(cruise,Math.sqrt(2*420*remaining));
      const oldSpeed=speed.current;
      speed.current+=Math.max(-420*dt,Math.min(360*dt,targetSpeed-speed.current));
      let distance=(oldSpeed+speed.current)*.5*dt;
      const before={...current.current};
      while(index<route.length && distance>0){
        const target=route[index],dx=target.x-current.current.x,dy=target.y-current.current.y,length=Math.hypot(dx,dy);
        if(length<.1){index++;continue;}
        const nextFacing=cartDirection(dx,dy,facingRef.current);
        facingRef.current=nextFacing;
        if(length<=distance){current.current=target;distance-=length;index++;}
        else {current.current={x:current.current.x+dx/length*distance,y:current.current.y+dy/length*distance};break;}
      }
      odometer.current+=Math.hypot(current.current.x-before.x,current.current.y-before.y);
      // Render at an arcade-like 30 fps on whole course pixels; routing stays precise.
      if(now-lastPaint>=1000/30||index===route.length){
        setPosition(index===route.length?{...current.current}:{x:Math.round(current.current.x),y:Math.round(current.current.y)});
        setFacing(facingRef.current);
        setWheelStep(Math.floor(odometer.current/3)%2);
        lastPaint=now;
      }
      if(Math.hypot(current.current.x-lastTrack.x,current.current.y-lastTrack.y)>7){const point={...current.current};lastTrack=point;setTracks(t=>[...t.slice(-15),point]);}
      if(pending.current && (speed.current===0 || index===route.length)){
        const target=pending.current;pending.current=null;moving.current=false;speed.current=0;
        driveTo(target);return;
      }
      if(index<route.length)frame.current=requestAnimationFrame(tick);
      else {moving.current=false;speed.current=0;setDriving(false);setDestination(null);notify('Arrived.',2200);}
    };
    frame.current=requestAnimationFrame(tick);
  }
  return {position,facing,wheelStep,driving,tracks,destination,message,driveTo};
}
