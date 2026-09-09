// ═══════════════════════════════════════════════════════════════════════════
// main.js — โปรเซสหลักของ desktop pet: หน้าต่าง ถาดระบบ ไฟล์เซฟ และ IPC
//
// สมองของ pet (ท่าทาง/ฟิสิกส์/การสุ่มพฤติกรรม) อยู่ใน src/brain.js ที่ไม่พึ่ง Electron
// ไฟล์นี้แค่บอกขอบเขตหน้าจอให้สมอง แล้วย้ายหน้าต่างตามตำแหน่งที่สมองคำนวณ
//
// แนวคิดหน้าต่าง: ขนาดเท่าตัวละครพอดี ไม่ใช่หน้าต่างใสเต็มจอ
//   • แคนวาสเล็กจิ๋ว กิน GPU/แบตน้อยกว่าหน้าต่างใสเต็มจอมาก
//   • ไม่ต้องทำ click-through เลย — ที่ว่างรอบตัวไม่มีหน้าต่างบัง จึงคลิกไอคอน
//     บนเดสก์ท็อปทะลุผ่านได้เองโดยไม่ต้องยุ่งกับ setIgnoreMouseEvents
//   • ลากตัวละคร = ย้ายหน้าต่าง ตรงไปตรงมา
// ═══════════════════════════════════════════════════════════════════════════

const { app, BrowserWindow, Tray, Menu, screen, ipcMain, nativeImage } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const { PetBrain } = require('./src/brain.js');

// ต้องตรงกับ PET_W / PET_H ใน src/pet-view.js — renderer รายงานขนาดจริงกลับมา
// ตอนพร้อม ถ้าไม่ตรงจะเตือนใน console (ดู ipcMain 'pet:ready')
const PET_W = 190;
const PET_H = 210;

const TICK_MS = 33;              // 30 ครั้ง/วินาที — พอสำหรับ pet ที่เดินช้า ๆ
const AUTOSAVE_MS = 10000;

// เพดานของ dt ที่ยอมให้ป้อนเข้าสมองในหนึ่งสเต็ป
// setInterval อาจถูกหน่วงนานเมื่อเครื่องงานหนักหรือเพิ่งตื่นจาก sleep/hibernate
// ถ้าปล่อยให้ dt ก้อนใหญ่เข้าไป pet จะกระโดดข้ามจอหรือร่วงทะลุพื้นในเฟรมเดียว
const MAX_STEP_MS = 200;

const CLASSES = ['warrior', 'archer', 'mage', 'assassin', 'lancer', 'samurai', 'coder', 'office'];
const CLASS_LABEL = {
  warrior: '🛡️ นักรบ', archer: '🏹 นักธนู', mage: '🔮 นักเวท', assassin: '🗡️ นักฆ่า',
  lancer: '🔱 นักหอก', samurai: '⚔️ ซามูไร', coder: '💻 จอมเวทโค้ด', office: '💼 พนักงานออฟฟิศ',
};

const DEBUG = !!process.env.PET_DEBUG;
const log = (obj) => { if (DEBUG) console.log('PET ' + JSON.stringify(obj)); };

const settingsFile = () => path.join(app.getPath('userData'), 'settings.json');

function loadSettings() {
  try {
    return JSON.parse(fs.readFileSync(settingsFile(), 'utf8'));
  } catch {
    return {};                   // ยังไม่เคยเซฟ หรือไฟล์เสีย — ใช้ค่าเริ่มต้น
  }
}

class PetApp {
  constructor() {
    const s = loadSettings();
    this.cls = CLASSES.includes(s.cls) ? s.cls : 'warrior';
    this.savedX = typeof s.x === 'number' ? s.x : null;

    this.brain = new PetBrain({ width: PET_W, height: PET_H });
    this.brain.setPaused(!!s.paused);

    this.win = null;
    this.tray = null;
  }

  // พื้นที่เดินได้ = จอหลักโดยไม่รวมทาสก์บาร์
  syncBounds() {
    const wa = screen.getPrimaryDisplay().workArea;
    this.brain.setBounds({
      minX: wa.x,
      maxX: wa.x + wa.width - PET_W,
      floorTop: wa.y + wa.height - PET_H,   // ค่า y ของหน้าต่างเมื่อยืนบนพื้น
    });
  }

  createWindow() {
    this.syncBounds();
    const b = this.brain.bounds;
    this.brain.reset(this.savedX !== null
      ? Math.min(b.maxX, Math.max(b.minX, this.savedX))
      : Math.round(b.minX + Math.random() * (b.maxX - b.minX)));

    this.win = new BrowserWindow({
      width: PET_W,
      height: PET_H,
      x: Math.round(this.brain.x),
      y: Math.round(this.brain.y),
      // transparent + frame:false ต้องตั้งตอนสร้าง เปลี่ยนทีหลังไม่ได้
      transparent: true,
      frame: false,
      resizable: false,
      // ไม่ขึ้นทาสก์บาร์ ไม่แย่งโฟกัสจากงานที่กำลังทำอยู่
      skipTaskbar: true,
      focusable: false,
      hasShadow: false,
      alwaysOnTop: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
        // ไม่ให้ Chromium หน่วง requestAnimationFrame ตอนหน้าต่างไม่ได้โฟกัส
        // ถ้าไม่ปิด ท่าทางจะกระตุกทันทีที่ไปคลิกโปรแกรมอื่น (ซึ่งคือเกือบตลอดเวลา)
        backgroundThrottling: false,
      },
    });

    // 'screen-saver' ทำให้ลอยเหนือหน้าต่างเกือบทุกอย่างรวมถึงที่เปิดเต็มจอ
    this.win.setAlwaysOnTop(true, 'screen-saver');
    this.win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    this.win.loadFile(path.join(__dirname, 'pet.html'));
    this.win.on('closed', () => { this.win = null; });

    // ความละเอียดจอ/ทาสก์บาร์เปลี่ยน ต้องคำนวณพื้นใหม่ ไม่งั้น pet จะลอยหรือจมพื้น
    screen.on('display-metrics-changed', () => this.syncBounds());
    screen.on('display-removed', () => this.syncBounds());
  }

  send(force = false) {
    if (!this.win || this.win.isDestroyed()) return;
    const b = this.brain;
    const key = `${b.state}|${b.facing}|${this.cls}`;
    if (!force && key === this.lastSent) return;   // ส่งเฉพาะตอนเปลี่ยน
    this.lastSent = key;
    this.win.webContents.send('pet:state', { state: b.state, facing: b.facing, cls: this.cls });
    log({ ev: 'state', state: b.state, facing: b.facing, x: Math.round(b.x), y: Math.round(b.y), clock: Math.round(b.clock) });
  }

  start() {
    this.lastTick = Date.now();
    this.timer = setInterval(() => this.tick(), TICK_MS);

    // เซฟตำแหน่งเป็นระยะ ไม่รอเฉพาะตอนกด "ออก"
    // ถ้ารอแต่ before-quit เวลาปิดเครื่องหรือโปรเซสถูกฆ่า ตำแหน่งกับอาชีพจะหายไปเลย
    this.saveTimer = setInterval(() => {
      const x = Math.round(this.brain.x);
      if (x !== this.lastSavedX) {
        this.lastSavedX = x;
        this.persist();
      }
    }, AUTOSAVE_MS);
  }

  tick() {
    if (!this.win || this.win.isDestroyed()) return;

    // ป้อนเวลาที่ผ่านไป "จริง" ไม่ใช่ TICK_MS คงที่
    // ถ้าใช้ค่าคงที่แล้ว timer ถูกหน่วง (เครื่องงานหนัก/โน้ตบุ๊กประหยัดพลังงาน)
    // pet จะเดินสโลว์โมชัน: สั่งให้นอน 10 วินาทีแล้วนอนจริง 40 วินาที
    const now = Date.now();
    const dt = Math.min(now - this.lastTick, MAX_STEP_MS);
    this.lastTick = now;

    if (this.brain.dragging) {
      const pt = screen.getCursorScreenPoint();
      this.brain.dragTo(pt.x, pt.y);
    } else if (this.brain.step(dt)) {
      this.send();
    }

    const r = Math.round;
    this.win.setBounds({ x: r(this.brain.x), y: r(this.brain.y), width: PET_W, height: PET_H });
  }

  // ── การโต้ตอบ ──
  beginDrag() {
    const pt = screen.getCursorScreenPoint();
    this.brain.beginDrag(pt.x, pt.y);
    this.send();
  }

  endDrag() {
    this.brain.endDrag();
    this.send();
  }

  poke() {
    if (this.win) this.win.webContents.send('pet:poke');
    this.brain.poke();
    this.send();
  }

  comeToCursor() {
    const pt = screen.getCursorScreenPoint();
    const b = this.brain.bounds;
    this.brain.x = Math.min(b.maxX, Math.max(b.minX, pt.x - PET_W / 2));
    this.brain.y = b.floorTop;
    this.brain.enter('walk');
    this.send();
  }

  setClass(cls) {
    this.cls = cls;
    this.send(true);
    this.persist();
    this.buildTray();
  }

  togglePause() {
    this.brain.setPaused(!this.brain.paused);
    this.send();
    this.persist();
    this.buildTray();
  }

  persist() {
    try {
      fs.mkdirSync(path.dirname(settingsFile()), { recursive: true });
      fs.writeFileSync(settingsFile(), JSON.stringify({
        cls: this.cls,
        paused: this.brain.paused,
        x: Math.round(this.brain.x),
        autostart: app.getLoginItemSettings().openAtLogin,
      }, null, 2));
    } catch (e) {
      console.error('เซฟตั้งค่าไม่ได้:', e.message);
    }
  }

  // ── ไอคอนถาดระบบ ──
  buildTray() {
    if (!this.tray) {
      const icon = nativeImage.createFromPath(path.join(__dirname, 'assets', 'tray.png'));
      try {
        this.tray = new Tray(icon.isEmpty() ? nativeImage.createEmpty() : icon);
      } catch (e) {
        console.error('สร้างไอคอนถาดระบบไม่ได้:', e.message);
        return;                    // ไม่มีถาดระบบ — ตัว pet ยังเดินได้ปกติ
      }
      this.tray.on('click', () => this.comeToCursor());
    }
    this.tray.setToolTip(`น้องเชอร์รี่ — ${CLASS_LABEL[this.cls]}`);
    this.tray.setContextMenu(Menu.buildFromTemplate([
      { label: `น้องเชอร์รี่ (${CLASS_LABEL[this.cls]})`, enabled: false },
      { type: 'separator' },
      {
        label: 'เปลี่ยนอาชีพ',
        submenu: CLASSES.map((c) => ({
          label: CLASS_LABEL[c],
          type: 'radio',
          checked: c === this.cls,
          click: () => this.setClass(c),
        })),
      },
      { label: this.brain.paused ? '▶ ให้เดินต่อ' : '⏸ ให้หยุดยืนนิ่ง', click: () => this.togglePause() },
      { label: '🎯 เรียกมาหาเมาส์', click: () => this.comeToCursor() },
      { type: 'separator' },
      {
        label: 'เริ่มพร้อม Windows',
        type: 'checkbox',
        checked: app.getLoginItemSettings().openAtLogin,
        click: (item) => {
          app.setLoginItemSettings({ openAtLogin: item.checked, args: [] });
          this.persist();
        },
      },
      { type: 'separator' },
      { label: '❌ ออก', click: () => { this.persist(); app.quit(); } },
    ]));
  }

  stop() {
    clearInterval(this.timer);
    clearInterval(this.saveTimer);
  }
}

// ── วงจรชีวิตแอป ──
const petApp = new PetApp();

// เปิดซ้ำไม่ได้ — ไม่งั้นจะมีน้องเชอร์รี่หลายตัวเดินทับกัน
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => petApp.comeToCursor());

  app.whenReady().then(() => {
    petApp.createWindow();
    petApp.buildTray();
    petApp.start();

    ipcMain.on('pet:ready', (_e, size) => {
      if (size && (size.w !== PET_W || size.h !== PET_H)) {
        console.warn(
          `ขนาดแคนวาสของ renderer (${size.w}×${size.h}) ไม่ตรงกับหน้าต่าง (${PET_W}×${PET_H}) — ` +
          'ต้องแก้ PET_W/PET_H ใน main.js กับ src/pet-view.js ให้ตรงกัน'
        );
      }
      petApp.send(true);
      log({ ev: 'ready', w: size?.w, h: size?.h });
    });
    ipcMain.on('pet:dragStart', () => petApp.beginDrag());
    ipcMain.on('pet:dragEnd', () => petApp.endDrag());
    ipcMain.on('pet:poke', () => petApp.poke());
    ipcMain.on('pet:menu', () => petApp.tray?.popUpContextMenu());
  });

  // pet ไม่มีหน้าต่างหลักให้ปิด จึงไม่ให้แอปดับตอนหน้าต่างถูกปิด
  app.on('window-all-closed', () => {});
  app.on('before-quit', () => { petApp.persist(); petApp.stop(); });

  // ปิดเครื่องหรือถูกสั่งปิดจากภายนอก — เซฟก่อนดับ
  for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
    process.on(sig, () => { petApp.persist(); petApp.stop(); app.quit(); });
  }
}
