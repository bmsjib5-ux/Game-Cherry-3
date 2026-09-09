// preload.js — สะพานเชื่อม renderer กับ main แบบจำกัดสิทธิ์
//
// contextIsolation เปิดอยู่และไม่เปิด nodeIntegration หน้า renderer จึงเข้าถึง
// Node/Electron API ไม่ได้เลย เห็นแค่ 5 ฟังก์ชันที่เปิดให้ตรงนี้
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('petBridge', {
  onState: (cb) => ipcRenderer.on('pet:state', (_e, s) => cb(s)),
  onPoke: (cb) => ipcRenderer.on('pet:poke', () => cb()),
  ready: (size) => ipcRenderer.send('pet:ready', size),
  dragStart: () => ipcRenderer.send('pet:dragStart'),
  dragEnd: () => ipcRenderer.send('pet:dragEnd'),
  poke: () => ipcRenderer.send('pet:poke'),
  menu: () => ipcRenderer.send('pet:menu'),
});
