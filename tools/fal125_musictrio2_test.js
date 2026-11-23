#!/usr/bin/env node
'use strict';
/* fal125_musictrio2_test.js: checks Music trio.v2, V298: DethTech (0137, Damage), izumi is dead (0138, Healer) and Anhero (0139, Tank).
   USAGE: node fal125_musictrio2_test.js [--html game.html] [--runs 2] */
const vm = require('vm'); const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), i0 = a.indexOf('--html'), html = findHtml(i0 >= 0 ? a[i0 + 1] : null), i1 = a.indexOf('--runs'), runs = i1 >= 0 ? +a[i1 + 1] : 2;
let bad = 0; const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => {
  const H = load({ html, seed: 4 }), G = H.G, T = G.RXT, run = c => vm.runInContext(c, H.sb);
  const has = (u, k) => u.st.some(s => s.k === k), S = G.SKILLS;
  const ek = Object.keys(G.ENEMIES).find(k => !G.ENEMIES[k].boss);
  const mkE = (hp) => { const f = T.makeUnit(Object.assign({}, G.ENEMIES[ek]), 'enemy'); f.boss = false; f.maxHp = f.hp = hp || 9000; f.atk = 30; return f; };
  const mk = k => T.makeUnit(G.CHARACTERS_BY(k), 'party');
  run('RUN = newRun(); round = 1');
  const want = [['dethtech', 'Damage', '0137', 'Burst', 'Virtual'], ['izumi', 'Healer', '0138', 'Medic', 'Anomaly'], ['anhero', 'Tank', '0139', 'Protector', 'Human']];
  want.forEach(([k, r, id, b, ty]) => { const c = G.CHARACTERS_BY(k); ok(c && c.role === r && c.id === id && c.build === b && c.type === ty && c.skills.every(s => S[s]) && S['ult_' + k], `${c && c.name}: ${r}, ${id}, ${b}, ${ty}, 3 moves and an ultimate`); });
  const ids = G.CHARACTERS.map(x => x.id); ok(new Set(ids).size === ids.length, 'every fighter has a different number');
  ok(want.every(([k]) => run(`IDENT.${k} && PARTY_QUIPS.${k}.length === 2 && STORY_EXTRA.${k} && RL.${k}.length === 2 && ARC_LORE.${k}.length === 6 && MAST_TEXT.${k} && SKIN_DEFS.${k}.length === 2`)), 'identity, quips, story lines, recruit scenes, Archive, Mastery and 2 skins for all three');
  ok(['dth', 'izm', 'anh'].every(p => [1, 2, 3].every(n => run(`!!CHIP['${p}${n}']`))), 'nine chips are defined');
  ok(run("['dtPara','anValor','izSaved'].every(k => COUNTER_FIELDS.includes(k))"), 'Paranoia, Valor and Already Dead reset every wave');
  /* DETHTECH */
  const d = mk('dethtech'), al = mk('sna'), e1 = mkE(), e2 = mkE(); T.setSides([d, al], [e1, e2]); T.setCur(d);
  S.dtrot.run(d, e1); ok(has(e1, 'dtrot') && e1.hp < 9000, 'Brainrot hits and Rots the enemy');
  const rotDmg = () => { const q = mk('sna'), w = mkE(); T.setSides([q], [w]); T.setCur(w); let s = 0; for (let i = 0; i < 20; i++) { q.hp = q.maxHp; T.hit(w, q, 1); s += q.maxHp - q.hp; } return s; };
  const plain = rotDmg(); const q2 = mk('sna'), w2 = mkE(); T.setSides([q2], [w2]); T.addStatus(w2, 'dtrot', 99, .15); T.setCur(w2); let rs = 0; for (let i = 0; i < 20; i++) { q2.hp = q2.maxHp; T.hit(w2, q2, 1); rs += q2.maxHp - q2.hp; }
  ok(rs < plain * .95, 'a Rotted enemy deals less damage (' + rs + ' vs ' + plain + ')');
  T.setSides([d, al], [e1, e2]); T.setCur(d); T.addStatus(e2, 'dtrot', 2, .15); e1.hp = e2.hp = 9000; S.dtpixel.run(d, e1); ok(e1.hp < 9000 && e2.hp < 9000, 'Dead Pixel hits the target and every other Rotted enemy');
  ok(!!S.dtdoa.can(d), 'D.O.A. needs Paranoia');
  const de = mkE(); de.atk = 30; T.setSides([d, al], [de]); T.setCur(de); d.dtPara = 0; T.hit(de, d, .2); d.hp = d.maxHp; T.hit(de, al, .2); al.hp = al.maxHp; ok(d.dtPara === 2, 'Paranoia grows when he or the ally beside him is hit (' + d.dtPara + ')');
  const doa = n => { const q = mk('dethtech'), w = mkE(); q.atk = 20; T.setSides([q, al], [w]); T.setCur(q); let s = 0; for (let i = 0; i < 20; i++) { q.dtPara = n; w.hp = 9000; S.dtdoa.run(q, w); s += 9000 - w.hp; } return s; };
  ok(doa(5) > doa(2) * 1.4, 'more Paranoia, harder D.O.A. (' + doa(5) + ' vs ' + doa(2) + ')');
  const dk = mk('dethtech'), small = mkE(5); T.setSides([dk, al], [small]); T.setCur(dk); dk.dtPara = 4; S.dtdoa.run(dk, small); ok(!small.alive && dk.dtPara === 2, 'a D.O.A. kill keeps half the Paranoia');
  const du = mk('dethtech'), u1 = mkE(), u2 = mkE(); T.setSides([du, al], [u1, u2]); T.setCur(du); S.ult_dethtech.run(du); ok(u1.hp < 9000 && has(u2, 'dtrot') && du.dtPara === 5, 'Blue Screen: every enemy hit and Rotted, full Paranoia');
  /* IZUMI IS DEAD */
  const z = mk('izumi'), za = mk('sna'), zb = mk('fuja'), ze = mkE(); T.setSides([z, za, zb], [ze]); T.setCur(z);
  za.hp = Math.round(za.maxHp * .4); S.izpin.run(z, ze); ok(ze.hp < 9000 && has(za, 'izfly'), 'Pin hits and a Butterfly lands on the most hurt ally');
  zb.hp = Math.round(zb.maxHp * .5); const zb0 = zb.hp; S.izwings.run(z, zb); ok(zb.hp > zb0 && has(zb, 'izfly'), 'Open Wings heals and gives a Butterfly');
  za.hp = zb.hp = Math.round(za.maxHp * .5); S.izswarm.run(z); ok([z, za, zb].every(p => has(p, 'izfly')), 'Fill the Sky gives everyone a Butterfly');
    const zz = mk('izumi'), zp = mk('sna'), zq = mkE(); zq.atk = 30; T.setSides([zz, zp], [zq]); T.addStatus(zp, 'izfly', 3, .05); zp.hp = Math.round(zp.maxHp * .5); const zp0 = zp.hp; zz.hp = 3; T.setCur(zq); T.hit(zq, zz, 5);
  ok(zz.alive && zz.hp < zz.maxHp * .3 && zz.izSaved === 1 && zp.hp > zp0, 'Already Dead: a lethal hit leaves her at 1 HP and the Butterflies burst into a heal');
  zz.hp = 3; T.hit(zq, zz, 5); ok(!zz.alive, 'but only once per wave');
  const zu = mk('izumi'), zv = mk('sna'); zv.hp = Math.round(zv.maxHp * .4); T.addStatus(zv, 'slow', 2, .3); T.setSides([zu, zv], [mkE()]); T.setCur(zu); const zv0 = zv.hp; S.ult_izumi.run(zu); ok(zv.hp > zv0 && !has(zv, 'slow') && has(zv, 'izfly'), 'Butterflies Fill the Sky: heals, cleanses and gives Butterflies');
  /* ANHERO */
  const an = mk('anhero'), aa = mk('sna'), ab = mk('fuja'), ae = mkE(); ae.atk = 30; T.setSides([an, aa, ab], [ae]); T.setCur(an);
  S.anlid.run(an, ae); ok(ae.hp < 9000 && has(an, 'taunt'), 'Lid Bash hits and Taunts');
  run('round = 7'); aa.hp = Math.round(aa.maxHp * .4); const aa0 = aa.hp, an0 = an.hp; T.setCur(ae); T.hit(ae, aa, 1); ok(aa.hp === aa0 && an.hp < an0 && an.anValor === 1, 'Stand In: he takes the hit for a hurt ally, and gains Valor');
  const aa1 = aa.hp; T.hit(ae, aa, 1); ok(aa.hp < aa1, 'Stand In works once per round');
  run('round = 8'); ab.hp = ab.maxHp; T.setCur(an); S.annot.run(an, ab); ok(has(ab, 'annot') && has(an, 'defUp'), 'Not Today guards an ally and gives him DEF');
  const ab0 = ab.hp, an1 = an.hp; T.setCur(ae); T.hit(ae, ab, 1); T.hit(ae, ab, 1); ok(ab.hp === ab0 && an.hp < an1, 'a guarded ally takes no single-target hits: they go to Anhero');
  const al2 = mk('anhero'), ma = mk('sna'), mb = mk('fuja'); T.setSides([al2, ma, mb], [mkE()]); al2.anValor = 4; al2.hp = Math.round(al2.maxHp * .4); const an2 = al2.hp; T.setCur(al2); S.anline.run(al2); ok(al2.hp > an2 && al2.anValor === 0 && has(ma, 'defUp') && has(mb, 'defUp'), 'Last Line spends Valor, heals him and gives the team DEF');
  const vt = v => { const q = mk('anhero'), w = mkE(); T.setSides([q], [w]); T.setCur(w); let s = 0; for (let i = 0; i < 20; i++) { q.anValor = v; q.hp = q.maxHp; T.hit(w, q, 1); s += q.maxHp - q.hp; } return s; };
  ok(vt(5) < vt(0), 'Valor makes him harder to hurt (' + vt(5) + ' vs ' + vt(0) + ')');
  const ah = mk('anhero'), ax = mk('sna'); T.setSides([ah, ax], [mkE()]); T.setCur(ah); S.ult_anhero.run(ah); ok(has(ax, 'annot') && has(ah, 'guard') && ah.anValor === 5, 'Hero Time: guards everyone, Guard and full Valor');
  /* the trio bond */
  const solo = () => { const q = mk('dethtech'), w = mkE(); q.atk = 20; T.setSides([q, mk('sna')], [w]); T.setCur(q); let s = 0; for (let i = 0; i < 30; i++) { w.hp = 9000; T.hit(q, w, 1); s += 9000 - w.hp; } return s; };
  const duo = () => { const q = mk('dethtech'), w = mkE(); q.atk = 20; T.setSides([q, mk('izumi')], [w]); T.setCur(q); let s = 0; for (let i = 0; i < 30; i++) { w.hp = 9000; T.hit(q, w, 1); s += 9000 - w.hp; } return s; };
  ok(duo() > solo(), 'Music trio.v2: they hit harder together (' + duo() + ' vs ' + solo() + ')');
  /* auto-play */
  let errs = 0; const P = ['dethtech', 'izumi', 'anhero', 'fuja'], xpMap = {}; P.forEach(k => xpMap[k] = 600);
  for (let i = 0; i < runs; i++) { H.reseed(9800 + i); try { await H.run(P, { world:0, runlen:'world', diff:'Normal', xp:0, xpMap, chips:[], smart:true, story:true, wave:1, foes:[] }); } catch (e2) { errs++; console.log('  run error: ' + String(e2.message).slice(0, 160)); } }
  ok(!errs, runs + ' auto-played full runs with all three finish with no errors');
  console.log(bad ? `\n${bad} problem(s).` : '\nMusic trio.v2 (DethTech, izumi is dead, Anhero) OK.'); process.exit(bad ? 1 : 0);
})();
