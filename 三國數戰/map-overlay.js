/* M 鍵全景圖：顯示整張地圖、道路與地點；點選標記或道路即沿道路自動前往。 */
(()=>{
const el=id=>document.getElementById(id),V=()=>window.villageInternals;
document.body.insertAdjacentHTML('beforeend','<div id="world-map" class="world-map" role="dialog" aria-modal="true" aria-labelledby="world-map-title" hidden><div class="world-map-card"><div class="world-map-head"><div><h2 id="world-map-title"></h2><p>點選標記或道路，沿道路自動前往。M 或 Esc 關閉。</p></div><button id="world-map-close" type="button" aria-label="關閉全景圖">×</button></div><div class="world-map-stage"><svg id="world-map-svg" role="group" aria-label="全景地圖"></svg></div><div class="world-map-legend"><span class="k-you">目前位置</span><span class="k-mission">主線任務</span><span class="k-shop">商店</span><span class="k-person">人物</span><span class="k-event">奇遇</span><span class="k-animal">動物</span></div></div></div>');
el('village-map').insertAdjacentHTML('beforeend','<button id="map-fab" type="button" aria-label="開啟全景圖">全景圖</button>');
const box=el('world-map'),svg=el('world-map-svg');let items=[],raf=0;
const kind=n=>n.shop?'shop':n.animal?'animal':n.kind&&String(n.kind).startsWith('encounter')||String(n.id).startsWith('encounter')?'event':'person';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function build(){
  const v=V(),w=v.world();el('world-map-title').textContent=w.name+' 全景圖';
  svg.setAttribute('viewBox',`0 0 ${w.width} ${w.depth}`);
  const roads=[...w.roads,...w.missionPaths].map(p=>p.map(q=>q.join(',')).join(' '));
  const line=(c,sw)=>roads.map(p=>`<polyline points="${p}" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
  const rect=(b,f)=>`<rect x="${b.x-b.w/2}" y="${b.z-b.d/2}" width="${b.w}" height="${b.d}" rx="10" fill="${f}"/>`;
  items=v.npcs();
  const pts=items.map((n,i)=>{const k=kind(n);return `<g class="wm-pt k-${k}" transform="translate(${n.x} ${n.y})" data-i="${i}" tabindex="0" role="button" aria-label="前往${esc(n.name)}"><circle class="hit" r="64"/><circle class="dot" r="${k==='animal'?15:32}"/>${k==='animal'?'':`<text y="-46">${esc(n.name)}</text>`}</g>`}).join('');
  const o=w.objectives[v.operation()];
  const mission=o?`<g class="wm-pt k-mission" transform="translate(${o.x} ${o.y})" data-mission="1" tabindex="0" role="button" aria-label="前往${esc(o.title)}"><circle class="hit" r="70"/><circle class="dot" r="38"/><text class="bang" y="17">!</text><text y="-56">${esc(o.title)}</text></g>`:'';
  svg.innerHTML=`<rect width="${w.width}" height="${w.depth}" fill="${w.grass}"/><rect width="${w.width}" height="${w.shore}" fill="${w.water}"/>`+
   (w.trees||[]).map(([x,z,ww,d])=>`<rect x="${x}" y="${z}" width="${ww}" height="${d}" rx="90" fill="#10281d" opacity=".35"/>`).join('')+
   w.harbor.map(d=>rect({x:d.x+d.w/2,z:d.z+d.d/2,w:d.w,d:d.d},'#b59165')).join('')+
   line('#5f4f31',w.roadWidth+14)+line('#e9d8a6',w.roadWidth)+
   w.buildings.map(b=>rect(b,b.roof)).join('')+rect(w.landmark,'#6d5a48')+w.cliffs.map(b=>rect(b,'#4e5249')).join('')+
   '<polyline id="wm-route" fill="none" stroke="#18a98b" stroke-width="22" stroke-dasharray="46 30" stroke-linecap="round" stroke-linejoin="round"/>'+pts+mission+
   '<g id="wm-you"><circle r="34"/><path d="M0 -62 L20 -30 L-20 -30Z"/></g>';
}
function frame(){
  const v=V(),p=v.pos(),me=el('wm-you');
  me?.setAttribute('transform',`translate(${p.x} ${p.y}) rotate(${v.heading()*180/Math.PI})`);
  el('wm-route')?.setAttribute('points',v.walking()?v.route().map(q=>q.x+','+q.y).join(' '):'');
  raf=requestAnimationFrame(frame);
}
function open(){
  if(box.hidden===false||!window.overworldActive||V().blocked())return;
  V().releaseKeys();build();box.hidden=false;document.body.classList.add('map-open');frame();el('world-map-close').focus();
}
function close(){if(box.hidden)return;box.hidden=true;document.body.classList.remove('map-open');cancelAnimationFrame(raf);V().focus();}
function pick(e){
  const g=e.target.closest('.wm-pt'),v=V();
  if(g){
    if(g.dataset.mission){const o=v.world().objectives[v.operation()];close();v.approach({...o,id:'mission-marker',name:o.title,objective:true});}
    else{const n=items[Number(g.dataset.i)];close();v.approach(n);}
    return;
  }
  const m=svg.getScreenCTM();if(!m)return;
  const pt=new DOMPoint(e.clientX,e.clientY).matrixTransform(m.inverse());
  close();v.goTo({x:pt.x,y:pt.y});
}
svg.addEventListener('click',pick);
svg.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.closest('.wm-pt')){e.preventDefault();pick(e);}});
el('world-map-close').onclick=close;box.addEventListener('click',e=>{if(e.target===box)close();});
el('open-map').onclick=open;el('map-fab').onclick=open;
window.addEventListener('keydown',e=>{
  if(e.ctrlKey||e.metaKey||e.altKey||e.target.closest?.('input,select,textarea'))return;
  if(e.key==='m'||e.key==='M'){e.preventDefault();box.hidden?open():close();}
  else if(e.key==='Escape'&&!box.hidden){e.preventDefault();close();}
});
})();
