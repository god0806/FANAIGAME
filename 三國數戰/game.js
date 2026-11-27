'use strict';
const $=id=>document.getElementById(id);
const task = (tag,prompt,answer,explain,hint,labels,format) => ({
  tag,prompt,answer,explain,hint,labels,format,type:'number',
});
const choice = (tag,prompt,options,answer,explain,hint) => ({
  tag,prompt,options,answer:[answer],explain,hint,type:'multi',single:true,
});

// A fictionalized campaign inspired by the Three Kingdoms story of Red Cliffs.
const chapters = [
  {
    name: "烏林夜哨・暗潮孤影", topic: "質因數分解與短除法", level: '入門', enemy: "夏侯淵",
    story: "月色沒入濃霧。沿 S 型山谷潛行，熄滅警報烽火，再救出江東暗哨。",
    scene: "曹軍先鋒攔住木柵欄。箭雨穿過松林，夏侯淵在狹道前等候。",
    ending: "暗哨將曹軍佈防圖交給聯軍。圖上有一枚與江東夜宴相同的印記。",
    dialogue: ["夏侯淵","哼！江東鼠輩隻會行這偷雞摸狗之事？踏過此山道，叫你們知曉我大魏鐵騎的厲害！","主角","亂世之中，以寡敵眾非為勇，乃為忠義。今日這烏林夜路，便是爾等的盡頭！"],
    ally: { name: '趙雲', title: '白馬護陣', effect: '回復 20 點兵力', skill: 'heal', line: '烏林的斥候已經回營。若要赴江東，我願護送你一程。' },
    advice: "最大公因數取共同質因數的較小指數，最小公倍數取各質因數的較大指數。",
    intel: "確認糧車補給與各隊接應人數，讓山口的斥候按序撤離。",
    arena: ["烏林山道","夜林伏擊","#142739","#264b43","螢草、落葉與烈火罡風"],
    questions: [
      task("標準分解式", "求 2³ × 3² × 5 與 2² × 3³ × 7 的最大公因數與最小公倍數，以標準分解式表示。", [36,7560], "公因數取共同質因數的較小指數，得 2² × 3²。公倍數取所有質因數的較大指數，得 2³ × 3³ × 5 × 7。", "兩欄都要寫成質因數乘積。", ["最大公因數","最小公倍數"], "factors"),
      task("短除法", "求 180 與 252 的最大公因數與最小公倍數。", [36,1260], "180＝2² × 3² × 5，252＝2² × 3² × 7。最大公因數為 36，最小公倍數為 1260。", "先找出兩數共同的質因數。", ["最大公因數","最小公倍數"], "number"),
      task("質數條件", "A＝2³ × 3² × p，B＝2² × 3³ × 5。若最大公因數是 36，請填一個符合條件的質數 p。", [2], "p＝2 或任何大於 5 的質數都符合。p＝3 會讓最大公因數變成 108，p＝5 會讓最大公因數變成 180。", "分別檢查 p＝2、3、5，以及其他質數。", ["質數 p"], "prime"),
    ],
  },
  {
    name: "群英夜宴・杯酒殺機", topic: "最大公因數與最小公倍數的關係", level: '基礎', enemy: "曹營死士頭目",
    story: "八面屏風環繞水榭宴席。周瑜邀蔣幹入座，請你循棧道查訪可疑賓客。",
    scene: "死士掀翻酒案。先守住周瑜，再清剿帶頭發難的死士。",
    ending: "蔣幹倉促離席。死士身上的密信牽出曹軍的鐵鎖連艦。",
    dialogue: ["蔣幹","公瑾……你我多年故交，何必在席間布置刀斧手，如此相逼？","周瑜","子翼兄遠道過江，瑜本該以禮相待。奈何你懷中揣著的密信，出賣了你的野心。來人，送客……上刀劍！"],
    ally: { name: '諸葛亮', title: '借策助攻', effect: '增加 20 點謀略', skill: 'strategy', line: '內應的暗號已破解。接下來的水戰，我會替你留一手。' },
    advice: "兩個正整數的乘積等於最大公因數乘最小公倍數。",
    intel: "核對宴中暗號。注意括號是否把負號納入底數。",
    arena: ["江東水師大營","群英會","#492733","#6a4034","燭火、裂屏與墨色劍氣"],
    questions: [
      task("乘積密碼", "兩正整數的最大公因數為 12，最小公倍數為 360。若 A＝60，B 是多少？", [72], "60 × B＝12 × 360，所以 B＝72。", "兩數乘積等於最大公因數乘最小公倍數。", ["答案"], "number"),
      task("互質配對", "兩個正整數和為 84，最大公因數為 12。請填任一組符合條件的兩數，順序不限。", [12,72], "除以 12 後兩數和為 7，且互質。可配成 1 和 6、2 和 5、3 和 4，所以原數為 12 和 72、24 和 60、36 和 48。", "把兩數都寫成 12 的倍數。", ["第一數","第二數"], "pair"),
      task("還原另一數", "兩正整數的最小公倍數為 180，最大公因數為 15。其中一數為 60，求另一數。", [45], "15 × 180 ÷ 60＝45。", "先求出兩數的乘積。", ["答案"], "number"),
    ],
  },
  {
    name: "長江連環・鐵鎖悲歌", topic: "最大公因數的生活應用", level: '進階', enemy: "蔡瑁",
    story: "四艘樓船以鐵鎖交接。先突破盾陣，再找出連艦核心的錨鎖。",
    scene: "蔡瑁據守船頭。浪濤撲上甲板，鐵索在風中震響。",
    ending: "蔡瑁退守主艦，失去錨鎖的外圍船陣散開，聯軍火船得以進場。",
    dialogue: ["蔡瑁","江東鼠輩！我百萬雄師連環鎖定，穩如泰山，憑你們這幾艘破船也敢妄想火攻？","主角","鐵索固然牢固，卻也鎖住了你們的退路。今日這長江之上，便是水軍的葬身之處！"],
    ally: { name: '魯肅', title: '渡江補給', effect: '回復 10 點兵力並增加 10 點謀略', skill: 'supply', line: '箭束都已分妥。我替你照看補給，讓前線安心迎敵。' },
    advice: "分成最多組，或裁成最長的等長小段，要找最大公因數。",
    intel: "利用箭束帳核對各船的信號，辨清同底數乘除的指數規則。",
    arena: ["長江連艦","樓船交鋒","#314b62","#43596a","江霧、鐵索與浪濤"],
    questions: [
      task("分裝禮盒", "紅筆 72 支、藍筆 96 支、黑筆 120 支。全部分成最多個相同配法的禮盒。求盒數與每盒各色筆數。", [24,3,4,5], "三數最大公因數為 24。各色筆數分別除以 24，每盒有紅筆 3、藍筆 4、黑筆 5 支。", "最多盒數要能同時整除三種筆的總數。", ["禮盒數","每盒紅筆","每盒藍筆","每盒黑筆"], "number"),
      task("裁切紙板", "120 公分 × 80 公分的紙板剪成等大的整數邊長正方形，無剩餘。求最大邊長與正方形總數。", [40,6], "最大公因數是 40。長邊排 3 個、短邊排 2 個，共 6 個。", "邊長必須同時整除 120 和 80。", ["邊長（公分）","正方形總數"], "number"),
      task("等長截繩", "長 72、120、168 公分的三條繩子全部截成等長且為整數公分的小段。最少共幾段？", [15], "每段最長為 24 公分，總段數為 3＋5＋7＝15。", "段數最少時，每段應盡可能長。", ["答案"], "number"),
    ],
  },
  {
    name: "赤壁烈焰・焚天宿命", topic: "最小公倍數與週期", level: '熟練', enemy: "張遼",
    story: "東南風助燃旗艦，火線逐步逼近甲板中央。沿環形通道尋找受困盟軍，再突破虎衛軍防線。",
    scene: "張遼立於燃燒的舷橋前，盔纓飛揚，仍要為曹軍爭取撤退的時間。",
    ending: "虎衛軍撤離旗艦。斥候回報，曹操已率殘部退入華容道。",
    dialogue: ["張遼","痛快！縱然大業付之一炬，我張文遠今日也要在此斷了爾等的追擊！","主角","英雄末路，何必執念於霸業？這一戰，是對亂世的清算！"],
    ally: { name: '黃蓋', title: '火船掩護', effect: '抵擋下一次敵軍反擊', skill: 'guard', line: '點火之後，由我替你掩護。軍師，等號令！' },
    advice: "各週期再次同步的時間是最小公倍數。",
    intel: "火船已經進陣。核對後續船隊的引信規格與鼓令。",
    arena: ["赤壁旗艦","東風總攻","#562222","#813b2b","赤焰、飛灰與爆裂火芒"],
    questions: [
      choice("圖書館相遇", "小明每 4 天、小華每 6 天、小芬每 8 天去一次圖書館。三人星期日同去，下一次同去是星期幾？", ["星期一","星期二","星期三","星期四"], "星期三", "最小公倍數是 24。24 除以 7 餘 3，星期日往後 3 天是星期三。", "先算相隔天數，再換算星期。"),
      task("公車同時發車", "甲車每 15 分鐘、乙車每 25 分鐘發車。早上 6 點同時出發，下一次同時發車是幾點幾分？", [7,15], "最小公倍數是 75 分鐘。6 時加 1 小時 15 分鐘，為 7 時 15 分。", "先算兩車發車週期的最小公倍數。", ["小時（24 小時制）","分鐘"], "number"),
      task("燈光同步", "紅燈每 12 秒、綠燈每 18 秒、藍燈每 24 秒閃一次。同時閃過後，至少幾秒會再次同時閃？", [72], "最小公倍數為 2³ × 3²＝72 秒。", "找同時被 12、18、24 整除的最小正整數。", ["答案"], "number"),
      task("跑道起點相遇", "400 公尺跑道上，甲每秒跑 8 公尺、乙每秒跑 5 公尺，同時從起點同方向出發。幾秒後第一次一起回到起點？", [400], "甲每圈 50 秒，乙每圈 80 秒。50 和 80 的最小公倍數為 400 秒。", "題目問的是在起點相遇，先算兩人的單圈時間。", ["答案"], "number"),
    ],
  },
  {
    name: "華容狹道・青山白骨", topic: "餘數、因倍數與指數律綜合", level: '挑戰', enemy: "曹操",
    story: "殘軍退入 Y 字泥道。清除滾木落石，穿過濕滑岔路，突破殿後親衛。",
    scene: "細雨中，曹操以劍支地，等待軍師作出最後抉擇。",
    ending: "親衛敗退。軍師在泥道口攔下曹操，決定他的去留。",
    dialogue: ["曹操","哈哈哈哈……孤縱橫天下數十載，今日竟敗於天時風火！成王敗寇，爾等要取孤性命，便動手吧！"],
    advice: "每組都差相同的數量時，先補齊，再找範圍內的公倍數。",
    intel: "狹道軍令結合餘數、因倍數與指數律。",
    arena: ["華容古道","泥谷殿後","#29343a","#35413d","泥水、殘霧與霸氣震盪"],
    questions: [
      task("磁磚拼正方形", "用 15 公分 × 10 公分的長方形磁磚緊密拼成最小的正方形。需要幾塊？", [6], "30 公分邊長可拼成 2 × 3 塊。更短的候選邊長只有 15、20、25 公分，其正方形面積皆不是 150 的倍數。", "先用磁磚面積排除不可能的邊長。", ["答案"], "number"),
      task("不足補齊", "全校學生 3 人、5 人或 7 人一組，都差 2 人才能整除。人數在 1000 到 1500 之間。請列出所有可能人數，順序不限，以逗號分隔。", [1048,1153,1258,1363,1468], "加 2 後須為 105 的倍數。區間內共有 1048、1153、1258、1363、1468 人五種可能。", "先補 2 人，再找 3、5、7 的公倍數。", ["所有可能人數"], "list"),
      task("餘數變形", "彈珠每 4 顆一數剩 3 顆、每 5 顆剩 4 顆、每 6 顆剩 5 顆。在 200 到 300 顆之間，請列出所有可能顆數，順序不限，以逗號分隔。", [239,299], "加 1 後須為 60 的倍數。區間內有 239 與 299 顆。", "三種分法都只差 1 顆便能整除。", ["所有可能顆數"], "list"),
      task("反推整數", "正整數 x 與 48 的最大公因數是 16，最小公倍數是 240。求 x。", [80], "x × 48＝16 × 240，故 x＝80。", "利用兩數乘積等於最大公因數乘最小公倍數。", ["答案"], "number"),
      task("指數律決戰", "A＝2ᵃ × 3³ × 5²，B＝2⁴ × 3ᵇ × 7。最大公因數為 2³ × 3²，最小公倍數為 2⁴ × 3³ × 5² × 7，求 a＋b。", [5], "2 的較小指數是 3，所以 a＝3。3 的較小指數是 2，所以 b＝2。a＋b＝5。", "逐個比對 2 與 3 的較小指數。", ["答案"], "number"),
    ],
  },
];

window.campaignChapter = index => chapters[index];
const readSave = key => {
  try { return JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch { return {}; }
};
const saved = readSave('sanguo-chibi-v1');
let adventureSave=saved.adventures||{};
const sideProgress=Array.from({length:chapters.length},(_,i)=>[1,2].includes(saved.sideProgress?.[i])?saved.sideProgress[i]:0);
let resupplyAvailable=saved.resupplyAvailable!==false;
const oldPreferences = readSave('sanguo-v1');
let coins=Number.isSafeInteger(saved.coins)?Math.max(0,saved.coins):60;
let weaponBonus=[3,6].includes(saved.weaponBonus)?saved.weaponBonus:0;
let unlocked = Math.min(4, Math.max(0, Number(saved.unlocked) || 0));
let records = Array.isArray(saved.records) ? saved.records : [];
const recruited = new Set(Array.isArray(saved.recruited) ? saved.recruited.filter(i => records[i] && chapters[i]?.ally) : []);
const allyMissions = [
  { text:'在長坂撤陣的地圖擊退一名巡邏敵兵。', steps:['patrol'] },
  { text:'向阿帆挑戰江東議盟的練習題，並答對。', steps:['practice'] },
  { text:'向阿倫打聽霧江借箭的水寨情報，再向校尉小蓉回報。', steps:['intel','report'] },
  { text:'通過江口備火，其中至少四道軍令須在未用提示時首次答對。', steps:['fire'] },
];
const missionProgress=allyMissions.map(({steps},i)=>{
  const count=saved.missionProgress?.[i];
  return Number.isInteger(count)?Math.max(0,Math.min(count,steps.length)):0;
});
function markAllyTask(event) {
  const mission=allyMissions[stage];
  if(!mission || mission.steps[missionProgress[stage]]!==event)return false;
  missionProgress[stage]++;
  save();
  return true;
}
function canRecruit(i) {
  return Boolean(allyMissions[i] && records[i] && missionProgress[i]===allyMissions[i].steps.length && !recruited.has(i));
}
function missionLabel(i) {
  const mission=allyMissions[i];
  return `${mission.text} ${missionProgress[i]} / ${mission.steps.length} · ${records[i]?'主線已通關':'主線待通關'}`;
}
const assisted = new Set();
let stage=0,index=0,hp=100,mp=0,selected=[],solved=false,shield=false,borrowed=false,usedHint=false,failed=false,streak=0,cooldown=0,seconds=45,timer=null,sound=false,stats={correct:0,attempts:0,hints:0},attempted=false;
const q=()=>chapters[stage].questions[index];
function save() {
  try {
    localStorage.setItem('sanguo-chibi-v1', JSON.stringify({
      unlocked, records, recruited:[...recruited], missionProgress, sideProgress, adventures:adventureSave, coins, weaponBonus, resupplyAvailable, name:$('name').value, mode:$('mode').value,
    }));
  } catch {}
}
$('name').value = saved.name ?? oldPreferences.name ?? '';
if ((saved.mode ?? oldPreferences.mode) === 'challenge') $('mode').value='challenge';
function beep(ok){if(!sound)return;try{const a=new(window.AudioContext||window.webkitAudioContext)(),o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);o.frequency.value=ok?600:180;g.gain.value=.04;o.start();g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.2);o.stop(a.currentTime+.2);o.onended=()=>a.close()}catch{}}
function map(){ $('chapters').innerHTML=chapters.map((c,i)=>`<button class="chapter ${i===stage?'active':''}" data-stage="${i}" ${i>unlocked?'disabled':''}><span class="num">${['壹','貳','參','肆','伍'][i]}</span><span><strong>${c.name}</strong><small>${i>unlocked?'尚未解鎖':c.level+' · '+c.topic}</small></span><span class="tick">${records[i]?'✓':''}</span></button>`).join('');document.querySelectorAll('[data-stage]').forEach(b=>b.onclick=()=>{if(+b.dataset.stage!==stage)start(+b.dataset.stage)})}
function update(){$('party').textContent='同行夥伴 '+recruited.size+' / 4';if(typeof window.villageSync==='function')window.villageSync(); $('hptext').textContent=`${hp} / 100`;$('mptext').textContent=`${mp} / 100`;$('hpbar').style.width=hp+'%';$('mpbar').style.width=mp+'%';$('enemybar').style.width=(100*(1-(index+Number(solved))/chapters[stage].questions.length))+'%';$('crossbow').disabled=mp<30||cooldown>0||solved||failed||q().type!=='multi'||q().options.every(v=>q().answer.includes(v));$('shield').disabled=mp<40||shield||solved||failed;$('arrows').disabled=borrowed||solved||failed;$('progress').textContent=`赤壁戰記 · 已完成 ${records.filter(Boolean).length} / 5 章`;$('selection').textContent=q().type==='multi'?`已選 ${selected.length} 個目標`:'輸入整數或次方';}
function start(s){clearInterval(timer);assisted.clear();stage=s;index=0;hp=100;mp=0;streak=0;cooldown=0;shield=false;borrowed=false;failed=false;stats={correct:0,attempts:0,hints:0};render();map()}
function render(){clearInterval(timer);selected=[];solved=false;usedHint=false;attempted=false;seconds=45;const c=chapters[stage],t=q();$('chapterlabel').textContent=`第 ${['一','二','三','四','五'][stage]} 章 / ${c.topic}`;$('title').textContent=c.name;$('subtitle').textContent=c.story;$('campaign-level').textContent=c.level;$('campaign-scene').textContent=c.scene;$('enemy').textContent=index===chapters[stage].questions.length-1?'首領決戰 · BOSS BATTLE':'敵陣交鋒 · TACTICAL BATTLE';$('enemytitle').textContent=c.enemy;$('round').textContent=`第 ${index+1} / ${c.questions.length} 陣`;$('tag').textContent=t.tag;$('instruction').textContent=t.type==='multi'?'單選 · 選好後確認':t.format==='factors'?'輸入質因數乘積，如 2^2 × 3':t.format==='list'?'列出所有答案，以逗號分隔':'可輸入整數或次方，例如 2^5 或 2⁵';$('prompt').textContent=t.prompt;$('context').textContent=index===chapters[stage].questions.length-1?'解開最後一道軍令，完成本章任務。':'依照軍情計算，確認後下令。';$('feedback').textContent='';$('feedback').className='';$('submit').textContent='確認出擊 →';$('submit').disabled=false;
if(t.type==='multi'){$('answers').innerHTML='<div class="options">'+t.options.map((v,i)=>`<button class="option" data-option="${i}" aria-pressed="false">${v}</button>`).join('')+'</div>';document.querySelectorAll('[data-option]').forEach(b=>b.onclick=()=>{if(solved||failed)return;const v=t.options[+b.dataset.option];selected=selected.includes(v)?selected.filter(x=>x!==v):[v];document.querySelectorAll('[data-option]').forEach(option=>{const active=selected.includes(t.options[+option.dataset.option]);option.classList.toggle('selected',active);option.setAttribute('aria-pressed',String(active))});update()})}else{$('answers').innerHTML='<div class="input-answer">'+t.labels.map((label,i)=>`<label>${label}<input type="text" inputmode="text" autocomplete="off" maxlength="100" id="answer${i}" aria-label="${label}"></label>`).join('')+'</div>';document.querySelectorAll('.input-answer input').forEach(el=>el.onkeydown=e=>{if(e.key==='Enter')submit()})}
if(typeof battleRender==='function')battleRender(stage,index,hp,$('name').value);update();tick();if($('mode').value==='challenge')timer=setInterval(()=>{if(solved||failed||window.overworldActive||$("modal").open)return;seconds--;tick();if(seconds<=0){clearInterval(timer);damage('時間到，敵軍反擊！仍可繼續思考並完成本題。');usedHint=true;$('timer').textContent='計時結束 · 完成解題';}},1000);}
function tick(){$('timer').textContent=$('mode').value==='challenge'?`剩餘 ${seconds} 秒`:'研習中 · 從容思考'}
function feedback(msg,error=false){$('feedback').textContent=msg;$('feedback').className=error?'error':''}
function damage(msg){const wasGuarded=shield;if(shield){shield=false;feedback(msg+' 掩護生效，本次未損失兵力。',true)}else{hp=Math.max(0,hp-(index===chapters[stage].questions.length-1?15:10));feedback(msg,true);$('hpbar').parentElement.classList.add('shake');setTimeout(()=>$('hpbar').parentElement.classList.remove('shake'),350)}if(typeof battleAnimate==='function')battleAnimate(wasGuarded?'guard':'damage',hp===0);streak=0;beep(false);update();if(hp===0){resupplyAvailable=true;save();failed=true;clearInterval(timer);$('submit').textContent='重新整軍 →';feedback('兵力耗盡。'+q().explain+' 重新整軍後從本關第一陣再試一次。',true);update()}}
function parseInteger(text) {
  const value = normalizeAnswer(text);
  return /^[+-]?\d+$/.test(value) && Number.isSafeInteger(Number(value)) ? Number(value) : NaN;
}
function normalizeAnswer(text) {
  return String(text).trim().replace(/[０-９]/g,digit=>String(digit.charCodeAt(0)-65296))
    .replace(/[−－]/g,'-').replace(/＋/g,'+').replace(/（/g,'(').replace(/）/g,')').replace(/＾/g,'^');
}
function parseMathAnswer(text) {
  const integer=parseInteger(text);
  if(Number.isSafeInteger(integer))return {value:integer};
  const superscript='⁰¹²³⁴⁵⁶⁷⁸⁹';
  const source=normalizeAnswer(text).replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+$/u,digits=>'^'+[...digits].map(d=>superscript.indexOf(d)).join(''));
  const match=/^([+-]?)\s*(?:\(\s*([+-]?\d+)\s*\)|(\d+))\s*\^\s*\+?(\d+)$/.exec(source);
  if(!match)return null;
  const [,sign,group,bare,power]=match;
  const base=Number(group??bare), exponent=Number(power);
  if(!Number.isSafeInteger(base)||!Number.isSafeInteger(exponent)||exponent>1000||base===0&&exponent===0)return null;
  const negative=sign==='-';
  const value=(negative?-1:1)*base**exponent;
  return Number.isSafeInteger(value)?{value,base,exponent,negative}:null;
}
function isPrime(value) {
  if(!Number.isSafeInteger(value)||value<2)return false;
  if(value%2===0)return value===2;
  for(let divisor=3;divisor<=Math.sqrt(value);divisor+=2)if(value%divisor===0)return false;
  return true;
}
function parseFactors(text) {
  const factors=text.split(/[×＊*xX]/).map(parseMathAnswer);
  if(factors.some(factor=>!factor||!isPrime(factor.base??factor.value)||factor.negative||factor.exponent===0))return NaN;
  if(new Set(factors.map(factor=>factor.base??factor.value)).size!==factors.length)return NaN;
  return factors.reduce((product,factor)=>product*factor.value,1);
}
function isCorrect(task, values) {
  if(task.format==='prime')return values.length===1&&isPrime(values[0])&&values[0]!==3&&values[0]!==5;
  if(task.format==='pair')return values.length===2&&values[0]+values[1]===84&&values.every(value=>value>0&&value%12===0);
  if(task.format==='list')values=[...values].sort((a,b)=>a-b);
  return values.length===task.answer.length&&values.every((value,i)=>value===task.answer[i]);
}
function submit(){if(failed){start(stage);return}if(solved){if(index===chapters[stage].questions.length-1){complete();return}index++;render();return}const t=q();
  let values=selected;
  if(t.type==='multi'&&!selected.length){feedback('請先選一個答案。',true);return;}
  if(t.type==='number'){
    const fields=t.labels.map((label,i)=>$('answer'+i).value);
    if(t.format==='list')values=fields[0].split(/[,，、]/).map(parseInteger);
    else if(t.format==='factors')values=fields.map(parseFactors);
    else values=fields.map(text=>parseMathAnswer(text)?.value);
    if(values.some(value=>!Number.isSafeInteger(value))){
      feedback(t.format==='factors'?'請輸入標準分解式，例如 2^2 × 3。':t.format==='list'?'請用逗號分隔各個整數。':'請在每欄填入整數或次方。',true);
      return;
    }
  }
  const correct=isCorrect(t,values);if(!attempted){stats.attempts++;if(correct&&!usedHint)stats.correct++;attempted=true}if(correct){solved=true;if(typeof battleAnimate==='function')battleAnimate('hit',index===chapters[stage].questions.length-1);clearInterval(timer);streak++;mp=Math.min(100,mp+10+weaponBonus+(streak%3===0?10:0));cooldown=Math.max(0,cooldown-1);feedback('破陣成功！ '+t.explain);$('submit').textContent=index===chapters[stage].questions.length-1?'查看本章結局 →':'繼續進軍 →';document.querySelectorAll('#answers button,#answers input').forEach(el=>el.disabled=true);beep(true);save();update()}else{usedHint=true;damage('敵陣未破！ '+t.explain+' 請修正答案再出擊。')}}
function modal(html){$('modalbody').innerHTML=html;if(!$('modal').open)$('modal').showModal()}
function recruit(chapterIndex) {
  if (!canRecruit(chapterIndex)) return false;
  recruited.add(chapterIndex);
  save();
  update();
  return true;
}

function complete() {
  clearInterval(timer);
  const chapter = chapters[stage];
  const rating = Math.round(stats.correct / chapter.questions.length * 100);
  const firstClear=!records[stage];
  if(firstClear)coins+=45;
  records[stage] = {accuracy:rating, hints:stats.hints, hp};
  if(stage===3 && stats.correct>=chapters[stage].questions.length-1)markAllyTask('fire');
  unlocked = Math.max(unlocked, Math.min(chapters.length-1, stage+1));
  save();
  map();
  update();
  const final = stage === chapters.length-1;
  const ally = chapter.ally;
  const offer = ally && !recruited.has(stage);
  modal(`<div class="eyebrow">${final?'赤壁戰記 · 完':'赤壁戰記 · 本章落幕'}</div>
    <h2>${final?'華容道決戰告捷':chapter.name+' · 完成'}</h2><p>${chapter.ending}</p>${firstClear?'<p>首次通關獎勵：45 銅錢。</p>':''}
    <div class="report"><div><b>${rating}%</b>獨立首答正確率</div><div><b>${hp}</b>剩餘兵力</div><div><b>${stats.hints}</b>提示次數</div></div>
    ${offer?`<div class="recruit-offer"><strong>${ally.name} · ${ally.title}</strong><p>${missionLabel(stage)}</p>${canRecruit(stage)?`<p>「${ally.line}」</p><button class="primary" id="recruit-ally">邀請${ally.name}加入</button>`:'<p>完成指定任務後，可從同行名冊邀請加入。</p>'}</div>`:''}
    ${final?'<div class="ending-options"><button class="primary" id="release-cao">放曹操過去</button><button class="dialog-choice" id="detain-cao">扣留曹操</button><p id="ending-result" aria-live="polite"></p></div>':''}
    <button class="primary" id="continue">${final?'重遊第一章':'返回營地，展開下一章'} →</button>`);
  if (offer && canRecruit(stage)) $('recruit-ally').onclick=()=>{
    if (!recruit(stage)) return;
    $('recruit-ally').textContent=ally.name+' 已加入隊伍';
    $('recruit-ally').disabled=true;
  };
  if(final){
    $('continue').hidden=true;
    const conclude=choice=>{
      records[stage].ending=choice;
      save();
      $('ending-result').textContent=choice==='release'
        ?'主角：天下百姓經不起再一番生靈塗炭。這華容道，放您過去。曹操翻身上馬：此恩孤記下了，後會有期！'
        :'主角命人收起倚天劍，將曹操與傷兵護送回營，交由聯軍議處。';
      $('release-cao').disabled=$('detain-cao').disabled=true;
      $('continue').hidden=false;
    };
    $('release-cao').onclick=()=>conclude('release');
    $('detain-cao').onclick=()=>conclude('detain');
  }
  $('continue').onclick=()=>{
    $('modal').close();
    start(final?0:stage+1);
    window.villageShow?.(true);
  };
}

function useAlly(chapterIndex) {
  const ally = chapters[chapterIndex].ally;
  if (!recruited.has(chapterIndex) || assisted.has(chapterIndex) || failed || solved || window.overworldActive) return;
  if (ally.skill==='guard' && shield) return;
  if (ally.skill==='heal' && hp===100 || ally.skill==='strategy' && mp===100 || ally.skill==='supply' && hp===100 && mp===100) return;
  const beforeHP=hp, beforeMP=mp;
  if (ally.skill==='heal') hp=Math.min(100,hp+20);
  if (ally.skill==='strategy') mp=Math.min(100,mp+20);
  if (ally.skill==='supply') { hp=Math.min(100,hp+10); mp=Math.min(100,mp+10); }
  if (ally.skill==='guard') shield=true;
  assisted.add(chapterIndex);
  $('modal').close();
  const changes=[hp>beforeHP?'兵力 +'+(hp-beforeHP):'',mp>beforeMP?'謀略 +'+(mp-beforeMP):''].filter(Boolean);
  feedback(ally.name+'來援！'+(changes.join('、') || '抵擋下一次敵軍反擊。'));
  update();
}

$('party').onclick = function showParty() {
  const roster = chapters.filter(chapter=>chapter.ally).map((chapter,i)=>{
    const ally=chapter.ally;
    let action='任務待完成';
    if (canRecruit(i)) action=`<button class="primary" data-recruit="${i}">邀請加入</button>`;
    if (recruited.has(i)) {
      const unavailable=assisted.has(i)||failed||solved||window.overworldActive||
        (ally.skill==='guard' && shield)||(ally.skill==='heal' && hp===100)||
        (ally.skill==='strategy' && mp===100)||(ally.skill==='supply' && hp===100 && mp===100);
      action=`<button class="dialog-choice" data-deploy="${i}">選擇出戰</button><button class="primary" data-assist="${i}" ${unavailable?'disabled':''}>${assisted.has(i)?'本章已援助':'呼叫援助'}</button>`;
    }
    const design=window.characterDesign?.profile('ally-'+i);
    const portrait=window.characterArt?.portrait('ally-'+i)??'';
    return `<div class="party-entry"><div class="party-portrait">${portrait}</div><div class="party-identity"><b>${ally.name}</b> · ${ally.title}<small>${ally.effect}</small>${design?`<small>${design.detail}</small>`:''}${recruited.has(i)?'<small>已加入 · 可選擇出戰</small>':`<small>${missionLabel(i)}</small>`}</div><div>${action}</div></div>`;
  }).join('');
  modal('<div class="eyebrow">赤壁戰記 · 同行名冊</div><h2>同行夥伴</h2><p>通關並完成指定任務後可邀請夥伴。加入後可選擇出戰，並可在每章主線戰鬥中援助一次。</p><button class="dialog-choice" id="character-gallery">查看人物圖鑑</button>'+roster);
  $('character-gallery').onclick=()=>showCharacterGallery(0);
  document.querySelectorAll('[data-recruit]').forEach(button=>button.onclick=()=>{
    if(recruit(Number(button.dataset.recruit))) showParty();
  });
  document.querySelectorAll('[data-deploy]').forEach(button=>button.onclick=()=>{
    if(window.chooseBattleLeader?.('ally-'+button.dataset.deploy)){
      $('modal').close();
      window.villageShow?.(false);
    }
  });
  document.querySelectorAll('[data-assist]').forEach(button=>button.onclick=()=>useAlly(Number(button.dataset.assist)));
};
function showCharacterGallery(selected) {
  const groups=[
    ['軍師與名將',['player','ally-0','ally-1','ally-2','ally-3']],
    ['營地與商街',['teacher','officer','villager','guard','weapons','supplies','inn']],
    ['巡兵與對手',['scout','shieldman','archer','sailor','veteran','enemy-0','enemy-1','enemy-2','enemy-3','enemy-4']],
  ];
  const cards=groups[selected][1].map(id=>{
    const profile=window.characterDesign.profile(id);
    return `<figure class="design-card">${window.characterArt.portrait(id)}<figcaption><strong>${profile.name}</strong>${profile.detail?`<small>${profile.detail}</small>`:''}</figcaption></figure>`;
  }).join('');
  const tabs=groups.map(([title],i)=>`<button class="dialog-choice" data-design-group="${i}" aria-pressed="${i===selected}">${title}</button>`).join('');
  modal(`<div class="eyebrow">赤壁戰記 · 人物圖鑑</div><h2>赤壁人物圖鑑</h2><div class="design-tabs">${tabs}</div><div class="design-grid">${cards}</div><button class="dialog-choice" id="back-to-party">返回同行名冊</button>`);
  document.querySelectorAll('[data-design-group]').forEach(button=>button.onclick=()=>showCharacterGallery(Number(button.dataset.designGroup)));
  $('back-to-party').onclick=()=> $('party').click();
  document.querySelector('[data-design-group][aria-pressed="true"]')?.focus();
}
$('submit').onclick=submit;$('hint').onclick=()=>{if(solved||failed)return;if(!usedHint){stats.hints++;usedHint=true}feedback('阿帆提示：'+q().hint)};
$('crossbow').onclick=()=>{if($('crossbow').disabled)return;mp-=30;cooldown=3;let count=0;document.querySelectorAll('[data-option]').forEach(b=>{const v=q().options[+b.dataset.option];if(count<2&&!q().answer.includes(v)&&!b.disabled){b.disabled=true;b.classList.add('eliminated');b.classList.remove('selected');selected=selected.filter(x=>x!==v);count++}});if(!usedHint){stats.hints++;usedHint=true}feedback(`諸葛連弩已排除 ${count} 個錯誤目標。冷卻期間仍可繼續作答。`);update()};
$('shield').onclick=()=>{if($('shield').disabled)return;mp-=40;shield=true;seconds+=15;feedback('空城計已布下：抵擋下一次反擊；挑戰模式延長 15 秒。');tick();update()};
$('arrows').onclick=()=>{
  if(borrowed||solved||failed)return;
  const shots=[['3 × 2 + 4',10],['(3 + 2) × 2',10],['12 ÷ 2 + 4',10],['3 × (2 + 4)',18],['16 − 3 × 3',7]];
  const chosen=new Set();
  modal('<div class="eyebrow">備戰 · 箭束校驗</div><h2>草船借箭</h2><p>選出所有結果等於 10 的算式。每個正確選項獲得 5 點謀略，誤選會遭反擊。</p><div class="borrow">'+shots.map(([expression],i)=>`<button data-borrow="${i}" aria-pressed="false">${expression}</button>`).join('')+'</div><button class="primary" id="borrow-submit">收箭 →</button>');
  document.querySelectorAll('[data-borrow]').forEach(button=>button.onclick=()=>{
    const i=Number(button.dataset.borrow);
    if(chosen.has(i))chosen.delete(i);else chosen.add(i);
    button.classList.toggle('selected',chosen.has(i));
    button.setAttribute('aria-pressed',String(chosen.has(i)));
  });
  $('borrow-submit').onclick=()=>{
    if(!chosen.size || borrowed || solved || failed)return;
    borrowed=true;
    const gain=[...chosen].filter(i=>shots[i][1]===10).length*5;
    mp=Math.min(100,mp+gain);
    $('modal').close();
    if([...chosen].some(i=>shots[i][1]!==10))damage('獲得 '+gain+' 點謀略。前三個算式都等於 10，後兩式分別是 18 和 7。');
    else feedback('借箭成功，獲得 '+gain+' 點謀略！');
    update();
  };
};
$('guide').onclick=()=>modal('<div class="eyebrow">FIELD MANUAL</div><h2>軍師，請下令。</h2><ol><li>依題目選齊目標或輸入數字，再按「確認出擊」。</li><li>每關五陣，正確作答可破甲並獲得謀略值；答錯扣除兵力，可閱讀解析後修正。</li><li>兵力歸零可重新挑戰本關；完成軍令後解鎖下一關。前四關通關並完成指定任務後，可從同行名冊招募夥伴。</li><li>使用阿帆提示了解方法，或消耗謀略施展錦囊。</li><li>研習模式不限時；挑戰模式每題 45 秒，超時反擊一次後仍能作答。</li></ol><p>赤壁篇進度儲存在此瀏覽器。選擇已解鎖的章節可重玩。</p><label>模式 <select id="mobile-mode"><option value="learn">研習 · 不限時</option><option value="challenge">挑戰 · 每題 45 秒</option></select></label><p>切換模式將重新開始當前關卡。</p>');
$('journal').onclick=()=>modal('<div class="eyebrow">STRATEGIST’S JOURNAL</div><h2>軍師手札</h2><p>運算順序：括號 → 次方 → 乘除 → 加減。<br>同底數相乘，指數相加；同底數相除，指數相減（底數非零）。<br>次方的次方，指數相乘；乘積的次方可分給各因數。</p>'+chapters.map((c,i)=>`<p><b>${['壹','貳','參','肆','伍'][i]} · ${c.name}</b><br>${records[i]?`已完成 · 獨立首答 ${records[i].accuracy}% · 提示 ${records[i].hints} 次`:i<=unlocked?'待挑戰':'尚未解鎖'}</p>`).join(''));
$('modal').addEventListener('change',e=>{if(e.target.id==='mobile-mode'){$('mode').value=e.target.value;save();$('modal').close();start(stage)}});$('modal').querySelector('.close').onclick=()=>$('modal').close();$('sound').onclick=()=>{sound=!sound;$('sound').textContent='音效：'+(sound?'開':'關');$('sound').setAttribute('aria-pressed',String(sound));beep(true)};$('mode').onchange=()=>{save();start(stage)};$('name').onchange=save;
window.villageGame={
 readAdventures:()=>adventureSave,
 writeAdventures(next,reward){
   adventureSave=next;
   if(reward){
     coins+=Math.max(0,Math.min(100,Number(reward.coins)||0));
     mp=Math.min(100,mp+Math.max(0,Math.min(100,Number(reward.mp)||0)));
     const gain=Math.max(0,Math.min(100,Number(reward.heal)||0));
     if(gain&&failed){const earnedMP=mp;start(stage);hp=gain;mp=earnedMP;}
     else hp=Math.min(100,hp+gain);
   }
   save();
   update();
 },
 state:()=>({hp,mp,coins,sideProgress:sideProgress[stage],weaponBonus,resupplyAvailable,chapter:chapters[stage].name,stage,cleared:records.filter(Boolean).length,
   allies:[...recruited].sort((a,b)=>a-b).map(i=>({id:'ally-'+i,name:chapters[i].ally.name})),
   missionProgress:missionProgress[stage],
 }),
 acceptSideQuest(){
   if(sideProgress[stage]!==0)return false;
   sideProgress[stage]=1;
   save();
   update();
   return true;
 },
 solveSideQuest(answer){
   const {sideQuest}=window.redCliffsWorld.layout(stage);
   if(sideProgress[stage]!==1||answer!==sideQuest.answer)return false;
   sideProgress[stage]=2;
   coins+=sideQuest.reward;
   save();
   update();
   return true;
 },
 advice:()=>chapters[stage].advice,
 markAllyTask,
 parseMathAnswer,
 patrolHit(amount) {
   const blocked=shield, before=hp;
   if (blocked) shield=false;
   else hp=Math.max(0,hp-amount);
   if(before>0&&hp===0){resupplyAvailable=true;save();}
   streak=0;
   beep(false);
   update();
   return {hp,blocked,loss:before-hp};
 },
 patrolReward() {
   const gain=Math.min(10,100-mp);
   mp+=gain;
   coins+=12;
   save();
   beep(true);
   update();
   return gain;
 },
 patrolRegroup() {
   if (hp===0 && !failed) hp=35;
   update();
 },
 buyItem(shopId,itemId) {
   const item=window.redCliffsWorld.shops[shopId]?.items.find(entry=>entry.id===itemId);
   if(!item||coins<item.price||item.bonus&&weaponBonus>=item.bonus||item.heal&&hp===100)return false;
   const originalHP=hp;
   coins-=item.price;
   if(item.bonus)weaponBonus=item.bonus;
   if(item.heal){
     if(failed)start(stage);
     hp=Math.min(100,originalHP+item.heal);
   }
   save();
   update();
   return true;
 },
 heal() {
   if(!resupplyAvailable)return '首次補給已用過。兵力歸零後，才能再次向我補充兵力。';
   if(hp===100)return '目前兵力已滿。這次沒有消耗補給機會。';
   resupplyAvailable=false;
   save();
   if(failed){
     start(stage);
     return '部隊已重新整編，兵力回復 100。本關從第一陣重新開始。';
   }
   hp=100;
   update();
   return '兵力已恢復至 100！';
 }
};

start(unlocked);
