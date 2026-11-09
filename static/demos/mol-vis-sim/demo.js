const $=id=>document.getElementById(id),canvas=$('molecule'),ctx=canvas.getContext('2d');
let structures={},bonds=[],metadata=null,samples=[],yaw=.45,pitch=.25,zoom=1,dragging=null,replayTimer=null;
let guideReached=1;
function showGuideStep(step){
 guideReached=Math.max(guideReached,step);document.body.dataset.guideStep=String(step);
 document.querySelectorAll('[data-guide-step]').forEach(button=>{const active=Number(button.dataset.guideStep)===step;button.disabled=Number(button.dataset.guideStep)>guideReached;if(active)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');});
 document.querySelectorAll('[data-guide-panel]').forEach(panel=>panel.hidden=Number(panel.dataset.guidePanel)!==step);
 if(step===2){$('stage').value='prepared';render();}
 if(step===4)renderMeasurements();
}
document.querySelectorAll('[data-guide-step]').forEach(button=>button.onclick=()=>showGuideStep(Number(button.dataset.guideStep)));
$('guide-start').onclick=()=>showGuideStep(2);$('guide-continue').onclick=()=>showGuideStep(3);$('guide-results').onclick=()=>showGuideStep(4);
showGuideStep(1);
const boxedStages=new Set(['solvated','final']);
function parsePdb(text){return text.split('\n').filter(l=>['ATOM','HETATM'].includes(l.slice(0,6).trim())).map((l,index)=>({index,name:l.slice(12,16).trim(),residue:l.slice(17,21).trim(),chain:l.slice(21,22),resid:l.slice(22,27),xyz:[30,38,46].map(i=>Number(l.slice(i,i+8))),element:l.slice(76,78).trim()||l.slice(12,16).trim().replace(/^\d+/,'')[0]}));}
function parseBonds(text){const lines=text.split('\n'),i=lines.findIndex(l=>l.includes('!NBOND'));if(i<0)return[];const count=Number(lines[i].trim().split(/\s+/)[0]),numbers=[];for(let j=i+1;j<lines.length&&numbers.length<count*2;j++){if(lines[j].includes('!'))break;numbers.push(...lines[j].trim().split(/\s+/).filter(Boolean).map(Number));}return Array.from({length:count},(_,k)=>[numbers[k*2]-1,numbers[k*2+1]-1]);}
function render(){
 const stage=$('stage').value,all=structures[stage];if(!all||!metadata)return;
 const boxed=boxedStages.has(stage),waterVisible=boxed&&$('show-water').checked,trace=$('representation').value==='trace';
 $('show-water').disabled=!boxed;
 const protein=all.filter(a=>!['TIP3','HOH','WAT'].includes(a.residue));
 const atoms=trace?protein.filter(a=>a.name==='CA'):protein;
 const water=waterVisible?all.filter(a=>a.residue==='TIP3'&&a.name==='OH2'):[];
 const rect=canvas.getBoundingClientRect(),dpr=window.devicePixelRatio||1;canvas.width=rect.width*dpr;canvas.height=rect.height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,rect.width,rect.height);
 const center=boxed?metadata.box.center_angstrom:[0,1,2].map(k=>protein.reduce((sum,a)=>sum+a.xyz[k],0)/protein.length);
 const length=metadata.box.box_vectors_nm[0][0]*10;
 const radius=boxed?Math.sqrt(3)*length/2:protein.reduce((r,a)=>Math.max(r,Math.hypot(...a.xyz.map((v,k)=>v-center[k]))),1);
 const scale=Math.min(rect.width,rect.height)*.42/radius*zoom;
 function project(xyz){const[x,y,z]=xyz.map((v,k)=>v-center[k]),xx=x*Math.cos(yaw)+z*Math.sin(yaw),zz=-x*Math.sin(yaw)+z*Math.cos(yaw);return{x:rect.width/2+xx*scale,y:rect.height/2+(y*Math.cos(pitch)-zz*Math.sin(pitch))*scale};}
 function line(a,b){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
 if(boxed){const corners=Array.from({length:8},(_,i)=>project(center.map((v,k)=>v+((i>>k)&1?1:-1)*length/2)));ctx.strokeStyle='#879d99';ctx.lineWidth=1;ctx.setLineDash([5,4]);for(let i=0;i<8;i++)for(let k=0;k<3;k++)if(!(i&(1<<k)))line(corners[i],corners[i|(1<<k)]);ctx.setLineDash([]);}
 ctx.fillStyle='#80b5c6';ctx.globalAlpha=.5;for(const atom of water){const p=project(atom.xyz);ctx.beginPath();ctx.arc(p.x,p.y,1.3,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
 const points=atoms.map(a=>project(a.xyz)),byIndex=new Map(atoms.map((a,i)=>[a.index,points[i]]));ctx.strokeStyle=trace?'#2a785b':'#a8b4aa';ctx.lineWidth=trace?3:1;ctx.lineCap='round';
 if(trace){atoms.forEach((a,i)=>{if(i&&a.chain===atoms[i-1].chain&&Math.hypot(...a.xyz.map((v,k)=>v-atoms[i-1].xyz[k]))<4.5)line(points[i-1],points[i]);});}else if(['prepared','solvated','final'].includes(stage)){for(const[a,b]of bonds)if(byIndex.has(a)&&byIndex.has(b))line(byIndex.get(a),byIndex.get(b));}
 atoms.forEach((a,i)=>{ctx.fillStyle=trace?'#267352':({O:'#c56166',N:'#628bb5',H:'#b4bdb4',C:'#3a755b',S:'#c2a13b'}[a.element]||'#66876d');ctx.beginPath();ctx.arc(points[i].x,points[i].y,trace?2.7:a.element==='H'?1.3:2.1,0,Math.PI*2);ctx.fill();});
 $('stats').textContent=boxed?`${all.length.toLocaleString()} total atoms · 2816 waters · ${metadata.box.box_vectors_nm[0][0].toFixed(3)} nm periodic cube`:`${all.length} atoms · 36 protein residues`;
 $('caption').textContent={source:'Original villin structure, including supplied hydrogens.',protein:'Protein-only selection. The original input coordinates are retained.',prepared:'301 input hydrogens rebuilt with CHARMM topology choices. Protein heavy-atom coordinates preserved; no psfgen warnings.',solvated:'CHARMM TIP3 water box with PME periodic boundaries. No Na+, Cl- or neutralization ions; protein net charge +2 e.',final:'One saved frame after minimization and 100 NVT steps. This short 0.2 ps test is not equilibrated.'}[stage];
 document.querySelectorAll('[data-stage]').forEach(button=>{button.classList.toggle('active',button.dataset.stage===stage);button.setAttribute('aria-pressed',String(button.dataset.stage===stage));});
}
$('stage').onchange=render;$('representation').onchange=render;$('show-water').onchange=render;
document.querySelectorAll('[data-stage]').forEach(button=>button.onclick=()=>{$('stage').value=button.dataset.stage;render();});
$('reset').onclick=()=>{yaw=.45;pitch=.25;zoom=1;render();};
canvas.onpointerdown=e=>{dragging=[e.clientX,e.clientY];canvas.setPointerCapture(e.pointerId);};
canvas.onpointermove=e=>{if(!dragging)return;yaw+=(e.clientX-dragging[0])*.01;pitch+=(e.clientY-dragging[1])*.01;dragging=[e.clientX,e.clientY];render();};
canvas.onpointerup=canvas.onpointercancel=()=>dragging=null;
canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(.3,Math.min(4,zoom*Math.exp(-e.deltaY*.001)));render();},{passive:false});
new ResizeObserver(render).observe(canvas);

const svgNS = 'http://www.w3.org/2000/svg';
function svgElement(tag, attributes={}, text) {
  const element=document.createElementNS(svgNS,tag);
  for (const [name,value] of Object.entries(attributes)) element.setAttribute(name,String(value));
  if (text !== undefined) element.textContent=text;
  return element;
}
function measuredNumber(value) {
  return Number.isFinite(value) ? value.toLocaleString(undefined,{maximumFractionDigits:3}) : '—';
}
function drawMeasurementChart(id, samples, xField, series, xLabel, yLabel, target=null) {
  const svg=$(id); svg.replaceChildren();
  const left=78,right=540,top=18,bottom=215;
  const valid=samples.filter(s=>Number.isFinite(s[xField]));
  const values=valid.flatMap(s=>series.map(line=>s[line.key]).filter(Number.isFinite));
  if (!values.length) {
    svg.append(svgElement('text',{x:280,y:120,'text-anchor':'middle',fill:'#72817a','font-size':13},'Dynamics samples appear after minimization'));
    return;
  }
  let xmin=Math.min(...valid.map(s=>s[xField])), xmax=Math.max(...valid.map(s=>s[xField]));
  if (xmin===xmax) xmax=xmin+(xField==='time_ps' ? .02 : 1);
  let ymin=Math.min(...values,...(Number.isFinite(target) ? [target] : []));
  let ymax=Math.max(...values,...(Number.isFinite(target) ? [target] : []));
  const padding=Math.max((ymax-ymin)*.1,Math.abs(ymax)*.005,.01); ymin-=padding;ymax+=padding;
  const x=value=>left+(value-xmin)/(xmax-xmin)*(right-left);
  const y=value=>bottom-(value-ymin)/(ymax-ymin)*(bottom-top);
  for(let i=0;i<=4;i++) {
    const yy=top+(bottom-top)*i/4, xx=left+(right-left)*i/4;
    svg.append(svgElement('line',{x1:left,x2:right,y1:yy,y2:yy,stroke:'#e4eae0'}));
    const tick=ymax-(ymax-ymin)*i/4;
    svg.append(svgElement('text',{x:left-8,y:yy+4,'text-anchor':'end',fill:'#72817a','font-size':10},Math.abs(tick)>=10000 ? tick.toExponential(1) : tick.toFixed(Math.abs(tick)<1 ? 3 : 1)));
    svg.append(svgElement('text',{x:xx,y:bottom+17,'text-anchor':'middle',fill:'#72817a','font-size':10},measuredNumber(xmin+(xmax-xmin)*i/4)));
  }
  svg.append(svgElement('text',{x:(left+right)/2,y:252,'text-anchor':'middle',fill:'#263c36','font-size':11},xLabel));
  svg.append(svgElement('text',{x:14,y:115,transform:'rotate(-90 14 115)','text-anchor':'middle',fill:'#263c36','font-size':11},yLabel));
  if (Number.isFinite(target)) svg.append(svgElement('line',{x1:left,x2:right,y1:y(target),y2:y(target),stroke:'#8d9690','stroke-dasharray':'5 4'}));
  for(const line of series) {
    const points=valid.filter(s=>Number.isFinite(s[line.key]));
    svg.append(svgElement('path',{d:points.map((s,i)=>`${i?'L':'M'}${x(s[xField])},${y(s[line.key])}`).join(' '),fill:'none',stroke:line.color,'stroke-width':2}));
    for (const sample of points) {
      const point=svgElement('circle',{cx:x(sample[xField]),cy:y(sample[line.key]),r:2.5,fill:line.color});
      point.append(svgElement('title',{},`${line.label}: ${measuredNumber(sample[line.key])} ${yLabel}; ${xLabel}: ${measuredNumber(sample[xField])}`));svg.append(point);
    }
  }
}
function renderMeasurements(){
 const index=Number($('sample').value),visible=samples.slice(0,index+1),dynamics=visible.filter(s=>s.stage==='dynamics'),minimum=visible.filter(s=>s.stage==='minimization'),current=samples[index];
 drawMeasurementChart('temperature-plot',dynamics,'time_ps',[{key:'temperature_k',color:'#326ba8',label:'Temperature'}],'Simulation time / ps','K',300);
 drawMeasurementChart('energy-plot',dynamics,'time_ps',[{key:'potential_energy_kj_mol',color:'#206b50',label:'Potential'},{key:'kinetic_energy_kj_mol',color:'#a86d1b',label:'Kinetic'},{key:'total_energy_kj_mol',color:'#8c4f99',label:'Total'}],'Simulation time / ps','kJ/mol');
 drawMeasurementChart('minimization-plot',minimum,'report_index',[{key:'potential_energy_kj_mol',color:'#206b50',label:'System potential'}],'Optimizer report #','kJ/mol');
 if(current)$('measurement-status').textContent=`Recorded sample ${index+1} / ${samples.length} · `+(current.stage==='dynamics'?`NVT step ${current.step} · ${measuredNumber(current.time_ps)} ps · ${measuredNumber(current.temperature_k)} K`:`Minimization report ${current.report_index} · potential ${measuredNumber(current.potential_energy_kj_mol)} kJ/mol · no simulation time or temperature`);
}
function pauseReplay(){clearInterval(replayTimer);replayTimer=null;$('replay').textContent='Replay measurements';}
$('replay').onclick=()=>{if(replayTimer){pauseReplay();return;}if(Number($('sample').value)>=samples.length-1)$('sample').value=0;renderMeasurements();$('replay').textContent='Pause replay';replayTimer=setInterval(()=>{const next=Number($('sample').value)+1;if(next>=samples.length){pauseReplay();return;}$('sample').value=next;renderMeasurements();},100);};
$('sample').oninput=()=>{pauseReplay();renderMeasurements();};
document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseReplay();});
async function load(name){const response=await fetch(`files/${name}`);if(!response.ok)throw Error('Recorded example could not be loaded.');return response.text();}
Promise.all(['source.pdb','protein.pdb','prepared.pdb','solvated.pdb','readiness.pdb','prepared.psf','psfgen.log','manifest.json','measurements.jsonl'].map(load)).then(([source,protein,prepared,solvated,final,psf,log,manifest,measurements])=>{
 metadata=JSON.parse(manifest);samples=measurements.trim().split('\n').map(JSON.parse);structures={source:parsePdb(source),protein:parsePdb(protein),prepared:parsePdb(prepared),solvated:parsePdb(solvated),final:parsePdb(final)};bonds=parseBonds(psf);$('log').textContent=log;$('loading').hidden=true;$('guide-loading').textContent='';$('guide-start').disabled=false;$('sample').max=samples.length-1;$('sample').value=samples.length-1;$('sample').disabled=$('replay').disabled=false;render();renderMeasurements();
}).catch(error=>{$('guide-loading').textContent=error.message;$('loading').textContent=error.message;$('measurement-status').textContent=error.message;});
