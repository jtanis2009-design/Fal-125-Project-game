#!/usr/bin/env node
'use strict';
/* fal125_shopkeeper_test.js: checks the V265 shop revamp data: every shopkeeper pose has a sprite, every line set is filled in and unique,
   names in lines get filled, and the Forge still works with the new lines. USAGE: node fal125_shopkeeper_test.js [--html game.html] */
const vm = require('vm'); const fs = require('fs'), path = require('path'); const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), i0 = a.indexOf('--html'), html = findHtml(i0 >= 0 ? a[i0 + 1] : null);
let bad = 0; const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => {
  const H = load({ html, seed: 4 }), G = H.G, T = G.RXT, run = c => vm.runInContext(c, H.sb);
  const KP = run('KP'), L = run('KP_LINES'), E = k => run('EMBED')[k];
  let n = 0, miss = [];
  for (const who in KP.poses) for (const p of KP.poses[who]) { n++; const k = 'kp_' + who + '_' + p; if (!E(k) || !fs.existsSync(path.join(__dirname, '..', 'sprites', k + '.png'))) miss.push(k); }
  ok(n === 14 && !miss.length, n + ' shopkeeper poses, each with an embedded sprite and a PNG' + (miss.length ? ' (missing: ' + miss.join(', ') + ')' : ''));
  const flat = o => Array.isArray(o) ? o : Object.values(o).flatMap(flat);
  for (const set of ['vendor', 'rival', 'byte', 'outposter']) { const all = flat(L[set]); ok(all.length >= 8 && all.every(t => typeof t === 'string' && t.length > 8) && new Set(all).size === all.length, set + ': ' + all.length + ' lines, none empty, none repeated'); }
  for (const k of ['enter', 'idle', 'hover', 'poor', 'full', 'buy', 'buyBig', 'reroll', 'sell']) for (const set of ['vendor', 'rival', 'byte']) if (!L[set][k]) { ok(false, set + ' has no "' + k + '" lines'); }
  ok(['Common', 'Rare', 'Epic', 'Legendary', 'Mythic', 'Divine', 'bit', 'byte', 'who', 'supply', 'sold'].every(k => (L.vendor.hover[k] || []).length), 'the Vendor has something to say about every kind of item');
  run('KPS.set = "vendor"'); const w = run('kpLine')('hover', 'who', { who:'Ano' }); ok(/Ano/.test(w) && !/\{/.test(w), 'fighter names are filled into lines ("' + w + '")');
  ok(run('kpLine')('enter', 'supply').length > 0 && run('kpLine')('nothing') === '', 'lines are picked by situation; an unknown situation says nothing');
  run('RUN = newRun()'); const mk = k => T.makeUnit(G.CHARACTERS_BY(k), 'party'); const v = mk('sna'), u = mk('fuja'); T.setSides([v, u], []); let er = '';
  for (let i = 0; i < 15; i++) { v.owW = u.owW = undefined; try { await H.drive(run('owVisit()')); } catch (e) { er = String(e); } } ok(!er, 'the Forge visit runs with the new lines' + (er ? ' ' + er : ''));
  ok(typeof run('openShop') === 'function' && typeof run('kpOpen') === 'function', 'the shop screen and the keeper panel exist');
  console.log(bad ? `\n${bad} problem(s).` : '\nShopkeepers OK.'); process.exit(bad ? 1 : 0);
})();
