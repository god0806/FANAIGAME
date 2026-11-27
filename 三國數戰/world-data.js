window.redCliffsWorld = (() => {
  const width=3000, depth=2500;
  const areas=[
    {name:'烏林夜哨', terrain:'山林、斥候營與糧道渡口', shore:520, camp:[1120,815], port:1030, trees:[[170,760,620,680,46],[1690,720,520,780,35]], roofs:'#765246', grass:'#243a32', water:'#283e49', sky:'#192b3a', boats:2},
    {name:'群英夜宴', terrain:'江東水師大營、宴席與木棧道', shore:470, camp:[1380,790], port:1530, trees:[[130,660,560,750,28],[1880,650,365,710,29]], roofs:'#476966', grass:'#554837', water:'#3d4850', sky:'#46333c', boats:3},
    {name:'長江連環', terrain:'霧岸、鐵鎖連艦與巡邏樓船', shore:660, camp:[1130,955], port:1130, trees:[[160,830,550,655,42],[1680,790,515,690,30]], roofs:'#4f5d61', grass:'#59666d', water:'#3c5569', sky:'#8c9eac', boats:5},
    {name:'赤壁烈焰', terrain:'火船登艦口、烈焰與焦黑船寨', shore:455, camp:[1020,770], port:940, trees:[[150,710,480,750,32],[1600,640,655,770,32]], roofs:'#8b573d', grass:'#67503c', water:'#583c39', sky:'#a9583f', boats:5},
    {name:'華容狹道', terrain:'泥濘山徑、密林與沼澤', shore:570, camp:[1310,870], port:1390, trees:[[120,830,625,665,31],[1910,795,365,720,34]], roofs:'#733d36', grass:'#494b3e', water:'#434c4a', sky:'#687373', boats:0},
  ];
  const shops={
    weapons:{name:'武器店',keeper:'武器店阿豪',items:[
      {id:'sword',name:'精鐵軍刀',price:35,bonus:3,text:'主線答對一題，多獲得 3 點謀略。'},
      {id:'blade',name:'青鋼長刀',price:75,bonus:6,text:'主線答對一題，多獲得 6 點謀略。'},
    ]},
    supplies:{name:'招募所',keeper:'招募所老徐',intro:'我是聖者老徐。來看看招募名冊，找到能與你同行的夥伴。',items:[
      {id:'rice',name:'軍糧飯糰',price:12,heal:20,text:'立即回復 20 點兵力。'},
      {id:'provisions',name:'行軍糧袋',price:23,heal:45,text:'立即回復 45 點兵力。'},
    ]},
    inn:{name:'阿慧藥房',keeper:'化學老師阿慧',intro:'我是化學老師阿慧。這裡有兩種補血藥，出征前先看看需要哪一瓶。',items:[
      {id:'meal',name:'初級補血藥',price:16,heal:30,text:'立即回復 30 點兵力。'},
      {id:'rest',name:'強效補血藥',price:30,heal:100,text:'兵力回復至 100。'},
    ]},
  };
  const operations=[
    [['潛行突破','熄滅警報烽火','烽火台已熄滅。曹軍外圍巡隊尚未察覺。'],['解救暗哨','擊退牢籠守衛','偵查員獲救，交出曹軍佈防圖。','牢籠先鋒']],
    [['暗中查訪','查看屏風後的密信','密信暴露了假扮宴客的曹營死士。'],['突發護駕','保護周瑜三回合','周瑜安全撤出，死士頭目現身。','曹營刺客',3]],
    [['甲板清障','突破水師盾陣','盾陣已破，可以接近鐵索中樞。','水師盾兵'],['破壞錨鎖','解除鐵環機關','錨鎖已斷，蔡瑁的樓船失去外圍掩護。']],
    [['烈火突圍','救出受困盟軍','受困盟軍已撤至安全的甲板中央。'],['擊潰親衛隊','突破虎衛軍','虎衛軍防線瓦解，張遼現身。','旗艦虎衛']],
    [['泥地追擊','清除滾木落石','岔路口已打通，泥道深處有親衛駐守。'],['突破親衛防線','擊退曹操親衛','曹操失去親衛掩護，停在華容道口。','殿後親衛']],
  ];
  // 每關的村落位置與道路連線都不同；trunk 為主營通往哪個村落，links 為村落之間的道路 [甲,乙,走法]。
  const stagePlans=[
    {settlements:[[540,1250],[1250,1390],[2090,1290],[600,1860],[1370,2010],[2250,1880]],trunk:1,
     links:[[0,1,'hvh'],[1,2,'hvh'],[0,3,'vh'],[3,4,'hvh'],[4,5,'hvh'],[2,5,'vh'],[1,4,'vh']],enc:[0,3]},
    {settlements:[[420,1500],[1000,1250],[1800,1350],[2400,1560],[900,1980],[1850,1950]],trunk:2,
     links:[[1,2,'hvh'],[0,1,'vh'],[2,3,'hvh'],[0,4,'vh'],[4,5,'hvh'],[2,5,'vh'],[3,5,'vh']],enc:[1,4]},
    {settlements:[[700,1330],[1560,1300],[2350,1450],[420,1980],[1280,1880],[2150,2020]],trunk:1,
     links:[[0,1,'hvh'],[1,2,'hv'],[0,3,'vh'],[3,4,'hvh'],[4,5,'hvh'],[1,4,'vh'],[2,5,'vh']],enc:[0,5]},
    {settlements:[[500,1400],[1100,1280],[1900,1300],[2420,1700],[760,2010],[1700,1930]],trunk:1,
     links:[[0,1,'hv'],[1,2,'hvh'],[2,3,'hv'],[0,4,'vh'],[4,5,'hvh'],[2,5,'vh'],[3,5,'hvh']],enc:[1,3]},
    {settlements:[[600,1300],[1450,1450],[2300,1280],[420,1850],[1100,2060],[2000,1960]],trunk:1,
     links:[[0,1,'hvh'],[1,2,'hvh'],[0,3,'vh'],[3,4,'hvh'],[1,5,'vh'],[4,5,'hvh'],[2,5,'vh']],enc:[0,4]},
  ];
  // 每關出場的路人都不同：第 0 關為原班人馬，其餘各關換成新的人物（名字與外觀）。
  const defaultCast={districts:['巡路斥候','江岸船夫','聯軍文書','林間嚮導','補給隊員','遠哨守軍'],
    locals:['村中信使','河岸漁民','木匠','採藥人','牧童','旅人'],encounters:['驛路行商','歇腳旅人','遠行說書人'],guard:'前線守衛'};
  const castStems=['斥候','船夫','文書','嚮導','隊員','守軍','信使','漁民','木匠','採藥人','牧童','旅人','行商','旅客','說書人'];
  const castGivens=[null,
    '阿蘇 老甘 小凌 阿柏 大壯 老魯 小喬 阿潘 木頭 杏姑 小石 老程 阿呂 阿福 老湯',
    '阿蔡 老張 小周 阿韓 大牛 老陳 小蘭 阿衛 鐵柱 蓮姑 小海 老黃 阿甯 阿慶 老梁',
    '阿霍 老賈 小典 阿霸 大錘 老許 小桃 阿褚 山貓 梅姑 小火 老龐 阿麴 阿旺 老丁',
    '阿泥 老嚴 小雨 阿笠 大傘 老蓑 小竹 阿霖 石頭 荷姑 小溪 老嶺 阿霧 阿坡 老苔'];
  const castGuards=['前線守衛','水寨守衛','船塢守衛','火線守衛','關隘守衛'];
  function castFor(stage){
    if(!stage)return defaultCast;
    const g=castGivens[stage].split(' '),n=castStems.map((s,i)=>s+g[i]);
    return {districts:n.slice(0,6),locals:n.slice(6,12),encounters:n.slice(12),guard:castGuards[stage]};
  }
  function layout(stage){
    const cast=castFor(stage),variant=id=>stage?id+'@'+stage:id;
    const area=areas[stage], [x,z]=area.camp;
    const merchants=[
      {id:'weapons',x:x-196,y:z-42,color:'#a35743'},
      {id:'supplies',x:x+6,y:z-118,color:'#997041'},
      {id:'inn',x:x+210,y:z-26,color:'#446c64'},
    ].map(item=>({...item,name:shops[item.id].keeper||shops[item.id].name}));
    const people=[
      {id:'teacher',x:x-292,y:z+136}, {id:'officer',x:x+131,y:z+108},
      {id:'villager',x:x+313,y:z+152}, {id:'guard',name:cast.guard,x:area.port+87,y:area.shore+79},
    ];
    const buildings=merchants.map(shop=>({x:shop.x,z:shop.y-71,w:146,d:89,h:80,roof:shop.color,shop:shop.id}));
    buildings.push(
      {x:x-364,z:z+55,w:119,d:84,h:71,roof:area.roofs},
      {x:x+327,z:z+47,w:142,d:101,h:72,roof:area.roofs},
      {x:x-353,z:z+346,w:175,d:103,h:75,roof:area.roofs},
      {x:x+137,z:z+346,w:146,d:102,h:77,roof:area.roofs},
      {x:area.port+192,z:area.shore+65,w:161,d:105,h:94,roof:area.roofs},
      {x:x-620,z:z-110,w:115,d:89,h:61,roof:area.roofs},
    );
    const harbor=[{x:area.port-38,z:area.shore-225,w:76,d:247}];
    const boats=[];
    for(let i=0;i<area.boats;i++) {
      const side=i%2?1:-1, offset=Math.floor(i/2);
      const boat={x:area.port+side*(121+offset*180),z:area.shore-151-offset*88,w:i===0?102:109,d:182+i*9,fire:stage===3&&i>0};
      boats.push(boat);
      if(i<2) {
        harbor.push({x:Math.min(boat.x,area.port),z:boat.z-19,w:Math.abs(boat.x-area.port),d:38});
        harbor.push({x:boat.x-boat.w*.36,z:boat.z-boat.d*.3,w:boat.w*.72,d:boat.d*.6});
      }
    }
    const routes=[
      [[x-410,z+233],[x-95,z+238]], [[x+230,z+252],[x+554,z+251]],
      [[x+435,z+108],[x+454,z+224]], [[x-126,z+365],[x-103,z+584]],
      [[x+245,z+389],[x+473,z+484]], [[area.port-405,area.shore+104],[area.port-168,area.shore+108]],
    ];
    const landmark={kind:['outpost','hall','watch','shipyard','fort'][stage],
      x:area.port-259,z:area.shore+88,w:[128,154,95,142,172][stage],d:stage===4?87:68};
    let seed=stage+451;
    const random=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
    const treeModels=[];
    for(const [left,top,w,d,count] of area.trees){
      for(let i=0;i<count;i++){
        const tx=left+random()*w,tz=top+random()*d;
        if(Math.abs(tz-z-24)<70||Math.abs(tx-x)<100||buildings.some(b=>Math.abs(b.x-tx)<b.w/2+42&&Math.abs(b.z-tz)<b.d/2+42))continue;
        treeModels.push({x:tx,z:tz,size:60+random()*69,type:i%2});
      }
    }
    const districts=[
      ['松風哨所','青苔渡','夜林驛','幽藍谷','石門坡','南方糧站'],
      ['水榭外營','江畔琴臺','宴客別院','迴廊驛站','東吳糧倉','南岸渡頭'],
      ['巡江岸哨','修船工坊','鐵環倉','江霧瞭望臺','岸邊補給站','東灣船塢'],
      ['東風哨站','火船補給營','江岸救援站','南營避難地','灰燼坡','旗艦撤離點'],
      ['泥道驛站','枯松崗','雨歇村','殿後古道','南嶺糧站','遠山岔口'],
    ][stage];
    const sideStories=[
      ['迷路的信使','松林燈柱','信使迷失在霧裡，請你點亮寫著正確數字的燈柱。','燈柱刻著 18 和 24，請選出最大公因數。',[3,6,12],6,'兩數的最大公因數是 6。信使循燈光平安回營。'],
      ['水榭失印','宴席密匣','掌燈人遺失宴席印信，線索指向水榭旁的密匣。','兩數的最大公因數是 4、最小公倍數是 60，其中一數是 12。另一數是多少？',[15,20,24],20,'4 × 60 ÷ 12＝20。密匣打開，印信找回來了。'],
      ['落水的貨箱','浮箱絞盤','船匠發現兩批物資卡在浮箱下，請你調整絞盤重新分裝。','36 份乾糧和 48 卷繩索最多可分成幾組一模一樣的補給？',[6,12,24],12,'最大公因數是 12。絞盤轉動，浮箱回到了岸邊。'],
      ['灰燼中的信號','雙烽信號臺','救援隊在等兩盞信號燈同步，請你校準信號臺。','兩盞燈分別每 9 秒和每 12 秒亮一次。多久後再次同亮？',[18,24,36],36,'9 和 12 的最小公倍數為 36。兩盞燈同時照亮撤離路線。'],
      ['雨後的渡橋','泥道石閘','村民被泥水困在岔路，請你解開石閘，讓水流離開道路。','石閘密碼除以 4 餘 3、除以 6 餘 5，最小的正整數是多少？',[7,11,23],11,'密碼加 1 是 12 的倍數，所以最小為 11。水流退去，村民可以過橋了。'],
    ];
    const [title,mechanism,greeting,prompt,options,answer,result]=sideStories[stage];
    const sideQuest={title,mechanism,greeting,prompt,options,answer,result,reward:30};
    const animals=[];
    const plan=stagePlans[stage],settlements=plan.settlements;
    const residents=[
      ['巡路斥候','scout','我沿這條路巡查。遇見曹軍，先拉開距離，或利用地形避開追擊。'],
      ['江岸船夫','sailor','江水深，只有棧橋和甲板能通行。要回主營，沿小地圖的道路走。'],
      ['聯軍文書','officer','各處的軍報都會送回主營。準備好後，按「前往戰場」可走向目前任務。'],
      ['林間嚮導','villager','林道旁的屋舍可以當地標。趕路時按住 Shift 跑步。'],
      ['補給隊員','supplies','此處儲存軍糧。購買軍糧或查看招募名冊，請到主營商街找招募所老徐。'],
      ['遠哨守軍','shieldman','這是本區外圍哨站。想知道本章戰況，我可以把軍情說給你聽。'],
    ];
    settlements.forEach(([px,pz],i)=>{
      const [name,kind,message]=residents[i];
      people.push({id:'district-'+i,name:cast.districts[i],kind:variant('district-'+i),x:px,y:pz,role:districts[i],lines:[message]});
      people.push({id:'local-'+i,name:cast.locals[i],kind:variant('local-'+i),x:px+58,y:pz+91,role:districts[i],lines:['我住在'+districts[i]+'。沿路可找到其他居民和聯軍哨站。'],quest:i===0});
      animals.push({id:'animal-'+i+'-goat',animal:'goat',x:px-100,y:pz+130},{id:'animal-'+i+'-chicken',animal:'chicken',x:px+112,y:pz+151});
      routes.push([[px-185,pz+245],[px+135,pz+245]]);
      buildings.push({x:px-82,z:pz-58,w:100,d:78,h:66,roof:area.roofs},{x:px+89,z:pz-66,w:119,d:85,h:77,roof:area.roofs});
      for(let tree=0;tree<11;tree++){
        const angle=tree*Math.PI*2/11;
        treeModels.push({x:px+Math.cos(angle)*205,z:pz+Math.sin(angle)*172,size:65+random()*47,type:tree%2});
      }
    });
    Object.assign(sideQuest,{id:'side-device',x:settlements[0][0]+160,y:settlements[0][1]+200,name:mechanism,role:'支線機關',device:true});
    const hubOf=k=>[settlements[k][0],settlements[k][1]+62];
    const route=(a,b,mode)=>{
      const [ax,ay]=hubOf(a),[bx,by]=hubOf(b),mx=(ax+bx)/2,my=(ay+by)/2;
      return {hv:[[ax,ay],[bx,ay],[bx,by]],vh:[[ax,ay],[ax,by],[bx,by]],hvh:[[ax,ay],[mx,ay],[mx,by],[bx,by]],vhv:[[ax,ay],[ax,my],[bx,my],[bx,by]]}[mode];
    };
    const [trunkX,trunkY]=hubOf(plan.trunk),turn=z+305;
    const linkRoads=plan.links.map(([a,b,mode])=>route(a,b,mode));
    const roads=[
      [[x,z],[x,z+60],[x,turn],[trunkX,turn],[trunkX,trunkY]],
      ...linkRoads,
      [hubOf(0),[settlements[0][0]+160,hubOf(0)[1]],[settlements[0][0]+160,settlements[0][1]+200]],
    ];
    const spurOn=poly=>{
      let best=[0,1];
      for(let k=1;k<poly.length;k++){const len=Math.hypot(poly[k][0]-poly[k-1][0],poly[k][1]-poly[k-1][1]);if(len>best[0])best=[len,k];}
      const a=poly[best[1]-1],b=poly[best[1]],mx=Math.round((a[0]+b[0])/2),mz=Math.round((a[1]+b[1])/2);
      return Math.abs(b[0]-a[0])>=Math.abs(b[1]-a[1])?[[mx,mz],[mx,mz+95]]:[[mx,mz],[mx+95,mz]];
    };
    const spurs=plan.enc.map(k=>spurOn(linkRoads[k]));
    const missionPaths=[
      [[[x,z-28],[x+105,z-100],[x+128,z-170],[x+65,z-220],[x-45,z-235],[x-110,z-295]]],
      [Array.from({length:9},(_,i)=>[x+Math.sin(i*Math.PI/4)*158,z+Math.cos(i*Math.PI/4)*158-245])],
      [[[area.port,area.shore+42],[area.port,area.shore-365]],[[area.port-240,area.shore-186],[area.port+240,area.shore-186]]],
      [Array.from({length:13},(_,i)=>[area.port+Math.sin(i*Math.PI/6)*128,area.shore-174+Math.cos(i*Math.PI/6)*128])],
      [[[x,z+6],[x,z-170],[x-147,z-264]],[[x,z-170],[x+160,z-275]]],
    ][stage];
    if(stage===1)for(const [px,pz] of missionPaths[0])if(pz<area.shore+28)harbor.push({x:px-67,z:pz-67,w:134,d:134});
    if(stage===2)harbor.push({x:area.port-43,z:area.shore-365,w:86,d:400},{x:area.port-240,z:area.shore-219,w:480,d:66});
    if(stage===3){
      const ring=missionPaths[0];
      harbor.push({x:area.port-38,z:area.shore-174,w:76,d:195},{x:area.port-55,z:area.shore-224,w:110,d:110});
      for(const [px,pz] of ring)harbor.push({x:px-48,z:pz-48,w:96,d:96});
      harbor.push({x:area.port-135,z:area.shore-206,w:270,d:64});
    }
    const points=[[missionPaths[0][2],missionPaths[0].at(-1)],[missionPaths[0][6],missionPaths[0][2]],[[area.port-154,area.shore-186],[area.port,area.shore-186]],[missionPaths[0][3],[area.port,area.shore-174]],[missionPaths[0][1],missionPaths[1]?.[1]]][stage];
    const objectives=operations[stage].map(([title,action,result,enemy,rounds],i)=>({title,action,result,enemy,rounds,x:points[i][0],y:points[i][1]}));
    const cliffs=stage===0?missionPaths[0].slice(1,-1).flatMap(([px,pz],i)=>[-1,1].map(side=>({x:px+side*(94+i%2*10),z:pz,w:47,d:42,h:90+i*13}))):[];
    const roadWidth=64,hub=[x,z+60];
    // Short side streets connect services to the district loop. All are visible terrain.
    for(const n of [...people.slice(0,4),...merchants])roads.push([hub,[n.x,n.y]]);
    for(const path of missionPaths){
      const first=path[0];
      if(first[1]>=area.shore)roads.push([hub,first]);
      else roads.push([hub,[area.port,area.shore+40],[area.port,first[1]],first]);
    }
    settlements.forEach(([px,pz],i)=>{
      const h=[px,pz+62];
      for(const n of people.filter(n=>n.id==='district-'+i||n.id==='local-'+i))roads.push([h,[n.x,n.y]]);
      for(const a of animals.filter(a=>a.id.startsWith('animal-'+i+'-')))roads.push([h,[a.x,h[1]],[a.x,a.y]]);
    });
    const encounters=[
      {id:'encounter-0',x:x-110,y:z+170,name:cast.encounters[0],kind:variant('encounter-0'),encounter:0,role:'驛路奇遇'},
      {id:'encounter-1',x:spurs[0][1][0],y:spurs[0][1][1],name:cast.encounters[1],kind:variant('encounter-1'),encounter:1,role:'驛路奇遇'},
      {id:'encounter-2',x:spurs[1][1][0],y:spurs[1][1][1],name:cast.encounters[2],kind:variant('encounter-2'),encounter:2,role:'驛路奇遇'}
    ];
    roads.push([hub,[encounters[0].x,encounters[0].y]],...spurs);
    if(stage===3)roads.push([missionPaths[0][0],[area.port,area.shore-174]]);
    const allPaths=[...roads,...missionPaths];
    const pointDistance=(px,pz,a,b)=>{
      const dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((px-a[0])*dx+(pz-a[1])*dz)/(dx*dx+dz*dz||1)));
      return Math.hypot(px-a[0]-dx*t,pz-a[1]-dz*t);
    };
    const touchesRoad=(px,pz,margin=roadWidth/2)=>allPaths.some(path=>path.some((b,i)=>i&&pointDistance(px,pz,path[i-1],b)<margin));
    function crossesBuilding(b,pad=40){
      return allPaths.some(path=>path.some((end,i)=>{
        if(!i)return false;
        const start=path[i-1];let low=0,high=1;
        for(const [origin,delta,center,radius] of [[start[0],end[0]-start[0],b.x,b.w/2+pad],[start[1],end[1]-start[1],b.z,b.d/2+pad]]){
          if(!delta){if(Math.abs(origin-center)>=radius)return false;continue;}
          const a=(center-radius-origin)/delta,c=(center+radius-origin)/delta;
          low=Math.max(low,Math.min(a,c));high=Math.min(high,Math.max(a,c));
        }
        return low<high;
      }));
    }
    for(let i=cliffs.length-1;i>=0;i--){
      if(!crossesBuilding(cliffs[i]))continue;
      const original=cliffs[i],shifted=[-160,160,-240,240].map(dx=>({...original,x:original.x+dx})).find(c=>!crossesBuilding(c));
      if(shifted)cliffs[i]=shifted;else cliffs.splice(i,1);
    }
    const protectedPoints=[...people,...merchants,...animals,...encounters,sideQuest,...objectives];
    const occupied=(px,pz,r=30)=>buildings.some(b=>Math.abs(b.x-px)<b.w/2+r&&Math.abs(b.z-pz)<b.d/2+r)||protectedPoints.some(n=>Math.hypot(n.x-px,n.y-pz)<r+28)||Math.hypot(landmark.x-px,landmark.z-pz)<130;
    // Move roadside houses back from the carriageway instead of hiding the road under them.
    const placed=[];
    for(const b of buildings){
      const original={...b};let chosen=null;
      for(const [dx,dz] of [[0,0],[0,-80],[-110,0],[110,0],[0,120],[-140,-100],[140,-100],[-160,130],[160,130],[0,-200]]){
        const candidate={...original,x:original.x+dx,z:original.z+dz};
        if(candidate.x<90||candidate.x>width-90||candidate.z<area.shore+70||candidate.z>depth-90||crossesBuilding(candidate))continue;
        if(placed.some(p=>Math.abs(p.x-candidate.x)<(p.w+candidate.w)/2+18&&Math.abs(p.z-candidate.z)<(p.d+candidate.d)/2+18))continue;
        if(protectedPoints.some(n=>Math.abs(n.x-candidate.x)<candidate.w/2+30&&Math.abs(n.y-candidate.z)<candidate.d/2+30))continue;
        chosen=candidate;break;
      }
      if(chosen)placed.push(chosen);
    }
    buildings.splice(0,buildings.length,...placed);
    if(crossesBuilding(landmark)){
      const original={...landmark};
      for(const [dx,dz] of [[-180,0],[-200,150],[-300,160],[200,180]]){
        const candidate={...original,x:original.x+dx,z:original.z+dz};
        if(candidate.x>100&&candidate.z>area.shore+80&&!crossesBuilding(candidate)){Object.assign(landmark,candidate);break;}
      }
    }
    for(let i=treeModels.length-1;i>=0;i--){
      const t=treeModels[i];if(t.x>width-30||t.z>depth-30||touchesRoad(t.x,t.z,52)||occupied(t.x,t.z,18))treeModels.splice(i,1);
    }
    for(let i=0;i<140;i++){
      const px=140+random()*(width-280),pz=area.shore+160+random()*(depth-area.shore-300);
      if(!touchesRoad(px,pz,83)&&!occupied(px,pz,65))treeModels.push({x:px,z:pz,size:54+random()*48,type:i%2});
    }
    const decorations=[];
    for(const [px,pz] of settlements){
      for(const side of [-1,1]){
        const b={x:px+side*168,z:pz+265,w:100,d:76,h:62,roof:area.roofs};
        if(b.z<depth-80&&!crossesBuilding(b)&&!occupied(b.x,b.z,85))buildings.push(b);
      }
      for(const [dx,dz,kind] of [[-158,80,'stall'],[152,88,'lantern'],[-58,196,'garden'],[165,-145,'crates']]){
        const px2=px+dx,pz2=pz+dz;
        if(!touchesRoad(px2,pz2,44)&&!occupied(px2,pz2,16))decorations.push({x:px2,z:pz2,kind});
      }
    }
    const seenDecorations=new Set();
    for(const path of roads)for(let i=1;i<path.length;i++){
      const a=path[i-1],b=path[i],length=Math.hypot(b[0]-a[0],b[1]-a[1]);
      for(let t=70;t<length;t+=160){
        const side=i%2?1:-1,px=a[0]+(b[0]-a[0])*t/length+(b[1]-a[1])/length*55*side,pz=a[1]+(b[1]-a[1])*t/length-(b[0]-a[0])/length*55*side;
        const key=Math.round(px/70)+','+Math.round(pz/70);
        if(pz>area.shore+20&&!seenDecorations.has(key)&&!touchesRoad(px,pz,42)&&!occupied(px,pz,16)){
          decorations.push({x:px,z:pz,kind:decorations.length%3?'lantern':'crates'});seenDecorations.add(key);
        }
      }
    }
    // Plank connectors keep the visible route continuous over water.
    for(const path of allPaths)for(let i=1;i<path.length;i++){
      const a=path[i-1],b=path[i],length=Math.hypot(b[0]-a[0],b[1]-a[1]);
      for(let t=0;t<=length;t+=24){
        const px=a[0]+(b[0]-a[0])*t/(length||1),pz=a[1]+(b[1]-a[1])*t/(length||1);
        if(pz<area.shore+12&&!harbor.some(d=>px>d.x+24&&px<d.x+d.w-24&&pz>d.z+24&&pz<d.z+d.d-24))harbor.push({x:px-38,z:pz-38,w:76,d:76});
      }
    }
    routes.length=0;
    for(const path of roads)for(let i=1;i<path.length;i++){
      const a=path[i-1],b=path[i],length=Math.hypot(b[0]-a[0],b[1]-a[1]);
      if(length<120)continue;
      const from=[a[0]+(b[0]-a[0])*.25,a[1]+(b[1]-a[1])*.25],to=[a[0]+(b[0]-a[0])*.75,a[1]+(b[1]-a[1])*.75];
      if(Math.hypot(from[0]-x,from[1]-z)<230||Math.hypot(to[0]-x,to[1]-z)<230)continue;
      if(protectedPoints.some(n=>pointDistance(n.x,n.y,from,to)<58))continue;
      routes.push([from,to]);
    }
    return {...area,sideQuest,animals,roads,roadWidth,layoutVersion:3,encounters,decorations,missionPaths,objectives,cliffs,width,depth,spawn:{x,y:z},people,merchants,buildings,boats,harbor,routes,landmark,treeModels};
  }
  return {layout,shops,castFor,defaultCast};
})();
