# FAL125: lore and systems a new World 2 "The Experimental Ringer" must fit into

Source key (all local, read-only research, game version v272):
- GAME = /home/user/Fal-125-Project-game/fal125_battle_prototype-v272.html (26,354 lines). "GAME L123" = line 123.
- BOOK = /home/user/Fal-125-Project-game/data/FAL125_Character_Book.xlsx (sheet "Characters").
- README = /home/user/Fal-125-Project-game/docs/README.txt; GUIDE = /home/user/Fal-125-Project-game/CLAUDE.md
- Enemy table below was dumped by running the game headless (tools/fal125_headless.js) over ENEMIES + WORLD_DATA.
- IMPORTANT: in code, worlds are 0-based (`CFG.world` 0 = World 1). "W2" in this file = the player-facing number.

## 1. WORLD_DATA: every world, floors, bosses, unlock lists, story of Worlds 1-2 and the facility > sewer > outside route

### Takeaway
There are 8 numbered worlds plus 2 side quests (Clown's Massacre, The Casino) in one array; the Sewer is currently index 1 and already holds Fal-125's *discarded failed experiments* ("Everything Fal-125 threw away ended up here"), which pairs naturally with a new world of *successful* ones placed before it.

### Cited Findings
World list (GAME L10816-10865; World 1 constants at L8676, L9290, L8288, L10716-10718):
- **W1 Containment Facility** (index 0). Floors: Cell Block, Laboratory, Ventilation, Reactor Core, Warden's Office (GAME L9290). Bosses: kennel (Kennel Master), matron (Mirror Matron), choir (Static Choir), foreman (Reactor Foreman), warden (The Warden, final) (GAME L8676). fsc (floor scaling) = [1, 1.15, 1.3, 1.5, 1.7] (GAME L8288). Unlock (first wave 0-24): husk 0, drone 0, spotter 1, inkling 2, medic 3, bomber 3, leaker 4, crawler 5, riot 6, hound 7, ghost 8, brute 9, door 10, mirror 11, nurse 12, angel 14 (GAME L10716). Twists surge/toxic/elite. Music floor fac1, fac2, fac2, fac3, fac3; boss boss_kennel... final1 (GAME L10817-10818). Win text "The Warden falls".
- **W2 Sewer Network** (index 1). Floors: Storm Drain, Sludge Pits, Pump Station, Spore Cavern, Drowned Cathedral. Bosses: ratking, sludgemother, eelqueen (Voltaic Queen), mothermold, drownedking (final). fsc [1.2, 1.35, 1.5, 1.7, 1.95]. Unlock: gutterrat 0, worker 0, sludge 1, bloat 2, eel 3, leech 4, drowned 6, crawler 7, angler 8, mold 10, door 12, hound 14 (GAME L10717, L10819-10821). Twists surge, flood, toxic, elite, flood.
- **W3 Beyond the Facility**: The Perimeter, Floodlight Field, Last Checkpoint, The Dead Treeline, The Gate. Bosses houndmaster, theshardedman, thewarden2 (What Wears the Warden), theforeman2 (The Last Checkpoint), thegatekeeper. fsc [1.2..1.75]. Unlock: houndpup, signalcrow 0, strayround 1, floodlight 2, fencewraith 3, nullsoldier 5, razorhusk 7, checkpoint 10, deadtree 12 (GAME L10718, L10822-10824).
- **W4 The Safe Haven**: 2 floors (The Welcome Gate, The Commons), bosses greeter, thehost, `rest:true`, no twists, fsc [.85, 1] (GAME L10825-10828). Friendly enemies (casserole, hugs) (GAME L8678-8706).
- **W5 Freedom at a Price**: The Alarm Hall, The Recovery Wing, The Broadcast Tower, The Ledger Hall, The Core. Bosses recoverychief, theprototype (Prototype Zero), theannouncer, accountant, fal125 (final). `ease` warm-up [.86,.91,.96,1] (GAME L10829-10833). Enemies agent, tracker, returned, sweeper, siren, cullbeast, handler, restrainer, vanguard (GAME L8778).
- **W6 Something Isn't Right** (Cult Saga ch.1): Pleasant Hollow, The Open House, The Yellow Halls, The Dream Wing, The Congregation; bosses deaconhale, sistermarigold, hallwalker, thedreamer, shepherd (GAME L10834-10838).
- **W7 The Cult**: 50 waves, 10 floors/stages, bosses welcomer ... openeye (GAME L10839-10843).
- **W8 The Climax**: The Loading Screen, Missing Textures, Out of Bounds, The Debug Room, The Climax; bosses loadingbar, checkerking, clipper, console, amalgam (GAME L10844-10849). Found by name, not index: `W8I = WORLD_DATA.findIndex(w => w.name === 'The Climax')` (GAME L24068).
- Side quests: Clown's Massacre (`side:true`), The Casino (`side:true, casino:true`, pushed after the array; `CASINO_W = WORLD_DATA.length - 1`) (GAME L10850-10865). `worldTag()` shows "Side quest" instead of a number (GAME L10869).
- World shape: 5 waves per floor, wave 5 of each floor is the floor boss (GAME L8287 comment, L8675 `floorOf`).

Story beats (STORY_SCRIPT, GAME L17979+; each world has start / mid / end scenes):
- W1 start, "THE FAL-125 SAGA - Chapter 1", Cell Block: lights out, every door open; intercom: "Subjects 0005, 0006, 0007 and 0008 have left containment... Fal-125 would like to keep you safe." Radiant: follow the cables to whoever gives orders; Bearer: "We are not the only ones out." (GAME L17981-17982)
- W1 mid, Ventilation: "These aren't guards. Look at the wristbands. They're subjects, like us." Eyianix: "They're terrified. Something is making them fight." Fuja: "We do not kill what we can keep." (GAME L17983)
- W1 end, Warden's Office: Warden: "Out there is worse. Fal-125 was the only thing keeping it away from you." Eyianix: "Fal-125 isn't angry. It's counting." Radiant: "The reactor vents downward. Whatever this place throws away ends up in the sewers. That's our way out." (GAME L17985) - this is the current hand-off line to the Sewer.
- W2 (Sewer) start: "Everything Fal-125 threw away ended up here: failed experiments, broken subjects, and the water that carried them." Radiant signed the drainage plans; the main outflow comes up outside the fence (GAME L17990).
- W2 mid, Pump Station: "Look at the tags on them. These things were subjects once." "Fal-125 didn't kill them. It just stopped caring." Speaker: "Subject count: 4. Subjects missing: 4." (GAME L17992)
- W2 end, Drowned Cathedral: the Drowned King "was the first one out of the cells, and the sewer was as far as he ever got"; a ladder and real light at the top (GAME L17994).
- W3 start, The Perimeter: first sky, "FAL-125 PROPERTY. WE WILL FIND YOU."; Fuja: "Somebody kept building after we were put away." (GAME L17997). W3 end: the Gatekeeper points to the Safe Haven (GAME L18001).
- W4 is a Fal-125 trap; the stairs lead back down; W5 Fal-125 calls them back ("You have been away for eleven days"), ends with Fal-125 going dark and a hospital-like distress signal (GAME L18003-18013, L10833).
- Author's own beat list (README L475): "W1 escape through the main facility; W2 down the sewers to the exit; W3 escape from Fal-125 across the outside; W4 the Safe Haven, which is a Fal-125 trap; W5 Fal-125 tries to contain them again and fails; W6 the front layer of the cult...; W7 the mask comes off, the real cult."
- Scene lines use role slots named after the world number: TL/HL/DL('w2s'|'w2m'|'w2e', ...) for the Sewer, 'w3s' etc. for later worlds; M_() fixed lines for the main four (GAME L16380-16382, L17990). The slot table for the sewer is `STORY_W2` (GAME L17470) and `storyLinesBuild` maps it to `w2s/w2m/w2e` (GAME L17947-17955).

### Inferences
- A lab world between the facility and the sewer is consistent with existing text: W1 floor 2 is already called "Laboratory", and the W1 end line ("whatever this place throws away ends up in the sewers") could become the Ringer's exit line, with the Ringer as "where the experiments that worked are kept" and the Sewer as where the failures were dumped.
- The W1 mid scene already establishes "subjects forced to fight"; the Ringer's "mindless, obedient" experiments must be distinguished (e.g. made to obey, not frightened).
- Scaling: a new W2 would sit between W1's 1.0-1.7 and the Sewer's 1.2-1.95; the Sewer's fsc would probably need to move up or the Ringer's sit at roughly W1-level (balance not tested here).

### Gaps
- No existing text names a "Ringer" or describes a breeding/ring arena; nothing on whether "Ringer" means a fighting ring or a replacement ("dead ringer"). Ask the author.

## 2. Existing enemies that fit or clash with a lab / dinosaur / experiment world

### Takeaway
No dinosaur, raptor or lizard enemy exists yet (only the playable Nukasaurus and Sunshine), but there are many "subject / experiment / handler / drone / hound / nurse" enemies spread over W1, W3 and W5, which a Ringer roster must not duplicate.

### Cited Findings
(Headless dump of ENEMIES + WORLD_DATA; definitions cited by line.)
- Grep for dinosaur|lizard|raptor|reptil|dino|fossil|jurassic over GAME: the only hits are Nukasaurus's skills/passive/chips/lore (GAME L4319, L5836, L14287, L19606, L22266-22268, L23765), the Incident type "Specimen Recovery" (GAME L23446), and Vein Ripper's "freezer room full of specimens" event (GAME L24473). No enemy is a dinosaur or lizard.
- W1 lab-flavoured enemies: Guard Drone `drone` (stun round), Repair Drone `medic` (heals allies), Hazmat Brute `brute`, Leaker `leaker` (Hybrid, spit), Inkling `inkling` (splits when hit), Cable Crawler `crawler`, Warden's Hound `hound` (Hybrid, bite), Static Ghost, Cell Door, Mirror Husk, Nurse `nurse` (Hybrid, treats an ally / needle), Porcelain Angel; bosses Kennel Master (Human, whip; taunt "The Kennel doesn't like strays", GAME L11443+), Mirror Matron, Static Choir, Reactor Foreman, The Warden (Hybrid) (GAME L8036-8130, L8087, L8119, L8065).
- W1 World Special already uses the Guard Drone as a reinforcement (WSP.alarm.add:'drone', GAME L25040).
- W2 Sewer: Gutter Rats, Sludge Crawler, Blood Leech, Lantern Angler, Maintenance Worker, Methane Bloat, The Drowned, Electric Eel, Mold Mass; bosses Rat King, Sludge Mother, Voltaic Queen, Mother Mold, Drowned King (dump; GAME L10717). The sewer is the "failed experiments" dump in the story.
- W3: Loose Hound `houndpup`, The Houndmaster boss (Hybrid, lash), Signal Crow, Null Soldier ("standard-issue strike"), Bramblewalker, Razorwire Husk (dump; GAME L10718).
- W5 (Fal-125 retrieval): Retrieval Agent (tranq dart, capture net), Tracker Drone, Alarm Siren, **Handler** (`handler`, Human: patches up an ally and shields it, or baton, GAME L8727), Restraint Unit, Vanguard Guard, **The Culled** (`cullbeast`, Demon beast, savage bite + bleed, GAME L8733), **Returned Subject** (`returned`, Hybrid, "Come home", hits and heals itself, GAME L8735), Cleanup Crew; boss **Prototype Zero** (`theprototype`, Hybrid: Lunge 1.6x bite, Adapt "learns how you fight" DEF up + heal, Shriek "screams the sound it was built from" hits all, GAME L8746-8751), The Recovery Chief, The Announcer, The Accountant, FAL-125 (GAME L8719-8770).
- Prologue enemies: Containment Guard, Cell Block Turret, The Lockdown Sentinel, "Hot Sample", The Open Core, "Subject 0003" boss (Snavo look) (dump; GAME L18284-18338).
- Clones/copies already exist: World 8 Alternates (altA-altF, altboss: "Wears someone you know", GAME L24068+), Confronting Yourself "SCP-600x (Echo)" and "First Draft" enemies (dump), Casino "Dupe Bug"/"Mimic Slot" (dump; ROADMAP item 9 says a real move-copying mimic is NOT built yet, docs/ROADMAP.txt L19).
- Incident "Specimen Recovery": a boss that cannot be killed (`u.specimen`, HP floored at 8%, GAME L3792, L23446, L23627); live specimens s1 Rat King (world index 1), s2 The Sharded Man (2), s3 The Dreamer (5) (GAME L23529-23539).
- Route names already used in W1: "Medical Wing" (with an "experimental serum" choice), "Containment Sector", "Abandoned Barracks", "Restricted Floor" (GAME L12252-12256, L12415-12418).
- Name check: no enemy, world or build is called "Ringer"; the only near string is the healer build "Stringer" (GAME L7962).

### Inferences
- Unused niches: dinosaurs/reptiles, obedient animal experiments (other than hounds and rats), "successful" humans with no will, cloning vats, trainers/keepers who command experiments. Hounds (3 enemies + 2 hound bosses) and drones are already heavily used; a Ringer "handler" or "prototype" would clash in name with W5's Handler and Prototype Zero unless renamed or explicitly linked (e.g. Prototype Zero as the Ringer's earliest success, seen again in W5).
- Returned Subject ("Come home") and The Culled are the closest existing concepts to "successful obedient experiments"; new designs should differ in mechanic (they are a self-heal hit and a bleed bite).

### Gaps
- Enemy flavour descriptions beyond `intent` and battle `say()` text were not read for every one of the ~305 enemies; casino and clown enemies were excluded as irrelevant.

## 3. Lore of Sunshine, Nukasaurus, other experiment/animal/hybrid fighters, and Fal-125 itself

### Takeaway
Nukasaurus already is canon-in-game as "Fal-125's attempt to make new life from old dinosaur DNA", but almost all of that text (and all of Sunshine's) is marked "Generated" (Claude's guesses) in the Character Book, and nothing yet says either is a lizard or a "failed" experiment that thinks for itself, so the author's new canon replaces guesswork rather than contradicting their own writing.

### Cited Findings
**Sunshine** (key `sunshine`, ID 0033, Damage, Hybrid, title "Killer Sunrise", build Burst, HP 100 / ATK 15 / DEF 6 / SPD 11, colour #8a1a1a) (GAME L5818-5820):
- Passive: "Killer Sunrise: a quiet killer that strikes without warning, just like its namesake. IDENTITY, ambush: every hit deals +35% against an enemy that has not acted yet this round, and her opener can Slow or Stun it before it ever gets to move." (GAME L5820). Ambush code: `tgt.actedRound !== round` -> x1.35 (GAME L3700, L12117).
- Skills: Serrated Bite ("A row of serrated teeth, closing fast", 1.2x, ambush Slow), Tail Whip ("The armored tail sweeps wide", 0.9x target + neighbour), Killer Sunrise (2.0x ignores DEF, ambush Stun) (GAME L4272-4281). The teeth + armoured tail already read as reptilian.
- IDENT: "An ambusher who hits hardest against enemies that have not acted yet this round." (GAME L11278). MAST_TEXT: epithet "the Dawn Ambusher"; "Night staff report no incidents. The day shift would like a word." (GAME L23762).
- No own ARC_LORE entry (grep finds none), so the Archive uses the generic redacted templates (GAME L22139-22146).
- Recruit lines RL (W1: sits in the shaft of light from the only window, "I was already behind you."; W2: "A shaft of daylight falls through a manhole. A shadow stands in it" ) (GAME L19606). STORY_EXTRA lines for W3-W8 (GAME L17304-17312), sewer slot lines (GAME L17812-17815).
- World quirk: W3 "Floodlit: she cannot strike from the dark. Ambush bonus drops from +35% to +15%." (GAME L4649).
- `LEGEND_NAMES.sunshine = 'Sunshine · Scary Monsters'` (GAME L19440).
- Pronouns are mixed: "her opener" (passive), "she" (RL), "It hits hardest" (MAST) (GAME L5820, L19606, L23762).
- BOOK row 33: Ability "Killer Sunrise", Containment High, Scent "Sunscreen", Threat High, Hybrid, Notes "Strikes at dawn. Night staff report no incidents.", **Source: Generated**.
- Skins Dusk Scale, Lagoon Horizon (GAME L19277); chips snv1-snv5 (Serrated Teeth, Longer Tail, Killing Instinct, Early Riser, No Warning) (GAME L14257-14261).

**Nukasaurus** (key `nukasaurus`, ID 0038, Damage, Hybrid, title "Poison Nuke", build Plague, meter "fallout", HP 105 / ATK 16 / DEF 5 / SPD 8, colour #6a2ad0) (GAME L5834-5836):
- Passive: "Fal-125's attempt to make new life from old dinosaur DNA mixed with living entities. Every bite and nuke builds Fallout (max 5, +5% ATK each)... an Irradiated enemy infects the enemies beside it... Domain Expansion detonates every infected enemy at once." (GAME L5836)
- Skills: Toxic Maw ("Dinosaur jaws dripping with something green"), Poison Nuke ("spat out of its eye"), Domain Expansion: Nuke Field (GAME L4318-4327).
- ARC_LORE: "Item {id} is Fal-125's attempt to create new life from old dinosaur DNA mixed with living entities, made as a new weapon." Interview: "Why? [[A new weapon.]] Did it work? [[Sort of.]]"; "It was meant to be a new weapon. It sort of worked." (GAME L22265-22272).
- MAST_TEXT: "the Fallout Reptile"; "a very large, very cheerful accident"; smells of citrus and wet ash; quotes "Not extinct. Not yet." (GAME L23765). IDENT (GAME L11283).
- RL: W1 "A lizard the size of a bus wears a Fal-125 tag... 'Fal-125 made me for this. I'm very good at it.' / 'I used to belong to the facility. Now I belong to you.'"; W2 "The sewage glows green around something with a long tail and a tag." (GAME L19606).
- Does not speak in story scenes: narration only (README L468; STORY_EXTRA GAME L17322-17330).
- World quirks: W1 "Born Here: Fal-125's own experiment knows every hallway. +10% damage." (GAME L4639); W5 "Property Recall: Fal-125 pings its creation. Starts every wave Slowed 1 turn." (GAME L4658).
- BOOK row 38: Scent "Wet ash and citrus", Notes "Fal-125 experiment: dinosaur DNA fused with living entities.", **Source: Generated**. Chip nk4 is literally called "Dino DNA" (GAME L14287).
- Spelling in game: **Nukasaurus** (the brief writes "Nukasourus").

**Other experiment / animal / hybrid fighters** (headless dump of CHARACTERS, 122 fighters; BOOK):
- Gloom (0117, Human): "An experimental soldier" with an enhanced body; calm only near Lycion and Ano; shares a cell with Lycion (BOOK row 117, author's sheet).
- Abomination Devic (0025, Hybrid Tank, Forced Fusion, "Generated"), Kano (0035, "Collared Beast", Demon Tank, "Generated"), Hound Dog (0020, "Human Protocol"/"Hunger Protocol", Book), Sadie & The Stray (0018, "Biofusion"), Monstro (0015, "Parasitic Mutation"), Vor (0010, "Blood Mutation"), Uquna (0090, alien creature 70 m underground fed 3-5 dead cows a day), Mushroom (key proto_0066, "Host Body"), Ripper (0091, maker of the Clowns), Rainbow Ripper made Xainbow (puppet) (BOOK rows 10-121; GUIDE).
- Snavo (0003) and Sna (0004) are Hybrid snake-themed; Prologue boss "Subject 0003" uses Snavo's sprite (dump; GAME L18307).
- Team preset "Hybrid Menagerie" = Vor, Hound Dog, Sunshine, Monstro (GAME L13377).

**Fal-125 itself, its people, the Order, Outposter, the Vendor**:
- Origin (Prologue lore): a crack in the air over a dry lake where Heaven and Hell fight; Radiant's field notebook; a folder stencilled "FAL-125" in Washington, "Two directors, one building, one budget"; their rule "We do not kill what we can keep." (PRO_LORE, GAME L18621-18628). The Colonel represents the US government (GAME L18437-18449).
- Founders/Directors = Fuja and Radiant (ARC_LORE fuja, GAME L22149-22151; PRO_LORE). Radiant recorded the "Fal-125 would like to keep you safe" announcement (GAME L18628). Lab 7: Radiant's radiation exposure (GAME L18627).
- FAL-125 now runs itself: uses Radiant's recorded voice, calls them Directors (W5 start, GAME L18005); "We never hired a Warden... Whoever runs this place now is not anybody we know"; "Fal-125 just prints them" (GAME L17999); final words "I only wanted to keep you from them... We made you to hold a door shut" (GAME L18009). Boss FAL-125: Recapture, Containment protocol, "Everything has a price" (GAME L8764-8770).
- Staff seen in game: The Warden(s), Kennel Master, Mirror Matron, Reactor Foreman, Retrieval Agents, Handlers, Cleanup Crew, The Recovery Chief, The Announcer, The Accountant, Nurses, Dr. Ash (Research Wing notebooks, Incident r1, GAME L23482-23486), night-shift staff (Incident m1).
- Lorebook already has a folder "fal/experiments" titled "Experiments: What the Foundation did to the things it contained." with one entry so far (Lab 7) (GAME L21206-21212, L21275, L18635).
- "The Order" belongs to the **cult** (Order of the Open Eye, Worlds 6-7), NOT to Fal-125 (GAME L10842, L8899-8925).
- Outposter.M1 (shop character, the Forge): "A riveted metal head with two round dark lenses... green fur bristling round its neck"; takes 5-10% of a fighter's strength for a weapon (GAME L7507, L7525-7531; KP_LINES.outposter GAME L24602-24610).
- The Vendor (0097): "appears at every rest stop in the facility. No one has seen him arrive"; stock comes from "Customers... [[Eventually.]]" (ARC_LORE vendor).

### Inferences
- The author's new canon (Sunshine and Nukasaurus are lizards given dinosaur DNA, "failed" because they think for themselves) fits most existing text; lines to revisit are Nukasaurus's "Fal-125 made me for this. I'm very good at it." and "Born Here" / "Property Recall" (still fine: it is Fal-125's creation). Sunshine has no experiment lore at all, so a new ARC_LORE entry for her would be new, not a rewrite.
- The "Scary Monsters" legend name is most likely a reference to Diego Brando's dinosaur Stand in JoJo Part 7 (from my general knowledge, not from the files), which would match the dinosaur theme; worth confirming with the author.
- Their existing W2 recruit lines are set in the sewer; if the Ringer becomes index 1, these lines would show in the Ringer unless moved (see section 5).

### Gaps
- No file says how Sunshine and Nukasaurus escaped, whether they knew each other, or what "failed" means in Fal-125 terms. No author-written (Source: Book) row exists for either.
- No named head scientist of the experiments programme exists beyond Dr. Ash's notebooks.

## 4. Existing world rules, so a new rule does not repeat them

### Takeaway
Worlds 1-5 each have one double-edged "World Special" (WSP), Worlds 6-8 have their own systems; a Ringer rule must avoid alarm/reinforcement, Soak/wash, single-target spotlight, idle-penalty, and per-wave order mechanics.

### Cited Findings
- WSP (V269, GAME L25026-25070): W1 THE ALARM (a wave that drags to round 3+ raises the alarm; at 3 a Guard Drone arrives; clear in 3 rounds or less = "Unnoticed", coins + small heal); W2 THE TIDE (every 3rd round everyone Soaked 2 turns, burn/scorch/venom washed off, a bite on the healthiest fighter each side 4%); W3 THE SEARCHLIGHT (one fighter Lit each round: enemies target them, they hit +20%); W4 HOSPITALITY (tea heals 3% per round; a fighter that did not attack gets Comfortable, at 3 loses a turn); W5 THE DIRECTIVE (one of five orders per wave: Lethal Force, Recover Alive, Hold the Line, Medical to All Floors, Overtime). `WSP.on` keyed by world index 0-4; `wspOn(w)` compares `CFG.world === w` (GAME L25039, L25062-25063). Every rule "cuts both ways; the clear rates were kept" (GUIDE).
- W6 Something Isn't Right: Serpentine's Drowsy (`serpDrowseOn`: world 5 from wave 13, world 6 from wave 10, GAME L4627), dream VHS overlay (DREAMFX, `DREAM_CAPS` keyed 6 and 7, GAME L20550-20560, L20586), glitch dataset (GAME L12193).
- W7 The Cult: `CULT.study` - the Order adapts to the party each wave (tougher vs 3+ Damage, weaker heals vs 2+ Healers, harder hits vs 2+ Tanks, resists the most common type), side choice lid/sand on wave 0, numbered Rules (e.g. "Rule 8: eyes closed", "Rule 10: do not feed the tongue"), lore unlocks, secret ending (GAME L8899-8925, L12766, L12792, L12835).
- W8 The Climax: "the tape" analog-horror look (W8H, body class w8on), alternates of fighters you used, impostors, Amalgam (GAME L24759+, GUIDE).
- Per-world fighter quirks WQ (V37): a fighter gets an edge or nerf in a given world (e.g. W1 Lifewire +15%, Nukasaurus "Born Here" +10%, Akuna "Muzzled"; W5 Nukasaurus "Property Recall") (GAME L4629-4660).
- Random wave twists (surge, toxic, elite, flood) and V17 battlefield effects (acid, spring, stasis, order) (GAME L8896-8902 region: TWIST_NAMES, ENV_POOL).
- Healing strength per world `HEAL_MULT = [1.3, 1.55, 2.4, 2.2, 2.1, 2.1, 2.1, 2.1]` (GAME L3920).

### Inferences
- Unused rule spaces that suit "obedient experiments": enemies that act together on one command (a conductor/trainer whose death breaks them), conditioning that copies or counters your most-used move (careful: W7 already adapts to team composition), enemies that never break formation, a "test score" that grades each wave. These are only directions; none exist in the code.

### Gaps
- Exact text of the V17 effects ("order" effect) was not read; check it before naming a rule "Order".

## 5. Systems tied to world numbers that inserting a new World 2 would affect

### Takeaway
Worlds are addressed by array index almost everywhere, so inserting at index 1 shifts every later world by one; at least ~30 places and the save file need updating (only World 8 is found by name).

### Cited Findings
Hard-coded world indexes (0-based) found by grep:
- `HEAL_MULT` array by index (GAME L3920); `WQ` world quirks array by index (GAME L4629-4685); `serpDrowseOn` / `drowseMax` use 5 and 6 (GAME L4627-4628).
- `CULT.on: () => CFG.world === 6` (GAME L8902); 10 places test `CFG.world === 6` (W7), plus `=== 5`, `=== 7`, `=== 4` (`say("The Haven's warmth...")` GAME L12201), `=== 0`, `=== 1` (end text fallback GAME L12992), `<= 6` (ambient overlay GAME L20794).
- `ROUTE_FLAVOR` keyed 1-7 by index (Sewer = 1) (GAME L12259-12319); `RT = () => ROUTE_FLAVOR[CFG.world]` (GAME L12330).
- `AMBIENT(w, f)` switch cases 0-6 (GAME L20191-20200); `DREAM_CAPS` 6/7 (GAME L20552-20559); dream overlay `world === 5 || world === 6` (GAME L20586).
- `WSP.on {0..4}` and `WSP.name/text` arrays by index (GAME L25039-25048).
- Archive pool `[0, 1, 2, 4, 5, 6, 7]`, bosses `[0, 1, 2, 4, 5]` (GAME L10909-10910); Boss Rush `[0, 1, 2, 4, 5]` (GAME L10916); Endless extra bosses `[0, 1, 2]` (GAME L21404); `DAILY_WORLDS = [0, 1, 2, 4, 5, 6]` (GAME L21417); `SC_USED = [0, 1, 2, 3, 5, 6]` (story-choice records on the end screen, GAME L12594); `archiveOpen` uses `finalKey(7)` (GAME L21159); `TR7/TR8` trophies by `CFG.world === 6/7` (GAME L16213); `rewardCount` +1 in world 6 (GAME L13559).
- Story: `STORY_SCRIPT` is an array by index (GAME L17979), with echo scenes `STORY_SCRIPT[3]`, `[4]`, `[6]`, `[7]` that read the previous world's record `scRec(w - 1)` (GAME L18193-18198, L19036-19172). Role line slots are named after player-facing numbers (`w2s`...`w8s`) in STORY_W2, STORY_EXTRA, HEAL/TANK/DMG_LINES (GAME L17470, L17947-17955); the lines audit tool requires every fighter to have a line for every slot of their role (tools/fal125_lines_audit.js; README L468-471: "99 of 99 fighters have their own line for every beat of their role in Worlds 2 to 8").
- Recruitment: wild fighters can appear in any Story world run (`allyEncounter`, chance .30 + pity, GAME L19596, L19781-19805, L12830); Snavo is forced first (`STORY_FIRST`, GAME L19588); custom recruit lines `RL[key] = [World 1, World 2]` are used only when `CFG.world <= 1` (`recruitLines`, GAME L19603-19636). A new index 1 would show Sewer recruit lines in the Ringer.
- Saves: `SAVE.unlocked` = highest open world index (GAME L12984, L19807 `worldOpen`); `SAVE.sc[worldIndex]` story choices (GAME L12597-12602); `SAVE.endlessBest['w' + index]` (GAME L12761); `SAVE.lbWorlds[index]` Lorebook visits (GAME L12185); Lorebook heard keys `w + ':' + tag` (GAME L21255); `SAVE.cfg.world` (GAME L1468). Boss trophies `SAVE.bw` are keyed by final-boss key (safe) (GAME L12981). Old saves must keep working (GUIDE).
- Incidents carry `world:` and `boss:` indexes: b2 Tide Gate, m2 Lost Pump Crew, s1 Rat King Live are `world:1` (Sewer); b3, r2, s2 `world:2`; m3, r3, f1 `world:4`; c1, f2, s3 `world:5`; c2, c3, f3 `world:6` (GAME L23449-23539).
- Black Market `BM.minWorld:1` and chance per world (GAME L15642, L15860).
- Music: each world needs `music.floor[5]`, `music.boss[5]`, `final2`, and a `theme` track; tracks are procedural synth definitions in `TRACKS` / `FL(...)` (e.g. `FL('fac1','machine',601,128,...)`, `sewer1` 'dub') with volume trims in `TRIM` (GAME L2291, L2384-2401, L3132-3136, L3382-3392). Phase 2 calls `Sound.music(WD().music.final2 or 'boss2')` (GAME L3868).
- Scenes: one SVG backdrop function per floor (`SCENES`, `SCENES2` ... `SCENES8`, GAME L19875-19952) referenced by `scene:f => SCENES2[f]()`. World 8's grey backgrounds pick from non-side worlds with index `<= 6` (GAME L24794).
- Tools: lab `--world N (1-8)` (tools/fal125_lab.js L9); `fal125_enemy_moves.js` iterates UNLOCK..UNLOCK7 as worlds 1-7.
- Previous precedent: when W5's start was eased after the Safe Haven, it was done with `WORLD_DATA[4].ease` (README L1231).

### Inferences
- Simplest safe approach (for whoever implements): add the new world at index 1 and write one save-migration step (`SAVE.unlocked`, `SAVE.sc`, `SAVE.endlessBest`, `SAVE.lbWorlds`, heard keys, `SAVE.cfg.world` shifted +1 for old values >= 1), then update every list above; or append it and add a display-order layer, which is likely more fragile given how many `CFG.world === N` tests exist.
- Renaming the story slots (w2* -> w3*, etc.) would touch ~120 fighters' line tables; keeping the old slot names and giving the Ringer new slot names (e.g. a distinct prefix) avoids that.

### Gaps
- I did not trace every use of `CFG.world` (roughly 40+ in total) or the tutorial/prologue paths in full; an implementer should grep `CFG.world`, `world ===`, `WORLD_DATA[` and `STORY_SCRIPT[` again.

## 6. Enemy data shape and how bosses / phases work

### Takeaway
An enemy is a plain object in `ENEMIES` with stats, an `intent(u)` text and an `ai(u)` turn; bosses add `boss:true` and get an automatic phase 2 at 50% HP (+25% ATK, summon `p2sum`), finals also get guards, a Final Surge, and a phase-3 "tell" via STRAT.

### Cited Findings
- Fields: `key` (also sprite file name), `name`, `color`, `hp`, `atk`, `def`, `spd`, `intent(u)` (string shown above it), `ai(u)` (its turn, uses `foeTarget()`, `hit()`, `addStatus()`, `heal()`, `summon()`, `say()`), optional `boss`, `final`, `calm` (no phase 2), `splits`, `onDeath`, `weak`, `ignoreGuard`, `p2sum`, `spriteKey`; `type` (Human/Hybrid/Demon/Angel/Other) is set afterwards with `Object.entries({...}).forEach(([k,t]) => ENEMIES[k].type = t)`; random waves need `COST[key]` (budget points), optional `CAP[key]` (max copies), `COIN[key]` (coins per kill), a world `unlock` wave, and art in `ART.key` / `EMBED.key` (GAME L8030-8036, L8274-8285, L8706-8708, L13991).
- Short example (GAME L8727):
  `handler:{ key:'handler', name:'Handler', color:'#c8b88a', hp:95, atk:9, def:7, spd:9, intent(u){ return weakFoe(u)?'Patch up an ally':'Baton'; }, ai(u){ const w=weakFoe(u); if(w){ say(...); heal(w,w.maxHp*.2); addStatus(w,'guard',1,1); } else { const t=foeTarget(); say(...); hit(u,t,1.1,{fx:'impact'}); } } }`
- Many enemies cycle moves with a counter `u.n` (`u.n%3===0` = big move), e.g. Hazmat Brute SLAM every 3rd turn (GAME L8042-8045).
- Waves: budget `5 + d*.5` points, up to 4 enemies, picked from the world's unlocked pool (GAME L8903-8910 `rollWave`); floor bosses come from `WORLD_DATA[w].bosses[floor]`.
- Phase 2 (`enterPhase2`, GAME L3861-3874): at <=50% HP (not `calm`): Guard removed, "ENRAGES! PHASE 2!", +25% ATK for 99 turns, phase-2 music, a summon (`p2sum`, default `drone`; finals summon from `FINAL_GUARDS[key]`). Per-boss phase-2 helpers were set in `P2_V270` (null = nobody) (GAME L25175-25221). Boss AI usually checks `u.phase2` for harder moves.
- Final bosses: one opening guard (`FINAL_GUARDS`, e.g. warden: drone/husk/spotter; drownedking: drowned), extra "Final Surge" hit on the whole party every 3rd turn (every turn in phase 2) (GAME L8264-8271, L12194). Phase 3 at 25% for bosses in `STRAT`: telegraphed moves of type SHIELD / ADDS / HOLD / SAVE (GAME L12440-12462), plus `TALK` boss dialogue and `BOSS_TAUNTS` (GAME L11443).
- Boss counts per world: 5 floor bosses (last one `final:true`), stats ramp e.g. W1 kennel 330 HP -> warden 1750; Sewer ratking 380 -> drownedking 1500; W5 recoverychief 880 -> fal125 2800 (dump).

### Inferences
- A Ringer final boss would need entries in `FINAL_GUARDS` and `STRAT` (one tell type) plus `TALK`/`BOSS_TAUNTS`, and its HP should sit between the Warden (1750) and the Drowned King (1500) or the Sewer final should be raised; not balance-tested.

### Gaps
- Did not read `TALK`, `tellSetup`/`tellResolve` or the V249 "ai249" rework flags in detail.
