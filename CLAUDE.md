# FAL125: project guide for Claude

FAL125 is a turn-based character battle game in **one HTML file** (`fal125_battle_prototype-vNNN.html`, about 24,000 lines, open it in a browser). It is the author's own project: every character, game and story beat is theirs. Your job is to build what they ask, keep their canon, and keep the game working.

## Talking to the author
- Plain, simple English. They are not a programmer, and English is not their first language. Short replies, no jargon, explain what changed in game terms ("his fuse now shows on his head"), not code terms.
- They send **photos of sketchbook pages**, often sideways. Rotate them to read them, and read the notes carefully (name, old ID, ability, age, height, game won). Ask when a name is unclear instead of guessing silently.
- For a **new character**: first pitch one idea per role (Tank, Damage, Healer) using the sheet's ability, say which you recommend and why, then wait for their choice. Do not build before they choose.
- They plan to **stop adding characters soon** (about 12 more after The Red Walker, said in November 2026). Do not push new characters; suggest polish, real sprites and playtesting instead.
- Their own canon wins. If something you wrote (lore, scent, containment level) is your guess, say so.

## Folder layout
- `fal125_battle_prototype-vNNN.html`: the whole game. Bump the version number on every delivered change (copy to the next number, edit the copy, delete the old one). The tools pick the newest `fal125*.html` automatically.
- `sprites/`: one PNG per fighter (and some enemies), about 620 px tall, transparent background. Every sprite is ALSO embedded in the HTML as `EMBED.key = "data:image/webp;base64,..."` (lossless WebP). The game uses EMBED first, then `sprites/key.png`, then a drawn SVG placeholder (`ART.key`).
- `data/FAL125_Character_Book.xlsx`: one row per character (ID, Name, Ability, Ability+, Containment, Scent, Threat, Type, Awakened, Role, HP, ATK, DEF, SPD, Notes, Source). The Summary sheet's formulas cover a fixed row range: extend it when you add a row, then recalculate.
- `docs/README.txt`: the changelog. **Every version gets an entry at the top**, written so the author can follow it. Search the code for the version tag (for example "V255") to find that change.
- `docs/Needed.txt`: checklist for adding a character, plus the **next free ID** (currently **125**, Character Book row 126).
- `docs/ROADMAP.txt`, `docs/TEST_LAB.txt`: plans and how to use the test lab.
- `tools/`: Node test scripts (see Testing).

## Canon you must keep straight
- **New universe numbering**: the numbers written on the drawing sheets (59xx) are NOT used. Every new fighter takes the next free ID in the game (0103 Marrowline, 0104 Demure, 0105 Caspic, 0106 Soundemon, 0107 Slinder, 0108 Luckster, 0109 Punchline, 0110 Ixis, 0111 Tangler, 0112 Bearable, 0113 Blackbird, 0114 Rainbow Ripper, 0115 Hole, 0116 Tomb, 0117 Gloom, 0118 Ano, 0119 Lycion, 0120 Parda, 0121 Xainbow, 0122 Dollion, 0123 Vein Ripper, 0124 The Red Walker; next is 0125).
- **Story mode** main four: Fuja, Radiant, Eyianix, Bearer. Snavo is the automatic first encounter. Other fighters are recruited after World 1, each with their own lines.
- Worlds 1-7 have story beats; **World 8** ("The Climax") is the author's Mandela Catalogue idea: every enemy is an *alternate* (glitched copy) of a fighter you have used, floor bosses are random alternates at a random difficulty, impostors can replace a party member ("That's Not Them" exposes them), final boss is the Amalgam.
- The author's elimination games (Alice in Borderland / Squid Game style): **Hide and Bleed** (winner: Player 9 = Soundemon, who killed Player 2 afterwards), **Hot Touch** (Gutter, Marrowline and Demure come from it), **Mimic Ball** (Slinder won), **Fade Bite** (Luckster won). Caspic is from a different numbered game. They may rewrite these games later.
- **Outposter.M1** is a shop character, not a fighter (no ID): his Forge appears after some shop stops (`owVisit`, `OW`, `OW_WEAPONS`). A fighter trades 5-10% of ATK, DEF and max HP for one weapon per run. Not in the Character Book.
- **Xainbow** is a puppet made by Rainbow Ripper (author). Its ability box was blank: the "Colour Puppet" kit is Claude's draft. **Dollion** has a rivalry with another subject for killing his brother (which one is not confirmed yet).
- **The Red Walker** (0124, key `redwalker`) is treated as a different person from Walker (0068). His sheet says "after the game ended he killed 3 and 8" with IDs matching Ano's and Lycion's old sheet numbers: NOT used in the game; ask the author who 3 and 8 were and which game it was. One word of his ability text was unreadable.
- The author said (November 2026) that about **12 more characters** are coming, and then they are done for a long time. The tuning-object name `RW` is taken (rarity weights): his is `RDW`. Check a new `const XX` name is free before using it.
- **Shopkeepers (V265)**: The Vendor and Outposter.M1 have the author's own pose sprites (`sprites/kp_vendor_*.png`, `sprites/kp_outposter_*.png`, `EMBED.kp_*`; poses listed in `KP.poses`). The shop screen (`#shop`) has a keeper panel (`#kpPanel`, `kpOpen`/`kpSay`/`kpPose`) and their set lines live in `KP_LINES` (sets: `vendor`, `rival` = The Other Vendor, `byte` = the glitch vendor, `outposter`). Lines must be original, never copied from another game. The Black Market keeps its own keeper. New pose sheets from the author: cut each pose out along its green outline (see README V265).
- Open questions: Slinder may really be named "Splinder" (ask before renaming). Ixis's ability "Abs" was read as Absorb. Soundemon is based on Sandman/Soundman from JoJo SBR; a trap-style rework was discussed but not done.

## How the code is organised
- `CHARACTERS` array: `{ key, name, id, role, type, title, color, hp, atk, def, spd, build, skills:[...], passive }`. Roles: Tank, Damage, Healer. Types: Angel, Demon, Human, Hybrid (Angel > Demon > Human > Hybrid > Angel, +30%).
- `SKILLS` object (added to with `Object.assign(SKILLS, {...})`): `{ name, cd, target:'enemy'|'ally'|'all'|'self', fx, vfx, mv, desc, can(u), run(u,t) }`.
- `ENEMIES`, `WORLD_DATA` (per world: `unlock` = which enemies can appear and from which wave, `bosses`), `STATUS_DESC` / `LABEL` for statuses.
- Core functions: `hit(att, tgt, mult, opts)`, `damage(u, amount, kind)`, `heal(u, amount)`, `addStatus(u, key, turns, value)`, `refresh(u)` (redraws a unit), `takeTurn(u)`, `playerTurn(u)`, `startWave(i)`, `autoPick(u)` (auto-play), `submit({skill, target})`, `say(text)` (battle log), `popup(u, text, cls)`.
- **New behaviour is added by wrapping these functions**, never by editing their insides:
  ```js
  const _hitV999 = hit;
  hit = function (att, tgt, mult, o) { /* change mult */ return _hitV999.call(this, att, tgt, mult, o); };
  ```
  Wrap inside `try {} catch (e) {}` so a mistake cannot break a battle. Tag every block with a version comment (`/* V259: ... */`).
- Per-wave counters that must reset each wave go in `COUNTER_FIELDS`.
- `RUN` holds per-run state; `SAVE` is the save file (do not break old saves).

## Adding a character (checklist)
Follow the existing ones (search "V254" for Punchline and Ixis, a recent complete example):
1. `CHARACTERS` entry with the next free ID, a `build` (add it to `BUILDS`), 3 skills and a passive that describes the look AND the mechanic in plain words.
2. The skills, plus their mechanic wrappers, a tuning object (`const XX = {...}`), and an `autoPick` routine so auto-play uses the kit sensibly.
3. `ART.key` placeholder, `EMBED.key` sprite, `sprites/key.png`.
4. `IDENT`, `PARTY_QUIPS`, `SKIN_DEFS` (2 recolours), an ultimate in `ULTS`, an enhancement in `ENHS`, a rare chip, 3-4 chips `C('xx1', ...)`, `STORY_EXTRA.key` (lines for their role's story beats), `RL.key` (recruit lines), `ARC_LORE.key` (6 Archive entries), `MAST_TEXT.key` (Mastery).
5. Character Book row, Needed.txt next ID, README entry.
6. A test file `tools/fal125_key_test.js`, the existing tests, a balance check, and one browser battle with no errors.

## Sprites (Gemini)
The author makes sprites in Gemini. Every prompt must start with exactly:

> Cute chibi pixel-art style, thick dark outlines, big head and small body, full body, front-facing, centered, plain white background, no text, no shadow, game character sprite. Cute chibi 2D game sprite, full body, front-facing idle pose, oversized round head about half the body height, tiny stubby body and short rounded limbs, thick clean dark outline, plain white background, no text, no shadow, single character centered. Character:

What works: attach the author's **drawing turned upright, with numbered labels on each body part** as the first image and the **Whiplash sprite** (`sprites/whiplash.png`) as the second, then describe each numbered part, add a "SIZE RULE: about 2 heads tall, like the second image" and a short "Do NOT draw" list. When they send the finished sprite: cut it out of the white background (flood-fill white from the edges, keep enclosed white like teeth and shirts), resize to 620 px tall, save the PNG and replace the `EMBED.key` line, then update the description if the sprite differs from the drawing.

Still on temporary sprites: **Caspic, Ixis, Soundemon, Tangler, Bearable, Blackbird, Rainbow Ripper, Hole (both forms), Tomb, Gloom, Ano, Lycion (both forms), Parda, Xainbow, Dollion, Vein Ripper, The Red Walker** (Soundemon is waiting for a redraw). 183 of 305 enemies use drawn placeholders, including most bosses.

## Testing (always before delivering)
Run from the project folder with Node:
- `node tools/fal125_<name>_test.js --html GAME.html` for each character test, plus `healers4`, `hole`, `tomb`, `trio`, `tanks4`, `redwalker`, `shopkeeper`, `world8`, `v257`, `storycast`, `mastery`, `rework3`, `rework4`, `incident` (`--runs 2`).
- `node tools/fal125_lines_audit.js` (every character has story lines), `node tools/fal125_enemy_moves.js` (what each enemy does each turn).
- Balance: `tools/fal125_cmp.sh GAME.html "cy,inkating,shamoon" 5 1 Hard 60 newkey refkey` (early game, damage dealers) and `... "fuja,eyianix,bearer" 6 10 Hard 24 ...` (late game). Tanks: team `claire,inkating,shamoon` vs `whiplash`. Healers: team `sna,snavo,radiant` vs `thorn`. Aim for the same range as the reference.
- `node tools/fal125_lab.js --help`-style options are documented at the top of the file (`--party --world 1-8 --level --diff --runs --seed`).
- Open the game in a browser and play a battle with the new content; check the browser console for errors. Test on a phone-sized window too (the game has a mobile layout).

## Playing it as a web page
The game is published with GitHub Pages (Settings > Pages > Deploy from a branch > main, / (root)) at https://jtanis2009-design.github.io/Fal-125-Project-game/ . `index.html` opens the newest `fal125_battle_prototype-vNNN.html` automatically (it asks GitHub for the file list). **When you bump the version, also update `FALLBACK` in `index.html`** to the new file name, in case that lookup fails. `.nojekyll` makes GitHub serve the files as they are.

## Delivering
- **Always finish on the `main` branch.** The web page only shows what is on main. If you worked on another branch (Claude Code makes `claude/...` branches), merge it into main and push main, or the author will not see the update.
- **The author asked for this to happen automatically:** after every delivered version (tests passed, committed), merge into `main` and push `main` straight away, without asking first. Also push the working branch.
The author used to get a zip per version. With Claude Code, edit the folder in place, bump the HTML version, write the README entry, and commit with git (one commit per version, message = the README headline).
