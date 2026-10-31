// Shared by the artwork and cart collision system. Coordinates are course units.
export const puttingGreens = [
  [[211,156],[278,156],[278,167],[302,167],[302,208],[288,208],[288,225],[220,225],[220,212],[196,212],[196,172],[211,172]],
  [[607,114],[672,114],[672,124],[696,124],[696,156],[682,156],[682,174],[617,174],[617,164],[593,164],[593,130],[607,130]],
  [[287,407],[352,407],[352,419],[374,419],[374,454],[360,454],[360,471],[290,471],[290,460],[267,460],[267,425],[287,425]],
  [[723,377],[776,377],[776,387],[800,387],[800,421],[788,421],[788,439],[722,439],[722,426],[704,426],[704,392],[723,392]],
];
export function isNearPolygons({x,y}:{x:number;y:number},polygons:number[][][],clearance:number):boolean {
  return polygons.some(points=>{
    let inside=false;
    for(let i=0,j=points.length-1;i<points.length;j=i++){
      const [ax,ay]=points[j],[bx,by]=points[i];
      if((ay>y)!==(by>y)&&x<(bx-ax)*(y-ay)/(by-ay)+ax)inside=!inside;
      const dx=bx-ax,dy=by-ay;
      const t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy)));
      if(Math.hypot(x-(ax+t*dx),y-(ay+t*dy))<=clearance)return true;
    }
    return inside;
  });
}

export function isOnPuttingGreen(point:{x:number;y:number},clearance=28):boolean {
  return isNearPolygons(point,puttingGreens,clearance);
}
