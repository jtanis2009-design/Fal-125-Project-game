#!/usr/bin/env node
'use strict';
/* fal125_poses_test.js: checks the V268 attack and knocked-out poses: the sprites exist (embedded and as files), the pose code is there,
   and fights still run. USAGE: node fal125_poses_test.js [--html game.html] */
const vm = require('vm'); const fs = require('fs'), path = require('path'); const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), i0 = a.indexOf('--html'), html = findHtml(i0 >= 0 ? a[i0 + 1] : null);
let bad = 0; const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => {
  const H = load({ html, seed: 4 }), G = H.G, run = c => vm.runInContext(c, H.sb), E = run('EMBED');
  const posed = Object.keys(E).filter(k => /_atk$/.test(k)).map(k => k.replace(/_atk$/, ''));
  ok(['rainbowripper', 'ixis', 'gloom', 'ano', 'redwalker', 'lycion', 'tomb', 'tangler', 'xainbow', 'dollion', 'blackbird', 'veinripper', 'parda', 'caspic', 'soundemon', 'painter', 'glacier', 'hemo', 'unbreakable', 'chaser', 'furnace', 'doghunter', 'copyright', 'doommaster', 'toon', 'limit', 'kuikya', 'whorl', 'glitch', 'seam', 'uquna', 'sna', 'devic', 'ronin', 'stitchheart', 'goodbye', 'radiant', 'tulu', 'weepingangel', 'hush', 'marrowline'].every(k => posed.includes(k)), 'fighters with poses: ' + posed.join(', '));
  ok(posed.every(k => E[k + '_ko'] && E[k]), 'every fighter with an attack pose also has a knocked-out pose and a normal sprite');
  ok(posed.every(k => ['', '_atk', '_ko'].every(s => fs.existsSync(path.join(__dirname, '..', 'sprites', k + s + '.png')))), 'and all three PNG files are in sprites/');
  ok(posed.every(k => G.CHARACTERS.some(c => c.key === k)), 'every posed sprite belongs to a real fighter');
  ok(['poseShow', 'poseClear', 'poseImg'].every(f => typeof run(f) === 'function') && run('POSE.atkMs') > 0, 'the pose code is there');
  let errs = 0, waves = 0; const P = ['rainbowripper', 'ixis', 'gloom', 'ano', 'redwalker', 'lycion', 'tomb', 'tangler', 'xainbow', 'dollion', 'blackbird', 'veinripper', 'parda', 'caspic', 'soundemon', 'painter', 'glacier', 'hemo', 'unbreakable', 'chaser', 'furnace', 'doghunter', 'copyright', 'doommaster', 'toon', 'limit', 'kuikya', 'whorl', 'glitch', 'seam', 'uquna', 'sna', 'devic', 'ronin', 'stitchheart', 'goodbye', 'radiant', 'tulu', 'weepingangel', 'hush', 'marrowline'], xpMap = {}; P.forEach(k => xpMap[k] = 0);
  for (let i = 0; i < 2; i++) { H.reseed(7000 + i); try { const r = await H.run(P, { world:0, runlen:'world', diff:'Hard', xp:0, xpMap, chips:[], smart:true, story:true, wave:1, foes:[] }); waves += r.atWave || 0; } catch (e) { errs++; console.log('  run error: ' + String(e.message).slice(0, 140)); } }
  ok(!errs && waves > 0, 'two full runs with the four of them finish with no errors');
  console.log(bad ? `\n${bad} problem(s).` : '\nPoses OK.'); process.exit(bad ? 1 : 0);
})();
