#!/usr/bin/env node
'use strict';
/* fal125_campaign.js  -  FAL-125 Story-progression test (v179)
   Plays the 8 main worlds IN ORDER with the four Story starters, carrying XP from run to run and retrying a failed world
   (like a real player would) up to --tries times. Unlike fal125_sim.js (fresh level-1 random parties), this shows how the Story
   curve feels for a party that actually levels. By default it uses a tell-aware autopilot (--dumb = the plain game autopilot).
   Recruit encounters, shops and story scenes are still skipped, so treat it as a slightly pessimistic Story player.

   USAGE   node tools/fal125_campaign.js                    6 sequences, Normal, 4 tries per world
           node tools/fal125_campaign.js --seqs 12 --diff Hard --tries 3
           node tools/fal125_campaign.js --party snavo,sna,eyianix,radiant --from 2 --to 6 --dumb
   OPTIONS --seqs N  --tries N  --diff X  --party a,b,c,d  --from N --to N (world numbers 1-8)  --nostory (drop the Story-mode x0.9 enemy damage, the old v179-v192 behaviour)  --startxp N (start every fighter with this XP, 1700 = level 10)  --dumb  --seed N  --html FILE */
const { load } = require('./fal125_headless.js');
const args = process.argv.slice(2), opt = {};
for (let i = 0; i < args.length; i++) { const a = args[i]; if (!a.startsWith('--')) continue; const k = a.slice(2), nx = args[i + 1]; if (nx === undefined || nx.startsWith('--')) opt[k] = true; else { opt[k] = nx; i++; } }
const SEQS = +opt.seqs || 6, TRIES = +opt.tries || 4, DIFF = opt.diff || 'Normal', SEED = +opt.seed || 1;
const FROM = (+opt.from || 1) - 1, TO = (+opt.to || 8) - 1, SMART = !opt.dumb;
const PARTY = (opt.party && opt.party !== true ? opt.party : 'fuja,radiant,eyianix,bearer').split(',');   /* V235: the Story starters */
const lvl = xp => { let l = 1, x = xp; while (l < 10 && x >= 40 + 30 * l) { x -= 40 + 30 * l; l++; } return l; };
(async () => {
  const H = load({ html: opt.html, seed: SEED }); const names = H.G.WORLD_DATA.map(w => w.name);
  const st = {}; for (let w = FROM; w <= TO; w++) st[w] = { reach: 0, first: 0, clear: 0, tries: 0, lv: 0, fails: {} };
  for (let q = 0; q < SEQS; q++) {
    const xpMap = {}; PARTY.forEach(k => xpMap[k] = +opt.startxp || 0);
    for (let w = FROM; w <= TO; w++) {
      const S = st[w]; S.reach++; let cleared = false;
      for (let t = 1; t <= TRIES && !cleared; t++) {
        H.reseed(SEED * 100003 + q * 1009 + w * 31 + t);
        const r = await H.run(PARTY, { world: w, runlen: 'world', diff: DIFF, xp: 0, xpMap, chips: [], smart: SMART, story: !opt.nostory });
        S.tries++; PARTY.forEach(k => xpMap[k] += r.xpGain || 0);
        if (r.win) { cleared = true; S.clear++; if (t === 1) S.first++; }
        else { const f = r.stalemate ? 'stall' + r.stallWave : String(r.atWave); S.fails[f] = (S.fails[f] || 0) + 1; }
      }
      S.lv += lvl(xpMap[PARTY[0]]);
      if (!cleared) break;   /* this sequence is stuck: the player gave up */
    }
  }
  console.log(`\nFAL-125 campaign test | ${H.htmlPath}\n${SEQS} sequences, ${DIFF}, up to ${TRIES} tries per world, party ${PARTY.join('/')}, ${SMART ? 'tell-aware' : 'plain'} autopilot\n`);
  console.log('World                          reached  1st-try  cleared  avg tries  avg lvl  losing waves');
  for (let w = FROM; w <= TO; w++) { const S = st[w]; if (!S.reach) continue;
    console.log(`${String(w + 1) + '. ' + names[w]}`.padEnd(31) + String(S.reach).padStart(7) + String(S.first).padStart(9) + String(S.clear).padStart(9) + (S.tries / S.reach).toFixed(1).padStart(11) + (S.lv / S.reach).toFixed(1).padStart(9) + '  ' + JSON.stringify(S.fails)); }
  console.log('\n(reached = sequences that got this far; cleared = cleared within the allowed tries; losing waves = where failed attempts ended)');
})();
