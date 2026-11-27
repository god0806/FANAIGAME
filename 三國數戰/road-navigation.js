/* Paths are constrained to the same road corridors drawn on the map. */
window.createRoadNavigator=function(world,{canStand,clearSegment}) {
  const half=(world.roadWidth||64)/2, segments=[];
  for(const path of [...world.roads,...world.missionPaths]){
    for(let i=1;i<path.length;i++){
      const [ax,ay]=path[i-1],[bx,by]=path[i],dx=bx-ax,dy=by-ay;
      if(dx||dy)segments.push({ax,ay,bx,by,dx,dy,length:dx*dx+dy*dy});
    }
  }
  function projection(x,y,s){
    const t=Math.max(0,Math.min(1,((x-s.ax)*s.dx+(y-s.ay)*s.dy)/s.length));
    return {x:s.ax+t*s.dx,y:s.ay+t*s.dy};
  }
  function distance(x,y){
    let best=Infinity;
    for(const s of segments){
      if(x<Math.min(s.ax,s.bx)-best||x>Math.max(s.ax,s.bx)+best||y<Math.min(s.ay,s.by)-best||y>Math.max(s.ay,s.by)+best)continue;
      const p=projection(x,y,s);best=Math.min(best,Math.hypot(x-p.x,y-p.y));
    }
    return best;
  }
  const isRoad=(x,y)=>distance(x,y)<=half+.01;
  function roadSegment(a,b){
    const count=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/6));
    for(let i=0;i<=count;i++)if(!isRoad(a.x+(b.x-a.x)*i/count,a.y+(b.y-a.y)*i/count))return false;
    return true;
  }
  function plan(from,target){
    const cell=16,queue=[],best=new Map(),cache=new Map(),startOnRoad=isRoad(from.x,from.y);
    const key=(x,y)=>x+','+y;
    const before=(a,b)=>a.rank<b.rank||a.rank===b.rank&&a.cost>b.cost;
    function push(n){
      let i=queue.length;queue.push(n);
      while(i){const p=(i-1)>>1;if(!before(n,queue[p]))break;queue[i]=queue[p];i=p;}queue[i]=n;
    }
    function pop(){
      const n=queue[0],tail=queue.pop();
      if(queue.length){
        let i=0;
        while(i*2+1<queue.length){let c=i*2+1;if(c+1<queue.length&&before(queue[c+1],queue[c]))c++;if(!before(queue[c],tail))break;queue[i]=queue[c];i=c;}
        queue[i]=tail;
      }
      return n;
    }
    const estimate=(x,y)=>Math.max(0,Math.hypot(target.x-x,target.y-y)-62);
    function usable(x,y){
      const k=key(x,y);
      if(!cache.has(k))cache.set(k,canStand(x,y)?distance(x,y):Infinity);
      return cache.get(k);
    }
    // A manually positioned player may first take a short approach to the road.
    const entries=startOnRoad?[from]:segments.map(s=>projection(from.x,from.y,s)).sort((a,b)=>Math.hypot(a.x-from.x,a.y-from.y)-Math.hypot(b.x-from.x,b.y-from.y)).slice(0,12);
    for(const entry of entries){
      const sx=Math.round(entry.x/cell)*cell,sy=Math.round(entry.y/cell)*cell;
      for(let dx=-2;dx<=2;dx++)for(let dy=-2;dy<=2;dy++){
        const x=sx+dx*cell,y=sy+dy*cell,dist=Math.hypot(x-from.x,y-from.y);
        if(dist>260||usable(x,y)>half||!clearSegment(from,x,y)||startOnRoad&&!roadSegment(from,{x,y}))continue;
        const cost=dist,k=key(x,y);if(cost>=(best.get(k)??Infinity))continue;
        best.set(k,cost);push({x,y,cost,rank:cost+estimate(x,y),parent:null});
      }
      if(queue.length&&!startOnRoad)break;
    }
    while(queue.length){
      const point=pop();if(point.cost!==best.get(key(point.x,point.y)))continue;
      if(Math.hypot(target.x-point.x,target.y-point.y)<=62){
        const path=[];for(let p=point;p;p=p.parent)path.push({x:p.x,y:p.y});path.reverse();
        return {path,joinedRoad:!startOnRoad};
      }
      for(const [dx,dy]of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]]){
        const x=point.x+dx*cell,y=point.y+dy*cell,off=usable(x,y);
        if(off>half)continue;
        const cost=point.cost+Math.hypot(dx,dy)*cell*(1+.35*(off/half)**2),k=key(x,y);
        if(cost>=(best.get(k)??Infinity)||!roadSegment(point,{x,y})||!clearSegment(point,x,y))continue;
        best.set(k,cost);push({x,y,cost,rank:cost+estimate(x,y),parent:point});
      }
    }
    return null;
  }
  return {isRoad,roadSegment,plan,distance};
};
