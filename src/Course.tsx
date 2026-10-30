import { useEffect, useRef, useState } from 'react';
import { portfolio } from './content';
import { ProjectArtwork } from './ProjectArtwork';
import { courseTrees } from './navigation';
import { puttingGreens } from './greens';
import { Golfer } from './Golfer';
import { SceneryDefs, GroundDetail, LongShadows, DetailedTree, Planting, PondDetails, ClubhouseDetails, ForegroundFrame } from './CourseScenery';
import { useCart } from './useCart';
export const holes = [
  { name: 'About me', subtitle: 'The clubhouse', x: 28, y: 30 },
  { name: 'Selected projects', subtitle: 'Tournament green', x: 68, y: 23 },
  { name: 'Experience', subtitle: 'The driving range', x: 32, y: 64 },
  { name: 'Contact', subtitle: 'The 19th hole', x: 76, y: 67 },
];
export function Course({onSelect,onExplore}:{onSelect:(i:number,project?:number)=>void;onExplore:()=>void}) {
 const viewport=useRef<HTMLDivElement>(null),scene=useRef<HTMLDivElement>(null);
 const [size,setSize]=useState({width:1440,height:900});
 const worldWidth=Math.max(size.width,size.height*960/620),worldHeight=worldWidth*620/960;
 const [camera,setCamera]=useState({x:0,y:0,zoom:1.1});
 const [dragging,setDragging]=useState(false);
 const [preview,setPreview]=useState<number|null>(null);
 const [toolsOpen,setToolsOpen]=useState(false);
 const toolsTrigger=useRef<HTMLButtonElement>(null);
 function closeTools(){setToolsOpen(false);toolsTrigger.current?.focus({preventScroll:true});}
 const [putts,setPutts]=useState(0);
 const [swinging,setSwinging]=useState(false);
 const swingTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>()=>{if(swingTimer.current)clearTimeout(swingTimer.current);},[]);
 function swing(){if(swinging)return;setSwinging(true);onExplore();swingTimer.current=setTimeout(()=>setSwinging(false),1600);}

 const cart=useCart();
 const drag=useRef<{id:number;x:number;y:number;startX:number;startY:number;moved:boolean}|null>(null);
 const clamp=(n:number,limit:number)=>Math.max(-Math.max(0,limit),Math.min(Math.max(0,limit),n));
 const constrain=(x:number,y:number,zoom:number)=>({x:clamp(x,(worldWidth*zoom-size.width)/2),y:clamp(y,(worldHeight*zoom-size.height)/2),zoom});
 useEffect(()=>{const node=viewport.current;if(!node)return;const observer=new ResizeObserver(([entry])=>setSize({width:entry.contentRect.width,height:entry.contentRect.height}));observer.observe(node);return()=>observer.disconnect();},[]);
 useEffect(()=>{setCamera(c=>constrain(size.width<=700?worldWidth*c.zoom*.22:c.x,c.y,c.zoom));},[size.width,size.height]);
 function zoomBy(delta:number){onExplore();setCamera(c=>{const zoom=Math.max(1,Math.min(2.2,Math.round((c.zoom+delta)*100)/100));return constrain(c.x,c.y,zoom);});}
 function reset(){setCamera(constrain(size.width<=700?worldWidth*1.1*.22:0,0,1.1));setPreview(null);}
 function focusHole(index:number){const hole=holes[index];const zoom=1;setCamera(constrain(-(hole.x/100-.5)*worldWidth,-(hole.y/100-.5)*worldHeight,zoom));setPreview(null);onExplore();}
 function showPreview(index:number){setPreview(index);onExplore();}
 return <div className="course-wrap"><div ref={viewport} className={`course ${dragging?'is-dragging':''}`} tabIndex={0} role="region" aria-label="Movable golf course. Drag to pan, click grass to drive the cart. Arrow keys pan, plus and minus zoom, Home resets."
 onPointerDown={e=>{if(e.button!==0||(e.target as Element).closest('button, a, .course-project-preview, .course-dock'))return;drag.current={id:e.pointerId,x:e.clientX,y:e.clientY,startX:camera.x,startY:camera.y,moved:false};e.currentTarget.setPointerCapture(e.pointerId);e.currentTarget.focus({preventScroll:true});}}
 onPointerMove={e=>{const d=drag.current;if(!d||d.id!==e.pointerId)return;const dx=e.clientX-d.x,dy=e.clientY-d.y;if(Math.hypot(dx,dy)>6){d.moved=true;setDragging(true);onExplore();setPreview(null);setToolsOpen(false);}if(d.moved)setCamera(constrain(d.startX+dx,d.startY+dy,camera.zoom));}}
 onPointerUp={e=>{const d=drag.current;if(!d||d.id!==e.pointerId)return;if(!d.moved){const rect=scene.current?.getBoundingClientRect();if(rect){cart.driveTo({x:(e.clientX-rect.left)/rect.width*960,y:(e.clientY-rect.top)/rect.height*620});onExplore();setPreview(null);setToolsOpen(false);}}drag.current=null;setDragging(false);if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);}}
 onPointerCancel={()=>{drag.current=null;setDragging(false);}} onLostPointerCapture={()=>{drag.current=null;setDragging(false);}}
 onKeyDown={e=>{if(e.key==='Escape'){if(toolsOpen)closeTools();else setPreview(null);return;}if(e.target!==e.currentTarget)return;const directions:Record<string,[number,number]>={ArrowLeft:[65,0],ArrowRight:[-65,0],ArrowUp:[0,65],ArrowDown:[0,-65]};if(directions[e.key]){e.preventDefault();onExplore();const [x,y]=directions[e.key];setCamera(c=>constrain(c.x+x,c.y+y,c.zoom));}else if(e.key==='+'||e.key==='='){e.preventDefault();zoomBy(.2);}else if(e.key==='-'){e.preventDefault();zoomBy(-.2);}else if(e.key==='Home'){e.preventDefault();reset();}}}>
 <div ref={scene} className="course-scene" style={{width:worldWidth,height:worldHeight,transform:`translate(-50%, -50%) translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})`}}>
 <svg className="course-art" viewBox="0 0 960 620" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Golden-hour pixel-art golf course with sunlit trees, long shadows, pond reflections, and a warmly lit clubhouse" shapeRendering="crispEdges">
 <defs><SceneryDefs/><pattern id="grass" width="32" height="32" patternUnits="userSpaceOnUse"><rect width="32" height="32" fill="#718653"/><path d="M4 7h3v3H4zM23 24h2v3h-2z" fill="#8a985d"/></pattern><pattern id="fairway" width="30" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)"><rect width="30" height="30" fill="#97a962"/><rect width="15" height="30" fill="#a0b06c"/></pattern><pattern id="sand" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#e8d19a"/><rect x="3" y="7" width="2" height="2" fill="#d8c38a"/></pattern></defs>
 <rect width="960" height="620" fill="url(#grass)"/>
 <path d="M0 60h40v-12h90v18h120v-8h95v-18h90v10h160v-16h110v18h130v-10h125v480H0z" fill="#799054"/>
 <GroundDetail/>
 <path d="M102 199h20v-46h28v-34h45V91h99v15h47v31h29v71h-19v40h-38v27h-62v42h-41v35h-69v-21h-30v-37h-24zM491 103h30V71h111v14h56v24h56v31h49v69h-26v28h-64v-19h-45v-26h-83v-22h-61v-22h-23zM169 415h30v-43h58v-22h65v18h37v32h47v40h47v71h-32v35h-76v-16h-51v-28h-63v-21h-62zM598 375h32v-30h75v14h62v-19h61v27h29v42h-21v33h-36v60h-29v37h-77v-20h-46v-46h-25v-40h-25z" fill="#587547"/>
 <path d="M113 190h20v-37h28v-28h45v-22h76v16h48v31h27v49h-20v40h-37v24h-61v42h-40v35h-47v-20h-27v-37h-12zM502 111h31V83h87v14h56v24h57v30h48v46h-26v28h-40v-19h-45v-26h-83v-22h-62v-24h-23zM181 421h30v-36h58v-21h42v16h37v32h47v40h46v47h-32v35h-52v-16h-51v-28h-63v-20h-62zM610 383h32v-26h51v14h62v-19h61v27h29v18h-21v33h-36v60h-29v37h-53v-20h-46v-46h-25v-40h-25z" fill="url(#fairway)"/>
 {puttingGreens.map((points,i)=><polygon key={i} points={points.map(p=>p.join(',')).join(' ')} fill="#bac77e"/>)}
 <path d="M140 141h18v-12h30v13h12v24h-14v18h-29v-12h-17zM349 229h32v13h17v35h-14v16h-35v-12h-17v-37h17zM677 271h32v12h21v27h-12v13h-41v-12h-17v-26h17zM403 383h23v12h21v32h-15v14h-28v-16h-16v-28h15zM790 475h24v13h19v30h-13v13h-31v-13h-15v-29h16z" fill="#537845"/>
 <path d="M140 135h18v-12h30v13h12v24h-14v18h-29v-12h-17zM349 223h32v13h17v35h-14v16h-35v-12h-17v-37h17zM677 265h32v12h21v27h-12v13h-41v-12h-17v-26h17zM403 377h23v12h21v32h-15v14h-28v-16h-16v-28h15zM790 469h24v13h19v30h-13v13h-31v-13h-15v-29h16z" fill="url(#sand)"/>
 <path d="M430 230h39v-19h66v18h42v24h39v36h22v58h-22v30h-52v-13h-55v-24h-50v-24h-45v-49h16z" fill="#4d7d4b"/>
 <path d="M438 238h39v-19h50v18h42v24h39v36h22v42h-22v30h-36v-13h-55v-24h-50v-24h-45v-33h16z" fill="#98b49d"/>
 <path d="M446 246h39v-19h34v18h42v24h39v36h22v26h-22v30h-20v-13h-55v-24h-50v-24h-45v-17h16z" fill="url(#pond-depth)"/>
 <PondDetails/>
 <g className="ripples" fill="#b8ddd0"><path d="M470 257h25v3h-25zM531 282h32v3h-32zM552 333h25v3h-25zM480 290h16v3h-16zM594 312h12v3h-12z"/></g>
 <path d="M0 540h98v-15h45v-15h46v-12h35v14h-31v14h-45v15h-46v16H0zM445 620V509h20v-52h22v-52h20v-28h14v32h-20v52h-22v52h-20v107zM839 0v77h15v77h14v104h-14v81h-14v53h15v99h-14v58h-14v71h-14v-75h14v-58h14v-91h-15v-61h14v-81h14V158h-14V81h-15V0z" fill="#c6c49a"/>
 <LongShadows/>
 <g transform="translate(110 190)"><path d="M-9 28h99v18H-9z" fill="#426d42"/><path d="M0-23h77v57H0z" fill="#e7dbb5"/><path d="M8-15h59v40H8z" fill="#f5eacb"/><path d="M-12-23v-12h10v-12h12v-12h56v12h12v12h11v12z" fill="#8b5041"/><path d="M0-35h77v6H0zM11-47h55v5H11z" fill="#b46c4f"/><path d="M29 0h19v34H29z" fill="#456553"/><path d="M9-8h13v15H9zM55-8h13v15H55z" fill="#88b9b0"/><path d="M-6 31h89v7H-6z" fill="#c3b28b"/><path d="M52-65h9v18h-9z" fill="#ded1ac"/></g>
 <g fill="#eae0b9"><path d="M100 254h99v16H100z"/></g><text x="149" y="265" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#385c42">CLUBHOUSE</text>
 {courseTrees.map(([x,y],i)=><DetailedTree key={i} x={x} y={y} scale={i%3===0?1.2:1}/>)}
 <g fill="#d8d7a1">{Array.from({length:35},(_,i)=><path key={i} d={`M${(i*137+28)%940} ${(i*73+28)%600}h3v3h-3z`}/>)}</g>
 <Planting/>
 <g transform="translate(562 310)"><g className="pond-duck"><path d="M0 0h12v5H0z" fill="#f5ecd0"/><path d="M9-5h6v7H9z" fill="#f5ecd0"/><path d="M15-2h4v3h-4z" fill="#d99a52"/><rect x="12" y="-4" width="1" height="1" fill="#254c38"/></g></g>

 {/* Tournament bunting, podium, and a neatly chalked practice range. */}
 <g><path d="M525 90v-25h235v25" fill="none" stroke="#e9deb5" strokeWidth="3"/>{Array.from({length:10},(_,i)=><path key={i} d={`M${530+i*23} 66h13v10h-5v6h-8z`} fill={i%2?'#f5e8bf':'#b94f3e'}/>)}<path d="M565 242h44v-8h40v8h44v20H565z" fill="#446b45"/><path d="M565 237h44v-8h40v8h44v20H565z" fill="#d9cba0"/></g>
 <g fill="none" stroke="#d2dfa2" strokeWidth="2" opacity=".65"><rect x="266" y="455" width="70" height="37"/><rect x="282" y="463" width="38" height="20"/><path d="M205 515h190M205 530h190M220 500v35m35-35v35m35-35v35m35-35v35m35-35v35m35-35v35"/></g>
 <g fill="#376947">{[215,250,285,320,355].map(x=><rect key={x} x={x} y="513" width="23" height="13"/>)}</g><g fill="#fbefcf">{[229,264,299,334,369].map(x=><rect key={x} x={x} y="515" width="3" height="3"/>)}</g>
 <g transform="translate(785 449)"><rect x="-10" y="30" width="90" height="27" fill="#c1ad7d"/><rect width="65" height="37" fill="#e8dab3"/><path d="M-7 0v-10h8v-10h49v10h22V0z" fill="#b45d47"/><rect x="9" y="8" width="47" height="19" fill="#38624a"/><path d="M10 29h45v5H10z" fill="#72573b"/><text x="32" y="21" textAnchor="middle" fontSize="9" fill="#f6eac6" fontFamily="monospace">19TH</text><rect x="11" y="40" width="8" height="9" fill="#8c6546"/><rect x="44" y="40" width="8" height="9" fill="#8c6546"/></g>
 {[{x:713,y:480},{x:749,y:518}].map(({x,y})=><g key={x} transform={`translate(${x} ${y})`}><rect x="-3" y="2" width="6" height="20" fill="#826641"/><path d="M-18 0v-7h7v-7h22v7h7v7z" fill="#efe1b3"/><path d="M-3-14h6V0h-6z" fill="#bf6147"/><path d="M-12 20h24v5h-24z" fill="#657343"/></g>)}
 <ClubhouseDetails/>
 <g transform="translate(651 107)"><g className="resting-bird"><path d="M-6-3h4v-3h5v3h4v3H-6z" fill="#f6e7c0"/><path className="bird-wing" d="M-4-3h-6v-3h-5v-3h9v3h3z" fill="#eee4ba"/><path d="M6-3h4v2H6z" fill="#d39e4d"/></g></g>
 <g transform="translate(193 234)"><rect x="-10" y="-6" width="5" height="18" fill="#2c4937"/><rect x="15" y="-6" width="5" height="18" fill="#2c4937"/><rect x="-7" y="-12" width="24" height="27" fill="#b7b991"/><rect x="-9" y="-13" width="28" height="9" fill="#f2dfb3"/><rect x="-3" y="1" width="16" height="7" fill="#5b7354"/></g>
 <g className={cart.driving?'cart-tracks moving':'cart-tracks'}>{cart.tracks.map((point,i)=><g key={i} opacity={(i+1)/cart.tracks.length*.22} fill="#2b5339"><rect x={point.x-6} y={point.y} width="3" height="4"/><rect x={point.x+4} y={point.y} width="3" height="4"/></g>)}</g>
 {cart.destination&&<g transform={`translate(${cart.destination.x} ${cart.destination.y})`} opacity=".7" fill="none" stroke="#f8ecc2" strokeWidth="2"><path d="M-9-3v-6h6M3-9h6v6M9 3v6H3M-3 9h-6V3"/></g>}
 <g className="moving-cart" transform={`translate(${cart.position.x} ${cart.position.y})`}><path d="M-8-5-30 13v14h21l24-16z" fill="#283f32" opacity=".22"/><g transform={`rotate(${cart.heading})`}><ellipse cx="3" cy="6" rx="17" ry="13" fill="#244d343b"/><path d="M-15-12h5v11h-5zM10-12h5v11h-5zM-15 8h5v11h-5zM10 8h5v11h-5z" fill="#263e32"/><rect x="-11" y="-17" width="22" height="36" fill="#c45e43"/><rect x="-10" y="-11" width="20" height="9" fill="#a9cfbb"/><rect x="-8" y="3" width="16" height="9" fill="#f2d9a5"/><rect x="-14" y="-20" width="28" height="10" fill="#fcf1cd"/><path d="M-8-17h16v3H-8z" fill="#ded1a5"/><rect x="-8" y="-23" width="4" height="3" fill="#faf1ca"/><rect x="4" y="-23" width="4" height="3" fill="#faf1ca"/></g></g>
 <Golfer swinging={swinging}/>
 <rect width="960" height="620" fill="url(#evening-sun)"/>
 <rect width="960" height="110" fill="url(#northern-haze)"/>
 </svg>
 <button className="practice-swing" style={{left:'44%',top:'76%'}} onClick={swing} disabled={swinging} aria-label="Take a practice swing">{swinging?'Nice shot.':'Practice swing'} <span aria-hidden="true">↗</span></button>
 
 {holes.map((hole,i)=><button key={hole.name} className="hole" data-hole={i+1} style={{left:`${hole.x}%`,top:`${hole.y}%`}} onClick={()=>onSelect(i)} aria-label={`Hole ${i+1}: ${hole.name}`}><span className="flag"><span>{i+1}</span></span><span className="hole-label">{hole.name}<b>↗</b></span></button>)}
 {portfolio.projects.map((project,i)=><button key={i} className={`trophy-marker ${preview===i?'selected':''}`} style={{left:`${67+(i-(portfolio.projects.length-1)/2)*8}%`,top:'37%'}} onPointerEnter={e=>{if(e.pointerType==='mouse')showPreview(i);}} onFocus={()=>showPreview(i)} onClick={()=>showPreview(i)} aria-label={`Preview ${project.title}`} aria-expanded={preview===i} aria-controls="course-project-preview"><svg width="24" height="28" viewBox="0 0 24 28" shapeRendering="crispEdges" aria-hidden="true"><path d="M5 2h14v13h-4v5h4v5H5v-5h4v-5H5zM1 4h4v8H1zM19 4h4v8h-4z" fill="#e8c36c"/><path d="M8 3h3v10H8z" fill="#fff1b9"/></svg><span>0{i+1}</span></button>)}
 <button className={`golf-ball putt-${putts%2}`} onClick={()=>setPutts(p=>p+1)} aria-label="Putt the golf ball for fun" title="A little practice putt"><span/></button><span className="putt-status" aria-live="polite">{putts>0?'Nice touch!':''}</span>
 </div>
 <ForegroundFrame x={camera.x*.035} y={camera.y*.035}/>
 <nav className="course-dock" aria-label="Main navigation">
 {holes.map((hole,i)=><button key={hole.name} onClick={()=>{setToolsOpen(false);setPreview(null);onSelect(i);}}><span className="dock-number">0{i+1}</span><span>{['About me','Projects','Experience','Contact'][i]}</span></button>)}
 <button ref={toolsTrigger} className="tools-trigger" onClick={()=>{setToolsOpen(v=>!v);setPreview(null);}} aria-label="Course controls" aria-expanded={toolsOpen} aria-controls="course-tools-panel"><span aria-hidden="true">⌖</span><span>Explore</span></button>
 {toolsOpen&&<section id="course-tools-panel" className="course-tools-panel" aria-label="Course controls panel"><div className="tools-heading"><h2>Explore the course</h2><button onClick={closeTools} aria-label="Close course controls">×</button></div><p>Drag to look around. Click a fairway to drive the cart. Please keep off the greens.</p>
 <div className="tools-zoom" role="group" aria-label="Course view controls"><button onClick={()=>zoomBy(-.2)} disabled={camera.zoom<=1} aria-label="Zoom out">−</button><output aria-label="Zoom level">{Math.round(camera.zoom*100)}%</output><button onClick={()=>zoomBy(.2)} disabled={camera.zoom>=2.2} aria-label="Zoom in">+</button><button className="tools-reset" onClick={reset} aria-label="Reset course view">Reset view</button></div>
 <div className="tools-landmarks" role="group" aria-label="Look around the course">{holes.map((hole,i)=><button key={i} onClick={()=>{focusHole(i);closeTools();}} aria-label={`Look at ${hole.subtitle}`}><span>0{i+1}</span>{hole.subtitle}<b>↗</b></button>)}</div>
 <button className="tools-drive" onClick={()=>{cart.driveTo({x:690,y:340});onExplore();closeTools();}} aria-label="Drive the cart to the tournament green">Take the cart for a spin <span>↗</span></button><small>Keyboard: arrows to pan · + / − to zoom · Home to reset</small>
 </section>}
 </nav>
 <div className={`cart-toast ${cart.message?'is-visible':''}`} role="status" aria-live="polite" aria-atomic="true">{cart.message}</div>
 {preview!==null&&<aside id="course-project-preview" className="course-project-preview" aria-label={`${portfolio.projects[preview].title} preview`}><div className="preview-top"><span>SELECTED WORK / 0{preview+1}</span><button onClick={()=>{setPreview(null);viewport.current?.focus({preventScroll:true});}} aria-label="Close project preview">×</button></div><ProjectArtwork key={preview} index={preview}/><div className="preview-copy"><small>{portfolio.projects[preview].category}</small><h2>{portfolio.projects[preview].title}</h2><p>{portfolio.projects[preview].description}</p><button className="primary" onClick={()=>onSelect(1,preview)}>Explore this project <span>↗</span></button></div></aside>}
 </div></div>;
}
