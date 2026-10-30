import React, { useRef, useState } from 'react';
import { Course, holes } from './Course';
import { ProjectArtwork } from './ProjectArtwork';
import { portfolio as p } from './content';
export default function App(){
 const [introCollapsed,setIntroCollapsed]=useState(false);
 const [active,setActive]=useState(0); const dialog=useRef<HTMLDialogElement>(null); const lastFocus=useRef<HTMLElement|null>(null);
 function open(i:number,project?:number){lastFocus.current=document.activeElement as HTMLElement;setActive(i);dialog.current?.showModal();document.body.style.overflow="hidden";if(project!==undefined)requestAnimationFrame(()=>document.getElementById(`project-${project}`)?.scrollIntoView({block:'start'}));else if(dialog.current)dialog.current.scrollTop=0;}
 function close(){dialog.current?.close();lastFocus.current?.focus();}
 return <><a href="#course" className="skip-link">Skip to the course</a>
 <main id="home" className="golf-world">
 <section id="course" aria-label="Explore the portfolio course"><Course onSelect={open} onExplore={()=>setIntroCollapsed(true)}/></section>

 <section className={`player-card ${introCollapsed?'is-collapsed':''}`} aria-label="Introduction"><button className="intro-toggle" onClick={()=>setIntroCollapsed(c=>!c)} aria-label={introCollapsed?'Expand introduction':'Collapse introduction'} aria-expanded={!introCollapsed}>{introCollapsed?'+':'−'}</button><span className="eyebrow">A NOTE FROM THE CLUBHOUSE</span><h1>{p.name}</h1><p className="role">{p.role}</p><p className="intro-text">{p.shortIntroduction}</p><button className="primary" onClick={()=>open(1)}>Explore my work <span>↗</span></button></section>

 </main>
 <dialog onKeyDown={e=>{if(e.key!=='Tab')return;const items=Array.from(e.currentTarget.querySelectorAll<HTMLElement>('button, a[href], [tabindex="0"]'));const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}} aria-labelledby="scorecard-title" ref={dialog} className="scorecard" onCancel={e=>{e.preventDefault();close();}} onClick={e=>{if(e.target===dialog.current)close();}} onClose={()=>{document.body.style.overflow='';}}><div className="modal-content"><div className="card-top"><span>PORTFOLIO / SCORECARD</span><button className="close" onClick={close} aria-label="Close scorecard">×</button></div><div className="card-title"><span className="card-hole">0{active+1}</span><div><h2 id="scorecard-title">{holes[active].name}</h2></div></div><div className="card-body">
 {active===0&&<><p className="card-lead">Hello, I’m {p.name}.</p>{p.bio.split("\n\n").map((paragraph,i)=><p key={i}>{paragraph}</p>)}<div className="detail-row"><span>BASED IN</span><strong>{p.location}</strong></div><div className="detail-row"><span>OFF THE COURSE</span><p>{p.interests}</p></div></>}
 {active===1&&<div className="modal-projects">{p.projects.map((project,i)=><article key={project.title} id={`project-${i}`}><ProjectArtwork index={i}/><small>0{i+1} / {project.category}</small><h3>{project.title}</h3><p>{project.description}</p>{project.tags.length>0&&<div className="tags">{project.tags.map((tag,j)=><span key={j}>{tag}</span>)}</div>}{project.url&&<a href={project.url} target="_blank" rel="noreferrer">View project ↗</a>}</article>)}</div>}
 {active===2&&<>{p.skills.length>0&&<><h3>Skills</h3><div className="tags skills">{p.skills.map(s=><span key={s}>{s}</span>)}</div></>}<h3>The journey so far</h3>{p.experience.map((exp,i)=><article className="experience" key={i}><small>{exp.period}</small><h4>{exp.role}</h4><strong>{exp.company}</strong>{exp.description&&<p>{exp.description}</p>}</article>)}<h3 className="education-heading">Education</h3>{p.education.map(education=><article className="education" key={education.school}><small>{education.period}</small><h4>{education.school}</h4><p>{education.degree}</p></article>)}</>}
 {active===3&&<><p className="card-lead">Let’s tee something up.</p><p>{p.contactIntroduction}</p>{p.email&&<a className="email-placeholder" href={`mailto:${p.email}`}><small>Email me</small>{p.email} ↗</a>}<div className="socials">{p.socials.filter(s=>s.url).map(s=><a key={s.label} href={s.url} target="_blank" rel="noreferrer">{s.label} ↗</a>)}</div></>}
 </div><div className="card-footer"><span>TAKE YOUR TIME. ENJOY THE ROUND.</span><button onClick={()=>setActive((active+1)%4)}>Next hole <span>→</span></button></div></div></dialog></>;
}
