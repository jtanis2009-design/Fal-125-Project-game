#!/usr/bin/env node
'use strict';
/* fal125_style_audit.js: compares Run Styles on the SAME parties and seeds (so differences come from the style, not luck).
   USAGE: FAL_STYLE=hour node fal125_style_audit.js [--html game.html] [--runs 40] [--world 1] [--runlen world|floor] [--diff Normal] [--xp 0] [--smart] [--seed0 1000] [--tune '{"hourGrow":.04}']
   Run it once per style (FAL_STYLE= for Standard) and compare the lines it prints. */
const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), opt = k => { const i = a.indexOf('--' + k); return i >= 0 ? a[i + 1] : null; };
const html = findHtml(opt('html')), RUNS = +(opt('runs') || 40), WORLD = (+(opt('world') || 1)) - 1, RUNLEN = opt('runlen') || 'world', DIFF = opt('diff') || 'Normal', XP = +(opt('xp') || 0), SMART = a.includes('--smart'), S0 = +(opt('seed0') || 1000);
(async () => {
  const H = load({ html }), G = H.G; if (opt('tune') && G.STT) Object.assign(G.STT, JSON.parse(opt('tune')));
  const pool = G.CHARACTERS.filter(c => !['elohim', 'abaddon'].includes(c.key)).map(c => c.key);
  let win = 0, waves = 0, rounds = 0, alive = 0, err = 0, stale = 0, n = 0; const t0 = Date.now();
  for (let i = 0; i < RUNS; i++) {
    const s = S0 + i; H.reseed(s); const ks = []; while (ks.length < 4) { const k = pool[Math.floor(((s * 2654435761 + ks.length * 40503 + ks.length * ks.length * 977) >>> 0) % pool.length)]; if (!ks.includes(k)) ks.push(k); else { ks.push(pool[(pool.indexOf(k) + 1 + ks.length) % pool.length]); } }
    const uniq = [...new Set(ks)]; while (uniq.length < 4) uniq.push(pool[(uniq.length * 7 + i) % pool.length]);
    H.reseed(s); const r = await H.run(uniq.slice(0, 4), { world: WORLD, runlen: RUNLEN, diff: DIFF, xp: XP, smart: SMART });
    if (r.error) err++; if (r.stalemate) stale++; n++; if (r.win) win++; waves += r.waves; rounds += r.rounds; alive += r.alive;
  }
  console.log(`${(process.env.FAL_STYLE || 'standard').padEnd(9)} world ${WORLD + 1} ${RUNLEN} ${DIFF}: runs ${n}  win ${(100 * win / n).toFixed(0)}%  waves ${(waves / n).toFixed(1)}  rounds ${(rounds / n).toFixed(0)}  alive@end ${(alive / n).toFixed(2)}  errors ${err}  stalemates ${stale}  (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
})();
