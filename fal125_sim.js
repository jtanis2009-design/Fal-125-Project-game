#!/usr/bin/env node
'use strict';
/* fal125_sim.js  -  FAL-125 balance simulator
   Plays thousands of runs with the game's own autopilot and prints win-rate tables per fighter and per chip.
   It loads your real game HTML, so it always matches the version you point it at. No npm packages.

   USAGE (put this file, fal125_headless.js and your game .html in one folder):
     node fal125_sim.js                          fighters only, 2000 runs, World 1, full world, Normal
     node fal125_sim.js --runs 5000 --world 3
     node fal125_sim.js --runlen floor           one floor only (about 4x faster, less discriminating)
     node fal125_sim.js --chips                  also test every chip (adds chip-runs per chip)
     node fal125_sim.js --chips --chip-runs 150 --only-chips plate,batt,fang
     node fal125_sim.js --html path/to/game.html --seed 7 --out report

   OPTIONS
     --html FILE        game file (default: newest fal125*.html in this folder)
     --runs N           random-party runs for the fighter table (default 2000, about 5 min on a normal PC)
     --world N          world number 1-10 as shown in game (default 1)
     --runlen X         world | floor   (default world = a full world, the most honest test)
     --diff X           Easy | Normal | Hard | Challenge | Nuzlocke (default Normal)
     --party N          party size (default 4)
     --xp N             starting XP per fighter, 0 = level 1 (default 0)
     --chips            run the chip test too
     --chip-runs N      runs per chip (default 120)
     --baseline N       no-chip runs used as the chip comparison (default = --runs, max 2000)
     --only-chips a,b   test only these chip ids
     --seed N           random seed (same seed = same numbers)
     --out NAME         also write NAME_fighters.csv, NAME_roles.csv and NAME_chips.csv */
const fs = require('fs');
const { load } = require('./fal125_headless.js');

const args = process.argv.slice(2); const opt = {};
for (let i = 0; i < args.length; i++) { const a = args[i]; if (!a.startsWith('--')) continue; const k = a.slice(2); const nx = args[i + 1]; if (nx === undefined || nx.startsWith('--')) opt[k] = true; else { opt[k] = nx; i++; } }
if (opt.help || opt.h) { console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0].replace(/^[\s\S]*?\/\*/, '')); process.exit(0); }
const RUNS = +opt.runs || 2000, WORLD = (+opt.world || 1) - 1, RUNLEN = opt.runlen || 'world', DIFF = opt.diff || 'Normal', PARTY = +opt.party || 4;
const XP = +opt.xp || 0, CHIP_RUNS = +opt['chip-runs'] || 120, SEED = opt.seed == null ? 1 : +opt.seed;
const base = { world: WORLD, runlen: RUNLEN, diff: DIFF, xp: XP };

const H = load({ html: opt.html, seed: SEED });
const G = H.G, CH = G.CHARACTERS;
const rng = (() => { let a = (SEED * 2654435761) >>> 0 || 1; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; })();
const sample = (arr, n) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a.slice(0, n); };
const pct = x => (100 * x).toFixed(1) + '%';
const wilson = (w, n) => { if (!n) return [0, 0]; const z = 1.96, p = w / n, d = 1 + z * z / n, c = p + z * z / (2 * n), s = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)); return [(c - s) / d, (c + s) / d]; };
const pad = (s, n) => String(s).padEnd(n), lpad = (s, n) => String(s).padStart(n);
function table(rows, cols) {
  const w = cols.map(c => Math.max(c.h.length, ...rows.map(r => String(c.f(r)).length)));
  const line = cols.map((c, i) => c.l ? pad(c.h, w[i]) : lpad(c.h, w[i])).join('  ');
  console.log(line); console.log(w.map(n => '-'.repeat(n)).join('  '));
  rows.forEach(r => console.log(cols.map((c, i) => c.l ? pad(c.f(r), w[i]) : lpad(c.f(r), w[i])).join('  ')));
}
const csvEsc = v => /[",\n]/.test(String(v)) ? '"' + String(v).replace(/"/g, '""') + '"' : String(v);
const writeCsv = (name, head, rows) => { fs.writeFileSync(name, [head.join(','), ...rows.map(r => r.map(csvEsc).join(','))].join('\n')); console.log('  wrote ' + name); };

let bad = 0, firstErr = null; const errs = {}; const stalls = {}; let stallN = 0;
async function sim(keys, chips, seed) {
  H.reseed(seed);
  const r = await H.run(keys, Object.assign({}, base, { chips }));
  if (r.stalemate) { stallN++; const k = 'wave ' + r.stallWave + ': ' + (r.stallFoes || '?'); stalls[k] = (stalls[k] || 0) + 1; }
  if (!r.ok) { const ek = (r.error ? r.error.split(' | ')[0] : 'run got stuck waiting for a screen') + '  (World ' + (WORLD + 1) + ', wave ' + r.atWave + ')'; errs[ek] = (errs[ek] || 0) + 1; }
  if (!r.ok) { bad++; if (!firstErr) firstErr = r.error || (r.stuck ? 'run got stuck waiting for a screen' : 'no result'); return null; }
  return r;
}
function bar(done, total, label) { if (!process.stdout.isTTY) return; process.stdout.write(`\r  ${label} ${done}/${total} (${Math.round(100 * done / total)}%)   `); if (done === total) process.stdout.write('\n'); }

(async () => {
  const t0 = Date.now();
  console.log(`\nFAL-125 simulator  |  ${H.htmlPath}\nWorld ${WORLD + 1}, ${RUNLEN}, ${DIFF}, party of ${PARTY}, level ${XP ? 'custom xp ' + XP : '1'}, seed ${SEED}\n`);

  /* ---------- 1. fighters: random parties, credit every fighter in the party ---------- */
  const per = {}; CH.forEach(c => per[c.key] = { c, n: 0, w: 0, waves: 0, dmg: 0, dn: 0, surv: 0 });
  const roleCombo = {}; let tot = { n: 0, w: 0, waves: 0 }; const maxWaves = {};
  for (let i = 0; i < RUNS; i++) {
    const keys = sample(CH.map(c => c.key), PARTY);
    const r = await sim(keys, [], SEED * 100003 + i); if (!r) continue;
    tot.n++; tot.w += r.win; tot.waves += r.waves;
    const roles = keys.map(k => CH.find(c => c.key === k).role[0]).sort().join('');   /* e.g. DDHT */
    const rc = (roleCombo[roles] = roleCombo[roles] || { n: 0, w: 0 }); rc.n++; rc.w += r.win;
    const dsum = Object.values(r.dmg).reduce((a, b) => a + b, 0) || 1;
    keys.forEach(k => { const p = per[k]; p.n++; p.w += r.win; p.waves += r.waves; p.surv += r.win ? 1 : 0; const nm = CH.find(c => c.key === k).name; const d = r.dmg[nm]; if (d != null) { p.dmg += d / dsum; p.dn++; } });
    if (i % 25 === 0) bar(i + 1, RUNS, 'fighters');
  }
  bar(RUNS, RUNS, 'fighters');
  if (!tot.n) { console.log('No run finished. First problem: ' + firstErr); process.exit(1); }
  const baseWin = tot.w / tot.n;
  console.log(`Overall: ${tot.n} runs, ${pct(baseWin)} wins, ${(tot.waves / tot.n).toFixed(2)} waves cleared on average.` + (bad ? `  (${bad} runs could not finish and were skipped${firstErr ? ': ' + firstErr : ''})` : '') + '\n');

  const rows = Object.values(per).filter(p => p.n).map(p => { const [lo, hi] = wilson(p.w, p.n); return { name: p.c.name, key: p.c.key, role: p.c.role, type: p.c.type, n: p.n, wr: p.w / p.n, lo, hi, d: p.w / p.n - baseWin, waves: p.waves / p.n, share: p.dn ? p.dmg / p.dn : 0 }; })
    .sort((a, b) => b.wr - a.wr);
  const flag = r => r.lo > baseWin + .02 ? 'STRONG' : r.hi < baseWin - .02 ? 'WEAK' : '';
  console.log('FIGHTER WIN RATES  (credited whenever the fighter was in the party; sorted best to worst)');
  console.log('flag = the 95% confidence range sits clearly above / below the overall average\n');
  table(rows, [
    { h: '#', f: r => rows.indexOf(r) + 1 }, { h: 'Fighter', f: r => r.name, l: 1 }, { h: 'Role', f: r => r.role, l: 1 }, { h: 'Type', f: r => r.type, l: 1 },
    { h: 'Runs', f: r => r.n }, { h: 'Win%', f: r => pct(r.wr) }, { h: '95% range', f: r => pct(r.lo) + '-' + pct(r.hi) }, { h: 'vs avg', f: r => (r.d >= 0 ? '+' : '') + (100 * r.d).toFixed(1) },
    { h: 'Waves', f: r => r.waves.toFixed(2) }, { h: 'Dmg share', f: r => pct(r.share) }, { h: 'Flag', f: r => flag(r), l: 1 }]);

  console.log('\nBY ROLE (average of the fighters in each role)');
  const roles = {}; rows.forEach(r => { const o = (roles[r.role] = roles[r.role] || { n: 0, wr: 0, waves: 0, f: 0 }); o.f++; o.wr += r.wr; o.waves += r.waves; });
  table(Object.entries(roles).map(([k, o]) => ({ k, f: o.f, wr: o.wr / o.f, w: o.waves / o.f })), [{ h: 'Role', f: r => r.k, l: 1 }, { h: 'Fighters', f: r => r.f }, { h: 'Avg win%', f: r => pct(r.wr) }, { h: 'Avg waves', f: r => r.w.toFixed(2) }]);
  console.log('\nBY PARTY SHAPE (T=Tank, D=Damage, H=Healer; only shapes seen 30+ times)');
  table(Object.entries(roleCombo).filter(([, o]) => o.n >= 30).sort((a, b) => b[1].w / b[1].n - a[1].w / a[1].n).map(([k, o]) => ({ k, n: o.n, wr: o.w / o.n })), [{ h: 'Shape', f: r => r.k, l: 1 }, { h: 'Runs', f: r => r.n }, { h: 'Win%', f: r => pct(r.wr) }]);

  if (bad) {
    console.log(`\nGAME ERRORS: ${bad} runs crashed or stalled inside the game code and were left out of the numbers above:`);
    Object.entries(errs).sort((a, b) => b[1] - a[1]).slice(0, 6).forEach(([k, n]) => console.log(`  ${lpad(n, 4)}x  ${k}`));
  }
  if (stallN) {
    console.log(`\nSTALEMATES: ${stallN} of ${tot.n} runs hit the 150-round cap in one fight (counted as losses). The autopilot could not finish these enemies:`);
    Object.entries(stalls).sort((a, b) => b[1] - a[1]).slice(0, 8).forEach(([k, n]) => console.log(`  ${lpad(n, 4)}x  ${k}`));
    console.log('  (Could be a real softlock for players too, or just something the autopilot cannot solve, e.g. a guard-and-summon boss.)');
  }
  if (opt.out) writeCsv(opt.out + '_fighters.csv', ['fighter', 'key', 'role', 'type', 'runs', 'win_rate', 'ci_low', 'ci_high', 'vs_avg', 'avg_waves', 'dmg_share', 'flag'], rows.map(r => [r.name, r.key, r.role, r.type, r.n, r.wr.toFixed(4), r.lo.toFixed(4), r.hi.toFixed(4), r.d.toFixed(4), r.waves.toFixed(3), r.share.toFixed(4), flag(r)]));
  if (opt.out) writeCsv(opt.out + '_roles.csv', ['role', 'fighters', 'avg_win_rate', 'avg_waves'], Object.entries(roles).map(([k, o]) => [k, o.f, (o.wr / o.f).toFixed(4), (o.waves / o.f).toFixed(3)]));

  /* ---------- 2. chips: random parties + one chip, compared with the no-chip baseline ---------- */
  if (opt.chips) {
    const ids = (opt['only-chips'] && opt['only-chips'] !== true ? String(opt['only-chips']).split(',') : G.CHIPS.filter(c => !c.trophy && !c.noSlot).map(c => c.id)).filter(id => G.CHIP[id]);
    const BASE_N = Math.min(+opt.baseline || RUNS, 2000);
    console.log(`\nCHIP TEST: ${ids.length} chips x ${CHIP_RUNS} runs each (baseline ${BASE_N} runs with no chip)`);
    let bw = 0, bn = 0, bwav = 0;
    for (let i = 0; i < BASE_N; i++) { const keys = sample(CH.map(c => c.key), PARTY); const r = await sim(keys, [], SEED * 7919 + i); if (r) { bn++; bw += r.win; bwav += r.waves; } }
    const bwr = bw / bn; console.log(`Baseline: ${pct(bwr)} wins, ${(bwav / bn).toFixed(2)} waves\n`);
    const crow = []; const tEta = Date.now(); let doneRuns = 0; const totalRuns = ids.length * CHIP_RUNS;
    { const secs = Math.round(totalRuns * (Date.now() - t0) / 1000 / Math.max(1, tot.n + bn) ); console.log(`Estimated time for the chip test: about ${secs >= 120 ? Math.round(secs / 60) + ' minutes' : secs + ' seconds'} (${totalRuns.toLocaleString()} runs). Use --only-chips or a lower --chip-runs to shorten it.\n`); }
    for (let ci = 0; ci < ids.length; ci++) {
      const id = ids[ci], d = G.CHIP[id]; let w = 0, n = 0, wav = 0;
      for (let i = 0; i < CHIP_RUNS; i++) {
        let keys = sample(CH.map(c => c.key), PARTY);
        if (d.who) { if (!CH.find(c => c.key === d.who)) break; if (!keys.includes(d.who)) keys[0] = d.who; }
        const r = await sim(keys, [id], SEED * 31337 + ci * 1009 + i); if (r) { n++; w += r.win; wav += r.waves; }
      }
      if (!n) continue; const [lo, hi] = wilson(w, n);
      crow.push({ id, name: d.name, r: d.r, who: d.who || '', n, wr: w / n, lo, hi, d: w / n - bwr, waves: wav / n, dw: wav / n - bwav / bn });
      bar(ci + 1, ids.length, 'chips');
    }
    crow.sort((a, b) => b.d - a.d);
    const cflag = r => r.lo > bwr + .03 ? 'STRONG' : r.hi < bwr - .03 ? 'WEAK' : '';
    console.log('CHIP WIN RATES  (compare with the baseline; chips tied to one fighter always have that fighter in the party)\n');
    table(crow, [{ h: 'Chip', f: r => r.name, l: 1 }, { h: 'Id', f: r => r.id, l: 1 }, { h: 'Rarity', f: r => r.r, l: 1 }, { h: 'Fighter', f: r => r.who, l: 1 }, { h: 'Runs', f: r => r.n }, { h: 'Win%', f: r => pct(r.wr) },
      { h: 'vs base', f: r => (r.d >= 0 ? '+' : '') + (100 * r.d).toFixed(1) }, { h: 'Waves', f: r => r.waves.toFixed(2) }, { h: 'Flag', f: r => cflag(r), l: 1 }]);
    console.log('\nNote: with ~' + CHIP_RUNS + ' runs a chip needs roughly +/-' + (100 * 1.96 * Math.sqrt(.25 / CHIP_RUNS)).toFixed(0) + ' points before it means anything. Raise --chip-runs for the ones you care about (use --only-chips).');
    if (opt.out) writeCsv(opt.out + '_chips.csv', ['chip', 'id', 'rarity', 'fighter', 'runs', 'win_rate', 'vs_baseline', 'avg_waves', 'flag'], crow.map(r => [r.name, r.id, r.r, r.who, r.n, r.wr.toFixed(4), r.d.toFixed(4), r.waves.toFixed(3), cflag(r)]));
  }
  console.log(`\nDone in ${((Date.now() - t0) / 1000).toFixed(1)}s.`);
})().catch(e => { console.error('Simulator crashed:', e && e.stack || e); process.exit(1); });
