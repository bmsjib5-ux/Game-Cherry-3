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
