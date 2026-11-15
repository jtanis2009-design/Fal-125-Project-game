# Lab / Test-Arena / Creation-Facility World Design (for "The Experimental Ringer", FAL125 World 2)

Scope: how games build laboratory, testing-ground, zoo/breeding-facility and arena levels; two-sided world rules for a "test ring"; turn-based boss patterns (including dinosaur bosses); floor-by-floor escalation and environmental storytelling. Research note: several fan wikis (slaythespire.wiki.gg, wiki.gg mirrors) were not reachable from this session, so many findings rest on search-result summaries of wikis, guides and interviews rather than full-page reads. Treat exact numbers as approximate.

## What makes lab/arena worlds memorable?

### Takeaway
The best lab/arena worlds work because the setting is itself a system: something is "keeping score" or "keeping things contained", and the player sees that system strain or break (meltdowns, breakouts, an overseer who comments). Story is told through things left behind (journals, wall scribbles, warnings) rather than cutscenes, and the arena often changes the player's normal tools (fixed loadouts, swaps, spectators).

### Cited Findings
**Pokemon Red/Blue, Pokemon Mansion (Cinnabar Island)**
- The player first learns about Mewtwo late in the game by reading research papers left in a ruined lab on Cinnabar Island — [Wikipedia: Mewtwo](https://en.Wikipedia.com/wiki/Mewtwo)
- The Mansion journals are diary entries by a researcher (thought to be Mr. Fuji) about how Mewtwo was made and how it escaped. They are spread around the ruin — [Bulbapedia: Pokemon Mansion journals](https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_Mansion_journals)
- The entries move from finding Mew, to naming it, to Mewtwo's birth, then leave a question (where did it go?) that points to Cerulean Cave, a later optional dungeon — [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_Mansion_journals)

**Lobotomy Corporation (Project Moon): containment as the whole game**
- Each creature ("Abnormality") has a Qliphoth Counter; when it reaches 0 the creature breaks out. On some creatures the counter drops after a Bad work result or work that takes too long (over 40 seconds) — [Lobotomy Corp Wiki: Dimensional Refraction Variant](https://lobotomycorp.fandom.com/wiki/Dimensional_Refraction_Variant); [Steam discussion](https://steamcommunity.com/app/568220/discussions/0/3211505894108847554)
- Some creatures have their own trigger rules (for example Void Dream's counter only drops on Bad results) — [Lobotomy Corp Wiki (via search summary)](https://lobotomycorp.fandom.com/wiki/ALEPH)
- There are four work types (Instinct, Insight, Attachment, Repression); each creature reacts better or worse to each one — [Lobotomy Corp Wiki](https://lobotomycorp.fandom.com/wiki/Employees_(Legacy)); naming of the third type differs on [Moegirl](https://mzh.moegirl.org.cn/en/%E8%84%91%E5%8F%B6%E5%85%AC%E5%8F%B8)
- "Ordeals" are timed attacks on the facility linked to the day's Meltdown level: Dawn at the end of level 2 (weak, TETH), Noon at level 3-5 (HE), Dusk at 6-7 (WAW), Midnight at level 8 from day 26 on. Working more raises the level, so more work means more danger — [Lobotomy Corp Wiki: Ordeals](https://lobotomycorp.fandom.com/wiki/Ordeals); timing can vary per [Steam discussion](https://steamcommunity.com/app/568220/discussions/0/1749024925638565205)

**Portal / Portal 2 (Valve): the voice that grades you, and the hidden dens**
- Hidden rooms ("Rattmann dens") have wall scribbles warning about GLaDOS, plus cans of beans and water bottles showing someone lived there; GLaDOS never shows she knows about them — [Grunge](https://grunge.com/160939/creepy-things-we-found-in-portal); [Giant Bomb: Doug Rattmann](https://giantbomb.com/wiki/Characters/Doug_Rattmann)
- Some dens can only be reached with the portal gun, which ties the game's main tool to the story and hints the player can defy the tester — [Mechanics of Magic: Portal critical play](https://mechanicsofmagic.com/?p=31060)
- Valve tends to avoid cutscenes; environmental design fed into the writing — [Level With Me, Adam Foster](https://www.blog.radiator.debacle.us/p/level-with-me-adam-foster-part-2.html)

**Pokemon Emerald, Battle Factory (rental arena)**
- You pick 3 of 6 random rental Pokemon, fight in streaks of 7, and after each win you may swap one of yours for one of the beaten trainer's. A Factory Head boss appears at battles 21 and 42 — [Serebii: Battle Factory](https://serebii.net:443/emerald/factory.shtml); [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Battle_Factory_(Generation_III))

**Monster Hunter arena quests**
- Arena quests make you kill a monster fast with a preset loadout instead of your own gear; each set is often made to show off a weapon or to counter that monster — [Twinfinite](https://twinfinite.net/guides/monster-hunter-world-compete-arena-how/); [Game8](https://game8.co/games/Monster-Hunter-World/archives/314505)
- In Monster Hunter Wilds you choose one of three preset loadouts; "Special Arena" quests can put two monsters in a small arena at once — [All Things How](https://allthings.how/doshaguma-of-the-hollow-arena-quest-walkthrough-monster-hunter-wilds/)

**Hades, Elysium Stadium**
- The last room of Elysium is a big round arena with a crowd watching; Theseus "puts on a show for the crowd" and fights together with Asterius. The pillars that break in Asterius's solo arena cannot break there — [Prima Games](https://primagames.com/gaming/hades-boss-guide-theseus-and-minotaur-asterius); [Hades Wiki: Theseus](https://hades.fandom.com/wiki/Theseus?oldid=9683)

**Dino Crisis (Capcom, 1999)**
- Marketed as "panic horror": the dinosaurs are fast and clever and can follow the player from room to room, unlike Resident Evil's zombies — [Wikipedia: Dino Crisis](https://en.wikipedia.org/wiki/Dino_Crisis_(video_game)) (marketing claim only lightly verified)
- You hear the dinosaurs' thuds around a corner before you see them, building tension — [GameSpot review](https://www.gamespot.com/reviews/dino-crisis-review/1900-2547330/)
- Raptors take many handgun shots (one blog says about 13), so players must improvise; locked doors (DDK disks, keycards) gate progress — [Giant Bomb blog](https://www.giantbomb.com/profile/yummylee/blog/resident-evils-red-headed-stepchild-a-look-back-at/107819/) (blog source)

**Jurassic World Evolution (Frontier): breakouts as a system**
- Storms knock out power; backup power buys time to send rangers to fix fences before dinosaurs escape — [TheGamer](https://www.thegamer.com/jurassic-world-evolution-2-guide-stop-dinosaurs-escaping/)
- Maintenance vehicles reboot power stations and gates after an event — [Frontier: JWE3 Calamities & Sabotage guide](https://www.jurassicworldevolution.com/en-US/3/help/player-guides/calamities-and-sabotage-guide)
- Hurricanes damage buildings, fences, pylons and even ranger vehicles — [Frontier forum: Weather Calamities](https://forums.frontier.co.uk/threads/feature-focus-weather-calamities.591957)
- Director Michael Brookes said they did not want the park in a "constant state of emergency" — [PressReader / PC Gamer 2018](https://www.pressreader.com/usa/pc-gamer-us/20180227/281569471179162)
- A campaign mission has a raptor scripted to get agitated and try to break out — [TrueAchievements walkthrough](https://www.trueachievements.com/game/Jurassic-World-Evolution/walkthrough/7)

**Slay the Spire 2, "Test Subject" (a lab boss in a turn-based game)**
- Three phases with growing HP (often given as 100/200/300); between phases it is stunned for a turn and then revives. Phase 1 gains Strength whenever you play a Skill (punishes defending); phase 2 adds Wound cards when it deals unblocked damage; phase 3 goes Intangible on some turns — [Neon Lights Media guide](https://www.neonlightsmedia.com/blog/slay-the-spire-2-test-subject-boss-guide); [Mobalytics](https://mobalytics.gg/slay-the-spire-2/encounters/bosses) (early-access guides; numbers may differ)
- A guide headline calls it "the boss that punishes every habit you've built" — [Neon Lights Media](https://www.neonlightsmedia.com/blog/slay-the-spire-2-test-subject-boss-guide)

### Inferences
- Common thread: the facility has a visible "pressure meter" (Qliphoth counter, Meltdown level, power/fences) and the player's own actions fill it. That gives a lab world its own identity beyond "enemies in white rooms".
- The "tester's voice" (GLaDOS, a PA system) and the "hidden survivor's notes" (Rattmann, Cinnabar journals) form a strong pair: official story vs. the truth. This maps well onto FAL125's existing advisory/broadcast ideas (W5 Directive, W8 advisories), so it should be done with a different tone to avoid repeating them.
- Arenas feel different when they change the player's tools: preset loadouts (Monster Hunter), swaps after wins (Battle Factory), spectators reacting (Hades). FAL125 already has a shop between stops, so a ring-specific twist on the shop (e.g. "the lab lends you a test item for one floor") would fit.
- Dinosaurs feel scary when they are fast and smart (they follow you), heard before seen, and hard to put down. In a turn-based game that translates to: acting twice/early, a warning one turn before they enter, and high HP or a "must be sedated, not killed" twist.

### Gaps
- No official developer interviews were found for Lobotomy Corporation, Pokemon Mansion, Darkest Dungeon or Inscryption level design; all mechanics come from fan wikis and guides.
- No reliable source found on Jurassic World Evolution's tranquilizer/ranger capture mechanics in detail, or on Ark / Turok dinosaur boss design.

## Which two-sided world rules would suit a "ring" of test subjects?

### Takeaway
The strongest real-game models are "your action fills a danger meter that also pays you" (Lobotomy Corp: more work = more energy but bigger Ordeals) and "the system protects you until it fails" (JWE: power holds the fences until a storm). For a ring, an observer/scoring rule, a breach meter, or cage doors on a timer all cut both ways naturally.

### Cited Findings
- Lobotomy Corp: doing work is required to progress, and it also raises the Meltdown level that brings Ordeals — [Steam discussion](https://steamcommunity.com/app/568220/discussions/0/1749024925638565205); [Ordeals wiki](https://lobotomycorp.fandom.com/wiki/Ordeals)
- Lobotomy Corp: slow work and bad results lower a creature's counter until it breaks out — [Dimensional Refraction Variant](https://lobotomycorp.fandom.com/wiki/Dimensional_Refraction_Variant)
- JWE: backup power gives a short window to repair fences before a breakout — [TheGamer](https://www.thegamer.com/jurassic-world-evolution-2-guide-stop-dinosaurs-escaping/)
- STS2 Test Subject phase 1 punishes a certain play style (Skills give it Strength), a "the test is watching what you do" rule — [Neon Lights Media](https://www.neonlightsmedia.com/blog/slay-the-spire-2-test-subject-boss-guide)
- Monster Hunter "Special Arena" puts two monsters in one arena that can also fight each other — [All Things How](https://allthings.how/doshaguma-of-the-hollow-arena-quest-walkthrough-monster-hunter-wilds/)
- Hades: the stadium crowd is a show element; Theseus performs for it — [Hades Wiki](https://hades.fandom.com/wiki/Theseus?oldid=9683)

### Inferences (rule drafts for the author; all are Claude's suggestions, not from any game unless marked)
Each is written as "good side / bad side". Pick ONE as the World 2 signature rule; others can become floor flavour or boss gimmicks.
1. **Test Score / Observers** — a score bar fills when the team does "interesting" things (kills with a skill, a different fighter each turn, finishing fast). High score: the observers throw a reward (heal, bonus coins in the next shop). But a high score also makes the lab "raise the difficulty" next wave (an extra enemy or a buff). Low score: no reward, but easier next wave. (Inspired by GLaDOS grading and Lobotomy's Meltdown pressure; the "score" itself is generic.)
2. **Containment Meter (Breach)** — every enemy kill fills a meter (or every turn the wave lasts). At full, a cage opens and a caged subject (dino) enters the ring. The breached subject attacks EVERYONE, enemies too, and drops a big reward if beaten. Two-sided: it can clear the wave for you or wipe you. (Breakout-on-counter is a Lobotomy Corp idea; a creature that hits both sides is like Monster Hunter's two-monster arena. Keep the meter look and rules your own.)
3. **Feeding Time** — every 3rd/4th round a bell rings and meat drops on the lowest-HP unit on each side. Carnivores (dino enemies, maybe some fighters) go for the "fed" unit and hit harder, but a fed unit is also healed. Makes the healer decide whether to top someone up. Not taken from a specific game.
4. **Cage Doors** — the ring has open/closed side doors that swap each round. A fighter by an open door can be grabbed/hit by a caged beast from outside, but also gets a free swing at it (bonus loot). Telegraphed one round ahead (Into the Breach-style "show it before it happens").
5. **Sedative Gas** — when a wave drags past N rounds, vents release gas: everyone (both sides) gets slowed/sleepy. Sleeping enemies take bonus damage, but your fighters can fall asleep too. Pushes speed like the W1 Alarm, so maybe NOT for W2 to avoid repeating W1.
6. **Handler's Remote / Control Collars** — some enemies wear collars; the handler (a non-fighting NPC voice on the PA) gives them orders. Break a collar (hit it with X damage in one turn) and the creature turns wild: it stops following orders (no more combo attacks) but hits harder and randomly. Two-sided by design.
7. **Power Outage** — every few rounds the lights go out for one round: no buffs/telegraphs are shown, and both sides have a miss chance; electric fences (cages) stop working so caged subjects may get in. Similar feel to W3 Searchlight (light theme), so check for overlap.
- Recommendation to the parent writer: rules 1, 2 and 6 fit "test ring" best and do not overlap the existing W1 Alarm (speed), Sewer Tide (round timer + status wash) or W3 Searchlight (light/aggro). Rule 5 overlaps W1 (speed pressure) and rule 7 overlaps W3 (light).

### Gaps
- No design postmortem was found that measures how players react to two-sided world rules; balance effect must be tested in FAL125's own lab tools.

## What boss mechanics feel great in turn-based fights?

### Takeaway
Turn-based bosses feel great when the player can see the threat coming (telegraphs/intents), when phases change HOW you must play (not just more HP), and when a "pause" between phases gives a planning window. Gimmick bosses (a captured ally, a pot) are loved and hated: they need a clear counter and a short life.

### Cited Findings
- Into the Breach: Subset Games wanted every death to feel like your own fault, so telegraphed enemy attacks became the core mechanic — [Game Developer: Road to the IGF](https://gamedeveloper.com/game-platforms/road-to-the-igf-subset-games-i-into-the-breach-i-)
- Justin Ma said fairness came more from map design than from the AI — [Kicktraq / making-of article](https://kicktraq.com/articles/redirect/35147)
- A telegraphed attack happens whether or not the player is in the spot — [r/gamedesign thread](https://reddit.birdcat.cafe/r/gamedesign/comments/1jv94ts/telegraphed_attacks_direct_attacks_or_a/mmjbv6t/?context=3)
- General boss pattern: telegraph -> attack -> punish window; longer warnings for more dangerous moves; later phases can shorten warnings — [Bugnet: multi-phase boss](https://bugnet.io/blog/how-to-design-a-multi-phase-boss-fight) (blog)
- Phases should change how the fight plays and build on patterns learned earlier; 2-3 phases suit most bosses — [Wayline](https://www.wayline.io/blog/crafting-legendary-boss-battles) (blog)
- Game Developer's "Evolution of Boss Designs" explicitly says turn-based boss design is too different to cover — [Game Developer](https://gamedeveloper.com/design/the-evolution-of-boss-designs-in-video-games)
- Tabletop/RPG Maker advice: give bosses extra actions per round or let them act outside normal order — [RPG Maker forums](https://rpgmaker.net/forums/topics/20746); [Black Citadel](https://blackcitadelrpg.com/?p=8824)
- Slay the Spire, Awakened One: stage 1 has 300 HP; when it is emptied the boss is invulnerable for a turn, then reborn in stage 2; its Curiosity (gains Strength when you play Powers) goes away in stage 2 — [StS fandom wiki](https://slay-the-spire.fandom.com/wiki/Awakened_One); [Steam discussion](https://steamcommunity.com/app/646570/discussions/0/1692659769958773749)
- StS2 Test Subject: three revives with a stun turn between, each phase punishes a different habit — [Neon Lights Media](https://www.neonlightsmedia.com/blog/slay-the-spire-2-test-subject-boss-guide)
- StS2 devs said the much-criticised Doormaker boss is actually slightly weaker than other Act 3 bosses — a reminder that "feels unfair" matters as much as numbers — [GamesRadar](https://www.gamesradar.com/games/roguelike/slay-the-spire-2-devs-say-the-doormaker-boss-that-sparked-so-many-negative-steam-reviews-is-actually-slightly-weaker-than-the-other-act-3-bosses/)
- Darkest Dungeon, The Hag: she puts one hero in her cooking pot, where they take damage every round; she has low HP so the team can burst her down to free the hero; players are split on whether this is good design — [Darkest Dungeon wiki: Hag](https://darkestdungeon.wiki.gg/wiki/Hag); [r/darkestdungeon boss discussion](https://reddit.birdcat.cafe/r/darkestdungeon/comments/8po9xa/boss_discussion_3_hag)
- Inscryption: Leshy has three phases (others have two); phase two reuses "Deathcards" (cards made from your past runs) — [PC Invasion](https://www.pcinvasion.com/inscryption-boss-guide-leshy-angler-prospector-cabin/5/); [Inscryption wiki: Deathcard](https://inscryption.fandom.com/wiki/Deathcard)
- Hades, Theseus & Asterius: a duo boss in a stadium (two bosses at once, crowd watching) — [Gamepressure](https://www.gamepressure.com/hades/theseus-and-asterius/zeebbe)

### Inferences (boss ideas for the Ringer; Claude's drafts)
- **Control-collar dino boss**: phase 1 the dinosaur is collared and follows the handler's telegraphed orders ("Next turn: TAIL SWEEP all"). Damage the collar (a weak point with its own small HP) to break it. Phase 2: no more warnings, wild and stronger, but it also attacks its handlers/adds. Choice: break the collar early (lose telegraphs) or fight the obedient but well-coordinated version. Fits FAL125's existing `P2_V270` phase-2 helper system. (Collars are a generic trope; the "lose the telegraph when you free it" twist is not from a source found here.)
- **Revive-with-pause pattern** (Awakened One / Test Subject): a resurrected dinosaur that "dies", stays down one turn (lab pumps it with serum, shown on screen), then returns in a new form. That pause is a free setup turn for the player. Mega Crit owns these specific bosses; the general "rebirth phase" idea is widespread.
- **Captured-fighter gimmick** (Hag-style): a tank grabs one of your fighters into a cage/jaws; that fighter is out and takes damage each turn until the boss takes X damage. Keep boss HP lowish. Darkest Dungeon's pot is the well-known version; use a different object and release rule.
- **Duo / handler + beast** (Hades Theseus & Asterius style): a scientist/handler boss that buffs and orders, plus the dino. Kill the handler first and the dino goes wild; kill the dino first and the handler unleashes a backup subject.
- **Telegraphs**: since FAL125 is speed/turn-order based, show a big move one turn ahead with a chip over the boss; let Tanks taunt or Healers pre-shield. This is the Into the Breach principle ("every death is your fault").
- Dinosaur-specific feel (from Dino Crisis): sound/warning before entry (a "thud" log line a turn early), acting fast (extra action or high SPD), lots of HP.

### Gaps
- No primary design source on how Ark, Turok or Jurassic-themed games tune dinosaur bosses; dinosaur advice here is inferred from Dino Crisis reviews and JWE breakouts.
- slaythespire.wiki.gg could not be fetched in this session (network not allowed), so exact Awakened One intent sequence was not checked.

## How to structure the world into floors with escalating story beats and environmental storytelling?

### Takeaway
Use the facility's own escalation clock (meltdown levels, breakout risk) as the floor structure, and tell the story through found notes and a PA voice, ending with a question that points past the world (Cinnabar journals -> Cerulean Cave).

### Cited Findings
- Lobotomy Corp escalates through named tiers (Dawn -> Noon -> Dusk -> Midnight), each tied to a meltdown level and a risk class — [Ordeals wiki](https://lobotomycorp.fandom.com/wiki/Ordeals)
- Battle Factory places a boss at fixed milestones (battle 21 and 42) — [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Battle_Factory_(Generation_III))
- Cinnabar journals: scattered notes told in time order, from discovery to creation to escape, with a hook to a later area — [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_Mansion_journals)
- Portal's hidden dens contradict the official voice, and finding them uses the main mechanic — [Mechanics of Magic](https://mechanicsofmagic.com/?p=31060)
- JWE uses a scripted breakout in a campaign mission as a story beat — [TrueAchievements](https://www.trueachievements.com/game/Jurassic-World-Evolution/walkthrough/7)

### Inferences (a floor plan draft, Claude's suggestion)
- Floor 1 "Intake": calm PA voice, enemies are small test subjects; first log: "Subject batch arrived." Teaches the world rule gently.
- Floor 2 "Trials": test scores shown after each wave (e.g. "Trial 2-3: PASS, 78%"); first sign of a cage that is empty.
- Floor 3 "Revival Wing": first resurrected dinosaurs; logs from a keeper about the dinos "remembering" things; PA starts glitching.
- Floor 4 "Breach": the scripted breakout floor; containment rule is at its worst; PA says everything is fine (contrast with notes).
- Floor 5/boss "The Ring": the collared apex dinosaur + handler; final note sets up a question for a later world.
- Story notes can be Archive entries (FAL125 already has `ARC_LORE`), test-score cards between waves, and PA lines in the battle log (`say`).
- Avoid copying: the Cinnabar "journal" sequence, GLaDOS's personality, Lobotomy's Dawn/Noon/Dusk/Midnight names and the Qliphoth term are owned by those games. Use the author's own names (e.g. own tier names, own announcer).

### Gaps
- No source compared how many notes per floor players actually read; pacing must be judged by playtest.
