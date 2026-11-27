(() => {
  const troops = [
    {name:'曹軍斥候',kind:'scout',speed:56,attack:4},
    {name:'曹軍刀盾兵',kind:'guard',speed:38,attack:6},
    {name:'曹軍弓手',kind:'archer',speed:46,attack:5},
    {name:'曹營水軍',kind:'sailor',speed:51,attack:6},
    {name:'曹軍驍將',kind:'veteran',speed:39,attack:8},
    {name:'曹軍長槍兵',kind:'spearman',speed:42,attack:6},
    {name:'曹營游擊兵',kind:'raider',speed:60,attack:5},
    {name:'曹軍火衛',kind:'fireguard',speed:36,attack:8},
  ];
  const rosters = [[0,2,5],[6,1,2,0],[3,5,2,1],[7,4,5,2],[4,6,1,5]];
  const stageTitles=['烏林','宴營','連艦','火線','華容'];
  const random = (min,max) => min + Math.floor(Math.random()*(max-min+1));
  function question(stage) {
    const common=2**random(2,5), period=random(2,4);
    switch(stage) {
      case 0: return ['求 '+3*common+' 和 '+5*common+' 的最大公因數。',common,'去掉共同因數後，3 和 5 互質。'];
      case 1: return ['兩數最大公因數為 '+common+'，最小公倍數為 '+15*common+'。其中一數為 '+3*common+'，求另一數。',5*common,'兩數乘積等於最大公因數乘最小公倍數。'];
      case 2: return ['將 '+2*common+' 枝箭與 '+3*common+' 面旗分成最多個相同的補給包，最多幾包？',common,'求箭和旗數量的最大公因數。'];
      case 3: return ['兩盞燈每 '+3*period+' 秒和每 '+5*period+' 秒閃一次，多久後再次同時閃爍？',15*period,'找出兩週期的最小公倍數。'];
      default: return ['物資每 '+2*period+' 件或每 '+3*period+' 件一組都差 1 件，最少有幾件？',6*period-1,'補 1 件後找最小公倍數。'];
    }
  }

  window.createPatrols = ({map, routes, canStand, clearSegment, anchor, freeze, retreat, resume, roadAllowed=()=>true, safeZone=()=>false}) => {
    const markers=document.createElement('div');
    markers.className='patrol-markers';
    markers.setAttribute('aria-hidden','true');
    map.append(markers);
    const dialog=document.createElement('dialog');
    dialog.className='patrol-dialog';
    dialog.setAttribute('aria-labelledby','patrol-title');
    dialog.innerHTML=`<div class="eyebrow">赤壁軍情 · 巡邏突襲</div><h2 id="patrol-title"></h2>
      <div class="patrol-arena"><div class="patrol-hero"></div><span>對陣</span><div class="patrol-foe"></div></div>
      <div class="patrol-health">兵力 <strong></strong></div>
      <p class="patrol-feedback" role="status"></p>
      <form class="patrol-form"><label for="patrol-answer">算出軍令，反擊敵兵</label><p class="patrol-expression"></p>
        <div class="patrol-actions"><input id="patrol-answer" autocomplete="off" maxlength="28" placeholder="整數或次方，如 2^5"><button class="primary" type="submit">確認反擊</button></div></form>
      <button class="patrol-exit" type="button">撤回營地</button>`;
    document.body.append(dialog);
    const find=selector=>dialog.querySelector(selector);
    const form=find('form'), input=find('input'), exit=find('.patrol-exit');
    const message=find('.patrol-feedback');
    const byStage=new Map();
    let stage=-1, enemies=[], active=null, delay=0;
    function roadSegment(from,x,y){
      if(safeZone(x,y)||!clearSegment(from,x,y))return false;
      const steps=Math.max(1,Math.ceil(Math.hypot(x-from.x,y-from.y)/8));
      for(let i=1;i<=steps;i++)if(!roadAllowed(from.x+(x-from.x)*i/steps,from.y+(y-from.y)*i/steps))return false;
      return true;
    }

    function enter(nextStage, position) {
      if(stage===nextStage)return;
      stage=nextStage;
      if(!byStage.has(stage)) {
        const paths=[...routes()];
        const count=stage<3?6:8;
        const spawned=[];
        while(paths.length && spawned.length<count) {
          const [path]=paths.splice(random(0,paths.length-1),1);
          const [from,to]=path;
          const spawn=[Math.random(),.5,.25,.75].map(phase=>({
            x:from[0]+(to[0]-from[0])*phase,y:from[1]+(to[1]-from[1])*phase,
          })).find(point=>canStand(point.x,point.y)&&roadAllowed(point.x,point.y)&&!safeZone(point.x,point.y));
          if(!spawn)continue;
          const {x,y}=spawn;
          const available=rosters[stage];
          const troop=troops[available[spawned.length%available.length]];
          spawned.push({...troop,name:stageTitles[stage]+' · '+troop.name,id:'patrol-'+spawned.length,x,y,path,target:random(0,1),walking:true});
        }
        byStage.set(stage,spawned);
      }
      enemies=byStage.get(stage);
      // Give the player time to orient if a saved position is close to a new patrol.
      delay=enemies.some(enemy=>Math.hypot(enemy.x-position.x,enemy.y-position.y)<55)?2:0.5;
      markers.replaceChildren();
      for(const enemy of enemies) {
        const marker=document.createElement('div');
        marker.className='patrol-marker';
        const label=document.createElement('span');
        label.textContent=enemy.name;
        marker.append(label);
        markers.append(marker);
        enemy.marker=marker;
      }
    }

    function attack(opening) {
      const result=window.villageGame.patrolHit(active.enemy.attack);
      find('.patrol-health strong').textContent=result.hp+' / 100';
      message.textContent=opening?`${active.enemy.name}先發突襲！`:'反擊落空，敵兵再次進攻！';
      message.textContent+=result.blocked?'掩護擋下這一擊。':`兵力 −${result.loss}。`;
      if(!opening)message.textContent+=active.drill[2];
      dialog.classList.remove('patrol-strike');
      void dialog.offsetWidth;
      dialog.classList.add('patrol-strike');
      active.foeModel?.strike();
      if(result.hp===0) {
        message.textContent+='部隊需要撤回營地整補。';
        form.hidden=true;
        exit.focus();
      }
    }

    function engage(enemy,objective) {
      freeze();
      active={enemy,objective,round:1,drill:question(stage),won:false};
      find('h2').textContent=enemy.name+'來襲';
      const leader=window.currentBattleLeader();
      const visible=()=>dialog.open;
      active.heroModel=window.mountPatrolFighter(find('.patrol-hero'),leader,window.characterDesign.profile(leader).name,1,visible);
      active.foeModel=window.mountPatrolFighter(find('.patrol-foe'),window.characterDesign.key(enemy),enemy.name,-1,visible);
      find('.patrol-expression').textContent=active.drill[0];
      dialog.classList.remove('patrol-won');
      form.hidden=false;
      input.value='';
      exit.textContent='撤回營地';
      dialog.showModal();
      if(objective?.rounds>1){
        find('.patrol-health strong').textContent=window.villageGame.state().hp+' / 100';
        message.textContent='護衛 1 / '+objective.rounds+' · 答錯須重新挑戰護衛任務。';
      }else attack(true);
      if(!form.hidden)input.focus();
    }

    function finish() {
      if(!active)return;
      const won=active.won;
      active.heroModel?.stop();
      active.foeModel?.stop();
      active=null;
      delay=4;
      dialog.close();
      if(won)resume();else {
        window.villageGame.patrolRegroup();
        retreat();
      }
    }

    form.addEventListener('submit',event=>{
      event.preventDefault();
      if(!active||active.won||form.hidden)return;
      const answer=window.villageGame.parseMathAnswer(input.value);
      if(!answer){message.textContent='請輸入整數或單一次方，例如 2^5 或 2⁵。';input.focus();return;}
      if(answer.value!==active.drill[1]){
        attack(false);
        if(active.objective?.rounds>1){
          message.textContent+=' 周瑜遭到威脅，請重新挑戰護衛任務。';
          form.hidden=true;
          exit.textContent='重新整隊';
          exit.focus();
        }else input.select();
        return;
      }
      if(active.round<(active.objective?.rounds??1)){
        active.round++;
        active.drill=question(stage);
        find('.patrol-expression').textContent=active.drill[0];
        message.textContent='護衛 '+active.round+' / '+active.objective.rounds;
        input.value='';
        active.heroModel?.strike();
        return;
      }
      active.won=true;
      if(active.objective)active.objective.complete();
      else {
        active.enemy.marker.remove();
        enemies.splice(enemies.indexOf(active.enemy),1);
      }
      const gain=window.villageGame.patrolReward();
      const mission=window.villageGame.markAllyTask('patrol');
      dialog.classList.add('patrol-won');
      active.heroModel?.strike();
      message.textContent=`已擊退${active.enemy.name}。銅錢 +12。`+(gain?`謀略 +${gain}。`:'謀略已滿。')+(mission?'趙雲的招募任務已達成。':'');
      form.hidden=true;
      exit.textContent='繼續探索';
      exit.focus();
    });
    exit.addEventListener('click',finish);
    dialog.addEventListener('cancel',event=>{event.preventDefault();finish();});

    function step(dt,position,hp) {
      if(active)return;
      delay=Math.max(0,delay-dt);
      for(const enemy of enemies){
        const range=Math.hypot(enemy.x-position.x,enemy.y-position.y);
        const alertRange=enemy.pursuing?190:145;
        enemy.pursuing=hp>0&&delay===0&&range<=alertRange&&roadSegment(enemy,position.x,position.y);
        enemy.marker.classList.toggle('pursuing',enemy.pursuing);
        if(enemy.pursuing&&range<=34){engage(enemy);break;}

        const [targetX,targetY]=enemy.pursuing?[position.x,position.y]:enemy.path[enemy.target];
        const dx=targetX-enemy.x,dy=targetY-enemy.y,distance=Math.hypot(dx,dy);
        if(distance<2){
          if(!enemy.pursuing)enemy.target=1-enemy.target;
          continue;
        }
        const speed=enemy.pursuing?enemy.speed+65:enemy.speed;
        const travel=Math.min(speed*dt,distance);
        const x=enemy.x+dx/distance*travel,y=enemy.y+dy/distance*travel;
        if(roadSegment(enemy,x,y)){
          enemy.x=x;
          enemy.y=y;
          enemy.heading=Math.atan2(dx,dy);
          if(enemy.pursuing&&Math.hypot(x-position.x,y-position.y)<=34){engage(enemy);break;}
        }else if(!enemy.pursuing)enemy.target=1-enemy.target;
      }
    }
    return {enter,step,challenge:(name,rounds,complete)=>engage({name,kind:'guard',attack:6},{rounds,complete}),actors:()=>enemies,draw:()=>enemies.forEach(enemy=>anchor(enemy.marker,enemy)),isOpen:()=>dialog.open};
  };
})();
