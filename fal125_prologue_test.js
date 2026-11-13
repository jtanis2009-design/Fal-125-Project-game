const vm=require('vm');const {load}=require('./fal125_headless.js');
const html=process.argv[2];const N=+process.argv[3]||5;const FROM=+process.argv[4]||1;const ONLY=process.argv[5]==='only';
/* USAGE: node fal125_prologue_test.js game.html [runs] [from chapter] [only]   A run gives up after 12 losses, so a fight that is too hard shows up as a chapter that is not cleared. */
(async()=>{
 let wins=Array(6).fill(0),runs=0,losses=0,err=0;
 for(let s=1;s<=N;s++){
  const L=load({html,seed:s}),sb=L.sb,run=c=>vm.runInContext(c,sb);
  run(`Object.assign(CFG,{auto:true,routes:false,draft:false,pace:1,diff:'Normal'});CFG.autoStyle='smart';SAVE.mode='story';`);
  sb.show=()=>{}; sb.evtAsk=async(t,pp,ch)=>{ if(t==='Overrun'){L.lost[run('PRO.tag')]=(L.lost[run('PRO.tag')]||0)+1;return run('PRO.losses')>12?1:0;} if(ONLY&&/^Chapter \d done$/.test(t))return 1; return ch&&ch.length>1&&!/Continue|Skip scene/.test(ch[0].label)?Math.floor(sb.Math.random()*ch.length):0; }; L.lost=L.lost||{}; global.LOST=global.LOST||{};L.lost=global.LOST; sb.clearBeat=async()=>{}; 
  run('PRO.cap=1');const r=await L.drive(run(`playPrologue(${FROM})`),4000000,100000);
  if(r.error){err++;console.log('ERR',String(r.error.stack||r.error).slice(0,400));}
  if(r.stuck)console.log('stuck seed',s);
  const p=run(`JSON.stringify(proS())`);const o=JSON.parse(p);
  o.ch.forEach((c,i)=>{if(c)wins[i]++});losses+=run('PRO.losses');runs++;
  if(s==1)console.log(p);
 }
 console.log(global.LOST);console.log('chapter clears over',runs,'runs (auto-retry random):',wins,'losses',losses,'errors',err);
})();
