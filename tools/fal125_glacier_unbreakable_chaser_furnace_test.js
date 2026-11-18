#!/usr/bin/env node
'use strict';
/* fal125_glacier_unbreakable_chaser_furnace_test.js: checks Glacier (0129, Healer), Unbreakable (0130, Tank), Chaser (0131, Damage) and Furnace (0132, Healer), V283.
   USAGE: node fal125_glacier_unbreakable_chaser_furnace_test.js [--html game.html] [--runs 2] */
const vm = require('vm'); const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), i0 = a.indexOf('--html'), html = findHtml(i0 >= 0 ? a[i0 + 1] : null), i1 = a.indexOf('--runs'), runs = i1 >= 0 ? +a[i1 + 1] : 2;
let bad = 0; const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => {
  const H = load({ html, seed: 4 }), G = H.G, T = G.RXT, run = c => vm.runInContext(c, H.sb);
  const has = (u, k) => u.st.some(s => s.k === k), S = G.SKILLS;
  const ek = Object.keys(G.ENEMIES).find(k => !G.ENEMIES[k].boss);
  const mkE = (hp, spd) => { const f = T.makeUnit(Object.assign({}, G.ENEMIES[ek], { key: ek }), 'enemy'); f.boss = false; f.maxHp = f.hp = hp || 9000; f.atk = 30; if (spd) f.spd = spd; return f; };
  const mk = k => T.makeUnit(G.CHARACTERS_BY(k), 'party');
  run('RUN = newRun()');
  const want = [['glacier', 'Healer', '0129', 'Debuffer'], ['unbreakable', 'Tank', '0130', 'Guardian'], ['chaser', 'Damage', '0131', 'Charger'], ['furnace', 'Healer', '0132', 'Amplifier']];
  want.forEach(([k, r, id, b]) => { const c = G.CHARACTERS_BY(k); ok(c && c.role === r && c.id === id && c.build === b && c.skills.every(s => S[s]) && S['ult_' + k], `${c && c.name}: ${r}, ${id}, ${b}, 3 moves and an ultimate`); });
  const ids = G.CHARACTERS.map(x => x.id); ok(new Set(ids).size === ids.length, 'every fighter has a different number');
  ok(want.every(([k]) => run(`IDENT.${k} && PARTY_QUIPS.${k}.length === 2 && STORY_EXTRA.${k} && RL.${k}.length === 2 && ARC_LORE.${k}.length === 6 && MAST_TEXT.${k} && SKIN_DEFS.${k}.length === 2`)), 'identity, quips, story lines, recruit scenes, Archive, Mastery and 2 skins for all four');
  ok(['glc', 'ubk', 'chs', 'fnc'].every(p => [1, 2, 3].every(n => run(`!!CHIP['${p}${n}']`))), 'twelve chips are defined');
  /* GLACIER */
  const g = mk('glacier'), ally = mk('sna'), e1 = mkE(), e2 = mkE(); T.setSides([g, ally], [e1, e2]); T.setCur(g);
  run('V17.roundStart()'); ok(has(e1, 'slow') && has(e2, 'slow'), 'Cold Aura: every enemy is Slowed at the start of the round');
  const e3 = mkE(); T.addStatus(e3, 'slow', 2, .5); T.setSides([g, ally], [e3]); run('V17.roundStart()'); ok(e3.st.filter(s => s.k === 'slow').length === 1 && e3.st.find(s => s.k === 'slow').v === .5, 'and it never stacks on top of a stronger slow');
  ally.hp = Math.round(ally.maxHp * .4); T.addStatus(ally, 'bleed', 3, .04); const hp0 = ally.hp; S.glcfrost.run(g, ally); ok(ally.hp > hp0 + ally.maxHp * .15 && !has(ally, 'bleed') && has(ally, 'guard'), 'Frozen Touch heals, stops bleeding and gives Guard');
  T.setSides([g, ally], [e1]); e1.st = []; S.glcbeam.run(g, e1); ok(has(e1, 'slow') && !has(e1, 'stun'), 'Ice Beam Slows a fresh target');
  S.glcbeam.run(g, e1); ok(has(e1, 'stun'), 'and freezes one that was already Slowed (Stunned)');
  const g2 = mk('glacier'), f2 = mkE(), f3 = mkE(); T.setSides([g2, ally], [f2, f3]); ally.hp = Math.round(ally.maxHp * .5); const h2 = ally.hp; S.glcdeep.run(g2); ok(has(f2, 'slow') && has(f3, 'slow') && ally.hp > h2, 'Deep Freeze slows every enemy and heals the team');
  /* UNBREAKABLE */
  const u = mk('unbreakable'), ue = mkE(); T.setSides([u, ally], [ue]); T.setCur(ue); const dm = run('damage');
  u.hp = u.maxHp; dm(u, Math.round(u.maxHp * .4), 'impact'); ok(u.alive && u.maxHp - u.hp === Math.round(u.maxHp * .2), 'no single hit takes more than 20% of his max HP: a 40% hit only does ' + (u.maxHp - u.hp) + ' of ' + u.maxHp);
  u.hp = u.maxHp; dm(u, Math.round(u.maxHp * .1), 'impact'); ok(u.maxHp - u.hp === Math.round(u.maxHp * .1), 'smaller hits land as normal (10% stays 10%)');
  u.hp = u.maxHp; dm(u, Math.round(u.maxHp * .8), 'impact'); ok(u.maxHp - u.hp >= Math.round(u.maxHp * .79), 'but a nuke (50% of his max HP or more) lands in full');
  u.hp = u.maxHp; T.setCur(u); S.ubstar.run(u, ue); ok(ue.hp < 9000 && has(u, 'taunt'), 'Black Star hits and Taunts');
  S.ubstand.run(u); ok(has(u, 'taunt') && has(ally, 'defUp'), 'Stand Firm Taunts and gives the team DEF');
  u.hp = Math.round(u.maxHp * .3); T.addStatus(u, 'slow', 2, .3); S.ubmend.run(u); ok(u.hp > u.maxHp * .5 && !has(u, 'slow'), 'Mend heals him and wipes his bad statuses');
  const u2 = mk('unbreakable'), x2 = mkE(), x3 = mkE(); T.setSides([u2, ally], [x2, x3]); T.setCur(u2); S.ult_unbreakable.run(u2); ok(x2.hp < 9000 && x3.hp < 9000 && u2.ubGod === 2, 'Turn Evil: every enemy hit, and he takes no damage for 2 turns');
  const bx = mkE(); bx.atk = 9999; T.setSides([u2, ally], [bx]); T.setCur(bx); u2.hp = u2.maxHp; T.hit(bx, u2, 1); ok(u2.hp === u2.maxHp, 'and while it lasts nothing touches him');
  /* CHASER */
  const c = mk('chaser'), ce = mkE(9000, 5); T.setSides([c, ally], [ce]); T.setCur(c);
  S.chsslash.run(c, ce); ok(c.chsSpeed === 1 && has(c, 'haste'), 'Chaser\'s Slash builds Speed and he gets faster');
  S.chsrace.run(c, ce); ok(c.chsSpeed === 3 && has(ce, 'mark'), 'Race builds 2 Speed (stops at 3) and Marks the target');
  S.chsslash.run(c, ce); ok(c.chsSpeed === 3, 'Speed stops at 3');
  const dmg = sp => { const q = mk('chaser'), w = mkE(9000, 5); q.atk = 20; q.chsSpeed = sp; T.setSides([q, ally], [w]); T.setCur(q); let s = 0; for (let i = 0; i < 40; i++) { w.hp = 9000; T.hit(q, w, 1); s += 9000 - w.hp; } return s; };
  ok(dmg(3) > dmg(0) * 1.18, 'more Speed means more damage (' + dmg(3) + ' vs ' + dmg(0) + ')');
  const ang = sp => { const q = mk('chaser'), w = mkE(9000, sp); q.atk = 20; T.setSides([q, ally], [w]); T.setCur(q); let s = 0; for (let i = 0; i < 40; i++) { w.hp = 9000; T.hit(q, w, 1); s += 9000 - w.hp; } return s; };
  ok(ang(40) > ang(1) * 1.1, 'he hits an enemy that is faster than him harder (' + ang(40) + ' vs ' + ang(1) + ')');
  const cr = mk('chaser'); T.setSides([cr, ally], [mkE()]); T.setCur(cr); cr.chsSpeed = 3; run('chsSet')(cr, 3); const h3 = cr.hp; T.addStatus(cr, 'stun', 1, 1); ok(cr.chsSpeed === 0 && cr.hp < h3, 'a Stun makes him crash: Speed lost and he takes damage');
  const ch = mk('chaser'), th = mkE(), oh = mkE(); th.type = 'Human'; oh.type = 'Demon'; T.setSides([ch, ally], [th, oh]); T.setCur(ch); S.chsrun.run(ch); ok(th.hp < oh.hp && ch.chsSpeed === 1, 'Run Through hits everyone, a Human takes more, and it builds Speed');
  ok(run("COUNTER_FIELDS.includes('chsSpeed')"), 'Speed resets every wave');
  const c4 = mk('chaser'), r1 = mkE(), r2 = mkE(); T.setSides([c4, ally], [r1, r2]); T.setCur(c4); S.ult_chaser.run(c4); ok(c4.chsSpeed === 3 && r1.hp < 9000, 'Photo Finish: full Speed and through every enemy');
  /* FURNACE */
  const fu = mk('furnace'), fa = mk('sna'), fe1 = mkE(), fe2 = mkE(); T.setSides([fu, fa], [fe1, fe2]); T.setCur(fu);
  fa.hp = Math.round(fa.maxHp * .4); T.addStatus(fa, 'bleed', 3, .04); const fh = fa.hp; S.fncauter.run(fu, fa); ok(fa.hp > fh + fa.maxHp * .15 && !has(fa, 'bleed') && (has(fe1, 'scorch') || has(fe2, 'scorch')), 'Cauterise heals, stops bleeding and sets an enemy on fire');
  fa.hp = Math.round(fa.maxHp * .5); const fh2 = fa.hp; S.fnflare.run(fu); ok(fa.hp > fh2 && has(fa, 'atkUp') && has(fe1, 'scorch') && has(fe2, 'scorch'), 'Flare Up heals and charges the team and sets every enemy on fire');
  fu.hp = fu.maxHp; fa.hp = Math.round(fa.maxHp * .5); const fh3 = fa.hp; S.fnblast.run(fu); ok(fe1.hp < 9000 && fe2.hp < 9000 && fa.hp > fh3 && fu.hp < fu.maxHp, 'Blast Furnace burns every enemy, heals the team, and rips his own skin');
  fu.hp = 5; S.fnblast.run(fu); ok(fu.alive && fu.hp >= 1, 'but it never kills him');
  const sk = skin => { const q = mk('furnace'), x = mkE(); x.atk = 30; if (!skin) q.key = 'furnace_noskin'; T.setSides([q, fa], [x]); T.setCur(x); let s = 0; for (let i = 0; i < 60; i++) { q.alive = true; q.hp = q.maxHp; T.hit(x, q, 1); s += q.maxHp - q.hp; } return s; };
  ok(sk(true) > sk(false) * 1.08, 'he has no skin: he takes about 15% more damage (' + sk(true) + ' vs ' + sk(false) + ')');
  const fm = mk('furnace'), zz = mkE(); T.setSides([fm, fa], [zz]); S.ult_furnace.run(fm); ok(zz.hp < 9000 && has(zz, 'scorch') && has(fa, 'atkUp'), 'Meltdown: every enemy burned and the team charged');
  /* auto-play */
  let errs = 0; const P = ['glacier', 'unbreakable', 'chaser', 'furnace'], xpMap = {}; P.forEach(k => xpMap[k] = 600);
  for (let i = 0; i < runs; i++) { H.reseed(9500 + i); try { await H.run(P, { world:0, runlen:'world', diff:'Normal', xp:0, xpMap, chips:[], smart:true, story:true, wave:1, foes:[] }); } catch (e2) { errs++; console.log('  run error: ' + String(e2.message).slice(0, 160)); } }
  ok(!errs, runs + ' auto-played full runs with all four finish with no errors');
  console.log(bad ? `\n${bad} problem(s).` : '\nGlacier, Unbreakable, Chaser and Furnace OK.'); process.exit(bad ? 1 : 0);
})();
