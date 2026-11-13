#!/usr/bin/env node
'use strict';
/* fal125_shapes.js  -  FAL-125 party-shape test (v179)
   Same world, same level, same difficulty, random fighters per role, tell-aware autopilot. Compares party shapes fairly.
   USAGE   node tools/fal125_shapes.js                         World 3, level 6, 30 runs per shape
           node tools/fal125_shapes.js --world 5 --xp 1700 --runs 50 --diff Hard
   Shapes: T=Tank H=Healer D=Damage.  --dumb uses the plain autopilot.  --html FILE  --seed N */
const { load } = require('./fal125_headless.js');
const args = process.argv.slice(2), opt = {};
for (let i = 0; i < args.length; i++) { const a = args[i]; if (!a.startsWith('--')) continue; const k = a.slice(2), nx = args[i + 1]; if (nx === undefined || nx.startsWith('--')) opt[k] = true; else { opt[k] = nx; i++; } }
const WORLD = (+opt.world || 3) - 1, RUNS = +opt.runs || 30, XP = opt.xp == null ? 500 : +opt.xp, DIFF = opt.diff || 'Normal', SEED = +opt.seed || 1;
const SHAPES = { 'TH DD (standard)': 'THDD', 'TT H D (tank-heavy)': 'TTHD', 'T HH D (healer-heavy)': 'THHD', 'T DDD (no healer)': 'TDDD', 'DDD H (no tank)': 'HDDD', 'TT DD (no healer, 2 tanks)': 'TTDD' };
const ROLE = { T:'Tank', H:'Healer', D:'Damage' };
(async () => {
  const H = load({ html: opt.html, seed: SEED }), CH = H.G.CHARACTERS;
  let s = SEED * 7919; const rng = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  const pool = r => CH.filter(c => c.role === ROLE[r]);
  console.log(`\nParty shapes | World ${WORLD + 1}, ${DIFF}, every fighter at ${XP} XP, ${RUNS} runs each\n`);
  console.log('Shape'.padEnd(30) + 'wins'.padStart(6) + 'win%'.padStart(8) + 'avg waves'.padStart(11));
  for (const [name, code] of Object.entries(SHAPES)) {
    let w = 0, waves = 0;
    for (let i = 0; i < RUNS; i++) {
      const keys = []; for (const r of code) { let k, t = 0; do { k = pool(r)[Math.floor(rng() * pool(r).length)].key; } while (keys.includes(k) && ++t < 50); keys.push(k); }
      H.reseed(SEED * 100003 + i * 7 + 1);
      const m = {}; keys.forEach(k => m[k] = XP);
      const r = await H.run(keys, { world: WORLD, runlen: 'world', diff: DIFF, xp: 0, xpMap: m, chips: [], smart: !opt.dumb });
      w += r.win ? 1 : 0; waves += r.waves;
    }
    console.log(name.padEnd(30) + `${w}/${RUNS}`.padStart(6) + (100 * w / RUNS).toFixed(0).padStart(7) + '%' + (waves / RUNS).toFixed(1).padStart(11));
  }
})();
