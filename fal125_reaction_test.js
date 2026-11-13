#!/usr/bin/env node
'use strict';
/* fal125_reaction_test.js: checks the elemental reactions (Steam, Chain, Explosion). USAGE: node fal125_reaction_test.js [--html game.html] */
const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), i0 = a.indexOf('--html'), html = findHtml(i0 >= 0 ? a[i0 + 1] : null);
const H = load({ html }), G = H.G, T = G.RXT; let bad = 0;
const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
const names = Object.keys(G.ENEMIES).slice(0, 12), foeKey = names.find(k => !G.ENEMIES[k].boss) || names[0];
function setup() {
  const heroes = ['snavo', 'sna'].map(k => T.makeUnit(G.CHARACTERS_BY(k), 'party'));
  const foes = [0, 1, 2, 3].map(() => T.makeUnit(Object.assign({}, G.ENEMIES[foeKey], { key: foeKey }), 'enemy'));
  foes.forEach(f => { f.boss = false; f.maxHp = f.hp = 1000; }); T.setSides(heroes, foes); T.setCur(heroes[0]); return { heroes, foes };
}
const has = (u, k) => u.st.some(s => s.k === k);
{ const { foes } = setup(); T.addStatus(foes[0], 'burn', 3, .05); ok(foes[0].hp === 1000, 'Burn alone does nothing'); T.addStatus(foes[0], 'soak', 3, 0);
  ok(foes[0].hp === 900 && !has(foes[0], 'burn') && !has(foes[0], 'soak') && has(foes[0], 'blur'), `Steam: 10% damage (${foes[0].hp}), Burn+Soak used up, Blurred`); }
{ const { foes } = setup(); T.addStatus(foes[0], 'soak', 3, 0); T.addStatus(foes[0], 'scorch', 3, .03);
  ok(foes[0].hp === 900 && has(foes[0], 'blur'), 'Steam also works with Scorch'); }
{ const { foes } = setup(); T.addStatus(foes[1], 'venom', 3, .04); T.addStatus(foes[1], 'burn', 3, .05);
  ok(foes[1].hp === 840 && foes[0].hp === 920 && foes[2].hp === 920 && foes[3].hp === 920 && !has(foes[1], 'venom') && !has(foes[1], 'burn'), `Explosion: 16% on target (${foes[1].hp}), 8% on every other enemy (${foes[0].hp})`); }
{ const { foes } = setup(); T.addStatus(foes[0], 'venom', 3, .04); T.addStatus(foes[0], 'burn', 3, .05); T.addStatus(foes[0], 'soak', 3, 0);
  ok(foes[0].hp === 840 && has(foes[0], 'soak') && !has(foes[0], 'blur'), 'Venom+Burn+Soak: Explosion goes first, Soak stays'); }
{ const { heroes, foes } = setup(); T.setFx('zap'); const d = T.hit(heroes[0], foes[0], 1.0, { fx: 'zap' }); T.setFx(null);
  ok(d > 0 && foes[1].hp === 1000, 'Zap on a dry enemy does not chain'); T.addStatus(foes[0], 'soak', 3, 0); const before = foes[0].hp; const d2 = T.hit(heroes[0], foes[0], 1.0, { fx: 'zap' });
  const jumped = foes.slice(1).filter(f => f.hp < 1000);
  ok(d2 > 0 && jumped.length === 3 && !has(foes[0], 'soak'), `Chain: soak used up, arc hit ${jumped.length} others for ~${1000 - foes[1].hp} each (hit was ${d2})`);
  ok(foes[1].hp >= 1000 - Math.ceil(d2 * .35) - 1 && foes[1].hp <= 1000 - Math.floor(d2 * .35) + 1, 'Chain damage is 35% of the hit'); }
{ const { heroes, foes } = setup(); T.addStatus(foes[0], 'soak', 3, 0); T.hit(heroes[0], foes[0], 1.0, { fx: 'slash' }); ok(has(foes[0], 'soak') && foes[1].hp === 1000, 'A non-zap hit does not chain and keeps Soak'); }
{ const { heroes, foes } = setup(); T.addStatus(heroes[0], 'burn', 3, .05); T.addStatus(heroes[0], 'soak', 3, 0); ok(heroes[0].hp === heroes[0].maxHp && has(heroes[0], 'burn'), 'Reactions never trigger on your own fighters'); }
{ const { foes } = setup(); foes[0].boss = true; T.addStatus(foes[0], 'burn', 3, .05); T.addStatus(foes[0], 'soak', 3, 0); ok(foes[0].hp === 950, `Bosses take half the Steam damage (${foes[0].hp})`); }
console.log(bad ? `\n${bad} problem(s).` : '\nReactions OK.'); process.exit(bad ? 1 : 0);
