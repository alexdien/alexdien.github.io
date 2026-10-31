import { useEffect, useState, type CSSProperties } from 'react';

const spotifyTrack = 'https://open.spotify.com/track/1gihuPhrLraKYrJMAEONyc';

export function DJPlayer() {
  const [loaded, setLoaded] = useState(false);
  return <section className="dj-player spotify-player" aria-label="Clubhouse music" onPointerDown={e=>e.stopPropagation()} onKeyDown={e=>e.stopPropagation()}>
    <div className="dj-player-heading"><span>CLUBHOUSE AFTER HOURS</span><span aria-hidden="true">♫</span></div>
    <strong>Feel So Close</strong><p className="dj-artist">Calvin Harris · Radio Edit</p>
    {loaded ? <><iframe title="Spotify player: Feel So Close by Calvin Harris" src="https://open.spotify.com/embed/track/1gihuPhrLraKYrJMAEONyc?utm_source=oembed&theme=0" width="100%" height="152" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" allowFullScreen loading="lazy"/><button className="dj-unload" onClick={()=>setLoaded(false)}>Close player</button></> : <div className="dj-player-controls"><button onClick={()=>setLoaded(true)}>Load Spotify player</button></div>}
    <small>{loaded?'Use Spotify’s play/pause controls.':'Loads Spotify only when you choose.'} Playback may be limited to a preview or require sign-in. <a href={spotifyTrack} target="_blank" rel="noreferrer">Open in Spotify ↗</a></small>
  </section>;
}

const fireworks = [
  { x: 25, y: 35, delay: 0, color: '#ffd27b' },
  { x: 72, y: 44, delay: 450, color: '#f39b84' },
  { x: 48, y: 26, delay: 950, color: '#c8efdf' },
  { x: 38, y: 56, delay: 1500, color: '#ffe5a0' },
  { x: 68, y: 30, delay: 1950, color: '#f6ba90' },
];

export function PixelFireworks() {
  const [visible,setVisible] = useState(true);
  useEffect(()=>{const timer=setTimeout(()=>setVisible(false),4900);return()=>clearTimeout(timer);},[]);
  if(!visible)return null;
  return <div className="pixel-fireworks" aria-hidden="true"><div className="fireworks-dusk"/>{fireworks.map((burst,i)=><div className="pixel-burst" key={i} style={{left:`${burst.x}%`,top:`${burst.y}%`,'--launch-delay':`${burst.delay}ms`,'--burst-delay':`${burst.delay+650}ms`,color:burst.color} as CSSProperties}>
    <div className="firework-rocket"><i/><i/><i/><i/></div>
    <svg viewBox="-180 -180 360 360" shapeRendering="crispEdges" className="firework-bloom">
      <path className="firework-core" d="M-4-16h8v12h12v8H4v12h-8V4h-12v-8h12z" fill="#fff7de"/>
      {Array.from({length:24},(_,j)=>{
        const angle=j*Math.PI/12;
        const radius=j%2?125:148;
        const x=Math.round(Math.cos(angle)*radius/4)*4;
        const y=Math.round(Math.sin(angle)*radius/4)*4;
        return <g key={j} className="firework-ray" style={{'--ray-x':`${x}px`,'--ray-y':`${y}px`,'--fall-y':`${y+52}px`} as CSSProperties}>
          <rect x="-3" y="-3" width="6" height="6" fill="currentColor"/>
          <rect x={-Math.round(x*.08/4)*4-2} y={-Math.round(y*.08/4)*4-2} width="4" height="4" fill="#fff5d0" opacity=".8"/>
          <rect x={-Math.round(x*.16/4)*4-2} y={-Math.round(y*.16/4)*4-2} width="4" height="4" fill="currentColor" opacity=".45"/>
        </g>;
      })}
      {Array.from({length:12},(_,j)=>{
        const angle=(j+.5)*Math.PI/6;
        const x=Math.round(Math.cos(angle)*66/4)*4,y=Math.round(Math.sin(angle)*66/4)*4;
        return <rect key={j} className="firework-ray inner-ember" x="-2" y="-2" width="4" height="4" fill="#fff3ce" style={{'--ray-x':`${x}px`,'--ray-y':`${y}px`,'--fall-y':`${y+70}px`} as CSSProperties}/>;
      })}
    </svg>
  </div>)}</div>;

}
