'use strict';
/* fal125_neb_test.js  (v181)
   Plays the Never Ending Battle on autopilot for a number of turns, as God and as Satan, and prints what happened:
   falls on both sides, shop purchases, lore opened, errors. Usage:  node tools/fal125_neb_test.js [--turns 160] [--seeds 3] [--html path] */
const { load } = require('./fal125_headless.js');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const TURNS = +arg('turns', 160), SEEDS = +arg('seeds', 3), HTML = arg('html', null), ALL = process.argv.includes('--allmoves');   /* --allmoves: cycle through all six moves (autopilot skips Mercy / Rebellion) */
(async () => {
  let bad = 0;
  for (const side of ['god', 'satan']) for (let sd = 1; sd <= SEEDS; sd++) {
    const L = load({ seed: sd * 77, html: HTML }); const { G, sb } = L; const log = { shops: 0, buys: 0, lore: 0, leave: 0, titles: {} };
    sb.evtAsk = (t, p, ch) => {
      log.titles[t] = (log.titles[t] || 0) + 1;
      if (t === 'Record unlocked') { log.lore++; return Promise.resolve(0); }
      if (t === 'The Interlude') { log.shops++; const k = ch.findIndex((c, i) => i < ch.length - 3 && !/not enough/.test(c.d || '')); if (k >= 0) { log.buys++; return Promise.resolve(k); } return Promise.resolve(ch.length - 1); }
      return Promise.resolve(0);
    };
    if (ALL) { let n = 0; sb.autoPick = u => { if (!sb.resolveChoice && !G.waiting) return; const ks = u.skills; for (let i = 0; i < ks.length; i++) { const k = ks[(n + i) % ks.length]; if (!((u.cd[k] || 0) > 0)) { n = (n + i + 1) % ks.length; return sb.submit({ skill:k, target:G.foes.find(f => f.alive) }); } } sb.submit({ skill:ks[0], target:G.foes[0] }); }; }
    const r = await L.run([side], { neb: true, turns: TURNS });
    const N = G.NEB, S = G.SAVE.neb[side];
    console.log(`${side.padEnd(5)} seed ${sd}: ok=${r.ok}${r.error ? ' ERROR ' + r.error : ''}${r.stuck ? ' STUCK' : ''} turns=${S.turns} attacks=${S.atk} foeFalls=${S.falls} shops=${log.shops} buys=${log.buys} lore=${log.lore} cur=${N.cur} upgrades=${JSON.stringify(N.up)} esc=${N.esc} youFell=${N.pfalls} foeHp=${Math.round(G.foes[0].hp)}/${G.foes[0].maxHp} meHp=${Math.round(G.party[0].hp)}/${G.party[0].maxHp} moves=${JSON.stringify(G.RUN.mv || {})}`);
    if (!r.ok || S.turns < TURNS) bad++;
  }
  console.log(bad ? 'PROBLEMS: ' + bad : 'All runs finished.');
  process.exit(bad ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
