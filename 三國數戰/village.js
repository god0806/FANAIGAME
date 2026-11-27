/* Walkable 3D village, keyboard/touch navigation and proximity dialogue. */
(() => {
const el=id=>document.getElementById(id), main=document.querySelector('main');
main.insertAdjacentHTML('afterbegin',`<nav class="world-tabs" aria-label="遊戲場景"><button id="village-tab" aria-pressed="true">⌂ 村莊探索</button><button id="combat-tab" aria-pressed="false">⚔ 前往戰場</button><span>走訪驛站 · 整備出征</span></nav>`);
document.querySelector('.campaign-brief').insertAdjacentHTML('afterend',`<section id="village" aria-label="村莊探索"><div class="village-heading"><div><span class="eyebrow">RED CLIFFS CAMP · 赤壁軍營</span><h2 id="world-name">赤壁軍營</h2><p id="world-terrain"></p></div><span id="village-resources"></span></div><div class="village-map" id="village-map" tabindex="0" role="group" aria-label="第一人稱村莊。方向鍵或 WASD 移動，滑鼠轉向，E 對話。"><canvas id="village-3d" class="village-scene" aria-hidden="true"></canvas><div id="village-npcs"></div><span class="map-corner">第一人稱 <strong>3D</strong></span><div class="proximity" id="proximity" aria-live="polite">靠近人物，按 E 對話</div></div><div class="village-controls"><div class="movement-pad" aria-label="移動控制"><button data-move="turn-left" aria-label="向左轉">↶</button><button data-move="turn-right" aria-label="向右轉">↷</button><button data-move="up" aria-label="向上走">↑</button><button data-move="strafe-left" aria-label="向左移動">←</button><button data-move="down" aria-label="向下走">↓</button><button data-move="strafe-right" aria-label="向右移動">→</button></div><p>方向鍵 / WASD 沿道路移動 · Shift 跑步 · M 全景圖<br><small>點畫面地面自動走到道路 · 觸控可拖曳轉向 · E 對話</small></p><button id="open-map" type="button">全景圖 (M)</button><button id="mouse-look" type="button" aria-pressed="false">滑鼠轉向</button><button id="side-quest" type="button">支線任務</button><button id="talk" class="primary" disabled>靠近人物交談</button></div><p class="village-tip" id="village-tip">沿商街找武器店、招募所和阿慧藥房。往北可到碼頭登船；紅色標記是巡邏敵兵，靠近會引來追擊。</p></section>`);
document.body.insertAdjacentHTML('beforeend','<dialog id="village-dialog" class="world-dialog" aria-labelledby="npc-speaker"><div class="npc-dialog-head"><div id="npc-portrait"></div><div><div class="eyebrow" id="npc-role"></div><h2 id="npc-speaker"></h2></div><button id="dialog-close" aria-label="結束對話">×</button></div><p id="npc-line" aria-live="polite"></p><div id="npc-choices"></div><small>E / 空白鍵 繼續對話 · Esc 離開</small></dialog>');
const campCharacters=[
  {id:'teacher',name:'阿帆',role:'師長 · 指點迷津'},
  {id:'officer',name:'校尉小蓉',role:'友軍 · 兵力整備'},
  {id:'villager',name:'阿倫',role:'籃球高手 · 糧道消息'},
  {id:'guard',name:'前線守衛',role:'友軍 · 引路出征'},
];
let navigator, world, npcs=[], loadedStage=-1, operation=0, introduced=false, hazardTime=0;
let state=window.villageGame.state(), pos={x:0,y:0},near=null,active=true,destination=null,last=0,walkPhase=0,dialogLines=[],lineIndex=0,currentNpc=null,seen=new Set(),walking=false,choosing=false;
const held=new Set(),map=el('village-map'),dialog=el('village-dialog');
const scene=window.createVillageScene(el('village-3d'));
const minimap=document.createElementNS('http://www.w3.org/2000/svg','svg');
minimap.classList.add('world-minimap');
minimap.setAttribute('aria-hidden','true');
map.append(minimap);
let minimapPlayer;
const positions={};
try { Object.assign(positions,JSON.parse(localStorage.getItem('sanguo-world-v1')||'{}')); } catch {}
const patrols=window.createPatrols({
  map, routes:()=>world.routes, canStand, clearSegment, anchor, roadAllowed:(x,y)=>navigator?.isRoad(x,y)??false,
  safeZone:(x,y)=>Math.hypot(x-world.spawn.x,y-world.spawn.y)<190,
  freeze(){releaseMouse();held.clear();destination=null;walking=false;},
  resume(){map.focus({preventScroll:true});savePosition();},
  retreat(){
    pos={...world.spawn};
    heading=0;
    el('village-tip').textContent='部隊已撤回營地。可向校尉小蓉查詢補給資格。';
    map.focus({preventScroll:true});
    savePosition();
  },
});
let heading=0, proximityId;
const adventureEngine=window.createAdventureEngine({data:window.redCliffsAdventures,read:window.villageGame.readAdventures,write:window.villageGame.writeAdventures});
const adventures=window.createAdventureUI({engine:adventureEngine,stage:()=>state.stage,actors:()=>npcs,
 prepare(){releaseMouse();held.clear();destination=null;choosing=true;},
 portrait:showNpcAppearance,close:finish,go:approach,updated:sync,
 legacy:()=>({...world.sideQuest,done:state.sideProgress===2}),
 legacyGo(){finish();const target=npcs.find(n=>state.sideProgress===0?n.quest:n.device);if(target)approach(target);}
});

function canStand(x,y){
  if(x<25||x>world.width-25||y<25||y>world.depth-25)return false;
  if(y<world.shore&&!world.harbor.some(deck=>x>=deck.x+2&&x<=deck.x+deck.w-2&&y>=deck.z+2&&y<=deck.z+deck.d-2))return false;
  return !world.solids.some(b=>Math.abs(x-b.x)<b.w/2+8&&Math.abs(y-b.z)<b.d/2+8)
    && !world.treeModels.some(tree=>Math.hypot(tree.x-x,tree.z-y)<11)
    && !npcs.some(n=>Math.hypot(n.x-x,n.y-y)<24);
}
function savePosition(){
  if(loadedStage<0)return;
  positions[loadedStage]={...pos,heading,seen:[...seen],operation,introduced,layoutVersion:world.layoutVersion};
  try{localStorage.setItem('sanguo-world-v1',JSON.stringify(positions));}catch{}
}
function npcMarkup(){el('village-npcs').innerHTML=npcs.map(n=>`<button class="village-npc" id="npc-${n.id}" aria-label="與${n.name}對話"><span class="quest-marker">${seen.has(n.id)?'⋯':'!'}</span><span class="walker-label">${n.name}</span></button>`).join('');npcs.forEach(n=>el('npc-'+n.id).onclick=()=>approach(n));}
function show(activeMap){if(!activeMap)releaseMouse();active=activeMap;window.overworldActive=activeMap;held.clear();destination=null;main.classList.toggle('exploring',activeMap);el('village-tab').setAttribute('aria-pressed',String(activeMap));el('combat-tab').setAttribute('aria-pressed',String(!activeMap));if(activeMap){sync();map.focus({preventScroll:true})}else el('prompt').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});}
function loadWorld(stage){
  savePosition();
  world=window.redCliffsWorld.layout(stage);
  world.solids=[...world.buildings,world.landmark,...world.cliffs];
  npcs=[...world.people.map(person=>({...campCharacters.find(n=>n.id===person.id),...person})),
    world.sideQuest,...world.animals.map(a=>({...a,name:a.animal==='goat'?'山羊':'小雞',role:'村落動物'})),
    ...world.encounters,...world.merchants.map(shop=>({...shop,shop:true,role:'赤壁商街 · '+window.redCliffsWorld.shops[shop.id].name}))];
  navigator=window.createRoadNavigator(world,{canStand,clearSegment});
  world.treeModels=world.treeModels.filter(t=>navigator.distance(t.x,t.z)>world.roadWidth/2+t.size*.4);
  const stored=positions[stage];
  operation=Math.max(0,Math.min(2,Math.trunc(stored?.operation)||0));
  introduced=stored?.introduced===true;
  hazardTime=0;
  pos=stored&&stored.layoutVersion===world.layoutVersion&&Number.isFinite(stored.x)&&Number.isFinite(stored.y)&&canStand(stored.x,stored.y)&&navigator.isRoad(stored.x,stored.y)?{x:stored.x,y:stored.y}:{...world.spawn};
  seen=new Set(Array.isArray(stored?.seen)?stored.seen:[]);
  heading=Number.isFinite(stored?.heading)?stored.heading:0;
  destination=null;
  walking=false;
  proximityId=null;
  loadedStage=stage;
  scene.setWorld(world);
  npcMarkup();
  el('village-npcs').insertAdjacentHTML('beforeend','<button class="village-npc mission-marker" id="mission-marker"><span class="quest-marker">!</span><span class="walker-label"></span></button>');
  el('mission-marker').onclick=()=>{const objective=world.objectives[operation];if(objective)approach({...objective,id:'mission-marker',name:objective.title,objective:true});};
  updateOperation();
  el('world-name').textContent=world.name;
  el('world-terrain').textContent=world.terrain;
  minimap.setAttribute('viewBox',`0 0 ${world.width} ${world.depth}`);
  const shops=world.merchants.map(shop=>`<rect x="${shop.x-34}" y="${shop.y-34}" width="68" height="68" rx="12" fill="#ffca80"/>`).join('');
  const forests=world.trees.map(([x,z,w,d])=>`<rect x="${x}" y="${z}" width="${w}" height="${d}" rx="80" fill="#3b6450"/>`).join('');
  const paths=[...world.roads,...world.missionPaths].map(path=>'<polyline points="'+path.map(pair=>pair.join(",")).join(" ")+'" fill="none" stroke="#ffe4a9" stroke-width="22"/>').join("");
  const bridges=world.harbor.map(deck=>`<rect x="${deck.x}" y="${deck.z}" width="${deck.w}" height="${deck.d}" fill="#b59165"/>`).join('');
  minimap.innerHTML=`<rect width="100%" height="100%" fill="#6a8058"/><rect width="100%" height="${world.shore}" fill="${world.water}"/>${forests}${bridges}${paths}${shops}<polyline class="walking-route" fill="none" stroke="#7fffe0" stroke-width="14" stroke-linejoin="round"/><circle r="28" fill="#fff8ce" stroke="#233c32" stroke-width="10"/>`;
  minimapPlayer=minimap.querySelector('circle');
}
function sync(){
  state=window.villageGame.state();
  if(loadedStage!==state.stage)loadWorld(state.stage);
  patrols.enter(state.stage,pos);
  window.syncBattleLeader(state.allies);
  updateOperation();
  adventures.refresh();
  el('village-resources').textContent=`兵力 ${state.hp}/100 · 謀略 ${state.mp}/100 · 銅錢 ${state.coins}`;
  el('combat-tab').textContent='⚔ '+state.chapter;
}
function updateOperation(){
  const marker=el('mission-marker'), objective=world.objectives[operation];
  marker.hidden=!objective;
  if(objective)marker.querySelector('.walker-label').textContent=objective.title;
  el('village-tip').textContent=objective?'任務 '+(operation+1)+' / 3 · '+objective.title+'。可點選地圖上的驚嘆號前往。':'任務 3 / 3 · 前往戰場，迎戰'+window.campaignChapter(state.stage).enemy+'。';
}
function finishOperation(objective){
  operation++;
  savePosition();
  updateOperation();
  el('village-tip').textContent=objective.result+' '+el('village-tip').textContent;
}
function openFront(){
  releaseMouse();
  if(operation<2){
    show(true);
    const objective=world.objectives[operation];
    approach({...objective,id:'mission-marker',name:objective.title,objective:true});
    return;
  }
  if(introduced){show(false);return;}
  const chapter=window.campaignChapter(state.stage);
  let turn=0;
  function showLine(){
    const [speaker,words]=chapter.dialogue.slice(turn,turn+2);
    const id=speaker==='周瑜'?'zhouYu':speaker==='蔣幹'?'jiangGan':speaker==='主角'?'player':'enemy-'+state.stage;
    el('npc-speaker').textContent=speaker;
    el('npc-role').textContent='戰前對峙';
    showNpcAppearance(id,speaker);
    el('npc-line').textContent='「'+words+'」';
    el('npc-choices').replaceChildren();
    if(turn+2<chapter.dialogue.length)addChoice('繼續',()=>{turn+=2;showLine();},true);
    else addChoice('開始首領戰',()=>{introduced=true;savePosition();finish();show(false);},true);
  }
  choosing=true;
  showLine();
  dialog.showModal();
}
window.villageSync=sync;
window.villageShow=activeMap=>activeMap?show(true):openFront();
function clearSegment(from,x,y){
  const dx=x-from.x,dy=y-from.y;
  for(const building of world.solids){
    let enter=0,leave=1;
    for(const [origin,delta,center,radius] of [[from.x,dx,building.x,building.w/2+8],[from.y,dy,building.z,building.d/2+8]]){
      if(!delta){
        if(Math.abs(origin-center)>=radius){enter=Infinity;break;}
        continue;
      }
      const a=(center-radius-origin)/delta,b=(center+radius-origin)/delta;
      enter=Math.max(enter,Math.min(a,b));
      leave=Math.min(leave,Math.max(a,b));
    }
    if(enter<leave)return false;
  }
  const steps=Math.max(1,Math.ceil(Math.hypot(dx,dy)/2));
  for(let i=1;i<=steps;i++)if(!canStand(from.x+dx*i/steps,from.y+dy*i/steps))return false;
  return true;
}
let lastRoute=[];
function goTo(point){
  held.clear();
  let target={x:point.x,y:point.y};
  if(!navigator.isRoad(target.x,target.y)){
    let best=null;
    for(let r=16;r<=520&&!best;r+=16)for(let a=0;a<24;a++){const x=point.x+Math.cos(a*Math.PI/12)*r,y=point.y+Math.sin(a*Math.PI/12)*r;if(navigator.isRoad(x,y)&&canStand(x,y)){best={x,y};break;}}
    if(best)target=best;
  }
  const route=navigator.plan(pos,target);
  if(route?.path.length){
    lastRoute=[{...pos},...route.path];
    const path=route.path;
    destination={...path.shift(),path};
    minimap.querySelector('.walking-route')?.setAttribute('points',lastRoute.map(p=>p.x+','+p.y).join(' '));
    el('village-tip').textContent='沿道路前往指定地點。按方向鍵可取消自動行走。';
  }else el('village-tip').textContent='那裡沒有道路可以抵達，請點選道路或全景圖上的標記。';
}
function approach(npc){
  map.focus({preventScroll:true});
  held.clear();
  destination=null;
  if(Math.hypot(npc.x-pos.x,npc.y-pos.y)<=72){talk(npc);return;}
  const route=navigator.plan(pos,npc);
  if(route?.path.length){
    const points=[{...pos},...route.path];lastRoute=points;
    const path=route.path;
    destination={...path.shift(),path,npc};
    const preview=minimap.querySelector('.walking-route');
    if(preview)preview.setAttribute('points',points.map(p=>p.x+','+p.y).join(' '));
    el('village-tip').textContent='沿道路前往'+npc.name+'。可用方向鍵取消自動行走；小地圖青線為行走路線。';
    return;
  }
  el('village-tip').textContent='找不到安全的道路連接。請先走到附近道路，再選擇目標。';
}

function anchor(node, actor) {
  const lift=actor.y<world.shore?6:0;
  const top=scene.project(actor.x, (actor.id==='ally-0'?106:actor.id==='scout'?80:95)+lift, actor.y);
  const foot=scene.project(actor.x,lift,actor.y);
  node.hidden=top.depth<18||top.depth>600||top.x<-20||top.x>map.clientWidth+20||foot.y<20||top.y>map.clientHeight;
  node.style.left=top.x+'px';
  node.style.top=foot.y+'px';
  node.style.height=Math.max(22,foot.y-top.y)+'px';
  node.style.zIndex=Math.round(actor.y/world.depth*500);
}
function draw(time=0){
  scene.render([...npcs,...patrols.actors()],time,pos,heading);
  const objective=world.objectives[operation];
  if(objective)anchor(el('mission-marker'),objective);
  minimapPlayer.setAttribute('cx',pos.x);
  minimapPlayer.setAttribute('cy',pos.y);

  npcs.forEach(n=>anchor(el('npc-'+n.id),n));
  patrols.draw();
  minimap.querySelector('.walking-route')?.setAttribute('visibility',destination?'visible':'hidden');
  const closest=npcs.map(n=>({n,d:Math.hypot(n.x-pos.x,n.y-pos.y)})).sort((a,b)=>a.d-b.d)[0];
  near=closest.d<=100?closest.n:null;
  npcs.forEach(n=>el('npc-'+n.id).classList.toggle('nearby',n===near));
  if(proximityId===near?.id)return;
  proximityId=near?.id;
  el('proximity').textContent=near?`E / 空白鍵 · 與${near.name}對話`:'靠近人物，按 E 對話';
  el('talk').disabled=!near;
  el('talk').textContent=near?'與'+near.name+'交談':'靠近人物交談';
}
const canWalk=(x,y)=>canStand(x,y)&&(navigator.isRoad(x,y)||navigator.distance(x,y)<=navigator.distance(pos.x,pos.y)+.01);
function move(dx,dy){const distance=Math.hypot(dx,dy);const steps=Math.max(1,Math.ceil(distance/4));let changed=false;for(let i=0;i<steps;i++){if(dx&&canWalk(pos.x+dx/steps,pos.y)){pos.x+=dx/steps;changed=true}if(dy&&canWalk(pos.x,pos.y+dy/steps)){pos.y+=dy/steps;changed=true}}return changed;}
function loop(time){
  const dt=Math.min((time-last)/1000||0,.1);
  last=time;
  if(active&&!dialog.open&&!patrols.isOpen()&&!el('modal').open&&!document.hidden){
    const side=Number(held.has('strafe-right'))-Number(held.has('strafe-left'));
    const forward=Number(held.has('up'))-Number(held.has('down'));
    heading+=(Number(held.has('turn-right'))-Number(held.has('turn-left')))*1.9*dt;
    let dx=Math.cos(heading)*side+Math.sin(heading)*forward;
    let dy=Math.sin(heading)*side-Math.cos(heading)*forward;
    if(!dx&&!dy&&destination){
      dx=destination.x-pos.x;dy=destination.y-pos.y;
      if(Math.hypot(dx,dy)<.001){
        const route=destination;
        const next=route.path?.shift();
        destination=next?{...next,path:route.path,npc:route.npc}:null;
        if(!next&&route.npc){talk(route.npc);requestAnimationFrame(loop);return;}
        dx=dy=0;
      }else if(destination.npc){heading=Math.atan2(dx,-dy);}
    }
    const length=Math.hypot(dx,dy);
    const baseSpeed=state.stage===4&&pos.y<world.spawn.y-55?110:170;
    const speed=baseSpeed*(held.has("sprint")?1.8:1);
    const travel=Math.min(destination?length:Infinity,speed*dt);
    if(length&&destination){
      const x=pos.x+dx/length*travel,y=pos.y+dy/length*travel;
      walking=travel>0&&clearSegment(pos,x,y);
      if(walking)pos={x,y};
    }else walking=length>0&&move(dx/length*travel,dy/length*travel);
    if(length&&travel&&destination&&!walking)destination=null;

    if(walking){
      walkPhase+=dt;
      if(walkPhase>.5){savePosition();walkPhase=0;}
    }
    const onDeck=pos.y<world.shore;
    if(onDeck)hazardTime+=dt;
    const fireRadius=Math.max(72,170-hazardTime*2.2);
    if(state.stage===3&&onDeck&&Math.hypot(pos.x-world.port,pos.y-(world.shore-174))>fireRadius&&hazardTime>8&&state.hp>8){
      const second=Math.floor(hazardTime);
      if(second!==Math.floor(hazardTime-dt)&&second%3===0){
        window.villageGame.patrolHit(4);
        el('village-tip').textContent='火線正在收縮，請往甲板中央移動。';
      }
    }
    if(state.stage===2&&onDeck&&length&&!walking&&destination===null&&state.hp>8){
      const second=Math.floor(hazardTime);
      if(second!==Math.floor(hazardTime-dt)&&second%2===0){
        window.villageGame.patrolHit(3);
        el('village-tip').textContent='踩到甲板邊緣，落水擦傷。';
      }
    }
    patrols.step(dt,pos,state.hp);
    draw(time);
  }
  requestAnimationFrame(loop);
}
const directions={Shift:'sprint',ArrowUp:'up',w:'up',W:'up',ArrowDown:'down',s:'down',S:'down',ArrowLeft:'strafe-left',a:'strafe-left',A:'strafe-left',ArrowRight:'strafe-right',d:'strafe-right',D:'strafe-right'};
map.addEventListener('keydown',e=>{if(!active||dialog.open||el('modal').open)return;if(e.target.closest('button')&&['Enter',' '].includes(e.key))return;if(directions[e.key]){e.preventDefault();held.add(directions[e.key]);destination=null}else if(['e','E',' ','Enter'].includes(e.key)){e.preventDefault();if(!e.repeat&&near)talk(near)}});
window.addEventListener('keyup',e=>{if(directions[e.key])held.delete(directions[e.key])});window.addEventListener('blur',()=>{held.clear();destination=null;savePosition()});document.addEventListener('visibilitychange',()=>{held.clear();destination=null;savePosition()});
const mouseLook=el("mouse-look");
function releaseMouse(){
  if(document.pointerLockElement===map)document.exitPointerLock();
}
mouseLook.onclick=async()=>{
  if(document.pointerLockElement===map){releaseMouse();return;}
  map.focus({preventScroll:true});
  try{
    if(!map.requestPointerLock)throw new Error("Pointer lock unavailable");
    await map.requestPointerLock();
  }catch{el("village-tip").textContent="可按住滑鼠拖曳畫面轉向。";}
};
document.addEventListener("pointerlockerror",()=>{
  el("village-tip").textContent="可按住滑鼠拖曳畫面轉向。";
});
document.addEventListener("pointerlockchange",()=>{
  const locked=document.pointerLockElement===map;
  mouseLook.setAttribute("aria-pressed",String(locked));
  mouseLook.textContent=locked?"Esc 釋放滑鼠":"滑鼠轉向";
  map.classList.toggle("mouse-looking",locked);
  held.clear();
  if(locked)destination=null;
  else savePosition();
});
document.addEventListener("mousemove",event=>{
  if(document.pointerLockElement===map&&active&&!dialog.open&&!patrols.isOpen()&&!el("modal").open){
    heading+=event.movementX*.004;
    destination=null;
  }
});
let drag=null;
map.addEventListener('pointerdown',e=>{
  if(document.pointerLockElement===map)return;
  if(!e.isPrimary||e.button!==0||e.target.closest('button'))return;
  map.focus({preventScroll:true});
  map.setPointerCapture(e.pointerId);
  drag={id:e.pointerId,x:e.clientX,heading};
  destination=null;
});
map.addEventListener('pointermove',e=>{
  if(drag?.id!==e.pointerId)return;
  if(Math.abs(e.clientX-drag.x)>5)drag.turned=true;
  if(drag.turned)heading=drag.heading-(e.clientX-drag.x)*.007;
});
map.addEventListener('pointerup',e=>{
  if(drag?.id!==e.pointerId)return;
  if(!drag.turned){
    const rect=el('village-3d').getBoundingClientRect();
    const point=scene.pick(e.clientX-rect.left,e.clientY-rect.top);
    if(point)goTo(point);
  }
  drag=null;
  savePosition();
});
map.addEventListener('lostpointercapture',()=>{drag=null;});

document.querySelectorAll('[data-move]').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();if(!active||dialog.open)return;b.setPointerCapture(e.pointerId);held.add(b.dataset.move);destination=null;map.focus({preventScroll:true})});const stop=()=>held.delete(b.dataset.move);b.addEventListener('pointerup',stop);b.addEventListener('pointercancel',stop);b.addEventListener('lostpointercapture',stop);b.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();held.add(b.dataset.move)}});b.addEventListener('keyup',stop);b.addEventListener('blur',stop)});
let npcPreview;
dialog.addEventListener('close',()=>{if(!dialog.open){npcPreview?.stop();npcPreview=null;}});
function showNpcAppearance(id,name){
  npcPreview?.stop();
  npcPreview=null;
  const container=el('npc-portrait');
  const showModel=id==='villager'||id==='inn';
  container.classList.toggle('npc-portrait-3d',showModel);
  if(showModel&&window.mountCharacterPreview){
    npcPreview=window.mountCharacterPreview(container,id,name,()=>dialog.open);
  }else container.innerHTML=window.characterArt.portrait(id,name);
}
function finish(){dialog.close();held.clear();map.focus({preventScroll:true});savePosition()}
function line(){choosing=false;el('npc-line').textContent=dialogLines[lineIndex];el('npc-choices').innerHTML='';const next=document.createElement('button');next.className='primary';next.textContent=lineIndex<dialogLines.length-1?'繼續 →':'繼續交談 →';next.onclick=()=>{if(lineIndex<dialogLines.length-1){lineIndex++;line()}else choices()};el('npc-choices').append(next);next.focus()}
function addChoice(label,fn,primary=false){const b=document.createElement('button');b.textContent=label;b.className=primary?'primary':'dialog-choice';b.onclick=fn;el('npc-choices').append(b)}
function practice(){
  const drills=[
  [
    "18 和 24 的最大公因數是多少？",
    [
      3,
      6,
      12
    ],
    6,
    "共同質因數的乘積是 2 × 3＝6。"
  ],
  [
    "兩數最大公因數是 6、最小公倍數是 36。兩數乘積是多少？",
    [
      42,
      108,
      216
    ],
    216,
    "6 × 36＝216。"
  ],
  [
    "24 支筆與 36 本筆記簿最多可分成幾個相同的禮盒？",
    [
      4,
      6,
      12
    ],
    12,
    "最大公因數為 12。"
  ],
  [
    "每 6 秒與每 8 秒閃一次的信號，多久再次同時閃？",
    [
      12,
      24,
      48
    ],
    24,
    "最小公倍數為 24。"
  ],
  [
    "x 除以 4 餘 3、除以 5 餘 4，最小的正整數 x 是多少？",
    [
      9,
      19,
      21
    ],
    19,
    "x＋1 是 20 的倍數。"
  ]
];
  const [question,options,answer,explanation]=drills[state.stage];
  el('npc-line').textContent=question;
  el('npc-choices').replaceChildren();
  options.forEach(value=>addChoice(String(value),()=>{
    const mission=value===answer && window.villageGame.markAllyTask('practice');
    el('npc-line').textContent=(value===answer?'答對了！':'再想一想。')+explanation+(mission?' 諸葛亮的招募任務已達成。':'');
    el('npc-choices').replaceChildren();
    addChoice('回到對話選項',choices,true);
    el('npc-choices').querySelector('button').focus();
  }));
  el('npc-choices').querySelector('button').focus();
}
function dialogResult(text, label='結束對話') {
  el('npc-line').textContent=text;
  el('npc-choices').replaceChildren();
  addChoice(label,finish,true);
  el('npc-choices').querySelector('button').focus();
}
function choices() {
  choosing=true;
  el('npc-choices').replaceChildren();
  if(currentNpc.id==='teacher') {
    addChoice('請教當前關卡',()=>dialogResult(window.villageGame.advice(),'記住了，多謝先生'),true);
    addChoice('試做一道練習',practice);
    addChoice('查看軍師手札',()=>{finish();el('journal').click();});
    addChoice('查看同行名冊',()=>{finish();el('party').click();});
  } else if(currentNpc.id==='officer') {
    addChoice('整備部隊，恢復兵力',()=>dialogResult(window.villageGame.heal(),'整備完畢'),true);
    if(state.stage===2 && state.missionProgress===1) {
      addChoice('回報水寨情報',()=>{
        if(window.villageGame.markAllyTask('report')) {
          dialogResult('我會將情報轉交魯肅。魯肅的招募任務已達成。');
        }
      });
    }
  } else if(currentNpc.id==='guard') {
    addChoice('出發迎戰 · '+state.chapter,()=>{finish();openFront();},true);
    addChoice('留在村中準備',finish);
  } else if(currentNpc.quest){
    if(state.sideProgress===0)addChoice('接受支線',()=>{
      window.villageGame.acceptSideQuest();
      dialogResult('已接下「'+world.sideQuest.title+'」。請前往'+world.sideQuest.mechanism+'。');
    },true);
  } else if(currentNpc.lines){
    addChoice('查看本章軍情',()=>dialogResult(window.campaignChapter(state.stage).scene),true);
  } else {
    addChoice('聽聽糧道消息',()=>{
      const report=window.villageGame.markAllyTask('intel');
      const intel=window.campaignChapter(state.stage).intel;
      dialogResult(intel+(report?' 請將這份水寨情報帶給校尉小蓉。':''),'我記下了');
    },true);
  }
  if(currentNpc.id!=='guard')addChoice('結束對話',finish);
  el('npc-choices').querySelector('button')?.focus();
}
function shopMenu(shop, message){
  sync();
  const store=window.redCliffsWorld.shops[shop.id];
  el('npc-role').textContent='赤壁商街 · 銅錢 '+state.coins;
  el('npc-speaker').textContent=store.keeper;
  showNpcAppearance(shop.id,shop.name);
  el('npc-line').textContent=message ?? store.intro ?? '選擇要購買的物品。';
  const choices=el('npc-choices');
  choices.replaceChildren();
  if(shop.id==='supplies')addChoice('查看招募名冊',()=>{finish();el('party').click();});
  for(const item of store.items){
    const button=document.createElement('button');
    button.type='button';
    button.className='shop-item';
    const title=document.createElement('strong');
    title.textContent=item.name+' · '+item.price+' 銅錢';
    const detail=document.createElement('small');
    const unavailable=item.bonus&&state.weaponBonus>=item.bonus?'已持有同級或更強武器':
      item.heal&&state.hp===100?'兵力已滿':state.coins<item.price?'銅錢不足':'';
    detail.textContent=item.text+(unavailable?' '+unavailable+'。':'');
    button.append(title,detail);
    button.disabled=Boolean(unavailable);
    button.onclick=()=>{
      if(window.villageGame.buyItem(shop.id,item.id))shopMenu(shop,'已購買「'+item.name+'」。'+item.text);
    };
    choices.append(button);
  }
  addChoice('離開店鋪',finish);
  choosing=true;
  if(!dialog.open)dialog.showModal();
  choices.querySelector('button:not(:disabled)')?.focus();
}
function talk(n,normal=false){if(!active||dialog.open)return;
  heading=Math.atan2(n.x-pos.x,pos.y-n.y);n.heading=Math.atan2(pos.x-n.x,pos.y-n.y);
  if(!normal&&adventures.interact(n,()=>talk(n,true))){sync();draw(performance.now());return;}
  releaseMouse();
  if(n.device){
    held.clear();destination=null;choosing=true;
    el('npc-speaker').textContent=n.name;
    el('npc-role').textContent='支線 · '+n.title;
    el('npc-portrait').replaceChildren();
    dialog.showModal();
    if(state.sideProgress!==1){
      dialogResult(state.sideProgress===2?n.result:'請先向附近的村中信使接下委託。');
      return;
    }
    el('npc-line').textContent=n.prompt;
    el('npc-choices').replaceChildren();
    for(const answer of n.options)addChoice(String(answer),()=>{
      if(window.villageGame.solveSideQuest(answer))dialogResult(n.result+" 獲得 "+n.reward+" 銅錢。");
      else el('npc-line').textContent='機關還沒打開，請再試一次。 '+n.prompt;
    });
    addChoice('離開',finish);
    return;
  }
  if(n.objective){
    held.clear();destination=null;
    if(n.enemy){patrols.challenge(n.enemy,n.rounds,()=>finishOperation(n));return;}
    el('npc-speaker').textContent=n.title;
    el('npc-role').textContent='關卡任務';
    el('npc-portrait').replaceChildren();
    el('npc-line').textContent=n.action+'，完成後即可進行下一項任務。';
    el('npc-choices').replaceChildren();
    addChoice(n.action,()=>{finishOperation(n);dialogResult(n.result);},true);
    choosing=true;dialog.showModal();return;
  }heading=Math.atan2(n.x-pos.x,pos.y-n.y);n.heading=Math.atan2(pos.x-n.x,pos.y-n.y);draw(performance.now());savePosition();if(n.shop){held.clear();destination=null;shopMenu(n);return;}held.clear();destination=null;currentNpc=n;seen.add(n.id);savePosition();el('npc-'+n.id).querySelector('.quest-marker').textContent='⋯';sync();lineIndex=0;el('npc-speaker').textContent=n.name;el('npc-role').textContent=n.role;showNpcAppearance(n.kind||n.id,n.name);const lines={teacher:['徒兒，你來了。先翻開我手上的數學課本，看看因倍數和指數律，等會兒就能用來破陣。','算式就是軍令。先找質因數、共同倍數或餘數，再選擇合適的算法。你也可以試做一題再出征。'],officer:['軍師，運糧隊已在此休整。首次可找我補充兵力。用過之後，要等兵力歸零才能再領補給。'],villager:['我是阿倫，村裡的籃球高手！投籃要看準角度，過江也得看準時機。想知道這一章的前線消息，可以問我。'],guard:[window.campaignChapter(state.stage).scene,'跨出此門，就要以數破陣。若想先回村補給，可隨時按上方的「村莊探索」。']};dialogLines=n.quest?[world.sideQuest.title+' · '+(state.sideProgress===2?world.sideQuest.result:world.sideQuest.greeting)]:n.lines||lines[n.id];dialog.showModal();line()}
el('dialog-close').onclick=finish;dialog.addEventListener('cancel',()=>{held.clear();savePosition()});dialog.addEventListener('close',()=>map.focus({preventScroll:true}));dialog.addEventListener('keydown',e=>{if(['e','E',' '].includes(e.key)&&!e.repeat&&!choosing){e.preventDefault();if(lineIndex<dialogLines.length-1){lineIndex++;line()}else choices()}});el('talk').onclick=()=>{if(near)talk(near)};el('village-tab').onclick=()=>show(true);el('combat-tab').onclick=openFront;
el('side-quest').onclick=()=>{releaseMouse();adventures.journal();};
show(true);draw();requestAnimationFrame(loop);
window.villageInternals={world:()=>world,npcs:()=>npcs,pos:()=>pos,heading:()=>heading,operation:()=>operation,approach,goTo,route:()=>lastRoute,walking:()=>!!destination,
  releaseKeys:()=>held.clear(),blocked:()=>dialog.open||patrols.isOpen()||el('modal').open,isRoad:(x,y)=>navigator.isRoad(x,y),focus:()=>map.focus({preventScroll:true})};
})();



