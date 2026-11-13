#!/usr/bin/env node
'use strict';
/* fal125_role_audit.js  -  FAL-125 role audit
   Lists every fighter's HP / ATK / DEF / SPD against the average for their role and flags outliers.
   It also checks whether a fighter's stat shape looks more like a DIFFERENT role than the one they are tagged with,
   which is the quick way to spot who needs a role remake. Reads your game HTML directly, no npm packages.

   USAGE (same folder as your game .html and fal125_headless.js):
     node fal125_role_audit.js
     node fal125_role_audit.js --html path/to/game.html
     node fal125_role_audit.js --z 1.25          flag stats this many standard deviations from the role average (default 1.5)
     node fal125_role_audit.js --role Tank       show only one role
     node fal125_role_audit.js --out audit       also write audit_fighters.csv and audit_roles.csv */
const fs = require('fs');
const { load } = require('./fal125_headless.js');

const args = process.argv.slice(2); const opt = {};
for (let i = 0; i < args.length; i++) { const a = args[i]; if (!a.startsWith('--')) continue; const k = a.slice(2); const nx = args[i + 1]; if (nx === undefined || nx.startsWith('--')) opt[k] = true; else { opt[k] = nx; i++; } }
if (opt.help || opt.h) { console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0].replace(/^[\s\S]*?\/\*/, '')); process.exit(0); }
const Z = +opt.z || 1.5;
const STATS = ['hp', 'atk', 'def', 'spd'];
const H = load({ html: opt.html });
const C = H.G.CHARACTERS, SK = H.G.SKILLS;

const mean = a => a.reduce((x, y) => x + y, 0) / a.length;
const sd = a => { const m = mean(a); return Math.sqrt(mean(a.map(x => (x - m) ** 2))) || 1; };
const pad = (s, n) => String(s).padEnd(n), lpad = (s, n) => String(s).padStart(n);
const sgn = (v, d = 0) => (v >= 0 ? '+' : '') + v.toFixed(d);

const roles = [...new Set(C.map(c => c.role))];
const R = {}; roles.forEach(r => { const m = C.filter(c => c.role === r); R[r] = { n: m.length }; STATS.forEach(s => { const v = m.map(c => +c[s]); R[r][s] = { mean: mean(v), sd: sd(v) }; }); });
const all = {}; STATS.forEach(s => { const v = C.map(c => +c[s]); all[s] = { mean: mean(v), sd: sd(v) }; });

/* a fighter's profile = z-score of each stat against ALL fighters; a role's centroid = the average profile of its fighters */
const prof = c => STATS.map(s => (c[s] - all[s].mean) / all[s].sd);
const cent = {}; roles.forEach(r => { const ps = C.filter(c => c.role === r).map(prof); cent[r] = STATS.map((_, i) => mean(ps.map(p => p[i]))); });
const dist = (a, b) => Math.sqrt(a.reduce((t, x, i) => t + (x - b[i]) ** 2, 0));

const rows = C.map(c => {
  const z = {}, pc = {}; STATS.forEach(s => { z[s] = (c[s] - R[c.role][s].mean) / R[c.role][s].sd; pc[s] = 100 * (c[s] / R[c.role][s].mean - 1); });
  const p = prof(c); const d = {}; roles.forEach(r => d[r] = dist(p, cent[r]));
  const near = roles.slice().sort((a, b) => d[a] - d[b])[0];
  const out = STATS.filter(s => Math.abs(z[s]) >= Z).map(s => `${s.toUpperCase()} ${z[s] > 0 ? 'high' : 'low'}`);
  const power = mean(STATS.map(s => (c[s] - all[s].mean) / all[s].sd));   /* rough overall power: average z across the four stats */
  const moves = (c.skills || []).length, heals = (c.skills || []).filter(k => SK[k] && SK[k].target === 'ally' && /heal|restor|mend/i.test(SK[k].desc || '')).length;
  return { c, z, pc, near, mismatch: near !== c.role && d[near] < d[c.role] - 0.25, out, power, moves, heals, dRole: d[c.role], dNear: d[near] };
});

const want = opt.role && opt.role !== true ? String(opt.role).toLowerCase() : null;
console.log(`\nFAL-125 role audit  |  ${H.htmlPath}\n${C.length} fighters, ${roles.length} roles. Outlier = a stat at least ${Z} standard deviations from the role average.\n`);

console.log('ROLE AVERAGES (mean, with the spread in brackets)');
console.log(pad('Role', 8) + pad('Count', 7) + STATS.map(s => lpad(s.toUpperCase(), 14)).join(''));
roles.forEach(r => console.log(pad(r, 8) + pad(R[r].n, 7) + STATS.map(s => lpad(R[r][s].mean.toFixed(1) + ' (±' + R[r][s].sd.toFixed(1) + ')', 14)).join('')));
console.log('\nALL FIGHTERS  ' + STATS.map(s => s.toUpperCase() + ' ' + all[s].mean.toFixed(1)).join('   ') + '\n');

roles.filter(r => !want || r.toLowerCase() === want).forEach(r => {
  console.log(`=== ${r.toUpperCase()}  (${R[r].n}) ===   columns show the stat, then how far it is from the ${r} average in %`);
  console.log(pad('Fighter', 19) + pad('Type', 8) + STATS.map(s => lpad(s.toUpperCase(), 11)).join('') + lpad('Power', 7) + '  Notes');
  rows.filter(x => x.c.role === r).sort((a, b) => b.power - a.power).forEach(x => {
    const cell = s => lpad(`${x.c[s]} ${sgn(x.pc[s])}%`, 11);
    const notes = [];
    if (x.out.length) notes.push('OUTLIER: ' + x.out.join(', '));
    if (x.mismatch) notes.push(`looks like a ${x.near.toUpperCase()} by stats`);
    if (r === 'Healer' && x.heals === 0) notes.push('no skill text mentions heal/restore/mend (check by hand)');
    console.log(pad(x.c.name, 19) + pad(x.c.type, 8) + STATS.map(cell).join('') + lpad(sgn(x.power, 2), 7) + '  ' + notes.join(' | '));
  });
  console.log('');
});

const flagged = rows.filter(x => x.out.length || x.mismatch);
console.log(`SUMMARY: ${flagged.length} of ${C.length} fighters flagged.`);
const mm = rows.filter(x => x.mismatch).sort((a, b) => (b.dRole - b.dNear) - (a.dRole - a.dNear));
if (mm.length) { console.log('\nWHO MAY NEED A ROLE REMAKE (stat shape is closer to another role; strongest cases first):'); mm.forEach(x => console.log(`  ${pad(x.c.name, 19)} tagged ${pad(x.c.role, 7)} -> stats read as ${x.near}   (distance ${x.dRole.toFixed(2)} vs ${x.dNear.toFixed(2)})`)); }
else console.log('\nROLE MISMATCH CHECK: every fighter\'s stat shape is still closest to the role they are tagged with.');
const hi = rows.slice().sort((a, b) => b.power - a.power);
console.log('\nHIGHEST RAW STATS (overall power, average z across HP/ATK/DEF/SPD):  ' + hi.slice(0, 5).map(x => `${x.c.name} ${sgn(x.power, 2)}`).join(', '));
console.log('LOWEST RAW STATS:  ' + hi.slice(-5).reverse().map(x => `${x.c.name} ${sgn(x.power, 2)}`).join(', '));
const noMove = rows.filter(x => x.moves < 3 || x.moves > 4); if (noMove.length) console.log('\nMOVE COUNT: ' + noMove.map(x => `${x.c.name} has ${x.moves}`).join(', ') + '  (project rule is 3-4)');
console.log('\nNote: stats are only half of a role. Passives, moves and meters matter too, so run fal125_sim.js to see how each fighter actually performs.\n');

if (opt.out) {
  const esc = v => /[",\n]/.test(String(v)) ? '"' + String(v).replace(/"/g, '""') + '"' : String(v);
  const w = (n, h, r) => { fs.writeFileSync(n, [h.join(','), ...r.map(a => a.map(esc).join(','))].join('\n')); console.log('wrote ' + n); };
  w(opt.out + '_fighters.csv', ['fighter', 'key', 'role', 'type', 'hp', 'atk', 'def', 'spd', 'hp_vs_role_pct', 'atk_vs_role_pct', 'def_vs_role_pct', 'spd_vs_role_pct', 'power_z', 'outliers', 'nearest_role_by_stats', 'role_mismatch', 'moves'],
    rows.map(x => [x.c.name, x.c.key, x.c.role, x.c.type, x.c.hp, x.c.atk, x.c.def, x.c.spd, ...STATS.map(s => x.pc[s].toFixed(1)), x.power.toFixed(3), x.out.join('; '), x.near, x.mismatch ? 'yes' : '', x.moves]));
  w(opt.out + '_roles.csv', ['role', 'count', ...STATS.flatMap(s => [s + '_mean', s + '_sd'])], roles.map(r => [r, R[r].n, ...STATS.flatMap(s => [R[r][s].mean.toFixed(2), R[r][s].sd.toFixed(2)])]));
}
