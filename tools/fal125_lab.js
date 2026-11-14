#!/usr/bin/env node
/* FAL-125 TEST LAB (command line). The headless twin of the in-game Lab button: same settings, many runs at once.

   node tools/fal125_lab.js --party snavo,sna,eyianix,radiant --world 7 --wave 35 --level 10 --runs 20
   node tools/fal125_lab.js --config '{"party":["hush","xekna"],"level":10,"world":6,"wave":1,"diff":"Normal","runlen":"world","story":true}' --runs 12
        (--config takes the SAME text the in-game Lab "Copy" button gives you. In that text world is 0-based: 6 = World 7.)
   node tools/fal125_lab.js --list chars|enemies|chips|parties|worlds

   OPTIONS  --party a,b,c,d   --world N (1-8)   --wave N (start wave, 1-based)   --level N (1-10)   --diff Easy|Normal|Hard|Challenge|Nuzlocke
            --runs N   --seed N   --html path   --nostory (drop the Story-mode x0.9)   --classic (old autopilot instead of smart)
            --foes key,key (force the start wave's enemies)   --chips id,id   --god (party takes no damage)   --ohk (enemies start at 1 HP)   --mode world|endless|bossrush   --why (V270: print the enemies of the wave that ended each failed run)
   Prints the clear rate, the average wave reached, and which waves the failed runs ended on. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const args = process.argv.slice(2), opt = {};
for (let i = 0; i < args.length; i++) { const a = args[i]; if (a.startsWith('--')) { const k = a.slice(2), n = args[i + 1]; if (n === undefined || n.startsWith('--')) opt[k] = true; else { opt[k] = n; i++; } } }
const { load } = require('./fal125_headless.js');
let html = opt.html; if (!html) { const d = path.join(__dirname, '..'); const f = fs.readdirSync(d).filter(x => /^fal125_battle_prototype-v\d+\.html$/.test(x)).sort((a, b) => parseInt(a.match(/v(\d+)/)[1]) - parseInt(b.match(/v(\d+)/)[1])); html = path.join(d, f[f.length - 1]); }
(async () => {
  const H = load({ html, seed: +opt.seed || 1 });
  const ev = c => vm.runInContext(c, H.sb);
  if (opt.list) {
    const w = opt.list;
    if (w === 'chars') ev('CHARACTERS').forEach(c => console.log(c.key.padEnd(14), c.id, c.role.padEnd(7), c.type.padEnd(7), c.build.padEnd(13), c.name));
    else if (w === 'enemies') console.log(Object.keys(ev('ENEMIES')).join(' '));
    else if (w === 'chips') console.log(Object.keys(ev('CHIP')).join(' '));
    else if (w === 'parties') ev('PLAYSTYLES').forEach(p => console.log(p.id.padEnd(14), p.name.padEnd(24), p.party.join(',')));
    else if (w === 'worlds') ev('WORLD_DATA').forEach((x, i) => console.log(i + 1, x.name, '| floors:', (x.floors || []).join(', ')));
    return;
  }
  let c = { party:['snavo', 'sna', 'eyianix', 'radiant'], level:10, world:6, wave:1, diff:'Normal', runlen:'world', story:true, god:false, ohk:false, chips:'', foes:'' };
  if (opt.config) Object.assign(c, JSON.parse(opt.config));
  if (opt.party) c.party = String(opt.party).split(',');
  if (opt.world) c.world = (+opt.world) - 1;
  if (opt.wave) c.wave = +opt.wave; if (opt.level) c.level = +opt.level; if (opt.diff) c.diff = opt.diff; if (opt.mode) c.runlen = opt.mode;
  if (opt.nostory) c.story = false; if (opt.god) c.god = true; if (opt.ohk) c.ohk = true; if (opt.foes) c.foes = opt.foes; if (opt.chips) c.chips = opt.chips;
  const list = s => (Array.isArray(s) ? s : String(s || '').split(/[\s,]+/)).filter(Boolean);
  const P = list(c.party), foes = list(c.foes), chips = list(c.chips), runs = +opt.runs || 10;
  const xpNeed = l => 40 + 30 * l; let xp = 0; for (let l = 1; l < c.level; l++) xp += xpNeed(l);
  const xpMap = {}; P.forEach(k => { xpMap[k] = xp; });
  const keys = new Set(ev('CHARACTERS').map(x => x.key)); const bad = P.filter(k => !keys.has(k)); if (bad.length) { console.log('Unknown fighter key(s): ' + bad.join(', ') + '   (node tools/fal125_lab.js --list chars)'); process.exit(1); }
  let wins = 0, waveSum = 0, stalls = 0, errs = 0; const loss = {};
  for (let i = 0; i < runs; i++) {
    H.reseed((+opt.seed || 1) * 1000 + i);
    try {
      const r = await H.run(P, { world:c.world, runlen:c.runlen, diff:c.diff, xp:0, xpMap, chips, smart:!opt.classic, story:c.story, wave:c.wave, foes, god:c.god, ohk:c.ohk });
      if (r.win) wins++; else { const k = r.stalemate ? 'stall' + r.stallWave : String(r.atWave); loss[k] = (loss[k] || 0) + 1; if (r.stalemate) stalls++;
        if (opt.why) { try { console.log('  run ' + i + ' lost on wave ' + r.atWave + ': ' + ev('JSON.stringify((WAVES[wave] || []).map(k => ENEMIES[k] ? ENEMIES[k].name : k))') + ' | alive foes: ' + ev('JSON.stringify(foes.filter(f => f.alive).map(f => f.name))')); } catch (e) {} } }
      waveSum += r.atWave || 0;
    } catch (e) { errs++; console.log('run ' + i + ' error: ' + String(e.message).slice(0, 160)); }
  }
  console.log('FAL-125 test lab | ' + path.basename(html));
  console.log('party ' + P.join(',') + ' | level ' + c.level + ' | World ' + (c.world + 1) + ' from wave ' + c.wave + ' | ' + c.diff + (c.story && c.diff === 'Normal' ? ' + Story ease' : '') + (c.god ? ' | GOD' : '') + (c.ohk ? ' | 1HP foes' : '') + (foes.length ? ' | foes ' + foes.join(',') : '') + (chips.length ? ' | chips ' + chips.join(',') : ''));
  console.log('clears ' + wins + '/' + runs + ' (' + Math.round(100 * wins / runs) + '%) | average wave reached ' + (waveSum / runs).toFixed(1) + (errs ? ' | errors ' + errs : ''));
  console.log('failed runs ended on: ' + (Object.keys(loss).length ? JSON.stringify(loss) : '(none)'));
})();
