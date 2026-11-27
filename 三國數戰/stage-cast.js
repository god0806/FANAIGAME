/* 第 1～4 關的路人換成新人物後，同步改寫該章任務文字裡的人名。 */
(() => {
  const world=window.redCliffsWorld,data=window.redCliffsAdventures;
  if(!world||!data)return;
  const base=world.defaultCast,keys=[...base.districts,...base.locals,...base.encounters];
  const pattern=new RegExp(keys.slice().sort((a,b)=>b.length-a.length).join('|'),'g');
  data.chapters.forEach((chapter,stage)=>{
    if(!stage)return;
    const cast=world.castFor(stage),names=[...cast.districts,...cast.locals,...cast.encounters];
    const map=new Map(keys.map((key,i)=>[key,names[i]]));
    const walk=value=>typeof value==='string'?value.replace(pattern,m=>map.get(m)):Array.isArray(value)?value.map(walk):
      value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([k,v])=>[k,walk(v)])):value;
    data.chapters[stage]=walk(chapter);
  });
})();
