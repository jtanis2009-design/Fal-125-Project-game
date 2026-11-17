#!/usr/bin/env node
'use strict';
/* fal125_caspic_test.js: checks Caspic (V248): Ability Canceller (bad statuses aimed at him never land), Disks, Cancel Wounds, Hard Cancel, Null Field and its Disk Ward.
   USAGE: node fal125_caspic_test.js [--html game.html] */
const vm = require('vm'); const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), i0 = a.indexOf('--html'), html = findHtml(i0 >= 0 ? a[i0 + 1] : null);
let bad = 0; const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => {
  const H = load({ html, seed: 4 }), G = H.G, T = G.RXT, run = c => vm.runInContext(c, H.sb);
  const has = (u, k) => u.st.some(s => s.k === k), S = G.SKILLS;
  const ek = Object.keys(G.ENEMIES).find(k => !G.ENEMIES[k].boss);
  const mkE = hp => { const f = T.makeUnit(Object.assign({}, G.ENEMIES[ek], { key: ek }), 'enemy'); f.boss = false; f.maxHp = f.hp = hp || 9000; f.atk = 20; return f; };
  const mk = k => T.makeUnit(G.CHARACTERS_BY(k), 'party');
  const as = (u, k, t, v) => run('addStatus')(u, k, t, v);
  run('RUN = newRun()');
  const c = G.CHARACTERS_BY('caspic'); ok(c && c.role === 'Healer' && c.id === '0105' && c.build === 'Medic', 'Caspic exists: Healer, 0105, build Canceller');
  ok(c.skills.join() === 'cpheal,cpcancel,cpfield', 'three moves: Cancel Wounds, Hard Cancel, Null Field');
  const ids = G.CHARACTERS.map(x => x.id); ok(new Set(ids).size === ids.length, 'every fighter has a different number');
  let cp = mk('caspic'), tk = mk('sna'), dd = mk('snavo'), e1 = mkE(), e2 = mkE();
  T.setSides([cp, tk, dd], [e1, e2]);
  /* the passive */
  T.setCur(e1); as(cp, 'stun', 1, 1); as(cp, 'venom', 2, .05);
  ok(!has(cp, 'stun') && !has(cp, 'venom') && cp.cpDisk === 2, 'Ability Canceller: bad statuses an enemy puts on him never land, and each one is a Disk');
  as(tk, 'slow', 2, .3); ok(has(tk, 'slow'), 'his allies are not protected by the passive alone');
  T.setCur(cp); as(cp, 'atkUp', 2, .2); ok(has(cp, 'atkUp'), 'good statuses still land on him');
  /* Cancel Wounds */
  tk.hp = Math.round(tk.maxHp * .4); T.setCur(e1); as(tk, 'burn', 3, .05); as(tk, 'mark', 2, 1); T.setCur(cp);
  const h0 = tk.hp, d0 = cp.cpDisk; S.cpheal.run(cp, tk);
  ok(!has(tk, 'slow') && !has(tk, 'burn') && !has(tk, 'mark'), 'Cancel Wounds removes every bad status');
  ok(tk.hp - h0 >= Math.round(tk.maxHp * .33), 'and heals 20% plus 5% for each one removed (' + (tk.hp - h0) + ' HP)');
  ok(cp.cpDisk === Math.min(6, d0 + 3), 'and every status removed is a Disk (' + cp.cpDisk + ')');
  /* Hard Cancel */
  cp.cpDisk = 0; S.cpcancel.run(cp, e1); ok(has(e1, 'cpnull') && e1.hp < 9000, 'Hard Cancel hits and Cancels the enemy');
  T.setCur(e1); as(dd, 'stun', 1, 1); as(e1, 'atkUp', 2, .3); as(e2, 'guard', 1, 1);
  ok(!has(dd, 'stun') && !has(e1, 'atkUp') && !has(e2, 'guard') && cp.cpDisk === 3, 'a Cancelled enemy can not put statuses on your team or buff its own side (+1 Disk each)');
  T.setCur(e2); as(dd, 'stun', 1, 1); ok(has(dd, 'stun'), 'other enemies are not Cancelled');
  run("tickStatuses")(e1); ok(!has(e1, 'cpnull'), 'Cancelled ends after that enemy\'s turn');
  /* Null Field */
  T.setCur(e2); as(tk, 'slow', 2, .3); as(dd, 'bleed', 2, .05); cp.cpDisk = 5; tk.hp = 50; dd.hp = 50; T.setCur(cp);
  S.cpfield.run(cp);
  ok(!has(dd, 'stun') && !has(dd, 'bleed') && !has(tk, 'slow'), 'Null Field clears every bad status from the team');
  ok(tk.hp > 50 + tk.maxHp * .2 && has(tk, 'cpward') && has(dd, 'cpward') && has(cp, 'cpward'), 'heals everyone (10% + 3% per Disk spent) and Wards them');
  ok(cp.cpDisk === 3, 'it spends the Disks, and the statuses it removes pay back (' + cp.cpDisk + ')');
  T.setCur(e2); as(tk, 'stun', 1, 1); ok(!has(tk, 'stun') && !has(tk, 'cpward'), 'a Disk Ward cancels the next bad status, then it is gone');
  as(tk, 'stun', 1, 1); ok(has(tk, 'stun'), 'only one');
  /* chips */
  const c2 = mk('caspic'), x1 = mkE(), x2 = mkE(); c2.cpAll = 1; T.setSides([c2, tk], [x1, x2]); T.setCur(c2); S.cpcancel.run(c2, x1);
  ok(has(x1, 'cpnull') && has(x2, 'cpnull') && x2.hp === 9000, 'Hard Reset: Hard Cancel Cancels every enemy (only the target is hit)');
  ok(run("COUNTER_FIELDS.includes('cpDisk')"), 'Disks reset every wave');
  /* the ultimate */
  const c3 = mk('caspic'), y1 = mkE(); T.setSides([c3, tk], [y1]); T.setCur(y1); as(tk, 'venom', 2, .05); y1.st.push({ k:'atkUp', t:3, v:.3 }); tk.hp = 50; T.setCur(c3);
  S.ult_caspic.run(c3, null);
  ok(!has(tk, 'venom') && tk.hp > 50 && has(tk, 'cpward') && !has(y1, 'atkUp') && has(y1, 'cpnull'), 'Total Cancel: cleans and heals the team, Wards them, strips enemy buffs and Cancels them');
  console.log(bad ? `\n${bad} problem(s).` : '\nCaspic OK.'); process.exit(bad ? 1 : 0);
})();
