/* Original character models shared by the 3D world and illustrated game panels. */
window.characterDesign = (() => {
  const designs = {
    player:   {name:'年輕軍師', main:'#32756c', dark:'#224b4b', trim:'#cdb779', hat:'topknot', tool:'bamboo', figure:1, face:'youth'},
    'ally-0': {name:'趙雲', main:'#718ba9', dark:'#263a53', trim:'#dce5ec', hat:'plume', tool:'spear', figure:1.08, face:'youth', armor:true, cape:'#e4e5df', jewel:'#5c8cb6', detail:'白纓銀盔、層疊銀甲與青色護頸，披白袍持長槍。'},
    'ally-1': {name:'諸葛亮', main:'#eeebde', dark:'#254454', trim:'#388b91', hat:'scholar', tool:'fan', figure:.98, face:'beard', jewel:'#5fbebd', detail:'青碧金飾高冠、白袍藍襟、長鬚與白羽扇。'},
    'ally-2': {name:'魯肅', main:'#4e637e', dark:'#263749', trim:'#d4ad70', hat:'court', tool:'scroll', figure:1.06, face:'moustache', jewel:'#83a59a', detail:'靛藍長袍繡邊、展翅文冠與外交卷冊。'},
    'ally-3': {name:'黃蓋', main:'#56565b', dark:'#30292b', trim:'#b28a53', hat:'veteran', tool:'whip', figure:1.19, face:'elder', armor:true, cape:'#8c3c2f', jewel:'#8c3e38', detail:'灰白鬚髮、深鋼重甲與銅飾，手持節節相連的鐵鞭。'},
    teacher:  {name:'阿帆', main:'#cbdcf0', dark:'#222731', trim:'#e9effb', hat:'short', tool:'mathbook', figure:1.16, face:'mentor', detail:'短黑髮、深色方框眼鏡、淺藍襯衫、紅色領帶，手拿藍封數學課本。'},
    officer:  {name:'校尉小蓉', main:'#364761', dark:'#222c3c', trim:'#e8b269', hat:'bob', tool:'none', figure:.94, face:'smile', detail:'棕色齊肩髮、深色圓框眼鏡、深藍軍官制服、金色肩章與軍徽。'},
    villager: {name:'阿倫', main:'#305a88', dark:'#202e43', trim:'#b9d9ee', hat:'crop', tool:'basketball', figure:.98, face:'youth', detail:'短黑髮、藍色球衣與橘色籃球，是村裡的籃球高手。'},
    guard:    {name:'前線守衛', main:'#628775', dark:'#35584e', trim:'#b8ad84', hat:'helmet', tool:'halberd', figure:1.05, face:'plain', armor:true},
    weapons:  {name:'武器店阿豪', main:'#b9c2d5', dark:'#293c64', trim:'#dce2ed', hat:'short', tool:'goldenStaff', figure:1.04, face:'plain', detail:'武器店阿豪的美猴王造型。金色頭箍、細框眼鏡與金箍棒，搭配淺灰麻花毛衣。'},
    supplies: {name:'招募所老徐', main:'#7564a2', dark:'#3e3659', trim:'#f2d59a', hat:'short', tool:'staff', figure:1.03, face:'plain', detail:'側分短黑髮、煙色方框眼鏡、紫袍金邊，手持聖杖，在招募所指引軍師尋找夥伴。'},
    inn:      {name:'化學老師阿慧', main:'#e8ecec', dark:'#622a48', trim:'#73cbc1', hat:'bob', tool:'potion', figure:.94, face:'youth', detail:'棕色短髮配齊瀏海、白色實驗外套配酒紅內衫，手拿補血藥瓶。'},
    scout:    {name:'曹軍斥候', main:'#98604f', dark:'#593e3b', trim:'#c68e6a', hat:'band', tool:'dagger', figure:.87, face:'plain'},
    shieldman:{name:'曹軍刀盾兵', main:'#954c43', dark:'#542f34', trim:'#b4a080', hat:'helmet', tool:'shield', figure:1.14, face:'plain', armor:true},
    archer:   {name:'曹軍弓手', main:'#ad7753', dark:'#67493a', trim:'#d1b487', hat:'hood', tool:'bow', figure:.91, face:'plain'},
    sailor:   {name:'曹營水軍', main:'#696f93', dark:'#3d4968', trim:'#c0ab86', hat:'wrap', tool:'oar', figure:1, face:'moustache'},
    veteran:  {name:'曹軍驍將', main:'#8d4655', dark:'#492c39', trim:'#dab77b', hat:'veteran', tool:'halberd', figure:1.17, face:'beard', armor:true},
    'enemy-0':{name:'夏侯淵', main:'#9c513c', dark:'#56332d', trim:'#d5a46b', hat:'plume', tool:'bow', figure:1.1, face:'moustache', armor:true},
    'enemy-1':{name:'江東質疑者', main:'#83668f', dark:'#49395e', trim:'#dbbf9b', hat:'court', tool:'ledger', figure:1, face:'beard'},
    'enemy-2':{name:'蔡瑁', main:'#a4784d', dark:'#5b4338', trim:'#e0bc76', hat:'hood', tool:'halberd', figure:1.16, face:'moustache', armor:true},
    'enemy-3':{name:'張遼', main:'#4f748e', dark:'#2d4058', trim:'#c2c6be', hat:'plume', tool:'halberd', plume:'#bb3634', figure:1.12, face:'beard', armor:true},
    'enemy-4':{name:'曹操', main:'#292932', dark:'#382f48', trim:'#d8b26b', hat:'veteran', tool:'sword', figure:1.2, face:'beard', armor:true, cape:'#23242b'},
  };
  const colorCache=new Map();
  function rgb(hex){
    if(!colorCache.has(hex))colorCache.set(hex,[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255));
    return colorCache.get(hex);
  }
  designs.zhouYu={...designs['ally-1'],name:'周瑜',main:'#eef0ed',dark:'#25466d',trim:'#8baac2',hat:'court',tool:'sword',face:'youth'};
  designs.jiangGan={...designs['ally-2'],name:'蔣幹',main:'#87715e',dark:'#433749',trim:'#b8a386',hat:'wrap',face:'plain'};
  designs['combat-player']={...designs.player,main:'#50545a',dark:'#262429',trim:'#af7d48',hat:'plume',tool:'guandao',armor:true,cape:'#832e2a',plume:'#b83329'};
  // Residents have their own silhouettes and work clothing, not copies of the named heroes.
  Object.assign(designs,{
    'district-0':{name:'巡路斥候',main:'#507452',dark:'#2b4938',trim:'#d7c18a',hat:'band',tool:'spear',figure:.87,face:'plain',costume:'scarf',cape:'#3a5540',detail:'綠色短披肩、皮革護腕，攜長槍巡查。'},
    'district-1':{name:'江岸船夫',main:'#5d8592',dark:'#293e51',trim:'#d8c4a1',hat:'straw',tool:'oar',figure:1.17,face:'moustache',costume:'vest',skin:'#c89472',detail:'寬簷斗笠、靛藍背心與捲袖，手持船槳。'},
    'district-2':{name:'聯軍文書',main:'#9c7855',dark:'#4f3c37',trim:'#ead7ad',hat:'court',tool:'ledger',figure:.93,face:'plain',costume:'sash',detail:'褐金文袍、束腰與低冠，隨身攜帶帳冊。'},
    'district-3':{name:'林間嚮導',main:'#66764b',dark:'#344537',trim:'#babf79',hat:'hood',tool:'lantern',figure:.92,face:'plain',costume:'scarf',cape:'#405542',detail:'苔綠兜帽與灰綠圍巾，手持引路燈籠。'},
    'district-4':{name:'補給隊員',main:'#bb8c48',dark:'#6b4b2d',trim:'#ead3a0',hat:'wrap',tool:'sack',figure:1.18,face:'plain',costume:'apron',detail:'土黃頭巾、厚布圍裙與糧袋。'},
    'district-5':{name:'遠哨守軍',main:'#3d6378',dark:'#233647',trim:'#b6c1bb',hat:'helmet',tool:'shield',figure:1.12,face:'moustache',armor:true,cape:'#364f61',detail:'青鋼甲、白色肩飾，持盾守望遠哨。'},
    'local-0':{name:'村中信使',main:'#ce7854',dark:'#634136',trim:'#f4d49a',hat:'band',tool:'scroll',figure:.79,face:'youth',costume:'satchel',height:.95,detail:'橘色短袍、斜背信袋與紅色頭帶。'},
    'local-1':{name:'河岸漁民',main:'#457e83',dark:'#284c55',trim:'#cbb994',hat:'wrap',tool:'fishbasket',figure:1.03,face:'elder',costume:'vest',skin:'#d1a082',detail:'青藍漁衣、白鬚，提著魚簍。'},
    'local-2':{name:'木匠',main:'#8a5c44',dark:'#46352c',trim:'#d4ae77',hat:'round',tool:'hammer',figure:1.2,face:'moustache',costume:'apron',detail:'皮圍裙、木工帽與鐵錘，胸前掛著工具。'},
    'local-3':{name:'採藥人',main:'#87729b',dark:'#493e61',trim:'#cbd4b5',hat:'ribbon',tool:'herbbasket',figure:.9,face:'youth',costume:'sash',hair:'#4b3532',detail:'紫色長衫、綠色髮帶，竹籃裝著草藥。'},
    'local-4':{name:'牧童',main:'#c3a55b',dark:'#79613c',trim:'#ece0b6',hat:'straw',tool:'crook',figure:.72,face:'youth',costume:'vest',height:.82,detail:'小斗笠、土黃背心，握著牧羊短杖。'},
    'local-5':{name:'旅人',main:'#894e62',dark:'#49354b',trim:'#d9b18e',hat:'hood',tool:'staff',figure:1,face:'beard',costume:'satchel',cape:'#714358',detail:'酒紅旅袍與厚披風，背負遠行布包。'},
    'encounter-0':{name:'驛路行商',main:'#b8753f',dark:'#603f30',trim:'#f1d48d',hat:'round',tool:'ledger',figure:1.24,face:'moustache',costume:'sash',detail:'赭色商袍、金色腰帶與算帳薄冊。'},
    'encounter-1':{name:'歇腳旅人',main:'#5d8295',dark:'#384c68',trim:'#c6d9cd',hat:'topknot',tool:'rucksack',figure:.95,face:'youth',costume:'scarf',detail:'藍灰旅行衣、長圍巾與沉甸甸的行囊。'},
    'encounter-2':{name:'遠行說書人',main:'#9a667a',dark:'#4b3c53',trim:'#e6c9b0',hat:'elder',tool:'fan',figure:1.02,face:'elder',costume:'sash',detail:'梅色長袍、白鬚與摺扇，胸前繡著行雲。'},
    spearman:{name:'曹軍長槍兵',main:'#686d72',dark:'#333e4d',trim:'#d0ba8e',hat:'helmet',tool:'spear',figure:1.02,face:'plain',armor:true,costume:'scarf'},
    raider:{name:'曹營游擊兵',main:'#764c77',dark:'#3d2c48',trim:'#c48f86',hat:'band',tool:'sword',figure:.9,face:'plain',costume:'scarf',cape:'#4d324e'},
    fireguard:{name:'曹軍火衛',main:'#b35737',dark:'#583139',trim:'#e7b86f',hat:'veteran',tool:'halberd',figure:1.2,face:'beard',armor:true,cape:'#89352c'}
  });
  // 第 1～4 關的路人：沿用職業造型，但換上不同的膚色、髮色、衣色、帽子與面貌，看起來是另一個人。
  (() => {
    const hats=['band','straw','court','hood','wrap','round','ribbon','topknot'],faces=['plain','moustache','beard','youth','elder'];
    const skins=['#e2b08e','#c89472','#d1a082','#edc1a4','#b98563'],hairs=['#2e2623','#4b3532','#5a4636','#3a3340'];
    function shift(hex,deg,mul){
      const [r,g,b]=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255),mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2,d=mx-mn;
      let h=0,s=0;
      if(d){s=d/(1-Math.abs(2*l-1));h=mx===r?((g-b)/d)%6:mx===g?(b-r)/d+2:(r-g)/d+4;h*=60;}
      h=(h+deg+360)%360;const L=Math.min(.9,Math.max(.12,l*mul)),C=(1-Math.abs(2*L-1))*s,X=C*(1-Math.abs((h/60)%2-1)),m=L-C/2;
      const [R,G,B]=[[C,X,0],[X,C,0],[0,C,X],[0,X,C],[X,0,C],[C,0,X]][Math.floor(h/60)%6];
      return '#'+[R,G,B].map(v=>Math.round((v+m)*255).toString(16).padStart(2,'0')).join('');
    }
    for(const base of Object.keys(designs).filter(k=>/^(district|local|encounter)-\d$/.test(k)))for(let s=1;s<=4;s++){
      const d=designs[base],n=Number(base.slice(-1))+(base[0]==='l'?6:base[0]==='e'?12:0)+s*3;
      designs[base+'@'+s]={...d,base,main:shift(d.main,s*41+n*7,.92+s*.04),dark:shift(d.dark,s*41+n*7,.95),
        hat:d.armor?d.hat:hats[(n+s)%hats.length],face:d.height?d.face:faces[(n*2+s)%faces.length],
        skin:skins[(n+s)%skins.length],hair:hairs[(n+s*2)%hairs.length],figure:+(d.figure*(.95+((n+s)%5)*.025)).toFixed(2)};
    }
  })();
  function profile(id){return designs[id]||designs.player;}
  function key(actor){return actor.kind==='guard'?'shieldman':actor.kind||actor.id;}

  function mesh(rawId, step=0){
    const id=designs[rawId]?.base||rawId, p=profile(rawId), faces=[];
    const modernMentor=id==='teacher', quartermaster=id==='officer', armorer=id==='weapons', grocer=id==='supplies', innkeeper=id==='inn';
    const {main,dark,trim,figure,armor}=p;
    const skin=p.skin||({teacher:'#e4b398',officer:'#edc1a4',inn:'#edbea3',supplies:'#dfb69b',villager:'#d8ad92',weapons:'#d8ad8c'})[id]||(p.face==='elder'?'#d6a782':'#e4b48a');
    const hair=p.hair||(p.face==='elder'?'#c9c6bc':'#332e2c');
    const steel='#c2d0d1', wood='#846248';
    const add=(points,color,light=1)=>faces.push({points,color:rgb(color).map(c=>Math.min(1,c*light))});
    function loft(x,z,rows,color,sides=16){
      const rings=rows.map(([y,w,d])=>Array.from({length:sides},(_,i)=>{
        const a=(i+.5)*Math.PI*2/sides;
        return [x+Math.cos(a)*w,y,z+Math.sin(a)*d];
      }));
      for(let r=0;r<rings.length-1;r++)for(let i=0;i<sides;i++){
        const next=(i+1)%sides, a=(i+1)*Math.PI*2/sides;
        add([rings[r][i],rings[r][next],rings[r+1][next],rings[r+1][i]],color,.78+.22*Math.sin(a)-.10*Math.cos(a));
      }
      add(rings.at(-1),color,1.13);
    }
    function box(x,y,z,w,h,d,color){
      const v=[[x,y,z],[x+w,y,z],[x+w,y,z+d],[x,y,z+d],[x,y+h,z],[x+w,y+h,z],[x+w,y+h,z+d],[x,y+h,z+d]];
      [[4,5,6,7],[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7]].forEach((part,i)=>add(part.map(j=>v[j]),color,[1.12,.69,.81,.98,.89][i]));
    }
    function crest(x,y,z,r,color){
      add([[x-r,y,z],[x-r*.56,y-r*.64,z],[x+r*.56,y-r*.64,z],[x+r,y,z],[x+r*.56,y+r*.64,z],[x-r*.56,y+r*.64,z]],color,.8);
      add([[x-r*.62,y,z+.18],[x,y-r*.46,z+.18],[x+r*.62,y,z+.18],[x,y+r*.46,z+.18]],color,1.3);
    }
    const shoulder=15*figure;
    for(const side of [-1,1]){
      const swing=step*side;
      loft(side*6.5,swing,[[0,5,7],[11,4.6,5]],dark);
      loft(side*6.5,swing*.48,[[10,4.2,4],[26,5.5,5]],modernMentor||quartermaster||armorer||grocer||innkeeper?dark:main);
      loft(shoulder*side,-swing*.62,[[25,armor?4.6:5.3,5],[40,armor?6.5:7,6],[49,5,4.5]],innkeeper?dark:main);
      loft(shoulder*side,-swing*.62+1,[[22,3.6,3.4],[28,3.6,3.4]],skin);
      if(armor){
        loft(shoulder*side,0,[[39,7.5,7],[45,7.3,6],[51,4.5,4]],trim);
        box(shoulder*side-5,40,6,10,2,1,dark);
        for(let row=0;row<3;row++)box(shoulder*side-5.8,42+row*2.1,6.5-row*.65,11.6,1,1,main);
        crest(shoulder*side,47,5.6,3.3,trim);
      }else box(shoulder*side-4.5,27,4.5,9,2,1.5,trim);
      if(!armor){
        add([[shoulder*side-4,32,5],[shoulder*side-3,32,5],[shoulder*side,44,5.8],[shoulder*side-1,44,5.8]],main,.73);
        add([[shoulder*side+2,33,5.1],[shoulder*side+3,33,5.1],[shoulder*side+3,44,5.8]],main,1.14);
      }
    }
    if(p.cape){
      const hem=[[-23,13,-13],[-15,10,-17],[-7,11,-16],[1,8,-19],[10,11,-17],[22,13,-13]];
      for(let i=0;i<hem.length-1;i++){
        const left=-14+i*5.6;
        add([[left,50,-7],[left+5.6,50,-7],hem[i+1],hem[i]],p.cape,[.93,.79,1.04,.85,.96][i]);
      }
      if(id==='ally-0'){
        add([[-15,49,5],[-3,47,8],[12,49,6],[15,47,5],[2,43,9],[-13,46,7]],p.cape,1.05);
        crest(3,46,9.5,3,'#cfab65');
      }
    }
    loft(0,0,[[quartermaster||armorer?20:modernMentor?26:armor?15:8,modernMentor?13:armor?15:16,8],[29,modernMentor?13:11,8],[44,shoulder*.85,8],[52,8,5]],main);
    loft(0,0,[[26,11.8,7.7],[30,11.9,7.9]],dark);
    box(-3,26,7.4,6,4,2,trim);
    if(armor){
      for(let row=0;row<4;row++){
        for(let col=0;col<4;col++){
          const x=-10+col*5+(row%2)*.5, y=31+row*4, z=7+row*.3;
          box(x,y,z,4.5,3,1.6,row%2?main:trim);
          box(x+.55,y+2.3,z+1.5,3.35,.48,.32,trim);
          box(x+1.8,y+.8,z+1.6,.9,.9,.35,dark);
        }
      }
      for(const side of [-1,1])for(let row=0;row<3;row++)box(side*7-5,13+row*4,6.5,10,3,2,row%2?dark:trim);
    }else if(id==='villager'){
      add([[-6,51,6],[6,51,6],[3,43,8],[3,29,8.1],[-3,29,8.1],[-3,43,8]],trim);
      for(const side of [-1,1])add([[side*8,51,6.2],[side*3,50,7.3],[side*6,45,8],[side*2.8,40,8.3],[side*9,46,7.5]],dark);
      for(let y=32;y<=44;y+=3)for(const x of [-1.7,0,1.7])box(x,y,8.14,.4,.65,.19,'#c4ccda');
    }else if(innkeeper){
      for(const side of [-1,1])add([[side*5,52,5],[side*1,48,8],[side*5,44,8],[side*9,49,7]],dark);
      for(const y of [15,22,33,39])crest(0,y,8.3,1.15,trim);
    }else if(grocer){
      crest(0,38,8.7,4,trim);
      for(const x of [-7,7])box(x,16,8,1,23,.35,trim);
      for(const side of [-1,1])add([[side*6,52,5],[side*1,48,8.5],[side*5,44,8.5],[side*9,49,7]],'#873340');
    }else if(armorer){
      for(const side of [-1,1])add([[side*5,52,5],[side*1,48,8],[side*5,44,8],[side*9,49,7]],'#305fa7');
      for(let x=-8;x<=8;x+=4)for(let y=24;y<=40;y+=4){
        add([[x,y,8.2],[x+1.2,y+1,8.4],[x+2,y+3.5,8.2],[x+.6,y+2.4,8.4]],trim);
      }
    }else if(quartermaster){
      loft(0,0,[[48,6.5,5.2],[52,5.3,4.8],[55,4.8,4.3]],trim,12);
      for(const side of [-1,1])box(side*10-3,45,7,6,3,2,trim);
      for(const y of [32,37,42])crest(0,y,8.5,.9,trim);
      crest(-7,42,8.6,2.4,'#ed9cae');
    }else if(modernMentor){
      add([[-8,52,5],[-1,48,8],[-5,43,8],[-10,49,7]],trim);
      add([[8,52,5],[1,48,8],[5,43,8],[10,49,7]],trim);
      add([[-1.8,48,8.3],[1.8,48,8.3],[1.2,44,8.6],[3.5,31,9],[0,27,9],[-3.5,31,9],[-1.2,44,8.6]],'#a63235');
      for(let row=0;row<4;row++)crest(0,32+row*3.3,9.15,1,'#f6cc9a');
    }else{
      add([[-8,52,5],[0,45,8],[7,51,6],[10,47,7],[1,38,9],[-11,48,7]],trim);
      add([[-3,42,8],[1,40,8],[-8,29,8],[-11,29,8]],trim,.88);
      box(-5,12,7,10,2,1,trim);
      for(let i=0;i<4;i++){
        const x=-12+i*7.4;
        add([[x,10,7.3],[x+1.5,10,7.3],[x+2.9,25,6.9],[x+1.7,25,6.9]],main,i%2?.71:1.17);
      }
      for(let i=0;i<4;i++)crest(-7+i*4.4,14,8.2,1.15,trim);
    }
    if(p.costume==='apron'){
      add([[-9,46,8.8],[9,46,8.8],[12,14,8.7],[-12,14,8.7]],dark);
      box(-7,29,9,14,7,1,trim);
      for(const side of [-1,1])box(side*7-1,44,8.6,2,8,.6,trim);
      if(id==='local-2'){box(-5,32,10,1.5,8,1,'#b5bec5');box(2,31,10,2,9,1,'#86623e');}
    }else if(p.costume==='vest'){
      for(const side of [-1,1])add([[side*7,51,6],[side*17,44,7],[side*12,29,9],[side*2,30,9],[side*3,44,8]],dark);
      for(let y=32;y<45;y+=4)crest(0,y,8.8,.8,trim);
    }else if(p.costume==='scarf'){
      loft(0,0,[[48,7,6],[53,7,5]],trim,12);
      add([[-7,49,8],[-2,48,9],[-3,28,10],[-10,31,9]],trim);
    }else if(p.costume==='satchel'){
      add([[-14,49,8],[-11,50,8],[14,29,9],[11,27,9]],trim);
      box(10,22,6,11,14,7,dark);box(10,32,13,11,3,1,trim);crest(15,30,14,1.5,trim);
    }else if(p.costume==='sash'){
      for(const y of [28,30])box(-12,y,8,24,1.2,.8,trim);
      add([[8,28,9],[12,28,9],[13,12,8],[8,15,9]],trim);
    }
    if(id==='ally-0'){
      for(const side of [-1,1]){
        add([[side*11,42,9],[side*19,46,8],[side*22,41,6],[side*15,38,9]],trim,1.12);
        add([[side*15,39,9],[side*21,41,7],[side*20,36,7],[side*14,35,9]],main);
      }
    }else if(id==='ally-1'){
      for(const side of [-1,1]){
        add([[side*8,49,6],[side*21,43,6],[side*24,28,7],[side*13,27,8]],main);
        add([[side*13,27,8],[side*24,28,7],[side*24,25,7],[side*13,24,8]],trim);
      }
      crest(0,34,8.2,2.4,'#bba66c');
    }else if(id==='ally-2'){
      add([[-11,27,8],[11,27,8],[8,9,8],[-8,9,8]],dark);
      for(let row=0;row<3;row++)crest(0,13+row*5,8.3,2,trim);
    }else if(id==='ally-3'){
      for(const side of [-1,1]){
        add([[side*12,49,7],[side*21,53,5],[side*25,46,4],[side*21,38,7],[side*13,40,9]],dark);
        crest(side*18,45,8.8,4,trim);
      }
      crest(0,28,10,4.5,trim);
    }
    const headStart=faces.length;
    loft(0,0,[[48,4.1,3.7],[56,4.5,4]],skin);
    const jaw=modernMentor?6.3:quartermaster?5.1:innkeeper?5.5:grocer?5.8:id==='villager'?5.9:p.face==='elder'?5.6:p.face==='youth'?4.4:5.1;
    loft(0,.4,[[54,jaw,4.4],[55.5,jaw+.5,5.5],[57,6.5,6.3],[59,7.5,6.8],[62,8.2,7],[65,8.5,7.3],[68,8.55,7.35],[71,8,6.9],[73,7.35,6]],skin,24);
    loft(0,-1,[[65,8.8,6.6],[73,8.3,6.6],[76,5.5,4.6]],hair,12);
    for(const side of [-1,1]){
      const x=side*3.3;
      add([[x-2.1,64.8,7.6],[x+2.1,65.6-side*.35,7.6],[x+1.9,64.6-side*.45,7.8],[x-1.9,64.1,7.8]],hair);
      add([[x-1.9,63,7.95],[x,63.8,8.05],[x+1.85,63,7.95],[x,62.45,8]],'#eee1ca');
      box(x-.79,62.05,8.02,1.48,1.85,.23,'#332b27');
      box(x-.31,63.23,8.29,.49,.49,.11,'#fff4db');
      if(!modernMentor)add([[side*4.4,60.8,8],[side*6.9,60.5,7.5],[side*6.5,59.3,7.4],[side*4.2,59.5,7.8]],'#ed9c91');
      loft(side*7.6,0,[[59,1.8,2.8],[65,1.8,2.8]],skin);
      add([[side*5.4,61,7.15],[side*7.2,61.9,6.6],[side*5.8,59.4,7.1]],skin,.86);
      if(p.face==='elder')add([[x-1.75,61.6,7.7],[x+1.8,62,7.75],[x+.9,61.25,7.83]],skin,.74);
    }
    add([[-.7,65,7.4],[-1.45,60.3,8],[0,60,9.3],[0,64,8.3]],skin,1.14);
    add([[.7,65,7.4],[0,64,8.3],[0,60,9.3],[1.45,60.3,8]],skin,.86);
    add([[-2.9,57.65,7.3],[0,58.1,8.05],[2.9,57.65,7.3],[0,57.27,8]],'#8b5848');
    if(p.face==='elder'||p.face==='beard'){
      const length=p.face==='elder'?44:48;
      add([[-6.5,59,6],[-3,58,8],[0,59,8.6],[3,58,8],[6.5,59,6],[5,53,7],[0,length,9],[-5,53,7]],hair,1.08);
      add([[-1.5,56,8],[0,57,9],[1,length+2,9]],hair,.72);
      for(let i=-2;i<=2;i++)add([[i*1.9,55.4,8.7],[i*1.9+.35,55.6,8.9],[i*.55,length+2+Math.abs(i),9.15]],hair,i%2?.76:1.21);
    }
    if(p.face!=='plain'&&p.face!=='youth'&&!modernMentor&&!quartermaster)add([[-5,59.3,7],[0,61,8.5],[5,59.3,7],[2,58.3,8],[0,59,9],[-2,58.3,8]],hair);

    // Fine facial details remain part of the head and follow every pose.
    for(const side of [-1,1]){
      const x=side*3.3;
      add([[x-1.8,63.9,8.18],[x,64.23,8.25],[x+1.8,63.85,8.18],[x,64.05,8.28]],'#946e5d');
      add([[x-1.5,61.8,8.1],[x,61.5,8.2],[x+1.4,61.85,8.1]],skin,.94);
      add([[side*.45,60.15,9.32],[side*1.15,60.15,8.8],[side*.82,59.9,8.9]],'#986c58');
      add([[side*8.05,61,2],[side*8.7,63,2.4],[side*8.6,59.5,2.6]],skin,.78);
    }
    add([[-1.7,56.8,7.95],[0,56.55,8.08],[1.7,56.8,7.95],[0,56.7,8.12]],skin,1.05);
    if(grocer){
      add([[-2.8,58,8.22],[0,57.5,8.4],[2.8,58,8.22],[1.6,56.8,8.1],[-1.6,56.8,8.1]],'#995d55');
      add([[-2.1,57.8,8.43],[2.1,57.8,8.43],[1.3,57.25,8.45],[-1.3,57.25,8.45]],'#f4e7d7');
    }
    if(armorer){
      for(const side of [-1,1]){
        loft(side*8.7,1,[[60,2,2],[64,2.9,2.3],[67,2.3,1.9]],'#896048',10);
        add([[side*7.5,62,7.8],[side*9,59,6.8],[side*7.5,55,6.9],[side*5.6,57,8]],'#9b6b48');
      }
    }
    switch(p.hat){
      case 'bob': {
        const chestnut='#56362d';
        loft(0,-.9,[[66,9.6,7.4],[72,10,7.8],[76,8,6.4],[79,3.5,3.3]],chestnut,14);
        loft(0,-4,[[innkeeper?54:48,8.2,4],[57,9.2,5],[69,9.5,5.5]],chestnut,14);
        for(const side of [-1,1]){
          loft(side*8.8,.6,[[innkeeper?54:49,2.5,3.3],[innkeeper?58:54,3.3,4],[65,2.8,4.5],[71,1.3,3.2]],chestnut,10);
          if(innkeeper)continue;
          const center=side*4.55;
          for(let i=0;i<12;i++){
            const a=i*Math.PI/6,b=(i+1)*Math.PI/6;
            const point=(angle,r)=>[center+Math.cos(angle)*4.05*r,63.6+Math.sin(angle)*3.25*r,8.9];
            add([point(a,1),point(b,1),point(b,.85),point(a,.85)],'#332b2e');
          }
        }
        if(!innkeeper)box(-.85,64,8.8,1.7,.5,.3,'#332b2e');
        if(innkeeper){
          for(let i=0;i<7;i++){
            const x=-8.4+i*2.4;
            add([[x,74,7],[x+2.8,74,7],[x+2.1,67.6+i%2,8.2],[x,68.4,8.2]],i%2?'#57352f':'#482e2c');
          }
        }else add([[-8.8,69,6],[-4.4,76,6.8],[5.3,74.5,7.4],[9.3,66.3,7.1],[3,69.8,7.9],[-3,73,7.9]],'#633e31');
        add([[-3.4,58.6,8.3],[0,57.8,8.5],[3.4,58.6,8.3],[1.7,56.7,8.2],[-1.7,56.7,8.2]],'#a95e58');
        add([[-2.4,58.3,8.51],[2.4,58.3,8.51],[1.3,57.65,8.53],[-1.3,57.65,8.53]],'#f9e6da');
        break;
      }
      case 'crop':
        loft(0,-.6,[[65,8.95,6.6],[70,9.3,7],[75,7.6,6.4],[77,4,4]],'#242427',14);
        for(let i=0;i<7;i++){
          const x=-7.7+i*2.15;
          add([[x,73,6.8],[x+2.6,73.8,6.8],[x+1.8,68.1+i%2,7.75],[x,69.6,7.6]],i%2?'#2c2c31':'#202024');
        }
        break;
      case 'short':
        loft(0,-.6,[[66,9.2,7.2],[71,9.3,7.4],[75,7.1,6.5],[77,4,3.4]],'#252526',14);
        for(const side of [-1,1]){
          const x=side*4.55;
          if(grocer)box(x-3.55,61.95,8.45,7.1,3.25,.18,'#66565a');
          if(armorer||grocer){
            for(const y of [61.6,65.35])box(x-3.8,y,8.6,7.6,.28,.3,'#4e5663');
            for(const edge of [-3.8,3.5])box(x+edge,61.6,8.6,.3,4,.3,'#4e5663');
            continue;
          }
          box(x-3.95,61.4,8,7.9,4.7,.85,'#211f21');
          box(x-3.25,62.05,8.82,6.5,3.32,.24,'#493a3b');
          add([[side*8,65,8.8],[side*9,65,8.1],[side*9.6,64,3.4],[side*8.8,64,3.4]],'#252426');
        }
        box(-1.1,64.3,8.8,2.2,armorer||grocer?.27:.7,.4,armorer||grocer?'#4e5663':'#232326');
        if(grocer)add([[-8.2,68,6.7],[-4.7,74,7.5],[4.6,75.5,6.8],[1,71.5,8.1],[-5.3,67.9,7.9]],'#303139');
        if(armorer){
          loft(0,-.6,[[69,9.6,7.7],[70.4,9.7,7.8]],'#e8b94e',14);
          crest(0,70.2,7.5,2.1,'#ffdb73');
        }
        break;
      case 'plume':
        loft(0,-1,[[67,9.3,7.7],[70,9.65,7.9],[76,9,7],[80,5,4.6]],trim,12);
        for(const side of [-1,1]){
          add([[side*8.9,75,4],[side*11.4,78,1],[side*10.3,65,4],[side*7.8,57,6],[side*7.7,66,7]],trim,.86);
          add([[side*8.8,72,5.8],[side*10,74,3.8],[side*9.4,64,5.5],[side*8,60,6.8]],trim,1.21);
        }
        crest(0,71,7.15,4.2,dark);
        crest(0,71,7.45,2.75,p.jewel||trim);
        loft(0,-4,[[78,3,3],[85,3.7,3.4],[91,2.8,2.4],[95,1.1,1]],p.plume||'#e9e5dd',10);
        for(let i=0;i<7;i++)add([[-1+i*.6,88-i*.5,-5],[i*.8+3,87-i,-10],[i*1.65+5,82-i*.9,-22-i*.65],[i*1.2+3,86-i*.8,-15]],p.plume?(i%2?'#8c251e':'#dc4a31'):(i%2?'#c8d1d7':'#f0ede3'));
        break;
      case 'scholar':
        loft(0,-.9,[[69,8.85,6.9],[73,9.2,7.2],[83,10.6,7.25],[88,10,6.1]],'#2c8997',12);
        loft(0,-.9,[[69,9,7],[73,9.35,7.22]],'#d3ab62',12);
        for(let i=-2;i<=2;i++)add([[i*3.5,73,6.4],[i*3.5+.55,73,6.4],[i*3.95+.67,86,6.12],[i*3.95,86,6.12]],'#b99353');
        crest(0,72,6.7,4.25,'#debb76');crest(0,72,6.97,2.35,p.jewel||'#5bafb8');
        for(const side of [-1,1]){
          add([[side*7.5,70,-2],[side*10,69,-3],[side*11.5,48,-5],[side*8,42,-10],[side*6,55,-6]],hair);
          add([[side*7.5,73,-4],[side*8.5,73,-4],[side*11.5,56,-13],[side*16.5,51,-15],[side*11.5,54,-14]],'#479eaa');
        }
        break;
      case 'court': case 'elder':
        loft(0,-.8,[[69,9.2,7],[74,9.5,7.2],[81,p.hat==='court'?8.4:6.4,6.3],[85,5.7,4.9]],dark);
        box(-8,71,5.2,16,2,1.3,trim);
        if(p.hat==='court')for(const side of [-1,1])box(side*10-5,77,-4,9,2,4,dark);
        if(p.jewel)crest(0,73,6.7,3,p.jewel);
        break;
      case 'ribbon':
        loft(0,-2,[[66,9,7],[74,8,6.5],[78,4,3]],hair,16);
        loft(0,-6,[[74,4,3],[81,4.4,3.2],[84,2,2]],hair,12);
        box(-8,70,6.8,16,2,1.5,trim);
        add([[7,72,7],[11,75,6],[13,72,6],[10,70,7],[14,57,5],[10,60,6]],trim);
        break;
      case 'straw':
        loft(0,0,[[68,16,13],[71,15.5,12.5],[78,5.5,4.8]],trim);
        break;
      case 'helmet': case 'veteran':
        loft(0,-.5,[[66,9.8,8],[72,10,8.3],[79,7.9,6.7],[81,4,4]],dark);
        box(-8,68,7.1,16,3,2,trim);
        for(const side of [-1,1])box(side*9-2,60,-3,4,11,8,main);
        if(p.hat==='veteran'){
          loft(0,-3,[[79,4.5,3],[88,3,2.8],[91,.8,1.2]],main);
          crest(0,72,8.8,4.1,trim);
          crest(0,72,9.03,2,p.jewel||dark);
        }
        break;
      case 'hood': case 'wrap': case 'round':
        loft(0,-1,[[p.hat==='hood'?62:68,9.5,7.9],[75,9,7],[79,5.6,4]],main);
        box(-8,68,6.4,16,2,1.5,trim);
        if(p.hat==='hood')add([[-9,70,5],[-7,60,6],[-6,56,5],[-10,56,3]],dark);
        break;
      case 'band':
        box(-8,67,6.5,16,3,1.6,main);
        add([[6,70,4],[9,70,3],[15,66,1],[11,66,2]],trim);
        break;
      default:
        loft(0,-3,[[74,4,3.4],[82,4.5,3.7],[85,2.5,2.4]],dark);
        box(-4,77,-.5,8,2,1.3,trim);
    }

    if(['short','crop','bob'].includes(p.hat)){
      const bob=p.hat==='bob';
      for(let i=0;i<14;i++){
        const x=-7.4+i*1.1, y=74.3-Math.abs(x)*.32;
        add([[x,y,7.2],[x+.23,y+.1,7.3],[x+(grocer?2: .6),y-3.5,7.83]],bob?'#78503f':'#454347');
      }
      if(modernMentor||grocer){
        for(const side of [-1,1])add([[side*2,65,9.1],[side*5,65,9.1],[side*6.5,63.5,9.1],[side*6,63.5,9.1]],'#857b78');
      }
      if(quartermaster)for(const side of [-1,1])crest(side*8.7,58.5,3, .65,'#dcb882');
    }
    const headEnd=faces.length;
    const hand=shoulder+2, z=6-step*.62;
    const upright=(bottom,top,color)=>box(hand-1.5,bottom,z-1.4,3,top-bottom,3,color);
    const blade=(bottom,top,width,color)=>{
      add([[hand-width/2,bottom,z],[hand+width/2,bottom,z],[hand+width/3,top-8,z],[hand,top,z],[hand-width/3,top-8,z]],color);
      add([[hand,bottom,z+.1],[hand+width/2,bottom,z+.1],[hand,top,z+.1]],color,.78);
    };
    switch(p.tool){
      case 'spear': upright(2,89,wood);blade(85,103,9,steel);box(hand-4,82,z-1,8,3,3,trim);if(id==='ally-0')add([[hand,84,z+2],[hand-6,80,z+3],[hand-11,71,z+3],[hand-4,74,z+3]],'#923e39');break;
      case 'halberd': upright(1,82,wood);blade(79,96,7,steel);add([[hand,80,z],[hand+13,76,z],[hand+10,91,z],[hand,88,z]],steel);break;
      case 'whip': upright(13,36,wood);for(let i=0;i<5;i++)loft(hand,z,[[34+i*6,3.8-i*.36,2.8],[39+i*6,3.5-i*.35,2.6]],steel);break;
      case 'staff': upright(0,77,wood);loft(hand,z,[[74,3.4,2.8],[80,4,3.7],[84,1.5,1.6]],trim);break;
      case 'fan':
        upright(23,36,wood);
        for(let i=-4;i<=4;i++){
          const tip=hand+i*3.2, y=57-Math.abs(i)*1.95, feather=i%2?'#dfe5e2':'#f3efdf';
          add([[hand,32,z],[tip-2.4,y-9,z],[tip,y,z],[tip+2.5,y-7,z],[tip+1.8,y-12,z]],feather);
          add([[hand,32,z+.3],[tip,y,z+.3],[tip+.66,y-8,z+.35]],feather,.74);
        }
        crest(hand,34,z+.8,4.25,'#355768');
        break;
      case 'bow':
        for(const side of [-1,1])add([[hand,33,z],[hand-3,33+side*8,z],[hand+1,33+side*17,z],[hand+3,33+side*17,z],[hand,33+side*7,z],[hand+2,33,z]],trim);
        box(hand+.5,16,z+.2,.7,34,.7,'#e6d4ad');box(-17,39,-10,7,24,7,dark);
        for(let i=0;i<3;i++)box(-17+i*2.6,62,-8,1.2,6+i,1,trim);
        break;
      case 'shield':
        add([[-hand-9,45,13],[-hand+8,45,13],[-hand+10,28,13],[-hand,18,13],[-hand-10,28,13]],trim);
        add([[-hand-7,43,14],[-hand+6,43,14],[-hand+8,29,14],[-hand,21,14],[-hand-8,29,14]],dark);
        box(-hand-2,30,14,4,5,2,steel);upright(17,33,wood);blade(31,56,7,steel);break;
      case 'guandao': {
        const weaponStart=faces.length;
        box(hand-1.4,-4,z-1.4,2.8,98,2.8,dark);
        for(const y of [4,19,38,66,85,91])box(hand-2,y,z-2,4,2.4,4,trim);
        for(const side of [-1,1]){
          const face=z+side*1.4;
          add([[hand-2,90,face],[hand-5,100,face],[hand+2,114,face],[hand+17,126,face],[hand+15,111,face],[hand+9,98,face],[hand+3,91,face]],steel);
          add([[hand,93,face+side*.1],[hand-2,100,face+side*.1],[hand+4,111,face+side*.1],[hand+13,120,face+side*.1],[hand+9,107,face+side*.1],[hand+5,99,face+side*.1]],'#41434a');
          for(let i=0;i<4;i++)crest(hand+i*2.35,100+i*4.4,face+side*.22,1.5,trim);
        }
        for(let i=weaponStart;i<faces.length;i++)faces[i].pivot=[hand,27,z];
        break;
      }
      case 'oar': upright(8,59,wood);add([[hand-5,57,z],[hand+5,57,z],[hand+6,75,z],[hand-4,77,z]],trim);break;
      case 'sword': case 'dagger': upright(17,32,wood);box(hand-4,30,z-1,8,2,3,trim);blade(32,p.tool==='sword'?72:49,7,steel);break;
      case 'hammer': upright(14,44,wood);box(hand-7,40,z-2,14,8,6,steel);break;
      case 'ledger': box(hand-5,22,z,10,13,3,dark);for(let i=0;i<3;i++)box(hand-4,25+i*3,z+3,8,.7,1,trim);break;
      case 'basket': loft(hand,z,[[18,7,4],[30,8,5]],wood);loft(hand,z,[[28,8.3,5],[31,8.5,5.4]],trim);break;
      case 'fishbasket': case 'herbbasket':
        loft(hand,z,[[17,6,4],[31,9,5.5]],wood,12);
        for(const y of [20,25,30])loft(hand,z,[[y,8,5],[y+.8,8.5,5.5]],trim,12);
        if(p.tool==='fishbasket')for(const dx of [-3,2])add([[hand+dx,29,z+6],[hand+dx-2,35,z+6],[hand+dx,39,z+6],[hand+dx+2,35,z+6]],'#92aeb1');
        else for(const dx of [-5,0,5])add([[hand+dx,29,z+4],[hand+dx-3,36,z+4],[hand+dx+1,41,z+4],[hand+dx+2,34,z+4]],'#6a9b5b');
        break;
      case 'crook':
        upright(4,61,wood);
        add([[hand-1,60,z],[hand-5,64,z],[hand-9,62,z],[hand-9,57,z],[hand-7,57,z],[hand-7,61,z],[hand-4,62,z],[hand+1,59,z]],wood);
        break;
      case 'lantern':
        upright(22,49,wood);
        box(hand-6,24,z-3,12,14,8,'#d7a752');
        box(hand-7,22,z-4,14,2,10,dark);box(hand-7,38,z-4,14,2,10,dark);
        for(const dx of [-5,0,5])box(hand+dx,24,z+5,1,14,1,dark);
        break;
      case 'rucksack':
        loft(hand,z,[[16,5,4],[21,8,6],[34,7,5],[38,3,3]],dark,12);
        box(hand-1,18,z+6,2,18,1,trim);box(hand-6,29,z+5,12,2,1,trim);break;
      case 'sack': loft(hand,z,[[17,5,4],[22,8,5],[31,6,5],[35,3,3]],trim);box(hand-4,32,z-2,8,2,5,wood);break;
      case 'tray': box(hand-7,27,z-2,14,2,11,wood);loft(hand,z+3,[[29,3,3],[34,5,4]],'#dbbc86');break;
      case 'scroll': box(hand-3,19,z,6,16,4,trim);if(id==='ally-2'){box(hand-3,25,z+4,6,1.3,.5,'#8a4434');crest(hand,26,z+4.6,1.4,'#8a4434');}box(hand-4,18,z-1,8,2,6,wood);box(hand-4,34,z-1,8,2,6,wood);break;
      case 'goldenStaff':
        upright(5,91,'#963d31');
        for(const [bottom,top] of [[5,17],[79,91]]){
          loft(hand,z,[[bottom,2.5,2.5],[top,2.5,2.5]],'#dfab3e',10);
          for(const y of [bottom+1,bottom+4,top-2])loft(hand,z,[[y,2.7,2.7],[y+1,2.7,2.7]],'#ffda69',10);
        }
        break;
      case 'mathbook':
        box(hand-8,20,z+2,16,20,4,'#244670');
        box(hand-6,21,z+3,13,18,3,'#f7ecd2');
        box(hand-8,20,z+6,16,20,1.3,'#3878a8');
        box(hand-7,20,z+7,1.4,20,.65,'#1b4267');
        box(hand-3,33,z+7.4,6,1.2,.5,'#ffdf93');
        box(hand-.6,30.6,z+7.4,1.2,6,.5,'#ffdf93');
        for(const y of [25,27])box(hand-3,y,z+7.4,6,.65,.5,'#ffdf93');
        break;
      case 'potion':
        loft(hand,z+4,[[23,2,2],[24,5,4],[30,5.5,4.6],[34,2,2],[38,2,2]],'#54c9ba',14);
        loft(hand,z+4,[[23.4,2.5,2.4],[25,4.9,4.1],[29,5,4.3]],'#bc436f',14);
        loft(hand,z+4,[[36,2.6,2.6],[39,2.6,2.6]],'#dbae6e',12);
        box(hand-2,26,z+8.1,4,4,.5,'#fff0ce');
        box(hand-1.35,27.6,z+8.65,2.7,.7,.3,'#b73659');
        box(hand-.35,26.6,z+8.65,.7,2.7,.3,'#b73659');
        break;
      case 'basketball': {
        const cy=25, cz=z+6, r=7;
        loft(hand,cz,[-1,-.92,-.7,-.4,0,.4,.7,.92,1].map(k=>[cy+r*k,Math.max(.06,r*Math.sqrt(1-k*k)),Math.max(.06,r*Math.sqrt(1-k*k))]),'#e88136',24);
        for(const [u,v] of [[[1,0,0],[0,0,1]],[[0,1,0],[0,0,1]],[[.707,.707,0],[0,0,1]]]){
          const ring=(t,h)=>[hand+7.09*(u[0]*Math.cos(t)+v[0]*Math.sin(t))+h*u[1],cy+7.09*(u[1]*Math.cos(t)+v[1]*Math.sin(t))-h*u[0],cz+7.09*(u[2]*Math.cos(t)+v[2]*Math.sin(t))];
          const band=ring;
          for(let j=0;j<24;j++){const a=j*Math.PI/12,b=(j+1)*Math.PI/12;add([band(a,-.22),band(b,-.22),band(b,.22),band(a,.22)],'#61392c');}
        }
        break;
      }
      case 'none': break;
      default: for(let i=0;i<4;i++)box(hand-5+i*2.4,20,z+i*.6,2,16,2,trim);
    }
    return faces.map(({points,color,pivot},index)=>{
      const isHead=index>=headStart&&index<headEnd;
      const isProp=index>=headEnd;
      const shape=([x,y,z])=>{
        if(isHead){
          const width=1+Math.min(1,Math.max(0,(y-50)/7))*.72;
          return [x*width,36+(y-50)*1.38,z*width];
        }
        return [x*.94,y*(isProp?.8:.72),z*.94];
      };
      const scaled=point=>{const result=shape(point);return result.map(value=>value*(p.height||1));};
      return {points:points.map(scaled),color,...(pivot?{pivot:scaled(pivot)}:{})};
    });
  }

  const portraits=new Map();
  const escape=text=>String(text).replace(/[&"<>]/g,c=>({'&':'&amp;','"':'&quot;','<':'&lt;','>':'&gt;'}[c]));
  function portrait(id,label=profile(id).name){
    if(!portraits.has(id)){
      const angle=0, c=Math.cos(angle), s=Math.sin(angle);
      const shapes=mesh(id).map(face=>{
        const points=face.points.map(([x,y,z])=>[55+(x*c-z*s)*1.17,123-y*1.08+(x*s+z*c)*.19,x*s+z*c]);
        return {points,depth:points.reduce((sum,p)=>sum+p[2],0)/points.length,color:face.color};
      }).sort((a,b)=>a.depth-b.depth);
      portraits.set(id,shapes.map(({points,color})=>`<polygon points="${points.map(([x,y])=>`${x.toFixed(1)},${y.toFixed(1)}`).join(' ')}" fill="rgb(${color.map(value=>Math.round(value*255)).join(',')})"/>`).join(''));
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 130" role="img" aria-label="${escape(label)}">${portraits.get(id)}</svg>`;
  }
  return {profile,key,mesh,portrait};
})();
