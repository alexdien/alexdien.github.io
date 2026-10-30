import test from 'node:test';
import assert from 'node:assert/strict';
import { findRoute, isDriveable } from '../src/navigation.ts';

test('a trip across the pond routes around obstacles', () => {
  const route=findRoute({x:230,y:310},{x:690,y:340});
  assert.ok(route && route.length>2);
  assert.deepEqual(route.at(-1),{x:690,y:340});
  for(const point of route)assert.ok(isDriveable(point),`unsafe waypoint ${JSON.stringify(point)}`);
  for(let i=1;i<route.length;i++) {
    const a=route[i-1],b=route[i];
    for(let t=0;t<=1;t+=.1)assert.ok(isDriveable({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t}));
  }
});
test('rejects pond, clubhouse, café, trees, and map edges', () => {
  for(const point of [{x:530,y:300},{x:140,y:190},{x:820,y:460},{x:375,y:75},{x:-10,y:60},{x:965,y:500}]) {
    assert.equal(findRoute({x:230,y:310},point),null);
  }
});
test('can interrupt a journey and route from an intermediate point', () => {
  const route=findRoute({x:230,y:310},{x:690,y:340});
  const reroute=findRoute(route[20],{x:240,y:420});
  assert.ok(reroute?.length);assert.deepEqual(reroute.at(-1),{x:240,y:420});
});

test('rejects all four greens and their cart-clearance borders', async () => {
  const { puttingGreens, isOnPuttingGreen }=await import('../src/greens.ts');
  for(const polygon of puttingGreens){
    const center={x:polygon.reduce((n,p)=>n+p[0],0)/polygon.length,y:polygon.reduce((n,p)=>n+p[1],0)/polygon.length};
    assert.equal(isDriveable(center),false);
    assert.equal(findRoute({x:230,y:310},center),null);
    for(const [x,y] of polygon){assert.equal(isOnPuttingGreen({x,y}),true);assert.equal(isDriveable({x,y}),false);}
  }
  assert.equal(isDriveable({x:320,y:185}),false,'cart body must not clip the first green');
});
test('routes around each putting green without clipping its clearance boundary', async () => {
  const { isOnPuttingGreen }=await import('../src/greens.ts');
  for(const [start,end] of [
    [{x:220,y:120},{x:330,y:200}],
    [{x:592,y:200},{x:730,y:145}],
    [{x:235,y:400},{x:410,y:440}],
    [{x:675,y:420},{x:830,y:390}],
  ]){
    const route=findRoute(start,end);assert.ok(route,JSON.stringify({start,end}));
    for(let i=1;i<route.length;i++)for(let t=0;t<=1;t+=.05){
      const a=route[i-1],b=route[i];
      assert.equal(isOnPuttingGreen({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t}),false);
    }
  }
});
