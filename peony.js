(()=>{
const TAU=Math.PI*2,LOOP=130,B0=10,BT=78,FLOOR=-1.2,D=4.4;
const sm=x=>(x=x<0?0:x>1?1:x)*x*(3-2*x),mix=(a,b,t)=>a+(b-a)*t,cl=(x,a,b)=>x<a?a:x>b?b:x;
let sd=11;const rnd=()=>(sd=sd*16807%2147483647)/2147483647;
// tags: 0 stem 1 leaf 2 sepal 3 gold 4 glint 5 dust 6..15 petal shades (pale to deep)
const rgb=[[74,150,96],[58,128,86],[100,152,84],[255,205,110],[255,246,236],[255,200,215]];
for(let i=0;i<10;i++){const u=i/9;rgb.push([mix(255,190,u)|0,mix(216,36,u)|0,mix(226,92,u)|0])}
const LV=12,pal=rgb.map(c=>Array.from({length:LV},(_,l)=>{const m=.2+.8*l/(LV-1);return`rgb(${c[0]*m|0},${c[1]*m|0},${c[2]*m|0})`}));
const POOLS=["`.'-,","':;!i1l","tfjrxcvz+=","aeounsw{}<>","08B$#&%@W"];
const stemAt=s=>[.05*Math.sin(s*3+.4)-.02,-1.15+s*1.43,.02*Math.sin(s*2)];
const [sx0,sy0,sz0]=stemAt(1);
// geometry
const NS=170,NR=12,bl=[];
const add=o=>{o.nu=Math.round(14+24*o.L);o.nv=Math.round(8+24*o.W);o.ph=rnd()*TAU;o.n=o.nu*o.nv;
 o.g0=o.g0??3.5;o.gd=o.kind==2?3.5:6;o.wp=Float32Array.from({length:o.nu},(_,i)=>{const u=i/(o.nu-1);
 if(o.kind==2)return Math.pow(Math.sin(Math.PI*Math.pow(u,.75)),.8);
 const d=(u-.7)/.3;return(.3+.7*sm(u/.28))*(u>.7?Math.sqrt(Math.max(0,1-d*d)):1)*(.78+.22*Math.sin(Math.PI*u))});bl.push(o)};
[5,6,7,8,9,10,10].forEach((n,r)=>{const tr=r/6;for(let j=0;j<n;j++)add({kind:0,tr,a:TAU*j/n+r*.9+(rnd()-.5)*.3,bx:sx0,by:sy0+.02*tr,bz:sz0,r0:.03,
 t0:1.2,t1:mix(1.5,.55,tr),k0:-2.75,k1:mix(.9,-1.1,tr),L:mix(.9,.32,tr)*(.9+.2*rnd()),W:mix(.4,.16,tr)*(.92+.16*rnd()),cup:.35+.4*tr,ruf:mix(.03,.018,tr)})});
for(let j=0;j<5;j++)add({kind:1,tr:1,a:TAU*j/5+.3,bx:sx0,by:sy0-.01,bz:sz0,r0:.03,t0:1,t1:1.5,k0:.2,k1:1,L:.34,W:.16,cup:.3,ruf:.01});
[[.3,2.6,1,0],[.55,-.5,.9,1]].forEach(([s,a0,sc,ix])=>{const [x,y,z]=stemAt(s);
 [[0,1],[.62,.78],[-.62,.78]].forEach(([da,ls])=>add({kind:2,tr:0,a:a0+da,bx:x,by:y,bz:z,r0:.08,t0:1,t1:1,k0:1.3,k1:1.3,L:.6*sc*ls,W:.2*sc*ls,cup:.25,ruf:0,g0:2.5+ix*.9}))});
let N=NS*NR;bl.forEach(o=>{o.off=N;N+=o.n});
const PX=new Float32Array(N),PY=new Float32Array(N),PZ=new Float32Array(N),NX=new Float32Array(N),NY=new Float32Array(N),NZ=new Float32Array(N);
const vis=new Uint8Array(N),TAG=new Uint8Array(N),TG=new Uint8Array(N),GL=new Float32Array(N),DK=new Float32Array(N).fill(1),PT=new Int32Array(N);
bl.forEach((o,b)=>{for(let i=0;i<o.nu;i++)for(let j=0;j<o.nv;j++){const q=o.off+i*o.nv+j,u=i/(o.nu-1);PT[q]=b+1;
 if(o.kind==0){TAG[q]=6+(cl(.12+.5*o.tr+.38*Math.pow(1-u,1.4),0,.999)*10|0);DK[q]=.7+.3*(1-o.tr)}else TAG[q]=o.kind}});
const SP=Float32Array.from({length:NS*NR},(_,i)=>(i/NR|0)/(NS-1)),PH=Float32Array.from({length:NS*NR},(_,i)=>i%NR/NR*TAU);
// particles
const DUSTS=Array.from({length:260},()=>[rnd()*TAU,.5+1.7*rnd(),-1.1+2.4*rnd(),rnd(),rnd()]);
const FALL=Array.from({length:14},()=>[rnd()*TAU,.5+.5*rnd(),rnd(),rnd()]);
const FIL=Array.from({length:48},(_,i)=>[TAU*i/48+rnd()*.3,.8+.4*rnd()]);
// canvas
const art=document.getElementById('art'),glow=document.getElementById('glow'),ctx=art.getContext('2d'),gctx=glow.getContext('2d');
let W,H,dpr,cw,chh,cols,rows,dep,pt,lm,tg,ch;
function size(){dpr=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;art.width=W*dpr;art.height=H*dpr;glow.width=W/6|0;glow.height=H/6|0;
 cols=cl(Math.floor(W/7.5),64,190);cw=W/cols;chh=cw*1.9;rows=Math.floor(H/chh);const n=cols*rows;
 dep=new Float32Array(n);pt=new Int32Array(n);lm=new Float32Array(n);tg=new Uint8Array(n);ch=new Array(n);
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle='#1b1016';ctx.fillRect(0,0,W,H)}
addEventListener('resize',size);size();
// state
let t=0,paused=matchMedia('(prefers-reduced-motion:reduce)').matches,speed=1,dx=0,dy=0;
if(paused)t=75;
let drag=null;
art.addEventListener('pointerdown',e=>{drag=[e.clientX,e.clientY];art.setPointerCapture(e.pointerId)});
art.addEventListener('pointermove',e=>{if(!drag)return;dx+=(e.clientX-drag[0])*.006;dy=cl(dy+(e.clientY-drag[1])*.004,-.25,.7);drag=[e.clientX,e.clientY]});
art.addEventListener('pointerup',()=>drag=null);
const line=document.getElementById('line');
const seek=e=>{const r=line.getBoundingClientRect();t=cl((e.clientX-r.left)/r.width,0,.999)*LOOP};
line.addEventListener('pointerdown',e=>{seek(e);line.setPointerCapture(e.pointerId);line.onpointermove=seek});
line.addEventListener('pointerup',()=>line.onpointermove=null);
addEventListener('keydown',e=>{const k=e.key.toLowerCase();
 if(k==' '){paused=!paused;e.preventDefault()}else if(k=='r')t=0;else if('123'.includes(k)&&k)speed=[1,4,12][+k-1];
 else if(k=='s'){const a=document.createElement('a');a.download='peony.png';a.href=art.toDataURL();a.click()}});
// frame
function frame(t){
 const b=t<B0?0:sm((t-B0)/BT),fg=sm((t-3.5)/6),fade=sm((LOOP-t)/3)*sm(t/1.2),hd=(t-.3)/4.5;
 for(let i=0;i<NS*NR;i++){const s=SP[i],c=stemAt(s),r=.028+.008*(1-s),cp=Math.cos(PH[i]),sp=Math.sin(PH[i]);
  PX[i]=c[0]+cp*r;PY[i]=c[1];PZ[i]=c[2]+sp*r;NX[i]=cp;NY[i]=0;NZ[i]=sp;vis[i]=s<=hd;TG[i]=0;GL[i]=0;
  if(Math.abs(s-hd)<.012){TG[i]=4;GL[i]=1}}
 for(const o of bl){const g=sm((t-o.g0)/o.gd);if(g<.01){vis.fill(0,o.off,o.off+o.n);continue}
  const e=o.kind==2?1:o.kind==1?sm(b*3):sm((b-.55*o.tr)/.45);
  const tl=mix(o.t0,o.t1,e)+.05*e*Math.sin(t*.45+o.ph);let k=mix(o.k0,o.k1,e);if(Math.abs(k)<.002)k=.002;
  const L=o.L*g*(.8+.2*e),Wd=o.W*g*(.85+.15*e),ca=Math.cos(o.a),sa=Math.sin(o.a),c0=Math.cos(tl),s0=Math.sin(tl);
  for(let i=0;i<o.nu;i++){const u=i/(o.nu-1),p=tl+k*u,cs=Math.cos(p),sn=Math.sin(p),pr=o.r0+L*(c0-cs)/k,py=L*(sn-s0)/k,w=Wd*o.wp[i];
   for(let j=0;j<o.nv;j++){const v=-1+2*j/(o.nv-1),off=o.cup*v*v*w+o.ruf*u*u*(.4+.6*Math.abs(v))*Math.sin(9*u+4*v+o.ph),
    R=pr-cs*off,Y=py+sn*off,T=v*w,q=o.off+i*o.nv+j,tt=-1.2*o.cup*v,iv=1/Math.sqrt(1+tt*tt);
    PX[q]=o.bx+ca*R-sa*T;PY[q]=o.by+Y;PZ[q]=o.bz+sa*R+ca*T;
    NX[q]=(-cs*ca-tt*sa)*iv;NY[q]=sn*iv;NZ[q]=(-cs*sa+tt*ca)*iv;vis[q]=1;TG[q]=TAG[q];GL[q]=0}}}
 // view
 const yaw=.35*Math.sin(t*.09)+dx,pit=.38+dy,cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pit),sp=Math.sin(pit);
 const ppu=Math.min(H/2.5,W/2.4),F=ppu*D,n=cols*rows;dep.fill(1e9);pt.fill(-1);ch.fill(0);
 const lx=-.4,ly=.6,lz=-.7,ll=Math.hypot(lx,ly,lz),Lx=lx/ll,Ly=ly/ll,Lz=lz/ll,hx=Lx,hy=Ly,hz=Lz-1,hl=Math.hypot(hx,hy,hz),Hx=hx/hl,Hy=hy/hl,Hz=hz/hl;
 const ra=t*.5,Rx=Math.cos(ra)*.8,Ry=.3,Rz=Math.sin(ra)*.8-.4;
 const proj=(x,y,z)=>{y-=.05;const x1=cy*x+sy*z,z1=-sy*x+cy*z,y2=cp*y-sp*z1,z2=sp*y+cp*z1+D;
  return[(W/2+x1/z2*F)/cw|0,(H/2-y2/z2*F)/chh|0,z2]};
 for(let q=0;q<N;q++){if(!vis[q])continue;
  let [ix,iy,z]=proj(PX[q],PY[q],PZ[q]);if(ix<0||ix>=cols||iy<0||iy>=rows)continue;const c=iy*cols+ix;if(z>=dep[c])continue;
  const x1=cy*NX[q]+sy*NZ[q],z1=-sy*NX[q]+cy*NZ[q],ny=cp*NY[q]-sp*z1,nz=sp*NY[q]+cp*z1,nx=x1;
  const df=Math.abs(nx*Lx+ny*Ly+nz*Lz),sc=Math.pow(Math.abs(nx*Hx+ny*Hy+nz*Hz),18),rm=Math.pow(Math.abs(nx*Rx+ny*Ry+nz*Rz),6);
  dep[c]=z;pt[c]=PT[q];lm[c]=((.5+.65*df+.5*sc+.25*rm)*DK[q]+GL[q])*fade;tg[c]=TG[q]}
 // outlines and letters
 const hash=i=>(i*7919+(i%cols)*104729)%9973;
 for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const i=r*cols+c,p=pt[i];if(p<0)continue;
  let gx=0,gy=0,edge=false;
  for(let a=-1;a<=1;a++)for(let bb=-1;bb<=1;bb++){if(!a&&!bb)continue;const rr=r+a,cc=c+bb;
   const np=rr<0||rr>=rows||cc<0||cc>=cols?-1:pt[rr*cols+cc];
   if(np<0||(np!=p&&dep[rr*cols+cc]>dep[i]+.04)){gx+=bb;gy+=a;if(!a||!bb)edge=true}}
  const lum=lm[i];
  if(edge){const ax=Math.abs(gx),ay=Math.abs(gy);ch[i]=!(ax+ay)?'+':ax>2*ay?'|':ay>2*ax?(gy>0?'_':'-'):gx*gy>0?'/':'\\';lm[i]=Math.max(.8,lum*.95)}
  else{const P=POOLS[cl((lum-.25)*1.5,0,.999)*5|0],h=hash(i);ch[i]=P[(h+Math.floor(t*1.5+h%7))%P.length];lm[i]=cl(lum*.9,.2,1)}
  if(tg[i]==4)ch[i]='*'}
 // particles
 const glints=[];
 const put=(x,y,z,l,tag,chr)=>{const [ix,iy,zz]=proj(x,y,z);if(ix<0||ix>=cols||iy<0||iy>=rows||l<.03)return;
  const c=iy*cols+ix;if(zz-.05>=dep[c])return;dep[c]=zz;pt[c]=-2;lm[c]=cl(l*fade,0,1);tg[c]=tag;
  ch[c]=chr||(l>.7?'*':l>.35?'+':'.');if(tag==4&&l>.8)glints.push(c)};
 for(const d of DUSTS){const a=d[0]+t*(.04+.06*d[3]),tw=Math.pow(cl(Math.sin(t*(1.2+2*d[3])+d[4]*40),0,1),6);
  put(Math.cos(a)*d[1],d[2]+.05*Math.sin(t*.6+d[4]*TAU),Math.sin(a)*d[1]*.6-.3,(.1+.9*tw)*sm((t-1-d[3]*3)/1.5),d[4]<.15?4:d[4]<.4?5:3)}
 for(let i=0;i<60;i++){const age=(t*1.5+i*.37)%1,hp=Math.min(hd,1),c=stemAt(Math.max(hp,0)),a=i*2.4;
  if(hd>0&&hd<1.2)put(c[0]+Math.cos(a)*age*.3,c[1]+age*.25-age*age*.5,c[2]+Math.sin(a)*age*.3,(1-age)*.9,age>.5?5:4)}
 if(b>.9)for(const f of FALL){const ph=(t*.05+f[2])%1,a=f[0]+ph*2,x=Math.cos(a)*f[1]*(.6+.4*ph),z=Math.sin(a)*f[1]*(.6+.4*ph),y=sy0+.1-ph*(sy0+.1-FLOOR);
  if(y>FLOOR)put(x+.1*Math.sin(t+f[3]*9),y,z,.8*sm((b-.9)*10),8+(f[3]*3|0),f[3]>.5?'~':',')}
 const fs=sm((b-.55)/.35)*fg;if(fs>.01)for(const f of FIL)for(let j=0;j<=5;j++){const m=j/5*.38*fs;
  put(Math.cos(f[0])*(.07+.7*m*f[1])*1,sy0+.14+m*1.1,Math.sin(f[0])*(.07+.7*m*f[1]),.9,j==5?4:3,j==5?'*':'.')}
 for(let i=0;i<110;i++){const a=i*2.4,r=.5+1.1*((i*.618)%1);put(Math.cos(a)*r,FLOOR,Math.sin(a)*r*.7,.16+.1*Math.sin(t+i),5,'.')}
 glints.sort((a,b)=>lm[b]-lm[a]);
 glints.slice(0,3).forEach((c,m)=>{const cy0=c/cols|0,cx0=c%cols,reach=3+4*(.5+.5*Math.sin(t*5+m*1.7));
  for(let d=1;d<=reach;d++)for(const [a,bb,s] of[[0,2,'-'],[0,-2,'-'],[1,0,'|'],[-1,0,'|']]){const rr=cy0+a*d,cc=cx0+bb*d;
   if(rr>=0&&rr<rows&&cc>=0&&cc<cols&&lm[rr*cols+cc]<.5&&pt[rr*cols+cc]<0){const i=rr*cols+cc;ch[i]=s;lm[i]=.6*(1-d/(reach+1));tg[i]=4}}});
 return b}
// draw
let last=performance.now();const pct=document.getElementById('pct'),fill=document.getElementById('fill'),knob=document.getElementById('knob');
ctx.textBaseline='alphabetic';
function loop(now){const dt=Math.min((now-last)/1000,.1);last=now;
 if(!paused){t+=dt*speed;if(t>=LOOP){t=0;ctx.fillStyle='#1b1016';ctx.fillRect(0,0,W,H)}}
 const b=frame(t);
 ctx.fillStyle='rgba(27,16,22,.5)';ctx.fillRect(0,0,W,H);
 ctx.font=`${cw/.6}px Menlo,Consolas,"DejaVu Sans Mono","Courier New",monospace`;
 let cur=null;const n=cols*rows;
 for(let i=0;i<n;i++){const s=ch[i];if(!s)continue;const st=pal[tg[i]][cl(lm[i]*(LV-1)+.5|0,0,LV-1)];
  if(st!==cur){ctx.fillStyle=st;cur=st}ctx.fillText(s,(i%cols)*cw,((i/cols|0)+.82)*chh)}
 gctx.clearRect(0,0,glow.width,glow.height);gctx.drawImage(art,0,0,glow.width,glow.height);
 pct.textContent=Math.round(b*100)+'% open';fill.style.width=knob.style.left=(t/LOOP*100)+'%';
 requestAnimationFrame(loop)}
requestAnimationFrame(loop);
})();
