/* Flat-shaded terrain and character meshes, rendered with an eye-level camera. */
window.createVillageScene = function (canvas) {
  const gl=canvas.getContext('webgl',{alpha:false,antialias:true});
  const context=gl?null:canvas.getContext('2d');
  const pitch=.16, sine=Math.sin(pitch), cosine=Math.cos(pitch), eye=62, near=7;
  const camera={x:0,z:0,right:1,turn:0};
  let world, width=0, height=0, focal=1, midX=0, midY=0, previous, staticMesh=[];
  const rgbCache=new Map();
  function rgb(hex){
    if(!rgbCache.has(hex))rgbCache.set(hex,[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255));
    return rgbCache.get(hex);
  }
  const mix=(a,b,t)=>a.map((channel,i)=>channel+(b[i]-channel)*t);
  const tint=(hex,factor)=>rgb(hex).map(channel=>Math.max(0,Math.min(1,channel*factor)));

  function polygon(mesh, points, color){
    const x=points.reduce((sum,p)=>sum+p[0],0)/points.length;
    const z=points.reduce((sum,p)=>sum+p[2],0)/points.length;
    mesh.push({points,color:typeof color==='string'?rgb(color):color,x,z});
  }
  function quad(mesh,x,y,z,w,d,color){
    polygon(mesh,[[x,y,z],[x+w,y,z],[x+w,y,z+d],[x,y,z+d]],color);
  }
  function prism(mesh,x,y,z,w,h,d,color,transform=point=>point){
    const points=[[0,0,0],[w,0,0],[w,0,d],[0,0,d],[0,h,0],[w,h,0],[w,h,d],[0,h,d]]
      .map(([xx,yy,zz])=>transform([x+xx,y+yy,z+zz]));
    const sides=[[4,5,6,7],[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7]];
    sides.forEach((side,i)=>polygon(mesh,side.map(index=>points[index]),tint(color,[1.14,.70,.80,.92,1][i])));
  }
  function ellipse(mesh,x,y,z,rx,rz,color){
    const points=Array.from({length:10},(_,i)=>{
      const a=i*Math.PI/5;
      return [x+Math.cos(a)*rx,y,z+Math.sin(a)*rz];
    });
    polygon(mesh,points,color);
  }
  function roof(mesh,x,z,w,d,height,color){
    const left=x-w/2,right=x+w/2,back=z-d/2,front=z+d/2;
    const ridge=height+33;
    polygon(mesh,[[left,height,back],[right,height,back],[right-15,ridge,z],[left+15,ridge,z]],tint(color,.85));
    polygon(mesh,[[left+15,ridge,z],[right-15,ridge,z],[right,height,front],[left,height,front]],tint(color,1.12));
    polygon(mesh,[[left,height,back],[left+15,ridge,z],[left,height,front]],tint(color,.7));
    polygon(mesh,[[right,height,front],[right-15,ridge,z],[right,height,back]],tint(color,.7));
    for(let i=0;i<10;i++){
      const pos=(i+.5)/10;
      const a=left+w*pos,b=left+15+(w-30)*pos;
      polygon(mesh,[[a,height+.25,front],[a+1.6,height+.25,front],[b+1.5,ridge+.25,z],[b,ridge+.25,z]],tint(color,.87));
    }
    prism(mesh,left,height-4,front-3,w,6,6,'#574235');
    prism(mesh,left+12,ridge-2,z-2,w-24,5,6,'#6a5240');
  }
  function house(mesh,building){
    const {x,z,w,d,h,shop}=building;
    const left=x-w/2, front=z+d/2;
    ellipse(mesh,x+16,.8,z+12,w*.73,d*.66,'#3e4f3b');
    prism(mesh,left-5,0,z-d/2-5,w+10,9,d+10,'#a08c70');
    prism(mesh,left,8,z-d/2,w,h-8,d,'#cbb48b');
    for(const xx of [left+3,x-24,x+24,left+w-8])prism(mesh,xx,8,front,5,h-10,4,'#6d4f3b');
    prism(mesh,x-20,9,front-1,40,45,6,'#594236');
    for(const xx of [left+16,left+w-43]){
      prism(mesh,xx,32,front,25,23,4,'#715541');
      prism(mesh,xx+4,36,front+3,17,15,2,'#d9b56e');
      prism(mesh,xx+11,34,front+5,3,20,2,'#715541');
    }
    if(shop){
      prism(mesh,x-43,h-15,front+2,86,14,4,building.roof);
      prism(mesh,x-46,1,front+5,92,6,26,'#a48a62');
      for(const xx of [left+12,left+w-16]){
        prism(mesh,xx,7,front+16,4,53,4,'#674b38');
        prism(mesh,xx-5,48,front+10,14,11,14,'#dfa455');
      }
    }
    roof(mesh,x,z,w+24,d+22,h,building.roof);
  }
  function tree(mesh,x,z,size,type){
    ellipse(mesh,x+13,.7,z+14,size*.64,size*.45,'#43583e');
    prism(mesh,x-4,0,z-4,8,size*.63,8,'#795c42');
    const green=type?'#567855':'#3d6d54';
    for(const [base,rad] of [[.34,.47],[.63,.38],[.9,.27]]){
      for(let i=0;i<6;i++){
        const a=i*Math.PI/3,b=(i+1)*Math.PI/3;
        polygon(mesh,[[x+Math.cos(a)*rad*size,size*base,z+Math.sin(a)*rad*size],
          [x+Math.cos(b)*rad*size,size*base,z+Math.sin(b)*rad*size],[x,size*(base+.59),z]],tint(green,[.86,.77,.85,1.07,1.17,1][i]));
      }
    }
  }
  function boat(mesh,{x,z,w,d,fire}){
    const bow=z-d/2, stern=z+d/2, l=x-w/2,r=x+w/2;
    const points=[[x,18,bow],[r,16,bow+d*.25],[r,13,stern-d*.14],[x+w*.32,16,stern],
      [x-w*.32,16,stern],[l,13,stern-d*.14],[l,16,bow+d*.25]];
    for(let i=0;i<points.length;i++){
      const a=points[i],b=points[(i+1)%points.length];
      polygon(mesh,[a,b,[x+(b[0]-x)*.78,-8,b[2]],[x+(a[0]-x)*.78,-8,a[2]]],i<3?'#694b36':'#503c32');
    }
    polygon(mesh,points,'#bd9562');
    for(let p=z-d*.24;p<stern-d*.13;p+=12)quad(mesh,l+9,17,p,w-18,1.7,'#916b47');
    prism(mesh,x-3,14,z-9,6,112,6,'#795139');
    polygon(mesh,[[x-w*.36,110,z-10],[x+w*.37,111,z-10],[x+w*.39,45,z+1],[x-w*.36,47,z+1]],fire?'#ba694a':'#dfcca0');
    for(const offset of [-1,0,1])polygon(mesh,[[x-22,101-offset*16,z-9],[x+23,101-offset*16,z-9],[x+23,97-offset*16,z-8],[x-22,97-offset*16,z-8]],'#aa8060');
    prism(mesh,x-6,123,z-11,39,9,4,fire?'#c85f46':'#91624d');
    if(fire){
      for(const [dx,dz] of [[-19,43],[22,49],[0,-52]]){
        polygon(mesh,[[x+dx-11,15,z+dz],[x+dx+10,16,z+dz],[x+dx+3,65,z+dz]],'#e5793d');
        polygon(mesh,[[x+dx-5,16,z+dz+1],[x+dx+5,16,z+dz+1],[x+dx,44,z+dz+1]],'#ffc467');
      }
    }
  }
  function landmark(mesh,area){
    const {kind,x,z,w,d}=area.landmark;
    const wood='#715640';
    const left=x-w/2, back=z-d/2;
    if(kind==='hall'){
      house(mesh,{x,z,w,d,h:83,roof:'#40766e'});
      roof(mesh,x,z,w*.76,d*.83,141,'#446e64');
      prism(mesh,x-39,77,z-20,78,65,42,'#b49e78');
      return;
    }
    if(kind==='shipyard'){
      for(const offset of [-48,48])prism(mesh,x+offset-4,0,z-16,8,105,8,wood);
      prism(mesh,x-57,98,z-20,114,8,13,wood);
      prism(mesh,x-1,36,z-14,2,62,2,'#ddbf7f');
      boat(mesh,{x,z:z+5,w:64,d:110,fire:false});
      return;
    }
    if(kind==='fort'){
      prism(mesh,left,0,back,w,46,d,'#a0856d');
      for(let i=0;i<7;i++)prism(mesh,left+i*w/7,45,z+d/2-10,14,16,10,'#89735c');
      for(const offset of [-59,54]){
        prism(mesh,x+offset-9,44,z-8,18,32,18,'#65513e');
        polygon(mesh,[[x+offset-11,75,z],[x+offset+10,75,z],[x+offset+3,111,z]],'#e37c4a');
      }
      roof(mesh,x,z,67,57,86,'#7a493d');
      prism(mesh,x-24,44,z-16,48,42,32,'#b69a72');
      return;
    }
    const deck=kind==='watch'?96:71;
    for(const xx of [left+13,x+w/2-17])for(const zz of [back+9,z+d/2-12])prism(mesh,xx,0,zz,8,deck+26,8,wood);
    prism(mesh,left+7,deck-4,back+3,w-14,8,d-6,'#a88858');
    prism(mesh,left+8,deck+14,z+d/2-8,w-16,5,5,wood);
    roof(mesh,x,z,w,d,deck+27,area.roofs);
  }
  function build(area){
    const mesh=[];
    const {width:w,depth:d,shore,spawn,port}=area;
    quad(mesh,-550,-5,-850,w+1100,shore+855,area.water);
    quad(mesh,-550,0,shore,w+1100,d-shore+700,area.grass);
    quad(mesh,0,.2,shore,w,19,'#a49d77');
    quad(mesh,0,.4,shore+19,w,8,'#8d9470');
    let seed=area.shore;
    const random=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
    for(let i=0;i<500;i++){
      const x=random()*w,z=shore+random()*(d-shore);
      quad(mesh,x,.3,z,5+random()*20,3+random()*10,tint(area.grass,.87+random()*.22));
    }
    for(let i=0;i<165;i++)quad(mesh,random()*w,-4,random()*shore,12+random()*52,1.5,tint(area.water,1.28));
    ellipse(mesh,spawn.x,.55,spawn.y+60,96,90,'#a99570');
    for(const path of [...area.roads,...area.missionPaths])for(let i=1;i<path.length;i++){
      const [x,z]=path[i-1],[nx,nz]=path[i];
      if(Math.min(z,nz)<shore)continue;
      const length=Math.hypot(nx-x,nz-z);if(!length)continue;
      const half=(area.roadWidth||64)/2,a=(nz-z)/length*half,b=(x-nx)/length*half;
      polygon(mesh,[[x-a,1.4,z-b],[x+a,1.4,z+b],[nx+a,1.4,nz+b],[nx-a,1.4,nz-b]],area.boats===0?"#625345":"#81785c");
      ellipse(mesh,x,1.4,z,half,half,area.boats===0?'#625345':'#81785c');
      ellipse(mesh,nx,1.4,nz,half,half,area.boats===0?'#625345':'#81785c');
      for(let t=20;t<length;t+=38){
        const px=x+(nx-x)*t/length,pz=z+(nz-z)*t/length;
        quad(mesh,px-7,1.48,pz-2,14,4,'#a59979');
      }
    }
    for(const objective of area.objectives){
      const {x,y:z}=objective, level=z<shore?4:0;
      if(objective.title==="潛行突破"){
        for(const offset of [-10,10])prism(mesh,x+offset,level,z,4,48,4,"#664d3c");
        prism(mesh,x-13,level+44,z-4,29,7,12,"#916b4c");
      }else if(objective.title==="解救暗哨"){
        for(let offset=-18;offset<=18;offset+=6)prism(mesh,x+offset,level,z,2,37,3,"#80604a");
        prism(mesh,x-19,level+36,z-2,40,4,6,"#ad8660");
      }else if(objective.title==="破壞錨鎖"){
        for(let i=0;i<8;i++){
          const angle=i*Math.PI/4;
          prism(mesh,x+Math.cos(angle)*17,level+18+Math.sin(angle)*17,z,6,6,7,"#717e88");
        }
      }else if(objective.title==="泥地追擊"){
        for(let i=0;i<4;i++)prism(mesh,x-24+i*10,level,z+i*4,9,7,36,"#55473f");
      }
    }
    for(const cliff of area.cliffs)prism(mesh,cliff.x-cliff.w/2,0,cliff.z-cliff.d/2,cliff.w,cliff.h,cliff.d,"#34404a");
    for(const model of area.treeModels)tree(mesh,model.x,model.z,model.size,model.type);
    for(const b of area.buildings)house(mesh,b);
    landmark(mesh,area);
    for(const deck of area.harbor){
      quad(mesh,deck.x,4,deck.z,deck.w,deck.d,'#a48258');
      for(let z=deck.z;z<deck.z+deck.d;z+=11)quad(mesh,deck.x,4.3,z,deck.w,1.6,'#74583e');
      for(const x of [deck.x+3,deck.x+deck.w-6])for(let z=deck.z;z<deck.z+deck.d;z+=48)prism(mesh,x,-4,z,5,18,5,'#76543e');
    }
    for(const ship of area.boats)boat(mesh,ship);
    for(const [x,z] of [[port-71,shore+50],[port+77,shore+50],[spawn.x-295,spawn.y+110],[spawn.x+283,spawn.y+110]]){
      prism(mesh,x,0,z,5,99,5,'#674b37');
      polygon(mesh,[[x,94,z],[x+43,94,z],[x+36,77,z],[x+44,64,z],[x,65,z]],'#a04e42');
    }
    for(const item of area.decorations||[]){
      const {x,z,kind}=item;
      if(kind==='lantern'){
        prism(mesh,x-2,0,z-2,4,74,4,'#6e4c35');
        prism(mesh,x-11,56,z-10,22,20,20,'#d69b45');
        prism(mesh,x-13,75,z-12,26,4,24,'#824b39');
        prism(mesh,x-8,59,z+10,16,12,1,'#ffe2a1');
      }else if(kind==='stall'){
        prism(mesh,x-21,0,z-13,42,28,26,'#8e6948');
        for(const dx of [-24,22])prism(mesh,x+dx,0,z-14,3,61,3,'#755336');
        polygon(mesh,[[x-29,64,z-20],[x+29,64,z-20],[x+29,49,z+24],[x-29,49,z+24]],'#a05243');
        for(let i=0;i<4;i++)prism(mesh,x-16+i*9,28,z-7,7,8,13,i%2?'#d4b270':'#8ca06a');
      }else if(kind==='garden'){
        quad(mesh,x-28,.6,z-20,56,40,'#63563c');
        for(let row=0;row<3;row++)for(let col=0;col<5;col++){
          const px=x-23+col*10,pz=z-15+row*13;
          polygon(mesh,[[px-3,1,pz],[px+3,1,pz],[px,12,pz]],'#6d9256');
        }
      }else{
        prism(mesh,x-15,0,z-12,28,22,24,'#9d774c');
        prism(mesh,x-16,7,z-13,30,3,26,'#634c34');
        prism(mesh,x-16,16,z-13,30,3,26,'#634c34');
        prism(mesh,x+9,0,z+5,19,16,19,'#ae8b5d');
      }
    }
    return mesh;
  }

  const characterMeshes=new Map();
  function actorMesh(output,actor,time){
    const {x,y:z}=actor;
    if(actor.device){
      prism(output,x-12,0,z-10,24,31,20,"#5c5047");
      prism(output,x-17,30,z-13,34,8,26,"#bc8953");
      prism(output,x-5,37,z-5,10,11,10,"#ead384");
      return;
    }
    if(actor.animal){
      const goat=actor.animal==="goat", color=goat?"#d9c4a6":"#f0e1b8";
      const stride=Math.sin(time/140)*2;
      const body=goat?12:7, height=goat?16:8;
      prism(output,x-body,goat?8:4,z-5,body*2,height,10,color);
      prism(output,x+body-1,height,z-4,goat?8:5,goat?10:7,8,color);
      for(const side of [-1,1])for(const end of goat?[-1,1]:[0]){
        prism(output,x+end*7+side*stride,0,z+side*3,2,goat?12:6,2,"#775642");
      }
      if(goat){
        for(const side of [-1,1])prism(output,x+body+2,height+8,z+side*3,2,7,2,"#795f51");
      }else{
        prism(output,x+body+3,height+2,z-1,4,2,3,"#da9e3c");
        prism(output,x+body,height+6,z,2,3,2,"#ba4437");
      }
      return;
    }
    const heading=actor.heading||0, c=Math.cos(heading), s=Math.sin(heading);
    const step=actor.walking?Math.round(Math.sin(time*.015)*5):0;
    const id=window.characterDesign.key(actor);
    const cacheKey=id+':'+step;
    if(!characterMeshes.has(cacheKey))characterMeshes.set(cacheKey,window.characterDesign.mesh(id,step));
    const lift=z<world.shore?6:0;
    ellipse(output,x,lift+.25,z,19,13,z<world.shore?'#7e6246':'#40523f');
    for(const {points,color} of characterMeshes.get(cacheKey)){
      const positioned=points.map(([a,b,d])=>[x+a*c+d*s,b+lift,z-a*s+d*c]);
      polygon(output,positioned,color);
    }
  }

  const gpu=gl&&makeGPU(gl);
  function makeGPU(gl){
    const vertex=`attribute vec3 aPoint,aColor; uniform vec2 uCamera,uScale,uHeading; uniform vec3 uFog; varying vec3 vColor;
      void main(){vec2 offset=aPoint.xz-uCamera;
        float forward=dot(offset,vec2(uHeading.y,-uHeading.x));
        float right=dot(offset,uHeading);
        float up=aPoint.y-${eye}.0;
        float z=forward*${cosine.toFixed(8)}-up*${sine.toFixed(8)};
        float v=-up*${cosine.toFixed(8)}-forward*${sine.toFixed(8)};
        gl_Position=vec4(right*uScale.x,-v*uScale.y,1.004*z-14.028,z);
        vColor=mix(aColor,uFog,smoothstep(700.0,1750.0,z)*0.68);}`;
    const fragment='precision mediump float; varying vec3 vColor; void main(){gl_FragColor=vec4(vColor,1.0);}';
    const program=gl.createProgram();
    for(const [type,code] of [[gl.VERTEX_SHADER,vertex],[gl.FRAGMENT_SHADER,fragment]]){
      const shader=gl.createShader(type);
      gl.shaderSource(shader,code);gl.compileShader(shader);
      if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(shader));
      gl.attachShader(program,shader);
    }
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    const point=gl.getAttribLocation(program,'aPoint'), color=gl.getAttribLocation(program,'aColor');
    gl.enableVertexAttribArray(point);gl.enableVertexAttribArray(color);
    const heading=gl.getUniformLocation(program,'uHeading');
    const view=gl.getUniformLocation(program,'uCamera'), scale=gl.getUniformLocation(program,'uScale'), fog=gl.getUniformLocation(program,'uFog');
    const terrain=gl.createBuffer(), dynamic=gl.createBuffer();
    function buffer(mesh,target,usage){
      const data=[];
      for(const face of mesh)for(let i=1;i<face.points.length-1;i++){
        for(const p of [face.points[0],face.points[i],face.points[i+1]])data.push(...p,...face.color);
      }
      gl.bindBuffer(gl.ARRAY_BUFFER,target);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),usage);
      return data.length/6;
    }
    function draw(target,count){
      gl.bindBuffer(gl.ARRAY_BUFFER,target);
      gl.vertexAttribPointer(point,3,gl.FLOAT,false,24,0);
      gl.vertexAttribPointer(color,3,gl.FLOAT,false,24,12);
      gl.drawArrays(gl.TRIANGLES,0,count);
    }
    let count=0;
    return {
      load(mesh){count=buffer(mesh,terrain,gl.STATIC_DRAW);},
      render(mesh){
        const sky=rgb(world.sky);
        gl.viewport(0,0,canvas.width,canvas.height);
        gl.clearColor(...sky,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
        gl.uniform2f(view,camera.x,camera.z);
        gl.uniform2f(heading,camera.right,camera.turn);
        gl.uniform2f(scale,focal*2/width,focal*2/height);
        gl.uniform3f(fog,...sky);
        draw(terrain,count);
        draw(dynamic,buffer(mesh,dynamic,gl.DYNAMIC_DRAW));
      },
    };
  }

  function cameraPoint(x,y,z){
    const dx=x-camera.x,dz=z-camera.z,up=y-eye;
    const forward=dx*camera.turn-dz*camera.right;
    return {right:dx*camera.right+dz*camera.turn,down:-up*cosine-forward*sine,depth:forward*cosine-up*sine};
  }
  function screen({right,down,depth}){
    const scale=focal/Math.max(near,depth);
    return {x:midX+right*scale,y:midY+down*scale,depth};
  }
  function project(x,y,z){return screen(cameraPoint(x,y,z));}
  function pick(x,y){
    const ray=(y-midY)/focal;
    const vertical=sine+ray*cosine;
    if(vertical<=0)return null;
    const distance=eye/vertical;
    const forward=distance*(cosine-ray*sine),right=distance*(x-midX)/focal;
    return {x:camera.x+forward*camera.turn+right*camera.right,y:camera.z-forward*camera.right+right*camera.turn};
  }
  function clip(points){
    const visible=[];
    points.forEach((point,i)=>{
      const last=points.at(i-1);
      if((last.depth>=near)!==(point.depth>=near)){
        const t=(near-last.depth)/(point.depth-last.depth);
        visible.push({right:last.right+(point.right-last.right)*t,down:last.down+(point.down-last.down)*t,depth:near});
      }
      if(point.depth>=near)visible.push(point);
    });
    return visible;
  }
  function fallback(dynamic){
    context.fillStyle=world.sky;context.fillRect(0,0,width,height);
    const faces=[];
    for(const face of [...staticMesh,...dynamic]){
      if(face.points.length<3)continue;
      const large=face.points.some(p=>Math.abs(p[0]-face.x)>650||Math.abs(p[2]-face.z)>530);
      if(!large&&(Math.abs(face.x-camera.x)>width*1.3||Math.abs(face.z-camera.z)>960))continue;
      const points=clip(face.points.map(p=>cameraPoint(...p))).map(screen);
      if(points.length<3)continue;
      const depth=points.reduce((total,p)=>total+p.depth,0)/points.length;
      const base=face.points.every(p=>p[1]<=4)&&large;
      faces.push({points,color:face.color,depth,base});
    }
    faces.sort((a,b)=>Number(b.base)-Number(a.base)||b.depth-a.depth);
    for(const face of faces){
      const color=mix(face.color,rgb(world.sky),Math.max(0,Math.min(.65,(face.depth-730)/1500)));
      context.fillStyle=`rgb(${color.map(channel=>Math.round(channel*255)).join(' ')})`;
      context.beginPath();face.points.forEach((p,i)=>i?context.lineTo(p.x,p.y):context.moveTo(p.x,p.y));context.closePath();context.fill();
    }
  }
  return {
    setWorld(area){world=area;staticMesh=build(area);gpu?.load(staticMesh);previous=null;},
    project,pick,
    render(actors,time,position,yaw=0){
      const w=canvas.clientWidth,h=canvas.clientHeight;
      if(!w||!h||!world)return;
      if(w!==width||h!==height){
        width=w;height=h;const dpi=Math.min(window.devicePixelRatio||1,2);
        canvas.width=Math.round(w*dpi);canvas.height=Math.round(h*dpi);
        context?.setTransform(dpi,0,0,dpi,0,0);
        midX=w*.5;midY=h*.5;focal=Math.min(w*.95,h*.92);previous=null;
      }
      camera.x=position.x;camera.z=position.y;
      camera.right=Math.cos(yaw);camera.turn=Math.sin(yaw);
      const frame=[camera.x,camera.z,yaw,...actors.map(a=>`${a.x},${a.y},${a.id},${a.kind},${a.heading},${a.walking?Math.floor(time/48):0}`)].join('|');
      if(frame===previous)return;
      previous=frame;
      const dynamic=[];
      actors.forEach(actor=>actorMesh(dynamic,actor,time));
      if(gpu)gpu.render(dynamic);else fallback(dynamic);
    },
  };
};
