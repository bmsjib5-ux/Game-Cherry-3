mother_mushroom.glb — ต้นเห็ดแม่เรืองแสงยักษ์ (ด่าน 🍄 ป่าเห็ดเรืองแสง)
- Concept image: Higgsfield (GPT Image 2.5), 2026-11-03
- Image-to-3D: Higgsfield (Meshy 7 image-to-3D), 2026-11-03
- Optimized with gltf-transform + meshoptimizer: 24k -> 16k triangles, 2048 -> 1024 JPEG texture,
  normal/metal/AO maps removed, KHR_mesh_quantization (4.4 MB -> 0.77 MB)
Generated for this game by the project owner's Higgsfield account.

mush_king.glb — บอส ราชาเห็ดเรืองแสง (mshking)
- Concept image: Higgsfield (GPT Image 2.5), 2026-11-03
- Image-to-3D: Higgsfield (Meshy 7), then auto-rig + clips via Higgsfield (Meshy rigging):
  Idle (#0), Walk (#119 Slow_Orc_Walk), Attack (#127 Charged_Ground_Slam), Hit (#178 Hit_Reaction), Die (#8 Dead),
  Cast (#125 Charged_Spell_Cast), Roar (#88 Chest_Pound_Taunt)
- Seven rigged exports merged into one skin (same 24-joint skeleton), skinned mesh moved to scene root,
  horizontal root motion removed from Idle/Walk/Attack/Hit/Cast/Roar, 20k -> 14.6k triangles, 1024 JPEG,
  normals/UVs/weights quantized (positions kept float) — 5.5 MB x7 -> 1.4 MB

hero_warrior.glb — สกินพิเศษอาชีพนักรบ "นักรบเกราะนิล" (HERO_SKINS.warrior)
- Concept image: Higgsfield (GPT Image 2.5), 2026-11-03 · Image-to-3D: Meshy 7 · auto-rig + 8 clips via Meshy rigging:
  Idle (#0), Walk (#106 Confident_Walk), Run (#14 Run_02), Attack1 (#4 Attack), Attack2 (#97 Left_Slash),
  Skill (#105 Triple_Combo_Attack), Hit (#178 Hit_Reaction), Death (#8 Dead)
- Merged into one skin, skinned mesh moved to scene root, root motion stripped (except Death),
  20k -> 14k triangles, 1024 JPEG, normals/UVs/weights quantized — 1.4 MB

hero_mage.glb — สกินพิเศษอาชีพนักเวท "จอมเวทย์ดาราม่วง" (HERO_SKINS.mage)
- Concept image: Higgsfield (GPT Image 2.5), 2026-11-03 · Image-to-3D: Meshy 7 · auto-rig + 4 own clips via Meshy rigging:
  Walk (#1 Walking_Woman), Attack1 (#129 mage_soell_cast), Attack2 (#131 mage_soell_cast_2), Skill (#125 Charged_Spell_Cast)
- Idle / Run / Hit / Death borrowed from hero_warrior.glb (same Meshy skeleton names; hips translation rescaled)
- Merged into one skin, skinned mesh moved to scene root, root motion stripped (except Death),
  20k -> 14k triangles, 1024 JPEG, normals/UVs/weights quantized — 1.3 MB

hero_archer.glb — สกินพิเศษอาชีพนักธนู "พรานไพรใบไม้เขียว" (HERO_SKINS.archer)
- Concept image: Higgsfield (GPT Image 2.5), 2026-11-03 · Image-to-3D: Meshy 7 · auto-rig + 2 own clips via Meshy rigging:
  Attack1 (#224 Archery_Shot), Skill (#226 Archery_Shot_2)
- Borrowed: Idle / Run / Hit / Death from hero_warrior.glb, Walk (Walking_Woman) from hero_mage.glb
- Merged into one skin, skinned mesh moved to scene root, root motion stripped (except Death),
  20k -> 14k triangles, 1024 JPEG, normals/UVs/weights quantized — 1.3 MB

hero_samurai.glb — สกินพิเศษอาชีพซามูไร "ซามูไรเกราะชาด" (HERO_SKINS.samurai)
- Concept image: Higgsfield (GPT Image 2.5), 2026-11-04 · Image-to-3D: Meshy 7 · auto-rig + 2 own clips via Meshy rigging:
  Attack1 (#219 Right_Hand_Sword_Slash), Skill (#102 Sword_Judgment)
- Borrowed: Idle / Walk / Run / Attack2 (Left_Slash) / Hit / Death from hero_warrior.glb
- Merged into one skin, skinned mesh moved to scene root, root motion stripped (except Death),
  20k -> 15.6k triangles, 1024 JPEG, normals/UVs/weights quantized — 1.6 MB

hero_assassin.glb — สกินพิเศษอาชีพนักฆ่า "เงาราตรีนักฆ่า" (HERO_SKINS.assassin)
- Concept image: Higgsfield (GPT Image 2.5, then edited to remove loose scarf tails), 2026-11-04 · Image-to-3D: Meshy 7
- auto-rig + 2 own clips via Meshy rigging: Attack1 (#240 Thrust_Slash), Skill (#91 Double_Blade_Spin)
- Borrowed: Idle / Walk / Run / Attack2 (Left_Slash) / Hit / Death from hero_warrior.glb
- Merged into one skin, skinned mesh moved to scene root, root motion stripped (except Death),
  20k -> 14k triangles, 1024 JPEG, normals/UVs/weights quantized — 1.3 MB

hero_lancer.glb — สกินพิเศษอาชีพทหารหอก "อัศวินหอกนิลมังกร" (HERO_SKINS.lancer)
- Concept image: Higgsfield (GPT Image 2.5), 2026-11-04 · Image-to-3D: Meshy 7 · auto-rig + 3 own clips via Meshy rigging:
  Attack1 (#240 Thrust_Slash), Attack2 (#241 Weapon_Combo_2), Skill (#128 Heavy_Hammer_Swing)
- Borrowed: Idle / Walk / Run / Hit / Death from hero_warrior.glb
- Merged into one skin, skinned mesh moved to scene root, root motion stripped (except Death),
  20k -> 14k triangles, 1024 JPEG, normals/UVs/weights quantized — 1.4 MB

hero_boxer.glb — สกินพิเศษอาชีพนักมวย "ยอดมวยมงคลแดง" (HERO_SKINS.boxer)
- Concept image: Higgsfield (GPT Image 2.5), 2026-11-04 · Image-to-3D: Meshy 7 · auto-rig + 6 own clips via Meshy rigging:
  Attack1 (#198 Punch_Combo), Attack2 (#193 Left_Hook_from_Guard), Jab (#192 Right_Jab_from_Guard),
  Kick (#207 Roundhouse_Kick), Knee (#211 Boxing_Guard_Step_Knee_Strike), Skill (#94 Flying_Fist_Kick)
- Idle = guard stance built from the first 0.6 s of Jab (ping-pong loop)
- Borrowed: Walk / Run / Hit / Death from hero_warrior.glb
- Merged into one skin, skinned mesh moved to scene root, root motion stripped (except Death),
  20k -> 14k triangles, 1024 JPEG, normals/UVs/weights quantized — 1.4 MB

hero_aegis.glb — สกินพิเศษอาชีพจอมพิทักษ์ "จักรกลพิทักษ์ขาวมุก" (HERO_SKINS.aegis)
- Concept image: Higgsfield (GPT Image 2.5), 2026-11-04 · Image-to-3D: Meshy 7 · auto-rig + 2 own clips via Meshy rigging:
  Attack1 (#92 Double_Combo_Attack), Skill (#237 Charged_Axe_Chop)
- Borrowed: Idle / Walk / Run / Attack2 (Left_Slash) / Hit / Death from hero_warrior.glb
- Texture fix: dark face-like marks baked on the back of the helmet repainted helmet-white
- Merged into one skin, skinned mesh moved to scene root, root motion stripped (except Death),
  20k -> 14k triangles, 1024 JPEG, normals/UVs/weights quantized — 1.3 MB

hero_office.glb — สกินพิเศษอาชีพพนักงานออฟฟิศ "ซูเปอร์มนุษย์เงินเดือน" (HERO_SKINS.office)
- Concept image: Higgsfield (GPT Image 2.5), 2026-11-04 · Image-to-3D: Meshy 7 · auto-rig + 3 own clips via Meshy rigging:
  Attack1 (#393 baseball_pitching), Attack2 (#421 Over_Shoulder_Throw), Skill (#135 mage_soell_cast_6)
- Borrowed: Idle / Walk / Run / Hit / Death from hero_warrior.glb
- Merged into one skin, skinned mesh moved to scene root, root motion stripped (except Death),
  20k -> 14k triangles, 1024 JPEG, normals/UVs/weights quantized — 1.2 MB

hero_coder.glb — สกินพิเศษอาชีพโปรแกรมเมอร์ "แฮกเกอร์สายนีออน" (HERO_SKINS.coder)
- Concept image: Higgsfield (GPT Image 2.5), 2026-11-04 · Image-to-3D: Meshy 7 · auto-rig + 3 own clips via Meshy rigging:
  Attack1 (#136 mage_soell_cast_7), Attack2 (#132 mage_soell_cast_3), Skill (#17 Skill_01)
- Borrowed: Idle / Run / Hit / Death from hero_warrior.glb, Walk (Walking_Woman) from hero_mage.glb
- Merged into one skin, skinned mesh moved to scene root, root motion stripped (except Death),
  20k -> 14k triangles, 1024 JPEG, normals/UVs/weights quantized — 1.2 MB

hero_tamer.glb — สกินพิเศษอาชีพผู้ฝึกสัตว์ "พรานสัตว์ป่าเขียวมอส" (HERO_SKINS.tamer)
- Concept image: Higgsfield (GPT Image 2.5), 2026-11-04 · Image-to-3D: Meshy 7 · auto-rig + 2 own clips via Meshy rigging:
  Attack1 (#389 Grip_and_Throw_Down), Attack2 (#126 Charged_Spell_Cast_1)
- Borrowed: Idle / Run / Hit / Death from hero_warrior.glb, Walk (Walking_Woman) + Skill (Charged_Spell_Cast) from hero_mage.glb
- Merged into one skin, skinned mesh moved to scene root, root motion stripped (except Death),
  20k -> 14k triangles, 1024 JPEG, normals/UVs/weights quantized — 1.2 MB

All 11 hero_*.glb skins (2026-11-04 update):
- Jump / dash clips added to every skin, rigged once on the warrior model via Meshy rigging and borrowed by bone name:
  JumpStart / JumpAir (ping-pong) / JumpLand cut from #466 Regular_Jump, Flip (double jump) from #463 Run_and_Jump,
  Roll (dash) from #159 Roll_Dodge_1, Slide (sprint dash) from #516 slide_light — hips rise and horizontal root motion removed
  (the game moves the body)
- Finger joints added (Right/LeftFingers1 + Fingers2 under each hand; the Meshy rig has none) with the finger vertices
  re-weighted onto them, so the game can curl a fist around the held weapon

Stage 1 (meadow / ทุ่งซากุระ) remake — 2026-11-04
- sky_meadow_day.jpg / sky_meadow_dusk.jpg: Higgsfield (GPT Image 2.5) 21:9 sky panoramas → 2048x1024 equirect
  (seam cross-faded, picture spans 12° below to 70° above the horizon, haze below). Night keeps assets/sky/night.jpg
- ground_meadow.jpg: Higgsfield (GPT Image 2.5) seamless top-down meadow grass texture, 1024 JPEG
- meadow_oak.glb / meadow_round.glb / meadow_sakura.glb: concept GPT Image 2.5 → Meshy 7 image-to-3D,
  simplified (oak 2.9k, fruit tree 1.9k, sakura 7.4k triangles), 512 JPEG, quantized
- meadow_house.glb (timber-frame cottage, red roof) / meadow_loghouse.glb (log house, green roof):
  concept GPT Image 2.5 → Meshy 7, ~10k triangles, 1024 JPEG, quantized

Stage 1 monsters remake — 2026-11-04
- Concepts: Higgsfield (GPT Image 2.5), cute stylized A-pose characters · Image-to-3D: Meshy 7 · auto-rig via Meshy rigging
- mon_mochi.glb (โมจิ, pink bunny): 5 own clips — Idle (#11 Idle_02), Walk (#668 Skip_Forward_inplace),
  Attack (#214 Punch_Forward_with_Both_Fists), Hit (#178 Hit_Reaction), Die (#8 Dead)
- mon_baibua.glb (ใบบัว, lotus-leaf sprout) — Attack #127 Charged_Ground_Slam
- mon_mekha.glb (เมฆา, cloud puff) — Attack #136 mage_soell_cast_7
- mon_plerng.glb (เพลิง, fire fox) — Attack #129 mage_soell_cast
- mon_nam.glb (น้ำเงี้ยว, river fish-goblin) — Attack #219 Right_Hand_Sword_Slash
  (these four borrow Idle / Walk / Hit / Die from mon_mochi by bone name, hips rescaled)
- mon_goblin.glb (ก็อบลินยักษ์) — Attack #128 Heavy_Hammer_Swing; Idle / Walk / Hit / Die borrowed from mush_king.glb
- mon_flowerqueen.glb (ราชินีบุปผา — evolved บัวหลวง / stage 1 boss) — Attack #125 Charged_Spell_Cast;
  Idle / Hit / Die from hero_warrior, Walk (Walking_Woman) from hero_mage, Cast (#136) from mush_king
- Merged per monster, skinned mesh moved to scene root, root motion stripped (except Die),
  small monsters 10k -> 7k triangles, goblin / queen 14k -> 12k, 1024 JPEG, normals/UVs/weights quantized

Stage 2 (desert / ทะเลทรายเพลิง) remake — 2026-11-04
- sky_desert_day.jpg / sky_desert_dusk.jpg: Higgsfield (GPT Image 2.5) 21:9 sky panoramas → 2048x1024 equirect
  (picture spans 10° below to ~46-50° above the horizon so the blue sits low enough for the gameplay camera)
- ground_desert.jpg: Higgsfield (GPT Image 2.5) seamless wind-rippled sand texture, 1024 JPEG (saturation toned down)
- desert_saguaro.glb / desert_cluster.glb (barrel + prickly-pear cacti) / desert_palm.glb (date palm) /
  desert_rock.glb (layered red sandstone butte, used for the map border) / desert_ruin.glb (temple arch ruin):
  concept GPT Image 2.5 → Meshy 7 image-to-3D, simplified to 3-6.7k triangles, 512 JPEG (ruin 1024), quantized
- Monsters (concept → Meshy 7 → Meshy rigging + library clips, merged per monster, root motion stripped,
  7-12k triangles, 1024 JPEG, quantized):
  mon_ngu.glb (นาคาน้อย) — Attack #131 mage_soell_cast_2 (trimmed 1.3-3.03 s), Walk #671 Sneaky_Walk_inplace
  mon_khiao.glb (เขี้ยวป่า) — Attack #92 Double_Combo_Attack, Walk #689 Walk_Fight_Forward_inplace
  mon_saming.glb (เสือสมิง) — Attack #94 Flying_Fist_Kick, Walk borrowed from mon_khiao
  mon_mangkorn.glb (มังกรเยาว์) — Attack #130 mage_soell_cast_1, Walk borrowed from mon_mochi
  mon_caveman.glb (หัวหน้ามนุษย์ถ้ำ) — Attack #127 Charged_Ground_Slam, Walk #112 Monster_Walk; Idle/Hit/Die from mush_king
  mon_tigerking.glb (ราชาเสือทะเลทราย — evolved เสือสมิง / stage 2 boss) — Attack #105 Triple_Combo_Attack,
    Walk from mon_caveman, Idle/Hit/Die/Roar from mush_king
  (the small ones borrow Idle / Hit / Die from mon_mochi by bone name, hips rescaled)

Zone gates + Dimension Tower remake — 2026-11-05
- gate_town.glb (🏰 เมืองเชอร์รี่): fairytale gatehouse — cream stone towers, pink cone roofs, cherry-blossom crest and banners
- gate_home.glb (🏠 บ้านของฉัน): wooden arbor gate with a red-tile roof, paper lantern, white picket fence, mailbox, flower pots
- gate_farm.glb (🐄 ฟาร์มของฉัน): rustic log ranch gate with a red barn roof, sunflower vines, hay bales, pumpkin, wagon wheel
- tower_dim.glb (🗼 หอคอยมิติ): slender magic tower, violet spire + crystal, glowing rune bands, portal doorway
- Concept: Higgsfield (GPT Image 2.5) · Image-to-3D: Meshy 7 · simplified, JPEG textures, quantized
  (the gates keep the game's charge ring / glowing veil / ground glow inside the opening)

Cherry Town (เมืองเชอร์รี่) remake — 2026-11-05
- town_house_a.glb (cream timber-frame, rose-pink roof, flower boxes) / town_house_b.glb (stone cottage, sky-blue slate roof, ivy)
  / town_house_c.glb (butter-yellow bakery, mint roof, striped awning): replace the town ring houses, mixed in turn
- town_castle.glb: cherry-blossom royal palace (white walls, pink cone roofs) replacing the KayKit castle north of the plaza
- town_fountain.glb: two-tier marble fountain with a cherry-tree sculpture and a flower ring
- town_plaza.jpg: seamless warm cobblestone (cream / peach / rose) with cherry petals — plaza + the 8 lighter stone roads
- 8 sakura trees around the plaza reuse meadow_sakura.glb
- Concept: Higgsfield (GPT Image 2.5) · Image-to-3D: Meshy 7 · simplified (7-11.6k triangles), 1024 JPEG, quantized

Skill VFX pack (เอฟเฟกต์สกิล) — 2026-11-05 · folder fx/
- hf_slash (blue crescent sword arc) / hf_slashw (white, tinted per skill) — melee slash, Cleave, Cross Slash, Bleed Stab, Knee Burst, Spear Sweep
- hf_fire (fireball burst) + hf_explode (4×4 16-frame fire-explosion flipbook) — fire / Hellfire / War Frenzy / fire arrow
- hf_bolt (forked lightning) — bolt / Thunderstorm · hf_ice (ice-shard burst) — ice / Ice Spear
- hf_heal (holy green-gold light) + hf_circle (gold rune circle) — Heal Blessing / potion heal / evolve
- hf_shadow (violet vortex) — shadow / Shadow Dance · hf_poison (toxic cloud) — poison / Poison Knives / poison arrow
- hf_impactw (white hit star) / hf_ringw (white shockwave ring) / hf_circlew (white rune circle) — tinted per skill colour
- hf_crack (molten ground cracks) — quake / Earth Split / fire impacts
- Generated: Higgsfield (GPT Image 2.5) on pure black · processed: black crush + edge vignette, straight alpha from brightness, WebP

HUD icons (ไอคอนหน้าจอ) — 2026-11-05 · folder ui/
- 24 painted icons (cute glossy pastel cherry-blossom style, transparent background): menu, bag, skills, swords (PvP + attack),
  friends, hp / mp potions, paw (pets), scroll (quests), gear (settings), profile, robot (auto-battle), gather (auto-gather),
  dash, jump, run, star, crown, bolt, fire, coins, gem, sword, shield
- Generated: Higgsfield (GPT Image 2.5, transparent background) · processed: faint glow halo suppressed, trimmed, 128px WebP

App icon (ไอคอนแอป PWA / desktop) — 2026-11-05 · repo root icon-*.png
- Golden heraldic shield with a soft cream-gold face, pink gems and a glossy red cherry pair as its emblem (fully inside the shield), sakura blossoms, magenta glow
- Generated: Higgsfield (GPT Image 2.5): variant "b" of 4, then re-composed from it so the cherries sit inside the shield · processed: rounded "any" icons with transparent corners
  (512 / 192 / 32), opaque 180 apple-touch icon, maskable 512 with the subject inside the 80% safe zone

Loading screen (หน้าโหลดเกม) — 2026-11-05 · ui/load_land.webp (desktop) · ui/load_port.webp (phone)
- Cherry-blossom fantasy kingdom at sunrise: sakura trees, rose-pink castle, floating islands with waterfalls; calm sky in the middle for the logo and progress card
- Generated: Higgsfield (GPT Image 2.5), 16:9 and 9:16 · WebP q76

Skill icons (ไอคอนสกิลทุกอาชีพ) — 2026-11-05 · folder skills/
- 256 painted skill icons, one per skill id: every class skill (49), class-path skill (23), advanced-path skill (137),
  class ultimate ult_<class> (11) + alternate ultimates ultalt_samurai / ultalt_lancer, and advanced ultimate advult_<path> (34)
- Extras: _lock (locked skill), _ult (generic ultimate star crown), _fallback (golden star orb for unknown skills)
- Style: cute glossy 3D cartoon mobile RPG icons with magical glow and dark plum outline; ultimates are grander with a golden aura
- Generated: Higgsfield (GPT Image 2.5, transparent background) as 17 sprite sheets of 15 (5x3) + 1 sheet of 4 (2x2)
- Processed: split on the grid, faint glow halos suppressed, stray fragments from neighbouring cells removed, trimmed, 128px WebP

Kirara remake (คิราระ — rare golden star) — 2026-11-06 · mon_kirara.glb
- Concept GPT Image 2.5 (A-pose chubby golden five-pointed star with arms + legs) → Meshy 7 image-to-3D (20k) →
  Meshy rigging + Attack clip #397 360_Power_Spin_Jump; Idle / Walk / Hit / Die borrowed from mon_mochi (hips rescaled),
  root motion stripped, 7.6k triangles, 1024 JPEG, quantized. Stage 2 "โนวา" = same model ×1.6 + golden halo

Phi remake (ผีราตรี — night ghost of the dead-tree grove) — 2026-11-06 · mon_phi.glb
- Concept GPT Image 2.5 (hooded lavender-white sheet ghost, glowing violet eyes, blue spirit flame on the hood tip, A-pose,
  stubby legs) → Meshy 7 image-to-3D (20k) → Meshy rigging + Attack clip #386 Zombie_Scream; Idle / Walk / Hit / Die
  borrowed from mon_mochi (hips rescaled), root motion stripped, ~7k triangles, 1024 JPEG, quantized.
  Replaces the KayKit Skeleton_Mage stand-in. Stage 2 "ภูตราชัน" = same model ×1.5 with a stronger glow

Taara remake (ธาราทิพย์ — supreme star deity of the floating sky isles) — 2026-11-06 · mon_taara.glb
- Concept GPT Image 2.5 (A-pose chubby lavender star spirit, indigo galaxy belly with gold stars and a crescent moon,
  crown of five gold four-pointed stars, pale lilac starlight cape) → Meshy 7 image-to-3D (20k) → Meshy rigging +
  Attack clip #132 mage_soell_cast_3 (two-handed push); Idle / Walk / Hit / Die borrowed from mon_mochi (hips rescaled),
  root motion stripped, ~9k triangles, 1024 JPEG, quantized. Replaces the dyed Blob_GreenSpikyBlob stand-in; the tilted
  gold ring around the body is kept as an in-game halo. Stage 2 "จักรวาลเทพ" = same model ×1.5 with a stronger glow
