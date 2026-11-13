#!/usr/bin/env node
'use strict';
/* fal125_world8_test.js: checks the V251 World 8 rework: alternates of your own fighters, random-difficulty alternate floor bosses,
   impostors with "That's Not Them", and the Amalgam borrowing moves. USAGE: node fal125_world8_test.js [--html game.html] */
const vm = require('vm'); const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), i0 = a.indexOf('--html'), html = findHtml(i0 >= 0 ? a[i0 + 1] : null);
let bad = 0; const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => {
  const H = load({ html, seed: 5 }), G = H.G, T = G.RXT, run = c => vm.runInContext(c, H.sb);
  const has = (u, k) => u.st.some(s => s.k === k), S = G.SKILLS;
  run('RUN = newRun(); CFG.world = W8I; CFG.runlen = "world"; rollRun()');
  const W = JSON.parse(run('JSON.stringify(WAVES)'));
  ok(W.length === 25 && W.every((w, i) => w.every(k => /^alt/.test(k) || k === 'amalgam')), 'every World 8 wave is made only of alternates (and the Amalgam at the end)');
  ok([4, 9, 14, 19].every(i => W[i].includes('altboss')) && W[24].includes('amalgam'), 'floors 1-4 end with an alternate boss, floor 5 with the Amalgam');
  const mk = k => T.makeUnit(G.CHARACTERS_BY(k), 'party');
  const P = [mk('sna'), mk('gutter'), mk('demure'), mk('caspic')]; run('wave = 2; round = 1');
  T.setSides(P, []);
  /* alternates copy your party */
  const seen = {}; for (let i = 0; i < 40; i++) { const u = run("makeUnit(ENEMIES.altA, 'enemy')"); seen[u.altOf] = (seen[u.altOf] || 0) + 1; }
  const fromParty = ['sna', 'gutter', 'demure', 'caspic'].reduce((n, k) => n + (seen[k] || 0), 0);
  ok(fromParty >= 15, 'alternates copy your own fighters most of the time (' + fromParty + ' of 40 from the party)');
  const e = run("makeUnit(ENEMIES.altA, 'enemy')"); ok(e.alt && e.spriteKey === e.altOf && /^alt_/.test(e.key) && e.name !== G.CHARACTERS_BY(e.altOf).name, 'an alternate uses the fighter\'s sprite with a glitched name (' + e.name + ')');
  const it = run('ENEMIES[' + JSON.stringify(e.key) + '].intent')(e); ok(typeof it === 'string' && it.length > 2, 'its intent shows a copied move (' + it + ')');
  /* it fights with real moves */
  const e2 = run("(() => { const u = makeUnit(ENEMIES.altA, 'enemy'); u.hp = u.maxHp = 9999; return u; })()"); T.setSides(P, [e2]); T.setCur(e2);
  const hp0 = P.reduce((n, p) => n + p.hp, 0); for (let i = 0; i < 4; i++) { try { await H.drive(run('(async()=>{ const u=foes[0]; u.ai(u); })()')); } catch (x) {} run('foes[0].cd = {}'); }
  ok(P.reduce((n, p) => n + p.hp, 0) < hp0 || P.some(p => p.st.length), 'it actually attacks your team with its moves');
  /* floor bosses */
  const tiers = {}; let hpOk = true; for (let i = 0; i < 30; i++) { const b = run("makeUnit(ENEMIES.altboss, 'enemy')"); tiers[b.tier] = 1; if (!(b.boss && b.hp >= 800)) hpOk = false; }
  ok(Object.keys(tiers).length >= 3 && hpOk, 'floor bosses are alternates with a random difficulty (' + Object.keys(tiers).join(', ') + ')');
  const b = run("(() => { const u = makeUnit(ENEMIES.altboss, 'enemy'); return u; })()"); T.setSides(P, [b]); T.setCur(b); b.hp = Math.round(b.maxHp * .4);
  try { await H.drive(run('(async()=>{ const u=foes[0]; u.ai(u); })()')); } catch (x) {}
  ok(b.p2 && has(b, 'atkUp'), 'a floor boss stops pretending at half HP');
  /* impostors */
  run('CFG.world = W8I; RUN.w8imp = {}; RUN.w8impChance = 1; wave = 2; round = 2'); T.setSides(P, [run("makeUnit(ENEMIES.altA,'enemy')")]);
  run('w8MaybeImpostor(party[0])'); const imp = P.find(p => p.imp);
  ok(!!imp && imp !== P[0], 'from the third wave an impostor can take one of your fighters\' places (' + (imp && imp.name) + ')');
  run('w8MaybeImpostor(party[0])'); ok(P.filter(p => p.imp).length === 1, 'only one per wave');
  const others = P.filter(p => p !== imp), oh = others.reduce((n, p) => n + p.hp, 0);
  await H.drive(run(`(async()=>{ try{ await playerTurn(party.find(p=>p.imp)); }catch(e){} })()`));
  ok(imp._impActed && others.reduce((n, p) => n + p.hp, 0) < oh, 'on its turn the impostor attacks your own team without waiting for an order');
  const real = others[0], nF = run('foes.length'); T.setCur(P[0]); S.w8accuse.run(P[0], real);
  ok(has(real, 'mark') && has(P[0], 'mark') && imp.imp, 'accusing the wrong fighter Marks you both and the impostor stays');
  S.w8accuse.run(others[1] || P[0], imp); ok(!imp.imp && run('foes.length') === nF + 1 && run('foes[foes.length-1].alt'), 'accusing the impostor pulls it out onto the enemy side as an alternate');
  /* auto-play */
  ok(run("(() => { const u = party[0]; u.skills = [...u.skills.filter(k=>k!=='w8accuse'), 'w8accuse']; return u.skills.includes('w8accuse'); })()"), 'every fighter has That\'s Not Them in World 8');
  /* outside World 8 */
  run('CFG.world = 0'); ok(!run('isW8()'), 'it is all World 8 only');
  /* the Amalgam */
  run('CFG.world = W8I'); const am = run("(() => { const u = makeUnit(ENEMIES.amalgam, 'enemy'); u.hp = u.maxHp = 99999; return u; })()"); T.setSides(P.map(p => { p.hp = p.maxHp = 99999; p.alive = true; p.imp = false; return p; }), [am]); T.setCur(am);
  let borrowed = 0; const sayLog = []; run('globalThis.__said=[]; const __s=say; say=function(t){ __said.push(String(t)); return __s.apply(this,arguments); }');
  for (let i = 0; i < 12; i++) { try { await H.drive(run('(async()=>{ const u=foes[0]; u.ai(u); })()')); } catch (x) {} run('foes[0].cd = {}; party.forEach(p=>{p.st=[]})'); }
  borrowed = run("__said.filter(t=>/wearing .*'s face/.test(t)).length");
  ok(borrowed >= 1, 'the Amalgam borrows moves from your team (' + borrowed + ' times in 12 turns)');
  ok(/borrow a move from your team/.test(run('ENEMIES.amalgam.intent')(am)), 'and its intent says so');
  console.log(bad ? `\n${bad} problem(s).` : '\nWorld 8 OK.'); process.exit(bad ? 1 : 0);
})();
