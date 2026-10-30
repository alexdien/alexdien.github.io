import { useEffect, useRef, useState } from 'react';
import { isOnPuttingGreen } from './greens';
import { findRoute, type Point } from './navigation';
export function useCart() {
  const initial={x:230,y:310};
  const [position,setPosition]=useState(initial);
  const [heading,setHeading]=useState(0);
  const [driving,setDriving]=useState(false);
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
    const route=findRoute(current.current,end);
    if(!route){notify(isOnPuttingGreen(end)?'Greens are for golfers. Please keep the cart on the fairway or paths.':'Choose an open fairway or path, clear of water, trees, and buildings.');return;}
    cancelAnimationFrame(frame.current);setDestination(end);notify('On my way.',1800);
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){current.current=end;setPosition(end);setTracks([]);setDriving(false);notify('Arrived.',2200);return;}
    setDriving(true);let index=0,previous=0,lastTrack={...current.current};
    const tick=(now:number)=>{
      let distance=Math.min(previous?(now-previous)/1000:0,0.05)*105;previous=now;
      while(index<route.length){
        const target=route[index],dx=target.x-current.current.x,dy=target.y-current.current.y,length=Math.hypot(dx,dy);
        if(length<.1){index++;continue;}
        setHeading(Math.atan2(dy,dx)*180/Math.PI+90);
        if(length<=distance){current.current=target;distance-=length;index++;}
        else {current.current={x:current.current.x+dx/length*distance,y:current.current.y+dy/length*distance};break;}
      }
      setPosition({...current.current});
      if(Math.hypot(current.current.x-lastTrack.x,current.current.y-lastTrack.y)>7){const point={...current.current};lastTrack=point;setTracks(t=>[...t.slice(-55),point]);}
      if(index<route.length)frame.current=requestAnimationFrame(tick);
      else {setDriving(false);notify('Arrived.',2200);}
    };
    frame.current=requestAnimationFrame(tick);
  }
  return {position,heading,driving,tracks,destination,message,driveTo};
}
