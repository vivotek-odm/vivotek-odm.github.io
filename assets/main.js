// Static Web Serial terminal with client-side command library
let port, reader, inputDone, outputDone, inputStream, outputStream;
let term = null, fitAddon = null, useXterm = false;
let logBuffer = "";
const DATA = window.HW_CTRL_DATA || { customers: [], rootFiles: [] };

const I18N = {
  zh: {
    themeLabel: "主題",
    languageLabel: "語言",
    themeNeoGlass: "Neo-Glass",
    themeMonoPro: "Mono Pro",
    themeSolarFresh: "Solar Fresh",
    themeNatureCalm: "Nature Calm",
    themeDarkOperator: "Dark Operator",
    themeRetroPixel: "Retro Pixel",
    themeEditorialSerif: "Editorial Serif",
    themeCyberGrid: "Cyber Grid",
    themeWarmCraft: "Warm Craft",
    themeDataDense: "Data Dense",
    themePlayfulPastel: "Playful Pastel",
    themeLuxuryNoir: "Luxury Noir",
    themeBlue: "科技藍",
    themeMinimal: "極簡白",
    themePurple: "科技紫",
    themeGreen: "科技綠",
    themeNature: "自然寧靜",
    themeNeon: "暗夜紫/霓虹",
    langChinese: "中文",
    langEnglish: "英文",
    commandTitle: "Command",
    commandSourceTitle: "指令來源",
    commandSourceHint: "可上傳新的 Markdown 指令或套用已儲存的檔案。",
    commandEditorTitle: "指令編輯",
    commandEditorHint: "可先調整內容，按送出後依照行結尾設定傳送。",
    commandCollapse: "收合",
    commandExpand: "展開",
    labelCustomer: "客戶",
    labelCustomerTitle: "選擇客戶",
    labelProject: "專案",
    labelProjectTitle: "選擇專案",
    labelFile: "指令檔",
    labelFileTitle: "選擇 hw-ctrl.md",
    savedUploadsLabel: "已上傳指令",
    savedUploadsPlaceholder: "選擇已上傳檔案",
    uploadLabel: "上傳指令",
    clearUpload: "清除",
    uploadHint: "支援 Markdown 檔，上傳後會轉成硬體動作按鈕。",
    uploadParsing: "解析 {name}...",
    uploadReadError: "無法讀取 {name}。",
    uploadParseError: "解析 {name} 時發生錯誤。",
    uploadParseEmpty: "{name} 未找到任何硬體動作。",
    uploadSuccess: "已載入 {name}。",
    uploadCleared: "已還原為原始指令清單。",
    codePlaceholder: "按下面動作按鈕會載入該段指令並立即送出...",
    runCode: "執行/送出 Command",
    hwCommandsTitle: "硬體測試指令",
    hwListAria: "硬體清單與動作按鈕",
    connect: "連線",
    disconnect: "中斷",
    labelBaud: "Baud:",
    labelDtr: "DTR:",
    labelRts: "RTS:",
    inputPlaceholder: "輸入要傳送的指令，例如: AT",
    lineEndingNone: "無結尾",
    lineEndingLF: "\\n",
    lineEndingCR: "\\r",
    lineEndingCRLF: "\\r\\n",
    send: "送出",
    hexMode: " HEX 顯示",
    clear: "清除",
    save: "儲存 Log",
    download: "下載",
    logTagTitle: "log 檔名標籤",
    footerTextPrefix: "版權所有 © 2019-",
    footerTextSuffix: " Vivotek ODM BU",
    statusConnected: "[已連線]",
    statusDisconnected: "[已中斷]",
    noHardware: "目前沒有可用的硬體指令",
    webSerialNotSupported: "本瀏覽器不支援 Web Serial API。請使用 Chrome/Edge 並於 HTTPS 或 localhost 環境。",
    connectFailed: "連線失敗",
    logEmpty: "目前沒有可儲存的內容"
  },
  en: {
    themeLabel: "Theme",
    languageLabel: "Language",
    themeNeoGlass: "Neo-Glass",
    themeMonoPro: "Mono Pro",
    themeSolarFresh: "Solar Fresh",
    themeNatureCalm: "Nature Calm",
    themeDarkOperator: "Dark Operator",
    themeRetroPixel: "Retro Pixel",
    themeEditorialSerif: "Editorial Serif",
    themeCyberGrid: "Cyber Grid",
    themeWarmCraft: "Warm Craft",
    themeDataDense: "Data Dense",
    themePlayfulPastel: "Playful Pastel",
    themeLuxuryNoir: "Luxury Noir",
    themeBlue: "Tech Blue",
    themeMinimal: "Minimal White",
    themePurple: "Tech Purple",
    themeGreen: "Tech Green",
    themeNature: "Nature Calm",
    themeNeon: "Neon Night",
    langChinese: "Chinese",
    langEnglish: "English",
    commandTitle: "Command",
    commandSourceTitle: "Command Source",
    commandSourceHint: "Upload a Markdown file or reuse one that was stored locally.",
    commandEditorTitle: "Command Editor",
    commandEditorHint: "Tweak the text before sending; it follows the line-ending setting.",
    commandCollapse: "Collapse",
    commandExpand: "Expand",
    labelCustomer: "Customer",
    labelCustomerTitle: "Select customer",
    labelProject: "Project",
    labelProjectTitle: "Select project",
    labelFile: "Command File",
    labelFileTitle: "Choose hw-ctrl profile",
    savedUploadsLabel: "Saved Commands",
    savedUploadsPlaceholder: "Choose uploaded file",
    uploadLabel: "Upload Commands",
    clearUpload: "Reset",
    uploadHint: "Drop a Markdown file to create hardware action buttons.",
    uploadParsing: "Parsing {name}...",
    uploadReadError: "Could not read {name}.",
    uploadParseError: "Failed to parse {name}.",
    uploadParseEmpty: "No hardware actions found in {name}.",
    uploadSuccess: "Loaded {name}.",
    uploadCleared: "Restored original command list.",
    codePlaceholder: "Click an action below to load and send its commands…",
    runCode: "Run / Send Command",
    hwCommandsTitle: "Hardware Actions",
    hwListAria: "Hardware groups and action buttons",
    connect: "Connect",
    disconnect: "Disconnect",
    labelBaud: "Baud:",
    labelDtr: "DTR:",
    labelRts: "RTS:",
    inputPlaceholder: "Enter command to send, e.g. AT",
    lineEndingNone: "No ending",
    lineEndingLF: "\\n",
    lineEndingCR: "\\r",
    lineEndingCRLF: "\\r\\n",
    send: "Send",
    hexMode: " HEX Mode",
    clear: "Clear",
    save: "Save Log",
    download: "Download",
    logTagTitle: "Log filename tag",
    footerTextPrefix: "Copyright © 2019-",
    footerTextSuffix: " Vivotek ODM BU",
    statusConnected: "[connected]",
    statusDisconnected: "[disconnected]",
    noHardware: "No hardware commands available",
    webSerialNotSupported: "Your browser does not support the Web Serial API. Please use Chrome/Edge over HTTPS or localhost.",
    connectFailed: "Connection failed",
    logEmpty: "Nothing to save yet"
  }
};

const DEFAULT_LANG = 'zh';
let currentLang = DEFAULT_LANG;
let uploadStatusKey = 'uploadHint';
let uploadStatusArgs = {};

const $ = (sel) => document.querySelector(sel);
const rx = $("#rx");
const termEl = $("#terminal");
const btnConnect = $("#btnConnect");
const btnDisconnect = $("#btnDisconnect");
const btnSend = $("#btnSend");
const themeSelect = $("#themeSelect");
const langSelect = $("#langSelect");
const hwList = $("#hwList");
const customerSelect = $("#customerSelect");
const projectSelect = $("#projectSelect");
const hwFileSelect = $("#hwFileSelect");
const codeArea = $("#codeArea");
const btnRunCode = $("#btnRunCode");
const btnDownload = $("#btnDownload");
const btnSave = $("#btnSave");
const hwUpload = $("#hwUpload");
const btnClearUpload = $("#btnClearUpload");
const uploadStatus = $("#uploadStatus");
const savedUploadSelect = $("#savedUploadSelect");
const commandSection = document.getElementById('commandPanel');
const commandBody = document.getElementById('commandBody');
const commandToggle = document.getElementById('btnCommandToggle');
const customerProjectRow = customerSelect ? customerSelect.closest('.row') : null;
const hwFileRow = hwFileSelect ? hwFileSelect.closest('.row') : null;

const UPLOAD_STORAGE_KEY = 'uploadedHwFiles';
let savedUploads = loadSavedUploads();
let currentSavedId = null;
let baseRenderer = () => { renderRootFallback(); };
let commandCollapsed = false;
let groupCollapsedState = loadGroupCollapsedState();

try {
  const storedUploadId = localStorage.getItem('currentSavedUpload');
  if (storedUploadId && savedUploads.some(entry => entry.id === storedUploadId)) {
    currentSavedId = storedUploadId;
  }
} catch {}

try {
  commandCollapsed = localStorage.getItem('commandCollapsed') === '1';
} catch {}

if (commandSection && commandCollapsed) {
  commandSection.classList.add('collapsed');
  if (commandBody) commandBody.setAttribute('hidden', '');
}

function loadSavedUploads(){
  try {
    const raw = localStorage.getItem(UPLOAD_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(item => item && Array.isArray(item.groups))
      .map(item => ({
        id: item.id || `upload-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        name: item.name || 'upload',
        groups: item.groups || [],
        ts: item.ts || 0,
      }))
      .sort((a, b) => (b.ts || 0) - (a.ts || 0));
  } catch (err) {
    console.warn('Failed to load saved uploads', err);
    return [];
  }
}

function persistSavedUploads(){
  try {
    localStorage.setItem(UPLOAD_STORAGE_KEY, JSON.stringify(savedUploads));
  } catch (err) {
    console.warn('Failed to persist uploads', err);
  }
}

function populateSavedUploads(selectedId){
  if (!savedUploadSelect) return;
  savedUploadSelect.innerHTML = '';
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.setAttribute('data-i18n', 'savedUploadsPlaceholder');
  placeholder.textContent = t('savedUploadsPlaceholder');
  savedUploadSelect.appendChild(placeholder);
  savedUploads.forEach(entry => {
    const opt = document.createElement('option');
    opt.value = entry.id;
    opt.textContent = entry.name;
    savedUploadSelect.appendChild(opt);
  });
  if (selectedId && savedUploads.some(entry => entry.id === selectedId)) {
    savedUploadSelect.value = selectedId;
  } else {
    savedUploadSelect.value = '';
  }
}

function renderWithSavedPriority(){
  if (currentSavedId) {
    const entry = savedUploads.find(item => item.id === currentSavedId);
    if (entry) {
      renderHwCtrl(entry.groups || []);
      if (codeArea) codeArea.value = '';
      setUploadStatus('uploadSuccess', { name: entry.name });
      return;
    }
    currentSavedId = null;
    setLocal('currentSavedUpload', '');
    populateSavedUploads(currentSavedId);
  }
  baseRenderer();
}

function formatMessage(template, replacements){
  let result = template;
  Object.entries(replacements || {}).forEach(([key, value]) => {
    const re = new RegExp(`{${key}}`, 'g');
    result = result.replace(re, value);
  });
  return result;
}

function setUploadStatus(key, replacements = {}){
  uploadStatusKey = key;
  uploadStatusArgs = replacements;
  if (!uploadStatus) return;
  const msg = formatMessage(t(key), replacements);
  uploadStatus.textContent = msg;
}

function loadGroupCollapsedState(){
  try {
    const raw = localStorage.getItem('commandGroups');
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function persistGroupCollapsedState(){
  try { localStorage.setItem('commandGroups', JSON.stringify(groupCollapsedState)); } catch {}
}

function applyGroupCollapsedState(){
  document.querySelectorAll('.hw-editor__group').forEach(group => {
    const key = group.getAttribute('data-group');
    if (!key) return;
    const collapsed = groupCollapsedState[key];
    const wrapper = group.querySelector('.hw-editor__inner');
    const toggle = group.querySelector('.group-toggle');
    if (collapsed) {
      group.classList.add('collapsed');
      if (wrapper) wrapper.setAttribute('hidden', '');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('title', t('commandExpand'));
        toggle.setAttribute('aria-label', t('commandExpand'));
      }
    } else {
      group.classList.remove('collapsed');
      if (wrapper) wrapper.removeAttribute('hidden');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('title', t('commandCollapse'));
        toggle.setAttribute('aria-label', t('commandCollapse'));
      }
    }
  });
}

function toggleGroupCollapsed(key){
  const current = !!groupCollapsedState[key];
  groupCollapsedState[key] = !current;
  if (!groupCollapsedState[key]) delete groupCollapsedState[key];
  persistGroupCollapsedState();
  applyGroupCollapsedState();
  setTimeout(() => { try { alignHwListToTerminalBottom(); } catch {} }, 80);
}

function updateCommandToggleLabel(){
  if (!commandToggle) return;
  const key = commandCollapsed ? 'commandExpand' : 'commandCollapse';
  const label = t(key);
  commandToggle.setAttribute('aria-expanded', commandCollapsed ? 'false' : 'true');
  commandToggle.setAttribute('title', label);
  commandToggle.setAttribute('aria-label', label);
}

function applyCommandCollapsedState(){
  if (!commandSection) return;
  if (commandCollapsed) {
    commandSection.classList.add('collapsed');
    if (commandBody) commandBody.setAttribute('hidden', '');
  } else {
    commandSection.classList.remove('collapsed');
    if (commandBody) commandBody.removeAttribute('hidden');
  }
  updateCommandToggleLabel();
  setTimeout(() => {
    try { alignHwListToTerminalBottom(); } catch {}
  }, 50);
}

function t(key){
  const dict = I18N[currentLang] || I18N[DEFAULT_LANG] || {};
  if (key in dict) return dict[key];
  const fallback = I18N[DEFAULT_LANG] || {};
  return fallback[key] !== undefined ? fallback[key] : key;
}

function applyLang(lang){
  currentLang = I18N[lang] ? lang : DEFAULT_LANG;
  setLocal('lang', currentLang);
  const htmlLang = currentLang === 'zh' ? 'zh-Hant' : 'en';
  try { document.documentElement.setAttribute('lang', htmlLang); } catch {}

  if (langSelect) {
    langSelect.value = currentLang;
  }

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const text = t(key);
    if (text !== undefined) el.textContent = text;
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    const text = t(key);
    if (text !== undefined) el.setAttribute('placeholder', text);
  });

  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const key = el.getAttribute('data-i18n-title');
    const text = t(key);
    if (text !== undefined) el.setAttribute('title', text);
  });

  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria');
    const text = t(key);
    if (text !== undefined) el.setAttribute('aria-label', text);
  });

  if (!term && rx && !rx.textContent.trim()) {
    rx.textContent = '';
  }

  if (hwList && hwList.childElementCount === 0) {
    hwList.textContent = t('noHardware');
  }

  updateCommandToggleLabel();
  populateSavedUploads(currentSavedId);
  setUploadStatus(uploadStatusKey, uploadStatusArgs);
  applyGroupCollapsedState();
}

function toggleCtrlCmdSelectors(show){
  const rows = [customerProjectRow, hwFileRow];
  rows.forEach(row => {
    if (!row) return;
    row.style.display = show ? '' : 'none';
  });
  [customerSelect, projectSelect, hwFileSelect].forEach(sel => {
    if (!sel) return;
    sel.disabled = !show;
  });
}

function supportsWebSerial(){
  return "serial" in navigator;
}

function append(text){
  logBuffer += text;
  if (useXterm && term) {
    term.write(text);
  } else if (rx) {
    rx.textContent += text;
    rx.scrollTop = rx.scrollHeight;
  }
}

function clearTerminal(){
  logBuffer = "";
  if (useXterm && term) {
    try { term.clear(); } catch {}
  } else if (rx) {
    rx.textContent = "";
  }
}

function initTerminal(){
  if (window.Terminal && termEl) {
    useXterm = true;
    term = new window.Terminal({
      convertEol: true,
      cursorBlink: true,
      scrollback: 5000,
      fontSize: 13,
      fontFamily: 'JetBrains Mono, Fira Code, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
    });
    term.open(termEl);
    if (window.FitAddon && window.FitAddon.FitAddon) {
      try {
        fitAddon = new window.FitAddon.FitAddon();
        term.loadAddon(fitAddon);
        fitAddon.fit();
        window.addEventListener('resize', () => { try { fitAddon.fit(); } catch {} });
      } catch {}
    }
    term.onData((data) => {
      if (!outputStream) return;
      const writer = outputStream.getWriter();
      try {
        if (data === '\r' || data === '\n') {
          const opt = $("#lineEnding").value;
          let ending = '';
          if (opt === 'lf') ending = '\n';
          else if (opt === 'cr') ending = '\r';
          else if (opt === 'crlf') ending = '\r\n';
          writer.write(ending);
        } else {
          writer.write(data);
        }
      } finally {
        writer.releaseLock();
      }
    });
    if (rx) rx.hidden = true;
  } else if (rx) {
    rx.hidden = false;
  }
}

const THEME_MIGRATIONS = {
  nature: 'nature-calm'
};

const termThemes = {
  'neo-glass': {
    background: '#0d1628',
    foreground: '#e8f1ff',
    cursor: '#60a5fa',
    selection: '#1e2f4a',
    black: '#0b1324', red: '#ff7a85', green: '#7de2b8', yellow: '#ffe28f', blue: '#60a5fa', magenta: '#b794f4', cyan: '#93e9ff', white: '#f7faff',
    brightBlack: '#3b4c63', brightRed: '#ff96a1', brightGreen: '#8df0c7', brightYellow: '#ffe9b0', brightBlue: '#7bb8ff', brightMagenta: '#c9a9ff', brightCyan: '#b3f5ff', brightWhite: '#ffffff'
  },
  'mono-pro': {
    background: '#ffffff',
    foreground: '#111827',
    cursor: '#111827',
    selection: '#e5e7eb',
    black: '#111827', red: '#b91c1c', green: '#15803d', yellow: '#a16207', blue: '#1d4ed8', magenta: '#6b7280', cyan: '#0e7490', white: '#e5e7eb',
    brightBlack: '#374151', brightRed: '#ef4444', brightGreen: '#22c55e', brightYellow: '#f59e0b', brightBlue: '#3b82f6', brightMagenta: '#94a3b8', brightCyan: '#06b6d4', brightWhite: '#ffffff'
  },
  'solar-fresh': {
    background: '#ffffff',
    foreground: '#0a1626',
    cursor: '#fb923c',
    selection: '#bad7f9',
    black: '#0a1626', red: '#f97316', green: '#22c55e', yellow: '#facc15', blue: '#0ea5e9', magenta: '#a855f7', cyan: '#22d3ee', white: '#f0f9ff',
    brightBlack: '#1e293b', brightRed: '#fb923c', brightGreen: '#34d399', brightYellow: '#fde047', brightBlue: '#38bdf8', brightMagenta: '#c084fc', brightCyan: '#2dd4bf', brightWhite: '#ffffff'
  },
  'nature-calm': {
    background: '#0a120d',
    foreground: '#e5f6eb',
    cursor: '#65a30d',
    selection: '#1f3324',
    black: '#0a120d', red: '#e67f73', green: '#16a34a', yellow: '#d9f99d', blue: '#7dd3fc', magenta: '#c4b5fd', cyan: '#4ade80', white: '#e5f6eb',
    brightBlack: '#4d6656', brightRed: '#f1998f', brightGreen: '#4ade80', brightYellow: '#fef9c3', brightBlue: '#bae6fd', brightMagenta: '#ddd6fe', brightCyan: '#86efac', brightWhite: '#ffffff'
  },
  'dark-operator': {
    background: '#040a14',
    foreground: '#e2e8f0',
    cursor: '#0ea5e9',
    selection: '#12324a',
    black: '#020b16', red: '#f97316', green: '#10b981', yellow: '#f59e0b', blue: '#0ea5e9', magenta: '#818cf8', cyan: '#22d3ee', white: '#e2e8f0',
    brightBlack: '#475569', brightRed: '#fb923c', brightGreen: '#34d399', brightYellow: '#fbbf24', brightBlue: '#38bdf8', brightMagenta: '#a5b4fc', brightCyan: '#67e8f9', brightWhite: '#ffffff'
  },
  'retro-pixel': {
    background: '#0b121d',
    foreground: '#fef3c7',
    cursor: '#22c55e',
    selection: '#1b2d40',
    black: '#0b121d', red: '#ef4444', green: '#22c55e', yellow: '#facc15', blue: '#38bdf8', magenta: '#f472b6', cyan: '#2dd4bf', white: '#fef3c7',
    brightBlack: '#1f2937', brightRed: '#f87171', brightGreen: '#4ade80', brightYellow: '#fde047', brightBlue: '#60a5fa', brightMagenta: '#f9a8d4', brightCyan: '#5eead4', brightWhite: '#ffffff'
  },
  'editorial-serif': {
    background: '#ffffff',
    foreground: '#0f172a',
    cursor: '#0f172a',
    selection: '#cfe4f7',
    black: '#0f172a', red: '#dc2626', green: '#15803d', yellow: '#d97706', blue: '#0ea5e9', magenta: '#7c3aed', cyan: '#0891b2', white: '#e2e8f0',
    brightBlack: '#334155', brightRed: '#f87171', brightGreen: '#34d399', brightYellow: '#fb923c', brightBlue: '#38bdf8', brightMagenta: '#a855f7', brightCyan: '#22d3ee', brightWhite: '#ffffff'
  },
  'cyber-grid': {
    background: '#020814',
    foreground: '#dbeafe',
    cursor: '#22d3ee',
    selection: '#14334b',
    black: '#020814', red: '#f472b6', green: '#22d3ee', yellow: '#fde047', blue: '#3b82f6', magenta: '#a855f7', cyan: '#06b6d4', white: '#dbeafe',
    brightBlack: '#1e293b', brightRed: '#fb7185', brightGreen: '#4ade80', brightYellow: '#facc15', brightBlue: '#60a5fa', brightMagenta: '#c084fc', brightCyan: '#22d3ee', brightWhite: '#ffffff'
  },
  'warm-craft': {
    background: '#fdf6ed',
    foreground: '#2c1b12',
    cursor: '#b45309',
    selection: '#f6d5a2',
    black: '#2c1b12', red: '#d97706', green: '#65a30d', yellow: '#fbbf24', blue: '#38bdf8', magenta: '#f472b6', cyan: '#14b8a6', white: '#fdf6ed',
    brightBlack: '#5c331d', brightRed: '#fb923c', brightGreen: '#86efac', brightYellow: '#fde68a', brightBlue: '#7dd3fc', brightMagenta: '#f9a8d4', brightCyan: '#2dd4bf', brightWhite: '#ffffff'
  },
  'data-dense': {
    background: '#ffffff',
    foreground: '#0f172a',
    cursor: '#1d4ed8',
    selection: '#c7d2fe',
    black: '#0f172a', red: '#dc2626', green: '#10b981', yellow: '#f59e0b', blue: '#1d4ed8', magenta: '#7c3aed', cyan: '#0891b2', white: '#e2e8f0',
    brightBlack: '#334155', brightRed: '#f97316', brightGreen: '#34d399', brightYellow: '#fbbf24', brightBlue: '#3b82f6', brightMagenta: '#a855f7', brightCyan: '#22d3ee', brightWhite: '#ffffff'
  },
  'playful-pastel': {
    background: '#ffffff',
    foreground: '#475569',
    cursor: '#f9a8d4',
    selection: '#dbe7ff',
    black: '#475569', red: '#f97316', green: '#22c55e', yellow: '#facc15', blue: '#60a5fa', magenta: '#f472b6', cyan: '#22d3ee', white: '#e0e7ff',
    brightBlack: '#64748b', brightRed: '#fb923c', brightGreen: '#4ade80', brightYellow: '#fde047', brightBlue: '#93c5fd', brightMagenta: '#f9a8d4', brightCyan: '#8bdef8', brightWhite: '#ffffff'
  },
  'luxury-noir': {
    background: '#080808',
    foreground: '#f4ecd7',
    cursor: '#d4af37',
    selection: '#403211',
    black: '#080808', red: '#f97316', green: '#d9f99d', yellow: '#facc15', blue: '#38bdf8', magenta: '#f472b6', cyan: '#fde68a', white: '#f4ecd7',
    brightBlack: '#2d2410', brightRed: '#fb923c', brightGreen: '#bef264', brightYellow: '#facc15', brightBlue: '#7dd3fc', brightMagenta: '#f9a8d4', brightCyan: '#fde68a', brightWhite: '#ffffff'
  },
  minimal: {
    background: '#ffffff',
    foreground: '#0f172a',
    cursor: '#111827',
    selection: '#dbeafe',
    black: '#0f172a', red: '#b91c1c', green: '#15803d', yellow: '#a16207', blue: '#1d4ed8', magenta: '#6d28d9', cyan: '#0e7490', white: '#e5e7eb',
    brightBlack: '#334155', brightRed: '#ef4444', brightGreen: '#22c55e', brightYellow: '#f59e0b', brightBlue: '#3b82f6', brightMagenta: '#a78bfa', brightCyan: '#22d3ee', brightWhite: '#ffffff'
  },
  blue: {
    background: '#0a0f14',
    foreground: '#d6f1ff',
    cursor: '#00eaff',
    selection: '#14324a',
    black: '#0a0f14', red: '#ff5c57', green: '#2ef2a4', yellow: '#ffe66d', blue: '#2bb7ff', magenta: '#c792ea', cyan: '#00eaff', white: '#d6f1ff',
    brightBlack: '#475a6b', brightRed: '#ff7a85', brightGreen: '#53f8c7', brightYellow: '#fff59d', brightBlue: '#53caff', brightMagenta: '#d3a9ff', brightCyan: '#3cecff', brightWhite: '#ffffff'
  },
  purple: {
    background: '#0f0b16',
    foreground: '#efe7ff',
    cursor: '#b388ff',
    selection: '#2b1f49',
    black: '#0f0b16', red: '#ff5c8a', green: '#53f8c7', yellow: '#ffe66d', blue: '#7aa2ff', magenta: '#b388ff', cyan: '#7de2ff', white: '#efe7ff',
    brightBlack: '#5b5570', brightRed: '#ff86a8', brightGreen: '#79ffd6', brightYellow: '#fff59d', brightBlue: '#9ab9ff', brightMagenta: '#cfb2ff', brightCyan: '#a8eeff', brightWhite: '#ffffff'
  },
  green: {
    background: '#0a1410',
    foreground: '#e3ffe8',
    cursor: '#2ef2a4',
    selection: '#123a28',
    black: '#0a1410', red: '#ff5c57', green: '#2ef2a4', yellow: '#d6ff70', blue: '#53caff', magenta: '#c7a0ff', cyan: '#00eaff', white: '#e3ffe8',
    brightBlack: '#4b6b5b', brightRed: '#ff7a85', brightGreen: '#7dffc6', brightYellow: '#f3ff9d', brightBlue: '#7fdcff', brightMagenta: '#d9b9ff', brightCyan: '#9cf3ff', brightWhite: '#ffffff'
  },
  nature: {
    background: '#0b120e',
    foreground: '#eaf5ee',
    cursor: '#8ccf7e',
    selection: '#274535',
    black: '#0b120e', red: '#e67f73', green: '#8ccf7e', yellow: '#e2c08d', blue: '#7aa2ff', magenta: '#c5a3ff', cyan: '#7ad1c1', white: '#eaf5ee',
    brightBlack: '#5a6d63', brightRed: '#f1998f', brightGreen: '#a8deb0', brightYellow: '#edd7a9', brightBlue: '#9ab9ff', brightMagenta: '#d9c1ff', brightCyan: '#a4e2d5', brightWhite: '#ffffff'
  },
  neon: {
    background: '#0c0714',
    foreground: '#f7e9ff',
    cursor: '#e879f9',
    selection: '#2b1843',
    black: '#0c0714', red: '#ff5c93', green: '#53f8c7', yellow: '#ffe66d', blue: '#7aa2ff', magenta: '#e879f9', cyan: '#22d3ee', white: '#f7e9ff',
    brightBlack: '#6b5a8a', brightRed: '#ff86b0', brightGreen: '#79ffd6', brightYellow: '#fff59d', brightBlue: '#9ab9ff', brightMagenta: '#f0a1ff', brightCyan: '#7eeeff', brightWhite: '#ffffff'
  }
};

function normalizeThemeName(name){
  if (!name) return 'minimal';
  return THEME_MIGRATIONS[name] || name;
}

function applyTheme(name){
  const normalized = normalizeThemeName(name);
  const theme = termThemes[normalized] ? normalized : 'minimal';
  try { document.documentElement.setAttribute('data-theme', theme); } catch {}
  try { localStorage.setItem('theme', theme); } catch {}
  if (themeSelect) {
    themeSelect.value = theme;
  }
  if (term && term.setOption) {
    term.setOption('theme', termThemes[theme]);
  }
}

function toHexView(uint8){
  return Array.from(uint8, b => b.toString(16).padStart(2, "0")).join(" ");
}

async function connect(){
  if(!supportsWebSerial()){
    alert(t('webSerialNotSupported'));
    return;
  }
  try{
    const filters = [];
    port = await navigator.serial.requestPort({ filters });
    await port.open({ baudRate: parseInt($("#baudRate").value || "115200", 10) });
    try {
      await port.setSignals({ dataTerminalReady: $("#dtr").checked, requestToSend: $("#rts").checked });
    } catch {}

    const decoder = new TextDecoderStream();
    inputDone = port.readable.pipeTo(decoder.writable);
    inputStream = decoder.readable;
    reader = inputStream.getReader();

    const encoder = new TextEncoderStream();
    outputDone = encoder.readable.pipeTo(port.writable);
    outputStream = encoder.writable;

    btnConnect.disabled = true;
    btnDisconnect.disabled = false;
    btnSend.disabled = false;
    if (btnRunCode) btnRunCode.disabled = false;

    append(t('statusConnected') + "\n");
    if (useXterm && term) {
      try {
        term.focus();
        if (fitAddon) fitAddon.fit();
      } catch {}
    }

    readLoop();
  }catch(err){
    console.error(err);
    alert(t('connectFailed') + ': ' + err.message);
  }
}

async function disconnect(){
  if(reader){
    try { await reader.cancel(); } catch {}
    try { await inputDone; } catch {}
    reader = null; inputDone = null;
  }
  if(outputStream){
    try { await outputStream.getWriter().close(); } catch {}
    try { await outputDone; } catch {}
    outputStream = null; outputDone = null;
  }
  if(port){
    try { await port.close(); } catch {}
    port = null;
  }
  btnConnect.disabled = false;
  btnDisconnect.disabled = true;
  btnSend.disabled = true;
  if (btnRunCode) btnRunCode.disabled = true;
  append(t('statusDisconnected') + "\n");
}

async function readLoop(){
  const hexMode = $("#hexMode");
  while (true){
    try{
      const { value, done } = await reader.read();
      if(done) break;
      if(value){
        if(hexMode && hexMode.checked){
          const bytes = new TextEncoder().encode(value);
          append(toHexView(bytes) + "\n");
        }else{
          append(value);
        }
      }
    }catch(e){
      console.error(e);
      break;
    }
  }
}

function addLineEnding(s){
  const opt = $("#lineEnding").value;
  if(opt === "lf") return s + "\n";
  if(opt === "cr") return s + "\r";
  if(opt === "crlf") return s + "\r\n";
  return s;
}

async function send(){
  const text = $("#tx").value;
  if(!text || !outputStream){ return; }
  const writer = outputStream.getWriter();
  try{
    await writer.write(addLineEnding(text));
    $("#tx").select();
  }finally{
    writer.releaseLock();
  }
}

function normalizeLines(text){
  return (text || '').replace(/\r\n|\r|\n/g, "\n").split("\n");
}

async function sendCodeText(text){
  if(!text || !outputStream){ return; }
  const lines = normalizeLines(text);
  const opt = $("#lineEnding").value;
  let ending = '';
  if (opt === 'lf') ending = '\n';
  else if (opt === 'cr') ending = '\r';
  else if (opt === 'crlf') ending = '\r\n';
  const writer = outputStream.getWriter();
  try{
    for(const line of lines){
      if(line.trim().length === 0) continue;
      await writer.write(line + ending);
    }
  } finally {
    writer.releaseLock();
  }
}

async function runCodeArea(){
  if(!codeArea) return;
  await sendCodeText(codeArea.value);
}

function timestamp(){
  const d = new Date();
  const pad = (n)=> String(n).padStart(2,'0');
  return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function downloadLocalLog(){
  const tag = $("#logTag").value || 'session';
  const name = `serial-log-${timestamp()}-${tag}.txt`;
  const blob = new Blob([logBuffer || ''], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 3000);
}

function saveLogLocal(){
  if (!logBuffer) {
    alert(t('logEmpty'));
    return;
  }
  downloadLocalLog();
}

function parseHardwareMarkdown(text){
  if (!text) return [];
  const lines = text.replace(/\r\n|\r/g, '\n').split('\n');
  const groups = [];
  let current = null;
  let actionName = null;
  let codeBuffer = [];
  let inCode = false;

  for (const raw of lines){
    const line = raw;
    const trimmed = raw.trim();

    if (trimmed.startsWith('```')){
      if (!inCode){
        inCode = true;
        codeBuffer = [];
      } else {
        inCode = false;
        const code = codeBuffer.join('\n').trimEnd();
        if (current && actionName && code.length > 0){
          current.actions.push({ name: actionName.trim(), code });
        }
        actionName = null;
        codeBuffer = [];
      }
      continue;
    }

    if (inCode){
      codeBuffer.push(line);
      continue;
    }

    const actionMatch = line.match(/^###\s+(.+)$/);
    if (actionMatch){
      actionName = actionMatch[1];
      continue;
    }

    const groupMatch = line.match(/^##\s+(.+)$/);
    if (groupMatch){
      current = { name: groupMatch[1].trim(), actions: [] };
      groups.push(current);
      actionName = null;
      continue;
    }
  }

  return groups.filter(g => Array.isArray(g.actions) && g.actions.length > 0);
}

function upsertSavedUpload(name, groups){
  const ts = Date.now();
  let entry = savedUploads.find(item => item.name === name);
  if (entry) {
    entry.groups = groups;
    entry.ts = ts;
  } else {
    entry = {
      id: `upload-${ts}-${Math.random().toString(16).slice(2)}`,
      name,
      groups,
      ts,
    };
    savedUploads.push(entry);
  }
  savedUploads = savedUploads
    .filter(item => item && Array.isArray(item.groups))
    .sort((a, b) => (b.ts || 0) - (a.ts || 0));
  persistSavedUploads();
  return entry.id;
}

async function handleUploadFile(file){
  if (!file) return;
  setUploadStatus('uploadParsing', { name: file.name });
  try{
    const text = await file.text();
    let groups = [];
    try {
      groups = parseHardwareMarkdown(text) || [];
    } catch (e){
      console.error('parse error', e);
      setUploadStatus('uploadParseError', { name: file.name });
      return;
    }
    if (!groups.length){
      setUploadStatus('uploadParseEmpty', { name: file.name });
      return;
    }
    const savedId = upsertSavedUpload(file.name, groups);
    currentSavedId = savedId;
    setLocal('currentSavedUpload', savedId);
    populateSavedUploads(currentSavedId);
    renderWithSavedPriority();
  }catch(err){
    console.error(err);
    setUploadStatus('uploadReadError', { name: file.name });
  }
}

function resetUploadSelection(){
  if (hwUpload) hwUpload.value = '';
  currentSavedId = null;
  setLocal('currentSavedUpload', '');
  if (savedUploadSelect) savedUploadSelect.value = '';
  populateSavedUploads(currentSavedId);
  renderWithSavedPriority();
  setUploadStatus('uploadCleared');
}

$("#btnConnect").addEventListener("click", connect);
$("#btnDisconnect").addEventListener("click", disconnect);
$("#btnSend").addEventListener("click", send);
$("#btnClear").addEventListener("click", clearTerminal);
if (btnSave) btnSave.addEventListener("click", saveLogLocal);
if (btnDownload) btnDownload.addEventListener("click", downloadLocalLog);
if (btnRunCode) btnRunCode.addEventListener("click", runCodeArea);
if (hwUpload) {
  hwUpload.addEventListener('change', async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    await handleUploadFile(file);
  });
}
if (btnClearUpload) {
  btnClearUpload.addEventListener('click', resetUploadSelection);
}
if (savedUploadSelect) {
  savedUploadSelect.addEventListener('change', (e) => {
    const id = e.target.value;
    if (!id) {
      currentSavedId = null;
      setLocal('currentSavedUpload', '');
      setUploadStatus('uploadHint');
      renderWithSavedPriority();
      return;
    }
    currentSavedId = id;
    setLocal('currentSavedUpload', id);
    renderWithSavedPriority();
  });
}
if (commandToggle) {
  commandToggle.addEventListener('click', () => {
    commandCollapsed = !commandCollapsed;
    setLocal('commandCollapsed', commandCollapsed ? '1' : '');
    applyCommandCollapsedState();
  });
}

if (typeof document !== 'undefined') {
  document.querySelectorAll('.group-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-target');
      if (!key) return;
      toggleGroupCollapsed(key);
    });
  });
}

applyGroupCollapsedState();

try {
  const savedRaw = localStorage.getItem('theme') || 'minimal';
  const saved = normalizeThemeName(savedRaw);
  if (themeSelect) themeSelect.value = saved;
  applyTheme(saved);
} catch { applyTheme('minimal'); }

initTerminal();
try {
  const current = (themeSelect && themeSelect.value) || 'minimal';
  applyTheme(current);
} catch {}

if (themeSelect) {
  themeSelect.addEventListener('change', (e) => {
    applyTheme(e.target.value);
  });
}

try {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
} catch {}

try {
  const y = document.getElementById('copyrightYear');
  if (y) y.textContent = String(new Date().getFullYear());
} catch {}

function setOptions(select, items, selected){
  if (!select) return;
  select.innerHTML = '';
  items.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item.value;
    opt.textContent = item.label;
    select.appendChild(opt);
  });
  if (selected && items.some(item => item.value === selected)) {
    select.value = selected;
  }
}

function getLocal(key){ try { return localStorage.getItem(key); } catch { return null; } }
function setLocal(key, val){ try { localStorage.setItem(key, val); } catch {} }

function findCustomer(id){
  return (DATA.customers || []).find(c => c.id === id);
}

function findProject(customer, id){
  if (!customer) return undefined;
  return (customer.projects || []).find(p => p.id === id);
}

function findFile(project, id){
  if (!project) return undefined;
  return (project.files || []).find(f => f.id === id);
}

function renderHwCtrl(items){
  if (!hwList) return;
  hwList.innerHTML = '';
  if (!items || items.length === 0){
    hwList.textContent = t('noHardware');
    return;
  }
  items.forEach(item => {
    const wrap = document.createElement('div');
    wrap.className = 'hw-item';
    const h3 = document.createElement('h3');
    h3.textContent = item.name;
    const actions = document.createElement('div');
    actions.className = 'hw-actions';
    (item.actions || []).forEach(act => {
      const btn = document.createElement('button');
      btn.textContent = act.name;
      btn.addEventListener('click', async () => {
        if (codeArea) codeArea.value = act.code || '';
        await runCodeArea();
      });
      actions.appendChild(btn);
    });
    wrap.appendChild(h3);
    wrap.appendChild(actions);
    hwList.appendChild(wrap);
  });
  try { alignHwListToTerminalBottom(); } catch {}
}

function renderFileCommands(file){
  if (!file) {
    renderHwCtrl([]);
    if (codeArea) codeArea.value = '';
    setUploadStatus('uploadHint');
    return;
  }
  renderHwCtrl(file.groups || []);
  setUploadStatus('uploadHint');
}

function renderRootFallback(){
  const rootFiles = Array.isArray(DATA.rootFiles) ? DATA.rootFiles : [];
  if (rootFiles.length === 0) {
    renderHwCtrl([]);
    setUploadStatus('uploadHint');
    return;
  }
  renderFileCommands(rootFiles[0]);
}

function initCtrlCmdFlow(){
  const customers = Array.isArray(DATA.customers) ? DATA.customers : [];
  if (!customerSelect || !projectSelect || !hwFileSelect) {
    toggleCtrlCmdSelectors(false);
    renderRootFallback();
    baseRenderer = () => { renderRootFallback(); };
    return;
  }
  if (customers.length === 0) {
    toggleCtrlCmdSelectors(false);
    renderRootFallback();
    baseRenderer = () => { renderRootFallback(); };
    return;
  }
  toggleCtrlCmdSelectors(true);

  const customerOptions = customers.map(c => ({ value: c.id, label: c.label || c.id }));
  let chosenCustomer = getLocal('ccCustomer');
  if (!chosenCustomer || !customers.some(c => c.id === chosenCustomer)) {
    chosenCustomer = customers[0].id;
  }
  setOptions(customerSelect, customerOptions, chosenCustomer);

  function loadProjectsFor(customerId){
    const customer = findCustomer(customerId) || customers[0];
    const projects = (customer && Array.isArray(customer.projects)) ? customer.projects : [];
    const projectOptions = projects.map(p => ({ value: p.id, label: p.label || p.id }));
    let chosenProject = getLocal('ccProject');
    if (!chosenProject || !projects.some(p => p.id === chosenProject)) {
      chosenProject = projectOptions[0] ? projectOptions[0].value : '';
    }
    setOptions(projectSelect, projectOptions, chosenProject);
    loadFilesFor(customer, chosenProject);
  }

  function loadFilesFor(customer, projectId){
    if (!customer || !projectId) {
      setOptions(hwFileSelect, [], null);
      renderHwCtrl([]);
      setUploadStatus('uploadHint');
      return;
    }
    const project = findProject(customer, projectId);
    const files = (project && Array.isArray(project.files)) ? project.files : [];
    const fileOptions = files.map(f => ({ value: f.id, label: f.label || f.id }));
    let chosenFile = getLocal('ccFile');
    if (!chosenFile || !files.some(f => f.id === chosenFile)) {
      chosenFile = fileOptions[0] ? fileOptions[0].value : '';
    }
    setOptions(hwFileSelect, fileOptions, chosenFile);
    const file = findFile(project, chosenFile);
    renderFileCommands(file);
  }

  customerSelect.addEventListener('change', (e) => {
    const customerId = e.target.value;
    setLocal('ccCustomer', customerId);
    const customer = findCustomer(customerId);
    const projects = (customer && Array.isArray(customer.projects)) ? customer.projects : [];
    const firstProject = projects[0] ? projects[0].id : '';
    setLocal('ccProject', firstProject);
    loadProjectsFor(customerId);
  });

  projectSelect.addEventListener('change', (e) => {
    const projectId = e.target.value;
    setLocal('ccProject', projectId);
    const customer = findCustomer(customerSelect.value);
    loadFilesFor(customer, projectId);
  });

  hwFileSelect.addEventListener('change', (e) => {
    const fileId = e.target.value;
    setLocal('ccFile', fileId);
    const customer = findCustomer(customerSelect.value);
    const project = findProject(customer, projectSelect.value);
    const file = findFile(project, fileId);
    renderFileCommands(file);
  });

  baseRenderer = () => {
    const customer = findCustomer(customerSelect.value);
    const project = findProject(customer, projectSelect.value);
    const file = findFile(project, hwFileSelect.value);
    if (file) {
      renderFileCommands(file);
    } else {
      renderRootFallback();
    }
  };

  loadProjectsFor(chosenCustomer);
}

const savedLang = getLocal('lang') || DEFAULT_LANG;
setUploadStatus('uploadHint');
applyLang(savedLang);
if (langSelect) {
  langSelect.value = savedLang;
  langSelect.addEventListener('change', (e) => {
    applyLang(e.target.value);
  });
}

initCtrlCmdFlow();
applyCommandCollapsedState();
populateSavedUploads(currentSavedId);
renderWithSavedPriority();

function alignHwListToTerminalBottom(){
  const list = document.querySelector('.hw-list');
  const termDiv = document.getElementById('terminal');
  if (!list || !termDiv) return;
  const termRect = termDiv.getBoundingClientRect();
  const listRect = list.getBoundingClientRect();
  const desired = Math.max(120, Math.floor(termRect.bottom - listRect.top));
  list.style.maxHeight = desired + 'px';
}

window.addEventListener('resize', () => { try { alignHwListToTerminalBottom(); } catch {} });
if (themeSelect) themeSelect.addEventListener('change', () => { setTimeout(() => { try { alignHwListToTerminalBottom(); } catch {} }, 50); });
window.addEventListener('load', () => { setTimeout(() => { try { alignHwListToTerminalBottom(); } catch {} }, 50); });
