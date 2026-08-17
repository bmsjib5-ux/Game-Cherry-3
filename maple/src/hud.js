// ═══════════════════════════════════════════════════════════════════════════
// hud.js — แถบสถานะบนจอ (พิกัดหน้าจอ ไม่เลื่อนตามกล้อง)
//
// วางแบบเมเปิ้ล: เลือด/มานาซ้ายบน, ทองขวาบน, แถบ EXP ขีดยาวล่างจอ,
// ช่องสกิล 1–4 กลางล่าง โชว์คูลดาวน์และค่ามานาที่ต้องใช้
// ═══════════════════════════════════════════════════════════════════════════

import { CLASSES } from '../../shared/gamedata.js';
import { expToNext, MAX_LEVEL } from './stats.js';
import { FONT } from './fx.js';
import { VIEW_W, VIEW_H } from './maps.js';

const BAR_W = 210;

export class Hud {
  // onSkill: เรียกเมื่อผู้เล่นแตะช่องสกิลบนจอ — ช่องสกิลทำหน้าที่เป็นปุ่มมือถือด้วย
  // จึงไม่ต้องมีปุ่มสกิลซ้อนอีกชุดมาเบียดพื้นที่จอ
  constructor(scene, player, onSkill = null) {
    this.scene = scene;
    this.player = player;
    this.onSkill = onSkill;
    const meta = CLASSES[player.cls];

    const fixed = (o) => o.setScrollFactor(0).setDepth(1000);

    this.panel = fixed(scene.add.graphics());

    this.nameText = fixed(
      scene.add.text(20, 14, `${meta.emoji} ${meta.name}`, {
        fontFamily: FONT, fontSize: '19px', fontStyle: '800', color: '#ffffff',
        stroke: '#000000', strokeThickness: 4,
      })
    );
    this.lvText = fixed(
      scene.add.text(20, 40, '', {
        fontFamily: FONT, fontSize: '15px', fontStyle: '700', color: '#ffe28a',
        stroke: '#000000', strokeThickness: 3,
      })
    );
    this.hpText = fixed(
      scene.add.text(24 + BAR_W / 2, 66, '', {
        fontFamily: FONT, fontSize: '12px', fontStyle: '700', color: '#ffffff',
        stroke: '#000000', strokeThickness: 3,
      }).setOrigin(0.5, 0)
    );
    this.mpText = fixed(
      scene.add.text(24 + BAR_W / 2, 90, '', {
        fontFamily: FONT, fontSize: '12px', fontStyle: '700', color: '#ffffff',
        stroke: '#000000', strokeThickness: 3,
      }).setOrigin(0.5, 0)
    );

    this.goldText = fixed(
      scene.add.text(VIEW_W - 20, 14, '', {
        fontFamily: FONT, fontSize: '18px', fontStyle: '800', color: '#ffd34a',
        stroke: '#000000', strokeThickness: 4,
      }).setOrigin(1, 0)
    );

    this.mapText = fixed(
      scene.add.text(VIEW_W / 2, 12, '', {
        fontFamily: FONT, fontSize: '20px', fontStyle: '800', color: '#ffffff',
        stroke: '#000000', strokeThickness: 5,
      }).setOrigin(0.5, 0)
    );

    this.expText = fixed(
      scene.add.text(VIEW_W / 2, VIEW_H - 20, '', {
        fontFamily: FONT, fontSize: '12px', fontStyle: '700', color: '#e8f0d8',
        stroke: '#000000', strokeThickness: 3,
      }).setOrigin(0.5, 1)
    );

    // ── ช่องสกิล 1–4 ──
    this.slots = [];
    const n = player.skills.length;
    const slotW = 62;
    const gap = 10;
    const totalW = n * slotW + (n - 1) * gap;
    const startX = VIEW_W / 2 - totalW / 2;
    const slotY = VIEW_H - 104;

    for (let i = 0; i < n; i++) {
      const sk = player.skills[i];
      const x = startX + i * (slotW + gap);
      const g = fixed(scene.add.graphics());
      const emoji = fixed(
        scene.add.text(x + slotW / 2, slotY + 22, sk.emoji, {
          fontFamily: FONT, fontSize: '26px',
        }).setOrigin(0.5)
      );
      const key = fixed(
        scene.add.text(x + 6, slotY + 3, String(i + 1), {
          fontFamily: FONT, fontSize: '12px', fontStyle: '800', color: '#ffffff',
          stroke: '#000000', strokeThickness: 3,
        })
      );
      const cost = fixed(
        scene.add.text(x + slotW / 2, slotY + slotW - 15, `${sk.cost}`, {
          fontFamily: FONT, fontSize: '12px', fontStyle: '700', color: '#8ecfff',
          stroke: '#000000', strokeThickness: 3,
        }).setOrigin(0.5, 0)
      );
      if (onSkill) {
        const zone = scene.add
          .zone(x, slotY, slotW, slotW)
          .setOrigin(0, 0)
          .setScrollFactor(0)
          .setDepth(1002)
          .setInteractive({ useHandCursor: true });
        zone.on('pointerdown', () => onSkill(i));
      }

      this.slots.push({ g, emoji, key, cost, x, y: slotY, w: slotW, skill: sk });
    }

    this.hint = fixed(
      scene.add.text(20, VIEW_H - 26, '← → เดิน · Space กระโดด · ↓+Space ลงชั้นล่าง · ↑ เชือก/พอร์ทัล · X ตี · 1-4 สกิล · Z เก็บของ', {
        fontFamily: FONT, fontSize: '12px', color: '#dfe8cf',
        stroke: '#000000', strokeThickness: 3,
      }).setOrigin(0, 1).setAlpha(0.8)
    );
  }

  setMapName(text) {
    this.mapText.setText(text);
    this.mapText.setAlpha(1);
    this.scene.tweens.add({ targets: this.mapText, alpha: 0.45, delay: 2200, duration: 900 });
  }

  update() {
    const p = this.player;
    const s = p.stats;
    const hpPct = Math.max(0, p.hp / s.hpMax);
    const mpPct = Math.max(0, p.mp / s.mpMax);
    const need = expToNext(p.level);
    const expPct = p.level >= MAX_LEVEL ? 1 : Math.min(1, p.exp / need);

    const g = this.panel;
    g.clear();

    // กล่องพื้นหลังแถบสถานะ
    g.fillStyle(0x0a1208, 0.42).fillRoundedRect(12, 8, BAR_W + 24, 104, 10);

    // เลือด
    g.fillStyle(0x000000, 0.55).fillRoundedRect(24, 64, BAR_W, 18, 6);
    g.fillStyle(hpPct > 0.3 ? 0xe0455a : 0xf5652e, 1).fillRoundedRect(24, 64, Math.max(3, BAR_W * hpPct), 18, 6);
    // มานา
    g.fillStyle(0x000000, 0.55).fillRoundedRect(24, 88, BAR_W, 18, 6);
    g.fillStyle(0x3a8ad8, 1).fillRoundedRect(24, 88, Math.max(3, BAR_W * mpPct), 18, 6);

    this.lvText.setText(`Lv.${p.level}`);
    this.hpText.setText(`HP ${Math.ceil(p.hp)} / ${s.hpMax}`);
    this.mpText.setText(`MP ${Math.floor(p.mp)} / ${s.mpMax}`);
    this.goldText.setText(`🪙 ${p.gold.toLocaleString()}`);

    // แถบ EXP ยาวเต็มจอด้านล่าง
    g.fillStyle(0x000000, 0.5).fillRect(0, VIEW_H - 12, VIEW_W, 12);
    g.fillStyle(0xa8d85a, 1).fillRect(0, VIEW_H - 12, VIEW_W * expPct, 12);
    this.expText.setText(
      p.level >= MAX_LEVEL ? 'MAX LEVEL' : `EXP ${p.exp} / ${need}  (${(expPct * 100).toFixed(1)}%)`
    );

    // ช่องสกิล — จางลงเมื่อมานาไม่พอ, มีฝาปิดตอนคูลดาวน์
    for (const sl of this.slots) {
      const enough = p.mp >= sl.skill.cost;
      sl.g.clear();
      sl.g.fillStyle(0x0a1208, enough ? 0.62 : 0.4).fillRoundedRect(sl.x, sl.y, sl.w, sl.w, 9);
      sl.g.lineStyle(2, enough ? 0xd8e8b8 : 0x6a7a5a, enough ? 0.9 : 0.5);
      sl.g.strokeRoundedRect(sl.x, sl.y, sl.w, sl.w, 9);
      sl.emoji.setAlpha(enough ? 1 : 0.45);
      sl.cost.setColor(enough ? '#8ecfff' : '#e0736a');
      if (p.attackCd > 0) {
        const k = Math.min(1, p.attackCd / 0.36);
        sl.g.fillStyle(0x000000, 0.5).fillRect(sl.x, sl.y, sl.w, sl.w * k);
      }
    }
  }
}
