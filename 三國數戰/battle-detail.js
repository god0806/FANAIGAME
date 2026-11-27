(() => {
  const arena=document.querySelector('.landscape');

  const repeat=(count,draw)=>Array.from({length:count},(_,i)=>draw(i)).join('');
  const forest=repeat(14,i=>{
    const x=i*79-20, y=180+i%4*12;
    return '<g transform="translate('+x+' '+y+')"><path d="M-10 36 0-125 13-128 14 36Z" fill="#182724"/><path d="M-66-58 3-172 64-54 31-64 82-17-74-19-31-64Z" fill="'+(i%2?'#263b33':'#20312f')+'"/></g>';
  });
  const ship=(x,y,size)=>'<g transform="translate('+x+' '+y+') scale('+size+')"><path d="M0 0h208l-32 27H28Z" fill="#28292e"/><path d="M38 0v-34h124V0M52-34v-34h95v34M93-68v-35h4v35" fill="#30373d"/><path d="m96-100 53 16-53 9Z" fill="#783d38"/><path d="M38-20h124m-111-31h95" stroke="#c18d67" stroke-opacity=".55"/></g>';
  const deck='<path d="M0 223 245 195h510l245 28v107H0Z" fill="#403932"/><g fill="none" stroke="#947452" opacity=".48">'+repeat(13,i=>'<path d="M'+(i*90-40)+' 330 '+(i*39+250)+' 195"/>')+'<path d="M0 236h1000M0 263h1000M0 302h1000"/></g>';
  const river='<path d="M0 170h1000v160H0Z" fill="#283f50"/><g class="arena-waves" fill="none" stroke="#a2c4ce" opacity=".37">'+repeat(16,i=>'<path d="M'+(i*73-80)+' '+(175+i%4*13)+'q36-11 91 0t108 0"/>')+'</g>';
  const scenes=[
    forest+'<path d="M0 236 359 180 657 184 1000 228v102H0Z" fill="#263333"/><path d="m210 330 260-137h78l255 137Z" fill="#545648"/><g fill="#a2e6a6">'+repeat(35,i=>'<circle cx="'+(i*137%1000)+'" cy="'+(193+i*19%120)+'" r="'+(1+i%3)+'"/>')+'</g>',
    '<path d="M0 0h1000v210H0Z" fill="#523332"/><path d="M0 0 300 37 500 88 700 37 1000 0v32L500 111 0 32Z" fill="#2a2029"/><path d="M235 54h530v160H235Z" fill="#715047"/>'+deck+repeat(7,i=>'<g transform="translate('+(195+i*101)+' 82)"><path d="M0-32v161m9-127h68v107H9Z" fill="#836553" stroke="#402831" stroke-width="5"/><path d="m17 86 29-48 12 24 12-14" fill="none" stroke="#b39a79"/><path d="M35 14q-8-8 2-23 10 15 2 23Z" fill="#ffd591"/></g>')+'<path d="m483 81 19 30-13 26 18 34-10 33" fill="none" stroke="#2b1d25" stroke-width="5"/>',
    river+ship(65,186,1)+ship(294,178,.9)+ship(505,173,.86)+ship(727,190,1.1)+'<path d="M204 185q52 25 108 0m145-7q37 28 85 0m127 1q57 25 106 0" fill="none" stroke="#201f23" stroke-width="6" stroke-dasharray="8 3"/>'+deck,
    river+ship(18,182,1.14)+ship(296,185,1.1)+ship(620,194,1.42)+deck+'<g class="arena-flames">'+repeat(19,i=>'<path d="M'+(i*56-12)+' 227q-25-26 4-49t9-62q44 43 22 77 20-13 23-36 22 45-1 70Z" fill="'+(i%2?'#ff973e':'#d74d30')+'"/>')+'</g>',
    forest+'<path d="M0 209 412 175h171l417 36v119H0Z" fill="#3e4038"/><path d="m173 330 260-146h140l291 146Z" fill="#665c4e"/>'+repeat(10,i=>'<ellipse cx="'+(300+i*147%445)+'" cy="'+(220+i*17%101)+'" rx="'+(13+i*4)+'" ry="'+(3+i%4)+'" fill="#8f8a7c" opacity=".48"/>')
  ];
  const backdrop=document.createElementNS('http://www.w3.org/2000/svg','svg');
  backdrop.setAttribute('class','arena-detail');
  backdrop.setAttribute('viewBox','0 0 1000 330');
  backdrop.setAttribute('preserveAspectRatio','xMidYMid slice');
  backdrop.setAttribute('aria-hidden','true');
  arena.append(backdrop);
  arena.insertAdjacentHTML('beforeend','<div class="arena-vignette" aria-hidden="true"></div><div class="arena-location"><span id="arena-area"></span><small id="arena-terrain"></small></div><div id="arena-impact" class="arena-impact" aria-hidden="true"><i></i>'+repeat(12,i=>'<b style="--angle:'+(i*30)+'deg;--travel:'+(28+i%4*12)+'px"></b>')+'</div><div class="chapter-particles" aria-hidden="true">'+repeat(22,i=>'<i style="--x:'+(i*37%101)+'%;--delay:-'+(i*.31)+'s;--duration:'+(3+i%5)+'s"></i>')+'</div>');
  let displayedStage=-1;
  const render=window.battleRender;
  const animate=window.battleAnimate;
  const impact=document.getElementById('arena-impact');
  window.battleRender=(stage,index,hp,name)=>{
    arena.classList.remove("chapter-intro");
    if(index===0){void arena.offsetWidth;arena.classList.add("chapter-intro");}
    render(stage,index,hp,name);
    document.getElementById('enemy-nameplate').textContent=window.campaignChapter(stage).enemy;
    const [area,encounter,sky,ridge,terrain]=window.campaignChapter(stage).arena;
    if(stage!==displayedStage){
      displayedStage=stage;
      arena.dataset.chapter=stage;
      backdrop.innerHTML='<rect width="1000" height="330" fill="'+sky+'"/><circle cx="735" cy="66" r="26" fill="#f4d8a8" opacity=".65"/><path d="M0 159 90 91l89 56 117-74 122 80 137-82 112 81 105-72 109 65 119-56v141H0Z" fill="'+ridge+'"/>'+scenes[stage];
    }
    arena.style.setProperty('--arena-sky',sky);
    arena.style.setProperty('--arena-ridge',ridge);
    document.getElementById('arena-area').textContent=area+' · '+encounter;
    document.getElementById('arena-terrain').textContent=terrain;
    impact.removeAttribute('data-impact');
  };
  window.battleAnimate=(action,final)=>{
    arena.classList.remove("chapter-intro");
    impact.classList.toggle("final-strike",final&&action==="hit");
    animate(action,final);
    impact.removeAttribute('data-impact');
    void impact.offsetWidth;
    impact.dataset.impact=action;
  };
})();
