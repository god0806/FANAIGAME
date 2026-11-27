/* Chapter errands, field encounters and a journal, sharing the village dialog. */
window.createAdventureUI = function(api) {
  const el=id=>document.getElementById(id), engine=api.engine;
  let filter='all';
  const board=document.createElement('section');
  board.className='adventure-tracker';
  board.setAttribute('aria-label','支線追蹤');
  el('village-map').after(board);
  const rewardText=r=>[r?.coins? r.coins+' 銅錢':'',r?.mp?r.mp+' 謀略':'',r?.heal?'回復 '+r.heal+' 兵力':''].filter(Boolean).join(' · ');
  const actor=id=>api.actors().find(n=>n.id===id);
  const targetName=id=>actor(id)?.name||id;
  function button(parent,label,fn,primary=false){
    const b=document.createElement('button');b.type='button';b.textContent=label;b.className=primary?'primary':'dialog-choice';b.onclick=fn;parent.append(b);return b;
  }
  function open(title,role,text,kind){
    api.prepare();
    el('npc-speaker').textContent=title;el('npc-role').textContent=role;el('npc-line').textContent=text;
    el('npc-choices').replaceChildren();
    if(kind)api.portrait(kind,title);else el('npc-portrait').replaceChildren();
    const d=el('village-dialog');if(!d.open)d.showModal();
    return el('npc-choices');
  }
  function focus(){el('npc-choices').querySelector('button:not(:disabled)')?.focus();}
  function go(id){const n=actor(id);if(!n)return;api.close();api.go(n);}
  function entriesAt(id){
    return engine.list(api.stage()).filter(q=>!q.progress.complete&&q.steps[q.progress.accepted?q.progress.index:0]?.target===id);
  }
  function refresh(){
    const list=engine.list(api.stage()),s=engine.summary(api.stage());
    el('side-quest').textContent='支線手札 '+s.complete+' / '+s.total;
    el('side-quest').disabled=false;
    board.replaceChildren();
    const title=document.createElement('strong');title.textContent='江湖見聞 · '+s.complete+'/'+s.total+' 委託 · '+s.eventCount+'/3 奇遇';board.append(title);
    const q=list.find(q=>q.progress.accepted&&!q.progress.complete);
    const info=document.createElement('span');
    info.textContent=q?q.title+' · '+q.steps[q.progress.index].title+'（'+targetName(q.steps[q.progress.index].target)+'）':'沿途人物藏著新委託；打開支線手札，選一段故事。';
    board.append(info);
    if(q)button(board,'前往目標',()=>go(q.steps[q.progress.index].target));
    button(board,'查看手札',journal);
    for(const n of api.actors()){
      const node=el('npc-'+n.id);if(!node)continue;
      const match=entriesAt(n.id),active=match.some(q=>q.progress.accepted);
      const wasActive=node.classList.contains('adventure-target');
      node.classList.toggle('adventure-target',active);
      const mark=node.querySelector('.quest-marker');
      if(match.length)mark.textContent=active?'◆':'!';
      else if(n.encounter!==undefined)mark.textContent=s.eventCount===n.encounter?'?':'⋯';
      else if(wasActive)mark.textContent='⋯';
    }
  }
  function journal(){
    const stage=api.stage(),list=engine.list(stage),summary=engine.summary(stage);
    const root=open('支線手札','本章委託與驛路奇遇','每章 3 段新故事，加上原有機關支線。到人物身邊接受委託；答錯可閱讀提示後重試，完成後自動領取一次獎勵。');
    const tabs=document.createElement('div');tabs.className='adventure-filters';root.append(tabs);
    for(const [id,label] of [['all','全部'],['active','進行中'],['done','已完成']]){
      const b=button(tabs,label,()=>{filter=id;journal();});b.setAttribute('aria-pressed',String(filter===id));
    }
    const shown=list.filter(q=>filter==='all'||(filter==='active'?q.progress.accepted&&!q.progress.complete:q.progress.complete));
    if(!shown.length){const p=document.createElement('p');p.textContent='這裡還沒有任務。可從「全部」查看可接委託。';root.append(p);}
    for(const q of shown){
      const p=q.progress,step=q.steps[Math.min(p.index,q.steps.length-1)];
      const card=document.createElement('article');card.className='adventure-card';root.append(card);
      const h=document.createElement('h3');h.textContent=q.title;card.append(h);
      const status=document.createElement('small');status.textContent=(p.complete?'已完成':p.accepted?'進行中 '+(p.index+1)+'/'+q.steps.length:'可接受')+' · '+q.giver;card.append(status);
      const desc=document.createElement('p');desc.textContent=q.description;card.append(desc);
      const reward=document.createElement('p');reward.textContent='完成獎勵：'+rewardText(q.reward);card.append(reward);
      if(!p.complete)button(card,p.accepted?'前往：'+step.title:'拜訪：'+targetName(q.steps[0].target),()=>go(p.accepted?step.target:q.steps[0].target),true);
      else{
        const history=document.createElement('p');history.className='adventure-ending';
        history.textContent='這段旅程已完成，獎勵已領取。 '+p.choices.map(c=>q.steps[c.step].outcomes[c.option]).join(' ');card.append(history);
      }
    }
    const legacy=document.createElement('article');legacy.className='adventure-card';root.append(legacy);
    const h=document.createElement('h3');h.textContent='機關委託 · '+api.legacy().title;legacy.append(h);
    button(legacy,api.legacy().done?'機關支線已完成':'追蹤原有機關委託',api.legacyGo).disabled=api.legacy().done;
    if(summary.eventCount<3){
      button(root,'前往驛路奇遇 '+(summary.eventCount+1)+'/3',()=>go('encounter-'+summary.eventCount));
    }
    for(const item of engine.history(stage)){
      const card=document.createElement('article');card.className='adventure-card';
      const h=document.createElement('h3');h.textContent='見聞 · '+item.title;
      const p=document.createElement('p');p.textContent=item.choice+'：'+item.text;card.append(h,p);root.append(card);
    }
    button(root,'返回旅途',api.close);focus();
  }
  function result(title,text){
    api.updated();
    const root=open(title,'支線進展',text);
    refresh();button(root,'查看下一步',journal,true);button(root,'返回旅途',api.close);focus();
  }
  function run(q,n){
    const stage=api.stage(),p=engine.progress(stage,q.id);
    if(!p.accepted){
      const root=open(q.title,q.giver+' · 新委託',q.description+' 完成獎勵：'+rewardText(q.reward),n.kind||n.id);
      button(root,'接受委託',()=>{engine.accept(stage,q.id);refresh();run(q,n);},true);button(root,'稍後再來',api.close);focus();return;
    }
    const step=q.steps[p.index];if(!step)return;
    const root=open(q.title,'步驟 '+(p.index+1)+'/'+q.steps.length+' · '+step.title,step.text+(step.prompt?' '+step.prompt:''),n.animal?null:n.kind||n.id);
    function complete(answer){
      const r=engine.advance(stage,q.id,n.id,answer);
      if(!r.ok){el('npc-line').textContent=r.text+' '+(step.prompt||step.text);return;}
      const next=q.steps[engine.progress(stage,q.id).index];
      result(q.title,(r.text||step.explain||step.text)+(r.complete?' 委託完成！獲得 '+rewardText(q.reward)+'。':' 下一步：'+next.title+'，前往'+targetName(next.target)+'。'));
    }
    if(step.type==='talk')button(root,'完成這一步',()=>complete(),true);
    else step.options.forEach((label,i)=>button(root,label,()=>complete(i)));
    button(root,'稍後再繼續',api.close);focus();
  }
  function encounter(n){
    const stage=api.stage(),summary=engine.summary(stage);
    if(n.encounter!==summary.eventCount){
      const root=open('驛路見聞','沿途奇遇',n.encounter<summary.eventCount?'這裡的事情已經告一段落。':'先完成上一處驛路奇遇，再來聽聽這段故事。');
      button(root,'查看手札',journal,true);button(root,'離開',api.close);focus();return;
    }
    const event=engine.event(stage);
    if(!event){result('驛路見聞','本章三次奇遇已完成。');return;}
    const root=open(event.title,'驛路奇遇 · '+(summary.eventCount+1)+'/3',event.text,n.kind);
    event.options.forEach((label,i)=>button(root,label,()=>{
      const r=engine.resolveEvent(stage,event.id,i);
      if(r.ok)result(event.title,r.text+' '+rewardText(r.reward));
    }));
    button(root,'稍後決定',api.close);focus();
  }
  function interact(n,normal){
    if(n.encounter!==undefined){encounter(n);return true;}
    const available=entriesAt(n.id);
    if(!available.length&&!n.animal)return false;
    const root=open(n.name,n.animal?'村落動物':'沿途委託',n.animal?'牠抬頭看著你。附近的居民或許需要你幫忙照顧牠。':'這裡有與你有關的委託。',n.animal?null:n.kind||n.id);
    for(const q of available)button(root,(q.progress.accepted?'繼續：':'接受：')+q.title,()=>run(q,n),true);
    if(!n.animal)button(root,n.shop?'進入店鋪':'一般交談',()=>{api.close();normal();});
    button(root,'離開',api.close);focus();return true;
  }
  return {refresh,journal,interact};
};

