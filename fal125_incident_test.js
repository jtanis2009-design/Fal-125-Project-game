#!/usr/bin/env node
'use strict';
/* fal125_incident_test.js: checks every Containment Incident (data + a few auto-played runs each).
   USAGE: node fal125_incident_test.js [--html game.html] [--runs 6] [--party snavo,bearer,radiant,eyianix] */
const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), opt = k => { const i = a.indexOf('--' + k); return i >= 0 ? a[i + 1] : null; };
const html = findHtml(opt('html')), runs = +(opt('runs') || 6), party = (opt('party') || 'snavo,bearer,radiant,eyianix').split(',');
(async () => {
  const H = load({ html }), G = H.G; let bad = 0;
  for (const i of G.INCIDENTS) {
    const W = G.WORLD_DATA[i.world]; const probs = [];
    if (!W) probs.push('bad world');
    (i.file.who || []).forEach(k => { if (!G.CHARACTERS_BY(k)) probs.push('unknown fighter ' + k); });
    (i.staff || []).forEach(k => { if (!G.CHARACTERS_BY(k)) probs.push('unknown staff ' + k); });
    if (W && ['breach', 'cult', 'specimen', 'missing'].includes(i.type)) { const b = W.bosses[i.boss || 0]; if (!G.ENEMIES[b]) probs.push('missing boss ' + b); else if (G.ENEMIES[b].final) probs.push('boss is a final boss ' + b); }
    if (i.type === 'missing' && (!i.rooms || i.rooms.length !== 3 || !i.staff || i.staff.length !== 3)) probs.push('needs 3 rooms and 3 staff');
    let w = 0, st = 0, err = [];
    for (let n = 0; n < runs; n++) { H.reseed(100 + n); const r = await H.run(party, { incident: i.id, maxRounds: 80 }); if (r.win) w++; if (r.stuck || r.stalemate) st++; if (r.error) err.push(r.error); }
    if (err.length || st) probs.push(`${err.length} errors, ${st} stuck: ${err[0] || ''}`);
    console.log(`${probs.length ? '✗' : '✓'} ${i.id} ${i.type.padEnd(8)} ${i.name.padEnd(26)} wins ${w}/${runs} ${probs.join(' | ')}`); if (probs.length) bad++;
  }
  console.log(bad ? `\n${bad} incident(s) have problems.` : '\nAll incidents OK.'); process.exit(bad ? 1 : 0);
})();
