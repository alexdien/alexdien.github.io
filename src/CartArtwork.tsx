import type { CartDirection } from './navigation';

/** Preserve the original shallow three-quarter perspective in all eight views. */
export function GolfCart({wheelStep=0,direction=1}:{wheelStep?:number;direction?:CartDirection}) {
 const angle=direction*Math.PI/4;
 const fx=Math.cos(angle),fy=Math.sin(angle),rx=-fy,ry=fx;
 const project=(f:number,r:number,h:number)=>[fx*f+rx*r,(fy*f+ry*r)*.5-h].map(n=>Math.round(n*1000)/1000);
 const points=(vertices:number[][])=>vertices.map(([f,r,h])=>project(f,r,h).join(',')).join(' ');
 const box=(key:string,f:number,r:number,w:number,d:number,bottom:number,top:number,color:string,side:string)=><g key={key}>
  {ry<-.001&&<polygon points={points([[f,r,bottom],[f+w,r,bottom],[f+w,r,top],[f,r,top]])} fill={side}/>}
  {ry>.001&&<polygon points={points([[f,r+d,bottom],[f+w,r+d,bottom],[f+w,r+d,top],[f,r+d,top]])} fill={side}/>}
  {fy<-.001&&<polygon points={points([[f,r,bottom],[f,r+d,bottom],[f,r+d,top],[f,r,top]])} fill={side}/>}
  {fy>.001&&<polygon points={points([[f+w,r,bottom],[f+w,r+d,bottom],[f+w,r+d,top],[f+w,r,top]])} fill={side}/>}
  <polygon points={points([[f,r,top],[f+w,r,top],[f+w,r+d,top],[f,r+d,top]])} fill={color}/>
 </g>;
 const wheels=[[-13,-14],[-13,14],[15,-14],[15,14]].sort((a,b)=>project(a[0],a[1],0)[1]-project(b[0],b[1],0)[1]);
 const wheel=(f:number,r:number)=>{
  const center=project(f,r,5);
  const rim=Array.from({length:8},(_,i)=>{const a=i*Math.PI/4;return [center[0]+Math.cos(a)*Math.max(2,Math.abs(fx)*5),center[1]+Math.cos(a)*fy*2-Math.sin(a)*5].join(',');}).join(' ');
  const phase=wheelStep*Math.PI/2;
  const a=project(f+Math.cos(phase)*1.5,r,5+Math.sin(phase)*1.5),b=project(f-Math.cos(phase)*1.5,r,5-Math.sin(phase)*1.5);
  return <g key={`${f},${r}`}><polygon points={rim} fill="#1d3028"/><line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#839080" strokeWidth="2"/></g>;
 };
 const fixtures=[
  {depth:project(16,0,0)[1],node:<g key="hood"><polygon points={points([[9,-12,13],[23,-12,10],[23,12,10],[9,12,13]])} fill="#d18964"/><polygon points={points([[9,-12,7],[23,-12,7],[23,-12,10],[9,-12,13]])} fill="#995139"/><polygon points={points([[9,12,7],[23,12,7],[23,12,10],[9,12,13]])} fill="#995139"/><polygon points={points([[23,-12,7],[23,12,7],[23,12,10],[23,-12,10]])} fill="#b75b43"/>{box('bumper',23,-13,2,26,5,7,'#4b6049','#354b3b')}{[-9,6].map(r=>box(`lamp${r}`,23,r,1,5,7.5,10.5,'#fff1c9','#fff1c9'))}</g>},
  {depth:project(-7,0,0)[1],node:<g key="seat">{box('seat',-11,-8,10,16,9,11,'#e7d9af','#cbb990')}{box('back',-13,-8,3,16,11,17,'#e7d9af','#e7d9af')}</g>},
  {depth:project(-26,7,0)[1],node:<g key="bag">{box('rack',-28,-10,8,20,4,6,'#52654a','#344c3a')}{box('bag',-28,3,5,7,7,21,'#b47b51','#8e5c42')}{[4,8].map((r,i)=>{const a=project(-25,r,20),b=project(-25,r,28+i*3);return <g key={r}><line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#bfccb8" strokeWidth="1.5"/><path d={`M${b[0]-2} ${b[1]}h4v2h-4z`} fill="#354c3c"/></g>})}</g>},
 ].sort((a,b)=>a.depth-b.depth);
 return <g transform="scale(.8)" data-cart-direction={direction}>
  <polygon points={points([[-20,-12,0],[22,-12,0],[22,12,0],[-20,12,0]])} fill="#243e32" opacity=".13"/>
  {wheels.slice(0,2).map(([f,r])=>wheel(f,r))}
  {box('floor',-20,-12,42,24,5,8,'#344c3a','#52654a')}
  {fixtures.map(item=>item.node)}
  <polygon points={points([[3,-7,15],[7,-7,16],[9,-4,15],[5,-2,14],[3,-4,14]])} fill="#294635"/>
  {(()=>{const a=project(6,-5,8),b=project(6,-5,15);return <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#3a5542" strokeWidth="2"/>})()}
  {wheels.slice(2).map(([f,r])=>wheel(f,r))}
  {/* Upright posts retain their vertical screen direction for every travel heading. */}
  {[-16,9].flatMap(f=>[-12,12].map(r=>{const a=project(f,r,8),b=project(f,r,32);return <line key={`${f},${r}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#e7d9af" strokeWidth="2"/>}))}
  {box('canopy',-19,-17,34,34,31,33,'#fff0cb','#cbb990')}
  
 </g>;
}
