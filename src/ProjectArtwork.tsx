import { useState } from 'react';
import { portfolio } from './content';
export function ProjectArtwork({index}:{index:number}) {
 const project=portfolio.projects[index];const [failed,setFailed]=useState(false);
 if(project.image&&!failed)return <img className="project-screenshot" src={project.image} alt={project.imageAlt||`${project.title} preview`} onError={()=>setFailed(true)}/>;
 return null;
}
