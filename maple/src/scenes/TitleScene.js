// ═══════════════════════════════════════════════════════════════════════════
// TitleScene — หน้าเลือกอาชีพ
//
// การ์ดอาชีพสร้างจาก CLASSES ในข้อมูลกลางทั้งหมด — เพิ่มอาชีพที่ไฟล์เดียว
// แล้วมันจะโผล่มาที่หน้านี้เอง พร้อมสีชุด ทรงอาวุธ และสกิลของมัน
// ═══════════════════════════════════════════════════════════════════════════

import { CLASSES } from '../../../shared/gamedata.js';
import { FONT } from '../fx.js';
import { VIEW_W, VIEW_H } from '../maps.js';
import { playerStats, skillsFor } from '../stats.js';
import { loadSave, clearSave } from '../save.js';
import { Rig } from '../rig.js';

const CARD_W = 250;
const CARD_H = 132;
const COLS = 4;
const GAP = 24;

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('title');
  }

  create() {
    this.cameras.main.setBackgroundColor('#1b2418');

    // พื้นหลังจุดเรืองแสงลอยขึ้น ให้หน้าเลือกอาชีพไม่นิ่งสนิท
    for (let i = 0; i < 26; i++) {
      const p = this.add
        .image(Phaser.Math.Between(0, VIEW_W), Phaser.Math.Between(0, VIEW_H), 'fx_dot')
        .setTint(0xa8d85a)
        .setAlpha(Phaser.Math.FloatBetween(0.12, 0.34))
        .setScale(Phaser.Math.FloatBetween(0.3, 0.9));
      this.tweens.add({
        targets: p,
        y: p.y - Phaser.Math.Between(120, 300),
        alpha: 0,
        duration: Phaser.Math.Between(4000, 9000),
        repeat: -1,
        delay: Phaser.Math.Between(0, 4000),
      });
    }

    this.add
      .text(VIEW_W / 2, 42, '🍒 น้องเชอร์รี่ 2D — แดนมอนสเตอร์', {
        fontFamily: FONT, fontSize: '38px', fontStyle: '900', color: '#ffffff',
        stroke: '#0d1a0a', strokeThickness: 7,
      })
      .setOrigin(0.5, 0);

    this.add
      .text(VIEW_W / 2, 92, 'เกมแอ็กชันเลื่อนข้าง — ไต่เชือก ทิ้งตัวลงชั้นล่าง ตีมอนเป็นพื้นที่', {
        fontFamily: FONT, fontSize: '16px', color: '#cfe0b8',
      })
      .setOrigin(0.5, 0)
      .setAlpha(0.85);

    // ── เล่นต่อจากเซฟ ──
    const save = loadSave();
    if (save?.player?.cls) {
      const meta = CLASSES[save.player.cls];
      this.makeButton(
        VIEW_W / 2, 140,
        `▶ เล่นต่อ — ${meta.emoji} ${meta.name} Lv.${save.player.level}`,
        0x3a6a2a,
        () => this.scene.start('field', { save })
      );
      this.makeButton(VIEW_W / 2 + 300, 140, '🗑 ลบเซฟ', 0x5a2a2a, () => {
        clearSave();
        this.scene.restart();
      }, 130);
    } else {
      this.add
        .text(VIEW_W / 2, 146, 'เลือกอาชีพเพื่อเริ่มเล่น', {
          fontFamily: FONT, fontSize: '17px', fontStyle: '700', color: '#ffe28a',
        })
        .setOrigin(0.5, 0);
    }

    // ── การ์ดอาชีพ ──
    const entries = Object.entries(CLASSES);
    const rows = Math.ceil(entries.length / COLS);
    const gridW = COLS * CARD_W + (COLS - 1) * GAP;
    const startX = (VIEW_W - gridW) / 2;
    const startY = 196;

    this.detail = this.add
      .text(VIEW_W / 2, startY + rows * (CARD_H + GAP) + 6, '', {
        fontFamily: FONT, fontSize: '15px', color: '#dfe8cf', align: 'center',
        wordWrap: { width: 900 }, lineSpacing: 5,
      })
      .setOrigin(0.5, 0);

    entries.forEach(([key, meta], i) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const x = startX + col * (CARD_W + GAP);
      const y = startY + row * (CARD_H + GAP);
      this.makeCard(x, y, key, meta);
    });
  }

  makeCard(x, y, key, meta) {
    const g = this.add.graphics();
    const draw = (hot) => {
      g.clear();
      g.fillStyle(0x0e1a0c, hot ? 0.92 : 0.66).fillRoundedRect(x, y, CARD_W, CARD_H, 12);
      g.lineStyle(hot ? 3 : 2, meta.color, hot ? 1 : 0.55);
      g.strokeRoundedRect(x, y, CARD_W, CARD_H, 12);
    };
    draw(false);

    // ตัวอย่างตัวละครจริง (rig เดียวกับที่ใช้ในเกม) — เห็นชุดของอาชีพก่อนเลือก
    const rig = new Rig(this, x + 46, y + CARD_H - 16, key);
    rig.container.setScale(0.82);
    rig.setState('idle');
    this.rigs = this.rigs || [];
    this.rigs.push(rig);

    this.add.text(x + 84, y + 14, `${meta.emoji} ${meta.name}`, {
      fontFamily: FONT, fontSize: '19px', fontStyle: '800', color: '#ffffff',
    });

    const s = playerStats(key, 1);
    this.add.text(x + 84, y + 44, `❤️ ${s.hpMax}   ⚔️ ${s.atk.toFixed(0)}   🛡️ ${s.def.toFixed(0)}   🎯 ${s.crit}%`, {
      fontFamily: FONT, fontSize: '13px', color: '#cfe0b8',
    });

    const skills = skillsFor(key);
    this.add.text(x + 84, y + 68, skills.map((sk) => sk.emoji).join(' '), {
      fontFamily: FONT, fontSize: '18px',
    });
    this.add.text(x + 84, y + 96, `💨 ${s.spd}  ⤒ ${s.jump}`, {
      fontFamily: FONT, fontSize: '12px', color: '#9ab88a',
    });

    const zone = this.add.zone(x, y, CARD_W, CARD_H).setOrigin(0, 0).setInteractive({ useHandCursor: true });
    zone.on('pointerover', () => {
      draw(true);
      rig.setState('walk');
      this.detail.setText(
        `${meta.emoji} ${meta.name} — ${meta.desc}\n✨ ${meta.perk}\nสกิล: ${skills.map((sk) => `${sk.emoji} ${sk.name}`).join('  ·  ')}`
      );
    });
    zone.on('pointerout', () => {
      draw(false);
      rig.setState('idle');
    });
    zone.on('pointerdown', () => this.scene.start('field', { cls: key }));
  }

  makeButton(cx, y, label, color, onClick, w = 420) {
    const h = 40;
    const x = cx - w / 2;
    const g = this.add.graphics();
    const draw = (hot) => {
      g.clear();
      g.fillStyle(color, hot ? 1 : 0.8).fillRoundedRect(x, y, w, h, 10);
      g.lineStyle(2, 0xd8e8b8, hot ? 1 : 0.5).strokeRoundedRect(x, y, w, h, 10);
    };
    draw(false);
    this.add
      .text(cx, y + h / 2, label, {
        fontFamily: FONT, fontSize: '17px', fontStyle: '700', color: '#ffffff',
      })
      .setOrigin(0.5);
    const z = this.add.zone(x, y, w, h).setOrigin(0, 0).setInteractive({ useHandCursor: true });
    z.on('pointerover', () => draw(true));
    z.on('pointerout', () => draw(false));
    z.on('pointerdown', onClick);
    return z;
  }

  update(_time, delta) {
    const dt = delta / 1000;
    for (const r of this.rigs || []) r.update(dt);
  }
}
