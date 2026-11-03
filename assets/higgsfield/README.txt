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
