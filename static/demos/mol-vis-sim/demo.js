const $ = id => document.getElementById(id), canvas=$('molecule'), ctx=canvas.getContext('2d');
let structures={}, bonds=[], yaw=0, pitch=0, zoom=1, dragging=null;
function parsePdb(text){return text.split('\n').filter(l=>['ATOM','HETATM'].includes(l.slice(0,6).trim())).map(l=>({name:l.slice(12,16).trim(),residue:l.slice(17,20).trim(),chain:l.slice(21,22),resid:l.slice(22,27),xyz:[30,38,46].map(i=>Number(l.slice(i,i+8))),element:l.slice(76,78).trim()||l.slice(12,16).trim().replace(/^\d+/,'')[0]}));}
function parseBonds(text){const lines=text.split('\n'),i=lines.findIndex(l=>l.includes('!NBOND'));if(i<0)return[];const count=Number(lines[i].trim().split(/\s+/)[0]),numbers=[];for(let j=i+1;j<lines.length&&numbers.length<count*2;j++){if(lines[j].includes('!'))break;numbers.push(...lines[j].trim().split(/\s+/).filter(Boolean).map(Number));}return Array.from({length:count},(_,k)=>[numbers[k*2]-1,numbers[k*2+1]-1]);}
function render(){
 const stage=$('stage').value,all=structures[stage];if(!all)return;
 const trace=$('representation').value==='trace',atoms=trace?all.filter(a=>a.name==='CA'&&a.residue!=='HOH'):all;
 const rect=canvas.getBoundingClientRect(),dpr=window.devicePixelRatio||1;canvas.width=rect.width*dpr;canvas.height=rect.height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,rect.width,rect.height);
 if(!atoms.length)return;
 const center=[0,1,2].map(k=>atoms.reduce((sum,a)=>sum+a.xyz[k],0)/atoms.length);
 const radius=atoms.reduce((r,a)=>Math.max(r,Math.hypot(...a.xyz.map((v,k)=>v-center[k]))),1),scale=Math.min(rect.width,rect.height)*.4/radius*zoom;
 const points=atoms.map(a=>{const[x,y,z]=a.xyz.map((v,k)=>v-center[k]),xx=x*Math.cos(yaw)+z*Math.sin(yaw),zz=-x*Math.sin(yaw)+z*Math.cos(yaw);return{x:rect.width/2+xx*scale,y:rect.height/2+(y*Math.cos(pitch)-zz*Math.sin(pitch))*scale};});
 function line(a,b){if(!points[a]||!points[b])return;ctx.beginPath();ctx.moveTo(points[a].x,points[a].y);ctx.lineTo(points[b].x,points[b].y);ctx.stroke();}
 ctx.strokeStyle=trace?'#2a785b':'#a8b4aa';ctx.lineWidth=trace?3:1;ctx.lineCap='round';
 if(trace){atoms.forEach((a,i)=>{if(i&&a.chain===atoms[i-1].chain&&Math.hypot(...a.xyz.map((v,k)=>v-atoms[i-1].xyz[k]))<4.5)line(i-1,i);});}else if(stage==='prepared'){bonds.forEach(([a,b])=>line(a,b));}
 atoms.forEach((a,i)=>{ctx.fillStyle=trace?'#267352':a.residue==='HOH'?'#70a5b6':({O:'#c56166',N:'#628bb5',H:'#b4bdb4',C:'#3a755b',S:'#c2a13b'}[a.element]||'#66876d');ctx.beginPath();ctx.arc(points[i].x,points[i].y,trace?2.7:a.element==='H'?1.3:2.1,0,Math.PI*2);ctx.fill();});
 const residues=new Set(all.map(a=>[a.chain,a.resid,a.residue].join(':'))).size;
 $('stats').textContent=`${all.length.toLocaleString()} atoms · ${residues} residues · ${trace?'Cα trace':stage==='prepared'?'Atoms and PSF bonds':'Atom positions'}`;
 $('caption').textContent={source:'Original crystal coordinates, including 58 water molecules.',protein:'Protein-only input to psfgen: 602 atoms, 76 residues.',prepared:'Generated coordinates, including hydrogens. Terminal-coordinate and engine warnings require review.'}[stage];
 document.querySelectorAll('[data-stage]').forEach(b=>{b.classList.toggle('active',b.dataset.stage===stage);b.setAttribute('aria-pressed',String(b.dataset.stage===stage));});
}
$('stage').onchange=render;$('representation').onchange=render;
document.querySelectorAll('[data-stage]').forEach(button=>button.onclick=()=>{$('stage').value=button.dataset.stage;render();});
$('reset').onclick=()=>{yaw=pitch=0;zoom=1;render();};
canvas.onpointerdown=e=>{dragging=[e.clientX,e.clientY];canvas.setPointerCapture(e.pointerId);};
canvas.onpointermove=e=>{if(!dragging)return;yaw+=(e.clientX-dragging[0])*.01;pitch+=(e.clientY-dragging[1])*.01;dragging=[e.clientX,e.clientY];render();};
canvas.onpointerup=canvas.onpointercancel=()=>dragging=null;
canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(.3,Math.min(4,zoom*Math.exp(-e.deltaY*.001)));render();},{passive:false});
new ResizeObserver(render).observe(canvas);
async function load(name){const r=await fetch(`files/${name}`);if(!r.ok)throw Error('Example files could not be loaded.');return r.text();}
Promise.all([load('source.pdb'),load('protein.pdb'),load('prepared.pdb'),load('prepared.psf'),load('psfgen.log')]).then(([source,protein,prepared,psf,log])=>{structures={source:parsePdb(source),protein:parsePdb(protein),prepared:parsePdb(prepared)};bonds=parseBonds(psf);$('log').textContent=log;$('loading').hidden=true;render();}).catch(error=>$('loading').textContent=error.message);
