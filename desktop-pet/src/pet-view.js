// ═══════════════════════════════════════════════════════════════════════════
// pet-view.js — ฝั่งภาพของ desktop pet
//
// หน้าต่างมีขนาดเท่าตัวละครพอดี ตัวละครจึงไม่ต้องเดินในแคนวาส
// ฝั่ง main เป็นคนขยับ "ตัวหน้าต่าง" ไปบนเดสก์ท็อป ไฟล์นี้แค่เล่นท่าตามสถานะที่ได้รับ
//
// ใช้ Rig ตัวเดียวกับในเกม (rig.js) จึงได้ท่าเดิน/ยืน/กระโดดเหมือนเกมเป๊ะ
// และเปลี่ยนอาชีพได้ครบ 8 แบบเพราะสีชุดมาจาก CLASS_OUTFIT ในข้อมูลกลางชุดเดียวกัน
//
// ท่านอน/ท่าถูกจับ ไม่ได้เพิ่มเป็น state ใหม่ใน Rig (จะไปกวนโค้ดเกม)
// แต่ประกอบขึ้นจากท่าที่มีอยู่ + หมุน/ขยับ container ในไฟล์นี้แทน
// ═══════════════════════════════════════════════════════════════════════════

const PET_W = 190;
const PET_H = 210;
const FLOOR_Y = PET_H - 12;     // ปลายเท้ายืนตรงนี้ เว้นขอบล่างไว้กันเงาถูกตัด
const RIG_SCALE = 1.45;

class PetScene extends Phaser.Scene {
  constructor() {
    super('pet');
  }

  create() {
    buildTextures(this);

    this.cls = window.__petClass || 'warrior';
    this.petState = 'idle';
    this.zzzAt = 0;

    this.buildRig();

    // ฝั่ง main ส่งสถานะมาเฉพาะตอนเปลี่ยน ไม่ได้ส่งทุกเฟรม
    window.petBridge?.onState((s) => this.applyState(s));
    window.petBridge?.onPoke(() => this.reaction());

    // บอกขนาดแคนวาสจริงกลับไป ให้ main เตือนได้ถ้า PET_W/PET_H สองฝั่งไม่ตรงกัน
    window.petBridge?.ready({ w: PET_W, h: PET_H });
  }

  buildRig() {
    if (this.rig) this.rig.destroy();
    this.rig = new Rig(this, PET_W / 2, FLOOR_Y, this.cls);
    this.rig.container.setScale(RIG_SCALE);
    this.rig.setState('idle');
  }

  applyState({ state, facing, cls }) {
    if (cls && cls !== this.cls) {
      this.cls = cls;
      this.buildRig();
    }
    if (facing && facing !== this.rig.facing) {
      this.rig.setFacing(facing);
      this.poseContainer();       // ท่านอนยึดตำแหน่งตามทิศที่หัน ต้องคำนวณใหม่เมื่อหันกลับ
    }
    if (state === this.petState) return;
    this.petState = state;

    // แปลงสถานะของ pet เป็นท่าของ Rig
    const rigState = {
      idle: 'idle', walk: 'walk', jump: 'jump', fall: 'jump',
      drag: 'jump', sleep: 'idle',
    }[state] || 'idle';
    this.rig.setState(rigState);

    this.poseContainer();
  }

  // ท่านอน = ล้มตัวลงนอนตะแคง หมุนไปทางเดียวกับที่หันหน้า
  // (Phaser หมุนตามเข็มเมื่อ angle เป็นบวก ตัวที่ชี้ขึ้นจึงกวาดไปทาง +x)
  poseContainer() {
    const c = this.rig.container;
    c.setAngle(this.petState === 'sleep' ? 72 * this.rig.facing : 0);
    c.setPosition(PET_W / 2, this.petState === 'sleep' ? FLOOR_Y - 4 : FLOOR_Y);
    this.fitInFrame();
  }

  // เลื่อนตัวละครให้อยู่ในกรอบหน้าต่างครบ โดยวัดจากกรอบภาพจริงหลัง transform
  //
  // ตอนแรกเขียนเป็นออฟเซ็ตตัวเลขคงที่ แล้วท่านอนล้นขอบขวาเพราะอาวุธยื่นเลยหัวออกไป
  // การไล่แก้ตัวเลขทีละท่าจะพังอีกทันทีที่เปลี่ยนสเกล เพิ่มท่า หรือเปลี่ยนทรงอาวุธ
  // วัดจาก getBounds() แล้วดันกลับเข้ากรอบ จึงถูกต้องเองทุกท่าและทุกอาชีพ
  fitInFrame() {
    const c = this.rig.container;
    const pad = 3;
    const bx = c.getBounds();
    if (bx.left < pad) c.x += pad - bx.left;
    else if (bx.right > PET_W - pad) c.x -= bx.right - (PET_W - pad);
    const by = c.getBounds();
    if (by.bottom > PET_H - pad) c.y -= by.bottom - (PET_H - pad);
    else if (by.top < pad) c.y += pad - by.top;
  }

  // ตำแหน่งหัวบนจอตามท่าปัจจุบัน — เอฟเฟกต์จะเกาะหัวถูกทุกท่าโดยไม่ต้องฮาร์ดโค้ดออฟเซ็ต
  // ลำดับ transform ของ container คือ scale → rotate → translate จึงคูณสเกลก่อนหมุน
  headPos() {
    const c = this.rig.container;
    const hy = -74 * RIG_SCALE;
    const a = Phaser.Math.DegToRad(c.angle);
    return { x: c.x - hy * Math.sin(a), y: c.y + hy * Math.cos(a) };
  }

  // ตอบสนองตอนถูกคลิก
  reaction() {
    const h = this.headPos();
    const t = this.add
      .text(h.x, h.y - 26, '❤️', { fontFamily: 'sans-serif', fontSize: '26px' })
      .setOrigin(0.5);
    this.tweens.add({
      targets: t, y: t.y - 46, alpha: 0, duration: 900,
      ease: 'Quad.easeOut', onComplete: () => t.destroy(),
    });
    this.rig.swing(0.3);
  }

  // 💤 ลอยขึ้นเป็นจังหวะระหว่างนอน
  zzz() {
    const h = this.headPos();
    const t = this.add
      .text(h.x, h.y - 18, '💤', { fontFamily: 'sans-serif', fontSize: '20px' })
      .setOrigin(0.5)
      .setAlpha(0.9);
    this.tweens.add({
      targets: t, y: t.y - 34, x: t.x + 12 * this.rig.facing, alpha: 0,
      duration: 2200, ease: 'Sine.easeOut', onComplete: () => t.destroy(),
    });
  }

  update(time, delta) {
    const dt = Math.min(delta, 50) / 1000;
    this.rig.update(dt);

    if (this.petState === 'sleep' && time - this.zzzAt > 2400) {
      this.zzzAt = time;
      this.zzz();
    }

    // ถูกจับอยู่ — แกว่งเล็กน้อยให้รู้สึกว่าห้อยอยู่ในมือ
    if (this.petState === 'drag') {
      this.rig.container.setAngle(Math.sin(time / 160) * 7);
    }
  }
}

window.__petGame = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'pet',
  width: PET_W,
  height: PET_H,
  // แคนวาสต้องโปร่งใสทั้งผืน ไม่งั้นจะเห็นเป็นกล่องสี่เหลี่ยมทับเดสก์ท็อป
  transparent: true,
  backgroundColor: 'rgba(0,0,0,0)',
  // pet ไม่ต้องการ 60fps — 30 พอและกินซีพียู/แบตน้อยกว่าครึ่ง
  fps: { target: 30, forceSetTimeOut: true },
  physics: { default: 'arcade', arcade: { gravity: { y: 0 } } },
  scene: [PetScene],
});
