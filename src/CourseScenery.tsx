import { memo } from 'react';
import { courseTrees } from './navigation';

const pondOutline='M446 246h39v-19h34v18h42v24h39v36h22v26h-22v30h-20v-13h-55v-24h-50v-24h-45v-17h16z';

export const SceneryDefs=memo(function SceneryDefs(){return <>
 <linearGradient id="pond-depth" x1="0" y1="1" x2="1" y2="0"><stop stopColor="#426d71"/><stop offset=".52" stopColor="#75968a"/><stop offset="1" stopColor="#a8b493"/></linearGradient>
 <radialGradient id="evening-sun" cx="95%" cy="4%" r="94%"><stop stopColor="#ffda91" stopOpacity=".3"/><stop offset=".48" stopColor="#f0c57f" stopOpacity=".08"/><stop offset="1" stopColor="#253f39" stopOpacity=".08"/></radialGradient>
 <linearGradient id="northern-haze" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#e3cb97" stopOpacity=".3"/><stop offset="1" stopColor="#e3cb97" stopOpacity="0"/></linearGradient>
 <clipPath id="pond-clip"><path d={pondOutline}/></clipPath>
 <pattern id="rough-grain" width="47" height="37" patternUnits="userSpaceOnUse"><path d="M5 7h2v3H5zM21 26h3v2h-3zM40 14h2v2h-2z" fill="#d6c889" opacity=".24"/><path d="M14 17v-3m3 3v-5" stroke="#3f6443" strokeWidth="1" opacity=".28"/></pattern>
 <pattern id="roof-tiles" width="10" height="7" patternUnits="userSpaceOnUse"><path d="M0 6h10M5 0v6" stroke="#dfa06d" strokeOpacity=".45" strokeWidth="1"/></pattern>
 </>});

export const GroundDetail=memo(function GroundDetail(){return <g>
 <path d="M0 112h42v13h48v41H62v14H0zM22 370h44v21h35v48H77v22H0v-61h22zM435 20h61v22h44v33h-56v-9h-49zM851 240h109v103h-22v-26h-47v-27h-40zM500 543h36v26h39v51h-75zM686 537h36v29h34v54h-70z" fill="#55764a" opacity=".35"/>
 <path d="M8 54h98v8h72v17h-34v12H78V79H8zM740 19h116v16h60v17h-81V41h-95zM63 557h65v13h41v23H63z" fill="#a1aa68" opacity=".22"/>
 <rect width="960" height="620" fill="url(#rough-grain)"/>
 </g>});

export const LongShadows=memo(function LongShadows(){return <g fill="#2d4337" opacity=".24">
 {courseTrees.map(([x,y],i)=><path key={i} transform={`translate(${x} ${y}) scale(${i%3===0?1.2:1})`} d="M-3 5-29 20h-12v8h-13v7h-9v9h20v-7h17v-8h19l22-16z"/>)}
 <path d="m110 190-52 46v19h78l51-27v-39zM785 456l-45 39v28h72l37-37z"/>
 </g>});

export const DetailedTree=memo(function DetailedTree({x,y,scale=1}:{x:number;y:number;scale?:number}){return <g transform={`translate(${x} ${y}) scale(${scale})`}>
 <path d="M-3-10h7v24h-7z" fill="#66523b"/><path d="M2-7h2v20H2z" fill="#b29a62"/>
 <g className="breeze-canopy">
 <path d="M-16-10h-5v-18h7v-12h10v-7h14v8h10v13h6v18H12v7H-9v-9z" fill="#2f5140"/>
 <path d="M-15-13v-17h8v-10H9v8h10v18H8v9H-6v-8z" fill="#4d7047"/>
 <path d="M-9-31h7v-10h10v7h9v12H9v8H-3v-7H-9z" fill="#7d9455"/>
 <path d="M3-41h6v7h8v8h-6v-4H3zM14-19h6v7h-6z" fill="#b5b471"/>
 <path d="M-15-22h6v5h-6zM-4-10h6v5h-6zM-2-31h5v5h-5z" fill="#3c6143"/>
 <path d="M-9-34h3v3h-3zM8-23h3v3H8zM3-15h3v3H3z" fill="#a5ad67"/>
 </g></g>});

const flowerBeds=[[100,237],[124,241],[175,238],[201,186],[74,312],[60,366],[397,104],[459,77],[855,457],[869,489],[697,544],[586,537],[910,203],[378,575]];
export const Planting=memo(function Planting(){return <g>
 {flowerBeds.map(([x,y],i)=><g key={i} transform={`translate(${x} ${y})`}><path d="M-10 6v-8h6v-5h13v6h7v9z" fill="#4c6441"/><path d="M-7 1h5v-4H8v5h5v3H-7z" fill="#839557"/>{[[-5,-4],[3,-7],[9,-2]].map(([a,b],j)=><g key={j}><path d={`M${a} ${b+2}v5`} stroke="#41603f" strokeWidth="2"/><path d={`M${a-2} ${b}h2v-2h3v2h2v3h-2v2h-3v-2h-2z`} fill={(i+j)%3===0?'#cda789':(i+j)%3===1?'#eee0af':'#c7c48b'}/><rect x={a} y={b} width="2" height="2" fill="#b89a53"/></g>)}</g>)}
 {[[421,274],[442,313],[508,348],[622,356],[618,278],[461,221]].map(([x,y],i)=><g key={i} transform={`translate(${x} ${y})`}><path d="M0 9V-5m4 14V-9m4 18V-3" stroke="#637746" strokeWidth="2"/><path d="M3-13h2v6H3zM-1-8h2v5h-2z" fill="#988452"/></g>)}
 {[[425,317],[455,337],[633,330],[620,265]].map(([x,y],i)=><g key={i} transform={`translate(${x} ${y})`}><path d="M-7 0v-4h10v3h4v5H-7z" fill="#7c8872"/><path d="M-5-3h7v2h-7z" fill="#c3bea0"/></g>)}
 </g>});

export const PondDetails=memo(function PondDetails(){return <g clipPath="url(#pond-clip)">
 <path d="M430 238h18v59h12v27h15v15h-45zM598 324h30v52h-48v-13h18z" fill="#2e5554" opacity=".24"/>
 <g fill="#415f55" opacity=".18"><path d="M449 238h8v17h8v11h-14v16h-13v-18h-9v-14h20zM590 311h18v20h-8v12h-20v-9h-9v-14h19z"/></g>
 <g className="sun-reflection" fill="#f5d999">
 {[{x:504,y:239,w:22},{x:509,y:247,w:33},{x:516,y:256,w:18},{x:519,y:266,w:46},{x:527,y:278,w:27},{x:531,y:289,w:51},{x:545,y:301,w:31},{x:549,y:312,w:42},{x:559,y:323,w:23},{x:571,y:334,w:16}].map(({x,y,w},i)=><rect key={i} x={x} y={y} width={w} height={i%3===0?2:1} opacity={.22+(i%3)*.12}/>)}
 </g>
 <g fill="#ced9b4" opacity=".55"><path d="M465 283h10v1h-10zM546 340h16v1h-16zM482 267h7v1h-7zM590 300h10v1h-10z"/></g>
 </g>});

export const ClubhouseDetails=memo(function ClubhouseDetails(){return <g>
 <g transform="translate(110 190)">
 <path d="M-12-23v-12h10v-12h12v-12h56v12h12v12h11v12z" fill="url(#roof-tiles)"/>
 <path d="M8-57h56v3H8zM-10-25h97v3h-97z" fill="#d29b6d"/>
 <path d="M9-8h13v15H9zM55-8h13v15H55z" fill="#e6bf78"/>
 <path d="M15-8V7m46-15V7M9-1h13m33 0h13" stroke="#7f7757" strokeWidth="1"/>
 <path d="m9 8-16 23h14L22 8Zm46 0L39 31h14L68 8Z" fill="#f3d992" opacity=".13"/>
 <path d="M25-2h27v3H25zM5 12h20v3H5zM52 12h20v3H52z" fill="#805b44"/>
 <path d="M6 11h3v-2h4v3h6v-2h4v4H6zM54 11h4v-2h5v3h7v3H54z" fill="#9fa66a"/>
 <rect x="44" y="16" width="2" height="2" fill="#dfbb74"/>
 <path d="M-4 39h86v3H-4zM1 45h77v3H1z" fill="#a69a70"/>
 </g>
 <g transform="translate(785 449)"><path d="M7 3h51v2H7z" fill="#dcb78a"/><rect x="11" y="10" width="3" height="12" fill="#e8bb75"/><rect x="49" y="10" width="3" height="12" fill="#e8bb75"/><path d="M-10 38h90m-90 8h90m-90 8h90" stroke="#9d895f" strokeWidth="1" opacity=".6"/></g>
 </g>});

export const ForegroundFrame=memo(function ForegroundFrame({x,y}:{x:number;y:number}){return <div className="foreground-frame" aria-hidden="true" style={{transform:`translate(${x}px, ${y}px)`}}>
 <svg className="foreground-branch branch-right" viewBox="0 0 280 230" shapeRendering="crispEdges"><path d="m280 0-39 36-22 40-37 28-43 54-26 18-7-8 23-19 39-56 39-25 22-42L265 0Z" fill="#2a4034"/><path d="m224 52-55-3-43-20-5 6 45 25 49 3m-38 38-3 48-21 37 7 5 23-38 4-43" fill="#2a4034"/>{[[248,10],[205,34],[171,38],[140,22],[225,77],[194,103],[161,137],[154,179],[124,166],[273,65],[260,102]].map(([a,b],i)=><g key={i} transform={`translate(${a} ${b})`}><path d="M-18-9h9v-9h20v9h13V8H12v9H-9V8h-15V-4h6z" fill={i%3===0?'#596f43':i%3===1?'#354f38':'#405b3c'}/><path d="M4-16h7v9h10v5H5z" fill="#9c9e5b" opacity=".8"/></g>)}</svg>
 <svg className="foreground-branch branch-left" viewBox="0 0 240 220" shapeRendering="crispEdges"><path d="M0 220V181l41-43 25-48 40-35 7 7-37 35-25 49L13 190v30zM50 143l67-5 40-21 4 8-43 24-74 5" fill="#283f33"/>{[[17,184],[49,155],[48,117],[78,92],[106,63],[113,143],[152,123],[7,126]].map(([a,b],i)=><g key={i} transform={`translate(${a} ${b})`}><path d="M-18-8h9v-10h19v9h15V8H12v12H-8V9h-16V-3h6z" fill={i%2?'#344f39':'#496140'}/><path d="M5-16h5v9h12v4H5z" fill="#85904e"/></g>)}</svg>
 </div>});

/** Sparse world-space breeze details, with no timers or pointer targets. */
export const CourseBreeze=memo(function CourseBreeze(){return <g className="course-breeze" aria-hidden="true" pointerEvents="none">
 {[{x:245,y:335,delay:'0s'},{x:650,y:290,delay:'6s'},{x:380,y:530,delay:'12s'}].map(({x,y,delay})=><g key={x} transform={`translate(${x} ${y})`}><g className="breeze-trail" style={{animationDelay:delay}} fill="none" stroke="#f4edca" strokeWidth="1"><path d="M0 0h20v-2h18v-3h12v-4h-7"/><path d="M12 7h18v-2h13" opacity=".6"/></g></g>)}
 {[{x:85,y:343,delay:'0s'},{x:390,y:148,delay:'1.5s'},{x:705,y:245,delay:'9s'},{x:535,y:490,delay:'10.5s'}].map(({x,y,delay},i)=><g key={x} transform={`translate(${x} ${y})`}><g className="breeze-leaf" style={{animationDelay:delay}}><path d="M0 0h4v2h2v2H2V2H0z" fill={i%2?'#c5b67a':'#9cac68'}/><path d="M2 2h2v1H2z" fill="#6e804e"/></g></g>)}
 </g>});
