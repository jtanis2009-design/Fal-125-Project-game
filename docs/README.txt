FAL-125 README. Current version: v259 (file fal125_battle_prototype-v259.html). Newest entries first.
Folders: docs (this file, ROADMAP, Needed, TEST_LAB, design notes), tools (headless test and audit scripts, see TEST_LAB.txt), data (FAL125_Character_Book.xlsx), sprites.
Read docs/Needed.txt every time a playable character is added. docs/ROADMAP.txt holds only what is still to build.

V259 (FOUR NEW HEALERS: TANGLER 0111, BEARABLE 0112, BLACKBIRD 0113, RAINBOW RIPPER 0114)
The author's own characters, all four Healers by the author's choice (sheets dated August 17th, June 19th, June 23rd and June 25th 2025; sheet numbers 5946, 5950, 5960 and 5959 dropped). Search "V259". Numbers in TG, BR, BB and RR.
- TANGLER (Stringy Body, its body turns into string). Stitch Up: heals one ally 25% and +30% DEF. Tether: ties an ally to Tangler for 3 turns; 30% of the damage they take runs down the string to Tangler. Tangle: hits, Slows, and heals the most hurt ally. The first big hit it takes each wave only does half damage (it comes apart into string). Its card shows who is tied.
- BEARABLE (Ticking Clock; the name was chosen by the author). The clock gains 1 tick every turn (max 12, empties each wave). Wind Down spends every tick on one big heal (+DEF); at 12 ticks it is MIDNIGHT and it also cleanses. Tick heals the team and winds 2 more ticks. Alarm spends every tick on one big hit that ignores DEF, and costs Bearable 2% HP per tick ("the more used, the more gets taken off"). Its card shows the clock.
- BLACKBIRD (Moss; the moves are the ones on the sheet). Moss Whip hits and heals the most hurt ally. Moss Infection eats 5% of an enemy's max HP every turn and feeds it to your most hurt ally. Moss Spray heals the team and makes them Mossy (healed every turn). Wants Friends: its heals are 8% stronger for every other ally standing. In World 8, when an alternate falls, it grieves and the moss heals the whole team (once per wave).
- RAINBOW RIPPER (Rainbow Machine). Steal Colour hits an enemy and turns it Grey for the rest of the wave: it hits weaker, and worse every turn (it cannot be cured). The colour goes into the machine (up to 5). Give Colour spends 1 to heal an ally a lot and make them Colourful (+20% ATK); do it again and they go Vibrant (+45% ATK, but they take 20% more damage). Rainbow Machine pours all the colour over the team. With no colour, the machine costs it 2% HP each turn. Its card shows the colour dots.
- Each has: an ultimate (Cat's Cradle, Midnight, Overgrowth, Full Spectrum), a gold enhancement, a Rare chip, 3 chips, 2 skins, recruit scenes, story lines for every Healer beat in Worlds 2 to 8, 6 Archive entries, Mastery lines, party quips and a between-wave event (A Snapped Rope Bridge, The Stopped Clock, Someone Who Looks Like You, A Room Full of Paint).
- Types (Tangler Demon, Bearable Hybrid, Blackbird Hybrid, Rainbow Ripper Angel), Containment levels, Threat and the Archive notes are Claude's guesses: change them if they are wrong.
- Sprites are TEMPORARY pixel sprites drawn by Claude from the sheets (sprites/*.png and EMBED). Replace them with Gemini sprites.
- Balance: in the healer check (sna, snavo, radiant, World 5, Hard) they reach wave 5.8 to 8.6, the same range as the other healers (Sevalio 5.5, Velara 6.5, Caspic 7.4, Thorn 9.3). Late game (fuja, eyianix, bearer, World 6) they clear 71% to 100% (Thorn 83%, Luckster 83%).
- Character Book rows 112 to 115. Next free ID: 115.
New test tools/fal125_healers4_test.js (40 checks).

WEB PAGE (no game changes)
- index.html opens the newest game version automatically, so the GitHub Pages link never changes: https://jtanis2009-design.github.io/Fal-125-Project-game/ (turn on Settings > Pages > Deploy from a branch > main, / (root)). .nojekyll makes GitHub serve the files as they are.

V258 (RECOLOUR SKINS: CLOWN.X2 AND VELARA)
- Clown.x2: Midnight Act (blue, 60), Toxic Jester (green, 75), Royal Court (purple, 90), Grey Matinee (black and white, 120). His free Candy Cane skin stays.
- Velara: Sapphire Halo (blue, 60), Venom Saint (green, 75), Gilded Angel (gold, 90), Fallen Angel (dark grey, 120). Her Sinner skin stays.
- Bought with Shards in the Skins menu, like the other recolours (SKIN_DEFS).

V257 (BOND COMBOS NOT SPAMMABLE + CHARACTER EVENTS + LAST STAND)
Search "V257" (one block at the end of the main game script).
- BOND COMBOS: the whole team now shares one Bond Combo cooldown. After anyone uses one, nobody can use another for 3 rounds (before, each fighter had their own 3-turn cooldown, so with several Bonded fighters a combo was available almost every turn). The button greys out with "Team ready in N"; keyboard and auto-play cannot fire one either (submit falls back to the fighter's first move). The cooldown resets at the start of each wave. Tune with BCD.
- CHARACTER EVENTS (CHAR_EVENTS): when one of these fighters is alive in your party, the between-wave event is their own event 60% of the time, with their portrait, once per fighter per run: Luckster (A Locked Door), Slinder (Blood Price), Marrowline (A Wall in the Way), Demure (Out of Season), Gutter (An Unclaimed Locker), Caspic (A Contaminated Room: starts the next wave with 3 Disks), Soundemon (The Echo Chamber), Punchline (The Bad Joke), Ixis (Something Too Big to Fight: starts the next wave with 80 Stored), Whiplash (Tangled Cables). Add more with { who, t, p, ch:[{ label, d, need, run(u) }] }.
- LAST STAND: when everyone else in the party has fallen (and you brought more than one fighter), the last one gets the move Last Stand, once per wave: heals 30% max HP, +40% ATK for the rest of the wave, and a 1.6x strike that ignores DEF, with the fighter's own Mastery line. Auto-play uses it at once.
New test tools/fal125_v257_test.js (9 checks).

V256 (REAL SPRITES: PUNCHLINE, LUCKSTER, SLINDER)
- The author's Gemini sprites replace the temporary ones (sprites/*.png and EMBED). Punchline's and Slinder's descriptions (passive, Archive) were updated to match: Punchline wears a strapped white straitjacket and has one blue and one red pupil; Slinder has a round white mask-like face with a stitched zigzag mouth, wild red hair and a red zip-up hoodie.

V255 (MARROWLINE FLIPPED + VISUAL EFFECTS FOR THE NEW KITS)
- Marrowline's sprite is mirrored so his barrel faces the enemy (sprites/marrowline.png and EMBED.marrowline).
- Every new move has a fitting hit effect and attack motion (the automatic picker had given some the wrong one, e.g. Demure's Knife was always frost and Ixis's scythe was tentacles). Demure's Knife and Nature's Call now look like the season: vines, fire, blood/rot, frost.
- Lasting states are drawn on the fighters (V255.draw, called from refresh): Marrowline's lit fuse sparks on his head with the turns left (faster and red on the last turn); a red X on the Red X target; Soundemon's Noise Blade and Shrieker float beside him; Ixis glows red as its Store fills; Caspic's Disk Ward shows a purple diamond on allies and Cancelled shows a purple seal on enemies; Demure has the season drifting around him (leaves, snow, sun, sprouts); Slinder drips blood while his next Blade is free; Rotting enemies show a leaf.
- Pop-ups: Luckster's die spins and shows what it rolled on each target; Punchline's accidents show a pie, stars or a bang; Caspic's cancelled statuses show a purple seal; Marrowline's shell explodes on every enemy and shakes the screen; Soundemon's constructs, Ixis's Spit Back and Slinder's Harvest send projectiles.
- Reduced Motion (Settings) stops all of these animations.

V254 (NEW FIGHTERS: PUNCHLINE, 0109, DAMAGE and IXIS, 0110, TANK)
The author's own characters (sheets 24 January 2025 and 3 January 2026, sheet numbers 5933 and 5936 dropped). Search "V254". Numbers in PL and IX.
PUNCHLINE (name chosen by the author; the sheet left it blank), 26. Absolute Joke: anything he finds funny happens, and he does not know. The log never credits him ("Purely a coincidence.").
- A funny thing (plFunny) is one of: slips (Stunned; a boss is Slowed), punches the enemy next to it (0.6x of its own attack), or a pie in the face (Blurred 2 turns).
- Tell a Joke: 0.95x, 50% he laughs and a funny thing happens to the target. Big Laugh (cooldown 2): 0.5x to every enemy, 35% funny each. Slapstick (cooldown 1): 1.2x, +60% if something funny already happened to that enemy this wave. Passive: when an enemy is Stunned, Slowed or Blurred, 25% chance (once per enemy per round) of a funny thing.
- Build "Prankster". Chips: Laughs Easily, Infectious Laugh, Running Gag. Divine: ultimate The Big One, enhancement Double Take, extra chip Whoopee Cushion. Skins: Rubber Nose, Laugh Track.
IXIS (the sheet's "Abs" read as Absorb; old designs labelled Fal-025), 8'2, 202 kg.
- Passive: 30% of every enemy hit Ixis takes is Stored (max 120). Swallow the Hit: Taunt 2 turns and -25% damage taken. Spit Back (cooldown 2): every enemy takes 60% of the Store (not reduced by DEF), Ixis heals 25% of it. Scythe Arms: 0.9x to the target, 0.45x to the ones beside it, Slows all 1 turn.
- Build "Maw". Chips: Bigger Stomach, More Mouths, Acid Spit. Divine: ultimate Every Mouth, enhancement Extra Arms, extra chip Serrated Scythe. Skins: Bone White, Deep Maw.
Both: story lines, recruit lines, banter, Archive lore, Mastery, identity lines. Ixis does not talk: its lines are actions. Character Book rows 110 and 111.
SPRITES: TEMPORARY pixel sprites drawn by Claude. Ixis's temporary sprite was drawn from the sideways photo and looks spider-like; the real design is a two-legged brute with scythe arms (the text was fixed to match).
BALANCE (cmp, seed 5): Punchline World 5 lv1: wave 13.7 [Soundemon 16.0], World 6 lv10: 83% [88%]. Ixis (team claire, inkating, shamoon) World 5 lv1: wave 16.9 [Whiplash 19.8], World 6 lv10: 100% [96%].
New test tools/fal125_punch_ixis_test.js (15 checks).

V253 (NEW FIGHTERS: SLINDER, 0107, DAMAGE and LUCKSTER, 0108, HEALER)
The author's own characters from the January 2025 sheets (sheet numbers 5935 and 5934 dropped, new universe). Search "V253". Numbers in BLD (Slinder; BM was already the Black Market) and LK (Luckster).
SLINDER, 19, won Mimic Ball (17 dead, 1 winner). Bloodmaker: weapons from blood, his own is the strongest, anyone's works.
- Blood Claws: 0.9x and Bleed 3 turns. Blood Blade (cooldown 1): costs 12% of his max HP (never below 1), (1.5 + 1.0 x share of HP missing)x ignoring DEF. Harvest (cooldown 2): every Bleeding enemy takes 0.5x + 0.1x per Bleed turn left and stops Bleeding, he heals 6% each, and his next Blade is free. Passive: +10% damage to Bleeding enemies.
- Auto-play: Harvest at 2+ Bleeding enemies, Blade when free or above 45% HP, otherwise Claws on an enemy that is not Bleeding yet.
- Build "Bloodmaker". Chips: Thin Blood, Transfusion, Borrowed Edge. Divine: ultimate Bloodbath, enhancement Both Hands, extra chip Deep Cut. Skins: Dried Blood, Fresh Cut.
LUCKSTER, 27, won Fade Bite and lost part of his chin in it. Rabbit's Luck: random yet effective.
- Every move rolls one effect, weighted towards what the team needs: a big heal (weighted by missing HP), a cleanse (weighted by bad statuses), a DEF shield, an ATK boost, or a non-boss enemy trips and loses its turn.
- Lucky Break: heals one ally 8% + one roll. Rabbit's Foot (cooldown 2): team heals 5% + one roll for everyone. Jackpot (cooldown 4): three Lucky Breaks on whoever needs them most, 12% chance of the JACKPOT (team heals 30% and is cleansed). Passive: 15% of enemy hits on him miss.
- Auto-play: Jackpot when someone is below 50%, Rabbit's Foot when the team is under 75% on average or has 2+ statuses, otherwise Lucky Break on whoever needs it most.
- Build "Lucky". Chips: Loaded Dice, Rabbit Reflexes, Lucky Streak. Divine: ultimate Lucky Seven, enhancement Double Down, extra chip Horseshoe. Skins: Four-Leaf, Gold Coin.
Both: their own story lines (damage / healer beats, Worlds 2 to 8), recruit lines, banter, Archive lore, Mastery, identity lines. Character Book rows 108 and 109.
SPRITES: TEMPORARY pixel sprites drawn by Claude (sprites/slinder.png, sprites/luckster.png, also embedded).
BALANCE (cmp, seed 5): Slinder, World 5 level 1: average wave 13.9 [Soundemon 16.0]; World 6 level 10: 96% [Soundemon 88%] (slow start, strong late). Luckster (team sna, snavo, radiant), World 5 level 1: wave 8.8 [Thorn 8.4]; World 6 level 10: 54% [Thorn 54%].
New test tools/fal125_slinder_luckster_test.js (17 checks).

V252 (NEW FIGHTER: SOUNDEMON, 0106, DAMAGE)
The author's own character from the July 2025 sheet (sheet number 5949 dropped, new universe); the author will send a redrawn design later. The winner of the author's game Hide and Bleed (as Player 9). After the game he killed Player 2, his partner in the final, and kept the "2" armband. Search "V252". Numbers in SD.
Ability: Sound Demon, he can create anything out of sound. Damage on purpose: Nane and Hush are already sound HEALERS, and both build a meter and spend it; Soundemon instead MAKES things that keep fighting on their own.
- Things made of sound: max 2 (a third replaces the oldest). They act at the start of each of his turns and last 3 of his turns.
- Sound Weapon (cooldown 2): 0.8x, and makes a Noise Blade that cuts the weakest enemy for 0.5x each turn.
- Sound Entity (cooldown 2): makes a Shrieker that screams at every enemy for 0.25x and Blurs them for 1 turn, each turn.
- Burst: 1.0x, and everything he made fires once more right away (without using up a turn).
- Passive: every kill by him or his constructs adds 1 turn to everything he made (max 5).
- Auto-play: keeps 2 things made (Shrieker first when there are several enemies), then Bursts the weakest.
- New build "Composer". Chips: Long Echo (4 turns), Sharper Note (blade 0.7x), Third Voice (3 at once), Encore (Burst fires them twice). Divine: ultimate Full Volume, enhancement Double Tap, extra chip Ringing Ears. Skins: Feedback, Static.
- Story: his own line for every damage-dealer beat in Worlds 2 to 8, recruit lines for Worlds 1 and 2, banter, Archive lore (6), Mastery, identity line. Character Book row 107.
SPRITE: TEMPORARY pixel sprite drawn by Claude (sprites/soundemon.png, also EMBED.soundemon).
BALANCE (cmp, seed 5): World 5, level 1, Hard, 60 runs (cy, inkating, shamoon): average wave 16.0 [Demure 16.3]. World 6, level 10, Hard, 24 runs (fuja, eyianix, bearer): clears 88% [Demure 88%].
New test tools/fal125_soundemon_test.js (14 checks).

V251 (WORLD 8 REWORK: THE CATALOGUE OF YOU)
The author's Mandela Catalogue idea for World 8. The code block is at the end of the main game script; search "V251". Numbers in W8.
- ALTERNATES: every World 8 enemy is a glitched copy of a fighter YOU have used: your current party about half the time, otherwise fighters from your run history and levels (anyone, if you have not used many). They use that fighter's sprite with a red/cyan glitch flicker and a wrong name (Sna?, Not Fuja, Radiant.alt, Snaaa, a name with a lookalike letter...), and they fight with that fighter's REAL moves (the Story-recruit system: the move runs with the sides swapped). Their intent shows the copied move with a broken name and what it does.
  - So the fight never stalls: copies take half healing (bosses a quarter), a copied move never hits harder than 1.2x (bosses 1.6x), and after round 12 a copy starts to come apart (loses 8% max HP a turn, bosses 4%).
  - The world's wave list holds slot enemies (altA to altF, altboss) that turn into alternates when they spawn. The old bug enemies and the four old floor bosses (Loading Bar, Checkerboard King, Clipper, Console) still exist in the code but are no longer used.
- FLOOR BOSSES: floors 1 to 4 end with a random alternate at a random difficulty: Faint copy (x0.85), Copy, Close copy (x1.12) or Perfect copy (x1.25), shown as stars when it appears. At half HP it "stops pretending": +25% ATK, and every second turn it acts twice.
- IMPOSTORS: from the third wave, each regular wave has a 35% chance that, from round 2, one of your fighters is quietly replaced. It looks the same, but it faces the wrong way and drops a frame now and then. On its turn it does not wait for your order: it attacks one of your own fighters. Every fighter gets the move "That's Not Them" in World 8 (cooldown 1): use it on the impostor to pull it out (it lands on the enemy side as an alternate and the real one comes back, healed 15%); accuse the wrong one and you are both Marked for 2 turns. Auto-play only accuses an impostor after it has shown itself. An impostor that is never found leaves when the wave ends.
- Creepy notices: some waves open with a broadcast line ("NOTICE: if a friend acts without being asked, they are not your friend.").
- FINAL BOSS: the Amalgam keeps its four fused moves and now, after each move, may also borrow a move from one of YOUR fighters (20%, 35% in phase 2). Its guards are alternates too.
- Story: World 8's opening, middle beat, world note and floor lines now talk about copies of your own team. Character lines for World 8 were kept (they already fit the glitch theme).
- Alternates are not Codex entries (like Story recruits).
BALANCE (lab, party fuja/radiant/eyianix/bearer, level 10, 24 runs each): Normal 92% clears (old World 8: 100%), Hard 63% (old: 75%). Harder than before, since it is the last world, and runs vary more because bosses and copies are random.
New test tools/fal125_world8_test.js (17 checks).

V250 (FIX: WORLD SELECTION ON THE PARTY SCREEN)
- The world grid is always visible again, right under the party. In V244 it was folded into the "Run" line, which was closed by default, so the worlds looked gone.
- On a computer the "Run options" line and the More button were hidden behind the sticky filter bar's background (its shadow covered them), so they could not be clicked. They now sit above it.
- "Run options" (closed by default) now only holds the run length, Mutator Draft, Heat, run styles and the world notes.

V249 (MORE VARIED ENEMIES IN WORLDS 1 TO 7)
26 enemies that only ever did one thing now have a second move every 2nd or 3rd turn (shown in their "Next:" intent). Their old moves are untouched. The block sits at the end of the main game script; search "V249" (list V249_EN, one line per enemy, delete a line to undo it).
- World 1: Husk: Frenzy (hits twice). Guard Drone: Charged stun round (it said "Stun round" but never stunned). Inkling: Ink splash (blurs).
- World 2: Gutter Rat: Gnaw (bleeds). Sludge: Sludge wave (soaks everyone). Methane Bloat: Methane puff (poisons). Electric Eel: Discharge (zaps everyone, hurts Soaked heroes more). Leech: Latch on (bleeds, drains). The Drowned: Drag down (soaks).
- World 3: Hound Pup: Nip at the heels (slows). Signal Crow: Peck at the eyes (blurs). Stray Round: Ricochet (hits two). Floodlight: Blinding sweep (blurs everyone; it still has its old mark-everyone sweep). Null Soldier: Bayonet (bleeds). Razor Husk: Blade storm (hits everyone, cuts itself).
- World 5: Returned Subject: Cling (slows, drains). The Culled: Maul (hits twice); its "Savage bite (bleeds)" now really Bleeds (it used to Irradiate).
- World 6: Choir Child: Solo (blurs everyone). Offering Collector: Tithe (drains). Wanderer: Right behind you (bleeds).
- World 7: Glass Moth: Shatter wings (blurs everyone). Sand Hound: Buries you (stuns). Hollowed: Hollow out (poisons). Lidless: Frozen stare (stuns a Slowed hero, otherwise Slows). Echo Congregant: Chorus (hits everyone). Eyelet: Bloodshot (bleeds the weakest).
- World 4 (the Safe Haven) was left alone: its enemies already do odd, friendly things on purpose.
- Fewer Marks: several enemies that only Marked now Blur or Bleed instead on their second move, so Mark is no longer the default status.
- Gutter: his weapon reader now also reads these second moves. Weapons from the 205 normal enemies: 89 carry a status (was 80), 45 hit everyone (was 41).
- Caspic gets more to do: more enemies now put Bleed, Blur and Venom on the team.
BALANCE (lab, Hard, party fuja/radiant/eyianix/bearer, 16 runs, seed 7; before > after): W1 81% > 88%, W2 88% > 100%, W3 75% > 100%, W5 69% > 88%, W7 75% > 88%. W6 rechecked with 40 runs: 90% > 85%. The new moves trade raw damage for statuses, so worlds are about as hard as before, slightly easier on average.
New tool tools/fal125_enemy_moves.js: prints what every enemy actually does each turn, and flags the ones with only ONE MOVE (useful for the World 8 rework).

V248 (NEW FIGHTER: CASPIC, 0105, HEALER)
The author's own character, drawn 21 March 2026 (sheet number 5929 dropped, new universe). Pitched for all three roles; the author asked for him as a Healer, reworked to suit it, because the roster is short on healers (now 28). Search "V248". Numbers in CP.
WHO: 17. Ability Canceller: abilities used against him stop working. The purple disks on his shoulders were taken from #4, and he stole more ability disks from the corpses. His arms were reattached from #2 and partly #24 (one pale with long white claws, one dark red and shaggy).
THE DISKS (no other fighter cancels or removes statuses like this): max 6, +1 for every bad status he cancels or removes. Bad status = Slow, Marked, Irradiated, Burning, Stunned, Soaked, Blurred, Venom, Frostbite, Sporing, Bleeding.
- Passive, Ability Canceller: any bad status an enemy tries to put on HIM never lands (+1 Disk).
- Cancel Wounds: heals one ally 20% max HP and removes every bad status on them; each one removed heals 5% more and gives a Disk.
- Hard Cancel (cooldown 1): 0.8x, and the enemy is Cancelled for its next turn: no bad status it tries to put on your team lands, and no buff (ATK up, DEF up, Guard, Reflect, Ward, Haste, Vigil) it tries to give its own side lands. +1 Disk each.
- Null Field (cooldown 3): spends all Disks. Removes every bad status from the team (still paying the passive), heals everyone 10% + 3% per Disk spent, and gives everyone a Disk Ward (the next bad status on them is cancelled, lasts 2 turns).
- Auto-play: Cancel Wounds on the ally who is worst off (low HP or carrying statuses), Null Field when the team has 3+ statuses or is low with Disks banked, otherwise Hard Cancel on the strongest enemy.
- New build "Canceller". Chips: Spare Disks (start waves with 2), Deep Clean (8% per status), Firewall (Ward cancels 2), Hard Reset (Hard Cancel Cancels every enemy). Divine: ultimate Total Cancel, enhancement Second Pass, extra chip Static Disk. Skins: Null Grey, Overclock.
- Story: his own line for every healer beat in Worlds 2 to 8 (STORY_EXTRA.caspic), recruit lines for Worlds 1 and 2, banter, Archive lore (6), Mastery, identity line. Character Book row 106.
SPRITE: TEMPORARY pixel sprite drawn by Claude (sprites/caspic.png, also EMBED.caspic). Replace both with the Gemini sprite.
BALANCE (cmp, seed 5, team sna, snavo, radiant): World 5, level 1, Hard, 60 runs: average wave 8.0 [Flokelore 6.3, Thorn 8.7, Eyianix 12.2]. World 6, level 10, Hard, 24 runs: clears 42% [Thorn 46%].
New test tools/fal125_caspic_test.js (21 checks). fal125_rework4_test.js: the Pyrelash "hits weaker" check now averages 30 hits (one hit was inside the random spread).

V247 (MARROWLINE'S REAL SPRITE)
- Marrowline now uses the author's Gemini sprite (sprites/marrowline.png, also EMBED.marrowline), replacing the temporary one from V243.
- His passive, Archive description, Mastery lore and Character Book note now match the design: the mouth sits UNDER the barrel, a red eye under each slit, the rope fuse hangs down the back, and his right arm is a second cannon (the left ends in claws).
- Gemini tip that worked for him: attach the drawing with numbered labels on each part as the first image and the Whiplash sprite as the second.

V246 (DEMURE'S REAL SPRITE)
- Fix: Marrowline's passive text now says +3% damage taken per Powder (what the game actually does).
- Demure now uses the author's Gemini sprite (sprites/demure.png, also embedded as EMBED.demure). It replaces the temporary pixel sprite from V245.

V245 (NEW FIGHTER: DEMURE, 0104, DAMAGE) + NEW UNIVERSE NUMBERS
NEW UNIVERSE: the numbers on the drawing sheets are dropped. Every new fighter takes the next free ID. Marrowline (was 5927) is now 0103, Demure is 0104, the next free ID is 105.
DEMURE: the author's own character, drawn 19 April 2026. 5'8, smells of grass and forest. The sheet's info is blank, so his lore (Archive, Mastery, lines) is my draft. Search "V245". Numbers in DM.
THE FOUR SEASONS (no other fighter does this): at the start of each of his turns the season moves on: Spring, Summer, Autumn, Winter, Spring... Every wave starts in Spring. His card shows this season and the next.
- Knife: Spring 1.0x and he heals 30% of the damage. Summer 1.45x. Autumn 1.0x and Bleeding 3 turns. Winter 1.0x and Slowed 2 turns.
- Nature's Call (cooldown 2): Spring 0.6x to all and roots the strongest enemy (Stunned; a boss is Slowed). Summer 0.9x to all and Burning 2 turns. Autumn 0.6x to all and Rotting 2 turns (new status: takes 25% more damage from everyone). Winter 0.6x to all and Slowed 2 turns.
- Out of Season (cooldown 1): 0.8x, and the season jumps one step now, so the next turn skips one.
- Auto-play: Nature's Call when it is ready, Out of Season to skip Spring when he is healthy, otherwise Knife on the weakest.
- New build "Seasonal". Chips: Long Summer (Summer Knife 1.7x), Evergreen (Spring heals 60%), Early Frost (Winter Call 1.0x), Call of the Wild (Nature's Call ready a turn sooner). Divine: ultimate Turn of the Year (all four seasons at once), enhancement Two Knives, extra chip Rusted Edge. Skins: Dead of Winter, Late Autumn.
- Story: his own line for every damage-dealer beat in Worlds 2 to 8, recruit lines for Worlds 1 and 2, banter, Archive lore (6), Mastery, identity line. Character Book row 105.
SPRITE: TEMPORARY pixel sprite drawn by Claude (sprites/demure.png, also EMBED.demure). Replace both with the Gemini sprite.
BALANCE (cmp, seed 5): World 5, level 1, Hard, 60 runs: average wave 15.1 [Marrowline 13.9, Tulu 14.7, Gutter 15.8]. World 6, level 10, Hard, 24 runs: clears 83% [Gutter 79%, Claire 88%, Marrowline 92%].
New test tools/fal125_demure_test.js (19 checks). fal125_marrowline_test.js now expects 0103.

V244 (CLEANER CHARACTER MENU)
The party screen was getting crowded with 101 fighters. No game rules changed. Search "V244" (one <style> and one <script> block at the end of the file).
- New order: party slots (with presets and the party summary), then the run on ONE line, then one filter bar, then the roster.
- Run line: shows the world, run length, style and Heat ("World 1: Containment Facility · Full World 1 · Standard"). Click "Change" to open the world grid, run modes, Heat, styles and the world notes. It remembers if you leave it open.
- More menu: Daily run, Weekly gauntlet, Run history, Skins, Mastery, Byte Vault, Token Rolls, Codex, Achievements and Foundation Archive moved out of the bottom of the page into one "More" button next to the run line. Enter the cell stays next to the party.
- Filter bar: role tabs with counts (All, Tank, Damage, Healer), a Type dropdown instead of a second row of buttons (its tooltip explains the type Edge), Random as a button (the Random group in the roster is gone), search and Recommend. On a computer the bar stays at the top while you scroll the roster.
- Roster: smaller tiles (about 12 per row instead of 9), no role icon on each tile (the group already says the role). Click a group title (Tank, Damage, Healer) to fold it away; the fold is remembered, and a search always shows everything.
- Phones: the run line and More stack, the world grid uses 2 columns, and the filter bar does not stick.
- Helper scripts that click a bottom button directly (Skins, Codex, ...) must open More first ("#moreBox > summary").

V243 (NEW FIGHTER: MARROWLINE, DAMAGE; now 0103, see V245)
The author's own character from the April 2026 sheet. Search "V243". Numbers in ML.
WHO: 6'6, German, a faint burnt smell. Contained, high difficulty, aggressive; besides his ability almost nothing is known. Ability: Cannoneer's Pawn, the user's body is fused with a cannon for good, which part depends on the user (only the hands, or only the head). At max one blast destroys several city blocks. His head is the cannon: slits with eyes under them, a fuse on the back, a red X on his chest.
THE FUSE (Nose lights fuses on enemies; Marrowline's fuse is on his own head and he is the bomb):
- Powder 0-5: +1 at the start of each of his turns and +1 when an enemy hits him (once per enemy per round). Each Powder: +5% damage dealt and +3% damage taken.
- Light the Fuse: a 3-turn fuse, counted at the start of his turns; the Red X goes on the target. Every enemy hit on him burns it 1 turn faster. When it runs out the shell lands on the Red X: (0.8 + 0.45 per Powder)x ignoring DEF, 35% of that on every other enemy, and all Powder is spent. If the Red X target is gone it lands on the enemy with the most HP. Used again while it burns: sets it off right now.
- Red X: 1.1x, Marks 2 turns, and moves the Red X (a lit shell lands there).
- City Block (5 Powder): 1.5x to every enemy ignoring DEF, spends the Powder, puts out the fuse, recoil 12% max HP (never kills) and he skips his next turn.
- If he falls with the fuse lit, the shell hits every enemy.
- Auto-play: lights the fuse on the biggest enemy, keeps the Red X on the weakest, City Block at 5 Powder.
- New build "Demolition". Chips: Dry Powder (start waves with 2), Thick Fuse (hits no longer burn it down), Shrapnel (55% splash), No Recoil. Divine: ultimate Full Barrel (fires a full 5-Powder shell at once), enhancement Double Barrel (Red X twice), extra chip Heavy Shot. Skins: Gunmetal, Field Grey.
- Story: his own line for every damage-dealer beat in Worlds 2 to 8 (STORY_EXTRA.marrowline), recruit lines for Worlds 1 and 2 (he blows his cell door off), banter, Archive lore (6), Mastery, identity line. Character Book row 104.
SPRITE: TEMPORARY pixel sprite drawn by Claude from the sheet (sprites/marrowline.png, also EMBED.marrowline). Replace both with the Gemini sprite.
BALANCE (cmp, seed 5): World 5, level 1, Hard, 60 runs (cy, inkating, shamoon): average wave 13.9 [Kasugu 12.6, Tulu 14.7, Gutter 15.8]. World 6, level 10, Hard, 24 runs (fuja, eyianix, bearer): clears 92% [Gutter 79%, Claire 88%]. Slow start, strong late.
New test tools/fal125_marrowline_test.js (20 checks).

V242 (GUTTER'S REAL SPRITE)
- Gutter now uses the author's Gemini sprite (sprites/gutter.png, also embedded as EMBED.gutter). It replaces the temporary pixel sprite from V241. Cut out of the white background with his face and white shirt kept. In the sprite his tumour eye is drawn dark red; his written description (passive, Archive) still says pink, from the sheet.
- Tip for future Gemini sprites: attach the Whiplash sprite as a second image and say the character should have the same proportions (about 2 heads tall, head wider than the shoulders, very short legs). See the prompt opening in the V242 conversation.

V241 (NEW FIGHTER: GUTTER, 0102, DAMAGE)
The author's own character from the April 2026 sheet. The ID on the sheet was dropped on purpose; 0102 is the next free one. Name chosen by the author from Claude's list. Search "V241". Numbers in GT.
WHO: a 19-year-old hired by Fal-125 to hunt entities and targets (kills: humans 142, entities 17). Wears masks taken from the people he killed. Makes weapons from entity corpses that keep their abilities. Ability: Human Storage, a pocket dimension he opens with his hands whenever he likes; one portal puts in, the other takes out. The pink eye is an eye with a tumour, NOT a portal.
THE ARSENAL (no other fighter does this): every enemy Gutter kills goes into storage as a weapon made from it. The weapon does what that enemy did, read from the enemy's own intent text: one target or every enemy, and its Stun, Slow, Mark, Venom, Soak, Burn, Bleed, Blur or drain. 195 of the 205 normal enemies give a real weapon; the 10 that never attack give a plain bone. Storage lasts the whole run (RUN.gtStore, newest first, max 6), and each weapon breaks after 2 uses. His card shows the newest weapon.
- Put In: 1.1x. A non-boss left under 25% HP is pulled into the portal alive and stored.
- Take Out (cooldown 1, needs a weapon): uses the newest weapon at his strength. One target 1.35x, every enemy 0.6x, plain bone 1.2x.
- Swallow and Spit (cooldown 3): opens the putting-in portal in front of the team for 2 turns. The next enemy hit on ANY hero is swallowed whole (no damage). At the start of his next turn it comes out at whoever sent it, as hard as it went in, ignoring DEF.
- New build "Collector" in BUILDS. Chips: Deep Pockets (9 weapons), Well Made (3 uses), Reach In (Put In at 35%), Spit Harder (+50%). Divine: ultimate Everything Comes Out, enhancement Bigger Pockets, extra chip Hungry Palm. Skins: Cold Storage, Rust Stain.
- Story: his own line for every damage-dealer beat in Worlds 2 to 8 (STORY_EXTRA.gutter), recruit lines for Worlds 1 and 2 (he was hired to bring the escapees back), banter, Archive lore (6 entries), Mastery, identity line. Character Book row 103.
SPRITE: TEMPORARY pixel sprite drawn by Claude from the sheet (sprites/gutter.png, also embedded as EMBED.gutter). Replace both with the Gemini sprite. The older version on the sheet (about 20 years later) is a good alternate skin later.
BALANCE (cmp, seed 5): World 5, level 1, Hard, 60 runs (cy, inkating, shamoon): average wave 15.8 [Kasugu 12.6, Claire 13.0, Tulu 14.7, Pyrelash 14.9]. World 6, level 10, Hard, 24 runs (fuja, eyianix, bearer): clears 79% [Tulu 79%, Kasugu 83%, Claire 88%]. Strong early, average late. Left as is.
New test tools/fal125_gutter_test.js (18 checks).

V240 (REWORK: PYRELASH, TRIGGERFINGER, MARROW; SPRITES FOR HUSH AND THE VENDOR)
Second batch of the uniqueness pass. All three were "load a counter, spend it" kits (Grip, Mines, Toll) and were among the weakest damage dealers in the V238 simulation (36 to 39% win). Search "V240". Numbers are in PY, TF and MR.
PYRELASH: SIX LASHES
- He has exactly six lashes and they stay wrapped around whatever he hits. Every lash in an enemy makes it deal 5% less damage, and with 2 or more it is Slowed. When an enemy dies, its lashes come back. His counter shows the free lashes; enemies show "Lashed xN".
- Lash: 1.0x and 0.5x on the neighbour, and wraps a lash around the target (with all six out, he pulls one back from the enemy holding the most).
- Whirl: 0.35x to every enemy, then every free lash goes to whichever enemies hold the fewest.
- Strangle: needs a lash out. 0.34x per lash in each enemy, ignoring DEF; 3 or more lashes Interrupts (Stun; bosses are Slowed). The lashes stay.
- Chips: Tight Knots (8% per lash), Coiled (Lash wraps 2 around an enemy that has none), Death Grip (Strangle Interrupts at 2).
TRIGGERFINGER: REAL MINES
- Mines sit under specific enemies (enemy chip "Mines xN"). The first time a mined enemy attacks on its turn, it steps forward and one goes off (1.0x, ignoring DEF). His counter shows how many mines are down.
- Speed Dash: 1.0x and 0.5x on the neighbour, and a mine under the target.
- Beacon of the Lost Soul: 0.6x, Mark 3 turns, Slow 1 turn, and EVERY mine on the field crawls under the target, plus one more.
- Landmine Eruption: needs a mine down. Every mine goes off: 0.9x per mine under each enemy, ignoring DEF, and 0.25x per mine to the enemies beside it.
- Chips: Hair Trigger (Speed Dash also mines the neighbour), Crow's Feathers (2 random enemies start each wave mined), Soul Static (unchanged), Pressure Plate (stepped-on mines 50% harder), Beacon Never Sleeps (Eruption Marks everyone and re-mines every survivor).
MARROW: THE BOOK (lasts the whole run)
- Every enemy he kills has its kind written in the Book. Every kind already in the Book takes 45% more damage from him. Every kill also takes a bone, and so does a Bone Nib that leaves an enemy under half HP (once per enemy); max 12 bones, each +2% ATK and +2% DEF. Stored on RUN (RUN.mrBook, RUN.mrBones), so it resets when a run starts. His card shows "Book N · Bones N/12". No more Toll meter.
- Name in the Book 1.2x. Bone Nib 0.8x, Marks the target and the neighbour. Death Toll 0.85x to every enemy and Marks the ones already written down.
- Chips: Sharper Nib and Marked Name (unchanged), Two Bones Each, Bone Armour (+4% DEF per bone), Ossuary Wings (known enemies take +70%).
- He starts every run weaker than before and ends it stronger. That is the point of him.
REMOVED: the old Grip (+5% per Grip) and Mines (+4% per Mine) damage bonuses inside hit(), and the old move definitions (one version of each move now, in the V240 block).
BALANCE (cmp: same team, only that slot changes, seed 5). Average damage dealers for comparison in brackets.
- World 5, level 1, Hard, 60 runs (cy, inkating, shamoon), average wave reached: Pyrelash 9.7 before, 14.9 after; Triggerfinger 10.6 before, 12.4 after; Marrow 10.8 before, 14.3 after. [Kasugu 12.6, Claire 13.0, Tulu 14.7]
- World 6, level 10, Hard, 24 runs (fuja, eyianix, bearer), clears: Pyrelash 75% before, 83% after; Triggerfinger 92% before, 83% after; Marrow 75% before, 88% after. [Tulu 79%, Kasugu 83%, Claire 88%]
SPRITES: Hush and The Vendor now use the author's Gemini sprites (sprites/hush.png, sprites/vendor.png, also embedded). Cut out of phone screenshots. Hush's passive no longer says its sprite is a placeholder. Note: Hush's text still describes her as "tall, pale", and the new sprite is dark.
New test tools/fal125_rework4_test.js (23 checks).

V239 (REWORK: WHIPLASH, CRUSHDEATH, FLOKELORE GET MECHANICS OF THEIR OWN)
All three were built on the shared "load a counter, spend it on the third move" template (Wires, Scrap, Cheer). Those counters are gone. Each now has something no other fighter in the game does. Search "V239".
WHIPLASH: LEASH (ties chosen enemies to himself)
- A Leashed enemy can only single-target Whiplash with its attacks. This beats Taunt. Every hit it lands on him is lashed back (0.3x). His counter shows how many enemies are Leashed.
- He has no Taunt any more. He protects by choosing WHICH enemies are tied to him.
- Wire Lash: 1.0x and Leash for 2 turns. On an enemy that is already Leashed it also yanks it (0.5x more, Slow).
- Pull Them Behind (was Wire Weave): Guard and +20% DEF on an ally, then every enemy that has hurt that ally this wave is Leashed. If nobody has, the enemy with the highest ATK is.
- Reel In (was Wire Storm): needs a Leashed enemy. Every Leashed enemy takes 0.7x plus 0.25x per OTHER Leashed enemy, and is Slowed; with 3 or more they are also Stunned. He gets Guard.
- Death Rage now also Leashes every enemy to him for the rage, and the rampage hits Leashed enemies first.
- Chips: Heavy Gauge, Wired to the Chest (unchanged), Long Wires (Leashes last 1 turn longer, was Live Wires), Won't Stay Down (unchanged).
CRUSHDEATH: THE JUNK WALL (a shield for the whole team)
- A pool of HP in front of the WHOLE team, up to 60% of his max HP, reset each wave, shown as a grey bar on his card. While it stands it soaks up half of every enemy hit on any hero. Damage over time goes past it. When enemies knock it down, the junk flies back at whoever did it (0.5x).
- He has no Taunt any more. The choice is when to throw the wall.
- Scrap Slam: 1.1x, and 40% of the damage dealt plus 5% of his max HP goes onto the wall.
- Junk Wall (was Junk Plating): +24% of his max HP onto the wall, heals him 5%.
- Thrasher: needs a wall of 20% of his max HP. Throws the whole wall: (0.8x + 2.0x times wall / max HP) ignoring DEF, so a full wall is 2.0x, plus Mark; 40% of that on every other enemy. The wall is gone.
- Chips: Rusty Spikes (unchanged), Load-Bearing Junk (the wall soaks 65%), Pile It Up (start every wave with a 20% wall), Nothing Wasted (Thrasher leaves a third of the wall).
FLOKELORE: PRESENTS AND THE LIST (heals that open later, and a naughty or nice check)
- Stocking Stuffer wraps a Present on an ally: 30% max HP, but it opens at the start of THEIR next turn, or straight away if they drop below half HP. A second Present on the same ally makes it bigger (+10%, up to 50%). Presents count as Flokelore's healing (healer bonuses apply). His counter shows how many are out.
- Naughty List: 1.0x, then he checks the list. Every enemy remembers which heroes it has hurt this wave. NAUGHTY (it has hurt someone): Coal, which bursts at the start of its next turn for 1.5x and Slows it, plus Mark. NICE (it has not): the most wounded ally gets a Present instead.
- Silent Night: needs a Present or Coal out. Opens every Present and bursts every Coal now, all 25% stronger, and clears Slow, Mark and Blur from the party.
- Chips: Heavier Coal (Coal 30% harder), Warm Wrapping (a Present also gives Guard), Advent Calendar (every ally gets a small Present at the start of every wave), Checking It Twice (Naughty List gives Coal AND a Present every time).
SHARED: hit() now remembers who is attacking (_hitAtt) and every enemy remembers which heroes it has hurt this wave (hurtBy). Crushdeath's wall and Flokelore's List both use it.
BALANCE (cmp: same team, only that slot changes, seed 5):
- World 5, level 1, Hard, 60 runs. Tank slot (claire, inkating, shamoon), average wave reached: Whiplash 16.4 before, 20.0 after; Crushdeath 9.6 before, 15.9 after; references Cy 13.0, Clown.x25 20.7.
  Healer slot (cy, shamoon, claire): Flokelore 15.6 before, 14.8 after; references Inkating 13.0, The Vendor 14.8, Nane 18.4.
- World 6, level 10, Hard, 24 runs. Tanks (snavo, radiant, hush), clears: Whiplash 79% before, 83% after; Crushdeath 75% before, 96% after; references Clown.x25 92%, Cy 79%, Reflux 63%, Sna 46%.
  Healers (sna, snavo, radiant): Flokelore 38% before, 33% after; references Rue 38%, Hush 46%, Devourer 75%.
- Crushdeath is now strong at higher levels (his wall grows with his max HP). Watch him; CD.wallCap and CD.wallShare are the knobs.
- New test tools/fal125_rework3_test.js (33 checks). The old whiplash, crushdeath and flokelore tests checked the removed counters and were removed.

V238 (RADIANT BUFF, HOLLOWPOINT REWORK)
Where this came from: 2,400 simulated battles (tools/fal125_sim.js, random teams of 4, level 1, Hard, first floor of World 5, 16 batches of 150). Overall win 58.8%. Radiant won 38% and Hollowpoint 38%. Search "V238".
RADIANT
- His Rad meter was reset to 0 at the start of every wave, although his passive says the core is never emptied. He now starts every wave with at least 40 Rad and keeps up to 60 of what he had (RX.startRad, RX.carryCap, radCarry), so Radiation Beam is ready on his first turn.
- Claw Slash 1.2x and +16 Rad (was 1.15x, +14). Radiation Beam (1.1 + 0.009 per Rad)x (was 1.0 + 0.008). HP 104 and ATK 16 (was 100 and 15).
- Measured in the same team (cy, inkating, shamoon; World 5, level 1, Hard, 60 runs): average wave reached 9.5 before, 13.2 after. Average damage dealers in that slot: Kasugu 12.6, Claire 13.0, Tulu 14.7. With the Story four (fuja, eyianix, bearer): clears 45% before, 58% after.
HOLLOWPOINT (the author: he shoots enemies and leeches off them to heal himself and others)
- NEW: TAPPED. Buckshot and Transfusion put a line into the enemy they hit for 3 turns. Every hero who hits a Tapped enemy heals for 15% of the damage dealt (Hollowpoint 25%), at most 6% of their max HP per hit. The whole party drinks from whatever he has shot. Numbers in HPX.
- Buckshot feeds two people at once: himself 35% of the damage and the most wounded other ally 35% (each at most 8% max HP). Before, it healed only him.
- Mercy Slug is now Transfusion: fires at a Tapped enemy if there is one, 1.0x (was 0.9x), the chosen ally heals 80% of the damage (was 60%), at most 14% max HP (was 10%).
- Void Shot no longer needs 3 Shells. It can always be fired (cooldown 3, was 2), still fires every loaded Shell, and if the target is Tapped the whole party heals 8% max HP. Chip Hollow Points now reads: keeps 2 Shells, and Tapped lasts 1 turn longer.
- The Wound costs 2% max HP a turn (was 3%).
- Measured in the same team (cy, shamoon, claire; same settings): average wave reached 9.2 before, 16.2 after. Other healers in that slot: Inkating 13.0, The Vendor 14.8, Nane 18.4. He stays a Healer.
- New test tools/fal125_hollowpoint_test.js (12 checks, including Radiant's wave start).
STILL OPEN: MAKING EVERY FIGHTER FEEL UNIQUE
- 56 of 99 kits are "load a counter, then spend it on the third move". Hollowpoint was one of them and is now the first to get a mechanic of his own instead. The other 55 have not been touched. See the list printed by the kit comparison in the V238 conversation; Whiplash, Crushdeath and Flokelore are in it.
- Other sim leads not acted on: Maw won 94%; Cloak, Pyrelash, Triggerfinger, Marrow and Felo de se won 33 to 39%; Sna 39%.

V237 (EVERY FIGHTER HAS THEIR OWN STORY LINES)
Audit first (tools/fal125_lines_audit.js): Worlds 3 to 8 already had a line per fighter for every beat of their role, for 95 of 99 fighters. The gaps were World 2 and four fighters. Search "V237".
- WORLD 2 had three generic lines that every tank, healer or striker said word for word. It now has per-fighter beats like the later worlds: w2s (arriving), w2m (the tags), w2e (the ladder). Tanks speak in all three, healers in w2s and w2m, strikers in w2s and w2e. 232 new lines, one set per fighter (STORY_W2). The old generic lines remain only as a fallback.
- GAPS FILLED (STORY_EXTRA): Velara had no story lines at all (11 added), Lifewire was missing 7 of his 9 tank beats, Flokelore was missing 2.
- SERPENTINE never spoke as the healer outside her scripted Cult scenes. She now has her own line for the 10 healer beats outside Worlds 6 and 7 (HL only skips her there).
- Fighters who do not talk keep that: Kitsuna, Nukasaurus, The Watcher, the Weeping Angel and Still-06 get narration, and Uquna, Umbra, Mushroom and Walker get a "..." with an action.
- Result: 99 of 99 fighters have their own line for every beat of their role in Worlds 2 to 8. World 1 has fixed lines for the main four only.
- Not covered: 7 generic lines in later closing scenes (for example "Then we make it ugly. Ten rooms. Go.") have no per-fighter version. Left alone because World 8 is being reworked.
- A NEW FIGHTER NEEDS: one line for each beat of their role. Run the audit after adding one; it prints what is missing.
- The lines are built the first time one is looked up (storyLinesBuild), so fighters defined further down the file get their proper names.

V236 (STORY PASS: THE MAIN FOUR SPEAK IN WORLDS 2 TO 7)
The author's beats: W1 escape through the main facility; W2 down the sewers to the exit; W3 escape from Fal-125 across the outside; W4 the Safe Haven, which is a Fal-125 trap; W5 Fal-125 tries to contain them again and fails; W6 the front layer of the cult, members trying to recruit them; W7 the mask comes off, the real cult. World 8 was left alone (it is going to be reworked).
The existing scenes already followed those beats, so nothing was removed. What was missing was the main four and the Prologue. Search "V236".
- New helper M_('fuja', `Fuja: "..."`): a fixed line for one of the main four, shown whoever is on the field. Skipped if that fighter is dead in Nuzlocke or is not on the Story save's roster. The role-based lines (T_, H_, D_, TL, HL, DL) are unchanged and still follow the party.
- 27 new lines for the main four across the 18 scenes of Worlds 2 to 7, plus 3 other new lines (Fal-125, Deacon Hale, one narration line). They carry three threads from the Prologue: Fuja and Radiant built this place and wrote its rule ("We do not kill what we can keep"); Fal-125 still uses Radiant's recorded voice and calls them Directors; and the seam in the sky over the cult is the same crack from the dry lake.
- W5 ending: Fal-125 now reaches for them one last time with every lock in the building and fails, before it goes dark. W6 opening: Deacon Hale asks them to stay. W7 opening: one line saying the friendly town was only the front door.
- Invented here, review it: Radiant signed the drainage plans; nobody they know runs Fal-125 now; the cult has been reading the same crack from the other side.

V235 (STORY MODE: NEW MAIN FOUR, SNAVO IS THE FIRST ENCOUNTER)
- STORY_START is now Fuja, Radiant, Eyianix, Bearer: the four who leave containment at the end of the Prologue. (Before: Snavo, Sna, Eyianix, Radiant.) Search "V235".
- STORY_FIRST = 'snavo': until Snavo is recruited, the first wild encounter of a Story save is always him and it is guaranteed (right after wave 1 of World 1, or the next non-boss wave if that run is lost). After that, encounters use the normal odds and the normal random pool. Set STORY_FIRST = '' to switch this off.
- Snavo and Sna now have their own recruit lines for World 1 and World 2 (RL), since they are met in the wild now.
- World 1's three story scenes were rewritten for the new four and now follow the Prologue ending: the lights are out, every door is open, and the intercom lists Subjects 0005, 0006, 0007 and 0008. This fixes the mismatch noted under V234. Worlds 2 to 8 had no lines spoken by the old starters, so nothing else changed.
- OLD SAVES: a Story save that was already being played keeps every fighter it had (Snavo and Sna included) and also gets Fuja and Bearer (storyCastFix, SAVE.castV). A new save starts with only the new four.
- BALANCE (tools/fal125_campaign.js, Normal, 8 sequences, Worlds 1 to 3): new four cleared 23 of 24 worlds on the first try, the old four 19 of 24. So the new start is a little easier, not harder.
- New test tools/fal125_storycast_test.js (7 checks). tools/fal125_headless.js keeps the real versions of the functions it switches off as sb.__orig.name. tools/fal125_campaign.js defaults to the new four.
- Checked in a real browser: a new Story save shows the four on the select screen, wave 1 is followed by "Wild Snavo", and the next encounter is random again. No script errors.

V234 (THE PROLOGUE, REWRITTEN TO THE AUTHOR'S STORY: SIX CHAPTERS)
The old five chapters (Meridian Station, Sevalio, the First Visitor, Subject 0003) did not match the real story and are gone. Search "V234".
THE STORY NOW: God and Satan are stuck in an endless fight. Neither side keeps the other out of its realm any more, and the wall between them and the world cracks.
- Ch 1 The Crack: Fuja and Radiant are still human. A shotgun, a rifle, and things falling out of the sky. Boss: a Herald and an Envoy who fall through still fighting.
- Ch 2 Fal-125: the US government arrives. The two of them found Fal-125 and write its first rule: "We do not kill what we can keep." Boss: The Overflow.
- Ch 3 Containment: they contain the Bearer (mid fight) and Eyianix (boss).
- Ch 4 The Mutation: a tenth demon that rode in with the Bearer gets loose. Fuja steps in front of Radiant, it goes into him, and he becomes what he is in the game. From the boss fight on he is played in his real form. He locks himself in Cell 0006.
- Ch 5 Half-Life: Radiant, alone, spends six days on radioactive material trying to cure him, and the core turns him into a monster instead. Ledger: 0007.
- Ch 6 Breakout: Radiant melts his lock, frees Fuja, then the Bearer and Eyianix (the party grows 1 > 2 > 4), and the whole block opens. World 1 begins.
HUMAN FORMS: PRO_HUMAN. Fuja is human until the middle of Ch 4, Radiant until the end of Ch 5 (the author asked for Chapter 1 only; the story has them human longer, so this follows the story. To change it, edit the cast lists in PRO_CH and the proParty([...]) calls: 'fuja_h' / 'radiant_h' are the human forms).
  Moves: Fuja = Shotgun, Hold the Line, Fire Axe. Radiant = Rifle Shot, Field Kit (heal), Signal Flare. They are not roster fighters and do not appear on the select screen.
  TEMPORARY SPRITES drawn by Claude: sprites/pro_fuja_h.png and sprites/pro_radiant_h.png (also embedded). Replace those two files with real art and the game uses it.
NEW ENEMIES: The Unblinking Eyianix, The Loose Demon, Ember Stray, Hot Sample, The Open Core, Containment Guard, Cell Block Turret, The Lockdown Sentinel. The Bearer now calls Ember Strays.
ALSO: seven new Lorebook entries, new scene labels, 6 chapter rewards, chapter n recovers old Archive file n. A save from the five chapter version keeps its clears; Chapter 6 shows as not cleared.
BALANCE (smart autopilot, Normal, random choices): all six chapters cleared in 6 of 6 full runs. Humans are weak against Demons (type chart), which is why demon bosses were scaled down with proTune(...) in proCh.
NOT CHANGED, AND IT NO LONGER LINES UP: World 1's opening still says "Subjects 0003, 0004, 0007 and 0008 have left containment" and "nobody remembers being brought here". The Prologue now ends with 0005, 0006, 0007 and 0008 leaving, and every other cell opening behind them.
HEADER FIX: the turn order row from V233 could slide back under the top-right buttons when the first header row was short. It now always takes its own row.
tools/fal125_prologue_test.js: node fal125_prologue_test.js game.html [runs] [from chapter] [only]. A run gives up after 12 losses.

V233 (POLISH PASS, NO NEW CHARACTERS)
Checked for the first time in a real browser (headless Chrome, desktop 1280x800 and phone 390x844): title, save slots, fighter select, every menu on the select screen, and auto-played World 1 battles with Whiplash, Crushdeath and Flokelore. No script errors anywhere. Fixed what that showed. Search "V233".
- BATTLE HEADER (desktop): the top-right buttons (timer, Music, Effects, Mobile, Settings, Debug, Lab) had grown to about 516px but the header only left 290px for them, so the card list, coin count, the "?" button and the turn order sat underneath them. The header now measures the real width of that bar (--sndW), and on screens up to 1700px wide the turn order gets its own full-width row under the header.
- FIGHTER SEARCH: new search box on the select screen. Matches name, ID number, build, title, role or type, on top of the role and type filters. Esc clears it. The Random tile still picks from what is shown.
- WHIPLASH and CRUSHDEATH: their name and HP bar colours were too dark to read on the battle background (#7a4a22 and #4a4a58). Now #c8843c and #9a9ab8.
- FLOKELORE: Stocking Stuffer heals 16% (was 14%) and Naughty List heals the most wounded ally 10% (was 8%). His log line no longer says he hands a gift to himself.
- PHONE LAYOUT: a long wave label wraps instead of running off the screen; the Wires/Scrap/Cheer style counters stay on one line and no longer run into the next fighter; the bottom button bar fits the screen and no longer covers the Log button (Debug is hidden on phones, it is still in Lab > Open Debug); the LAB RUN badge sits above the buttons.
- BALANCE CHECK (Hard, level 10, 40 runs, seed 7, smart autopilot; noise is roughly +/-8 points):
  Tanks with snavo+radiant+hush, World 6: Clown.x25 95%, Whiplash 95%, Cy 78%, Reflux 50%, Crushdeath 48%, Sna 35%. World 7: Whiplash 73%, Clown.x25 70%, Cy 50%.
  Healers with sna+snavo+radiant, World 6: Devourer 50%, Hush 35%, Flokelore 35% (18% before the buff), Rue 25%, Sevalio 10%.
  So all three new fighters sit inside the range of the existing roster. Whiplash is level with Clown.x25 at the top, Crushdeath is mid-pack. Nothing else was changed.
- Not changed, worth knowing: a healed Whiplash still drops when Death Rage ends (heals on him during the rage are wasted unless the wave is cleared). Crushdeath and Flokelore are naturally wide sprites and overlap their neighbours a little on phones, like Snavo does.
- tools/fal125_prologue_test.js takes the html path as its first argument (no --html flag).

V232 (NEW HEALER: FLOKELORE, 0101, WITH CANDY CANE SKIN)
- Flokelore is playable: Healer (Debuffer), Demon, 106 HP / 11 ATK / 6 DEF / 9 SPD, title The Second Santa. The Christmas demon of folklore, imagined as the second one. The ability "Naughty or Nice" is made up (the user allowed that), so review it. Sprite sprites/flokelore.png (also embedded). Search "V232".
- Cheer (max 5, resets each wave): every move adds one. Stocking Stuffer (ally): heals 14% (+2% per Cheer). Naughty List (enemy): 1.0x, Marks 2 turns, Slows 1 turn, heals the most wounded ally 8%. Silent Night (3 Cheer, spends all): party heals 10% (+3% per Cheer), loses Slow/Mark/Blur, +15% DEF 2 turns, every enemy Slowed 2 turns. Numbers in FK (search "const FK"). Healer heals are multiplied later by HEAL_MULT.
- Alternate skin: Candy Cane (red and white, free), sprites/skins/flokelore_candy.png, also embedded (EMBED_SKIN.flokelore_candy). The source picture runs off the left and right edge, so the wing tips are cut.
- Chips flk1 Sharper Icicles, flk2 Warm Wrapping, flk3 Cheer for Everyone, flk4 Naughty Becomes Nice (Legendary: Silent Night needs 2 Cheer, keeps 1). Divine: ultimate Krampusnacht, enhancement Bigger Stocking, extra chip Lump of Coal.
- Also added: IDENT, banter, 2 recolour skins, Archive lore, Mastery (99 of 99), Character Book row 102 (ID 101, Source Generated). Test: tools/fal125_flokelore_test.js. Lab: flokelore+whiplash+sunburst+akuna, World 6, level 10, 20 runs: 20/20 (the party is not a fair healer comparison).

V231 (NEW TANK: CRUSHDEATH, 0100)
- Crushdeath is playable: Tank, Other, Bruiser, 156 HP / 11 ATK / 12 DEF / 6 SPD, title Scrap Heap. Sprite from the user's chibi (sprites/crushdeath.png, also embedded). Ability Thrasher = scrap/trash manipulation. Search "V231".
- Scrap (max 5, resets each wave): every move adds one. Scrap Slam 1.1x (+0.04x per Scrap). Junk Plating (self): Guard 1 turn, +25% DEF 2 turns (+3% per Scrap), Taunt, heals 5%. Thrasher (3 Scrap, spends all): (1.6x + 0.25x per Scrap) ignoring DEF on the target, Marks it 2 turns, 0.5x splash on the other enemies. Numbers in CD (search "const CD").
- Chips cdp1 Rusty Spikes, cdp2 Thicker Plating, cdp3 Pile It Up, cdp4 Nothing Wasted (Legendary: Thrasher needs 2 Scrap, keeps 1). Divine: ultimate Total Scrap, enhancement Heavier Plating, extra chip Jagged Edges.
- Also added: IDENT, banter, skins, Archive lore, Mastery (98 of 98), Character Book row 101 (ID 100, Source Generated). Test: tools/fal125_crushdeath_test.js. Lab: crushdeath+reflux+sunburst+akuna, World 6, level 10, 20 runs: 14/20 (not compared against other tanks; Whiplash got 18/20 with the same allies).

V230 (NEW TANK: WHIPLASH, 0099)
- Whiplash is playable: Tank, Other, Protector, 152 HP / 11 ATK / 11 DEF / 7 SPD, title Wired Guardian. Sprite from the user's chibi (sprites/whiplash.png, also embedded). Search "V230".
- Wires (max 5, resets each wave): every move adds one. Wire Lash 1.0x (+0.06x per Wire) and Slows 1 turn. Wire Weave: ally gets Guard 1 turn and +20% DEF 2 turns (+3% per Wire), Whiplash Taunts and gets +15% ATK. Wire Storm (3 Wires, spends all): every enemy takes 0.55x + 0.10x per Wire, Slowed and Marked 2 turns, he heals 6%.
- DEATH RAGE (from the drawing: rage when dead): once per wave, the first time he would fall he stays on 1 HP and cannot be killed for 2 of his turns, +60% ATK, each turn is 3 unaimed wire hits (1.0x) on random enemies. If the rampage clears the wave he stays standing on 1 HP; otherwise he drops for real (permanent in Nuzlocke). Numbers are in WH (search "const WH"). Not balance-tuned beyond a 20-run lab test (World 6, level 10, whiplash+reflux+sunburst+akuna, 18/20).
- Chips: whp1 Heavy Gauge, whp2 Wired to the Chest, whp3 Live Wires, whp4 Won't Stay Down (Legendary: rage 3 turns, stands back up on 30% HP if he clears the wave). Divine: ultimate Wire Frenzy, enhancement Wires Remember, extra chip Barbed Wire.
- Also added: IDENT, party and tank banter, skins, Foundation Archive lore, Mastery text (97 of 97 hand-written), Character Book row 100 (ID 99, Source Generated: Containment/Threat are drafts).
- New test tools/fal125_whiplash_test.js (16 checks). tools/fal125_headless.js RXT now also exposes damage, kill, takeTurn, CF, setRound.

V229 (RANDOM TILE GETS ITS OWN GROUP)
- Character select: the Random tile used to sit inside the first role group (Tank). It now has its own "Random" group above Tank, Damage and Healer. It still picks from whatever fighters are shown, and the Tank count no longer includes it. Search "V229".

V228 (DEVOURER ART LOADING FIX)
- Devourer's three sprites are now embedded as PNG (were WebP) and also shipped as files: sprites/devourer.png, sprites/skins/devourer_mask.png, sprites/skins/devourer_maw.png. The game loads the files too, so the art shows even if the embedded copy fails. Nothing else changed from v227.

V227 (DEVOURER REWORK: "MEAL TO HEAL")
- Devourer (0094) has her real art now, three poses from the user's drawing: calm face (default), Mask 1 (horned grin) and Mouth Open (head-wide maw). Backgrounds cut out, same canvas for all three so she does not jump. Search "V227".
- The art follows what she does: Mouth Open during Gorge and Devour, Mask 1 for Share the Meal and for as long as she is Fed, calm face otherwise (dvPose / dvSettle, refresh keeps it in sync when Fed runs out).
- Still a flesh-eating Leech Healer. Ability name from the sheet: Meal to Heal. The meter is now called Flesh (code name is still meat, chips and saves keep working).
- Gorge: also leaves the target Bleeding for 2 turns, and heals 50% more off an enemy that was already Bleeding (fresh meat).
- Ribcage Shelter is now Share the Meal: same 22% heal and +30% DEF, plus it removes one bad status from the ally.
- Feast Bloom is now Devour: swallow threshold is 40% HP (was 25%) on a Bleeding target. Everything else is unchanged.
- Chips dv2 and dv3 text updated (Flesh, Devour). Codex, Foundation Archive and Mastery text rewritten. Character Book row 94 updated.
- Tested: lab run (devourer, reflux, sunburst, akuna, World 6, level 10, 20 runs) 20/20, mastery and reaction tests pass. The new Bleeding/Fed healing numbers were not tuned beyond that.

V226 (C/D-TIER REBALANCE: SNAVO, MARROW, CONQUER, C-RUIN, STITCHHEART, VOLTAGE 77, XEKNA, DEVIC)
- Goal: lift six fighters rated C without touching their identity. No Legendary/Mythic chip numbers were changed (the "keeps 1" chips still matter).
- Snavo: Serpent Lash 2 x 0.75x (was 0.65x), Four-Headed Bite 1.55x and Marks for 3 turns (was 1.4x, 2 turns), Snake Swarm cooldown 3 (was 4), feral below 40% HP (was 30%), and he now hits Marked enemies 10% harder as a base trait.
- Marrow: Death Toll (0.7 + 0.2 per Toll)x (was 0.6 + 0.15), Name in the Book 1.1x (was 1.0x), Bone Nib also Marks the enemy beside the target.
- Conquer: SPD 6 (was 5), Claw Swipe splash 0.65x (was 0.5x), Chain of Torment also gives him Guard for 1 turn, Touch of Paralysis leaves the target Marked for 2 turns.
- C-Ruin: ATK 13 (was 12), Gravity Well 1.0x / 0.5x splash (was 0.9x / 0.4x), Slowing Time (0.6 + 0.14 per Gravity)x (was 0.5 + 0.12) and +25% DEF (was +15%).
- Stitchheart: Stitch Lash heals 6% max HP (was 4%), Heart Tether gives him +20% DEF while the tie lasts, Cardiac Arrest gives +25% DEF (was +15%).
- Voltage 77: Spike Jab 1.25x (was 1.1x) and costs 1% HP (was 2%), Sound Spike costs 2% HP (was 3%) and gives +1 Adrenaline (so he is no longer only fed by being hit), Spike Frenzy heals him for 15% of the damage it deals.
- Xekna: GONE bites now only ever hit enemies (the 30% chance to hit an ally for 0.6x is gone). The 12% HP crash and the Stun stay. Chip "Lucid Rage" no longer mentions allies: it is now GONE +1 turn and no crash-stun (the HP crash still happens).
- Abomination Devic: Forced Claw recovers 5% max HP; Fuse Together gives him +20% DEF for 3 turns and recovers 8% max HP; Abomination recovers 10% max HP and gives him Guard 1 turn, but the party-wide share is 20% (was 25%); damage he takes through a Fuse is now softened by his DEF (same rule as Stitchheart's Tether).
- AUTO-PLAY HEALING FIX (Smart and Classic, search "apIsHeal"): the autopilot used to treat ANY skill whose text said "heal", "restor" or "mend" as a healing move and never used it as an attack, so about 95 attacks with a lifesteal or self-heal (Claws, Gnaw, Tail Lash, Stitch Lash, Spike Frenzy, every ult, ...) sat out of the rotation. Now a skill is a heal only if it never targets an enemy, its text says heal/restor/mend, and (for team and self skills) the healing comes before any damage multiplier in the text. Ally-target heal skills always count. Skills that say "recovers" are never heals. The emergency heal also covers self heals (below 55% own HP) and team heals (party average below 65%), not just ally heals below 55%. Both styles share one helper (apIsHeal / apPickHeal).
- Because of this, autopilot results for every party that includes a lifesteal or self-heal attack went UP versus v225 (not only Devic and Voltage): e.g. Hard, World 7, 100 runs, snavo+sna+eyianix+radiant 13% -> 24%, stitchheart+voltage77+rue+ghost 38% -> 59%, devic+xekna+tearwing+marrow 27% -> 53% (this includes the V226 buffs). Old autopilot numbers from earlier versions are not comparable.
- Hard, 150 runs, same seeds, fighter + 3 fixed allies: Devic W6 43% -> 49%, W7 15% -> 24%; Xekna roughly flat without Snavo in the party (31% -> 29%, noise), up with Snavo (his buffs). Voltage 77 (after fixing the wording issue above): W6 61% -> 69%, W7 14% -> 23%.
- THE DREAMER, ASLEEP (incident s3) rebalanced: it was won in 17% of seeded runs (36 runs, 6 varied parties), far below Rat King (100%) and Sharded Man (100%), because a full World 6 boss (1800 HP x1.15, stun then 1.8x hits) had to be worn down by 75%. New per-incident dials for specimens, like the cult ones: bossHp and bossAtk (search "Specimen HP dial"). The Dreamer now has bossHp .6 and bossAtk .7: 69% wins over 96 runs (it won 67% at the first test of the same numbers, .5/.6 gave 85%, .7/.55 gave 79%). The specimen rules are unchanged: it cannot be killed and you win at 25% HP.
- Still low and not changed: The Checkpoint Runs (b3) 22% and Floor Seven Roll Call (m3). Same dial pattern would fix b3 if wanted (breach bosses have no dial yet).
- Character Book updated (Conquer SPD, C-Ruin ATK). Numbers are in the SKILLS table (search "V226").
- Tested with tools/fal125_lab.js, same seeds v225 vs v226, party = fighter + 3 fixed allies, level 10. Hard, 150 runs: World 7 clears Snavo 7% -> 17%, Marrow 11% -> 18%, Voltage 14% -> 16-18%; World 6 Snavo 47% -> 51%, Marrow 31% -> 36%, Voltage flat (noise is about +/-4 points). Normal, 60 runs, World 7: C-Ruin 85% -> 97%, Stitchheart 80% -> 85%, Conquer 98% -> 100% (saturated). Reaction and mastery tests still pass. 

V225 (RUN STYLE AUDIT: BLOODBOUND + HOURGLASS)
- Audited with the new tools/fal125_style_audit.js (same parties and seeds per style, World 6 Normal, 50 runs, smart autopilot): Standard won 54%, Bloodbound 38%, Hourglass 26%. Hourglass was well below Glass Cannon and Last Stand for a similar Shard bonus.
- Hourglass: you now deal +15% damage (was +10%) and enemy damage grows +3% per round (was +6%), still capped at 12 rounds. Tested at 42% wins.
- Bloodbound: each enemy kill now heals 12% max HP (was 8%). Healing is still 50% weaker. Tested at 46% wins.
- The numbers live in STYLE_TUNE (search "V225"). Style descriptions updated. Not re-checked on other worlds, and the autopilot may not play these styles optimally.
- Enemy audit: no enemy numbers changed. Winning Ticket and Bomb Husk flags are artifacts (one-shot bombs). Late-boss flags are inflated by the level-1 dummy party. Fortress looks too easy for its +10% Shards (not changed).

V224 (ELEMENTAL REACTIONS, THE RULES)
- Roadmap #1 is now playable. The V212 visuals fire at the moment each reaction triggers. Reactions only trigger on ENEMIES, so hazards that Soak or burn your own team (Flood world, Sludge enemies) never set them off on you.
- STEAM: Burn (or Scorch) + Soak on one enemy. Both are used up, the enemy takes 10% max HP and is Blurred (-25% damage) for 2 turns.
- EXPLOSION: Venom + Burn (or Scorch) on one enemy. Both are used up, the enemy takes 16% max HP and every other living enemy takes 8% max HP. Wins over Steam when all three are present (the Soak stays).
- CHAIN: a Zap hit on a Soaked enemy. The Soak is used up and the arc jumps to up to 3 other living enemies for 35% of the damage dealt.
- Bosses take half the percent damage from Steam and Explosion. Reactions never trigger each other, and the damage counts toward the run's damage totals and the first fighter credit.
- Status tooltips for Burn, Soak and Venom now mention the reactions. Tune the numbers in RXN. Search "V224".
- New tool: tools/fal125_reaction_test.js (11 checks). tools/fal125_headless.js now exposes G.RXT for it.

V223 (CHARACTER DATA + MASTERY CONTENT)
- Velara is now in the Character Book (data/FAL125_Character_Book.xlsx, ID 98, Source = Generated for Containment/Scent/Threat). Summary formulas now read rows 2 to 99.
- Velara's character identification line (c.ident) was empty in game: the ident pass runs at load, before she is added. It is now filled right after her IDENT line (Codex > Fighters, fighter preview and the battle detail box show it). Search "V223".
- Mastery: every fighter that had a generic draft (75 of them) now has a hand-written epithet, lore entry and 3 voice lines in MAST_TEXT, written from that fighter's own kit and file notes. All 96 fighters are now written, so the "Draft entry" note no longer appears. MAST_GEN stays in the script as a fallback for future fighters.
- (File name at the time: fal125_battle_prototype-v223.html.)

FIX (v222 file, cult incidents): CULT INCIDENTS WERE UNWINNABLE (Candles in the Annex, Confession Hour, The Dream Circle: about 0-8% wins in the incident test).
- Cause: the ritual meter ticked +1 every round, even during the Officiant boss fight, and only the one cheap add could push it back. The boss fight takes 8-18 rounds, the meter ends the run at 6. The Third Sleeper was also far stronger than any other incident boss (all three of its moves hurt).
- Officiant stage now: the meter ticks every 2nd round, and every sixth of the Officiant's health you take off breaks his chant (meter -1). Ring stages are unchanged (+1 per round, -1 per cultist killed).
- New per-incident dials in INCIDENTS (all optional): rit:{pace,by,steps}, bossHp, bossAtk (Officiant only), meter / meterEnd / obj (names and text). Confession Hour: mult 1.0, bossHp .9. The Dream Circle: bossHp .85, bossAtk .4 (the Sleeper is only dreaming).
- Measured on 80 seeded random parties: Candles 85%, Confession Hour 60%, Dream Circle 54%. Optional objective (ritual 2 or lower) met in about 90% / 79% / 53% of wins.
- Not changed, same pattern: The Dreamer, Asleep (s3, 0/12) and Floor Seven Roll Call (m3, 3/12) have bosses well above the other incident bosses.
- Chip IDs: Back Shatter's chips are now sht1-sht3 (they collided with Bonesaw's bs1-bs3), and chip registration throws on a duplicate id.

V222 THE BLACK MARKET (a separate shop from The Vendor)
- At a shop stop, sometimes (35% at World 2, +5% per world, max 60%, guaranteed after 3 dry stops) a new option appears on the Vendor menu: "The door in the back wall". Not in Daily runs or the tutorial. Beating the Vendor closes his shutters and the door.
- Stock is re-rolled on every visit (4-6 items, one of each kind when possible, never the same set twice in a row). Coins only, no rerolls, no refunds (Black Market items cannot be sold back). One visit per stop.
- UNSTABLE CHIPS (5, no slot, carry up to 3): Overcharged Coil, Rigged Jackpot, Cracked Mirror, Borrowed Heart, Short Fuse. Big upside, random bite.
- EXPERIMENTAL BYTES (7, use the normal 4 Byte slots): Overclocked, Hardcoded, Recursive, Phantom, Memory Leak, Redacted, Root Access. Harsher and stronger than the Byte Shop's.
- GRAFTS (5, rare character modifications, bought for ONE named fighter, 2 per fighter): Reinforced Frame, Hair-trigger Wiring, Predator Instinct, Borrowed Fang, Second Pulse.
- ARTIFACTS (sealed, one blind price, carry up to 2 sealed): identified after your NEXT wave. 7 outcomes: Warm Brick, Humming Tooth, Cold Lantern, Empty Frame, Open Mouth, The Wrong Key, Dead Man's Watch.
- MILESTONES: every item has a gate {w: world reached (0-based), sec: secret bosses beaten, inc: Containment Incidents cleared, visits: Market visits}. Locked items show as sealed crates with the milestone written on them. Examples: Short Fuse and Memory Leak need World 4, Second Pulse needs World 5, Root Access Byte needs a secret boss found, Redacted Byte needs 2 Containment Incidents closed.
- THE MERCHANT stays unnamed: "???" at first, "The Stranger" from the 3rd visit, "The Broker" from the 9th. A breadcrumb clue appears at visits 3, 6, 9, 12 and 16 (BM_CLUES). The Vendor reacts to the door. Decide who he is, then edit BM_WHO and BM_CLUES.
- Saved per save slot in SAVE.bm = { visits, seen, clues }. The Market Ledger (top of the screen) counts items seen.
- Placeholder merchant art is ART.blackmarket (drop sprites/blackmarket.png in to replace it, same as the Vendor).
- Tune everything under "THE BLACK MARKET" in the script: BM (chances, caps), BMC / BMM / BMA (items), BM_WHO / BM_CLUES.
- Test: node tools/fal125_blackmarket_test.js [--runs 24 --world 7 --quick]. Checks every item's data, gates, thousands of stock rolls, buying caps, artifact reveal, and auto-plays runs with each item to catch errors and show how much each one moves the average wave reached.
- tools/fal125_headless.js: run() accepts bm = ['bx_over', 'bm_m_frame@snavo', 'a_brick'] to start a run with Black Market items, grafts (id@fighter) or an artifact outcome already applied.

V221 FIX: Triggerfinger sprite: the two white blobs down his arms recoloured to armour grey. Hollowpoint sprite: the small floating gun at the top right removed (EMBED.triggerfinger, EMBED.hollowpoint, also in sprites/).

V221 FIX: Clown.x2 playable sprite: stray white blob at the right edge removed. Bloodspike: the white static right hand recoloured to the purple/blue palette (EMBED.clownx2, EMBED.bloodspike, also in sprites/).

V221 FIX: Vor's sprite cleaned. Stray white specks and the light fringe on the sides, chin and hands are darkened to match the outline (EMBED.vor, also sprites/vor.png).

V221 FIX: Hound Dog's character select tile art is now fitted to the tile width and sits above the name plate (was small and low). CSS under "V222".

V221 TANK REWORK (LIFEWIRE)
- Lifewire (0030) is now a TANK: HP 105>150, ATK 14>11, DEF 6>11, SPD 9>8.
- Passive: every blow he takes (not chain hits) earns him 1 Charge (max 4).
- Wire Drain: 0.9x (was 1.0x), heals 30% of damage dealt (was 25%), +1 Charge.
- Lightning Rod (was Lightning Bolt, same key lwbolt): cd 2, self. +30% DEF 2 turns, Taunt 2 turns, heals 8% max HP, +1 Charge.
- Discharge: cd 3, (0.5 + 0.08 per Charge)x to all enemies (was 0.6), then +(10% + 5% per Charge) DEF for 2 turns. Spends all Charge.
- Chips: Charged Bolt is now Reinforced Rod (Lightning Rod heals 8% more and +10% DEF). Live Wire (Rare) now gives Guard + 6% heal. Others unchanged.
- Ran the role audit and a short headless sim: no errors. Not tuned by a full balance sim yet. Search "Tank rework".

V221 ART UPDATE (VELARA SPRITES, built into the v222 file)
- Real art added: Velara (white-haired angel with the red halo and blood orbs) and the Sinner Form (winged red angel with the thorn halo and claws). Backgrounds made transparent and cropped.
- Built into the HTML (EMBED.velara, EMBED.velara_sinner) and also saved as sprites/velara.png and sprites/velara_sinner.png. The placeholder SVG art stays in the script as a fallback. Search "V222".

V221 (VELARA, 0098)
- New Angel Healer. Base moves: Blood Orb (costs her 5% HP, heals an ally 20% and halves their damage for 2 turns), Halo Lash, Crimson Benediction (party heal + DEF).
- Divine ultimate chip "Fall of the Sinner": she becomes the SINNER FORM (Tank, until the wave ends) with Golden Ratio (charge up, then 3.4x piercing), Angels Headshot, Blood Orbs (hits all enemies, they bleed, she heals).
- NUZLOCKE ONLY: when her normal body would be destroyed she turns into the Sinner Form for good. When that falls you may let her take over one living ally (+20% ATK/DEF and her three Sinner moves); she stays until the host falls, then both are permanently dead. Persists across runs in that save (SAVE.vlBodyGone / SAVE.vlHost); she cannot be picked while inside someone.
- Art was a placeholder here and is now real (see the V221 ART UPDATE below). Tune VL_SIN. Search "V221".

V220 (PROLOGUE: THE BEGINNING replaces THE ARCHIVE)
- The Archive epilogue is gone from the world row. In its place: "Prologue: The Beginning", five playable chapters set before the Foundation: 1 The First Fracture, 2 First Contact, 3 Containment Failure, 4 The Foundation, 5 Subject 0003 (leads into World 1).
- Fixed cast (Fuja, Radiant, from Chapter 2 Sevalio), new enemies and bosses, visual novel scenes, and one choice per chapter that changes the next fight (saved as deeds; later scenes react). God vs Satan is only hinted.
- Safe mode while playing (no heat, history, achievements). Easy or Normal only. First clear pays shards, XP and a Lorebook file; completing it gives 100 shards and one Seal (shares the old Archive Seal cap of 6; existing Seals kept).
- After completion: replay any chapter normally, Battles only, or Story only. A first Story run offers the Prologue once.
- The 6 old Archive files moved into Lorebook folders (Fal-125 > Origins / Experiments, Worlds & Story > Recovered Records); found-state kept. Old Archive epilogue scenes stay readable under Story chapters.
- Foundation Archive (per-fighter files) is untouched. Old Archive code is left in place but unreachable.
- Custom backgrounds: sprites/bg_pro_1.png ... 5. Test: node tools/fal125_prologue_test.js <game.html> <runs>. Search "V220".

V212 (ELEMENTAL REACTION VISUALS, LEVEL-UP + WAVE CLEAR)
- Reaction effects: Steam (Burn+Soak: rolling fog and hiss), Chain (Zap+Soak: arcs hop between same-side units), Explosion (Venom+Burn: shock rings, flash, splash on neighbours). Call playReaction('steam'|'chain'|'explosion', unit, {to, force}). The reaction MECHANICS (roadmap #1) are NOT built; only the visuals and sounds exist, ready to be hooked in.
- Wave clear: a short "CLEAR" band (flash, confetti, party cheers, "Wave N" or "<boss> defeated") replaces the 1.2 s pause before the reward screen. clearBeat().
- Level-up: the end-of-run screen now shows a card per character that levelled (burst, Lv roll, HP/ATK/DEF bars fill, gain segment, numbers count up). Levels are granted at run end, so that is where the cards appear. LVUPS, lvPanel(), lvStats().
- HP bars fill smoothly, with a lagging trail on damage.
- Settings > "Reaction, level-up & CLEAR effects" On/Off (CFG.juice). Reduce motion shows final values with no animation.
- Debug panel: "Preview effects" buttons for Steam, Chain, Explosion, CLEAR, Level-up.
- New sounds: clear, lvup, tick, rx_steam, rx_chain, rx_explosion. Search "V212".

V211 (WEIRDCORE / DREAMCORE PASS: WORLDS 6 AND 7)
- New sprites: Nane and the playable Clown.x33 (EMBED.nanenane, EMBED.clownx33; the Clown.x33 enemy in Clown's Massacre, EMBED.clown_x33, is unchanged).
- Every floor of World 6 (Something Isn't Right, 5 floors) and World 7 (The Cult, 10 stages) has a new drawn backdrop. The cult stays in all of them (eyes, robes, candles, sand, hymn boards of 0, the Open Eye).
    World 6: overexposed Pleasant Hollow (7 identical houses, church with an eye window, empty swing) > Open House (yellow wallpaper, photos with only smiles, table laid for you) > Yellow Halls (one-point backrooms perspective, an EXIT, something at the far end) > Dream Wing (pastel sky, stairs to nowhere, a lone lit door, a floating bed) > Congregation (stained-glass eye, pews facing it, the picture tears).
    World 7: Welcome Door (a birthday party left up for you, WELC0ME HOME) > Confession Booth > Endless Hallway (every door is 0) > Rainbow Room (kidcore, crayon figures, a second bed) > Dream Circle (ring of sleepers under an eye-moon) > Day Without Mirrors (blank mirrors, white tile) > Tongue's Road (teeth for pillars) > Candle Vigil > Schism (day left, night right, a seam of static) > Seventh Night (the Open Eye fills the sky, seven chairs).
- New animated ambient layer for both worlds (DAMB): pollen, sand, fluorescent flicker, sparkles, bubbles, glitch tears. Replaces the old World 6/7 cases in AMBIENT.
- NEW DREAM EFFECTS overlay on the arena in Worlds 6-7 only: soft bloom, scan lines, film grain, a slow VHS tracking band, a colour grade per floor, a faint red/cyan ghost on enemy sprites, short "hiccups", and small captions that drift in now and then ("you have been walking for 4 minutes", "rule 8", "sand will be provided"...). Settings > Dream effects (World 6-7): On / Off. Reduce motion hides the moving parts, "Tone down flashes" halves it. Enemy "Next:" text gets a dark shadow in these worlds and pale floors have a light veil so it stays readable.
- All World 6 wave lines (CULT_LINES) rewritten, and World 7 now has a line on about 30 of its 50 waves (was 15). The rule texts that explain mechanics (Rule 8 marked+stunned +25%, Rule 10 healing -25%) are unchanged.
- Visual and text only: no stats, balance, enemy or story logic changed. A sprites/bg_w6_fN.png / bg_w7_fN.png file still replaces any scene.
- Tune: WEIRD6 / WEIRD7 (the scenes), DAMB (ambient), DREAM_CAPS (caption words), DREAMFX (timing), CSS under "V211". Search "V211".

V210 (BOSS PHASES, CUT-INS, REWARD + RECRUIT REVEALS)
- 1. BOSS PHASE CHANGE: when a boss drops to Phase 2 (or a Strategy boss to Phase 3 / Last Stand) all animation freezes for a beat, the boss roars (new sound), swells and shakes, bits fly off, the arena shakes hard and flashes a colour shift, and a "PHASE 2" banner (boss name + ENRAGED / LAST STAND) slams across the middle. The next turn waits for it (phWait). Afterwards a soft pulsing vignette in the boss's colour stays on the arena until the wave ends. Final bosses (Drowned King, Amalgam...) get a longer one. Function: phaseFx, called from enterPhase2 / enterPhase3.
- 2. ULTIMATE + BOND COMBO CUT-INS: picking an Ultimate (any ult_ move) or a Bond Combo dims the screen, sweeps a colour slash and speed lines across it, slides the fighter's portrait in (a Bond Combo slides both fighters in from opposite sides), slams the move name, flashes, and then the hit lands. Click, Space, Enter or Esc skips it. Auto-play plays a shorter one. Function: cutIn (hooked in playerTurn).
- 3. REWARD + CHIP REVEALS: reward cards and chip-shop cards flip over one after another and glow by rarity: Common = plain flip; Rare = ring + shine; Epic = sparks; Legendary = bigger burst; Mythic / Divine = screen flash too. Sounds get bigger with rarity. The shop plays it when it opens and after a reroll (not after every purchase). Reward cards have no rarity of their own, so for the show: run-long cards (made by cardChip) = Rare, Last Rites and Second Chance = Epic, the rest Common (table RV_CARD_RAR). Function: rvReveal.
- 4. RECRUIT "JOINS!": the screen now has a spotlight cone and the new fighter slides in from the side as a black silhouette, then lights up in the spot. Also used for The Vendor joining.
- Settings: Boss phase effects, Ultimate cut-ins, Reward reveals (each On / Off). Reduce motion turns all of it off; "Tone down flashes" drops the white flashes and sparks. The test tools skip it all. Visual only; nothing about the fights changes.
- Tune: durations inside phaseFx / cutIn / rvReveal, and the CSS under "V210". Search "V210".

V209 (BATTLE BANTER BOX + KNOCKOUT EFFECTS)
- 6. BANTER BOX: party banter between rounds and a boss's taunt at the start of its fight now show in a small box at the bottom of the battlefield: a little portrait, the speaker's name in their colour, and the line typing out (pauses on commas and full stops). Banter between rounds waits for you; tap the box to finish a line and again to go on, or it moves on by itself. A boss taunt shows on its own and never blocks your turn. The battle log still gets every line. It follows Settings > Story dialogue (Classic popup = the old log-only banter). Tune: BNT_CPS, and the CSS under "#bnt". Search "V209".
- 7. KNOCKOUT EFFECTS: every knockout gets a hit-stop (all animations freeze for a moment), the fallen sprite flashes white and drops, and bits fly off in its colour. A BOSS knockout is bigger: a longer freeze, then slow motion, a white screen flash, a push-in on the enemy side, and the boss shakes, stretches and dissolves into bits. The win waits about 2 seconds after a boss falls (about a third of a second after any other last enemy) so you see it. Visual only; nothing about the fight changes. Function: koFx (freeze / slow numbers are inside it), koFinish for the wait.
- Settings > Knockout effects: On / Off. Reduce motion turns it off; "Tone down flashes" keeps the fall but drops the white flashes. The test tools skip all of it.

V208 (VISUAL NOVEL EFFECTS)
- 1. PORTRAIT REACTIONS: the speaker reacts to their line. "!" = bounce, "?" = lean, "..." = slow nod, shouting (CAPS word or "!!") = shake (enemies) or jolt (heroes), and the listener on the other side flinches when someone shouts. Silent portraits get a small hop on every line.
- 2. TEXT EFFECTS: typing pauses on commas and full stops and takes a long breath on "...". Shouted lines are bigger and bold and shake the box (an enemy shouting also shakes the whole scene). Creepy speakers (Umbra, Uquna, Open Eye, Welcomer, Shepherd, Fal-125, Deacon Hale, Elder Marrow, Host, Clipper, Amalgam) glitch: the text flickers with a red/blue fringe, letters scramble while typing, and the portrait stutters. List: VN_GLITCH.
- 3. WORLD BACKDROP: each Story scene now plays over its world's own battlefield picture (start = first floor, mid = middle floor, end = last floor) drifting slowly behind a dark veil. If sprites/bg_wN_fM.png exists it is used instead of the drawn scene. The Archive epilogue stays plain dark.
- 4. ENTRANCES: a new portrait slides in from its side, whoever is speaking breathes gently, and big reveals can flash the screen (white, or red with {redflash}).
- 5. CHOICES: option buttons in every event / boss-talk popup pop in one after another.
- FORCE AN EFFECT with a tag at the start of a story line (stripped from the Classic popup and the test tools): {shake} {bounce} {flinch} {glitch} {lean} {nod} {jolt} {shout} {whisper} {slow} {fast} {flash} {redflash} {shakeall}. Example:  Umbra: "{glitch}{slow}You were never here."   Tagged so far: the Open Eye closing (World 7 end, {slow}) and END OF THE CULT SAGA ({flash}).
- Settings > Dialogue effects: On / Off. Reduce motion also turns everything off. Search "V208" in the script and the CSS.

V207 (VISUAL NOVEL DIALOGUE)
- Story scenes no longer show one big text popup. Every line is its own beat: a big portrait of the speaker (heroes on the left with their equipped skin, everyone else on the right), a name plate in the speaker's colour, and a box at the bottom that types the line out. Tap, click, Space or Enter goes on (the first press finishes the typing). Skip (top right) or Esc ends the scene. Each card opens with its title on a dark title card.
- Narration (no speaker) gets the box without a name, in italics. A line written as  Name: "text" (direction)  splits into name, spoken text and an italic direction underneath, so Mushroom/Walker/Umbra/Uquna read as stage directions.
- Portraits are found by name: CHARACTERS first, then ENEMIES. VN_ALIAS maps a speaker name to a sprite key when they differ (Sadie, Felo de se). All 100 speakers in the story currently resolve. Search "V207" in the script and the CSS under "#vn".
- Settings > Story dialogue: Visual novel (default) or Classic popup (the old card). Reduce motion turns off the typing and animations. The test tools still read the plain text (they never open the box).
- Tune: VN_CPS (typing speed). Used for every Story scene, including the Archive epilogue and echo scenes.
- Not done yet: the short banter lines during battle still use their old display.

V206 (STORY DIALOGUE FOR EVERY FIGHTER)
- 34 fighters were missing Story-mode lines for some or all of their beats (225 lines in total). They all have them now: Maw, Sunburst, Hollowpoint, Mindbender, Bonesaw, Kaleido, Pyrelash, Outbreak, Triggerfinger, Nane, Reflux, Kasugu, Conquer, Tearwing, Stitchheart, Bloodspike, Naginata, Uquna, C-Ruin, Shamoon, Voltage 77, Ghost, Ronin, Xekna, Walker, Mushroom, Smiley.wires, Umbra, Ripper, Clown.x2, Clown.x33, Devourer, Hush, Clown.x25. Silent fighters (Walker, Mushroom, Umbra, Uquna) keep their stage-direction style.
- FIX: a lot of the newer fighters already had lines, but they were filed in the wrong role's table (for example a Healer's lines sat in TANK_LINES with Damage slots), so the game never read them. HL/TL/DL now share one lookup (lineFor, search "V206") that finds a fighter's line by key and beat in all three tables, so those older lines play too, and a missing line falls back to the generic one instead of being skipped.
- Every fighter except Serpentine (who keeps her original scene lines on purpose) now has a line for every beat of their role: Healers 11 beats, Tanks 9, Damage 8 (slots are listed above each table in the script).
- Check: load the game, put any fighter alone in the party and call HL/TL/DL for each slot; none returns the generic fallback.

V200 (SHOP REROLL)
- Chip Shop reroll now costs at least 250 coins (RR_SHOP, was 90).
- Rerolled stock is marked up: every chip and Byte costs 100-150% of its normal price (random per item). Bits are not marked up. Search "Rerolled stock is marked up" in the script.

V201 (FLASHY ENCOUNTER INTRO)
- Every fight now opens with a full-screen intro: the screen swirls in, speed rays spin, hazard tape slams across, the enemies drop in one by one with their names, then a white flash throws you into the battle. The battlefield pops in with a little zoom.
- Normal fights say ENCOUNTER!, Elite fights ELITE ENCOUNTER! (gold), Boss fights WARNING! (red, boss name, bigger sprite). Two new sound effects.
- Click, tap or press any key to skip it. Reduce Motion / Tone down flashes in Settings gives a short calm fade instead. The test tools skip it.
- Tune: EI_TIME (length per fight type) and the CSS under "#encIntro". Switch off: CFG.encIntro = false. Search "ENCOUNTER INTRO".

V202 (FIX: OVERSIZED WIDE SPRITES)
- Wide fighters (Snavo, Glitch and any other art wider than 1.5x its height) were drawn up to ~40% taller than everyone else on shorter screens, overlapping the row above. Their height is now capped to the normal sprite box; they can still spill sideways.
- Glitch also gets the 78% height cap that was meant for him but was being overridden by the wide-sprite rule.
- Search "V202: wide art" in the CSS.

V203 (CLOWNS ONLY UNLOCK IN CLOWN'S MASSACRE)
- The playable Clowns (Clown.x2, Clown.x25, Clown.x33) are now locked until you unlock them by playing Clown's Massacre. Nose is NOT affected.
- Unlock: clear a Massacre wave that had that clown in it (Clown.x2 = the special Understudy boss, Clown.x25 Unfused, Clown.x33). A message pops up and they are yours for good in that save, in Story AND Freeplay.
- Until then they are hidden on the select screen, saved presets, Random, shop/event recruits, the daily crew, and they never show up as wild recruits in other worlds. Saves that already had one (Story roster) keep it.
- Tune: the CLOWN_UNLOCK table inside x2Recruit (search "V203"). The Massacre description now says it is the only place they unlock.
- Not covered: the Test Lab and tools can still use any clown directly (they ignore unlocks).

V204 (FIX: END SCREEN TEXT COVERED THE STATS)
- After a big run the recap text (recruits, routes, trophies, hunt contracts...) got so long that it pushed the stats panel and the Try again / Change party / Run history buttons off the screen.
- The recap now sits in its own box (max about a quarter of the screen height) and scrolls inside it. The whole end screen also scrolls if a small window needs it. Search "V204" in the CSS.

FOLDER LAYOUT
  fal125_battle_prototype-vNNN.html   the game (open this; it needs the sprites folder next to it)
  sprites/                            art the game loads (sprites/unused_variants = spare art, not used)
  tools/                              balance and audit scripts (see below)
  data/                               FAL125_Character_Book.xlsx
  docs/                               README, Needed.txt, ROADMAP

FAL-125 balance tools  (works with any version; currently fal125_battle_prototype-v225.html)

SETUP
1. Install Node.js (version 18 or newer) from nodejs.org. Nothing else to install.
2. The .js tools live in the tools folder and find the game .html in the main folder by themselves.
3. Open a terminal in the main game folder (the one with the .html file) and run the commands below.

RUN
  node tools/fal125_role_audit.js                    stat table per role, outliers, role-mismatch check (instant)
  node tools/fal125_neb_test.js --turns 160          NEW v181: plays the Never Ending Battle as God and Satan on autopilot (add --allmoves to use all 6 moves)
  node tools/fal125_story_check.js                   prints the World 5 and World 7 "remembered" story cards for every boss-talk outcome (instant)
  node tools/fal125_enemy_audit.js                   every Clown type: damage per turn, damage over time, control, bulk, outlier flags (instant)
  node tools/fal125_enemy_audit.js --all             every enemy in the game, not only Clowns
  node tools/fal125_enemy_audit.js --only clown_x4   only enemy keys starting with that text
  node tools/fal125_campaign.js                      NEW v179: plays Worlds 1-8 in order with the 4 starters, XP carried, retries allowed, tell-aware autopilot (see V179)
  node tools/fal125_campaign.js --seqs 12 --from 5 --startxp 1700    only Worlds 5-8, everyone level 10
  node tools/fal125_lab.js --party a,b,c,d --world 7 --wave 35 --runs 20   NEW v195: the Test Lab on the command line (see docs/TEST_LAB.txt)
  node tools/fal125_campaign.js --nostory            NEW v193: drop the Story-mode x0.9 enemy damage (the campaign tool now applies it by default, like a real Normal Story run)
  node tools/fal125_shapes.js --world 3 --xp 500     NEW v179: win rate per party shape (Tank/Healer/Damage mixes) at equal level
  node tools/fal125_sim.js                           2000 random-party runs, win-rate table per fighter (about 5 minutes)
  node tools/fal125_sim.js --runs 5000 --world 3     more runs, another world
  node tools/fal125_sim.js --chips --only-chips plate,batt,fang --chip-runs 300
  node tools/fal125_sim.js --out report              also writes CSV files you can open in a spreadsheet
  node tools/fal125_sim.js --help                    every option

NOTES
- Both tools load your REAL game code, so they always match the version you point them at. They never change your game file.
- The simulator plays with the game's own autopilot, picks reward cards at random, skips shops, story scenes and events.
  Treat results as "how strong is this on autopilot", not as a human win rate.
- Same --seed gives the same numbers. Small samples are noisy: the 95% range column tells you how much to trust a row.
- A fight that passes 150 rounds is counted as a loss and listed under STALEMATES.

- fal125_enemy_audit.js plays each enemy's real AI against a dummy party of four mid-HP fighters and heals them after every enemy turn, so it measures what an enemy does per turn, not who wins. Run it after you add or change any enemy. ERR lines are AI bugs. HIGH/LOW/GLASS/WALL flags compare against the group you chose with --only or --all.
- Burning (internal key 'scorch') is now a game-wide fire status: Loses a % of max HP each turn, orange chip, flame effect, and cleansing effects remove it. The enemy audit counts it as damage over time. Radiation ('burn', shown as Irradiated) is unchanged.

V120 (RUN STYLES)
- New picker on the party screen under Heat: 8 Run Styles. Each changes how you play and pays bonus Shards. Tune in STYLES (search "RUN STYLES" in the script).
    Glass Cannon: you and enemies deal +35%.   Bloodbound: healing -50%, every kill heals the party 8%.
    Hourglass: enemy damage +6% per round, you +10%.   Fortress: enemies -25% damage, +50% HP.
    Horde: enemies -20% HP, 1-2 extra enemies per fight.   Wild Cards: random good/bad twist every wave.
    Last Stand: enemies +30%, you +25% and +12% per fallen fighter.
- Balance tools: FAL_STYLE=horde node fal125_sim.js tests a style.

V121 (HUNT CONTRACTS, BOND COMBO FIX)
- HUNT CONTRACTS: at the start of every floor (every 5 waves) you get one optional contract: "Fighter X defeats N enemies this floor" (N = 4, 5, 6... max 8) or "Fighter X defeats the floor boss". Shows up in the battle log with a Hunt n/N popup. Pays Shards at the end of the run, win or lose (6 + 2 per kill needed, boss contract 22). Tune CT_NEED / CT_PAY / CT_BOSS_PAY (search "HUNT CONTRACTS").
- BOND COMBO FIX: the combo partner is no longer always the first Bonded ally. It avoids partners already picked this round, then the least recently used, then random. The partner stays the same for the whole turn.

V122 (ACHIEVEMENTS)
- New "Achievements (x/N)" button on the title screen. About 70 achievements: kill/boss/elite/run/win/wave totals, Bond Combos, Hunt contracts, each World win, Heat wins, each Run Style win, party-rule wins (everyone alive, 2 fighters or fewer, no Tank/Healer, all 5 types), coin and chip goals, mastery, bonds, whole roster, and hidden ones.
- Unlocking pays Shards at once and shows a popup. Progress bars on counter achievements. Saved per save slot (SAVE.ach).
- Add your own: copy a line starting with A( in the script (search "ACHIEVEMENTS").
- Fixed: run-end hook now also runs on losses.

V123 (MOVE ANIMATIONS)
- ATTACKER MOVES: besides lunge and cast, fighters now dash, leap, spin, slam (shakes the screen), shoot (recoil plus a flying projectile) and rear up. Enemies mix lunge/dash/leap/slam/rear on their attacks.
- 14 NEW HIT EFFECTS: frost, poison, blood, claws, beam, shockwave, heal, shield, sound, swarm, wind, rune, tentacle, stitch. Targets also react (frozen tint, poison wobble). Healing now shows rising crosses and a heart, Guard shows a bubble.
- Every move gets a fitting effect and attacker move from its name/description automatically (assignMoveFx in the script). To force one, add vfx:'beam' or mv:'slam' to a skill in SKILLS.
- Visuals only: damage, soak/zap rules and chips are unchanged. Console: CFG.moveAnim = false restores the old look.

V124 (SIDE QUEST PLACEHOLDER)
- New side quest card "Confronting Yourself" at the end of the world row on the party screen, next to Clown's Massacre and the Casino. Not playable yet: it is dimmed and shows "coming soon" when clicked.

V125 (SIDE QUEST: CONFRONTING YOURSELF)
- The "Confronting Yourself" card (party screen, world row) is now playable. Pick ONE of 6 fighters: Fuja, Radiant, Marrow, Eye of Sin, Envival, Inkating. They go alone (+50% HP): 1 Echo, then 2 Echoes (faded copies of themselves), then their OLDEST SELF ("<Name>, First Draft"). No reinforcements, 60% heal between fights.
- Win and that fighter permanently unlocks: the "<Name> - Oldest Self" skin (sepia of the default art; drop sprites/skins/<key>_oldest.png for real art, the filter is skipped when art loads) and the "Oldest Moves" moveset: 3 rawer, riskier moves. Turn it ON in the Skins screen (button under the fighter). Replays pay 15 Shards. 2 new achievements.
- To add a fighter: QUEST in the script (roster, set, boss, text, scale) plus 3 skills in the o_ block.
- Balance: QUEST.scale [Echo HP, boss HP, Echo ATK, boss ATK] per fighter. Tuned with the auto-battler: Radiant and Marrow are the hardest, the rest are gentler. Dev tool: fal125_headless.js now has a confront option.

V126 (CONFRONTING YOURSELF: SCP ENEMIES)
- The enemies in Confronting Yourself now use their own SCP art and names (your fighters keep their normal sprites): Fuja = SCP-6001 (Alienware), Radiant = SCP-6002 (Acid Burn), Marrow = SCP-6003 (Book of Death), Eye of Sin = SCP-6004 (Teleportation / Eye of All). Both the Echoes ("SCP-6001 (Echo)") and the First Draft boss ("SCP-6001, First Draft") use them. Envival and Inkating are unchanged.
- Each SCP has a signature move: the First Draft gets it as a 4th move in its cycle, Echoes use a weaker version every 3rd turn instead of the wild swing.
    Alienware: hits and Hacks you (-25% damage for 2 turns).   Acid Burn: hits and Burns you (3 turns).
    Book of Death: hits and Marks you; if you were already Marked it hits for much more.   Teleportation / Eye of All: vanishes, hits ignoring DEF, Marks you.
- The sepia tint on the boss is skipped for these four because they have real art now.
- Edit in the script: search "SCP enemy versions" (QUEST.scp for names/art, scpSig() for the moves). Art is EMBED.scp_6001 to scp_6004.
- Balance check with the auto-battler (24 fights each): Fuja 24/24, Radiant 14/24, Marrow 21/24, Eye of Sin 23/24.

V127 (SCP-6005-A/B/C)
- Envival's enemies in Confronting Yourself are now his three old selves, SCP-6005-A, -B and -C (one number, three characters). Fight 1: A. Fight 2: B and C. The First Draft is "SCP-6005, First Draft" (uses A's art, Envival's own moves). No SCP abilities were given, so no new moves yet.
- Art: EMBED.scp_6005a/b/c. Search "SCP-6005" in the script.

V128 (SCP-6006)
- Inkating's enemies in Confronting Yourself are now SCP-6006 (Echoes and First Draft) with Monstrous Inkfall: hits, Slows you for 2 turns and heals itself 4% max HP. Art: EMBED.scp_6006. Edit via QUEST.scp / scpSig().

V129 (CONFRONTING YOURSELF: SHORTER + SKINS FIX)
- SHORTER: now one Echo fight (2 Echoes; for Envival B + C) then the First Draft, instead of three fights. Boss HP is lower (QUEST.bossHp, plus per-fighter QUEST.tune) and from round 9 on every enemy hits 12% harder each round (QUEST.enrageFrom / enrageStep), so no fight drags. Auto-battler averages: Fuja 22 rounds (was 75), Inkating 12 (was 157), Envival 18 (was 51), Eye of Sin 15, Radiant 10, Marrow 7.
- SKINS: the Oldest Self skin now uses the SCP art (SCP-6001 to 6004, 6006). Envival gets three: SCP-6005-A, -B, -C. All are unlocked by winning that fighter's quest. 
- MOVESET: equipping the Oldest skin in the Skins screen IS what switches on the Oldest Moves (no separate button). Equip Default again to get the normal moves back. The Skins screen shows a line saying whether they are active.

V130 (SKIN SLIDER)
- Skins screen: a fighter with more than 5 skins now shows ONE row you slide sideways (scroll or drag), instead of wrapping onto a second row. Your scroll position is kept when you equip something.
- Envival's SCP-6005-B and SCP-6005-C skins are also unlocked for anyone who already beat his quest (they used to unlock only on a first win after v129).

V131 (BIG SKIN UPDATE)
REMOVED: Classic skin for Sna, Fuja, Vor and Flick (their art was missing, so they never worked). Radiant's Horror Drawing. Eye of Sin's Original Drawing. Anyone who had one equipped goes back to Default.
FIXED: The Watcher's main sprite had stray white background pieces (a white shard by his arm and edge specks). Cleaned out; the eye glint is kept.
REMADE (new name + new colourway, same price, and anyone who already bought the slot keeps it):
 Snavo   Gilded Coil -> Candy Coil          Tulu     Short Circuit -> Orchid Bone      Vor      Blood Moon -> Jade Veil
 Renku   Rust Blades -> Amethyst Edge       Anigari  Crimson Maw -> Violet Static      Flick    Bleached Flick -> Sea Rot
 Serpentine  Nightmare Ink -> Plague Doctor, Sunbleached -> Rosewater                    Dragonfire  Rust Protocol -> Neon Overclock
 Smiley  Pale Blight -> Acid Grin           Nero     Molten Chain -> Violet Reaper     Kitsuna  Winter Coat -> Spirit Fire, Blood Fox -> Sakura Fox
 Lifewire Dead Current -> Overgrown Current Cy       Granite -> Mossy Stripes, Molten Core -> Dusk Stripes
 Dia     Cracked Glacier -> Amethyst Frost  Sunshine Molten Horizon -> Lagoon Horizon Sleepy  Sunbleached Wings -> Violet Dusk
 Watcher Bone White -> Nightshade Eye       Weeping Angel Gilded Mourner -> Moonstone Mourner, Blood Tears -> Rose Quartz Mourner
 Marrow  Bone Dust -> Frostfur              Rue      Ash Devil -> Amethyst Devil       Envival  Ash Wings -> Frostwing
 Goodbye Bone White -> Ember Grin           Seam     Null Reference -> Brass Thread    Glitch   Static Noise -> Terminal Green
 Inkating Pale Eraser -> Nebula Ink         Ruckus   Burnt Amp -> Sherbet Amp          Ox       Rust Bull -> Cobalt Bull, Ghost Herd -> Jade Bull
 Claire  Rubber Red -> Bubblegum Squeak     Sunburst White Heat -> Witchfire
 The old washed-out ones (invert / grayscale / "bone white") are gone; every remake is a proper colour. To tweak one, search SKIN_DEFS in the script (name, CSS filter, price).

V132 (SPRITE EDGE FIX)
- Vor and Abomination Devic: removed the light/white halo that was showing around the outline of their main sprites. Art is otherwise unchanged.

V133 (SKINS SCREEN SCROLL FIX)
- Equipping or buying a skin no longer throws you back up the list. The Skins screen keeps your scroll position (it was rebuilding the whole list and resetting to the top).

V134 (FOUNDATION ARCHIVE)
- New "Foundation Archive (x/N)" button on the title screen, next to Achievements. One redacted SCP-style file per fighter (FAL-<id>, class from role: Tank = Euclid, Damage = Keter, Healer = Safe). Click a file to read it. Nothing is added to the character cards.
- Each file has 6 entries that declassify on milestones: 1 take them into a run, 2 reach Teammates with anyone, 3 defeat 40 enemies with them, 4 win a run with them, 5 reach Bonded with anyone, 6 defeat 400 enemies with them. Locked entries show black bars and the exact requirement with progress. A toast pops when one opens.
- Per-fighter kills, runs and wins are tracked from now on (SAVE.arc, per save slot). Older saves start those counts at zero; bond-based entries open straight away from existing bonds. Tutorial runs do not count.
- YOUR LORE: search "FOUNDATION ARCHIVE" in the script and fill ARC_LORE (key = fighter key, 6 slots, null keeps the stock text). [[double brackets]] make a permanent black redaction bar. ARC_STOCK is the placeholder text every fighter uses until you write theirs. Only Snavo has a sample (slots 1 and 4). Milestones live in ARC_SLOTS; the designation prefix and class names are ARC_PREFIX / ARC_CLASS.

V135 (ARCHIVE LORE: FUJA AND RADIANT)
- Foundation Archive: Fuja (FAL-0006) and Radiant (FAL-0007) now have written entries in ARC_LORE, built from the character sheets (Black Hole Stomach / Radiation Storage, the two founders of Fal-125). The other fighters still show the placeholder text.

V135.2 (ARCHIVE LORE: BEARER, EYIANIX, TULU)
- Foundation Archive: Bearer (FAL-0005), Eyianix (FAL-0008) and Tulu (FAL-0009) now have written entries in ARC_LORE, from the character sheets dated Oct 7 and Oct 13 2026. Archive lore updates are numbered 135.2, 135.3 and so on.

V135.3 (ARCHIVE LORE: VOR, RENKU, LOVESICK)
- Foundation Archive: Vor (FAL-0010), Renku (FAL-0011) and Lovesick (FAL-0012) now have written entries in ARC_LORE, from the character sheets dated Oct 13 2026. The sheet for Lovesick still says "Covesick" (the old name); the Archive uses the game name.

V135.4 (ARCHIVE LORE: BACK SHATTER, MARROW, EYE OF SIN, ENVIVAL, OX, CORRIDOR STALKER)
- Foundation Archive: Back Shatter (FAL-0045), Marrow (FAL-0048), Eye of Sin (FAL-0053), Envival (FAL-0054), Ox (FAL-0057) and Corridor Stalker (FAL-0058) now have written entries in ARC_LORE, from the character sheets. Ox's sheet had no description, so only his ability line is written and the rest keeps the placeholder text.

V135.5 (ARCHIVE LORE: CY, NUKASAURUS, SINKHOLE, MOON, INTERVEIN, MAW)
- Foundation Archive: Cy (FAL-0031), Nukasaurus (FAL-0038), Moon (FAL-0039), Sinkhole (FAL-0040), Intervein (FAL-0041) and Maw (FAL-0044) now have written entries in ARC_LORE, from the character sheets. Cy's sheet says ID 0033 but the game and spreadsheet use 0031, so the file is FAL-0031.

V136 (NEW FIGHTER: WALKER, ID 0068)
- New playable fighter Walker (0068, key walker), Damage / Hybrid / Hunter, from your drawing (hooded figure in a stitched blue parka, split white and dark red face, one red eye). The sheet says Ability: ???, so the Book keeps ??? and the moves below are my draft: edit freely. Stats HP 108, ATK 15, DEF 6, SPD 9.
- Steps (max 5, resets each wave): he never stops walking, +1 Step at the start of every turn, each Step is +4% damage. Seamed (new status): the enemy deals 15% less and takes 20% more from Walker.
- Tear the Seam (2 x 0.6x, Seams), Stitch Shut (1.0x, Seams, Stuns 1 turn, bosses Slowed, +25% DEF for 2 turns, cd 3), Long Walk (needs 3 Steps, spends all: 1.5x + 0.3x per Step ignoring DEF, 0.5x to every other Seamed enemy, cd 2).
- Also wired: ultimate (Final Destination), bond combo (Never Stopped Walking), 3 chips (Loose Thread, Good Boots, Never Stops), skin recolours, story lines, codex blurb, Steps counter, Foundation Archive entry (Maw's file already names Walker as his enemy, so Walker's personnel note says so; edit in ARC_LORE).
- Character Book: row added for ID 68 (Source: Generated), Summary ranges now read rows 2 to 69. Role audit: no outliers. Auto-battler floor test: 100% wins in 12 runs (small sample, same as the rest of the roster on floor 1).
- File renamed to fal125_battle_prototype-v136.html.

V137 (NEW FIGHTER: XEKNA, ID 0069)
- New playable fighter Xekna (0069, key xekna), Tank / Demon / Disruptor, from your drawing dated August 16th 2026. I read the name as "Xekna" (the X is crossed out on the sheet); tell me if it is spelled differently. Ability is ??? on the sheet, so the moves are my draft. HP 150, ATK 11, DEF 10, SPD 6.
- Rivets (max 5, resets each wave): every enemy hit he takes pops a Rivet and his spikes lash back for 0.25x (+0.05x per Rivet).
- Gnash (1.0x, Marks), Jacket Shut (Taunt + 35% DEF, cd 3), Spike Burst (needs 3 Rivets, spends all: hits every enemy for 0.8x + 0.2x per Rivet ignoring DEF, Slows, cd 2).
- Also wired: ultimate (Full Grin), bond combo, 3 chips (Thick Cuffs, Loaded Spikes, Zero Hour), skins, story lines, codex blurb, Archive entry. Character Book row for ID 69 added (Generated), Summary reads rows 2 to 70.

V138 (NEW FIGHTER: RONIN, ID 0070)
- New playable fighter Ronin (0070, key ronin), Healer / Hybrid / Warden, from your drawing dated May 22nd 2026. The sheet had no name and no ability, so the name Ronin and the moves are my draft: rename in CHARACTERS (name) if you want. HP 108, ATK 12, DEF 6, SPD 10.
- Focus (max 5, resets each wave): every move builds it. Quiet Cut (1.0x, Marks), Moss Poultice (heals 20% + 3% per Focus, +15% DEF 2 turns, cd 2), Sheathed (needs 3 Focus, spends all: party heals 8% + 2% per Focus, Guard 1 turn, +20% DEF 2 turns, cd 3).
- Also wired: ultimate (Last Cut), bond combo, 3 chips (Fresh Moss, Steady Breath, Empty Scabbard), skins, story lines, codex blurb, Archive entry. Book row for ID 70 (Generated); Summary reads rows 2 to 71.
- Fix: Walker's story lines were in the Tank lines list and never showed; moved to the Damage list.

V139 (REWORK: WALKER, XEKNA, RONIN, MAW)
- WALKER vs MAW (the eternal fight): Walker is Deaf to lies (immune to Blur and Venom). Tear the Seam and Stitch Shut now cut Taunt, Spite, Guard and Reflect off their target. MAW answers: he cannot be Stunned, Slowed or Seamed ("never stops talking"), and Needy Spiral also talks the target's ATK/DEF buffs and Seams away. If both are in the same party they cannot stand to be outdone: when one kills an enemy, the other gets +15% ATK for 2 turns. (Maw's file is only changed in these respects; tune the numbers in the Walker and Maw lines.)
- XEKNA = PSYCHOSIS (Maine from Edgerunners): Rivets became Psychosis (max 5). Each point is +6% damage and stronger spike counters; every hit he takes and every Gnash raises it. At 5 he goes GONE for 2 turns (+50% ATK, Gnash is three unaimed bites, 30% each to hit an ally for 0.6x), then CRASHES (-12% max HP, Stunned 1 turn, back to 2). Hold It Together (replaces Jacket Shut) pulls Psychosis down 2, heals 10%, Taunt + 30% DEF, but cannot be used while Gone. Break Down (replaces Spike Burst): spends 3 Psychosis, hits every enemy ignoring DEF, costs 6% max HP. Chips: Steady Hands, Edge of It, Lucid Rage.
- RONIN = CONTRACTED GOBLIN DEVIL HOST: now Damage / Bomber (HP 106, ATK 14, DEF 6, SPD 10). Goblin (max 5) replaces Focus: +4% damage each and mends him 1.5% max HP per Goblin at turn start. Iaido (katana, 1.3x vs Demons, strikes twice while the goblin drives), Frag Grenade (target + neighbours, Burning, 1.3x vs Demons), Goblin Takes the Wheel (needs 3, +40% ATK 2 turns, heals 10%, costs 6% max HP). Chips: Sharpened Edge, Itchy Green, Signed in Green.
- Book rows updated (Ronin is now Damage).

V140 (NEW SPRITES: WALKER, XEKNA, RONIN)
- Walker, Xekna and Ronin now use the new pixel-art sprites as their main art (EMBED.walker / xekna / ronin; copies also in sprites/<key>.png). The hand drawings they used before are replaced.
- FIX: the Backgrounds gallery showed the same Clown's Massacre picture four times (the circus background follows waves played, and the gallery has no run). The gallery now shows the four different circus scenes. In a real run nothing changed.

V140.1 (FIXES FROM THE FULL TEST REPORT)
- CASINO: it has 16 floors but only 12 boss ids, so floors 13-16 got an undefined boss (crash in wave setup / Field Study II). Boss lookup now wraps (floor 13 reuses boss 1, and so on), so every floor has a valid boss.
- CHIPS: three ids were used twice and the later one silently won. Renku's Sharpened Edge is now id whet_renku and Spiked Cleats is cleats_spiked (Whetstone and Track Cleats keep whet / cleats, so old saves behave as before). The old "Fourth of July" Nose Ultimate was removed; Midnight Show is the only Nose Ultimate. No duplicate chip ids remain.
- TOOLTIPS: Snavo's Ouroboros Feast and Bearer's Legion of Hands now show a description.
- Character Book: "Eyeianix" corrected to "Eyianix". Needed.txt now says rows 2 to 71; README header no longer says v125.

V140.2 (REWORK: FELO DE SE = CONTROL, MAW = TANK)
- FELO DE SE is now a psychological warfare / control fighter, damage secondary. Stats HP 102, ATK 14, DEF 6, SPD 10 (build Controller). New resource: Despair (max 5, resets each wave).
    Whisper (0.7x, Blurs 2 turns, Marks too if already Blurred, +1 Despair).   The Urge (cd 3, 0.5x, a non-boss turns on its own side next turn, a boss is Marked + Slowed; costs him 5% max HP; +2 Despair).
    Martyrdom (cd 4, needs 3 Despair, spends all: every enemy Blurred + Slowed + Marked 2 turns, takes 0.4x + 0.1x per Despair, non-bosses under 20% HP break; costs him 10% max HP).
    Ultimate Martyr's Verdict: 1.6x on the target, 0.6x on the rest, everyone Blurred/Slowed/Marked, non-bosses Taken Over, +3 Despair.
    Chips kept (Honeyed Whisper, Cheap Vow, Spreading Urge, Self-Fulfilling, The Devil's Deal), reworded for the new moves. Tune in the Felo de se block of SKILLS (search "Felo de se (0023").
- MAW is now a TANK (HP 146, ATK 11, DEF 10, SPD 7, build Protector). Counters hit harder (0.5x, 0.85x Spiteful), every Banana Chip also gives +4% DEF, Needy Spiral adds +20% DEF, Banana Chip Feast heals 8% per Chip and adds +20% DEF, Crowbar Swing is 0.9x. Everything about the Walker rivalry is unchanged. Tune in MW and the Maw block.
- Character Book rows for ID 23 and 44 updated. Role audit: no role mismatches.

V140.3 (NEW FIGHTER: HOLLOWPOINT, ID 0071)
- New playable fighter Hollowpoint (0071, key hollowpoint), Damage / Other / Leech. The sheets have no name, so Hollowpoint is my working name: rename it in CHARACTERS (name) if you like. Built from the 2025 drawing (Leeching Void) and the Oct 27th 2023 concept sheets (Leech, Void Shot, the Wound, the weak spot, the shotgun). HP 104, ATK 15, DEF 6, SPD 9. Art: the 2025 drawing (EMBED.hollowpoint, copy in sprites/hollowpoint.png).
- A DAMAGE fighter whose damage is the healing, all of it through his shotgun. Shells (max 5, resets each wave): +3% damage each.
    Buckshot (1.0x + 0.5x on the neighbour, the most wounded ally heals 35% of the damage dealt, +1 Shell).
    Void Shot (cd 2, needs 3 Shells, spends all: (1.2 + 0.2 per Shell)x ignoring DEF, a non-boss left under 25% HP is erased and the party heals 10%, bosses are Marked + Slowed).
    Leeching Void (cd 3: 0.5x to all, for 2 turns every hit a hero lands heals them for 20% of the damage dealt, costs him 4% max HP, +2 Shells).
    Ultimate Skull Breaks Off: costs 15% max HP, hits every enemy ignoring DEF, erases non-bosses under 30% HP, the party heals 25% of the total damage dealt.
- THE WOUND (passive): his weak spot tears open 3% max HP at the start of each of his turns; every kill closes it (he heals 8%, the rest of the party 4%).
- Also wired: ultimate, 3 chips (Sawn-Off, Spare Shells, Hollow Points), skins, codex blurb, quotes, story lines, Foundation Archive entry (from the concept notes). New status Leech (STATUS_DESC.leech). Book row for ID 71 (Generated), Summary reads rows 2 to 72.

V141 (NEW FIGHTER: GHOST, ID 0072)
- New playable fighter Ghost (0072, key ghost_0072), Healer / Other / Medic, from your drawing dated May 2026. Name, ID and abilities are from your sheet (Save file, Dead media manipulation); the moves and numbers are my draft, tune them in the Ghost block of SKILLS (search "Ghost (0072"). HP 102, ATK 11, DEF 6, SPD 10. The key is ghost_0072 because an enemy called ghost (Static Ghost) already exists. Art: your drawing, background removed (EMBED.ghost_0072, copy in sprites/ghost_0072.png).
- Tapes (max 5, resets each wave): every move records one. Each Tape makes her heals 4% stronger.
    Dead Air (cd 0): 0.9x, Blurs the target 2 turns, the most wounded ally heals 5%. +1 Tape.
    Save File (cd 3, ally): heals 18% (+4% per Tape) and writes a Save on them (status Saved). The next time that ally would fall they load it instead: back up at the HP they had when saved (at least 35%), debuffs gone. One Save at a time, ends with the wave. +1 Tape. Loading a Save gives Ghost +1 Tape.
    Dead Media (cd 3, needs 2 Tapes, spends all): party heals 8% + 3% per Tape and is cleansed; every enemy Blurred 2 turns and Slowed 1.
    Ultimate Load Last Save (once every 5 waves): party heals 25%, cleansed, everyone gets a Save (50% HP at least); enemies Blurred + Slowed 2 turns; +2 Tapes.
- AUTOSAVE (passive): at the start of her turn, if nobody holds a Save and she has a Tape, she spends it to Save the most wounded ally.
- Also wired: ultimate, Cloud Backup enhancement, Pause Frame move upgrade, 3 chips (Cracked Disc, Spare Tapes, Hard Drive), skins (Dead Channel, Glitch Pink), codex blurb, quotes, story lines, Foundation Archive entry. New status Saved. Book row for ID 72 (Generated); Summary reads rows 2 to 73. Containment (Medium) and Threat are my draft.
- Checked: role audit (no outlier, no role mismatch) and 12 simulated floor runs with no errors; Save File reload, Dead Media and the ultimate tested by hand in the headless loader.

V142 (NEW FIGHTER: VOLTAGE 77, ID 0073)
- New playable fighter Voltage 77 (0073, key voltage77), Damage / Hybrid / Retaliator, from your drawing dated Oct 22 2025. Name and both abilities (Adrenaline Spike, Sound Spikes) are from your sheet; the sheet had no ID, so 0073 is just the next free number, and the role, moves and numbers are my draft: tune them in the Voltage 77 block of SKILLS (search "Voltage 77 (0073"). HP 102, ATK 15, DEF 6, SPD 10. Art: your drawing, background removed (EMBED.voltage77, copy in sprites/voltage77.png).
- ADRENALINE SPIKE (passive, max 5, resets each wave): every hit he takes gives +1 Adrenaline. Each Adrenaline is +6% damage and +8% SPD (turn order).
- SOUND SPIKES: he tears replaceable spikes off his own body, which costs a little HP (they grow back).
    Spike Jab (cd 0): 1.1x melee, nicks him 2% max HP, +1 Adrenaline.
    Sound Spike (cd 2): costs 3% max HP. Target 1.3x, every other enemy 0.7x, every enemy Slowed 1 turn. +25% damage while he has 3+ Adrenaline.
    Spike Frenzy (cd 3, needs 3 Adrenaline, spends all): 3 strikes at (0.8 + 0.1 per Adrenaline)x on the target and +30% ATK for 2 turns.
    Ultimate Max Voltage (once every 5 waves): 2.4x on the target ignoring DEF, 0.9x on every other enemy, enemies Slowed 2 turns, heals him 10%.
- Also wired: Resonance enhancement, Barbed Grip move upgrade, 3 chips (Sharper Spikes, Adrenal Gland, Overclocked), skins (Dead Battery, Hot Wire), codex blurb, quotes, story lines, Foundation Archive entry. Book row for ID 73 (Generated); Summary reads rows 2 to 74. Containment (High) and Threat are my draft.
- Checked: role audit (no outlier, no mismatch), 12 simulated floor runs with no errors, and the Adrenaline hit trigger and SPD bonus tested by hand.

V143 (REWORK: HOLLOWPOINT IS A HEALER AGAIN)
- Hollowpoint (0071) is a HEALER now: HP 104, ATK 12 (was 15), DEF 6, SPD 9, build Leech. His whole thing is shooting enemies with the shotgun and leeching the damage into healing, and you choose who gets it.
    Buckshot (cd 0): 1.0x on the target, 0.5x on the neighbour. He heals HIMSELF for 45% of the damage dealt (at most 9% max HP before the healer bonus). +1 Shell.
    Mercy Slug (NEW, cd 1, pick an ALLY): he shoots the front enemy for 0.9x and the chosen ally heals 60% of the damage dealt (at most 10% of their max HP before the healer bonus). +1 Shell.
    Void Shot (unchanged: 3 Shells, erases what is left under 25% HP): leech to the most wounded ally 30% (cap 10%). The erase now heals the party 6% and himself 6% (was 10%).
    Leeching Void (unchanged): the whole party leeches for 2 turns.
- HEALER BONUS: healer-role heroes heal 1.3x to 2.4x more depending on the world (HEAL_MULT). Hollowpoint's leech heals now go through that bonus, so every leech has a cap as a share of max HP, and the Wound-closing heals are smaller: a kill heals him 5% and the party 3% (was 8% / 4%). Ultimate Skull Breaks Off heals the party for 12% of the damage dealt, at most 20% max HP (was 25% / 40%). Tune in leechSelf / leechTo / leechHeal (search "function leechSelf").
- Moves from 3 to 4 base skills (Mercy Slug is the new one). Story lines moved from the Damage list to the Healer list. Book row for ID 71 updated (Healer, ATK 12). Role audit: no mismatch.

V144 (NEW FIGHTER: MINDBENDER, ID 0074)
- New playable TANK Mindbender (0074, key mindbender), Other / Protector. HP 148, ATK 11, DEF 10, SPD 7. Built from the May 9th 2024 drawing (abilities on the sheet: Hide, Psycho Shift, Tel Port, Wonder Room). The sheet has no ID, so 0074 is the next free number. Art: your drawing, background removed (EMBED.mindbender, copy in sprites/mindbender.png).
- Focus (max 5, resets each wave): every move builds it, each Focus is +4% damage.
    Hide (cd 2, pick an ally, himself allowed): the ally is Hidden for 2 turns. Enemies cannot single a Hidden hero out while anyone else is visible; area attacks still hit. Heals them 6%. +1 Focus.
    Psycho Shift (cd 1): 0.8x on the target, then every debuff on the whole party is torn off and the 3 worst land on the target (at least 2 turns). If nobody has a debuff it Slows the target. +1 Focus.
    Tel Port (cd 3): the target is Stunned 1 turn (boss: Slowed) and Marked 2 turns; Mindbender takes its place with Taunt 2 turns and Guard 1 turn. +1 Focus.
    Wonder Room (cd 3, needs 3 Focus, spends all): every enemy has ATK and DEF swapped for 3 turns (2 on bosses). Swap is clamped so ATK stays between 0.5x and 1.5x of its own and DEF between 0.5x and 2x (see wrAtk / wrDef). Mindbender +15% DEF for 2 turns.
    Ultimate Everything Bends: Wonder Room + Slow + Mark on every enemy, every ally Hidden 2 turns and healed 12%, Mindbender takes Taunt, Guard and +30% DEF.
- Also wired: 3 chips (Third Eye, Open Mind, Warped Room), 2 upgrade rows, skins, codex blurb, quotes, story lines, Foundation Archive entry, Character Book row for ID 74 (Summary now reads rows 2 to 75).
- New statuses: Hidden (foeTarget skips Hidden heroes) and Wonder Room (eAtk / eDef swap).
- Checked: role audit (no mismatch), 40 simulated runs with him in the party and no errors, all four moves used by the autopilot with no exceptions.

V145 (NEW FIGHTER: BONESAW, ID 0075)
- New playable TANK Bonesaw (0075, key bonesaw), Demon / Retaliator. HP 152, ATK 12, DEF 10, SPD 6. Working name: the Feb 16 2025 sheet has none, rename it in CHARACTERS (name). Role is Tank; if you want him in Damage, change role in CHARACTERS and the Book row.
- One fighter, the whole sheet used: spiral eye + crosshair saw (Saw Arm Marks), the "Weapon" (Uzi), the crowned "Demon friend" (a status that bites back).
- Rev (max 5, resets each wave): every move builds it, and every Demon-friend bite builds it, +5% damage each.
    Saw Arm (cd 0): 1.0x target, 0.6x neighbour, target Marked 2 turns (+15%). +1 Rev.
    Uzi (cd 1): 0.45x on the target, then 3 bursts of 0.35x at random enemies. +1 Rev.
    Demon Friend (cd 3, self): 2 turns of Taunt + Guard + Demon Friend (every enemy that hits him is bitten for 0.4x). Heals 8%. +1 Rev.
    Spin Up (cd 3, needs 3 Rev, spends all): every enemy (0.6 + 0.15 per Rev)x and Slowed 2 turns, one random enemy Marked.
    Ultimate Hungry Friend: 2.2x on the target, 1.0x ignoring DEF on the rest, Mark + Slow all, heals 10%.
- Also wired: 3 chips (Extended Mag, Cold Start, Hungry Friend), 2 upgrade rows, skins, codex blurb, quotes, story lines, Foundation entry, Book row for ID 75 (Summary reads rows 2 to 76). New status: Demon Friend.
- Art: sprites/bonesaw.png (embedded). sprites/bonesaw_friend.png is the cut-out Demon friend, and EMBED.bonesaw_friend holds it, but nothing displays it in game yet.
- Checked: role audit (no mismatch), 30 simulated runs with no errors, all moves incl. the Demon friend bite exercised.

V146 (NEW FIGHTER: KALEIDO, ID 0076)
- New playable HEALER Kaleido (0076, key kaleido), Other / Debuffer. HP 104, ATK 12, DEF 6, SPD 10. Working name: the Dec 2024 sheet has no name, no abilities and no ID, so the name, role and kit are my reading of the drawing (spiral eye, prism eye, grin, chest mouth). Rename in CHARACTERS (name), or change role there and in the Book row.
- Trance (max 5, resets each wave): every move builds it, each Trance makes his heals 4% stronger.
    Spiral Gaze (cd 0): 0.8x, target Blurred 2 turns, most wounded ally heals 6%. +1 Trance.
    Kaleidoscope (cd 1, pick an ally): heals 20% max HP (+4% per Trance) and cleanses. +1 Trance.
    Wide Grin (cd 3): every enemy Slowed 2 turns, party heals 8% (+4% per Trance). +1 Trance.
    Chest Maw (cd 2, needs 3 Trance, spends all): (1.2 + 0.2 per Trance)x ignoring DEF, the party heals 40% of the damage (cap 12% max HP before the healer bonus).
    Ultimate Everyone Smiles: 1.8x target, 0.8x others ignoring DEF, Slow + Guard + 20% party heal.
- Also wired: 3 chips (Prism Lens, Open Eye, Wider Smile), 2 upgrade rows, skins, codex blurb, quotes, story lines, Foundation entry, Book row ID 76 (Summary reads rows 2 to 77). Art: sprites/kaleido.png is NOT needed; the art is embedded (copy in sprites/trance.png).
- Checked: role audit (no mismatch), 20 simulated runs with all four moves forced, no errors.

V147 (NEW FIGHTER: PYRELASH, ID 0077)
- New playable DAMAGE fighter Pyrelash (0077, key pyrelash), Other / Sweeper. HP 100, ATK 15, DEF 6, SPD 9. Working name, role and kit are my reading of the May 14th 2024 sheet (no name, abilities or ID on it). Art: your drawing, background removed (copy in sprites/pyrelash.png).
- Blaze (max 5, resets each wave): every move builds it, each Blaze is +5% damage.
    Lash (cd 0): 1.0x target, 0.5x neighbour, target Scorches 2 turns. +1 Blaze.
    Coil (cd 2): 1.2x and Slow 2 turns. +1 Blaze.
    Whirl (cd 1): 0.5x to every enemy. +1 Blaze.
    Eruption (cd 3, needs 3 Blaze, spends all): every enemy (0.8 + 0.2 per Blaze)x and Scorched 3 turns.
    Ultimate All Six: 2.4x target, 1.1x ignoring DEF on the rest, Mark + Slow all.
- Also wired: 3 chips (Hot Blades, Banked Coals, Overheat), 2 upgrade rows, skins, codex blurb, quotes, story lines, Foundation entry, Book row ID 77 (Summary reads rows 2 to 78).
- Checked: role audit (no mismatch), 30 simulated runs with no errors, all four moves used.

V148 (NEW FIGHTER: OUTBREAK, ID 0078)
- New playable HEALER Outbreak (0078, key outbreak), Other / Debuffer. HP 106, ATK 12, DEF 6, SPD 9. Working name, role and kit are my reading of the Dec 21st 2024 sheet (no name, abilities or ID on it). Art: your drawing, background removed (sprites/outbreak.png).
- Spread (max 5, resets each wave): every move builds it, each Spread = +4% heals. Every Venomed enemy (up to 4) = +6% heals too.
    Toxic Spit (cd 0): 0.8x, Venom 3 turns, most wounded ally heals 5%. +1 Spread.
    Antidote (cd 1, pick an ally): heals 18% max HP and cleanses. +1 Spread.
    Quarantine (cd 3): every enemy Venomed + Slowed, party Guard 1 turn. +1 Spread.
    Biohazard Burst (cd 2, needs 3 Spread, spends all): (0.4 + 0.1 per Spread)x on every enemy, party heals 5% per Venomed enemy + 3% per Spread.
    Ultimate Code Yellow: 1.6x target, 0.9x ignoring DEF on the rest, Irradiate + Slow all, party heals 20%.
- Also wired: 3 chips (Antivenom, Culture Dish, Quarantine Zone), 2 upgrade rows, skins, codex blurb, quotes, story lines, Foundation entry, Book row ID 78 (Summary reads rows 2 to 79).
- Checked: role audit (no mismatch), 20 simulated runs with all four moves forced, no errors.

V149 (REWORK: CHARACTERS 71-78 BACK TO 3 MOVES)
- Six of the eight fighters (0071, 0074, 0075, 0076, 0077, 0078) had 4 moves. Every playable fighter now has exactly 3 (plus the Divine ultimate chip as before). Ghost (0072) and Voltage 77 (0073) already had 3 and are unchanged. Stats, meters and chips keep their names.
- Hollowpoint (0071): Leeching Void is folded into Void Shot. Void Shot now also makes the whole party leech 12% of damage dealt for 2 turns. Moves: Buckshot, Mercy Slug, Void Shot.
- Mindbender (0074): Hide is folded into Wonder Room. Wonder Room now also Hides the most wounded ally for 2 turns and heals them 6%. Moves: Psycho Shift, Tel Port, Wonder Room. Chip Third Eye now makes that Hide and Tel Port's Taunt last 1 turn longer.
- Bonesaw (0075): Uzi is folded into Saw Arm. Saw Arm is now 1.0x target, 0.5x neighbour, Mark, then 2 uzi bursts of 0.2x at random enemies. Moves: Saw Arm, Demon Friend, Spin Up. Chip Extended Mag now adds 2 bursts to Saw Arm.
- Kaleido (0076): Wide Grin is folded into Chest Maw. Chest Maw now also Slows every enemy for 2 turns (the party heal comes from the bite as before). Moves: Spiral Gaze, Kaleidoscope, Chest Maw. Chip Wider Smile now Marks every enemy on Chest Maw. Divine enhancement Rictus moved to Chest Maw.
- Pyrelash (0077): Coil is folded into Lash. Lash now also Slows the target for 1 turn. Moves: Lash, Whirl, Eruption.
- Outbreak (0078): Quarantine is folded into Toxic Spit and Biohazard Burst. Toxic Spit splashes the enemy beside it (0.4x, Venom 3% per turn). Biohazard Burst now also Slows every enemy for 2 turns and Guards the party for 1 turn. Moves: Toxic Spit, Antidote, Biohazard Burst. Chip Quarantine Zone now lengthens Burst's Slow. Divine enhancement Full Lockdown moved to Biohazard Burst.
- Book: notes for Mindbender and Kaleido updated. Foundation Archive lore is unchanged (it describes the sheet abilities, not the move list).
- Checked: script syntax, role audit (no mismatch), 12 simulated runs per fighter with chips, plus every changed move force-fired 50+ times each, no errors.

V150 (OUTBREAK MOVED FROM HEALER TO TANK)
- Outbreak (0078) is now a TANK (Other / Debuffer). Stats HP 148, ATK 11, DEF 10, SPD 6 (was HP 106, ATK 12, DEF 6, SPD 9). The bulky design reads as a wall, not a nurse. Still 3 moves.
    Toxic Spit (cd 0): 0.8x target, 0.4x neighbour, both Venomed. Outbreak heals himself 3% max HP per Venomed enemy (up to 4). +1 Spread. (No longer heals an ally.)
    Antidote (cd 1, pick an ally, himself allowed): heals 10% max HP (was 18%), cleanses, and Guards them for 2 turns. Still stronger with Spread and Venomed enemies. +1 Spread.
    Biohazard Burst (cd 2, needs 3 Spread, spends all): (0.4 + 0.1 per Spread)x on every enemy, Slows all, party Guard 1 turn, party heals 3% per Venomed enemy + 2% per Spread (was 5% and 3%). New: Outbreak takes Taunt 2 turns and +15% DEF 2 turns.
    Ultimate Code Yellow: 1.6x target, 0.9x ignoring DEF on the rest, Irradiate + Slow all, party Guard 1 turn and Outbreak heals 15% (was a 20% party heal).
- Chips: Antivenom now also makes Antidote's Guard last 1 turn longer. Concentrated Acid heals him 5% instead of an ally. Full Lockdown (Divine) now gives Guard instead of a heal.
- Codex blurb, passive text and Book row (ID 78: role Tank, stats updated) changed to match. The Book note says "moved in v150".
- Healers among the new fighters are now Hollowpoint, Ghost and Kaleido; Tanks are Mindbender, Bonesaw and Outbreak.
- Checked: script syntax, role audit (no mismatch, Outbreak sits at +0.02 overall), 12 simulated runs with and without his chips, Biohazard Burst forced 100+ times, no errors.


V151 (NEW ART: MINDBENDER, HOLLOWPOINT, BONESAW, DEMON FRIEND)
- Mindbender (0074): new pixel sprite, mirrored left to right, white background removed. Replaces the old sketch (EMBED.mindbender, copy in sprites/mindbender.png).
- Hollowpoint (0071) and Bonesaw (0075): new pixel sprites, white background removed (EMBED and sprites/ copies replaced). Stray marks and white pockets inside Bonesaw's cables were cleaned up.
- Demon Friend: new sprite (EMBED.bonesaw_friend, sprites/bonesaw_friend.png). It now shows in battle: while Bonesaw has the Demon Friend status the friend floats beside him and bobs; it disappears when the status ends or he falls.
- Checked: script syntax and a 40-run simulation with no errors.

V152 (NEW ART: PYRELASH, VOLTAGE 77, OUTBREAK, KALEIDO)
- New pixel sprites for Pyrelash (0077), Voltage 77 (0073), Outbreak (0078) and Kaleido (0076). White backgrounds removed (JPEG edges cleaned, a few enclosed white gaps removed on Pyrelash and Outbreak). Replaces the old sketches in EMBED and in sprites/.
- Kaleido's glitch dust specks around the head are kept as part of the art.
- Checked: script syntax and a 30-run simulation with no errors.

V153 (FIX: UMBRA AND OX SPRITES)
- The embedded art for Umbra (proto_0065) and Ox was corrupted (image data cut off, bottom half garbage). Ox restored from v102.
- Checked: every embedded image in the file now decodes.

V154 (UMBRA PIXEL ART RESTORED)
- Umbra (proto_0065) is back to the pixel-art sprite, taken from v134 (the v153 sketch was a stopgap). Copy in sprites/proto_0065.png. Ox stays as restored in v153.

V155 (SMALLER FILE)
- Embedded art and sprites/ PNGs shrunk to 420px max. Zip went from 20MB to 10.5MB.

V156 (NEW FIGHTERS: TRIGGERFINGER, NANE NANE)
- Triggerfinger (0081, Damage, Hybrid, Minelayer). HP 104, ATK 15, DEF 7, SPD 12. Mines (max 5, resets each wave): each Mine +4% damage.
    Speed Dash: 1.0x + 0.5x on the next enemy, +1 Mine. Beacon of the Lost Soul (cd 2): 0.6x, Marks 3 turns, Slows 1, +1 Mine. Landmine Eruption (cd 3, needs 3 Mines, spends all): (0.7 + 0.2/Mine)x on every enemy.
    Chips: Hair Trigger, Crow's Feathers, Soul Static, Pressure Plate, Beacon Never Sleeps (Mythic). Skins: Lost Soul Blue, Rust Alarm.
- Nane (0082, Healer, Human, Seeing Sound). HP 98, ATK 12, DEF 6, SPD 11. Sound (max 5, resets each wave): each Sound +5% healing, +4% damage.
    Sound Blast: 0.9x + 0.4x next, Slows 1, +1 Sound. Sound Breathing (cd 1): heals an ally 24%, cleanses, +15% ATK 2 turns, +1 Sound. Energy Punch (cd 2, needs 3 Sound, spends all): (1.4 + 0.25/Sound)x ignores DEF, party heals (4% + 2%/Sound).
    Chips: Resonant Throat, Higher Pitch, Echo Chamber, Held Note, Seeing Sound (Mythic). Skins: Alternate Crimson, Beta Violet.
- Both also get a Divine Ultimate, Divine Enhancement, extra chip, Archive entry and Book row. Art cut from your drawings (sprites/triggerfinger.png, sprites/nanenane.png).
- IDs 0079 and 0080 were reserved for C-Ruin and Shamoon (added in V175).

V157 (NEW FIGHTERS: REFLUX, KASUGU)
- Reflux (0083, Tank, Demon, Vampire Lord). HP 152, ATK 12, DEF 10, SPD 8. Blood (max 5, resets each wave): each Blood +4% damage.
    Blood Sucking: 1.0x, heals him 5% (+2%/Blood). Blood Freezing (cd 2): 0.7x, Slows 2 turns, 0.4x on the next enemy. Time Stop (cd 3, needs 3 Blood, spends all): (0.5 + 0.15/Blood)x on all, Slows 2, he takes Taunt, +25% ATK, +15% DEF.
    Chips: Thirstier Fangs, Cold Veins, Blood Bank, Borrowed Seconds, Ten Seconds More (Mythic). Skins: Blood Moon, Pale Lord. Spirit The Lasher is in his Archive entry.
- Kasugu (0084, Damage, Human, Dark Thunder). HP 100, ATK 16, DEF 5, SPD 13. Anger (max 5, resets each wave): each Anger +5% damage, +10% more at 5.
    Thunder Spike Slash: 1.0x + 0.5x next. Demon Speed Dash (cd 1): 0.9x ignores DEF. Dark Thunder Breathing (cd 3, needs 3 Anger, spends all): (0.7 + 0.2/Anger)x on all, Slows 1, Marks all at 5 Anger (V172: Digital Manipulation = at 5 Anger the Slow lasts 2 turns instead of 1).
    Chips: Thunder Edge, Afterimage Step, Short Fuse, Dark Sky, Digital Overload (Mythic). Skins: Overload Red, Dark Thunder.
- Name is read as Kasugu from the sheet (could be Kasuqu). Both also get a Divine Ultimate, Enhancement, extra chip, Archive entry and Book row.

V158 (NEW FIGHTERS: CONQUER, TEARWING)
- Conquer (0085, Tank from V172 (was Damage), Hybrid, Brutal Fighter). HP 118, ATK 16, DEF 8, SPD 5 (weakness: slow). Torment (max 5, resets each wave): each Torment +5% damage.
    Claw Swipe: 1.1x + 0.5x next, +1 Torment. Chain of Torment (cd 2): 0.7x (+0.3x under half HP), Marks 3 turns, Slows 2, +1 Torment. Touch of Paralysis (cd 3, needs 3 Torment, spends all): (1.3 + 0.25/Torment)x ignores DEF, Stuns 1 turn (bosses Slowed).
    Chips: Heavier Chains, Old Grudge, Vengeful Heart, Merciless Touch, Total Paralysis (Mythic). Skins: Pale Conqueror, Iron Chain.
- Tearwing (0086, Healer, Angel, Bleeding Angel). The second "Weeping Angel" drawing, renamed because ID 46 already is Weeping Angel. HP 104, ATK 11, DEF 6, SPD 9. Tears (max 5, resets each wave): each Tear +5% healing, +3% damage.
    Bleeding Tear: 0.8x, heals the most hurt ally 6% (+2%/Tear). Bandage Wrap (cd 1): heals an ally 22%, cleanses, Guard 1 turn. Sorrow Flood (cd 3, needs 3 Tears, spends all): (0.4 + 0.1/Tear)x on all, Slows 1, party heals (8% + 3%/Tear) and Guards 1 turn.
    Chips: Salt Water, Thicker Bandages, Endless Weeping, Open Floodgates, Choir of Sorrow (Mythic). Skins: Blue Weep, Golden Vigil.
- Both also get a Divine Ultimate, Enhancement, extra chip, Archive entry and Book row.

V159 (NEW FIGHTERS: STITCHHEART, BLOODSPIKE)
- Stitchheart (0087, Tank, Demon, Heart Guardian; reworked in V172, see below). The sheet had no name, so the game calls it Stitchheart. HP 150, ATK 11, DEF 11, SPD 7. Heartbeat (max 5, resets each wave): each Heartbeat +4% damage and healing.
    Stitch Lash: 0.9x, heals it 4%. Heart Tether (cd 2): ally heals 12%, Guard 2 turns, it takes Taunt 1 turn. Cardiac Arrest (cd 3, needs 3 Heartbeat, spends all): (0.5 + 0.12/Heartbeat)x on all, Slows 1, Taunt 2, +15% DEF, heals itself.
    Chips: Thick Thread, Double Stitch, Second Pulse, Arrhythmia, Open Heart (Mythic). Skins: Valentine, Dead Rose.
- Bloodspike (0088, Damage, Other, Quill Brute; reworked in V172, see below). Sheet only had the name and date (March 26th 2025), so the moves are invented. HP 104, ATK 16, DEF 6, SPD 10. Quills (max 5, resets each wave): each Quill +5% damage.
    Spike Jab: 1.0x, bleeds 2 turns. Rainbow Quills (cd 2): 0.5x to all. Impale (cd 3, needs 3 Quills, spends all): (1.4 + 0.3/Quill)x ignores DEF, bleeds 3 turns, 0.5x on the next enemy.
    Chips: Barbed Tips, Rainbow Coat, Quills Out, Pin Cushion, Blood Rainbow (Mythic). Skins: Blood Prism, Ash Spikes.
- Both also get a Divine Ultimate, Enhancement, extra chip, Archive entry and Book row (Source: Generated, change to Book once the details are yours).

V160 (NEW FIGHTERS: NAGINATA, UQUNA)
- Naginata (0089, Damage, Demon, Soul Eater). HP 102, ATK 16, DEF 6, SPD 11. Souls (max 5, resets each wave): each Soul +5% damage.
    Slicing Blade: 1.2x ignores DEF, +1 Soul. Paralyzing Spore (cd 2): 0.4x to all, Slows 2, +1 Soul. Soul Eater (cd 3, needs 3 Souls, spends all): (1.4 + 0.25/Soul)x ignores DEF, heals itself (12% + 4%/Soul).
    Chips: Sharper Still, Thicker Spores, Fresh Souls, Longer Life, Gluttony of Souls (Mythic). Skins: Frostbite, Rust Orange.
- Uquna (0090, Tank; capture mechanic added in V172, see below, Other, Monochrome Hell). Sheet ID 5506, Containment EXTREME. HP 158, ATK 11, DEF 11, SPD 6. Hunger (max 5, resets each wave): each Hunger +4% damage.
    Gut Whip: 0.8x, Slows 2, 0.4x next enemy, +1 Hunger. Monochrome Hell (cd 3): 0.5x to all, Taunt 2 + Guard 1, +1 Hunger. Feeding Time (cd 2, needs 3 Hunger, spends all): (1.2 + 0.25/Hunger)x ignores DEF, heals (8% + 4%/Hunger), +15% DEF 2 turns.
    Chips: Longer Guts, Thick Metal Skin, Empty Stomach, Dead Cows, Black Liquid (Mythic). Skins: Blood Hell, Negative.
- Both also get a Divine Ultimate, Enhancement, extra chip, Archive entry and Book row. Naginata/Uquna sheet backgrounds were removed (gray and white) and the text cut away.

V161 (PHONE LOADING FIX)
- The old "Checking game..." box froze if scripts never ran. It now counts seconds, shows a clear message after 25s, shows any script error on screen, and a no-JavaScript warning appears if scripts are blocked.
- Images shrunk again (320px max). File is 7.9MB.
- If it still says it did not start: you are probably in a file preview / in-app viewer that blocks scripts. Open the .html in Chrome or Firefox (Files app > Share/Open with > Chrome).

V162 (CASINO EXPANSION)
- BOSSES for floors 13-16 (no more reused bosses): The Vault (steel safe: Lockdown / Combination / Time Lock / Pressure Vent), The Magnate (steals coins to heal, board meeting, Golden Handshake), The Dealer Below (shows a poker hand each turn: pair, two pair, trips, flush, royal flush), The Odds (51% House Wins vs Bad Beat, All In at low HP).
- 5 NEW REGULARS: Comp Waiter (heals allies), Chip Golem (splits into chips), Card Sharp (hits two, marks), Winning Ticket (unfolds, then cashes in on everyone), The Fixer (allies +25% ATK). Unlock floors 4/7/9/11/13. Sprite notes: docs/casino_enemy_designs.txt.
- 3 NEW MINIGAMES on the floor: Coin Flip Streak, Three-Card Monte, Lucky Doors.
- CASHIER'S CAGE (floor shop, spends coins): Free Drinks, Loaded Dice, Bodyguard, Lucky Charm, High Roller Chip (a random casino-only chip), Marker Wipe. Stock refreshes each floor.
- 10 CASINO-ONLY CHIPS (cc1-cc10, flag casino:true): only appear in shops, the Byte Shop and the Cage while in the Casino. Mythics: The House Edge, Royal Flush.
- 2 NEW BATTLE EFFECTS: Double Down (every 3rd round all hits x1.5) and High Limit (everyone +15% damage, +20 coins at wave start).
- Magnate calls security at most twice per fight (a test found a stalemate otherwise).

V163 (REROLLS)
- Chip Shop reroll: ONE per shop visit, costs 90 coins (RR_SHOP). It was 12 +8 each time.
- Reward card reroll: ONE per reward screen, costs 60 (+15 for every one you used earlier in the run, max +150). Lucky Break free rerolls still work. Endless no longer has unlimited rerolls.

V164 (REFLUX SPRITE)
- Reflux has a new sprite, cut from your drawing (background removed), in the HTML and in sprites/reflux.png.

V165 (NEW SPRITES)
- New art for Stitchheart, Triggerfinger, Naginata and Kasugu (backgrounds removed; the small icon in the corner of the Kasugu image was cut off). Replaces the old art in the HTML and in sprites/<name>.png.
- The sprites had no names, so they were matched by look. if one belongs to a different fighter.

V166 (SPRITE FIX)
- The sprite I first put on Kaleido is Bloodspike's. Kaleido has his old art back and Bloodspike has the new one.

V167 (BONESAW REWORK)
- Bonesaw's gameplay identity: the Demon Friend is no longer a retaliation effect (Kano and Creep already cover thorns/reflect/Grin). It is now an active partner. Build changed from Retaliator to Disruptor (Tank that Marks and Slows), so he no longer shares a build with Kano, Creep and Flick.
- Demon Friend (cd 3): out for 3 turns (was 2). It Marks a random enemy on release, and the bite-back on being hit is gone. Bonesaw gets Guard and heals 8%, but NO LONGER Taunts. If you want the Taunt back, add addStatus(u,'taunt',L,1) to bsfriend.run.
- While the friend is out: (1) at the start of Bonesaw's turn it attacks on its own: 0.4x bite on a Marked enemy (any enemy if none), Marks it, +1 Rev. (2) Saw Arm gets an extra bite on the target (0.75x of the friend's bite) and Marks a second enemy. (3) Spin Up also bites every Marked enemy for 0.3x.
- Saw arm, uzi and the friend sprite are unchanged. Chip Hungry Friend still works (+1 turn, bites 0.6x). Archive, codex blurb, passive text and one quote updated.

V168 (PYRELASH REWORK)
- Pyrelash overlapped Sunburst (both Scorch fire damage with an area move that burns everyone). He is now a tentacle CONTROLLER: build Sweeper -> Controller, no fire or Scorch at all.
- Meter Blaze is now Grip (max 5, resets each wave, +5% damage per Grip, shown in the counter row). Internal field is u.grip, helper gripm().
- Lash (1.0x target, 0.5x neighbour): the target is Bound for 2 turns (Slowed and deals 20% less damage), the neighbour is Slowed for 1 turn. +1 Grip.
- Whirl (cd 1): 0.4x to every enemy (was 0.5x) and Slows every enemy for 1 turn. +1 Grip.
- Eruption is now Strangle (same skill id pyerupt): needs 3 Grip, spends all. (0.6 + 0.15 per Grip)x to every enemy (was 0.8 + 0.2 per Blaze), Slows everyone for 2 turns, and STUNS every enemy that has not acted yet this round (bosses are only Slowed, the game already does that for Stun).
- Chips renamed, ids kept: py1 Tight Knots (Lash binds 1 turn longer), py2 Coiled (start each wave with 2 Grip), py3 Death Grip (Strangle needs 2 Grip, keeps 1). Mythic upgrade row Supernova Crown is now Crown of Lashes. Passive, codex blurb and Foundation entry updated.
- Numbers are first guesses: raw damage is lower than before (no burn damage over time), so run fal125_sim.js on him and Bloodspike and adjust Whirl 0.4x and Strangle 0.6x if he underperforms.

V169 (OUTBREAK HEALING TUNE)
- Outbreak stays a Tank. His self-heal on Toxic Spit is cut from 3% to 2% max HP per Venomed enemy (cap of 4 enemies unchanged), so the most it can restore is 8% per use instead of 12%. Skill text updated.
- Note: this heal is on Toxic Spit (cd 0), not a free passive, so it only happens on turns he uses Toxic Spit. His other heals (Antidote on allies, Biohazard Burst on the party) are untouched.
- Not changed: the Venomed-enemy bonus to his heals (+6% each) and Spread (+4% each) still apply to Antidote and Biohazard Burst, not to this self-heal.

V170 (NANE NANE vs TEARWING vs SEVALIO)
- Nane stays a Healer but is now clearly the OFFENSIVE healer. Tearwing is the DEFENSIVE healer. Sevalio is untouched (single-target Triage healer with Transfusion Stitch and Thread Snare).
- SEEING SOUND is now a real passive. At the start of her turn, if any enemy is Slowed she hears it and gains +1 Sound, and she hits Slowed enemies for +15% (shows as "Seeing Sound +15%" in the damage breakdown). It pairs with Sound Blast, which Slows.
- Sound Blast: 1.0x target (was 0.9x), 0.5x neighbour (was 0.4x). Sound Breathing: heals 20% (was 24%), ATK buff +20% (was +15%). Energy Punch: (1.5 + 0.3 per Sound)x (was 1.4 + 0.25), the shockwave also hits the neighbour for half, party heal (3% + 1.5% per Sound) (was 4% + 2%).
- Mythic chip Seeing Sound is renamed Perfect Pitch (it clashed with the passive). It now gives the party +10% ATK on Sound Breathing and makes Energy Punch hit every other enemy for (0.5 + 0.1 per Sound)x, instead of extra healing.
- Tearwing: no more damage bonus from Tears (they are +5% healing only). Bleeding Tear 0.6x (was 0.8x) but heals the most hurt ally 8% + 2% per Tear (was 6%). Sorrow Flood 0.3 + 0.1 per Tear (was 0.4), and the party also gets +15% DEF for 2 turns on top of Guard. Her chips are unchanged.
- Numbers are first guesses; run fal125_sim.js on Nane, Tearwing and Sevalio to see how they compare.

V171 (REFLUX REWORK)
- Reflux overlapped Vor (blood Tank, self-heal, resource bruiser, Taunt, defence boosts). He stays a Tank but is now the time-bending vampire. Build Bruiser -> Regenerator.
- Blood is now gained only by DRAINING: Blood Sucking gives +1, or +2 if the target is Slowed. Blood Freezing no longer builds Blood (it sets up the double bite). The old +4% damage per Blood is gone; Blood now makes his vampiric drain stronger instead.
- Blood Sucking: 1.0x, and he drinks back (25% + 8% per Blood) of the damage dealt as HP (was a flat 5% + 2% per Blood of max HP). Chip Thirstier Fangs now means the drink-back is 50% stronger.
- NEW passive VAMPIRE REGENERATION: at the start of each of his turns he mends 2% max HP, +1% per Blood (up to 7%), when he is wounded.
- Time Stop: needs 3 Blood, spends all. (0.4 + 0.12 per Blood)x to every enemy (was 0.5 + 0.15) and Slows all for 2 turns. NO Taunt and no DEF buff any more. He REWINDS: heals the HP he has lost since the start of his last turn (max 30% max HP), then +25% ATK and a new Haste status (+30% SPD) for 2 turns.
- New status Haste (+SPD), added to eSpd. Mythic chip Ten Seconds More now gives the whole party Haste for 2 turns (was Guard) and still heals Reflux 15%.
- Not changed: Lasher, sprite, Blood Freezing damage and Slow, chips Cold Veins, Blood Bank, Borrowed Seconds. Archive and passive text updated.
- First-guess numbers. His self-sustain is now regen + drain + rewind, so check how long he survives in fal125_sim.js against v170. The 'Ten Seconds of God' mythic upgrade row still carries guard:1 in its parameters; change it if you want Guard fully gone.

V172 (KASUGU, CONQUER, TEARWING)
- Kasugu: Digital Manipulation (on the sheet but never a move) is now part of his Overload. At 5 Anger, Dark Thunder Breathing also cuts the lights and screens: the Slow lasts 2 turns instead of 1. No new attack (Smiley.wires and Glitch already cover hacking).
- Conquer moves from Damage to TANK (his build was already Bruiser, a Tank build). HP 118 -> 150, ATK 16 -> 12, DEF 8 -> 10, SPD 5 (weakness: slow). Each Torment now also gives +4% DEF (and still +5% damage). Chain of Torment makes him take Taunt for 2 turns so the enemy line has to deal with him. Character Book row updated (role and stats). Chips unchanged.
- Tearwing identity pass (she overlapped Sevalio, Sleepy and the Wardens, and Weeping Angel 0046 visually). Weeping Angel = Protector: wards one ally and punishes attackers. Tearwing = Bleeding healer: she opens wounds and mends. She no longer gives Guard or DEF.
- NEW: Bleed on enemies. Bleeding Tear makes the target Bleed 2 turns (3% max HP per turn). Sorrow Flood makes EVERY enemy Bleed 3 turns, and no longer Guards the party or gives +15% DEF.
- NEW: her healing grows with every Bleeding enemy (+3% each, on top of +5% per Tear): she drinks the suffering she opens. Sorrow Flood heals the party an extra 2% for every enemy already Bleeding when it lands.
- Bandage Wrap: Guard removed; it now also cleanses Bleeding, and if it cleansed anything she absorbs the suffering as +1 extra Tear.
- Chip Thicker Bandages (Guard 1 turn longer) is replaced by Deeper Cuts (Rare: Bleeding Tear and Sorrow Flood bleed 1 turn longer). Her Divine Ultimate and Enhancement no longer give Guard (heal 25% instead).
- Numbers are first guesses; run fal125_sim.js on Conquer, Tearwing and Weeping Angel.

- Stitchheart (V172 rework, same release). Heart Tether copied Weeping Angel's Weeping Veil (heal + Guard + Taunt to protect one ally). It is now a real link between two fighters, so Stitchheart is the DAMAGE-SHARING tank. Build Guardian -> new build Heartbound.
    Heart Tether (cd 2): ties him to one OTHER ally for 3 turns (picking himself ties the most hurt other ally). While tethered, 35% of all damage that ally would take (hits and damage over time) goes to Stitchheart instead, reduced by his higher DEF. The first hit he absorbs each round gives +1 Heartbeat, and every absorbed point is stored as Pain (max 50% of his HP). No Guard, no Taunt, no heal on the ally. Tethering a new ally cuts the old tie.
    Stitch Lash: unchanged damage and self-heal, and the tethered ally gets half of that heal ("the shared pulse").
    Cardiac Arrest: as before, plus the stored Pain is released: every enemy takes 40% of it on top of the hit. Pain then resets.
    Chips: Thick Thread now means Stitch Lash heals 50% more. Double Stitch is now "Heart Tether lasts 1 turn longer and takes 5% more of the damage" (was Guard 1 turn longer). Open Heart (Mythic) now heals the party 12% and no longer Guards it. Arrhythmia, Second Pulse unchanged.
    Note: Abomination Devic already shares damage (Fuse Together: fused allies pass 40% to him) but also gives Guard and +DEF and can fuse several allies. Stitchheart's tether has no Guard/DEF, links ONE ally, works both ways and feeds a meter. Check both in fal125_sim.js; if they still feel the same, the easiest lever is cutting Devic's Guard or Stitchheart's share.

- Bloodspike (V172 rework, same release). His kit had the same shape as the old Pyrelash (basic builds a resource, hit-all, resource-spending finisher with damage over time). Pyrelash was already moved to a binding/interrupting Controller in V168, so Bloodspike becomes the single-target Bleed executioner. The sheet gave only his name, so all three moves are the game's.
    NEW Bleed stacks live on the enemy (max 5, each stack = 1.5% max HP per turn, 3 turns, refreshed by new stacks). Uses the normal Bleeding status, so Tearwing's bleed on an enemy counts as 1 stack.
    Spike Jab: 1.0x, +1 Bleed stack, +1 Quill.
    Rainbow Quills (cd 2, now single target, was hit-all): three quills, 0.4x each, each adding a Bleed stack. When the target is at 5 stacks the remaining quills spill onto the enemy beside it. +1 Quill.
    Impale (cd 3, needs 3 Quills, spends all): (1.0 + 0.25/Quill + 0.3/Bleed stack)x ignoring DEF, then the rest of the bleed is paid out at once (up to 30% of the target's max HP) and the Bleed ends. A non-boss left under (15% + 4% per stack) max HP is Executed. No more splash on the enemy beside it.
    Chips: Rainbow Coat is now 0.55x per quill (was 0.7x hit-all). Blood Rainbow (Mythic) now gives every OTHER enemy 2 Bleed stacks and Marks them. Barbed Tips, Quills Out, Pin Cushion unchanged. Build Impaler text updated.
    First-guess numbers. Execute thresholds only matter on tougher enemies; check Impale on bosses (no execute, but hemorrhage is capped at 30% of max HP).

- Uquna (V172, same release). Stays a Tank (Containment). His kit was slow + Taunt\/Guard + heal-hit, so the capture weapon from the sheet ("guts used as a capture weapon") is now a real mechanic.
    NEW status Captured. Gut Whip (0.8x, 0.4x on the enemy beside it) CAPTURES its target for 3 turns: the captive deals 30% less damage (20% for bosses) and is Slowed 2 turns as before. Uquna holds ONE captive; capturing another lets the first go.
    While he holds a captive he gains +1 Hunger at the start of each of his own turns ("It waits"), on top of Gut Whip's +1.
    Monochrome Hell (0.5x to all, Taunt 2, Guard 1, +1 Hunger) now also renews the capture to full length.
    Feeding Time (needs 3 Hunger, spends all, ignores DEF, heals 8% + 4%/Hunger, +15% DEF 2 turns): if the target is his CAPTIVE it is eaten: +50% damage, DOUBLE the healing, and the capture ends. Use it on the held enemy, not another one.
    Chip Longer Guts now means the capture (and Slow) lasts 1 turn longer. Build text for Containment updated.
    First-guess numbers: the -30% damage on one enemy plus the extra Hunger is the lever to tune. If he feeds too fast, drop the per-turn Hunger gain.

V173 - Difficulty curve pass (per-world enemy scaling, W3 / W7 / W8)
    Why: the last-floor enemy HP multiplier was uneven across worlds (W1 1.7, W2 1.95, W3 1.7, W4 1.0, W5 2.05, W6 2.15, W7 2.6, W8 1.4). W3 started below W2, W7 spiked, and the finale was the gentlest main world.
    World 3 floors   1.1-1.7  -> 1.2, 1.3, 1.45, 1.6, 1.75  (no longer starts below World 2)
    World 7 floors   1.5-2.6  -> 1.4, 1.45, 1.5, 1.6, 1.7, 1.8, 1.95, 2.1, 2.25, 2.4  (gentler entry and peak; the first three floors were the wall)
    World 8 floors   1.0-1.4  -> 1.0, 1.1, 1.25, 1.4, 1.55
    World 8 bosses (HP/ATK): Loading Bar 1400/14 -> 1500/16, Checkerboard King 2000/16 -> 2150/18, Clipper 2400/17 -> 2600/19, Console 2800/18 -> 3000/20.
    The Amalgam: HP 6000 -> 6800, ATK 22 -> 24, DEF 12 unchanged (it was weaker than The Open Eye and Serpentine, Awake).
    Check (sim, level 10, 30 runs, seed 5, autopilot, so directional only): W7 3.3% wins / 10.5 waves -> 10.0% / 12.3. W8 16.7% / 13.3 -> 10.0% / 10.6. W3 16.7% / 19.6 -> 23.3% / 22.1 (within noise). Re-run with more runs before trusting small differences.

V174 - Feedback pass: Story unlock default, World 5 entry ramp, no-healer teams
    1) Story unlock: the fresh-save default for "Unlock all worlds" is now Off (was On), so a new Story save starts at World 1 and the worlds open in order. The setting is still in Settings. Existing save slots keep whatever they already had.
    2) World 5 entry (Safe Haven -> Freedom at a Price): floor multipliers 1.3, 1.45, 1.6, 1.8, 2.05 -> 1.2, 1.38, 1.58, 1.8, 2.05, and the first four regular waves get an extra warm-up factor (WORLD_DATA[4].ease = .86, .91, .96, 1), so wave 1 is about 1.03x (Safe Haven ends at 1.0x) and it ramps to 1.2x by wave 4. Floors 3-5 are unchanged. A Story-only line on wave 1 marks the step down. Safe Haven recovery (full heal, 60% revive) is unchanged.
    3) No-healer teams (no fighter with the Healer role): between-wave recovery is 25% max HP and fallen heroes get up at 25% (normal is 15% / 15%; Safe Haven unchanged). TUNE: WAVE_HEAL_NH and REVIVE_NH next to WAVE_HEAL.
       5 new reward cards: Field Rations (+10% heal after every wave), Triage Training (most wounded hero heals 4% each hero turn), Scar Tissue (20% less damage below 40% HP), Brace for Impact (first hit each hero takes per wave is halved), Adrenal Patch (below 35% HP: heal 15% + Guard 2 turns, once per hero per wave).
       A no-healer team is always offered at least one sustain/defense card on every reward screen (SUSTAIN_CARDS list).
       4 new chips: Ration Pouch (Common), Triage Tag (Rare), Shock Padding (Rare), Adrenal Injector (Epic). The chip shop rolls sustain chips 1.8x as often for no-healer teams (SUSTAIN_CHIPS list).
    Check (sim, World 5 floor 1, 80 runs, seed 3): loads and plays clean. Numbers are first guesses; watch no-healer win rate in the role/party-shape tables.

V175 - NEW FIGHTERS: C-RUIN, SHAMOON (finally fully added)
    The two April 21st 2025 drawings that had been waiting as Book drafts. The old IDs on the pictures are ignored; they use the reserved IDs 0079 and 0080. Art cut from the drawings (sprites/cruin.png, sprites/shamoon.png, also embedded).
- C-Ruin (0079, Tank, Demon, Gravity Ruin, build Disruptor). HP 150, ATK 12, DEF 10, SPD 6. Gravity (max 5, resets each wave): each Gravity +4% damage.
    Gravity Well (cd 0): 0.9x, 0.4x on the next enemy, Slows the target 1 turn, +1 Gravity.
    Side Swap (cd 2): the target trades places with the FRONT enemy (or the last one if it is already in front), so it changes who counts as "the enemy next to" a target. 0.6x, Marks the target 2 turns, Slows the displaced enemy 1 turn, C-Ruin gets Guard 1 turn, +1 Gravity.
    Slowing Time (cd 3, needs 3 Gravity, spends all): (0.5 + 0.12/Gravity)x on all, Slows 2 turns, C-Ruin gets Guard 1 turn and +15% DEF 2 turns. At 5 Gravity the Slow lasts 3 turns and the whole party gets Haste for 1 turn.
    Chips: Heavier Air, Clean Swap, Falling Upward, Event Horizon, Frozen Second (Mythic). Divine: Gravity Collapse (ultimate), Crushing Weight (Gravity Well), Tidal Drag (extra chip after Side Swap). Skins: Red Shift, Event Horizon.
- Shamoon (0080, Damage, Other, Light Eater, build Duelist). HP 104, ATK 14, DEF 6, SPD 10. Light (max 5, resets each wave): each Light +5% damage. The sheet marks it Sinister 7, 1/7.
    Shadow Sword (cd 0): 1.0x + 0.5x next, +1 Light.
    Umbra Claw (cd 1): 1.2x ignores DEF, recovers 3% max HP, +1 Light.
    Shadow Puppeteering (cd 3, needs 3 Light, spends all): (0.6 + 0.18/Light)x on all, Marks all 2 turns, Slows 1 turn at 5 Light. Shadow Armour is built in: Shamoon gets Guard 1 turn and +15% DEF 2 turns afterwards.
    Chips: Sharper Shadow, Hungry Claw, Stolen Daylight, Lights Out, Seven Shadows (Mythic). Divine: Total Eclipse (ultimate), Seven-Edged Shadow (Shadow Sword), Umbra Grip (extra chip after Umbra Claw). Skins: Blue Hour, Ash Light.
- Both also have a Foundation Archive entry, Story lines, a roster blurb, battle quotes and a Book row (Source stays Generated: Containment, Threat and Scent are still drafts for you to review).
- Note: the sheet abilities were folded into 3 moves each: Gravitational Manipulation = the Gravity meter, Absorbing Light = the Light meter, Shadow Armour = the guard after Shadow Puppeteering.
- Code names to know: skills crnwell/crnswap/crnslow and shmsword/shmclaw/shmpuppet; counters gravity and lumen; chips gr1-gr5 and sd1-sd5.
- Check (headless, floor runs, autopilot, 25 random parties each): no errors; damage share C-Ruin 0.19 (Uquna 0.18), Shamoon 0.35 (Kasugu 0.37). Win rate is 100% on one floor for everyone, so run fal125_sim.js (full world) before trusting balance. Role audit: C-Ruin and Shamoon are inside the normal range for their role.

V177 - STORY CONSEQUENCES (World 4 -> World 5, World 6 -> World 7)
    Earlier choices now change later conversations. Worlds are 0-based in code: World 4 = 3, World 6 = 5.
    1) WHAT IS REMEMBERED. While a Story world runs, RUN.sc collects: the boss talk you picked, the kind / greedy counts, the button you pressed at route events (keyed by the event title, e.g. "The Guest Book" = "Sign in"; the Medical Wing, Containment and Staff Only routes too), and fighters you recruited or walked away from. When you WIN that world it is saved to SAVE.sc[world] (in the save slot). A lost attempt never overwrites an earlier win. Freeplay is never recorded.
    2) WORLD 5 READS WORLD 4 (the Host and the Haven).
       - Start: after the Alarm Hall, FAL-125 reads out an itemised bill of your stay (up to 4 lines: your talk with the Host, unauthorised kindness, items taken, then the Guest Book, Turndown Service, Casserole and Clinic choices), then your party answers it. A recruited fighter who is in the party speaks too.
       - Mid: the second signal in the Broadcast Tower is a different voice depending on what you did (kind: someone you helped; greedy: a voice that does not trust you; sat at the table: it catches itself using the Host's cadence; refused: it thanks you; asked: it was one of the ones who stayed).
       - End: before the Core, FAL-125 tries the Greeter's, the Host's and a third voice, and what it does with them depends on your talk.
       - Boss talk: FAL-125's opening has an extra paragraph repeating what you did with the Host.
    3) WORLD 7 READS WORLD 6 (the Shepherd and Pleasant Hollow).
       - Start: the Welcomer says what Pleasant Hollow "sent ahead" (your talk with the Shepherd), plus up to 2 lines from your Wallpaper, Wellness Room, Open House and Neighbour choices. Serpentine reacts if you sat or drank in the Wellness Room.
       - Mid: the roll is read aloud with a margin note per fighter (your World 6 talk). If you also cleared World 4, a second, older hand adds your World 4 note, and Elder Marrow remarks on the road you took.
       - End: the margins go bare and a last line depends on your talk. Bargaining at both the Haven and the Hollow adds a line of its own.
       - Boss talk: the Open Eye ("you feel every choice you have made so far") opens by looking at your World 6 choice. Bargaining twice adds a line.
    4) END SCREEN. Winning World 4 or World 6 in Story adds "Later worlds will remember: ..." (SC_USED) so you can see what was saved.
    5) HOW THE SCENES PLAY. They are new "startEcho / midEcho / endEcho" scenes chained after the normal scene (storyScene now calls storyPlay and storyEcho). They only play when the previous world has a saved record, play nothing when there is nothing to say, are Lorebook chapters ("Opening, remembered" ...), and play AGAIN whenever the remembered choices change (the seen-key includes a signature of the record). Settings > Story scenes > Replay all also brings them back. The World 5 end echo plays BEFORE the Core scene because that scene finishes on the END card (ECHO_FIRST).
    6) EXISTING SAVES. Choices made before v177 were never written down, so World 5 / World 7 show no extra cards until you win World 4 / World 6 again in Story.
    7) NO BALANCE CHANGES. This version is dialogue only. Every line is a reaction to your own choice; no new canon is stated (the bill, the margin notes and the signal just repeat what you did).
    Add more: search "V177 ECHOES" (the content) and "V177: STORY CONSEQUENCES" (the record). Write a new STORY_SCRIPT[n].startEcho / midEcho / endEcho that reads scRec(n - 1) and scD(rec, "Event title"), and add n - 1 to SC_USED to show it on the end screen. TUNE: SC_BILL_TALK, SC_BILL_DEED, SC_W7_TALK, SC_W7_DEED, SC_TALK.
    Check: fal125_story_check.js prints every variant. Tested with a fake save for each of the 5 talk outcomes, a changed record (echo plays again), no record (nothing extra plays), Freeplay (no carry text), plus an autopiloted World 4 run that saves its record at the win; role audit and a 30-run sim still run clean.

V178 - BOSS WALL FIXES (from the v176 100-playtest report)
    Balance and clarity only. No story or fighter changes. Cause of the wave-5 walls found with the sim: the first bosses of Worlds 5 and 6 re-summoned a fresh team every 3 turns whenever fewer than 4 foes were alive. The autopilot kills the weakest enemy first, so fights ran 30-45 rounds with the boss at 5-50% HP while the party wore down.
    1) FIRST-BOSS WALLS (World 5, 6, 7). The step up from World 1-3 first bosses (330-620 HP) was 1050-1300 HP.
       - Recovery Chief: HP 1050 -> 880, ATK 17 -> 15. Calls a retrieval team at most 3 times per fight (u.calls).
       - Deacon Hale: HP 1300 -> 900, ATK 19 -> 15. Welcome heals his flock 10% (was 15%) and himself 2% (was 3%). At most 3 reinforcements per fight.
       - The Welcomer: HP 1150 -> 900, ATK 22 -> 18. Welcome heals the Order 10% (was 15%).
    2) WARM-UP RAMP. World 6, 7 and 8 now ease their first four regular waves like World 5 does (WORLD_DATA[n].ease): 0.88/0.93/0.97/1 for Worlds 6 and 7, 0.85/0.90/0.95/1 for World 8 (its early waves were where nearly every run died).
    3) THE DROWNED KING (World 2 final). HP 2000 -> 1850. The Tide Calls adds are 30% softer and each is flagged "KILL BEFORE THE TIDE" on screen. When the tell is not countered the heal is 6% (was 10%) and the party hit is 0.6x (was 0.7x).
    4) THE GATEKEEPER (World 3 final). HP 2700 -> 2500, ATK 21 -> 20. Gate Closed now allows 5% max HP of damage (was 3%) and shows "HOLD FIRE: hit his allies or heal" on the boss. Failing it hits 0.9x (was 1.1x) and heals 4% (was 5%).
    5) NOT CHANGED ON PURPOSE. The autopilot ignores tells, so World 2/3 final-boss results in the sim are still a floor, not a human win rate.
    Check (sim, 12 level-1 Normal runs per world, same seeds, before -> after, losses on wave 5): World 5 5 -> 3, World 6 8 -> 5 (before the final Deacon trim), World 7 3 -> 1. Small samples; re-run fal125_sim.js (--world N) with more runs before judging further.
    6) ROUND 2 (from the playtest result files). W3 wave 5: The Houndmaster HP 620 -> 540, ATK 14 -> 13, at most 3 whistles per fight (same re-summon grind). W8: The Loading Bar HP 1500 -> 1200, ATK 16 -> 15; The Checkerboard King HP 2150 -> 1850, ATK 18 -> 17 (the report's two biggest World 8 death waves were 5 and 10). Sim, level 1 Normal: World 8 average waves 12.0 -> 16.8 (12 runs), World 3 clears 2/12 -> 6/24.
    7) LEFT ALONE: Winning Ticket and Bomb Husk (audit flag HIGH) are telegraphed one-shot self-destructs that can be killed first, so the flag measures the blast, not a real threat. The 31 fighter stat outliers are specialists, not bugs.
    Tune: search "recoverychief:", "deaconhale:", BOSS7('welcomer', ease: in WORLD_DATA, "V178" in tellSetup.

V179 - CAMPAIGN TEST, SHARED BOSS-CALL RULE, LATE-WORLD BALANCE
    1) NEW TOOLS. fal125_campaign.js plays the 8 worlds in order, carries XP, retries a failed world up to --tries times and uses a tell-aware autopilot (it kills ADDS summons, stops hitting a reflecting boss, breaks SHIELD fields, heals a SAVE target). fal125_shapes.js compares party shapes at equal level. fal125_headless.js got two options for this: xpMap (per-fighter XP) and smart (the tell-aware autopilot). Still skipped: recruits, shops, chips, story scenes, so it is a pessimistic Story player.
    2) ONE BOSS-CALL RULE. bossCanCall(u, max) / bossCall(u, max): a boss reinforces only while fewer than 4 foes are alive and at most `max` times per fight (3 for most, 4 for FAL-125 and the Shepherd). Used by Recovery Chief, Deacon Hale, Houndmaster, Drowned King, Gatekeeper, FAL-125, the Shepherd. Use it for any new boss.
    3) FINAL BOSSES. One opening guard and one phase-2 guard (was 2 + 2). Final Surge is 0.25x per party hit (was 0.3x) and 0.32x in phase 2 (was 0.45x); the Open Eye keeps its own 0.5x.
       HP/ATK: Drowned King 1500/13, Gatekeeper 1900/17, FAL-125 2800/18, Shepherd 3000/19 (flock = Parishioners and Watchers only, no Glitchlings), Open Eye 7500/28, Amalgam 5600/22.
    4) MID BOSSES. Hallwalker 1500/18, Dreamer 1800/19. World 7: Elder Sill to The Schism about 15% less HP and 1-2 less ATK; Reflection/Tongue/Candle/Schism trimmed again. World 8: Clipper 2100/17, Console 2400/18.
    5) ENEMY SCALING per floor (fsc). World 5 [1.15, 1.28, 1.42, 1.58, 1.75] (was up to 2.05). World 6 [1.2, 1.3, 1.4, 1.5, 1.65] (was up to 2.15). World 7 [1.3 ... 2.2] (was up to 2.4). World 8 [1.0, 1.08, 1.2, 1.32, 1.45] (was up to 1.55).
    6) STORY-ONLY EASIER NORMAL. In Story-mode world runs on Normal, enemy damage is x0.9 (STORY_EASE). Hard, Challenge, Freeplay, Endless and Daily are unchanged. The tools do not go through startRun, so their numbers do not include this extra ease.
    7) PARTY SHAPES (30 runs each, same level, tell-aware). World 3 at 500 XP: standard 1T/1H/2D 40%, 2T/1H/1D 80%, 1T/2H/1D 80%, 1T/3D 50%, no Tank 33%. World 5 at level 10: standard 50%, 2 Tanks 60%, 2 Healers 73%, no healer 40%, no Tank 37%. So extra sustain beats extra damage on this autopilot. NOT changed: this needs a look at individual Tank/Healer/Damage kits, not a global stat edit. Re-run with --runs 50 before acting.
    8) CAMPAIGN RESULTS (12 sequences, Normal, 4 tries per world, starters only, no chips/shop/recruits), cleared within 4 tries / first try:
       W1 12/12 / 12, W2 11/12 / 6, W3 10/11 / 6, W4 10/10, W5 9/10 / 6, W6 9/9 / 6, W7 4/9 / 0 (waves 35 and 40 are the wall), W8 2/4 / 1. v178 had World 2 at 0/13 and World 6 at 0/12 from level-1 runs; the campaign test is a different (fairer) measure, so compare it only with itself.
    9) WATCH LIST. One 150-round stalemate showed up in World 6 and one in World 7 during tuning, none in 65 later runs of each. World 7 wave 35/40 (The Tongue, Elder Candle) and World 8 wave 15/20 (Clipper, Console) are still the hardest points. The Shepherd/FAL-125 tells are fair now but the autopilot still ignores talk options (Reason/Appeal), which make the tells easier for a human.

V180 - QUALITY OF LIFE + STORY MEMORY
    1) CLEARER SUSTAIN INFO. Under the party picker, the party note now says what healing the picked team gets: with a Healer 15% HP between waves and fallen fighters back at 15%; with no Healer 25% / 25% and nothing heals during the fight; and "No Tank" when 3+ are picked without one. The wave-clear battle line now names the real recovery percentage. Numbers come from WAVE_HEAL, WAVE_HEAL_NH, REVIVE_HP, REVIVE_NH, so they stay right if you retune them (see sustainNote).
    2) RUN SUMMARY: WHAT HAPPENED. After a loss (world, floor and boss-rush runs) the end screen opens with a "What happened" box: where and to what you lost (boss HP left), who fell first and to which enemy, how many boss tells you countered and which you missed, and a note if you had no Healer or no Tank. Data: RUN.ev (evFall / evTell hooks in kill() and tellResolve()); hit() and damage() remember the last attacker / damage kind per fighter. Code: lossReport.
    3) STORY-AWARE HINTS. The same box ends with a one-line hint for the boss you lost to (BOSS_HINT[enemyKey], 15 bosses so far), or for the tell you missed (TELL_HINT). After 2 or more losses at the same world and wave (SAVE.lossAt) it also offers a way out: second Healer/Tank, spend coins, lower difficulty (Story says Normal is already eased and Easy keeps the whole Story). The counter clears when you win that world. Add hints: BOSS_HINT.myboss = '...'.
    4) BETTER AUTO-PLAY. Settings > Auto-play style: Smart (default) or Classic. Smart answers boss tells (kills ADDS summons first, stops hitting a reflecting boss, breaks SHIELD fields, heals the SAVE target); otherwise it plays like Classic. Code: smartAutoPick / autoPickClassic. The sim tools set Classic unless --smart (campaign and shapes tools use Smart by default; --dumb = Classic). Same sim numbers as v179 for these tools.
    5) STORY RECAP. A "Story recap" button on the party screen (Story mode only) and an automatic pop-up the first time you reach the party screen in a session with progress. It shows worlds cleared, the next world and its note, your last world run and party, what the game remembers about your choices in each world, and how many fighters you have recruited (storyRecap).
    6) MORE "THE GAME REMEMBERS YOU".
       - The Safe Haven (World 4) now reads Worlds 1-3: the Greeter reacts to how you treated the Gatekeeper, and your kind / greedy totals and recruited fighters get a line (STORY_SCRIPT[3].startEcho).
       - The Climax (World 8) reads The Cult: the Loading Screen reads your talk with the Open Eye back as "LOADING PREFERENCES", plus lines for kind/greedy choices and recruits (startEcho), and an ending card that lists what the game kept from the Order and the Safe Haven (endEcho). All lines only repeat what you did; no new canon.
       - The end screen of Worlds 1, 2, 3 and 7 now also lists "Later worlds will remember: ..." (SC_USED = [0, 1, 2, 3, 5, 6]).
       - Old saves: choices made before v177 were never recorded, so these scenes appear after you win the earlier worlds again in Story.
    Check: loaded in a real browser (Playwright) with a fake Story save: recap text, sustain note, loss report (a real lost run and a forced boss case with a missed tell and a repeat loss) and all three new echo scenes render with no script errors. Role audit, enemy audit and story check run clean. Sim results unchanged: fal125_campaign.js World 1-3 same as v179.

V181 - SIDE QUEST: NEVER ENDING BATTLE (God 0001 vs Satan 0002)
- New side quest card "Never Ending Battle" on the party screen, after Confronting Yourself. Pick God (Elohim, 0001) or Satan (Abaddon, 0002) and fight the other one. Neither can be defeated: at 0 HP a side "falls and rises" (you at 60% HP, them at 60%). The fight only ends when you press "Step back" (battle screen top bar, or inside the Interlude). You get 1 Shard per 25 turns.
- 6 MOVES EACH (the other side uses the same six):
    God:   Let There Be Light (1.1x) / Commandment (0.8x, Mark + Slow) / The Flood (3 x 0.5x, Slow) / Smite (1.7x ignores DEF) / Mercy (not an attack: heal 20%, cleanse, +DEF) / The Seventh Day (2.4x, heals 12%, Guard, cd 6)
    Satan: Hellfire (1.0x, Burning) / Temptation (0.8x, Mark + Blur) / Brimstone Rain (3 x 0.5x, Burning) / Devour the Fallen (1.5x, drains 45%) / Rebellion (not an attack: +35% ATK, Reflect, heal 6%) / Fall From Heaven (2.4x ignores DEF, Burning, costs 6% HP, cd 6)
- LORE: every ATTACK you land is counted per side and saved (SAVE.neb). God and Satan each have 12 Record pieces (open at 1, 4, 8, 14, 22, 32, 45, 60, 80, 105, 135, 175 attacks) and there are 3 shared pieces that open when BOTH have enough attacks (45, 80, 175 each). A popup shows each piece the moment it opens; "Read the Record" (quest menu and Interlude) re-reads them. The lore text is MY DRAFT written from your notes (0001 / 0002, the fractures, why Fal-125 exists, the list starting at 0003): edit it in NEBQ.lore (search "SIDE QUEST: NEVER ENDING BATTLE"). [[double brackets]] show as black bars.
- THE INTERLUDE: every 50 of your turns (NEBQ.every) the fight pauses for a shop. You earn Grace (God) or Sin (Satan): 6 per attack, 25 when the other side falls. 8 upgrades per side (NEBUP), 4 offered each visit, up to 3 levels, price = base x (level + 1). Upgrades last for the run. After every Interlude the other side gets +7% ATK and +10% HP, so the shop never just makes it easy.
- God and Satan are type Other on purpose (Angel beats Demon would give one of them a built-in edge). No meta bonuses, chips or Bonds apply. Enemy damage is fixed at 1.0x for this quest whatever the difficulty setting.
- 4 new achievements (Never Ending, Both Sides, It Cannot End, Every Page). New battlefield (gold and red with the crack between them).
- ART: ART.neb_god and ART.neb_satan are placeholder SVGs. Drop sprites/neb_god.png and sprites/neb_satan.png to replace them.
- Book: rows 0001 (Elohim) and 0002 (Abaddon) already existed; their Notes now say where they are playable. Stats are left blank so the roster averages do not change.
- Tools: fal125_headless.js can run the quest (G.neb) and fal125_neb_test.js uses it. Checked: 8 autopilot runs of 120-150 turns (both sides, all 12 moves forced in some), no errors, falls on both sides about every 15-25 turns, and a real Chromium run through the card, menu, Record popup, HUD, Step back and return (phone and desktop sizes).

V182 - LOREBOOK FOLDERS
- Codex > Lorebook is now a folder system with 5 folders: Fal-125, The Cult, Heaven and Hell, Worlds & Story, The Archive.
- Fal-125: Origins, Experiments, Victims, Sinister 7 / Hired Mercs.  The Cult: Welcome, Deep Sleep, Insanity, Bottom Layer.  Heaven and Hell: God vs Satan, Hell, Heaven.
- Existing lore is filed automatically (Order lore into The Cult, Never Ending Battle records into Heaven and Hell / Origins, old Places / Story chapters / Boss intros into Worlds & Story, Archive files into The Archive).
- Empty folders (Experiments, Victims, Sinister 7) show "Nothing filed yet". To add your own lore, fill LB_EXTRA in the script (search "LOREBOOK FOLDERS (v182)"), keyed like 'fal/victims'.
- Breadcrumb navigation, progress bar per folder, and the x / "Unhide all" buttons still work (the x is now in the card corner).

V183 - MUSIC OVERHAUL
- Why so many songs sounded alike: every floor track in a world was the same groove at a different tempo, every boss track came from 9 shared drum patterns, and everything looped the same 4 bars.
- New song builder mkSong() (search "V183 MUSIC OVERHAUL" in the script). Songs are now 8 bars long with a composed melody (a two-bar idea, an answer, a contrasting idea, a resolve on bar 8), instruments that come in and drop out, and drum fills.
- 22 band styles: electro, dub, trap, breakbeat, dnb, synthwave, march, funk, chiptune, metal, epic, ambient, lounge, house, tribal, goth, surf, hip-hop, rave, bossa, techno, gallop. 14 lead sounds. 11 drum grooves and 13 bass lines any song can swap in.
- Rewritten (about 65 tracks): every floor in Worlds 1, 2, 3 and 5; every boss in Worlds 1, 2, 3, 5, 6 and 7; every final boss (phase 2 plays the same tune faster and busier); the whole Casino.
- Unchanged: title, menus, shop, the eerie floors of Worlds 6 and 7, Safe Haven, The Climax, Clown's Massacre, Victory and Defeat.
- To retune a song edit its line in SONGS: style (s), bpm, root, mode, seed (changes the melody), p (chord loop 0-7), v (lead sound), dk (drum groove), bp (bass line), lv (volume).
- Loudness of every rewritten song was measured and matched, so no track is suddenly louder than its neighbours.

V184 - SELL SHOP
- Chip Shop and Byte Shop now have a gold "Sell back" panel under the offers. It lists every chip, Byte and Bit you own (equipped or benched) with a Sell button. Click once to arm it ("Sure?"), click again to sell.
- You get back a share of what you actually paid (list price if it was free): Easy 60%, Normal 50%, Hard 40%, Challenge 30%, Nuzlocke 40%. Tune SELL_RATE (search "V184: SELLING").
- Selling really removes the item: ATK / DEF / SPD / max HP bonuses are taken off the fighters. A sold Bit frees its family, so you can buy Tier 1 again. A sold chip can show up in shops again.
- A chip you just bought in the same shop flips back to buyable if you sell it.
- Not sellable (their effect happened once, or they are tied to the run): one-time chips (damage-vs-type books, Stopwatch), instant-effect chips, Divine upgrades, Recruitment Contract, Soul Swap, trophies and reward-card perks. The panel says how many you own.
- "Slots full" buttons now read "Slots full - sell one below".
- Price paid is tracked per run in RUN.paid; sold count in RUN.sold.
- Not changed: the Never Ending Battle Interlude shop and the Casino's Cashier's Cage have no selling.

V185 - CLOWN'S MASSACRE CONTINUATION: RIPPER (0091), 80 CLOWN SLOTS, LOREBOOK FOLDER
- GENIE IS NOW RIPPER (0091). He left the Codex "Prototypes" tab and is a real fighter: Tank / Bruiser, HP 148, ATK 12, DEF 10, SPD 7, type Human, "Creator of Clowns". Art is a placeholder SVG (ART.ripper): drop sprites/ripper.png to replace it.
- FORCED IN CLOWN'S MASSACRE: when Clown's Massacre is the selected side quest, Ripper takes one of your 4 slots automatically and cannot be removed (they are his creations: his torment). Leaving the side quest frees the slot again. In other worlds he is a normal pick. Not forced in Story mode, or in Nuzlocke once he has fallen.
- THE CLOWNS HATE HIM: while any Clown is alive, every enemy attack picks Ripper 55% of the time (Taunt still wins). Tune the .55 in foeTarget (search "the Clowns hate their maker").
- KIT (search "Ripper (0091" in the script). Madness (max 5, resets each wave): +1 at the start of every turn and +1 every time he is hit; each Madness is +5% damage and mends him 1% max HP at the start of his turn.
    Dismember (cd 0): 1.0x, Dismembers the target 3 turns (deals 15% less, Slowed). Already Dismembered: 1.3x and he heals 8%.
    Rebuild (cd 2, ally): heals 22% max HP (himself 30%), cleanses Slow, Mark, Burning, Venom, Soak, +20% DEF 2 turns.
    Creator's Fit (cd 3, needs 3 Madness, spends all): hits every enemy (0.6x + 0.15x per Madness) ignoring DEF, Dismembers them, Clowns are Stunned 1 turn (bosses and non-Clowns are Slowed), costs him 10% max HP.
  Also added: 3 reward cards (Spare Parts, Old Wounds, The Maker), a Divine ultimate, the Divine skill upgrades, 2 skins, Tank story lines, Foundation Archive lore, taunt lines. All numbers and text are MY DRAFT from your notes (dismembering, rebuilding, insanity): edit them freely.
- CLOWN SLOTS TO 80: Clown.x51 to Clown.x80 added to CLOWN_TYPES as placeholders (ability TBD, grey placeholder art). They show in Codex > Clowns and in the Lorebook. Not enemies yet. The Codex text now says 80 are planned.
- LOREBOOK: new folder "Clown's Massacre" with sub folders Ripper (6 draft entries in LB_EXTRA 'clowns/ripper') and Clowns (fills itself from CLOWN_TYPES: each Clown with an ability shows its ability, TBD slots show ???).
- FIX: [[double brackets]] in LB_EXTRA entries now show as black bars like the other Lorebook text (they showed as plain brackets before).
- Book: row 0091 Ripper added (Source "Generated", review it); Summary formulas now read Characters rows 2 to 92.
- Checked: loaded in a real browser (no script errors), forced slot / removal / leaving the side quest, Lorebook folder, Clowns and Prototypes tabs; 8 headless endless runs in Clown's Massacre with Ripper, no errors. Role audit shows Ripper in range. In the headless autopilot he lasts longer than Xekna in Endless (roughly 110 vs 76 waves average), so watch him: lower his mend or Rebuild if he feels too strong.

V186 - CLOWN.X2 BOSS VARIANT: RARE TEAL CLOWN.X2 (0092) JOINS YOUR ROSTER
- CLOWN.X2 IS A BOSS: in Clown's Massacre the Clown.x2 floor boss (Clown.x2 (Boss), unchanged) now has a 10% chance of being a different-coloured Clown.x2 instead: a teal "Clown.x2 (Understudy)" with a new sprite. Same moves as the normal boss (Clawmark, Temporary Duplication with teal copies, Double Rake, False Finale), HP 460 and ATK 14 (the normal boss is 420 and 13). Tune the chance at X2_VARIANT_CHANCE (search "V186"). It is rolled when the floor boss is picked, so Daily runs give everyone the same boss.
- HE JOINS YOU: beat the teal boss in Story mode and Clown.x2 is added to your roster for good (a "Clown.x2 joins you" card appears, he is pickable on the select screen before your next run). In Freeplay he is open from the start like every fighter; beating the teal boss there changes nothing. Not recruited in Daily or the tutorial, or if he already fell in a Nuzlocke.
- NEW FIGHTER: Clown.x2 (0092), key clownx2, Damage / Duelist, HP 100, ATK 15, DEF 5, SPD 12, type Other, title "The Understudy". Moves: Clawmark (1.0x, Marks 2 turns), Temporary Duplication (cd 3: 0.8x on the target, then the copy hits a second enemy for 0.6x and the target again for 0.5x, then fades), False Finale (cd 4: 0.55x to every enemy, heals him 6% max HP).
- ART: sprites/clownx2.png (also embedded in the HTML) is a teal recolour of the Clown.x2 sprite. Replace it with your own drawing any time: drop sprites/clownx2.png and, if the HTML does not pick it up, re-embed it (EMBED.clownx2).
- ALSO: Character Book row 92 added (Generated, review it) and the Summary formulas now read rows 2 to 93; select-screen blurb and Foundation Archive lore added (ARC_LORE.clownx2, draft).
- Checked: script parses; role audit shows him in the Damage range; enemy audit lists the new boss and copy; headless: 20,000 rolls gave 10.2% teal; the recruit adds him in Story only (Freeplay and the normal Clown.x2 boss recruit nothing); 6 headless boss fights with him on the team, no errors.

V187 - CLOWN.X2 REAL ART + FREE CANDY CANE SKIN
- Your art is in. The special Clown.x2 (the 10% boss, and the fighter he becomes) now uses the red and charcoal jester drawing: sprites/clownx2.png, also built into the HTML. The placeholder recolour is gone and all "teal" wording (blurb, lore, Book, recruit card) now describes the real look.
- NEW FREE SKIN: "Candy Cane" (the white and red version) is a free skin for Clown.x2 (cost 0, shows in the Skins screen). Art: sprites/skins/clownx2_candy.png, also built into the HTML.
- Backgrounds were cut out of both pictures and they were scaled to 400 px on the long side. If you want sharper edges, drop bigger PNGs with the same names into sprites/ and sprites/skins/.

V188 - RIPPER REAL ART
- Ripper (0091) now uses your drawing: sprites/ripper.png, also built into the HTML (EMBED.ripper). The placeholder SVG stays only as a fallback.
- His description text (select screen passive and Foundation Archive entry) now matches the art: long black hair, one black and one red eye, a half-undone stitched mouth, a patched olive sweater. His kit, stats and the Clown's Massacre lore are unchanged.
- Background cut out and scaled to 400 px on the long side. His two colour skins (Morgue Pale, Clown Red) are filters on this art; check they still look right.

V189 - CLOWN.X2'S TEMPORARY DUPLICATION IS REAL
- Temporary Duplication (the playable Clown.x2) now actually splits him in two. He strikes the target for 0.8x, then a REAL copy of Clown.x2 appears on your side of the field: half his max HP, 75% of his ATK, shown a little see-through with the name "Clown.x2 (copy)".
- The copy acts on its own every round (it swipes a random enemy for 0.85x) and fades after 3 of its own turns. It is a normal target: enemies can hit it, Taunt and area attacks reach it, and if it is killed it just disappears. Only one copy at a time (the skill is disabled while one is out), cooldown 4, and it needs room in the party (max 8 units on the field).
- The copy never counts as a fighter for the run: it is removed the moment it fades, dies, or the fight ends, so it cannot reach the roster, XP, the Nuzlocke graveyard or the next wave, and it does not keep you alive if your real fighters all fall. Its hits are credited to Clown.x2 in the damage stats.
- Tune at CX_COPY_TURNS, CX_COPY_HP, CX_COPY_ATK (search "V189"). The boss and normal Clown.x2 enemies already summoned real copies; they are unchanged.
- Checked: script parses; 8 long headless Clown's Massacre runs with him on the team (751 copies, 1294 copy attacks, 273 fades, 120 copies killed), no errors, no copies left behind, party size back to 4 after every fight.

V190 - THE HOUSE ALWAYS WINS: CASINO OVERHAUL (LOOK, TWO NEW GAMES, A BACKGROUND FOR EVERY FLOOR)
- THE CASINO FLOOR HAS A NEW LOOK. Everything between fights now sits on a green felt panel with a gold trim and chasing marquee lights, a neon title, a gold coin pill and a coloured rank badge (Guest, Bronze, Silver, Gold, Platinum, Diamond). Search "V190 THE HOUSE ALWAYS WINS: casino floor look" for the CSS.
- NEW HUB. A Loyalty Card at the top shows your rank, a progress bar to the next rank, the whole rank ladder (hover a rank for its comp), the comp you unlock next, Net this run and Wagered this run. Under it: a one-line house quip (it changes when you are 150+ coins up or down), status chips (Fighter bet, Marker owed, muscle coming, lifetime points) and the games as tiles in three groups: Table games, Machines, Quick bets. Side deals, the Cashier's Cage, Daily High Rollers and Leave are unchanged but sit in two columns.
- BETTING CHIPS. Bet buttons are poker chips (10 blue, 25 green, 50 red, 100 black, ALL IN purple). The Cheat toggle is a red pill.
- REAL-LOOKING CARDS: white faces with rank and suit, red suits, a patterned back, and they deal in with a little animation (Blackjack, Poker, Hi-Lo, Monte, Baccarat).
- SLOTS: a lit cabinet, reels blur while spinning and bounce when they stop, the frame flashes on a win. ROULETTE: a real 37-pocket wheel (true European order) that spins with a ball while the number flickers. CRAPS: big white dice that tumble in.
- WINS FEEL LIKE WINS: any win pays out with a coin rain and the coin pill pops; 10x or more also flashes the screen; 5x+ plays the win jingle, smaller wins a short blip.
- NEW GAME - PLINKO (Machines): drop a ball through 8 rows of pegs into 9 slots. Pick Low, Medium or High risk. Slots, edge to centre: Low 5 / 2 / 1.1 / 0.9 / 0.4, Medium 12 / 3 / 1.3 / 0.6 / 0.3, High 26 / 4 / 1.4 / 0.3 / 0.2. Fair coin at every peg. Return to player: Low 90.8%, Medium 91.0%, High 94.5%. Tune the RISKS table in plinko() (search "V190: PLINKO").
- NEW GAME - LUCKY SEVEN (Quick bets): roll two dice and bet Under 7 (2.2x), Over 7 (2.2x) or exactly 7 (5.5x). Return to player 91.7% on all three. Tune PAY in lucky7() (search "V190: LUCKY SEVEN").
- THE HOUSE ALWAYS WINS, ON PURPOSE: both new games pay back less than you stake over time, like the rest of the floor. Cheat and the lifetime points / rank comps work on them exactly like the old games.
- EVERY FLOOR HAS ITS OWN BACKGROUND. The Casino had 4 pictures repeated across 16 floors. There are now 16: The Lobby, The Slots Floor, The Card Room, The Craps Pit, The High Roller Room, The Sportsbook (screens and a scrolling ticker), The Cashier's Cage (brass bars and tellers), The Lounge (stage, piano, bar), The Poker Pit, The Back Room (swinging bulb, cash counter), The VIP Suite (columns, champagne tower, velvet rope), The Count Room (camera feeds, cash on a conveyor, lasers), The Vault, The Penthouse (night skyline, moon), The Underground Game (one lit table, watchers with red eyes) and The House Always Wins (a giant slow roulette wheel with a glowing 51 and falling cards). Which scene a floor uses is CASINO_FLOOR_MAP (search "V190 THE HOUSE ALWAYS WINS: 12 new Casino backgrounds"). The Codex Music tab shows all 16.
- NOT CHANGED: odds and payouts of the old games, enemies, bosses, battle effects, chips, Cage stock, ranks and comps, music. No new fighter, so the Character Book is unchanged.
- Checked: script parses; the game loads in a real browser with no script errors; all 16 floor backgrounds rendered and looked at; the hub, Blackjack, Slots, Roulette, Craps, Plinko, Lucky Seven and the Cashier's Cage were played in a real browser with no errors; the headless Casino sim gives exactly the same numbers as v189 with the same seed (battles untouched). Known and older than this version: the autopilot stalls against The Pit Boss + Bouncers on wave 5 in about 15% of sim runs (counted as stalemates), so keep an eye on that fight.

V191 (CLEARER MOVE EXPLANATIONS)
- Raw multipliers are now shown as plain power: "0.65x" reads "65% power" and "(0.8 + 0.25 per Demon)x" reads "(80% + 25% per Demon) power". 100% power = a normal hit.
- Every move (battle panel and fighter preview) gets a breakdown box: power dots and tier (Very light to Devastating), an estimated damage number (uses the fighter's real ATK, the enemies' DEF and the type matchup; moves that ignore DEF skip the DEF cut), hit count, who it targets, and what the cooldown means. Heals show how many HP the percent is worth.
- Hover underlined words (ATK, DEF, SPD, Mark, Slow, Stun, Guard, Taunt, Burn, Blur, Cleanse, "ignores DEF"...) for a one-line explanation.
- New "?" button in the battle bar and Settings > Combat guide: a "How combat works" page with real numbers (damage formula, DEF table, types, statuses). New tutorial step "Reading move info".
- Settings > Plain-language move info (On/Off) turns the extra text off. Display only: no damage, balance or AI code was changed.
- Code: the CLR block at the end of the HTML (search "CLARITY"). Wording lives in CLR.GLOSS, CLR.TIERS and CLR.guide(). Hooks: showSkill and renderPreview in the main script.

V192 (TOKEN ROLLS OVERHAUL)
- AURAS now sit BEHIND the fighter: a soft backlight with drifting particles plus a ring on the floor, instead of a smear over their feet. Each aura has a motion style (rising, falling or pulsing). 3 new auras (Petal Drift, Neon Rise, Abyss Glow), 11 in total. Search "v192 auras" for the CSS and AURAS for the list.
- LEGENDARY GLOW is now a setting: Settings > Legendary skin glow (Off / Subtle / Full) or the button in Token Rolls. Default Off. Legendary skins also no longer force a gold aura.
- VARIANTS: 5 per role (was 3, 2 new per role). A Variant Roll now finds one you do not own yet, you can own several per fighter and pick which is ON (or none). The first one you find switches on automatically. The active variant shows as a gold tag under the fighter in battle (hover for what it does). The Token Rolls screen lists all 5 (unknown ones as ???) with their effects. Old saves keep their variant (it counts as owned and stays ON).
  New Damage: Bloodlust, Mark Hunter. New Tank: Bastion, Provoker. New Healer: Warding Touch, Purifier. Edit in VAR_T.
- No change to costs, odds or Legendary skin art.

V193 (WORLD 7 AND 8 BALANCE PASS)
- The campaign simulator now applies the real Story-mode Normal ease (enemy damage x0.9) by default (--nostory restores the old v179-v192 numbers). With it, the old "World 7 wall" was mostly Elder Candle (wave 40), with the Hallway Thing (15), Tongue (35) and World 8's Console (20) close behind.
- World 7 bosses: Hallway Thing HP 1600>1500 and Behind you x2.1>x1.9; Third Sleeper HP 1950>1850; Elder Marrow HP 2300>2150; The Tongue HP 2350>2250 and its healing penalty -25%>-15%; Elder Candle HP 2550>2250, Snuff x2.1>x1.9, its mark on all +30%>+25%, and it now summons one Hollowed instead of two (Hollowed heal themselves).
- World 8 bosses: Checkerboard King HP 1850>1750 and Error Cube x2.0>x1.8; Clipper HP 2100>1900 and Rises inside one of you x2.0>x1.8; Console HP 2400>2050 and /kill x2.0>x1.7.
- Text fix: The Tongue's Swallow and the Third Sleeper's Tuck in no longer say "heals" (they never healed).
- Stalemate breaker: in every mode except Endless, a fight still going after round 30 gives all enemies a growing attack bonus (+10% per round, capped at +200%) so no fight can last forever. Normal fights never reach it. Search "V193" in the HTML.
- Results at level 10, starter party, Story-mode Normal, no recruits/shops/chips: World 7 first-try clears about 47% (17 of 36), World 8 67% (24 of 36). Losses are spread across waves, with no single wave above 4 of 36. Worlds 1-6 were not changed.
- Small samples: full-campaign runs vary a lot between seeds, so judge a change with 30+ sequences.

V194 (THREE NEW HEALERS: CLOWN.X33, DEVOURER, HUSH)
- Clown.x33 (0093, Healer, Other, Leech): the bandaged clown from Clown's Massacre, playable from the start. Sprite cut from that mode (sprites/clownx33.png, key clownx33 so it does not clash with the clown enemy). Patches meter (max 5, resets each wave, +4% heals per Patch). Rend (bleeds the target, 60% of the damage drips into the most wounded ally), Blood Patch (heal 20%, cleanse, +25% DEF), Wrapped Up (3 Patches: party heal and Guard, every Bleeding enemy torn open). 108 HP, 12 ATK, 6 DEF, 9 SPD.
- Devourer (0094, Healer, Other, Leech): was the Prototype, so it left the Codex Prototypes tab. Meat meter. Gorge (bite, self and ally heal, Fed = heals +25% for 2 turns), Ribcage Shelter (heal 22% and +30% DEF on one ally), Feast Bloom (3 Meat: huge bite, swallows non-bosses under 25% HP, party heal and cleanse). The prototype's 4th move Marrow Rain was folded into Feast Bloom's cleanse. 112 HP, 12 ATK, 7 DEF, 8 SPD. Placeholder sprite (ART.devourer) until real art exists.
- Hush (0095, Healer, Angel, Amplifier): the quiet Death Angel idea (working name). Echo meter. Click (heal, the echo bounces to the most wounded other ally), Hold Still (party heal, +15% DEF, cleanse Slow/Mark/Blur), Shriek (3 Echo: pierce hit, Slow, party heal). SPIRAL: under 35% HP she stops listening for 2 turns (+60% ATK, +30% DEF, three unaimed hits a turn that mend the party with 30% of the damage), then goes quiet (Echo reset, Slow 1 turn). She can only spiral again after being healed above 60% HP. 102 HP, 10 ATK, 6 DEF, 12 SPD. Placeholder sprite (ART.hush) until real art exists.
- Each has: Archive lore, roster blurb, battle and story quotes, 3-4 chips (cx33a-d, dv1-3, hu1-3), a Divine ultimate and enhancements, two skins and a Character Book row (Source: Generated, review them).
- Balance (level 10, starter-style party, Story-mode Normal): World 5 first-try clears Eyianix 13/20, Hush 12/20, Clown.x33 10/20, Devourer 10/20. World 3 (14 runs): Clown.x33 12, Devourer 10, Hush 8 before a small Hush buff. The role audit flags Devourer (HP/DEF high, SPD low) and Hush (ATK low, SPD high) as stat outliers on purpose; their overall power sits in the normal Healer band.
- Hush's Spiral was checked in 10 headless runs: 64 spirals, 100 rampage turns, 59 clean crashes, no stuck states.

V195 (MORE RECOMMENDED PARTIES + THE TEST LAB)
- Update 1: 11 new recommended parties (Clown Car, Needle and Thread, Event Horizon, Quill Garden, Reality Glitch, Blood Feast, Spore Season, Tripwire, Hired Thunder, Gone Quiet, Looming Dread). All 93 fighters are now in at least one of the 52 parties (checked by script). Each new party was run through World 5 at level 10 (6 runs each): 3 to 6 clears out of 6, the shakiest being Needle and Thread and Gone Quiet (3/6).
- Update 2: the TEST LAB. In the game: the "Lab" button in the bottom bar (or ~). On the command line: tools/fal125_lab.js. Full instructions in docs/TEST_LAB.txt. Pick any party, level, world, start wave, difficulty, helpers (Story ease, auto-play, God mode, 1 HP enemies, coins), starting chips and forced start-wave enemies. A Lab run never touches the real save (it is copied first and restored on leaving the end screen); checked in a real browser.
- Game hooks added (search "V195"): playRun can start at any wave, damage() has the God mode switch, showEnd and show() handle the save restore. The headless harness (tools/fal125_headless.js) gained wave, foes, god and ohk options.

V196 (NEW TANK: CLOWN.X25)
- Clown.x25 (0096, Tank, Other, Protector): "Two to One", the armored half and the doll from Clown's Massacre, fused for good and playable from the start. Art is the fused sprite from that mode (sprites/clownx25.png, key clownx25 so it does not clash with the clown_x25 enemy). 150 HP, 11 ATK, 11 DEF, 7 SPD.
- Hands meter (max 5, resets each wave): every move adds one. Iron Fist (1.1x, +0.05x per Hand). Hold Hands (cd 2, pick an ally): the ally gets Guard 1 turn and +20% DEF (+3% per Hand) for 2 turns, Clown.x25 gets Taunt and +20% DEF for 2 turns. Two Become One (cd 3, needs 3 Hands, spends all): hits and Marks every enemy (0.6x + 0.1x per Hand), Guards the whole party for 1 turn, Clown.x25 recovers 8% max HP (+2% per Hand).
- Has: Archive lore, roster blurb, battle and story quotes (TANK_LINES), 4 chips (cx25a-d), a Divine ultimate (Armor Closes) and enhancements, two skins (Rust Plate, Porcelain), the Hands counter and a Character Book row (Source: Generated, review it; Summary formulas now read rows 2 to 97).
- New recommended party: "Two to One" (Clown.x25, Clown.x33, Clown.x2, Renku), 53 parties in total.
- Search "V196" in the HTML for the skills and helpers (handm, cx25Need).
- Checked: all scripts parse; role audit puts him in the middle of the Tank band (Power +0.25); headless runs with him in 4 party setups, no errors, all three moves fire (Two Become One 38 casts in 6 runs after the wording fix below); World 5 at level 10, starter-style party, 20 runs each: Clown.x25 18/20, Xekna 19/20, Creep 19/20.
- Note for whoever balances next: the Auto-play picker skips any move whose description contains "heal", "restore" or "mend". Two Become One says "recovers" on purpose so Auto-play and the headless tools use it. (Clown.x33's Wrapped Up says "heals", so Auto-play never casts it.)

V197 (CLOWN.X25 NEW ART)
- Playable Clown.x25 now uses your new red-jacket sprite (sprites/clownx25.png, also embedded). His passive text and Archive description match it.
- The enemy fused Clown.x25 (the boss-side form, key clown_x25) now uses the horned, clawed drawing (sprites/clown_x25.png, also embedded).
- Two new FREE skins for the playable Clown.x25 from your mini forms: "Mini: Armored Half" and "Mini: Doll" (sprites/skins/clownx25_half.png and clownx25_doll.png, also embedded). They show in the Skins screen next to Rust Plate and Porcelain.
- Backgrounds were cut out from your phone screenshots (white removed, scaled to 330 px). Drop cleaner originals into sprites/ any time and re-embed (EMBED.clownx25, EMBED.clown_x25, EMBED_SKIN.clownx25_half / _doll).

V198 (CLOWN.X25: COME APART)
- Playable Clown.x25 gets a new passive, "Come Apart" (I picked the split-on-defeat idea over the big form: the mini art already exists as his two free skins, and a big form would have looked too much like the enemy Clown.x25 fusing).
- Once per wave, when the armor would go down it breaks along the seam instead. The Armored Half stays up at 30% max HP with +25% DEF for the wave, a 2-turn Taunt and its debuffs cleared (sprite switches to the Mini: Armored Half art). The Doll (new temporary ally, 25% of his max HP, uses the Mini: Doll art) steps out for the rest of the wave.
- The Doll never fuses back (that is the enemy's trick). Each of its turns it takes the hand of the most hurt ally: Guard for 1 turn, heals 5% of that ally's max HP, and gives the armor +1 Hand. Enemies can hit it. Needs a free party slot (max 8).
- If the armor falls for good, the Doll sits down and leaves the fight. At the end of the fight the Doll is removed and the armor sprite comes back; the passive resets every wave.
- Passive text and codex line updated. Search "V198" in the HTML (cxComeApart, cxDollTurn, cxRestoreArmor).
- Checked: all scripts parse; 20 headless runs with Clown.x25, Clown.x33, Clown.x2 and Renku (World 5 from wave 20, level 10): no errors, split fired 32 times, doll held hands 39 times, doll left after the armor fell 17 times.



V199 - HEALER IDENTITIES + BUFFS
  Rue, Seam, Thorn, Moon and Eyianix are now five different healers (less damage, more healing):
    Rue     BURST healer: Fishnet Patch 38% single heal, Devil's Bargain 14% + 5% per Pact, Tail Lash 0.7x leeches 45%.
    Seam    TRIAGE healer: Re-Render heals 18% + up to 22% more on a badly hurt ally and builds Missing Texture; Full Reload 16% + 5% per stack; Checker Lash 0.6x.
    Thorn   SHIELD healer: Hidden Eye 25% + Guard + DEF, Claw Guard +30% DEF for 2 turns, Eye on the Door saves at 25% HP with 2 turns of Guard; Swipe 0.6x.
    Moon    PARTY-WIDE healer: Dirty Work 0.7x and heals the party 4%, Metal Verse 14% + clears Slow/Mark, Full Moon Encore 14% + 5% per Phase.
    Eyianix PULSE healer: Watchful Eye 30%, Infused Eyes 18% every 3 turns (was 4), Eye Bolt leeches 50%; eyes regrow at 50% HP with Guard (was 30%).
  Buffs: Radiant 100/15/6/10 (was 90/13/5/9), stronger Claw Slash and Soak Up Fallout. Serpentine 112/11/6/10 (was 100/10/6/9), 35% leech, bigger Waking Dream and Drop of Sand (Slow 3 turns).
  Cy 150/12/11/7 (was 135/11/11/6), stronger Bouldering and Downhill, Incline now heals 8% and gives +30% DEF.
  Character Book updated. Lab check (Normal, World 3, 20 runs, 4 seeds): no healer got worse overall.

v206 (changes on top of v205)
  Character encounters: the NEW CHALLENGER! screen is longer and combined with the story text (sprite, stats, moves, progress bar, FIGHT button). Wild recruits can no longer be refused. New "joins you" screen.
  The Vendor: placeholder sprite on the Vendor menu and every shop screen (sprites/vendor.png replaces it). "Fight the Vendor" once per shop stop.
  Beat the Vendor to UNLOCK him as a playable Healer (0097, Stock meter): Free Sample, Buy One Get One, Clearance Sale (random 0-60% markdown), Credit Rating (+2% healing per 100 coins held, max +20%). Not a wild recruit. Character Book row 97 added (Generated).
  The Vendor extras: select-screen locked tile, chips ve1-ve5, Divine ultimate (Everything Must Go) and enhancement (Final Markdown), Rare enhancement, world dialogue, start-of-fight lines, skins and Foundation Archive lore.
  The Vendor is playable from the start in Freeplay (any non-Story save). Story mode still needs the shop fight to unlock him (beating him in Freeplay also unlocks him for Story).
  Secret bosses (v206): fixed a bug where The Collector (secret) overwrote the World 6 Offering Collector enemy (its enemy key is now secret_collector, save id unchanged).
    Hints: near-miss whispers during a run ("You feel watched"), and walking away from / losing to a secret boss reveals its exact clue in the Byte Vault Secrets tab.
    New secrets: The Hollow (10 coins or fewer at a floor boss, drops Hollow Byte) and The Undertaker (a living fighter at 15% HP or less, drops Deathbed Byte). Add more in SECRETS + BOSS7 + PB.
  Shop on small screens (v206): 2-column offers, sticky Reroll/Codex/Continue bar with 44px+ buttons, smaller Vendor, landscape tweaks, safe-area padding.
  tools/fal125_headless.js: run() accepts pbEq = { fighterKey: [byteIds] } to equip permanent Bytes for balance tests.
  The Other Vendor (v206): when The Vendor is in your party, a different (blue-shifted) vendor runs the shop. Fighting him is not possible: he kills a random fighter (30%, never the last one) or halves one's max HP, then lets you shop normally.
  Hound Dog select icon (v206): his wide art was cropped by the tile's fixed 100px image height; it now fits fully inside the icon box (tiles, team slots, roster minis).

v213 (changes on top of v212)
  Settings > Accessibility > No flashing lights. Hit flash/knockback/hit-stop, turn arrow + ring, target dimming + aim line, select tile role icons and type glow.

v214 (changes on top of v213)
  Damage numbers scale/drift/stack; HP bar heal flash, low-HP pulse, shield/soak overlays; status icons (tap for tooltip, Settings toggle for text); arena drift, vignette and dust per world.

v215 (changes on top of v214)
  Enemy death animations, crit slash/tag/kick, combo counter, boss HP bar with phase markers, colour theme per world.

v216 (changes on top of v215)
  Clown's Massacre: Clown.x40 The Flesh That Hates boss (own music, background, The Hate infection, fire weakness), rising clown bosses, 2 chips, red clown theme. See docs/clown_x40_designs.txt.

v217: Nane Nane renamed to Nane everywhere.

v218 (changes on top of v217)
  CONTAINMENT INCIDENTS: optional missions (select screen > Optional missions row). 18 incidents, 6 types (Breach, Missing Personnel, Lost Research, Cult Activity, Fracture Instability, Specimen Recovery). First clear files a lore report (Lorebook > Containment Incidents), optional objective opens an addendum.
  Edit INCIDENTS / INC_TYPES in the script. Test with: node tools/fal125_incident_test.js

v219 (changes on top of v218)
  CHARACTER MASTERY: Mastery button on the select screen. 7 levels per fighter (profile, lore, victory animation, alt portrait, signature move visual, dialogue, title+cosmetic). Lore for 21 fighters hand-written, rest generated drafts (edit MAST_TEXT). Settings > Play > Mastery preview.
  Test with: node tools/fal125_mastery_test.js
