#!/usr/bin/env node
/* fal125_lines_audit.js (V237): lists every story beat each role speaks in, and which fighters are missing a line of their own for one.
   USAGE: node fal125_lines_audit.js [--html game.html]   A new fighter needs one line per beat of their role (see STORY_W2 and the HEAL/TANK/DMG_LINES tables). */
const vm=require('vm'),fs=require('fs');const {load}=require('./fal125_headless.js');
const a=process.argv.slice(2),i0=a.indexOf('--html');const {findHtml}=require('./fal125_headless.js');const html=findHtml(i0>=0?a[i0+1]:null); const H=load({html,seed:1}),run=c=>vm.runInContext(c,H.sb); try{run('storyLinesBuild()')}catch(e){}
const src=fs.readFileSync(html,'utf8'); const i=src.indexOf('const STORY_SCRIPT = ['), j=src.indexOf('STORY_SCRIPT.pro = {'); const blk=src.slice(i,j);
const slots={Tank:new Set(),Healer:new Set(),Damage:new Set()};
for(const m of blk.matchAll(/\b(TL|HL|DL)\('(\w+)'/g)) slots[{TL:'Tank',HL:'Healer',DL:'Damage'}[m[1]]].add(m[2]);
const gen={T_:(blk.match(/\$\{T_\(\)\}/g)||[]).length,H_:(blk.match(/\$\{H_\(\)\}/g)||[]).length,D_:(blk.match(/\$\{D_\(\)\}/g)||[]).length};
console.log('slots', Object.fromEntries(Object.entries(slots).map(([k,v])=>[k,[...v].join(' ')])));
const chars=JSON.parse(run(`JSON.stringify(CHARACTERS.map(c=>({key:c.key,name:c.name,role:c.role,have:Object.keys(Object.assign({},HEAL_LINES[c.key]||{},TANK_LINES[c.key]||{},DMG_LINES[c.key]||{}))})))`));
let full=0,part=[],none=[];
for(const c of chars){ const need=[...slots[c.role]].filter(s=>!(c.key==='serpentine'&&/^w[67]/.test(s))); const miss=need.filter(s=>!c.have.includes(s)); if(!miss.length) full++; else if(miss.length===need.length) none.push(c.key+'('+c.role[0]+')'); else part.push(c.key+'('+c.role[0]+'):'+miss.join(',')); }
console.log('chars',chars.length,'full',full,'none',none.length,'partial',part.length);
console.log('NONE:',none.join(' ')); console.log('PARTIAL:',part.join(' | '));
// lines whose fallback (generic) text has no slot at all:
const noSlot=[...blk.matchAll(/\(\) => `\$\{([THD])_\(\)\}: "([^"]{0,60})/g)].filter(m=>{ const before=blk.slice(Math.max(0,m.index-22),m.index); return !/[THD]L\('\w+', $/.test(before); }).map(m=>m[1]+': '+m[2]);
console.log('generic lines with no per-character slot:',noSlot.length); noSlot.forEach(x=>console.log('  ',x));
