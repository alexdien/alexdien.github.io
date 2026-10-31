import { isOnPuttingGreen } from './greens.ts';
import { isOnBunker } from './bunkers.ts';
export type Point = { x: number; y: number };
export const courseTrees = [[45,110],[80,80],[130,63],[375,90],[411,120],[470,55],[745,66],[900,70],[910,145],[49,250],[85,290],[53,345],[408,338],[374,355],[904,327],[884,365],[916,414],[548,446],[572,482],[541,534],[621,559],[710,579],[900,559],[52,592],[208,581],[264,564],[330,591]];
// World-space footprints plus the larger cart's ground radius.
export const CART_CLEARANCE=28;
export const CART_GROUND_HALF_DEPTH=14;
export const buildingBounds=[
  {name:'clubhouse',left:98,top:131,right:209,bottom:238},
  {name:'patio',left:118,top:240,right:204,bottom:312},
  {name:'café',left:775,top:429,right:865,bottom:506},
];
// Tree ground footprints include the trunk and low foliage; the upper canopy is elevated.
export const treeBounds=courseTrees.map(([x,y],i)=>{
  const scale=i%3===0?1.2:1;
  return {left:x-4*scale,top:y-20*scale,right:x+4*scale,bottom:y+14*scale};
});
export function overlapsCart({x,y}:Point,b:{left:number;top:number;right:number;bottom:number}):boolean {
  const dx=Math.max(b.left-x,0,x-b.right)/CART_CLEARANCE;
  const dy=Math.max(b.top-y,0,y-b.bottom)/CART_GROUND_HALF_DEPTH;
  return dx*dx+dy*dy<=1;
}
export function isDriveable(point:Point): boolean {
  const {x,y}=point;
  if (isOnPuttingGreen(point,CART_CLEARANCE)||isOnBunker(point,CART_CLEARANCE)) return false;
  if (x<CART_CLEARANCE||x>960-CART_CLEARANCE||y<CART_CLEARANCE||y>620-CART_CLEARANCE)return false;
  if (x > 405 && x < 650 && y > 200 && y < 390) return false;
  if(buildingBounds.some(b=>overlapsCart(point,b)))return false;
  return !treeBounds.some(b=>overlapsCart(point,b));
}
export function findRoute(start: Point, end: Point): Point[] | null {
  if (!isDriveable(end)) return null;
  const cell = (p:Point):Point|undefined => {
    const center={x:Math.round(p.x/5)*5,y:Math.round(p.y/5)*5};
    return [-5,0,5].flatMap(dx=>[-5,0,5].map(dy=>({x:center.x+dx,y:center.y+dy})))
      .sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))
      .find(candidate=>isDriveable(candidate)&&isClearSegment(p,candidate));
  };
  const a=cell(start), b=cell(end), key=(p:Point)=>`${p.x},${p.y}`;
  if(!a||!b) return null;
  const queue:Point[]=[a], parents=new Map<string,Point|null>([[key(a),null]]);
  for(let head=0;head<queue.length;head++) {
    const p=queue[head];
    if(key(p)===key(b)) {
      const route:Point[]=[end]; let current:Point|null=p;
      while(current){route.push(current);current=parents.get(key(current))??null;}
      return route.reverse();
    }
    for(const [dx,dy] of [[5,0],[-5,0],[0,5],[0,-5],[5,5],[-5,5],[5,-5],[-5,-5]]) {
      const next={x:p.x+dx,y:p.y+dy};
      if(parents.has(key(next))||!isDriveable(next)||!isClearSegment(p,next))continue;
      // Obstacles already include the entire cart footprint. Testing unrelated
      // orthogonal cells here incorrectly blocks safe diagonal passages.
      parents.set(key(next),p);queue.push(next);
    }
  }
  return null;
}

export function isClearSegment(a:Point,b:Point):boolean {
  const steps=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/.5));
  for(let i=0;i<=steps;i++){const t=i/steps;if(!isDriveable({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t}))return false;}
  return true;
}

// Collapse straight grid runs, preserving the route's deliberate 45/90-degree turns.
export function simplifyRoute(start:Point,route:Point[]):Point[] {
  const points=[start,...route].filter((p,i,all)=>i===0||Math.hypot(p.x-all[i-1].x,p.y-all[i-1].y)>.01);
  const result:Point[]=[];
  for(let i=1;i<points.length-1;i++){
    const a=points[i-1],b=points[i],c=points[i+1];
    const ux=b.x-a.x,uy=b.y-a.y,vx=c.x-b.x,vy=c.y-b.y;
    const straight=Math.abs(ux*vy-uy*vx)<.001 && ux*vx+uy*vy>0;
    if(!straight)result.push(b);
  }
  if(points.length>1)result.push(points[points.length-1]);
  // Remove only short grid stair steps, never the course's longer deliberate turns.
  // Every replacement segment must still clear the full cart footprint.
  for(let i=0;i<result.length-1;){
    const a=i===0?start:result[i-1],b=result[i],c=result[i+1];
    const ab=Math.hypot(b.x-a.x,b.y-a.y),bc=Math.hypot(c.x-b.x,c.y-b.y);
    if(Math.min(ab,bc)<=7.2 && ab+bc<=24 && isClearSegment(a,c)){
      result.splice(i,1);i=Math.max(0,i-1);
    }else i++;
  }
  // An off-grid redirect must not briefly reverse just to visit its nearest cell.
  if(result.length>1 && Math.hypot(result[0].x-start.x,result[0].y-start.y)<7.2 && isClearSegment(start,result[1]))result.shift();
  return result;
}

export type CartDirection = 0|1|2|3|4|5|6|7;
export function cartDirection(dx:number,dy:number,previous:CartDirection):CartDirection {
  if(Math.hypot(dx,dy)<.1)return previous;
  const angle=(Math.atan2(dy,dx)*180/Math.PI+360)%360;
  const difference=Math.abs(((angle-previous*45+540)%360)-180);
  // Hysteresis prevents tiny corrections from flickering between neighboring views.
  return difference<28?previous:Math.round(angle/45)%8 as CartDirection;
}
