import test from 'node:test';
import assert from 'node:assert/strict';
import { findRoute, isDriveable } from '../src/navigation.ts';

test('a trip across the pond routes around obstacles', () => {
  const route=findRoute({x:250,y:320},{x:690,y:350});
  assert.ok(route && route.length>2);
  assert.deepEqual(route.at(-1),{x:690,y:350});
  for(const point of route)assert.ok(isDriveable(point),`unsafe waypoint ${JSON.stringify(point)}`);
  for(let i=1;i<route.length;i++) {
    const a=route[i-1],b=route[i];
    for(let t=0;t<=1;t+=.1)assert.ok(isDriveable({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t}));
  }
});
test('rejects pond, clubhouse, café, trees, and map edges', () => {
  for(const point of [{x:530,y:300},{x:140,y:190},{x:820,y:460},{x:375,y:75},{x:-10,y:60},{x:965,y:500}]) {
    assert.equal(findRoute({x:250,y:320},point),null);
  }
});
test('can interrupt a journey and route from an intermediate point', () => {
  const route=findRoute({x:250,y:320},{x:690,y:350});
  const reroute=findRoute(route[20],{x:235,y:420});
  assert.ok(reroute?.length);assert.deepEqual(reroute.at(-1),{x:235,y:420});
});

test('rejects all four greens and their cart-clearance borders', async () => {
  const { puttingGreens, isOnPuttingGreen }=await import('../src/greens.ts');
  for(const polygon of puttingGreens){
    const center={x:polygon.reduce((n,p)=>n+p[0],0)/polygon.length,y:polygon.reduce((n,p)=>n+p[1],0)/polygon.length};
    assert.equal(isDriveable(center),false);
    assert.equal(findRoute({x:250,y:320},center),null);
    for(const [x,y] of polygon){assert.equal(isOnPuttingGreen({x,y}),true);assert.equal(isDriveable({x,y}),false);}
  }
  assert.equal(isDriveable({x:320,y:185}),false,'cart body must not clip the first green');
});
test('routes around each putting green without clipping its clearance boundary', async () => {
  const { isOnPuttingGreen }=await import('../src/greens.ts');
  for(const [start,end] of [
    [{x:230,y:110},{x:335,y:195}],
    [{x:592,y:200},{x:730,y:145}],
    [{x:235,y:400},{x:460,y:470}],
    [{x:675,y:420},{x:665,y:350}],
  ]){
    const route=findRoute(start,end);assert.ok(route,JSON.stringify({start,end}));
    for(let i=1;i<route.length;i++)for(let t=0;t<=1;t+=.05){
      const a=route[i-1],b=route[i];
      assert.equal(isOnPuttingGreen({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t}),false);
    }
  }
});

test('cart route keeps meaningful corners and collapses straight grid runs', async () => {
  const { simplifyRoute, isClearSegment }=await import('../src/navigation.ts');
  const start={x:250,y:320},end={x:690,y:350};
  const raw=findRoute(start,end),smooth=simplifyRoute(start,raw);
  assert.ok(smooth.length<raw.length/2);
  assert.deepEqual(smooth.at(-1),end);
  let previous=start;
  for(const point of smooth){assert.ok(isClearSegment(previous,point));previous=point;}
  const openEnd={x:270,y:330};
  const open=simplifyRoute(start,findRoute(start,openEnd));
  assert.deepEqual(open.at(-1),openEnd);
  assert.deepEqual(simplifyRoute({x:0,y:0},[{x:10,y:0},{x:20,y:0},{x:30,y:10},{x:40,y:20},{x:40,y:30}]),[{x:20,y:0},{x:40,y:20},{x:40,y:30}]);
});
test('cart faces all eight travel directions and holds at rest', async () => {
  const { cartDirection }=await import('../src/navigation.ts');
  [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]].forEach(([dx,dy],i)=>assert.equal(cartDirection(dx,dy,((i+4)%8)),i));
  assert.equal(cartDirection(0,0,5),5);
  assert.equal(cartDirection(1,.48,0),0,'small boundary corrections retain current view');
  assert.equal(cartDirection(1,.7,0),1,'a deliberate turn changes view');
});

test('all sand bunkers and their clearance borders reject cart destinations',async()=>{
  const {sandBunkers,isOnBunker}=await import('../src/bunkers.ts');
  for(const polygon of sandBunkers){
    const center={x:polygon.reduce((n,p)=>n+p[0],0)/polygon.length,y:polygon.reduce((n,p)=>n+p[1],0)/polygon.length};
    assert.equal(isOnBunker(center),true);
    assert.equal(findRoute({x:250,y:320},center),null);
    for(const [x,y] of polygon)assert.equal(isDriveable({x,y}),false);
  }
  assert.equal(isDriveable({x:690,y:340}),false,'old tour destination clips bunker clearance');
});
test('both raw and arcade routes keep the full cart clear of sand',async()=>{
  const {isOnBunker}=await import('../src/bunkers.ts');
  const {simplifyRoute}=await import('../src/navigation.ts');
  const start={x:250,y:320};
  for(const end of [{x:690,y:350},{x:460,y:470},{x:300,y:310}]){
    const raw=findRoute(start,end);assert.ok(raw);
    for(const route of [raw,simplifyRoute(start,raw)]){
      let a=start;
      for(const b of route){
        const steps=Math.ceil(Math.hypot(b.x-a.x,b.y-a.y));
        for(let i=0;i<=steps;i++){
          const t=steps?i/steps:0;
          assert.equal(isOnBunker({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t}),false);
        }
        a=b;
      }
    }
  }
});

test('larger cart clearance applies to every tree and building',async()=>{
  const {treeBounds,buildingBounds}=await import('../src/navigation.ts');
  for(const b of [...treeBounds,...buildingBounds]){
    const cx=(b.left+b.right)/2,cy=(b.top+b.bottom)/2;
    for(const p of [{x:b.left-27,y:cy},{x:b.right+27,y:cy},{x:cx,y:b.top-13},{x:cx,y:b.bottom+13}])assert.equal(isDriveable(p),false);
  }
  assert.equal(isDriveable({x:230,y:310}),false,'old parking position is too close to patio');
  assert.equal(isDriveable({x:250,y:320}),true,'new parking position clears patio');
});
test('the full ground footprint clears trees and buildings throughout a drive and reroute',async()=>{
  const {treeBounds,buildingBounds,simplifyRoute}=await import('../src/navigation.ts');
  const start={x:250,y:320};
  const first=findRoute(start,{x:690,y:350});assert.ok(first);
  const midway=first[Math.floor(first.length/2)];
  const reroute=findRoute(midway,{x:235,y:420});assert.ok(reroute);
  for(const [origin,raw] of [[start,first],[midway,reroute]]){
    let a=origin;
    for(const b of simplifyRoute(origin,raw)){
      const steps=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)));
      for(let i=0;i<=steps;i++)for(let j=0;j<32;j++){
        const angle=j*Math.PI/16;
        const x=a.x+(b.x-a.x)*i/steps+28*Math.cos(angle);
        const y=a.y+(b.y-a.y)*i/steps+14*Math.sin(angle);
        for(const bounds of [...treeBounds,...buildingBounds])assert.ok(x<bounds.left||x>bounds.right||y<bounds.top||y>bounds.bottom,'cart footprint clips obstacle');
      }
      a=b;
    }
  }
});

test('safe diagonal passage reconnects north and south without reducing clearance',async()=>{
  const {isClearSegment}=await import('../src/navigation.ts');
  const a={x:715,y:350},b={x:720,y:345};
  assert.equal(isDriveable({x:a.x,y:b.y}),false);
  assert.equal(isDriveable({x:b.x,y:a.y}),false);
  assert.ok(isClearSegment(a,b),'the actual diagonal swept footprint is clear');
  assert.ok(findRoute(a,b));
  assert.equal(isClearSegment({x:400,y:200},{x:410,y:210}),false,'a true obstacle corner must remain blocked');
});
test('all major course areas support outbound, return, and mid-route journeys',async()=>{
  const {simplifyRoute,isClearSegment}=await import('../src/navigation.ts');
  const parking={x:250,y:320};
  const stops=[{x:335,y:195},{x:550,y:180},{x:730,y:145},{x:830,y:390},{x:460,y:470},{x:160,y:450},{x:250,y:60},{x:850,y:250},{x:460,y:560}];
  for(const stop of stops){
    const outbound=findRoute(parking,stop),home=findRoute(stop,parking);
    assert.ok(outbound&&home,`disconnected area ${JSON.stringify(stop)}`);
    for(const [origin,route] of [[parking,outbound],[stop,home]]){
      let a=origin;
      for(const b of simplifyRoute(origin,route)){assert.ok(isClearSegment(a,b));a=b;}
      assert.ok(findRoute(route[Math.floor(route.length/2)],parking),'must be able to reroute home mid-drive');
    }
  }
});

test('short grid stair steps are removed only when the swept cart path is clear',async()=>{
  const {simplifyRoute,isClearSegment}=await import('../src/navigation.ts');
  const start={x:250,y:320};
  const tidy=simplifyRoute(start,[{x:255,y:320},{x:260,y:325},{x:265,y:325}]);
  assert.deepEqual(tidy,[{x:265,y:325}],'open grass should not produce three rapid direction changes');
  const origin={x:710,y:350},end={x:730,y:345};
  const route=simplifyRoute(origin,findRoute(origin,end));
  let previous=origin;
  for(const point of route){assert.ok(isClearSegment(previous,point),'tight passage must preserve clearance');previous=point;}
  assert.deepEqual(route.at(-1),end);
});

test('off-grid redirects avoid a backwards grid-alignment step when the onward path is clear',async()=>{
  const {simplifyRoute,isClearSegment}=await import('../src/navigation.ts');
  const start={x:251.3,y:320.7},end={x:280,y:330};
  const route=simplifyRoute(start,[{x:250,y:320},end]);
  assert.deepEqual(route,[end]);
  assert.ok(isClearSegment(start,end));
});
