#!/usr/bin/env node
/* fal125_enemy_moves.js (V249): plays 6 turns of every normal enemy in Worlds 1-7 (add 'UNLOCK8' below for World 8) against a dummy team and prints
   what each one really does on each turn: hits (target side and power), statuses it puts on, heals. Use it to spot enemies that only do one thing.
   USAGE: node fal125_enemy_moves.js [--html game.html] */
const vm=require('vm');const {load,findHtml}=require('./fal125_headless.js');
const A=process.argv.slice(2),I=A.indexOf('--html');const html=findHtml(I>=0?A[I+1]:null); const H=load({html,seed:3}),G=H.G,T=G.RXT,run=c=>vm.runInContext(c,H.sb);
run(`RUN=newRun(); var __log=[]; const __h=hit, __a=addStatus, __he=heal, __d=damage;
 hit=function(a,t,m,o){ if(a&&a.team==='enemy') __log.push('hit:'+(t&&t.team)+':'+(+m).toFixed(2)+(o&&o.pierce?':pierce':'')); return __h.apply(this,arguments); };
 addStatus=function(u,k,t,v){ if(cur&&cur.team==='enemy') __log.push('st:'+(u&&u.team)+':'+k); return __a.apply(this,arguments); };
 heal=function(u,n){ if(cur&&cur.team==='enemy') __log.push('heal:'+(u&&u.team)); return __he.apply(this,arguments); };`);
const keys=new Set(); ['UNLOCK','UNLOCK2','UNLOCK3','UNLOCK4','UNLOCK5','UNLOCK6','UNLOCK7'].forEach((n,w)=>Object.keys(run(n)).forEach(k=>keys.add(k+'|'+(w+1))));
const seen={}; const out=[];
(async()=>{
for(const kw of keys){ const [k,w]=kw.split('|'); if(seen[k]){seen[k].push(w);continue;} seen[k]=[w];
  const E=G.ENEMIES[k]; if(!E){out.push({k,miss:1});continue;}
  const mkE=()=>{const f=T.makeUnit(Object.assign({},E,{key:k}),'enemy');f.boss=false;f.maxHp=f.hp=9999;return f;};
  const p=['sna','snavo','eyianix'].map(c=>{const u=T.makeUnit(G.CHARACTERS_BY(c),'party');u.maxHp=u.hp=99999;return u;});
  const e=mkE(), e2=mkE(); e2.hp=100; T.setSides(p,[e,e2]);
  const ev=[], intents=[];
  for(let n=0;n<6;n++){ try{intents.push(E.intent?String(E.intent(e)):'');}catch(x){intents.push('?');}
    run('__log=[]'); T.setCur(e); try{ const r=E.ai.call(E,e); if(r&&r.then) await H.drive(r); }catch(x){ run('__log.push("ERR")'); }
    ev.push(JSON.parse(run('JSON.stringify(__log)')).join(',')); e.st=[]; }
  out.push({k,name:E.name,worlds:seen[k],intents:[...new Set(intents)],ev});
}
for(const o of out){ if(o.miss){console.log('MISSING',o.k);continue;}
  const all=o.ev.join(','); const plain=!/st:|heal|hit:party:[0-9.]+.*hit:party|pierce/.test(all) && !o.ev.some(x=>(x.match(/hit:party/g)||[]).length>1);
  console.log((o.ev.every(x=>x===o.ev[0])?'ONE MOVE ':'         ')+o.k.padEnd(14)+' W'+o.worlds.join(',')+' | '+o.intents.join(' / ')+' || '+o.ev.join(' ; ').slice(0,230)); }
process.exit(0);})();
