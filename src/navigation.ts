import { isOnPuttingGreen } from './greens.ts';
export type Point = { x: number; y: number };
export const courseTrees = [[45,110],[80,80],[130,63],[375,90],[411,120],[470,55],[745,66],[900,70],[910,145],[49,250],[85,290],[53,345],[408,338],[374,355],[904,327],[884,365],[916,414],[548,446],[572,482],[541,534],[621,559],[710,579],[900,559],[52,592],[208,581],[264,564],[330,591]];
// Conservative clearances keep the cart out of the pond, putting greens, buildings, and trees.
export function isDriveable({ x, y }: Point): boolean {
  if (isOnPuttingGreen({x,y})) return false;
  if (x < 15 || x > 945 || y < 15 || y > 605) return false;
  if (x > 405 && x < 650 && y > 200 && y < 390) return false;
  if (x > 90 && x < 210 && y > 120 && y < 238) return false;
  if (x > 775 && x < 865 && y > 415 && y < 515) return false;
  return !courseTrees.some(([tx,ty]) => x > tx-27 && x < tx+30 && y > ty-54 && y < ty+22);
}
export function findRoute(start: Point, end: Point): Point[] | null {
  if (!isDriveable(end)) return null;
  const cell = (p:Point):Point|undefined => {
    const center={x:Math.round(p.x/10)*10,y:Math.round(p.y/10)*10};
    return [-10,0,10].flatMap(dx=>[-10,0,10].map(dy=>({x:center.x+dx,y:center.y+dy})))
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
    for(const [dx,dy] of [[10,0],[-10,0],[0,10],[0,-10],[10,10],[-10,10],[10,-10],[-10,-10]]) {
      const next={x:p.x+dx,y:p.y+dy};
      if(parents.has(key(next))||!isDriveable(next)||!isClearSegment(p,next))continue;
      if(dx&&dy&&(!isDriveable({x:p.x+dx,y:p.y})||!isDriveable({x:p.x,y:p.y+dy})))continue;
      parents.set(key(next),p);queue.push(next);
    }
  }
  return null;
}

export function isClearSegment(a:Point,b:Point):boolean {
  const steps=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/2));
  for(let i=0;i<=steps;i++){const t=i/steps;if(!isDriveable({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t}))return false;}
  return true;
}
