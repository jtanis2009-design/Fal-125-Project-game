#!/usr/bin/env node
'use strict';
/* fal125_enemy_audit.js  -  FAL-125 enemy audit
   Plays every enemy's real AI against a standard dummy party for a number of turns and measures what it actually does:
   direct damage per turn, damage-over-time it leaves behind (Burning, Venom, Bleeding, Frostbite, Irradiated), how many
   party turns it takes away (Stun / Slow), how much it hits all at once, and how tanky it is. Then it flags outliers
   against the group average so you can see which enemies are too weak or too strong before you play them.
   The party is healed back to full after every enemy turn, so the numbers are "damage per enemy turn", not fight length.
   It reads your game HTML directly and never changes it. No npm packages.

   USAGE (same folder as your game .html and fal125_headless.js):
     node fal125_enemy_audit.js                     all Clown types (clown_x*) at Normal
     node fal125_enemy_audit.js --all               every enemy in the game
     node fal125_enemy_audit.js --only clown_x4     only keys that start with this text (x40 to x46 here)
     node fal125_enemy_audit.js --turns 24          turns simulated per enemy (default 18, long enough for 2/3/4-turn cycles)
     node fal125_enemy_audit.js --diff hard         difficulty key from the game (default normal)
     node fal125_enemy_audit.js --z 1.25            flag this many standard deviations from the group average (default 1.5)
     node fal125_enemy_audit.js --html path/to/game.html
     node fal125_enemy_audit.js --out audit         also write audit_enemies.csv

   COLUMNS
     HP / ATK / DEF / SPD   the enemy as it spawns (HP already includes the game's scaling)
     DPT%      average direct damage per enemy turn, as % of the whole party's max HP
     DOT%      average damage-over-time left on the party per enemy turn (a rough count of how much the DoT will tick for)
     BURST%    the biggest single turn, as % of party max HP
     CTRL      average party turns removed per enemy turn (Stun counts 1, Slow counts its strength)
     BULK      HP scaled by DEF, how long it takes to kill
     THREAT    DPT% + DOT% + 15 x CTRL, then weighted by SPD (faster enemies act more often)
     COST      what the game charges for it, when it has a price
   FLAGS: HIGH / LOW = THREAT far from the group average.  GLASS = high threat and low bulk.  WALL = low threat and high bulk.
   ERR means the enemy's AI threw an error. That one is a real bug and should be fixed first. */
const fs = require('fs');
const vm = require('vm');
const { load } = require('./fal125_headless.js');

const args = process.argv.slice(2); const opt = {};
for (let i = 0; i < args.length; i++) { const a = args[i]; if (!a.startsWith('--')) continue; const k = a.slice(2); const nx = args[i + 1]; if (nx === undefined || nx.startsWith('--')) opt[k] = true; else { opt[k] = nx; i++; } }
if (opt.help || opt.h) { console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0].replace(/^[\s\S]*?\/\*/, '')); process.exit(0); }
const TURNS = Math.max(6, +opt.turns || 18), Z = +opt.z || 1.5, DIFF = typeof opt.diff === 'string' ? opt.diff : 'normal';
const only = typeof opt.only === 'string' ? opt.only : (opt.all ? '' : 'clown_x');
const H = load({ html: opt.html });

const code = `(function(){
  const TURNS=${TURNS}, ONLY=${JSON.stringify(only)}, DOTS=['burn','scorch','venom','bleed','frost'];
  Object.assign(CFG,{world:1,runlen:5,diff:${JSON.stringify(DIFF)},auto:true,routes:false,draft:false,unlockAll:true,pace:1});
  ENEMY_DAMAGE = DIFFS[CFG.diff] || 1.5;
  const keys=CHARACTERS.map(c=>c.key); picked=new Set(keys.slice(0,4)); SAVE.xp={}; SAVE.graveyard=[];
  RUN=newRun(); rollRun();
  /* standard dummy party = the four middle-of-the-road fighters by max HP */
  const all=CHARACTERS.map(c=>makeUnit(c,'party')).sort((a,b)=>a.maxHp-b.maxHp);
  const mid=Math.floor(all.length/2)-2; party=all.slice(Math.max(0,mid),Math.max(0,mid)+4);
  const partyHp=party.reduce((a,p)=>a+p.maxHp,0);
  const res=[];
  for(const key of Object.keys(ENEMIES)){
    if(ONLY && !key.startsWith(ONLY)) continue;
    const e=ENEMIES[key]; if(!e||typeof e.ai!=='function') continue;
    const row={key,name:e.name||key,cost:(typeof COST!=='undefined'&&COST[key])||null,err:null};
    try{
      foes=[]; const u=summon(key); if(!foes.includes(u)) foes.push(u);
      /* summoned minions (Floating Hands, Bone Copy...) vanish on their first turn without a living parent, so give them a stand-in */
      if(!u.owner) u.owner={alive:true,hp:1,maxHp:1,name:'parent'};
      row.hp=u.maxHp; row.atk=u.atk; row.def=u.def; row.spd=u.spd;
      let dir=0,dot=0,ctrl=0,burst=0;
      party.forEach(p=>{p.hp=p.maxHp;p.alive=true;p.st=[];});
      for(let t=0;t<TURNS;t++){
        const before=party.map(p=>p.hp);
        u.ai? u.ai(u): e.ai(u);
        const lost=party.reduce((a,p,i)=>a+(before[i]-p.hp),0);
        dir+=lost; burst=Math.max(burst,lost);
        /* party members take their DoT ticks and statuses run down, like at the start of their own turns */
        party.forEach(p=>{
          p.st.filter(s=>DOTS.includes(s.k)).forEach(s=>{ dot+=Math.min(p.maxHp*s.v,p.maxHp); });
          if(p.st.some(s=>s.k==='stun')) ctrl+=1; else ctrl+=Math.min(.7,p.st.filter(s=>s.k==='slow').reduce((a,s)=>a+s.v,0));
        });
        party.forEach(p=>{ tickStatuses(p); p.hp=p.maxHp; p.alive=true; });
        u.hp=u.maxHp; u.alive=true;
        foes=foes.filter(f=>f===u||f.alive);
      }
      row.dpt=100*dir/TURNS/partyHp; row.dot=100*dot/TURNS/partyHp; row.burst=100*burst/partyHp; row.ctrl=ctrl/TURNS/party.length;
    }catch(err){ row.err=String(err&&err.message||err).slice(0,90); }
    res.push(row);
  }
  return JSON.stringify({res,partyHp,party:party.map(p=>p.name)});
})()`;
let out;
try { out = JSON.parse(vm.runInContext(code, H.sb)); } catch (e) { console.error('Could not run the audit: ' + (e && e.message)); process.exit(1); }
const rows = out.res;
if (!rows.length) { console.log('No enemies matched. Try --all, or a different --only prefix.'); process.exit(0); }

const ok = rows.filter(r => !r.err);
const mean = a => a.reduce((x, y) => x + y, 0) / (a.length || 1);
const sd = (a, m) => Math.sqrt(mean(a.map(x => (x - m) * (x - m))));
ok.forEach(r => { r.bulk = r.hp * (1 + .06 * r.def); r.threat = (r.dpt + r.dot + 15 * r.ctrl) * (r.spd / 10); });
const mT = mean(ok.map(r => r.threat)), sT = sd(ok.map(r => r.threat), mT) || 1, mB = mean(ok.map(r => r.bulk)), sB = sd(ok.map(r => r.bulk), mB) || 1;
ok.forEach(r => {
  const zt = (r.threat - mT) / sT, zb = (r.bulk - mB) / sB, f = [];
  if (zt > Z) f.push('HIGH'); if (zt < -Z) f.push('LOW');
  if (zt > Z * .6 && zb < -Z * .6) f.push('GLASS'); if (zt < -Z * .6 && zb > Z * .6) f.push('WALL');
  r.flags = f.join(' '); r.zt = zt;
});

const pad = (v, n, left) => { v = String(v); return left ? v.padStart(n) : v.padEnd(n); };
const f1 = v => v.toFixed(1);
console.log(`\nFAL-125 enemy audit   (${rows.length} enemies, ${TURNS} turns each, difficulty ${DIFF}, filter "${only || 'none'}")`);
console.log(`Dummy party: ${out.party.join(', ')}  (${out.partyHp} total max HP)\n`);
console.log(pad('ENEMY', 18) + ['HP', 'ATK', 'DEF', 'SPD'].map(h => pad(h, 5, 1)).join('') + ['DPT%', 'DOT%', 'BURST%', 'CTRL', 'BULK', 'THREAT', 'COST'].map(h => pad(h, 8, 1)).join('') + '  FLAGS');
ok.sort((a, b) => b.threat - a.threat).forEach(r => {
  console.log(pad(r.name, 18) + [r.hp, r.atk, r.def, r.spd].map(v => pad(Math.round(v), 5, 1)).join('') +
    [f1(r.dpt), f1(r.dot), f1(r.burst), r.ctrl.toFixed(2), Math.round(r.bulk), f1(r.threat), r.cost == null ? '-' : r.cost].map(v => pad(v, 8, 1)).join('') + '  ' + r.flags);
});
console.log(`\nGroup average THREAT ${f1(mT)} (spread ${f1(sT)}), BULK ${Math.round(mB)} (spread ${Math.round(sB)}).`);
const bad = rows.filter(r => r.err);
if (bad.length) { console.log('\nERRORS (fix these first):'); bad.forEach(r => console.log('  ' + r.name + ': ' + r.err)); }
const flagged = ok.filter(r => r.flags);
console.log(flagged.length ? `\n${flagged.length} flagged: ${flagged.map(r => r.name + ' (' + r.flags + ')').join(', ')}` : '\nNothing is far from the group average.');
if (opt.out) {
  const p = (typeof opt.out === 'string' ? opt.out : 'audit') + '_enemies.csv';
  const cols = ['key', 'name', 'hp', 'atk', 'def', 'spd', 'dpt', 'dot', 'burst', 'ctrl', 'bulk', 'threat', 'cost', 'flags', 'err'];
  fs.writeFileSync(p, cols.join(',') + '\n' + rows.map(r => cols.map(c => JSON.stringify(r[c] == null ? '' : (typeof r[c] === 'number' ? +r[c].toFixed(2) : r[c]))).join(',')).join('\n'));
  console.log('Wrote ' + p);
}
