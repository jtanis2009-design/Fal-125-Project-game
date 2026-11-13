#!/usr/bin/env node
'use strict';
/* fal125_mastery_test.js: checks Mastery data for every fighter and that XP awards level up.  USAGE: node fal125_mastery_test.js [--html game.html] */
const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), i0 = a.indexOf('--html'), html = findHtml(i0 >= 0 ? a[i0 + 1] : null);
const H = load({ html }), G = H.G, M = G.MAST; let bad = 0, written = 0;
const fail = m => { console.log('✗ ' + m); bad++; };
Object.keys(M.TEXT).forEach(k => { if (!G.CHARACTERS_BY(k)) fail('MAST_TEXT has unknown fighter ' + k); });
G.CHARACTERS.forEach(c => {
  const I = M.info(c); if (I.written) written++;
  if (!I.epithet || !I.lore || !I.bio || !Array.isArray(I.q) || I.q.length !== 3 || I.q.some(x => !x)) fail(c.key + ': incomplete mastery info');
  const sk = M.sig(c); if (!sk || !G.SKILLS[sk]) fail(c.key + ': signature move "' + sk + '" is not a real skill');
});
const k = G.CHARACTERS[0].key; G.SAVE_().mast = {}; const got = [];
for (let i = 0; i < 400; i++) { const b = M.lvReal(k); M.award([k], 10); if (M.lvReal(k) > b) got.push(M.lvReal(k)); }
if (got.join() !== '1,2,3,4,5,6,7') fail('levels reached: ' + got.join());
['Human', 'Hybrid', 'Demon', 'Angel', 'Other'].forEach(t => { const it = M.items(t, s => s); if (!Array.isArray(it)) fail('items ' + t); });
console.log(`${G.CHARACTERS.length} fighters, ${written} hand-written entries, levels reached ${got.join(',')}`);
console.log(bad ? `\n${bad} problem(s).` : '\nMastery OK.'); process.exit(bad ? 1 : 0);
