(() => {
const {portrait}=window.characterDesign;
let battleLeader='player', commanderName='';
try{battleLeader=localStorage.getItem('sanguo-village-leader')||'player';}catch{}
const hero=()=>'<canvas class="battle-model" width="480" height="480" role="img" aria-label="'+window.characterDesign.profile(battleLeader).name+'的戰鬥模型" hidden></canvas>'+portrait(battleLeader);
let mainModel;
function animateModel(canvas,id='combat-player',{facing=1,angle=()=>-.45,visible=()=>!canvas.closest('main')?.classList.contains('exploring')}={}){
  let modelFrame=0, attackStarted=-Infinity;
  if(!canvas)return;
  let context;
  try{context=canvas.getContext('2d');}catch{return;}
  if(!context)return;
  const fallback=canvas.nextElementSibling;
  const mesh=window.characterDesign.mesh(id);
  const reducedMotion=matchMedia("(prefers-reduced-motion: reduce)").matches;
  let previous=-Infinity;
  function frame(now){
    if(!canvas.isConnected)return;
    modelFrame=requestAnimationFrame(frame);
    if(!visible()||now-previous<30)return;
    previous=now;
    const elapsed=(now-attackStarted)/850;
    const attack=!reducedMotion&&elapsed>=0&&elapsed<=1?Math.sin(Math.PI*elapsed):0;
    const yaw=angle()+attack*1.65;
    const cosine=Math.cos(yaw),sine=Math.sin(yaw);
    const breath=reducedMotion?0:Math.sin(now/430)*.8;
    const polygons=mesh.map(({points,color,pivot})=>{
      const projected=points.map(([x,y,z])=>{
        if(pivot){
          const swing=attack*1.38-.16;
          const dx=x-pivot[0],dy=y-pivot[1];
          x=pivot[0]+dx*Math.cos(swing)+dy*Math.sin(swing);
          y=pivot[1]+dy*Math.cos(swing)-dx*Math.sin(swing);
        }
        const depth=x*sine+z*cosine;
        const scale=3.35*165/(165-depth);
        return [238+facing*(x*cosine-z*sine+attack*(y*.20+12))*scale,438-(y+depth*.16+breath)*scale,depth];
      });
      return {projected,color,depth:projected.reduce((sum,point)=>sum+point[2],0)/projected.length};
    }).sort((a,b)=>a.depth-b.depth);
    context.clearRect(0,0,480,480);
    if(attack>.16){
      context.save();
      context.globalAlpha=attack*.75;
      context.strokeStyle='#ffc074';
      context.shadowColor='#ff6c28';
      context.shadowBlur=14;
      context.lineWidth=4;
      context.beginPath();
      context.ellipse(254,277,176,51,-.41,-1.1,elapsed*5);
      context.stroke();
      context.restore();
    }
    for(const {projected,color} of polygons){
      context.beginPath();
      projected.forEach(([x,y],index)=>index?context.lineTo(x,y):context.moveTo(x,y));
      context.closePath();
      context.fillStyle='rgb('+color.map(channel=>Math.round(channel*255)).join(',')+')';
      context.fill();
    }
    if(canvas.hidden){
      canvas.hidden=false;
      fallback?.remove();
    }
  }
  modelFrame=requestAnimationFrame(frame);
  return {
    strike(){attackStarted=performance.now();},
    stop(){cancelAnimationFrame(modelFrame);},
  };
}
window.mountPatrolFighter=(container,id,label,facing,visible)=>{
  container.innerHTML='<canvas class="battle-model" width="480" height="480" aria-hidden="true" hidden></canvas>'+portrait(id,label);
  return animateModel(container.firstElementChild,id==='player'?'combat-player':id,{facing,visible});
};
window.mountCharacterPreview=(container,id,label,visible)=>{
  container.innerHTML='<canvas class="npc-model battle-model" width="480" height="480" role="img" hidden></canvas>'+portrait(id,label);
  const canvas=container.firstElementChild;
  canvas.setAttribute('aria-label',label+'的 Q 版 3D 模型');
  return animateModel(canvas,id,{angle:()=>0,visible});
};
window.currentBattleLeader=()=>battleLeader;
const bandit=index=>portrait('enemy-'+index);
window.characterArt={hero,portrait};
const scene=document.querySelector('.landscape');
scene.insertAdjacentHTML('beforeend','<div class="duel-ground"></div><div class="duel-hud"><span id="hero-nameplate">阿帆門下 · 軍師</span><b>對 陣</b><span id="enemy-nameplate"></span></div><div class="fighter hero-fighter" id="hero-fighter"><div class="character-art">'+hero()+'</div></div><div class="fighter enemy-fighter" id="enemy-fighter"></div><div class="battle-slash" aria-hidden="true"></div><div class="battle-pop" id="battle-pop" role="status" aria-live="polite"></div>');
const picker=document.createElement('label');
picker.className='battle-leader';
picker.textContent='出戰角色 ';
const select=document.createElement('select');
picker.append(select);
scene.before(picker);
let party=[];
function drawHero(){
  const art=document.querySelector('#hero-fighter .character-art');
  if(art.dataset.role!==battleLeader){
    art.dataset.role=battleLeader;
    art.innerHTML=hero();
    mainModel?.stop();
    mainModel=animateModel(art.querySelector('canvas'),battleLeader==='player'?'combat-player':battleLeader);
  }
  document.getElementById('hero-nameplate').textContent=battleLeader==='player'?(commanderName||'阿帆門下')+' · 軍師':window.characterDesign.profile(battleLeader).name;
}
window.syncBattleLeader=allies=>{
  party=[{id:'player',name:'年輕軍師'},...allies];
  if(!party.some(member=>member.id===battleLeader))battleLeader='player';
  if([...select.options].map(option=>option.value).join()!==party.map(member=>member.id).join()){
    select.replaceChildren(...party.map(member=>new Option(member.name,member.id)));
  }
  select.value=battleLeader;
  select.disabled=party.length<2;
  drawHero();
};
window.chooseBattleLeader=id=>{
  if(!party.some(member=>member.id===id))return false;
  battleLeader=id;
  select.value=id;
  try{localStorage.setItem('sanguo-village-leader',battleLeader);}catch{}
  drawHero();
  return true;
};
select.onchange=()=>window.chooseBattleLeader(select.value);
let animTimer;
window.battleRender=(stage,index,hp,name)=>{clearTimeout(animTimer);scene.classList.remove('hero-attack','enemy-attack','enemy-defeated','hero-defeated','guard-active');document.getElementById('enemy-fighter').innerHTML=stage===2?'<div class="twin first"><div class="character-art">'+bandit(2)+'</div></div><div class="twin second"><div class="character-art">'+portrait('archer')+'</div></div>':'<div class="character-art">'+bandit(stage)+'</div>';document.getElementById('enemy-nameplate').textContent=window.characterDesign.profile('enemy-'+stage).name;commanderName=name;drawHero();document.getElementById('battle-pop').textContent='';};
window.battleAnimate=(action,final=false)=>{if(action==='hit')mainModel?.strike();clearTimeout(animTimer);scene.classList.remove('hero-attack','enemy-attack','enemy-defeated','hero-defeated','guard-active');void scene.offsetWidth;scene.classList.add(action==='hit'?'hero-attack':action==='guard'?'guard-active':'enemy-attack');const pop=document.getElementById('battle-pop');pop.textContent=action==='hit'?(final?'敵陣擊潰！':'破甲 · 命中！'):action==='guard'?'空城 · 化解！':final?'兵力耗盡':'遭到反擊！';pop.dataset.tone=action;animTimer=setTimeout(()=>{scene.classList.remove('hero-attack','enemy-attack','guard-active');if(final)scene.classList.add(action==='hit'?'enemy-defeated':'hero-defeated');pop.textContent='';},950);};
})();
