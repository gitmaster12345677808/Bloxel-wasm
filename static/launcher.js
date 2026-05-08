'use strict';

// These are relative paths
const RELEASE_DIR = '%__RELEASE_UUID__%'; // set by build_www.sh
const DEFAULT_PACKS_DIR = RELEASE_DIR + '/packs';

const rtCSS = `
:root {
    color-scheme: dark;
}

html {
    width: 100%;
    height: 100%;
    background-color: black;
    overflow: hidden;
    overscroll-behavior: none;
}

body {
    font-family: 'Nunito', 'Arial Rounded MT Bold', Arial, sans-serif;
  margin: 0;
    padding: 0;
  background-color: black;
    color: #dbe4f0;
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    overscroll-behavior: none;
}

.emscripten {
    color: #dbe4f0;
  display: block;
}

div.emscripten {
  text-align: center;
  width: 100%;
}

/* the canvas *must not* have any border or padding, or mouse coords will be wrong */
canvas.emscripten {
    border: 0 none;
  background-color: black;
    display: block;
    max-width: 100%;
    max-height: 100%;
    touch-action: none;
}

/* ── Layout ─────────────────────────────────────────── */
body {
    font-family: 'Nunito', 'Arial Rounded MT Bold', Arial, sans-serif;
    margin: 0; padding: 0;
    background-color: black;
    color: #dbe4f0;
    width: 100%; height: 100svh;
    overflow: hidden;
    overscroll-behavior: none;
    display: flex;
    align-items: stretch;
}

canvas.emscripten {
    border: 0 none;
    background-color: black;
    display: block;
    max-width: 100%;
    max-height: 100%;
    touch-action: none;
}

#canvas_container {
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

/* ── Floating menu button (always on right edge of canvas) ── */
#side_menu_btn {
    position: absolute;
    right: max(10px, env(safe-area-inset-right));
    top: 50%;
    transform: translateY(-50%);
    z-index: 100;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: rgba(8, 22, 52, 0.82);
    border: 1px solid rgba(90, 160, 255, 0.3);
    border-top-color: rgba(180, 218, 255, 0.45);
    color: #f4f7fb;
    font-size: 20px;
    font-family: inherit;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    transition: background 0.15s;
}
#side_menu_btn:hover { background: rgba(28, 60, 120, 0.92); }
#side_menu_btn .smb-badge {
    position: absolute;
    top: 4px; right: 4px;
    width: 10px; height: 10px;
    background: #ef4444;
    border-radius: 50%;
    display: none;
}
#side_menu_btn .smb-badge.visible { display: block; }

/* ── Slide-out panel ─────────────────────────────────── */
#side_menu_backdrop {
    display: none;
    position: absolute;
    inset: 0;
    z-index: 150;
    background: rgba(0,0,0,0.4);
}
#side_menu_backdrop.open { display: block; }

#side_menu_panel {
    position: absolute;
    top: 0; bottom: 0;
    right: 0;
    z-index: 200;
    width: min(320px, 92vw);
    background: rgba(8, 16, 38, 0.97);
    border-left: 1px solid rgba(90, 160, 255, 0.2);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    touch-action: pan-y;
    transform: translateX(100%);
    transition: transform 0.26s cubic-bezier(0.32,0.72,0,1);
    padding: max(14px, env(safe-area-inset-top)) 0 max(14px, env(safe-area-inset-bottom));
    box-sizing: border-box;
}
#side_menu_panel.open { transform: translateX(0); }

.sm-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px 14px;
    border-bottom: 1px solid rgba(90,160,255,0.12);
    flex-shrink: 0;
}
.sm-title {
    font-weight: 900;
    font-size: 15px;
    color: #f4f7fb;
    letter-spacing: 0.02em;
}
#sm_close_btn {
    background: none;
    border: none;
    color: #7aacce;
    font-size: 20px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 8px;
    line-height: 1;
    font-family: inherit;
}
#sm_close_btn:hover { background: rgba(255,255,255,0.08); }

.sm-section {
    padding: 12px 16px;
    border-bottom: 1px solid rgba(90,160,255,0.08);
    flex-shrink: 0;
}
.sm-section-title {
    font-size: 10px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: rgba(122,172,206,0.7);
    margin: 0 0 8px;
}

.sm-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
}
.sm-row:last-child { margin-bottom: 0; }
.sm-row label {
    font-size: 12px;
    color: #94afd6;
    flex: 0 0 70px;
}
.sm-row select {
    flex: 1;
    min-height: 32px;
    border-radius: 8px;
    border: 1px solid rgba(90,160,255,0.25);
    background: rgba(8,24,56,0.85);
    color: #f4f7fb;
    padding: 0 8px;
    font-size: 12px;
    font-family: inherit;
    outline: none;
}

.sm-btn {
    width: 100%;
    min-height: 36px;
    border-radius: 10px;
    border: 1px solid rgba(90,160,255,0.25);
    border-top-color: rgba(180,218,255,0.35);
    background: rgba(8,24,56,0.85);
    color: #f4f7fb;
    font-size: 13px;
    font-family: inherit;
    font-weight: 700;
    cursor: pointer;
    margin-bottom: 6px;
    text-align: center;
}
.sm-btn:last-child { margin-bottom: 0; }
.sm-btn:hover { background: rgba(28,60,120,0.85); }
.sm-btn.green { background: rgba(0,100,50,0.75); border-color: rgba(0,176,111,0.45); border-top-color: rgba(0,200,130,0.6); color: #6ee7b7; }
.sm-btn.blue  { background: rgba(18,60,140,0.75); border-color: rgba(28,107,255,0.45); color: #a0c8ff; }
.sm-btn.blue.vr-active { background: #1c6bff; border-color: rgba(120,180,255,0.6); color: #fff; box-shadow: 0 4px 14px rgba(28,107,255,0.5); }

#join_code_banner {
    display: none;
    align-items: center;
    gap: 8px;
    background: rgba(0,40,20,0.88);
    border: 1px solid rgba(0,176,111,0.4);
    border-top-color: rgba(0,200,130,0.55);
    border-radius: 10px;
    padding: 6px 12px;
    font-size: 12px;
    font-family: inherit;
    color: #6ee7b7;
    cursor: pointer;
    user-select: all;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 8px;
}
#join_code_banner.visible { display: flex; }
#join_code_banner .jcb-label { font-size: 10px; color: #34d399; text-transform: uppercase; letter-spacing: 0.06em; flex-shrink: 0; font-weight: 800; }
#join_code_text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1 1 auto; min-width: 0; }
#join_code_banner .jcb-copy-hint { font-size: 10px; color: #34d399; flex-shrink: 0; font-weight: 700; }

/* ── Voice panel in slide-out menu ──────────────────── */
#sm_voice_panel {
    display: none;
    margin-top: 8px;
    border-radius: 10px 10px 0 0;
    overflow: hidden;
    height: 0;
    transition: height 0.25s ease;
    border: 1px solid rgba(90,160,255,0.2);
    border-bottom: none;
}
#sm_voice_panel.open {
    display: block;
    height: 280px;
}
#sm_voice_resize {
    display: none;
    height: 10px;
    background: rgba(90,160,255,0.12);
    border: 1px solid rgba(90,160,255,0.2);
    border-top: none;
    border-radius: 0 0 10px 10px;
    cursor: ns-resize;
    text-align: center;
    line-height: 10px;
    font-size: 10px;
    color: rgba(255,255,255,0.3);
    user-select: none;
    flex-shrink: 0;
}
#sm_voice_resize::after { content: '\\2015\\2015\\2015'; letter-spacing: 2px; }
#sm_voice_panel.open + #sm_voice_resize { display: block; }

/* ── Friends list in slide-out ───────────────────────── */
#sm_friends_section { flex-shrink: 0; padding: 12px 16px; }
.sm-friends-list { display: flex; flex-direction: column; gap: 4px; margin-top: 6px; }
.sm-friend-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border-radius: 10px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(90,160,255,0.08);
}
.sm-friend-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.2); flex-shrink: 0; }
.sm-friend-dot.online { background: #22c55e; box-shadow: 0 0 5px #22c55e88; }
.sm-friend-name { flex: 1; font-size: 13px; font-weight: 700; color: #dbe4f0; }
.sm-friend-status { font-size: 11px; color: #7aacce; }
.sm-friend-btns { display: flex; gap: 4px; flex-shrink: 0; }
.sm-friend-btns button {
    min-height: 26px;
    padding: 0 8px;
    font-size: 11px;
    font-weight: 700;
    border-radius: 6px;
    cursor: pointer;
    font-family: inherit;
    border: 1px solid rgba(90,160,255,0.22);
    background: rgba(8,24,56,0.85);
    color: #c0d8ff;
}
.sm-friend-btns button.invite-btn { background: rgba(0,80,40,0.75); border-color: rgba(0,176,111,0.35); color: #6ee7b7; }
.sm-friends-empty { font-size: 12px; color: #7aacce; font-style: italic; margin-top: 6px; }

/* ── In-game chat overlay ────────────────────────────── */
#chat_overlay {
    display: none;
    position: absolute;
    bottom: 0; left: 0; right: 0;
    z-index: 300;
    padding: 8px 12px max(10px, env(safe-area-inset-bottom));
    background: rgba(8, 22, 52, 0.92);
    border-top: 1px solid rgba(90,160,255,0.2);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    align-items: center;
    gap: 8px;
}
#chat_overlay.visible { display: flex; }

#chat_input {
    flex: 1 1 auto;
    min-height: 38px;
    border: 1.5px solid rgba(90,160,255,0.28);
    border-radius: 10px;
    background: rgba(8,24,56,0.9);
    color: #f4f7fb;
    padding: 0 12px;
    font-size: 15px;
    font-family: inherit;
    outline: none;
    box-sizing: border-box;
}
#chat_send_btn, #chat_cancel_btn {
    min-height: 38px;
    padding: 0 14px;
    border: 1px solid rgba(90,160,255,0.25);
    border-top-color: rgba(180,218,255,0.38);
    border-radius: 10px;
    background: rgba(8,24,56,0.85);
    color: #f4f7fb;
    font-size: 14px;
    font-family: inherit;
    font-weight: 700;
    cursor: pointer;
    flex-shrink: 0;
}
#chat_send_btn { background: rgba(0,100,50,0.75); border-color: rgba(0,176,111,0.45); border-top-color: rgba(0,200,130,0.6); color: #6ee7b7; }
#chat_mode_btn {
    min-height: 38px;
    padding: 0 10px;
    border: 1px solid rgba(90,160,255,0.25);
    border-radius: 10px;
    background: rgba(14,28,60,0.82);
    color: #94afd6;
    font-size: 13px;
    font-family: inherit;
    font-weight: 700;
    cursor: pointer;
    flex-shrink: 0;
    white-space: nowrap;
}
#chat_mode_btn.replace-mode { background: rgba(18,60,140,0.75); border-color: rgba(28,107,255,0.45); color: #a0c8ff; }

/* ── Progress bar ────────────────────────────────────── */
#progressbar_div {
    position: absolute;
    bottom: 60px;
    left: 50%;
    transform: translateX(-50%);
    width: min(460px, 90%);
    z-index: 50;
}
#progressbar { width: 100%; height: 12px; }


/* ── Console ─────────────────────────────────────────── */
.console {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    z-index: 250;
    max-height: 200px;
    border: none;
    border-top: 1px solid rgba(90,160,255,0.2);
    padding: 0;
    display: block;
    background-color: rgba(6,14,28,0.96);
    color: #c0d8f0;
    font-family: 'Lucida Console', Monaco, monospace;
    outline: none;
    box-sizing: border-box;
    resize: none;
    width: 100%;
}

/* ── File Manager overlay ────────────────────────────── */
#filemgr_overlay {
    display: none;
    position: absolute;
    inset: 0;
    z-index: 500;
    background: rgba(4, 10, 24, 0.97);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    flex-direction: column;
    font-family: 'Lucida Console', Monaco, monospace;
}
#filemgr_overlay.open { display: flex; }
#filemgr_topbar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    background: rgba(8, 20, 48, 0.98);
    border-bottom: 1px solid rgba(90,160,255,0.18);
    flex-shrink: 0;
    flex-wrap: wrap;
}
#filemgr_title {
    font-size: 13px;
    font-weight: 900;
    color: #7aacce;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    flex-shrink: 0;
    font-family: inherit;
}
#filemgr_tabs {
    display: flex;
    gap: 4px;
    flex-shrink: 0;
}
.fmgr-tab {
    min-height: 26px;
    padding: 0 12px;
    border-radius: 8px;
    border: 1px solid rgba(90,160,255,0.22);
    background: rgba(8,24,56,0.85);
    color: #7aacce;
    font-size: 11px;
    font-family: inherit;
    font-weight: 700;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
.fmgr-tab:hover { background: rgba(28,60,120,0.85); }
.fmgr-tab.active { background: rgba(20,60,140,0.95); border-color: rgba(90,160,255,0.55); color: #a0c8ff; }
#filemgr_breadcrumb {
    flex: 1 1 auto;
    font-size: 12px;
    color: #94afd6;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
}
#filemgr_breadcrumb span {
    cursor: pointer;
    color: #5aaeff;
}
#filemgr_breadcrumb span:hover { text-decoration: underline; }
#filemgr_breadcrumb .sep { color: rgba(255,255,255,0.25); cursor: default; }
#filemgr_close_btn {
    background: none;
    border: 1px solid rgba(90,160,255,0.2);
    border-radius: 8px;
    color: #7aacce;
    font-size: 18px;
    cursor: pointer;
    padding: 2px 10px;
    font-family: inherit;
    flex-shrink: 0;
    line-height: 1.4;
}
#filemgr_close_btn:hover { background: rgba(255,255,255,0.08); }
#filemgr_toolbar {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    background: rgba(6,16,38,0.95);
    border-bottom: 1px solid rgba(90,160,255,0.1);
    flex-shrink: 0;
}
#filemgr_refresh_btn, #filemgr_up_btn {
    min-height: 28px;
    padding: 0 12px;
    border-radius: 8px;
    border: 1px solid rgba(90,160,255,0.22);
    background: rgba(8,24,56,0.85);
    color: #c0d8ff;
    font-size: 12px;
    font-family: inherit;
    font-weight: 700;
    cursor: pointer;
}
#filemgr_refresh_btn:hover, #filemgr_up_btn:hover { background: rgba(28,60,120,0.85); }
#filemgr_path_label {
    font-size: 11px;
    color: rgba(122,172,206,0.6);
    margin-left: auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 220px;
    font-family: inherit;
}
#filemgr_list {
    flex: 1 1 auto;
    overflow-y: auto;
    padding: 6px 0;
    -webkit-overflow-scrolling: touch;
}
.fmgr-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 7px 14px;
    border-bottom: 1px solid rgba(90,160,255,0.05);
    cursor: pointer;
    user-select: none;
}
.fmgr-row:hover { background: rgba(90,160,255,0.07); }
.fmgr-row.dir { color: #5aaeff; }
.fmgr-row.file { color: #c0d8ff; }
.fmgr-icon { font-size: 15px; flex-shrink: 0; width: 20px; text-align: center; }
.fmgr-name { flex: 1; font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: inherit; }
.fmgr-size { font-size: 11px; color: rgba(122,172,206,0.55); flex-shrink: 0; text-align: right; min-width: 52px; }
.fmgr-actions { display: flex; gap: 4px; flex-shrink: 0; }
.fmgr-btn {
    min-height: 24px;
    padding: 0 8px;
    border-radius: 6px;
    border: 1px solid rgba(90,160,255,0.18);
    background: rgba(8,24,56,0.8);
    color: #7aacce;
    font-size: 11px;
    font-family: inherit;
    font-weight: 700;
    cursor: pointer;
    line-height: 1;
}
.fmgr-btn:hover { background: rgba(28,60,120,0.8); }
.fmgr-btn.del { border-color: rgba(255,80,80,0.25); color: #f87171; }
.fmgr-btn.del:hover { background: rgba(100,20,20,0.7); }
#filemgr_empty {
    padding: 24px;
    text-align: center;
    color: rgba(122,172,206,0.45);
    font-size: 12px;
    font-family: inherit;
    font-style: italic;
}
#filemgr_statusbar {
    padding: 6px 14px;
    font-size: 11px;
    color: rgba(122,172,206,0.5);
    border-top: 1px solid rgba(90,160,255,0.1);
    background: rgba(4,10,24,0.9);
    flex-shrink: 0;
    font-family: inherit;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
`;

const rtHTML = `
  <div class="emscripten" id="canvas_container">

    <!-- Floating menu button -->
    <button id="side_menu_btn" onclick="toggleSideMenu()" title="Menu">
      &#9776;
      <span class="smb-badge" id="smb_badge" hidden></span>
    </button>


    <!-- Backdrop -->
    <div id="side_menu_backdrop" onclick="closeSideMenu()"></div>

    <!-- Slide-out panel -->
    <div id="side_menu_panel">
      <div class="sm-header">
        <span class="sm-title">&#9776;&nbsp; Menu</span>
        <button id="sm_close_btn" onclick="closeSideMenu()">&#x2715;</button>
      </div>

      <!-- Join code -->
      <div class="sm-section">
        <div id="join_code_banner" onclick="copyJoinCode()">
          <span class="jcb-label">Join&#160;Link:</span>
          <span id="join_code_text"></span>
          <span class="jcb-copy-hint">&#x2398;&#160;Copy</span>
        </div>
        <button class="sm-btn green" onclick="openChatOverlay()">&#x1F4AC; Game Chat</button>
        <button class="sm-btn" id="sm_voice_btn" onclick="openVoiceWindow()">&#x1F3A4; Voice Chat</button>
        <div id="sm_voice_panel"></div>
        <div id="sm_voice_resize" onmousedown="_voicePanelResizeStart(event)" ontouchstart="_voicePanelResizeStart(event)"></div>
      </div>

      <!-- Display -->
      <div class="sm-section">
        <p class="sm-section-title">Display</p>
        <div class="sm-row">
          <label>Resolution</label>
          <select id="resolution" onchange="fixGeometry()">
            <option value="high">High Res</option>
            <option value="medium">Medium</option>
            <option value="low">Low Res</option>
          </select>
        </div>
        <div class="sm-row">
          <label>Aspect</label>
          <select id="aspectRatio" onchange="fixGeometry()">
            <option value="any">Fit Screen</option>
            <option value="4:3">4:3</option>
            <option value="16:9">16:9</option>
            <option value="5:4">5:4</option>
            <option value="21:9">21:9</option>
            <option value="32:9">32:9</option>
            <option value="1:1">1:1</option>
          </select>
        </div>
      </div>

      <!-- Tools -->
      <div class="sm-section">
        <p class="sm-section-title">Tools</p>
        <button class="sm-btn" id="console_button" onclick="consoleToggle()">Show Console</button>
        <button class="sm-btn" id="file_mgr_btn" style="display:none" onclick="openFileMgr()">&#x1F4C1; File Manager</button>
        <button id="vr_toggle_btn" class="sm-btn blue" onclick="window.vrManager && window.vrManager.toggleVR()">VR Mode</button>
      </div>

      <!-- Friends -->
      <div id="sm_friends_section" class="sm-section" style="flex:1;display:flex;flex-direction:column;">
        <p class="sm-section-title">Friends Online</p>
        <div class="sm-friends-list" id="sm_friends_list">
          <span class="sm-friends-empty">Loading&#8230;</span>
        </div>
      </div>
    </div>

    <!-- In-game chat overlay -->
    <div id="chat_overlay">
      <button id="chat_mode_btn" onclick="toggleChatMode()" title="Switch between Chat mode and Replace mode">Chat</button>
      <input id="chat_input" type="text" placeholder="Chat message..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
      <button id="chat_send_btn" onclick="sendChatMessage()">Send</button>
      <button id="chat_cancel_btn" onclick="closeChatOverlay()">&#x2715;</button>
    </div>

    <div id="progressbar_div" style="display: none">
      <progress id="progressbar" value="0" max="100">0%</progress>
    </div>

    <textarea id="console_output" class="console" rows="8" style="display: none;"></textarea>

    <!-- File Manager overlay -->
    <div id="filemgr_overlay">
      <div id="filemgr_topbar">
        <span id="filemgr_title">&#x1F4C1; File Manager</span>
        <div id="filemgr_tabs">
          <button class="fmgr-tab active" id="fmgr_tab_opfs" onclick="fileMgrSetMode('opfs')">OPFS</button>
          <button class="fmgr-tab" id="fmgr_tab_mem" onclick="fileMgrSetMode('mem')">Memory FS</button>
        </div>
        <div id="filemgr_breadcrumb"></div>
        <button id="filemgr_close_btn" onclick="closeFileMgr()">&#x2715;</button>
      </div>
      <div id="filemgr_toolbar">
        <button id="filemgr_up_btn" onclick="fileMgrUp()">&#x2191; Up</button>
        <button id="filemgr_refresh_btn" onclick="fileMgrRefresh()">&#x21BB; Refresh</button>
        <span id="filemgr_path_label"></span>
      </div>
      <div id="filemgr_list"></div>
      <div id="filemgr_statusbar">Ready</div>
    </div>

  </div>
`;

// The canvas needs to be created before the wasm module is loaded.
// It is not attached to the document until activateBody()
const mtCanvas = document.createElement('canvas');
mtCanvas.className = "emscripten";
mtCanvas.id = "canvas";
mtCanvas.oncontextmenu = (event) => {
  event.preventDefault();
};
mtCanvas.tabIndex = "-1";
mtCanvas.width = 1024;
mtCanvas.height = 600;

// Patch getContext so Emscripten creates a WebXR-compatible context from the start.
// This must happen before the WASM module calls getContext('webgl2').
(function() {
    const _origGetContext = mtCanvas.getContext.bind(mtCanvas);
    mtCanvas.getContext = function(type, attrs) {
        if (type === 'webgl2' || type === 'webgl') {
            attrs = Object.assign({}, attrs || {}, { xrCompatible: true });
        }
        return _origGetContext(type, attrs);
    };
}());

const MOBILE_LAYOUT_QUERY = '(pointer: coarse), (max-width: 900px)';
const MOBILE_NATIVE_PIXEL_LIMIT = 1280 * 720;
const DESKTOP_NATIVE_PIXEL_LIMIT = 2560 * 1440;
const MOBILE_MAX_DIMENSION = 1600;
const DESKTOP_MAX_DIMENSION = 2560;
const MIN_NATIVE_CANVAS_WIDTH = 200;
const MIN_NATIVE_CANVAS_HEIGHT = 120;

var consoleButton;
var consoleOutput;
var progressBar;
var progressBarDiv;
var visorToggleButton;
var overlayVisorButton;
var visorHidden = false;
var chatOverlay;
var chatInput;
var chatModeBtn;
var chatReplaceMode = false;
var joinCodeBanner;
var joinCodeText;
var joinCodeUrl = null;
var sideMenuOpen = false;

function toggleSideMenu() {
    sideMenuOpen ? closeSideMenu() : openSideMenu();
}

function openSideMenu() {
    sideMenuOpen = true;
    const panel    = document.getElementById('side_menu_panel');
    const backdrop = document.getElementById('side_menu_backdrop');
    if (panel)    panel.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    renderSideMenuFriends();
}

function closeSideMenu() {
    sideMenuOpen = false;
    const panel    = document.getElementById('side_menu_panel');
    const backdrop = document.getElementById('side_menu_backdrop');
    if (panel)    panel.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
}

function renderSideMenuFriends() {
    const list = document.getElementById('sm_friends_list');
    if (!list) return;
    // Access the friends list from the index.html scope (same window)
    const friends = (typeof _friendsList !== 'undefined') ? _friendsList : [];
    const online  = friends.filter(f => f.online);
    const offline = friends.filter(f => !f.online);
    const all     = [...online, ...offline];
    if (all.length === 0) {
        list.innerHTML = '<span class="sm-friends-empty">No friends yet.</span>';
        return;
    }
    list.innerHTML = '';
    all.forEach(f => {
        const div = document.createElement('div');
        div.className = 'sm-friend-row';
        const canInvite = !!(joinCodeUrl || window._currentDirectServer);
        div.innerHTML = `
          <span class="sm-friend-dot ${f.online ? 'online' : ''}"></span>
          <div style="flex:1;min-width:0;">
            <div class="sm-friend-name">${_smEsc(f.username)}</div>
            <div class="sm-friend-status">${f.online ? (f.server_address ? 'Playing' : 'Online') : 'Offline'}</div>
          </div>
          <div class="sm-friend-btns">
            ${canInvite ? `<button class="invite-btn" onclick="smInviteFriend('${_smEsc(f.username)}')">Invite</button>` : ''}
            <button onclick="smChatFriend('${_smEsc(f.username)}')">Chat</button>
          </div>`;
        list.appendChild(div);
    });
}

function _smEsc(s) {
    return String(s).replace(/'/g, "\\'").replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

async function smInviteFriend(username) {
    const directServer = window._currentDirectServer;
    const hasInvite = joinCodeUrl || directServer;
    if (!hasInvite || typeof friendsRequest === 'undefined') return;
    const u = (typeof etherdeckAuth !== 'undefined') ? etherdeckAuth.getUsername() : null;
    if (!u) return;
    let invitePayload;
    if (joinCodeUrl) {
        // P2P hosted game — store the full join URL
        invitePayload = { from_username: u, to_username: username, server_address: joinCodeUrl, server_port: 0 };
    } else {
        // Discover server — store the real address + port
        invitePayload = { from_username: u, to_username: username, server_address: directServer.address, server_port: directServer.port };
    }
    await friendsRequest('send_invite', invitePayload);
    // Brief feedback
    const list = document.getElementById('sm_friends_list');
    if (list) {
        const note = document.createElement('div');
        note.style.cssText = 'font-size:11px;color:#22c55e;padding:4px 0;';
        note.textContent = `Invite sent to ${username}!`;
        list.prepend(note);
        setTimeout(() => note.remove(), 2500);
    }
}

function smChatFriend(username) {
    closeSideMenu();
    // Open the friend chat using the launcher page's function (same window)
    if (typeof openFriendChat === 'function') openFriendChat(username);
}

function setVisorJoinCode(url) {
    joinCodeUrl = url;
    if (joinCodeBanner && joinCodeText) {
        joinCodeText.textContent = url;
        joinCodeBanner.classList.add('visible');
    }
    // Show the badge on the floating menu button so the player knows they're hosting
    const badge = document.getElementById('smb_badge');
    if (badge) badge.hidden = !url;
}

function saveWorldNow() {
    saveWorldNowOPFS();
}

function copyJoinCode() {
    if (!joinCodeUrl) return;
    navigator.clipboard.writeText(joinCodeUrl).then(() => {
        const hint = joinCodeBanner ? joinCodeBanner.querySelector('.jcb-copy-hint') : null;
        if (hint) {
            hint.textContent = 'Copied!';
            setTimeout(() => { hint.textContent = 'Tap to copy'; }, 1500);
        }
    }).catch(() => {});
}

function toggleChatMode() {
    chatReplaceMode = !chatReplaceMode;
    if (chatModeBtn) {
        chatModeBtn.textContent = chatReplaceMode ? 'Replace' : 'Chat';
        chatModeBtn.classList.toggle('replace-mode', chatReplaceMode);
    }
    if (chatInput) {
        chatInput.placeholder = chatReplaceMode ? 'Replace textbox with...' : 'Chat message...';
        chatInput.focus();
    }
}

function openChatOverlay() {
    if (!chatOverlay || !chatInput) return;
    chatOverlay.classList.add('visible');
    chatInput.value = '';
    chatInput.focus();
}

function closeChatOverlay() {
    if (!chatOverlay) return;
    chatOverlay.classList.remove('visible');
    mtCanvas.focus();
}

let _voicePlayerName = 'Player';
let _voiceRoom = 'bloxelvoice';

// ── Voice-room helper ──────────────────────────────────────────────────────
function _sanitizeVoiceRoom(str) {
    // Jitsi room names: lowercase alphanumeric + hyphens, max 64 chars
    return str.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 64) || 'bloxelvoice';
}

function _getVoiceRoom() {
    return _voiceRoom;
}

function _autoJoinVoice() {
    const room = _getVoiceRoom();
    const name = _voicePlayerName || 'Player';
    // Create a hidden background iframe so mic is live immediately without needing to open the panel
    if (document.getElementById('voice_bg_iframe')) return; // already joined
    const params = 'config.prejoinPageEnabled=false' +
        '&config.prejoinConfig.enabled=false' +
        '&config.startWithVideoMuted=true' +
        '&config.startWithAudioMuted=false' +
        '&config.disableDeepLinking=true' +
        '&config.hideWatermark=true' +
        '&config.toolbarButtons=' + encodeURIComponent(JSON.stringify(['microphone', 'hangup'])) +
        '&config.displayName=' + encodeURIComponent(JSON.stringify(name)) +
        '&userInfo.displayName=' + encodeURIComponent(JSON.stringify(name));
    const iframe = document.createElement('iframe');
    iframe.id = 'voice_bg_iframe';
    iframe.allow = 'microphone; camera; display-capture; fullscreen; speaker-selection';
    iframe.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;';
    iframe.src = _VC_ORIGIN + '/' + room + '#' + params;
    document.body.appendChild(iframe);
    console.log('[voice] auto-joined room:', room);
}

function openVoiceWindow() {
    const panel = document.getElementById('sm_voice_panel');
    const btn   = document.getElementById('sm_voice_btn');
    if (!panel) return;
    const isOpen = panel.classList.contains('open');
    if (isOpen) {
        panel.classList.remove('open');
        if (btn) btn.textContent = '\uD83C\uDFA4 Voice Chat';
    } else {
        if (!panel.querySelector('iframe')) {
            // If already auto-joined in background, move that iframe into the panel
            const bg = document.getElementById('voice_bg_iframe');
            if (bg) {
                bg.style.cssText = 'width:100%;height:100%;border:none;';
                bg.removeAttribute('id');
                panel.appendChild(bg);
            } else {
                const room   = _getVoiceRoom();
                const name   = _voicePlayerName || 'Player';
                const params = 'config.prejoinPageEnabled=false' +
                    '&config.prejoinConfig.enabled=false' +
                    '&config.startWithVideoMuted=true' +
                    '&config.startWithAudioMuted=false' +
                    '&config.disableDeepLinking=true' +
                    '&config.hideWatermark=true' +
                    '&config.toolbarButtons=' + encodeURIComponent(JSON.stringify(['microphone', 'hangup'])) +
                    '&config.displayName=' + encodeURIComponent(JSON.stringify(name)) +
                    '&userInfo.displayName=' + encodeURIComponent(JSON.stringify(name));
                const iframe = document.createElement('iframe');
                iframe.allow = 'microphone; camera; display-capture; fullscreen; speaker-selection';
                iframe.style.cssText = 'width:100%;height:100%;border:none;';
                iframe.src = _VC_ORIGIN + '/' + room + '#' + params;
                panel.appendChild(iframe);
            }
        }
        panel.classList.add('open');
        if (btn) btn.textContent = '\uD83C\uDFA4 Voice Chat  \u25B2';
        openSideMenu();
    }
}

function _voicePanelResizeStart(e) {
    const panel = document.getElementById('sm_voice_panel');
    if (!panel) return;
    e.preventDefault();
    const startY  = e.touches ? e.touches[0].clientY : e.clientY;
    const startH  = panel.offsetHeight;
    panel.style.transition = 'none';
    function onMove(ev) {
        const y = ev.touches ? ev.touches[0].clientY : ev.clientY;
        const newH = Math.max(120, startH + (y - startY));
        panel.style.height = newH + 'px';
    }
    function onUp() {
        panel.style.transition = '';
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup',   onUp);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend',  onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend',  onUp);
}

// ── VoiceChat — Jitsi iframe (embedded in slide-out menu) ────────────────
const _VC_ORIGIN = 'https://servers.etherdeck.org:5384';



function sendChatMessage() {
    const text = chatInput ? chatInput.value : '';
    closeChatOverlay();
    if (!text) return;

    function fireKey(type, key, code, keyCode) {
        mtCanvas.dispatchEvent(new KeyboardEvent(type, {
            bubbles: true, cancelable: true,
            key, code, keyCode, which: keyCode, charCode: type === 'keypress' ? keyCode : 0
        }));
    }

    function typeText(str, callback) {
        for (const ch of str) {
            const code = ch.charCodeAt(0);
            fireKey('keydown', ch, '', code);
            fireKey('keypress', ch, '', code);
            fireKey('keyup', ch, '', code);
        }
        setTimeout(callback, 30);
    }

    if (chatReplaceMode) {
        // Select all existing text in the focused game textbox, then replace it
        mtCanvas.dispatchEvent(new KeyboardEvent('keydown', {
            bubbles: true, cancelable: true,
            key: 'a', code: 'KeyA', keyCode: 65, which: 65, ctrlKey: true
        }));
        mtCanvas.dispatchEvent(new KeyboardEvent('keyup', {
            bubbles: true, cancelable: true,
            key: 'a', code: 'KeyA', keyCode: 65, which: 65, ctrlKey: true
        }));
        setTimeout(() => {
            typeText(text, () => {
                fireKey('keydown', 'Enter', 'Enter', 13);
                fireKey('keyup', 'Enter', 'Enter', 13);
            });
        }, 60);
    } else {
        // Open in-game chat with T, then type
        fireKey('keydown', 't', 'KeyT', 84);
        fireKey('keyup', 't', 'KeyT', 84);
        setTimeout(() => {
            typeText(text, () => {
                fireKey('keydown', 'Enter', 'Enter', 13);
                fireKey('keyup', 'Enter', 'Enter', 13);
            });
        }, 120);
    }
}

function setVisorMode(hidden) {
    visorHidden = hidden;
    // In the new layout there is no top bar — visor concept maps to the side menu.
    // Just re-run geometry when called.
    fixGeometry(true);
}

function toggleVisorMode() {
    // In the new layout, toggling the "visor" opens/closes the slide-out side menu.
    toggleSideMenu();
}

function isMobileLayout() {
    return window.matchMedia(MOBILE_LAYOUT_QUERY).matches;
}

function getViewportSize() {
    const viewport = window.visualViewport;
    const width = viewport ? viewport.width : (document.documentElement.clientWidth || window.innerWidth || 0);
    const height = viewport ? viewport.height : (window.innerHeight || document.documentElement.clientHeight || 0);
    return {
        width: Math.max(1, Math.floor(width)),
        height: Math.max(1, Math.floor(height)),
    };
}

function getResolutionScale(name) {
    if (name == 'high') return 1.0;
    if (name == 'medium') return 1.0 / 1.5;
    return 0.5;
}

function clampNativeCanvasSize(width, height) {
    let nextWidth = Math.max(MIN_NATIVE_CANVAS_WIDTH, Math.floor(width));
    let nextHeight = Math.max(MIN_NATIVE_CANVAS_HEIGHT, Math.floor(height));
    const maxPixels = isMobileLayout() ? MOBILE_NATIVE_PIXEL_LIMIT : DESKTOP_NATIVE_PIXEL_LIMIT;
    const maxDimension = isMobileLayout() ? MOBILE_MAX_DIMENSION : DESKTOP_MAX_DIMENSION;

    const pixelCount = nextWidth * nextHeight;
    if (pixelCount > maxPixels) {
        const scale = Math.sqrt(maxPixels / pixelCount);
        nextWidth = Math.max(MIN_NATIVE_CANVAS_WIDTH, Math.floor(nextWidth * scale));
        nextHeight = Math.max(MIN_NATIVE_CANVAS_HEIGHT, Math.floor(nextHeight * scale));
    }

    const dimensionScale = Math.min(maxDimension / nextWidth, maxDimension / nextHeight, 1);
    if (dimensionScale < 1) {
        nextWidth = Math.max(MIN_NATIVE_CANVAS_WIDTH, Math.floor(nextWidth * dimensionScale));
        nextHeight = Math.max(MIN_NATIVE_CANVAS_HEIGHT, Math.floor(nextHeight * dimensionScale));
    }

    return [nextWidth, nextHeight];
}

function applyLayoutDefaults() {
    const resolutionSelect  = document.getElementById('resolution');
    const aspectRatioSelect = document.getElementById('aspectRatio');
    if (!resolutionSelect || !aspectRatioSelect) return;

    if (isMobileLayout()) {
        resolutionSelect.value  = 'high';
        aspectRatioSelect.value = 'any';
    }
}

function nudgeMobileAspectRatioAfterRotation() {
    if (!isMobileLayout()) {
        return;
    }

    const aspectRatioSelect = document.getElementById('aspectRatio');
    if (!aspectRatioSelect) {
        return;
    }

    aspectRatioSelect.value = '4:3';
    fixGeometry(true);
    setTimeout(() => {
        aspectRatioSelect.value = 'any';
        fixGeometry(true);
    }, 80);
}

function activateBody() {
    const extraCSS = document.createElement("style");
    extraCSS.innerText = rtCSS;
    document.head.appendChild(extraCSS);

    // Replace the entire body
    document.body.style = '';
    document.body.className = '';
    document.body.innerHTML = '';

    const mtContainer = document.createElement('div');
    mtContainer.innerHTML = rtHTML;
    document.body.appendChild(mtContainer);

    const canvasContainer = document.getElementById('canvas_container');
    canvasContainer.appendChild(mtCanvas);

    applyLayoutDefaults();
    setupResizeHandlers();

    consoleButton = document.getElementById('console_button');
    consoleOutput = document.getElementById('console_output');
    chatOverlay = document.getElementById('chat_overlay');
    chatInput = document.getElementById('chat_input');
    chatModeBtn = document.getElementById('chat_mode_btn');
    joinCodeBanner = document.getElementById('join_code_banner');
    joinCodeText = document.getElementById('join_code_text');
    // Initialise WebXR VR manager for Meta Quest support
    window.vrManager = new WebXRManager();
    // Restore join code if already set before activateBody was called
    if (joinCodeUrl && joinCodeBanner && joinCodeText) {
        joinCodeText.textContent = joinCodeUrl;
        joinCodeBanner.classList.add('visible');
    }
    if (chatInput) {
        // Register on document in CAPTURE phase here, before Emscripten registers its own
        // listeners in emloop_ready(). Because we registered first, stopImmediatePropagation
        // blocks Emscripten's listeners while still allowing the browser's default action
        // (e.g. backspace deleting a character in the input).
        const blockForGame = (e) => {
            if (document.activeElement === chatInput) {
                e.stopImmediatePropagation();
            }
        };
        document.addEventListener('keydown', blockForGame, true);
        document.addEventListener('keyup', blockForGame, true);
        document.addEventListener('keypress', blockForGame, true);

        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); sendChatMessage(); }
            if (e.key === 'Escape') { e.preventDefault(); closeChatOverlay(); }
            if (e.key === 'Backspace' && chatInput.value === '') {
                // Input is empty — forward backspace to game
                mtCanvas.dispatchEvent(new KeyboardEvent('keydown', {
                    bubbles: false, cancelable: true,
                    key: 'Backspace', code: 'Backspace', keyCode: 8, which: 8
                }));
                mtCanvas.dispatchEvent(new KeyboardEvent('keyup', {
                    bubbles: false, cancelable: true,
                    key: 'Backspace', code: 'Backspace', keyCode: 8, which: 8
                }));
            }
        });
    }
    // Prevent the page from scrolling at all — pointer-lock mouse deltas
    // can cause the document to drift when pitch hits its limits.
    window.addEventListener('scroll', () => { window.scrollTo(0, 0); }, { passive: true });

    // Triggers the first and all future updates
    consoleUpdate();

    setVisorMode(false);

    progressBar = document.getElementById('progressbar');
    progressBarDiv = document.getElementById('progressbar_div');
    updateProgressBar(0, 0);

    _initVideoScreen();
}

var PB_bytes_downloaded = 0;
var PB_bytes_needed = 0;
function updateProgressBar(doneBytes, neededBytes) {
    PB_bytes_downloaded += doneBytes;
    PB_bytes_needed += neededBytes;
    if (progressBar) {
        progressBarDiv.style.display = (PB_bytes_downloaded == PB_bytes_needed) ? "none" : "block";
        const pct = PB_bytes_needed ? Math.round(100 * PB_bytes_downloaded / PB_bytes_needed) : 0;
        progressBar.value = `${pct}`;
        progressBar.innerText = `${pct}%`;
    }
}

// Singleton
var mtLauncher = null;

class LaunchScheduler {
    constructor() {
        this.conditions = new Map();
        window.requestAnimationFrame(this.invokeCallbacks.bind(this));
    }

    isSet(name) {
        return this.conditions.get(name)[0];
    }

    addCondition(name, startCallback = null, deps = []) {
        this.conditions.set(name, [false, new Set(), startCallback]);
        for (const depname of deps) {
            this.addDep(name, depname);
        }
    }

    addDep(name, depname) {
        if (!this.isSet(depname)) {
            this.conditions.get(name)[1].add(depname);
        }
    }

    setCondition(name) {
        if (this.isSet(name)) {
            throw new Error('Scheduler condition set twice');
        }
        this.conditions.get(name)[0] = true;
        this.conditions.forEach(v => {
            v[1].delete(name);
        });
        window.requestAnimationFrame(this.invokeCallbacks.bind(this));
    }

    clearCondition(name, newCallback = null, deps = []) {
        if (!this.isSet(name)) {
            throw new Error('clearCondition called on unset condition');
        }
        const arr = this.conditions.get(name);
        arr[0] = false;
        arr[1] = new Set(deps);
        arr[2] = newCallback;
    }

    invokeCallbacks() {
        const callbacks = [];
        this.conditions.forEach(v => {
            if (!v[0] && v[1].size == 0 && v[2] !== null) {
                callbacks.push(v[2]);
                v[2] = null;
            }
        });
        callbacks.forEach(cb => cb());
    }
}
const mtScheduler = new LaunchScheduler();

function loadWasm() {
    // Start loading the wasm module
    // The module will call emloop_ready when it is loaded
    // and waiting for main() arguments.
    const mtModuleScript = document.createElement("script");
    mtModuleScript.type = "text/javascript";
    mtModuleScript.src = RELEASE_DIR + "/luanti.js";
    mtModuleScript.async = true;
    document.head.appendChild(mtModuleScript);
}

function callMain() {
    const fullargs = [ './minetest', ...mtLauncher.args.toArray() ];
    const [argc, argv] = makeArgv(fullargs);
    window._vrExitHandled = false; // reset so the next exit can be caught
    if (_mainCalledOnce) {
        emloop_reenter_blessed(argc, argv);
    } else {
        _mainCalledOnce = true;
        emloop_invoke_main(argc, argv);
    }
    mtScheduler.setCondition("main_called");
    if (window._vrWebsiteLaunching) {
        window._vrWebsiteLaunching = false;

        // Show the hint on document.body IMMEDIATELY (synchronously) so it is
        // already visible in the 2D browser panel the moment the user presses
        // the Quest home button.  The panel shows the live page content, so a
        // fixed full-screen overlay on body is what the user will see.
        const hint = document.createElement('div');
        hint.id = '_vr_launch_hint';
        hint.style.cssText = [
            'position:fixed', 'inset:0', 'z-index:999999',
            'display:flex', 'flex-direction:column',
            'align-items:center', 'justify-content:center',
            'background:rgba(0,0,0,0.82)', 'color:#fff',
            'font-family:sans-serif', 'text-align:center',
            'padding:48px', 'pointer-events:none',
        ].join(';');
        hint.innerHTML =
            '<div style="font-size:56px;margin-bottom:18px">🏠</div>' +
            '<div style="font-size:32px;font-weight:bold;margin-bottom:14px">' +
                'Press the <u>Home&nbsp;button</u>' +
            '</div>' +
            '<div style="font-size:22px;line-height:1.5;opacity:0.9">' +
                'Look at this browser window&nbsp;—' +
                '<br>then close the menu to start the game.' +
            '</div>';
        document.body.appendChild(hint);

        (async () => {
            try {
                if (window.vrManager) await window.vrManager.enterVR();
            } catch(e) {
                console.error('[callMain] enterVR failed:', e);
            }
            if (window.vrManager) window.vrManager._gameLoopRunningViaXR = false;

            // Poll until the game loop is live, then remove the hint.
            // Each poll also tries Module.resumeMainLoop() so the hint goes
            // away automatically if the environment supports it without needing
            // the home-menu trick.
            const pollRemove = () => {
                const vr = window.vrManager;
                if (!vr?._inVR || vr._gameLoopRunningViaXR) {
                    document.getElementById('_vr_launch_hint')?.remove();
                    return;
                }
                if (typeof window.Module?.resumeMainLoop === 'function') {
                    try { window.Module.resumeMainLoop(); } catch(_e) {}
                }
                setTimeout(pollRemove, 800);
            };
            setTimeout(pollRemove, 1500);
        })();
    } else {
        // Pausing and unpausing here gives the browser time to redraw the DOM
        // before Minetest freezes the main thread generating the world.
        emloop_request_animation_frame();
    }
}

var emloop_pause;
var emloop_unpause;
var emloop_init_sound;
var emloop_invoke_main;
var emloop_reenter_blessed;
var _mainCalledOnce = false;
var emloop_install_pack;
var emloop_set_minetest_conf;
var irrlicht_want_pointerlock;
var irrlicht_force_pointerlock;
var irrlicht_resize;
var emsocket_init;
var emsocket_set_proxy;
var emsocket_set_vpn;
var webxr_inject_mouse_delta;
var webxr_queue_chat_message;
var webxr_set_look;        // absolute orientation per XR frame (replaces delta accumulation)
var webxr_clear_look;      // restore normal mouse control when VR session ends
var webxr_set_right_hand;  // dominant controller position in head-local space (meters)
var webxr_set_body_visible; // show/hide local player body mesh in first-person VR

// Called when the wasm module is ready
function emloop_ready() {
    emloop_pause = cwrap("emloop_pause", null, []);
    emloop_unpause = cwrap("emloop_unpause", null, []);
    emloop_init_sound = cwrap("emloop_init_sound", null, []);
    emloop_invoke_main      = cwrap("emloop_invoke_main",      null, ["number", "number"]);
    emloop_reenter_blessed  = cwrap("emloop_reenter_blessed",  null, ["number", "number"]);
    emloop_install_pack = cwrap("emloop_install_pack", null, ["number", "number", "number"]);
    emloop_set_minetest_conf = cwrap("emloop_set_minetest_conf", null, ["number"]);
    irrlicht_want_pointerlock = cwrap("irrlicht_want_pointerlock", "number");
    irrlicht_force_pointerlock = cwrap("irrlicht_force_pointerlock", null);
    irrlicht_resize = cwrap("irrlicht_resize", null, ["number", "number"]);
    emsocket_init = cwrap("emsocket_init", null, []);
    emsocket_set_proxy = cwrap("emsocket_set_proxy", null, ["number"]);
    emsocket_set_vpn = cwrap("emsocket_set_vpn", null, ["number"]);
    webxr_inject_mouse_delta = cwrap("webxr_inject_mouse_delta", null, ["number", "number"]);
    webxr_queue_chat_message  = cwrap("webxr_queue_chat_message",  null, ["string"]);
    webxr_set_look            = cwrap("webxr_set_look",            null, ["number", "number"]);
    webxr_clear_look          = cwrap("webxr_clear_look",          null, []);
    webxr_set_right_hand      = cwrap("webxr_set_right_hand",      null, ["number", "number", "number"]);
    webxr_set_body_visible    = cwrap("webxr_set_body_visible",    null, ["number"]);
    // Restore any previously saved worlds from OPFS into WasmFS BEFORE
    // signalling wasmReady, so main() sees the files when it runs.
    restoreWorldsFromOPFS().then(() => {
        mtScheduler.setCondition("wasmReady");
    }).catch(e => {
        console.warn('[restore] emloop_ready error:', e);
        mtScheduler.setCondition("wasmReady");
    });
}

// Called when the wasm module wants to force redraw before next frame
function emloop_request_animation_frame() {
    emloop_pause();
    window.requestAnimationFrame(() => { emloop_unpause(); });
}

function makeArgv(args) {
    // Assuming 4-byte pointers
    const argv = _malloc((args.length + 1) * 4);
    let i;
    for (i = 0; i < args.length; i++) {
        HEAPU32[(argv >>> 2) + i] = stringToNewUTF8(args[i]);
    }
    HEAPU32[(argv >>> 2) + i] = 0; // argv[argc] == NULL
    return [i, argv];
}

var consoleText = [];
var consoleLengthMax = 1000;
var consoleTextLast = 0;
var consoleDirty = false;

const PERSIST_MOUNT = '/minetest';
const PERSIST_MT_DIR = PERSIST_MOUNT;  // path_user IS /minetest (no .minetest subdir)
const PERSIST_WORLDS_DIR = PERSIST_MOUNT + '/worlds';

// Request persistent storage so the browser won't evict OPFS world saves
// under storage pressure (e.g. low disk space).  Without this, Chrome/Firefox
// may silently delete worlds when storage is reclaimed.
if (navigator.storage && navigator.storage.persist) {
    navigator.storage.persist().then(granted => {
        if (!granted) {
            console.warn('[persist] Persistent storage not granted — worlds may be cleared under browser storage pressure.');
        } else {
            console.log('[persist] Persistent storage granted — worlds are protected from eviction.');
        }
    });
}

// Lists worlds stored in OPFS (the WasmFS backend mounted at /persist).
// OPFS root "/" corresponds to WASM path "/minetest/", so world dirs are at
// OPFS "worlds/<name>" (path_user = /minetest, worlds at /minetest/worlds/).
async function listPersistedWorlds() {
    try {
        if (!navigator.storage || !navigator.storage.getDirectory) {
            console.warn('[persist] navigator.storage.getDirectory not available — OPFS not supported in this browser/context');
            return [];
        }
        // WasmFS OPFS backend requires crossOriginIsolated (COOP + COEP headers).
        // If false, the C++ OPFS mount silently falls back to in-memory storage.
        if (!window.crossOriginIsolated) {
            console.error('[persist] crossOriginIsolated is FALSE — server is missing COOP/COEP headers. ' +
                'WasmFS cannot use OPFS sync handles; worlds will NOT be saved across reloads. ' +
                'Server must send: Cross-Origin-Opener-Policy: same-origin AND Cross-Origin-Embedder-Policy: require-corp (or credentialless)');
            return [];
        }
        const root = await navigator.storage.getDirectory();
        // path_user = /minetest, so OPFS root maps to /minetest, worlds at OPFS worlds/
        const worldsDir = await root.getDirectoryHandle('worlds', { create: false }).catch(() => null);
        if (!worldsDir) {
            console.log('[persist] No worlds/ directory in OPFS — no worlds saved yet');
            return [];
        }
        const worlds = [];
        for await (const [name, handle] of worldsDir.entries()) {
            if (handle.kind !== 'directory') continue;
            let title = name;
            let gameid = '';
            try {
                const wmFile = await handle.getFileHandle('world.mt', { create: false }).catch(() => null);
                if (wmFile) {
                    const file = await wmFile.getFile();
                    const text = await file.text();
                    text.split(/\r?\n/).forEach((line) => {
                        const eq = line.indexOf('=');
                        if (eq < 0) return;
                        const k = line.slice(0, eq).trim();
                        const v = line.slice(eq + 1).trim();
                        if (k === 'world_name' && v) title = v;
                        if (k === 'gameid' && v) gameid = v;
                    });
                } else {
                    console.log('[persist] world dir', name, 'has no world.mt yet');
                }
            } catch (_e) {}
            worlds.push({ id: name, title, gameid, path: PERSIST_WORLDS_DIR + '/' + name });
        }
        worlds.sort((a, b) => a.title.localeCompare(b.title));
        console.log('[persist] listPersistedWorlds found:', worlds.map(w => w.id + ' (' + w.gameid + ')'));
        return worlds;
    } catch (_e) {
        console.error('[persist] listPersistedWorlds error:', _e);
        return [];
    }
}

// OPFS persists automatically — no explicit flush needed.
// This function exists so the Save World button has something to call.
function saveWorldNowOPFS() {
    const btn = document.getElementById('save_world_btn');
    if (btn) {
        btn.value = '\u2713 Auto-saved';
        setTimeout(() => { btn.value = 'Save World'; }, 1500);
    }
}

window.listPersistedWorlds = listPersistedWorlds;
window.flushPersistedWorlds = () => Promise.resolve();
window.debugPersist = async function() {
    console.log('[persist] OPFS-backed WasmFS build');
    console.log('[persist] crossOriginIsolated:', window.crossOriginIsolated);
    if (navigator.storage && navigator.storage.persisted) {
        const p = await navigator.storage.persisted();
        console.log('[persist] storage.persisted():', p, p ? '(protected from eviction)' : '(best-effort, may be cleared)');
    }
    try {
        const root = await navigator.storage.getDirectory();
        const entries = [];
        for await (const [name] of root.entries()) entries.push(name);
        console.log('[persist] OPFS root entries:', entries);
        const worlds = await listPersistedWorlds();
        console.log('[persist] worlds found:', worlds);
    } catch (e) { console.error('[persist] error:', e); }
    return 'done';
};

function consoleUpdate() {
    if (consoleDirty) {
        if (consoleText.length > consoleLengthMax) {
            consoleText = consoleText.slice(-consoleLengthMax);
        }
        consoleOutput.value = consoleText.join('');
        consoleOutput.scrollTop = consoleOutput.scrollHeight; // focus on bottom
        consoleDirty = false;
    }
    window.requestAnimationFrame(consoleUpdate);
}

function consoleToggle() {
    consoleOutput.style.display = (consoleOutput.style.display == 'block') ? 'none' : 'block';
    consoleButton.value = (consoleOutput.style.display == 'none') ? 'Show Console' : 'Hide Console';
    fixGeometry();
}

// ── File Manager ─────────────────────────────────────────
let _fmgrStack = []; // stack of { name, handle } for OPFS navigation
let _fmgrMode = 'opfs';  // 'opfs' | 'mem'
let _fmgrMemPath = '/'; // current path for Memory FS mode

async function openFileMgr() {
    closeSideMenu();
    const overlay = document.getElementById('filemgr_overlay');
    overlay.classList.add('open');
    await fileMgrSetMode(_fmgrMode);
}

function closeFileMgr() {
    document.getElementById('filemgr_overlay').classList.remove('open');
}

async function fileMgrSetMode(mode) {
    _fmgrMode = mode;
    document.getElementById('fmgr_tab_opfs').classList.toggle('active', mode === 'opfs');
    document.getElementById('fmgr_tab_mem').classList.toggle('active', mode === 'mem');
    if (mode === 'opfs') {
        if (_fmgrStack.length === 0) {
            try {
                const root = await navigator.storage.getDirectory();
                _fmgrStack = [{ name: 'OPFS', handle: root }];
            } catch (e) {
                _fileMgrStatus('OPFS error: ' + e.message);
                return;
            }
        }
    } else {
        if (_fmgrMemPath === '/') _fmgrMemPath = '/';
    }
    await _fileMgrRender();
}

async function fileMgrUp() {
    if (_fmgrMode === 'mem') {
        if (_fmgrMemPath !== '/') {
            _fmgrMemPath = _fmgrMemPath.replace(/\/[^\/]+$/, '') || '/';
            await _fileMgrRender();
        }
    } else if (_fmgrStack.length > 1) {
        _fmgrStack.pop();
        await _fileMgrRender();
    }
}

async function fileMgrRefresh() {
    await _fileMgrRender();
}

async function _fileMgrNav(name, handle) {
    _fmgrStack.push({ name, handle });
    await _fileMgrRender();
}

function _fmgrFormatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
}

async function _fileMgrRender() {
    if (_fmgrMode === 'mem') {
        _fileMgrRenderMem();
    } else {
        await _fileMgrRenderOPFS();
    }
}

function _fileMgrRenderMem() {
    const list = document.getElementById('filemgr_list');
    const statusbar = document.getElementById('filemgr_statusbar');
    const pathLabel = document.getElementById('filemgr_path_label');
    list.innerHTML = '';

    // Module.FS is only available if FS is in EXPORTED_RUNTIME_METHODS.
    // Try Module.FS first, then the global FS variable (older Emscripten fallback).
    const FS = (typeof Module !== 'undefined' && Module.FS) || (typeof window.FS !== 'undefined' && window.FS);
    if (!FS) {
        list.innerHTML = '<div id="filemgr_empty">Module.FS not exported — rebuild required.<br><br>Add <code>FS</code> to EXPORTED_RUNTIME_METHODS in build_minetest.sh, then run ./build_minetest.sh &amp;&amp; ./build_www.sh</div>';
        statusbar.textContent = 'Not available — rebuild needed';
        return;
    }

    // Breadcrumb for memory path
    const bc = document.getElementById('filemgr_breadcrumb');
    bc.innerHTML = '';
    const parts = _fmgrMemPath === '/' ? [''] : _fmgrMemPath.split('/');
    parts.forEach((part, i) => {
        const segPath = parts.slice(0, i + 1).join('/') || '/';
        if (i > 0) { const sep = document.createElement('span'); sep.className = 'sep'; sep.textContent = ' / '; bc.appendChild(sep); }
        const s = document.createElement('span');
        s.textContent = part || '/';
        if (i < parts.length - 1) {
            s.onclick = () => { _fmgrMemPath = segPath; _fileMgrRenderMem(); };
        } else {
            s.style.color = '#f4f7fb'; s.style.cursor = 'default';
        }
        bc.appendChild(s);
    });
    pathLabel.textContent = _fmgrMemPath;

    let names;
    try {
        names = FS.readdir(_fmgrMemPath).filter(n => n !== '.' && n !== '..');
    } catch (e) {
        list.innerHTML = '<div id="filemgr_empty">Error: ' + e.message + '</div>';
        statusbar.textContent = 'Error';
        return;
    }

    if (names.length === 0) {
        list.innerHTML = '<div id="filemgr_empty">Empty directory</div>';
        statusbar.textContent = '0 items';
        return;
    }

    const entries = names.map(name => {
        const fullPath = (_fmgrMemPath === '/' ? '' : _fmgrMemPath) + '/' + name;
        let isDir = false, size = 0;
        try {
            const st = FS.stat(fullPath);
            // WasmFS: use mode bits directly (S_IFDIR = 0o040000)
            isDir = (st.mode & 0o170000) === 0o040000;
            size = st.size;
        } catch (e) {}
        return { name, fullPath, isDir, size };
    }).sort((a, b) => {
        if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
        return a.name.localeCompare(b.name);
    });

    let fileCount = 0, dirCount = 0;
    for (const { name, fullPath, isDir, size } of entries) {
        isDir ? dirCount++ : fileCount++;
        const row = document.createElement('div');
        row.className = 'fmgr-row ' + (isDir ? 'dir' : 'file');

        const icon = document.createElement('span');
        icon.className = 'fmgr-icon';
        icon.textContent = isDir ? '\uD83D\uDCC1' : '\uD83D\uDCC4';
        row.appendChild(icon);

        const nameEl = document.createElement('span');
        nameEl.className = 'fmgr-name';
        nameEl.textContent = name;
        row.appendChild(nameEl);

        const sizeEl = document.createElement('span');
        sizeEl.className = 'fmgr-size';
        if (!isDir) sizeEl.textContent = _fmgrFormatSize(size);
        row.appendChild(sizeEl);

        const actions = document.createElement('div');
        actions.className = 'fmgr-actions';

        if (isDir) {
            row.onclick = (e) => { if (!e.target.closest('.fmgr-btn')) { _fmgrMemPath = fullPath; _fileMgrRenderMem(); } };
            const openBtn = document.createElement('button');
            openBtn.className = 'fmgr-btn';
            openBtn.textContent = 'Open';
            openBtn.onclick = (e) => { e.stopPropagation(); _fmgrMemPath = fullPath; _fileMgrRenderMem(); };
            actions.appendChild(openBtn);
        } else {
            const dlBtn = document.createElement('button');
            dlBtn.className = 'fmgr-btn';
            dlBtn.textContent = '\u2193 DL';
            dlBtn.title = 'Download';
            dlBtn.onclick = (e) => {
                e.stopPropagation();
                try {
                    const data = FS.readFile(fullPath);
                    const blob = new Blob([data]);
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url; a.download = name;
                    document.body.appendChild(a); a.click(); document.body.removeChild(a);
                    setTimeout(() => URL.revokeObjectURL(url), 5000);
                    _fileMgrStatus('Downloaded ' + name);
                } catch (err) { _fileMgrStatus('Download failed: ' + err.message); }
            };
            actions.appendChild(dlBtn);
        }
        row.appendChild(actions);
        list.appendChild(row);
    }
    statusbar.textContent = `Memory FS — ${dirCount} folder${dirCount !== 1 ? 's' : ''}, ${fileCount} file${fileCount !== 1 ? 's' : ''}`;
}

async function _fileMgrRenderOPFS() {
    const list = document.getElementById('filemgr_list');
    const statusbar = document.getElementById('filemgr_statusbar');
    const pathLabel = document.getElementById('filemgr_path_label');
    list.innerHTML = '';
    statusbar.textContent = 'Loading…';

    // Breadcrumb
    const bc = document.getElementById('filemgr_breadcrumb');
    bc.innerHTML = '';
    _fmgrStack.forEach((seg, i) => {
        if (i > 0) { const sep = document.createElement('span'); sep.className = 'sep'; sep.textContent = ' / '; bc.appendChild(sep); }
        const s = document.createElement('span');
        s.textContent = seg.name;
        if (i < _fmgrStack.length - 1) {
            s.onclick = async () => { _fmgrStack = _fmgrStack.slice(0, i + 1); await _fileMgrRender(); };
        } else {
            s.style.color = '#f4f7fb';
            s.style.cursor = 'default';
        }
        bc.appendChild(s);
    });

    const currentPath = _fmgrStack.map(s => s.name).join('/');
    pathLabel.textContent = currentPath;

    const dir = _fmgrStack[_fmgrStack.length - 1].handle;
    const entries = [];
    try {
        for await (const [name, handle] of dir.entries()) {
            entries.push({ name, handle });
        }
    } catch (e) {
        list.innerHTML = '<div id="filemgr_empty">Error reading directory: ' + e.message + '</div>';
        statusbar.textContent = 'Error';
        return;
    }
    entries.sort((a, b) => {
        const aIsDir = a.handle.kind === 'directory';
        const bIsDir = b.handle.kind === 'directory';
        if (aIsDir !== bIsDir) return aIsDir ? -1 : 1;
        return a.name.localeCompare(b.name);
    });

    if (entries.length === 0) {
        list.innerHTML = '<div id="filemgr_empty">Empty directory</div>';
        statusbar.textContent = '0 items';
        return;
    }

    let fileCount = 0, dirCount = 0;
    for (const { name, handle } of entries) {
        const isDir = handle.kind === 'directory';
        isDir ? dirCount++ : fileCount++;

        const row = document.createElement('div');
        row.className = 'fmgr-row ' + (isDir ? 'dir' : 'file');

        const icon = document.createElement('span');
        icon.className = 'fmgr-icon';
        icon.textContent = isDir ? '\uD83D\uDCC1' : '\uD83D\uDCC4';
        row.appendChild(icon);

        const nameEl = document.createElement('span');
        nameEl.className = 'fmgr-name';
        nameEl.textContent = name;
        row.appendChild(nameEl);

        const sizeEl = document.createElement('span');
        sizeEl.className = 'fmgr-size';
        if (!isDir) {
            handle.getFile().then(f => { sizeEl.textContent = _fmgrFormatSize(f.size); }).catch(() => {});
        }
        row.appendChild(sizeEl);

        const actions = document.createElement('div');
        actions.className = 'fmgr-actions';

        if (isDir) {
            row.onclick = (e) => { if (!e.target.closest('.fmgr-btn')) _fileMgrNav(name, handle); };
            const openBtn = document.createElement('button');
            openBtn.className = 'fmgr-btn';
            openBtn.textContent = 'Open';
            openBtn.onclick = (e) => { e.stopPropagation(); _fileMgrNav(name, handle); };
            actions.appendChild(openBtn);
        } else {
            const dlBtn = document.createElement('button');
            dlBtn.className = 'fmgr-btn';
            dlBtn.textContent = '\u2193 DL';
            dlBtn.title = 'Download';
            dlBtn.onclick = async (e) => {
                e.stopPropagation();
                try {
                    const file = await handle.getFile();
                    const url = URL.createObjectURL(file);
                    const a = document.createElement('a');
                    a.href = url; a.download = name;
                    document.body.appendChild(a); a.click(); document.body.removeChild(a);
                    setTimeout(() => URL.revokeObjectURL(url), 5000);
                    _fileMgrStatus('Downloaded ' + name);
                } catch (err) { _fileMgrStatus('Download failed: ' + err.message); }
            };
            actions.appendChild(dlBtn);
        }

        const delBtn = document.createElement('button');
        delBtn.className = 'fmgr-btn del';
        delBtn.textContent = '\u2715';
        delBtn.title = 'Delete';
        delBtn.onclick = async (e) => {
            e.stopPropagation();
            if (!confirm('Delete "' + name + '"?' + (isDir ? ' This will delete all contents.' : ''))) return;
            try {
                await dir.removeEntry(name, { recursive: isDir });
                _fileMgrStatus('Deleted ' + name);
                await _fileMgrRender();
            } catch (err) { _fileMgrStatus('Delete failed: ' + err.message); }
        };
        actions.appendChild(delBtn);

        row.appendChild(actions);
        list.appendChild(row);
    }
    statusbar.textContent = `OPFS — ${dirCount} folder${dirCount !== 1 ? 's' : ''}, ${fileCount} file${fileCount !== 1 ? 's' : ''}`;
}

function _fileMgrStatus(msg) {
    const sb = document.getElementById('filemgr_statusbar');
    if (sb) sb.textContent = msg;
}

// ── World persistence: save MemoryFS → OPFS, restore OPFS → MemoryFS ────────

// Recursively copy an entire WasmFS subtree into OPFS.
// wasmPath e.g. '/persist/.minetest', opfsDir = corresponding FileSystemDirectoryHandle
async function _fsSaveDir(wasmPath, opfsDir) {
    const FS = (typeof Module !== 'undefined' && Module.FS) || window.FS;
    if (!FS) return;
    let names;
    try { names = FS.readdir(wasmPath).filter(n => n !== '.' && n !== '..'); }
    catch (e) { return; }
    for (const name of names) {
        const childWasm = (wasmPath === '/' ? '' : wasmPath) + '/' + name;
        let isDir = false;
        try { isDir = (FS.stat(childWasm).mode & 0o170000) === 0o040000; } catch (e) {}
        if (isDir) {
            const childDir = await opfsDir.getDirectoryHandle(name, { create: true });
            await _fsSaveDir(childWasm, childDir);
        } else {
            try {
                const data = FS.readFile(childWasm);
                const fh = await opfsDir.getFileHandle(name, { create: true });
                const w = await fh.createWritable();
                await w.write(data);
                await w.close();
            } catch (e) { console.warn('[save] skipped', childWasm, e.message); }
        }
    }
}

async function saveWorldsToOPFS() {
    const FS = (typeof Module !== 'undefined' && Module.FS) || window.FS;
    if (!FS) { console.warn('[save] Module.FS not available'); return; }
    try {
        const root = await navigator.storage.getDirectory();
        // Save worlds/ directory
        const worldsWasm = '/minetest/worlds';
        let hasWorlds = false;
        try { FS.readdir(worldsWasm); hasWorlds = true; } catch (e) {}
        if (hasWorlds) {
            console.log('[save] copying /minetest/worlds → OPFS/worlds…');
            const worldsOpfs = await root.getDirectoryHandle('worlds', { create: true });
            await _fsSaveDir(worldsWasm, worldsOpfs);
        }
        // Save minetest.conf
        const confWasm = '/minetest/minetest.conf';
        try {
            const data = FS.readFile(confWasm);
            const fh = await root.getFileHandle('minetest.conf', { create: true });
            const w = await fh.createWritable();
            await w.write(data);
            await w.close();
            console.log('[save] saved minetest.conf');
        } catch (e) { /* no conf file — skip */ }
        console.log('[save] done.');
    } catch (e) {
        console.error('[save] saveWorldsToOPFS failed:', e);
    }
}

// Recursively copy OPFS directory into WasmFS.
async function _fsRestoreDir(opfsDir, wasmPath) {
    const FS = (typeof Module !== 'undefined' && Module.FS) || window.FS;
    try { FS.mkdir(wasmPath); } catch (e) { /* already exists */ }
    for await (const [name, handle] of opfsDir.entries()) {
        const childWasm = wasmPath + '/' + name;
        if (handle.kind === 'directory') {
            await _fsRestoreDir(handle, childWasm);
        } else {
            try {
                const file = await handle.getFile();
                const buf = new Uint8Array(await file.arrayBuffer());
                // Ensure parent directory exists
                const parentPath = childWasm.substring(0, childWasm.lastIndexOf('/'));
                try { if (parentPath) FS.mkdir(parentPath); } catch (e) {}
                FS.writeFile(childWasm, buf);
            } catch (e) { console.warn('[restore] skipped', childWasm, e.message); }
        }
    }
}

async function restoreWorldsFromOPFS() {
    const FS = (typeof Module !== 'undefined' && Module.FS) || window.FS;
    if (!FS) { console.warn('[restore] Module.FS not available'); return; }
    try {
        const root = await navigator.storage.getDirectory();
        let restored = false;
        // Restore worlds/
        const worldsOpfs = await root.getDirectoryHandle('worlds', { create: false }).catch(() => null);
        if (worldsOpfs) {
            console.log('[restore] restoring OPFS/worlds → /minetest/worlds…');
            try { FS.mkdir('/minetest'); } catch (e) {}
            try { FS.mkdir('/minetest/worlds'); } catch (e) {}
            await _fsRestoreDir(worldsOpfs, '/minetest/worlds');
            restored = true;
        }
        // Restore minetest.conf
        const confHandle = await root.getFileHandle('minetest.conf', { create: false }).catch(() => null);
        if (confHandle) {
            try {
                const file = await confHandle.getFile();
                const buf = new Uint8Array(await file.arrayBuffer());
                try { FS.mkdir('/minetest'); } catch (e) {}
                FS.writeFile('/minetest/minetest.conf', buf);
                console.log('[restore] restored minetest.conf');
                restored = true;
            } catch (e) { console.warn('[restore] minetest.conf failed:', e.message); }
        }
        if (!restored) {
            console.log('[restore] OPFS empty — fresh start');
        } else {
            console.log('[restore] done.');
        }
    } catch (e) {
        console.warn('[restore] restoreWorldsFromOPFS failed:', e);
    }
}

function handleExitMessage(text) {
    if (text.includes('main() exited with return value 0')) {
        if (window._vrExitHandled) return;
        window._vrExitHandled = true;
        (async () => {
            await saveWorldsToOPFS();
            if (window.vrManager?._session) {
                await window.vrManager.exitVR();
            }
            window.location.href = window.location.pathname;
        })();
    }
}

// Also intercept native console.log in case Emscripten logs directly
// (e.g. from the pthread/worker context before the postMessage handler fires)
(function() {
    const _orig = console.log;
    console.log = function(...args) {
        _orig.apply(console, args);
        handleExitMessage(args.map(a => String(a)).join(' '));
    };
})();

var enableTracing = false;
function consolePrint(text) {
    if (enableTracing) {
        console.trace(text);
    }
    consoleText.push(text + "\n");
    consoleDirty = true;
    if (mtLauncher && mtLauncher.onprint) {
        mtLauncher.onprint(text);
    }
    handleExitMessage(text);
}

var Module = {
    preRun: [],
    postRun: [],
    print: consolePrint,
    canvas: (function() {
        // As a default initial behavior, pop up an alert when webgl context is lost. To make your
        // application robust, you may want to override this behavior before shipping!
        // See http://www.khronos.org/registry/webgl/specs/latest/1.0/#5.15.2
        mtCanvas.addEventListener("webglcontextlost", function(e) { alert('WebGL context lost. You will need to reload the page.'); e.preventDefault(); }, false);

        return mtCanvas;
    })(),
    setStatus: function(text) {
        if (text) Module.print('[wasm module status] ' + text);
    },
    totalDependencies: 0,
    monitorRunDependencies: function(left) {
        this.totalDependencies = Math.max(this.totalDependencies, left);
        if (!mtLauncher || !mtLauncher.onprogress) return;
        mtLauncher.onprogress('wasm_module', (this.totalDependencies-left) / this.totalDependencies);
    }
};

Module['printErr'] = Module['print'];

// Custom worker script to direct stdout/stderr to the main thread.
Module['mainScriptUrlOrBlob'] = RELEASE_DIR + '/worker.js';

Module['onFullScreen'] = () => { fixGeometry(); };
window.onerror = function(event) {
    consolePrint('Exception thrown, see JavaScript console');
};

function resizeCanvas(width, height) {
    const canvas = mtCanvas;
    if (canvas.width != width || canvas.height != height) {
        canvas.width = width;
        canvas.height = height;
        canvas.widthNative = width;
        canvas.heightNative = height;
    }
    // Trigger SDL window resize.
    // This should happen automatically, not sure why it doesn't.
    irrlicht_resize(width, height);
}

function now() {
    return (new Date()).getTime();
}

// Only allow fixGeometry to be called every 250ms
// Firefox calls this way too often, causing flicker.
var fixGeometryPause = 0;
function fixGeometry(override) {
    if (!override && now() < fixGeometryPause) {
        return;
    }
    // Never resize the canvas while an immersive XR session owns it.
    // Window resize / viewport events fire when the system overlay appears
    // (home button, browser UI), but resizing the canvas at that point
    // corrupts VR rendering and squishes the game when focus returns.
    // _onSessionEnd() sets _inVR=false before calling fixGeometry(true),
    // so this guard does not block cleanup when the session actually ends.
    if (window.vrManager && window.vrManager._inVR && window.vrManager._session) return;
    const resolutionSelect = document.getElementById('resolution');
    const aspectRatioSelect = document.getElementById('aspectRatio');
    var canvas = mtCanvas;
    var resolution = resolutionSelect.value;
    var aspectRatio = aspectRatioSelect.value;
    var screenX;
    var screenY;

    // Prevent the controls from getting focus, but don't steal it from the chat input
    if (document.activeElement !== chatInput) {
        canvas.focus();
    }

    const viewport = getViewportSize();
    // No header/footer in the new fullscreen layout — canvas fills the viewport.
    screenX = Math.max(1, viewport.width);
    screenY = Math.max(1, viewport.height);

    // Size of the viewport (after scaling)
    var realX;
    var realY;
    if (aspectRatio == 'any') {
        realX = screenX;
        realY = screenY;
    } else {
        var ar = aspectRatio.split(':');
        var innerRatio = parseInt(ar[0]) / parseInt(ar[1]);
        var outerRatio = screenX / screenY;
        if (innerRatio <= outerRatio) {
            realX = Math.floor(innerRatio * screenY);
            realY = screenY;
        } else {
            realX = screenX;
            realY = Math.floor(screenX / innerRatio);
        }
    }

    // Native canvas resolution
    const resolutionScale = getResolutionScale(resolution);
    var resX = Math.floor(realX * resolutionScale);
    var resY = Math.floor(realY * resolutionScale);
    [resX, resY] = clampNativeCanvasSize(resX, resY);
    resizeCanvas(resX, resY);

    var styleWidth = realX + "px";
    var styleHeight = realY + "px";
    canvas.style.setProperty("width", styleWidth, "important");
    canvas.style.setProperty("height", styleHeight, "important");
}

function setupResizeHandlers() {
    window.addEventListener('resize', () => { fixGeometry(); });
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            nudgeMobileAspectRatioAfterRotation();
            fixGeometry(true);
        }, 150);
    });
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', () => {
            // Ignore viewport resize (keyboard open/close) while chat input is focused
            if (document.activeElement === chatInput) return;
            fixGeometry(true);
        });
    }

    // Needed to prevent special keys from triggering browser actions, like
    // F5 causing page reload.
    document.addEventListener('keydown', (e) => {
        // Allow F11 to go full screen
        if (e.code == "F11") {
            // On Firefox, F11 is animated. The window smoothly grows to
            // full screen over several seconds. During this transition, the 'resize'
            // event is triggered hundreds of times. To prevent flickering, have
            // fixGeometry ignore repeated calls, and instead resize every 500ms
            // for 2.5 seconds. By then it should be finished.
            fixGeometryPause = now() + 2000;
            for (var delay = 100; delay <= 2600; delay += 500) {
                setTimeout(() => { fixGeometry(true); }, delay);
            }
        }
    });
}

class MinetestArgs {
    constructor() {
        this.go = false;
        this.server = false;
        this.name = '';
        this.password = '';
        this.gameid = '';
        this.address = '';
        this.port = '';
        this.packs = [];
        this.extra = [];
    }

    toArray() {
        const args = [];
        if (this.go) args.push('--go');
        if (this.server) args.push('--server');
        if (this.name) args.push('--name', this.name);
        if (this.password) args.push('--password', this.password);
        if (this.gameid) args.push('--gameid', this.gameid);
        if (this.address) args.push('--address', this.address);
        if (this.port) args.push('--port', this.port.toString());
        args.push(...this.extra);
        return args;
    }

    toQueryString() {
        const params = new URLSearchParams();
        if (this.go) params.append('go', '');
        if (this.server) params.append('server', '');
        if (this.name) params.append('name', this.name);
        if (this.password) params.append('password', this.password);
        if (this.gameid) params.append('gameid', this.gameid);
        if (this.address) params.append('address', this.address);
        if (this.port) params.append('port', this.port.toString());
        const extra_packs = [];
        this.packs.forEach(v => {
            if (v != 'base' && v != 'minetest_game' && v != 'devtest' && v != this.gameid) {
                extra_packs.push(v);
            }
        });
        if (extra_packs.length) {
            params.append('packs', extra_packs.join(','));
        }
        if (this.extra.length) {
            params.append('extra', this.extra.join(','));
        }
        return params.toString();
    }

    static fromQueryString(qs) {
        const r = new MinetestArgs();
        const params = new URLSearchParams(qs);
        if (params.has('go')) r.go = true;
        if (params.has('server')) r.server = true;
        if (params.has('name')) r.name = params.get('name');
        if (params.has('password')) r.password = params.get('password');
        if (params.has('gameid')) r.gameid = params.get('gameid');
        if (params.has('address')) r.address = params.get('address');
        if (params.has('port')) r.port = parseInt(params.get('port'));
        if (r.gameid && r.gameid != 'minetest_game' && r.gameid != 'devtest' && r.gameid != 'base') {
            r.packs.push(r.gameid);
        }
        if (params.has('packs')) {
            params.get('packs').split(',').forEach(p => {
                if (!r.packs.includes(p)) {
                    r.packs.push(p);
                }
            });
        }
        if (params.has('extra')) {
            r.extra = params.get('extra').split(',');
        }
        return r;
    }
}

class MinetestLauncher {
    constructor() {
        if (mtLauncher !== null) {
            throw new Error("There can be only one launcher");
        }
        mtLauncher = this;
        this.args = null;
        this.onprogress = null; // function(name, percent done)
        this.onready = null; // function()
        this.onerror = null; // function(message)
        this.onprint = null; // function(text)
        this.addedPacks = new Set();
        this.vpn = null;
        this.serverCode = null;
        this.clientCode = null;
        this.proxyUrl = "wss://bc3d.etherdeck.org/proxy";
        this.packsDir = DEFAULT_PACKS_DIR;
        this.packsDirIsCors = false;
        this.minetestConf = new Map();

        mtScheduler.addCondition("wasmReady", loadWasm);
        mtScheduler.addCondition("launch_called");
        mtScheduler.addCondition("ready", this.#notifyReady.bind(this), ['wasmReady']);
        mtScheduler.addCondition("main_called", callMain, ['ready', 'launch_called']);
        this.addPack('base');
    }

    setProxy(url) {
        this.proxyUrl = url;
    }

    /*
     * Set the url for the pack files directory
     * This can be relative or absolute.
     */
    setPacksDir(url, is_cors) {
        this.packsDir = url;
        this.packsDirIsCors = is_cors;
    }

    #notifyReady() {
        mtScheduler.setCondition("ready");
        if (this.onready) this.onready();
    }

    isReady() {
        return mtScheduler.isSet("ready");
    }

    // Must be set before launch()
    setVPN(serverCode, clientCode) {
        this.serverCode = serverCode;
        this.clientCode = clientCode;
        this.vpn = serverCode ? serverCode : clientCode;
    }

    // Set a key/value pair in minetest.conf
    // Overrides previous values of the same key
    setConf(key, value) {
        key = key.toString();
        value = value.toString();
        this.minetestConf.set(key, value);
    }

    #renderMinetestConf() {
        let lines = [];
        for (const [k, v] of this.minetestConf.entries()) {
            lines.push(`${k} = ${v}\n`);
        }
        return lines.join('');
    }

    setLang(lang) {
        if (!SUPPORTED_LANGUAGES_MAP.has(lang)) {
            alert(`Invalid code in setLang: ${lang}`);
        }
        this.setConf("language", lang);
    }

    // Returns pack status:
    //   0 - pack has not been added
    //   1 - pack is downloading
    //   2 - pack has been installed
    checkPack(name) {
       if (!this.addedPacks.has(name)) {
           return 0;
       }
       if (mtScheduler.isSet("installed:" + name)) {
           return 2;
       }
       return 1;
    }

    addPacks(packs) {
        for (const pack of packs) {
            this.addPack(pack);
        }
    }

    async addPack(name) {
        if (mtScheduler.isSet("launch_called")) {
            throw new Error("Cannot add packs after launch");
        }
        if (name == 'minetest_game' || name == 'devtest' || this.addedPacks.has(name))
            return;
        this.addedPacks.add(name);

        const fetchedCond = "fetched:" + name;
        const installedCond = "installed:" + name;

        let chunks = [];
        let received = 0;
        // This is done here instead of at the bottom, because it needs to
        // be delayed until after the 'wasmReady' condition.
        // TODO: Add the ability to `await` a condition instead.
        const installPack = () => {
            // Install
            const data = _malloc(received);
            let offset = 0;
            for (const arr of chunks) {
                HEAPU8.set(arr, data + offset);
                offset += arr.byteLength;
            }
            emloop_install_pack(stringToNewUTF8(name), data, received);
            _free(data);
            mtScheduler.setCondition(installedCond);
            if (this.onprogress) {
                this.onprogress(`download:${name}`, 1.0);
                this.onprogress(`install:${name}`, 1.0);
            }
        };
        mtScheduler.addCondition(fetchedCond, null);
        mtScheduler.addCondition(installedCond, installPack, ["wasmReady", fetchedCond]);
        mtScheduler.addDep("main_called", installedCond);

        const packUrl = this.packsDir + '/' + name + '.pack';
        let resp;
        try {
            resp = await fetch(packUrl, this.packsDirIsCors ? { credentials: 'omit' } : {});
        } catch (err) {
            if (this.onerror) {
                this.onerror(`${err}`);
            } else {
                alert(`Error while loading ${packUrl}. Please refresh page`);
            }
            throw new Error(`${err}`);
        }
        // This could be null if the header is missing
        var contentLength = resp.headers.get('Content-Length');
        if (contentLength) {
            contentLength = parseInt(contentLength);
            updateProgressBar(0, contentLength);
        }
        let reader = resp.body.getReader();
        while (true) {
            const {done, value} = await reader.read();
            if (done) {
                break;
            }
            chunks.push(value);
            received += value.byteLength;
            if (contentLength) {
                updateProgressBar(value.byteLength, 0);
                if (this.onprogress) {
                    this.onprogress(`download:${name}`, received / contentLength);
                }
            }
        }
        mtScheduler.setCondition(fetchedCond);
    }

    // Launch minetest.exe <args>
    //
    // This must be called from a keyboard or mouse event handler,
    // after the 'onready' event has fired. (For this reason, it cannot
    // be called from the `onready` handler)
    launch(args) {
        if (!this.isReady()) {
            throw new Error("launch called before onready");
        }
        if (!(args instanceof MinetestArgs)) {
            throw new Error("launch called without MinetestArgs");
        }
        if (mtScheduler.isSet("launch_called")) {
            throw new Error("launch called twice");
        }
        this.args = args;
        if (this.args.gameid) {
            this.addPack(this.args.gameid);
        }
        this.addPacks(this.args.packs);
        // Capture player name for voice chat before DOM is wiped
        if (this.args.name) _voicePlayerName = this.args.name;
        // Derive per-server voice room.
        // Priority: friend's name (from invite) > join-code URL > server IP > default
        if (window._pendingVoiceFriendName) {
            _voiceRoom = _sanitizeVoiceRoom('bloxel-' + window._pendingVoiceFriendName);
            delete window._pendingVoiceFriendName;
        } else if (joinCodeUrl) {
            _voiceRoom = _sanitizeVoiceRoom(joinCodeUrl);
        } else if (this.args.address) {
            _voiceRoom = _sanitizeVoiceRoom(this.args.address);
        } else {
            _voiceRoom = 'bloxelvoice';
        }
        // If coming from VR website mode, detach it so the game can start its own XR session
        if (VRWebsiteMode._instance) {
            VRWebsiteMode._instance.detachForGameLaunch();
        }
        activateBody();
        fixGeometry();
        // Auto-join voice in background so mic is live without opening the panel
        _autoJoinVoice();
        if (this.minetestConf.size > 0) {
            const contents = this.#renderMinetestConf();
            console.log("minetest.conf is: ", contents);
            const confBuf = stringToNewUTF8(contents);
            emloop_set_minetest_conf(confBuf);
            _free(confBuf);
        }
        emloop_init_sound();
        // Setup emsocket
        // TODO: emsocket should export the helpers for this
        emsocket_init();
        const proxyBuf = stringToNewUTF8(this.proxyUrl);
        emsocket_set_proxy(proxyBuf);
        _free(proxyBuf);
        if (this.vpn) {
            const vpnBuf = stringToNewUTF8(this.vpn);
            emsocket_set_vpn(vpnBuf);
            _free(vpnBuf);
        }
        if (args.go) {
            irrlicht_force_pointerlock();
        }
        mtScheduler.setCondition("launch_called");
    }
}

// ===== WebXR VR Manager =====
// Provides full WebXR immersive-vr support for Meta Quest Browser and Pico Browser.
//
// Features:
//   • Enters an immersive-vr WebXR session using the game's WebGL2 context
//   • Maps 6-DoF head rotation → synthetic mousemove events → in-game look
//   • Maps Quest/Pico controller input → keyboard/mouse events → movement/interaction
//   • Blits the game's rendered frame to the XR compositor framebuffer each tick
//   • Falls back to Gamepad API + DeviceOrientation on non-immersive browsers
//
// Controller layout (Quest 2/3 and Pico 4, WebXR gamepad spec):
//   Left:  trigger(0)=Jump  grip(1)=Sneak  X(4)=Inventory  Y(5)=Menu
//          thumbstick axes[2,3] → WASD movement
//   Right: trigger(0)=Dig(LMB)  grip(1)=Place(RMB)  A(4)=Drop  B(5)=Chat
//          thumbstick axes[2,3] → hotbar scroll
// Supported headsets: Meta Quest 2/3/Pro, Pico 4, Pico Neo 3 (Pico Browser v5+)

class WebXRManager {
    constructor() {
        this._session       = null;
        this._xrLayer       = null;
        this._refSpace      = null;
        this._gl            = null;
        this._prevOrient    = null;
        this._xrCalibQuat   = null; // calibration quaternion for absolute orientation
        this._xrYawOffset   = 0;    // accumulated joystick-turn offset in degrees
        this._lastXRTime    = null; // for dtime computation in XR frame
        this._gamepadStates = new Map();
        this._deviceOriHandler = null;
        this._gamepadPollId    = null;
        this._inVR              = false;
        this._immersiveSupported = false;
        this._sessionBlurred    = false;
        // Y Menu state
        this._ymenuOpen      = false;
        this._ymenuButtons   = [];
        this._ymenuHovered   = -1;
        this._ymenuTrigWas   = false;
        this._screenTrigWas  = false;
        this._screenGripWas  = false;
        this._cursorWorldPos = null;
        this._glInited       = false;
        this._raysByHand     = {};
        this._origWindowRAF  = null;
        this._origWindowCAF  = null;
        this._gameLoopRunningViaXR = false;
        this._hintOverlay          = null;
        // VR Chat overlay state
        this._chatMode       = false;
        this._chatText       = '';
        this._chatInp        = null;
        this._chatBtns       = [];
        this._chatHovered    = -1;
        this._initPromise = this._detectSupport();
    }

    async _detectSupport() {
        if (!navigator.xr) return;
        try {
            this._immersiveSupported = await navigator.xr.isSessionSupported('immersive-vr');
        } catch (_e) {
            this._immersiveSupported = false;
        }
        this._applyButtonVisibility();
    }

    // Show/hide the VR button based on whether any VR input is available.
    _applyButtonVisibility() {
        const btn = document.getElementById('vr_toggle_btn');
        const hasAny = this._immersiveSupported ||
            ('getGamepads' in navigator) ||
            (typeof DeviceOrientationEvent !== 'undefined');
        if (btn) btn.style.display = hasAny ? '' : 'none';
    }

    // Get (and cache) the game's WebGL2 context.
    _getGL() {
        if (!this._gl) {
            this._gl = mtCanvas.getContext('webgl2') || mtCanvas.getContext('webgl');
        }
        return this._gl;
    }

    // Public: called by the VR Mode button.
    async toggleVR() {
        if (this._inVR) {
            this.exitVR();
        } else {
            await this.enterVR();
        }
    }

    async enterVR() {
        await this._initPromise;

        if (navigator.xr && this._immersiveSupported) {
            await this._enterImmersive();
        } else {
            // Fallback: gamepad polling + DeviceOrientation (no headset takeover).
            this._startFallbackMode();
        }
    }

    async _enterImmersive() {
        try {
            const gl = this._getGL();
            // makeXRCompatible() must be called before creating the XR session.
            await gl.makeXRCompatible();

            // Track whether we're reusing a handed-off session so we can
            // suppress the spurious blur the Quest browser fires when the
            // XR base-layer swaps from VRWebsiteMode's canvas to the game canvas.
            const isHandoff = !!window._vrHandoffSession;
            if (isHandoff) {
                // Reuse the session handed off from VRWebsiteMode — no user gesture needed
                this._session = window._vrHandoffSession;
                window._vrHandoffSession = null;
            } else {
                this._session = await navigator.xr.requestSession('immersive-vr', {
                    requiredFeatures: ['local-floor'],
                    optionalFeatures: ['bounded-floor', 'hand-tracking', 'dom-overlay'],
                    domOverlay: { root: document.getElementById('canvas_container') },
                });
            }

            this._xrLayer = new XRWebGLLayer(this._session, gl, {
                antialias: false,
                depth:     true,
                stencil:   false,
            });
            this._session.updateRenderState({ baseLayer: this._xrLayer });

            // Resize the canvas to match one eye's native resolution so the
            // engine renders at the correct aspect ratio for the headset lenses.
            // framebufferWidth covers both eyes side-by-side, so one eye = half.
            const eyeW = Math.floor(this._xrLayer.framebufferWidth / 2);
            const eyeH = this._xrLayer.framebufferHeight;
            if (eyeW > 0 && eyeH > 0) {
                resizeCanvas(eyeW, eyeH);
            }

            this._refSpace = await this._session.requestReferenceSpace('local-floor')
                .catch(() => this._session.requestReferenceSpace('local'));

            // Store handler reference so we can remove it when handing session back
            this._endHandler = () => this._onSessionEnd();
            this._session.addEventListener('end', this._endHandler);
            // On a handoff (base-layer swap from VRWebsiteMode → game), the
            // Quest browser fires one spurious blur.  Suppress it so we don't
            // accidentally pause the game on launch.  Any real system-overlay
            // blur that follows will still be handled normally.
            let suppressNextBlur = isHandoff;
            this._session.addEventListener('blur', () => {
                if (suppressNextBlur) { suppressNextBlur = false; return; }
                this._sessionBlurred = true;
                // Save VR canvas dimensions so we can restore them on focus.
                // Resize events (triggered by the system overlay appearing) would
                // otherwise call fixGeometry() → resizeCanvas() → irrlicht_resize()
                // and squish the game. fixGeometry() is now guarded, but save here
                // as a belt-and-suspenders fallback for any other resize path.
                this._vrCanvasW = mtCanvas.width;
                this._vrCanvasH = mtCanvas.height;
                // Pause the Emscripten game loop so Irrlicht doesn't process
                // stale input or render to a null XR framebuffer during blur.
                if (typeof emloop_pause === 'function') emloop_pause();
            });
            this._session.addEventListener('focus', () => {
                suppressNextBlur = false; // also clear on genuine focus
                this._sessionBlurred = false;
                // Restore VR canvas dimensions in case anything changed them.
                if (this._vrCanvasW && this._vrCanvasH) {
                    resizeCanvas(this._vrCanvasW, this._vrCanvasH);
                }
                // Resume the game loop.
                if (typeof emloop_unpause === 'function') emloop_unpause();
            });
            this._inVR = true;
            this._prevOrient = null;
            // Show the local player body in first-person so it's visible when looking down.
            if (webxr_set_body_visible) webxr_set_body_visible(1);

            // The Emscripten game loop drives itself via window.requestAnimationFrame.
            // When an XR session is active, document.visibilityState becomes 'hidden'
            // and window.requestAnimationFrame callbacks are suppressed, stalling the
            // game loop. Override it to route through session.requestAnimationFrame so
            // the game ticks every XR frame regardless of document visibility.
            if (!this._origWindowRAF) {
                this._origWindowRAF = window.requestAnimationFrame.bind(window);
                this._origWindowCAF = window.cancelAnimationFrame.bind(window);
                const _self = this;
                window.requestAnimationFrame = (cb) => {
                    if (_self._session) {
                        // When the Emscripten game loop schedules itself (cb.name
                        // is 'MainLoop_runner'), mark the loop as live so the
                        // timer-based kick in callMain stops retrying.
                        if (cb?.name === 'MainLoop_runner') _self._gameLoopRunningViaXR = true;
                        return _self._session.requestAnimationFrame((t) => cb(t));
                    }
                    return _self._origWindowRAF(cb);
                };
                window.cancelAnimationFrame = (id) => {
                    if (_self._session) _self._session.cancelAnimationFrame(id);
                    else _self._origWindowCAF(id);
                };
            }

            this._session.requestAnimationFrame(this._onXRFrame.bind(this));
            this._setButtonActive(true);
        } catch (err) {
            console.error('[WebXR] Failed to start immersive-vr session:', err);
            alert('Could not start VR session: ' + err.message +
                '\nEnsure you are using Meta Quest Browser (v21+) or Pico Browser (v5+) with WebXR enabled.');
        }
    }

    exitVR() {
        return new Promise(resolve => {
            if (this._session) {
                // Wait for the session to actually end
                const originalOnSessionEnd = this._onSessionEnd.bind(this);
                this._onSessionEnd = function() {
                    originalOnSessionEnd();
                    this._onSessionEnd = originalOnSessionEnd;
                    resolve();
                }.bind(this);
                this._session.end().catch(() => resolve());
            } else {
                // Escape fallback mode.
                this._inVR = false;
                this._xrCalibQuat = null;
                this._xrYawOffset = 0;
                this._stopGamepadPoll();
                this._removeDeviceOriListener();
                this._setButtonActive(false);
                resolve();
            }
        });
    }

    _onSessionEnd() {
        this._session        = null;
        this._xrLayer        = null;
        this._refSpace       = null;
        this._inVR           = false;
        this._prevOrient     = null;
        this._xrCalibQuat    = null; // reset calibration for next VR session
        this._xrYawOffset    = 0;
        this._sessionBlurred = false;
        this._gameLoopRunningViaXR = false;
        this._destroyHintOverlay();
        this._stopGamepadPoll();
        this._removeDeviceOriListener();
        this._setButtonActive(false);
        // Restore window.requestAnimationFrame to its original browser implementation.
        if (this._origWindowRAF) {
            window.requestAnimationFrame = this._origWindowRAF;
            window.cancelAnimationFrame  = this._origWindowCAF;
            this._origWindowRAF = null;
            this._origWindowCAF = null;
        }
        // Return camera control to normal mouse/keyboard input.
        if (webxr_clear_look) webxr_clear_look();
        // Hide body mesh and clear controller tracking.
        if (webxr_set_body_visible) webxr_set_body_visible(0);
        // Restore canvas geometry after exiting VR.
        if (typeof fixGeometry === 'function') fixGeometry(true);
    }

    _setButtonActive(active) {
        const btn = document.getElementById('vr_toggle_btn');
        if (!btn) return;
        btn.textContent = active ? 'Exit VR' : 'VR Mode';
        btn.classList.toggle('vr-active', active);
    }

    // ── XR animation frame ────────────────────────────────────────────────────

    _onXRFrame(time, frame) {
        if (!this._session) return;
        this._session.requestAnimationFrame(this._onXRFrame.bind(this));

        // System home button / browser overlay: session is blurred, skip
        // rendering and input so we don't corrupt GL state or inject stale
        // camera/button events while the system UI is on top.
        if (this._sessionBlurred) return;

        // Compute delta-time in seconds for smooth analogue turning.
        const dtime = this._lastXRTime !== null
            ? Math.min((time - this._lastXRTime) / 1000, 0.1)
            : 1 / 72;
        this._lastXRTime = time;

        const gl   = this._getGL();
        const pose = frame.getViewerPose(this._refSpace);
        if (!pose) return;

        // 1. Head-rotation → camera look (always active, even in Y menu)
        this._processHeadPose(pose.transform.orientation);

        // 1b. Right controller → wield mesh hand tracking
        if (webxr_set_right_hand) {
            for (const src of this._session.inputSources) {
                if (src.handedness !== 'right' || !src.gripSpace) continue;
                const gp = frame.getPose(src.gripSpace, this._refSpace);
                if (!gp) continue;
                const hp = pose.transform.position;
                const hq = pose.transform.orientation;
                // World-space offset from headset to controller
                const wx = gp.transform.position.x - hp.x;
                const wy = gp.transform.position.y - hp.y;
                const wz = gp.transform.position.z - hp.z;
                // Rotate into head-local space (+X right, +Y up, -Z forward)
                const [lx, ly, lz] = this._rotByConjQuat([wx, wy, wz], hq);
                webxr_set_right_hand(lx, ly, lz);
                break;
            }
        }

        // 2. Quest/Pico controller input
        this._processXRInputSources(frame, dtime);

        // 3. Y Menu: render black space with floating game screen + menu panel
        if (this._ymenuOpen) {
            this._renderYMenuFrame(frame, pose, gl);
            return;
        }

        // 4. Normal mode: blit the full mono frame to each eye viewport.
        //
        // The engine renders a single (mono) frame. The camera direction is
        // already updated each tick by _processHeadPose(), so the game world
        // visually follows head rotation correctly. We simply copy the full
        // frame to both eyes without any horizontal crop or shift: crops caused
        // the image to stretch and become off-centre when head position drifted
        // beyond the canvas width.
        const xrFb = this._xrLayer.framebuffer;
        if (xrFb) {
            gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, xrFb);
            const W = mtCanvas.width;
            const H = mtCanvas.height;
            for (const view of pose.views) {
                const vp = this._xrLayer.getViewport(view);
                gl.blitFramebuffer(
                    0, 0, W, H,
                    vp.x, vp.y, vp.x + vp.width, vp.y + vp.height,
                    gl.COLOR_BUFFER_BIT, gl.LINEAR
                );
            }
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }

        // 5. Video screen billboard in VR — world-space anchor + control bar
        const _vs = window._videoScreen;
        if (_vs?._active && xrFb) {
            if (!this._glInited) this._initGLResources();
            if (this._glInited && this._videoTex) {
                // ── Upload video frame from the VideoScreen's 2D canvas ──────
                const _vsCanvas = _vs._vCanvas;
                const _vsVid    = _vs._vid;
                const hasFrame  = _vsVid && _vsVid.readyState >= 2;
                if (hasFrame && _vsCanvas) {
                    _vs._vCtx.drawImage(_vsVid, 0, 0, _vsCanvas.width, _vsCanvas.height);
                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, this._videoTex);
                    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                    try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, _vsCanvas); } catch (_e) {}
                    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
                    gl.bindTexture(gl.TEXTURE_2D, null);
                }

                // ── Build / upload control bar canvas ────────────────────────
                if (!this._vrCtrlCanvas) {
                    this._vrCtrlCanvas = document.createElement('canvas');
                    this._vrCtrlCanvas.width  = 512;
                    this._vrCtrlCanvas.height = 96;
                }
                const cc  = this._vrCtrlCanvas;
                const cctx = cc.getContext('2d');
                cctx.clearRect(0, 0, cc.width, cc.height);
                cctx.fillStyle = 'rgba(10,20,50,0.88)';
                cctx.roundRect ? cctx.roundRect(0, 0, cc.width, cc.height, 12) : cctx.fillRect(0, 0, cc.width, cc.height);
                cctx.fill();
                // Buttons: ⏸/▶  ⏹  📺  (pause/play, stop, change URL)
                const paused = _vsVid ? _vsVid.paused : false;
                const btns = [
                    { icon: paused ? '▶' : '⏸', action: 'vr_vid_playpause', x: 64  },
                    { icon: '⏹',                 action: 'vr_vid_stop',      x: 192 },
                    { icon: '📺',                action: 'vr_vid_url',       x: 320 },
                    { icon: '✕',                 action: 'vr_vid_close',     x: 448 },
                ];
                this._vrCtrlBtns = [];
                btns.forEach(b => {
                    const hw = 52, hh = 38;
                    cctx.fillStyle = 'rgba(255,255,255,0.12)';
                    cctx.beginPath();
                    cctx.roundRect ? cctx.roundRect(b.x-hw, 10, hw*2, hh*2, 8) : cctx.fillRect(b.x-hw, 10, hw*2, hh*2);
                    cctx.fill();
                    cctx.fillStyle = '#eef4ff';
                    cctx.font = '32px sans-serif';
                    cctx.textAlign = 'center';
                    cctx.textBaseline = 'middle';
                    cctx.fillText(b.icon, b.x, 48);
                    // Store as UV fraction of the ctrl canvas for hit detection
                    this._vrCtrlBtns.push({ action: b.action, u0:(b.x-hw)/cc.width, u1:(b.x+hw)/cc.width, v0:10/cc.height, v1:86/cc.height });
                });
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, this._videoCtrlTex);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cc); } catch (_e) {}
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
                gl.bindTexture(gl.TEXTURE_2D, null);

                // ── World-space anchor position ───────────────────────────────
                let pcx, pcy, pcz, brx = 1, brz = 0;
                if (_vs._anchor) {
                    pcx = _vs._anchor.x; pcy = _vs._anchor.y; pcz = _vs._anchor.z;
                } else {
                    const hp  = pose.transform.position;
                    const fwd = this._rayDir(pose.transform.orientation);
                    const D   = _vs._dist ?? 5.0;
                    pcx = hp.x + fwd[0]*D; pcy = hp.y + fwd[1]*D; pcz = hp.z + fwd[2]*D;
                    // Lock anchor now that we have a position
                    _vs._anchor = { x: pcx, y: pcy, z: pcz };
                }

                // Compute right vector so video screen always faces the player
                {
                    const hp = pose.transform.position;
                    const vdx = pcx - hp.x, vdz = pcz - hp.z;
                    const vd = Math.hypot(vdx, vdz);
                    if (vd > 0.01) {
                        // right = cross(fwd, worldUp) where fwd = (pcx-hx,0,pcz-hz)/vd
                        brx = -vdz / vd;
                        brz =  vdx / vd;
                    }
                }
                const vidFwd = [brz, 0, -brx]; // direction from player toward screen

                // ── Controller ray → hit detection + grab/drag ───────────────
                const vrRays = [];
                if (!this._vrGripWas) this._vrGripWas = new Map();
                for (const src of frame.session.inputSources) {
                    if (!src.gripSpace) continue;
                    const gp = frame.getPose(src.targetRaySpace, this._refSpace);
                    if (!gp) continue;
                    const or = gp.transform.position, dr = this._rayDir(gp.transform.orientation);
                    const oa = [or.x, or.y, or.z];
                    const barCy = pcy - 0.422 - 0.10;

                    // Hit-test video billboard and control bar separately
                    const vidHit = this._rayHitBillboard(oa, dr, [pcx, pcy, pcz],
                        vidFwd, [brx,0,brz], [0,1,0], 0.75, 0.422);
                    const barHit = this._rayHitBillboard(oa, dr, [pcx, barCy, pcz],
                        vidFwd, [brx,0,brz], [0,1,0], 0.75, 0.10);
                    const onScreen = !!(vidHit || barHit);

                    // Trigger → click control bar buttons (only when not grabbing)
                    if (barHit && src.gamepad?.buttons[0]?.pressed && !this._vrCtrlTrigWas
                            && this._vrGrabSrc !== src.handedness) {
                        for (const b of (this._vrCtrlBtns || [])) {
                            if (barHit.u >= b.u0 && barHit.u <= b.u1) {
                                this._execVRVideoAction(b.action, _vs); break;
                            }
                        }
                    }
                    this._vrCtrlTrigWas = src.gamepad?.buttons[0]?.pressed ?? false;

                    // Grip → grab and drag the screen
                    const gripNow = src.gamepad?.buttons[1]?.pressed ?? false;
                    const gripWas = this._vrGripWas.get(src.handedness) ?? false;
                    if (gripNow && !gripWas && onScreen) {
                        // Start grab: lock grab distance to current screen distance
                        const dx = pcx - or.x, dy = pcy - or.y, dz = pcz - or.z;
                        this._vrGrabDist = Math.sqrt(dx*dx + dy*dy + dz*dz);
                        this._vrGrabSrc  = src.handedness;
                    }
                    if (gripNow && this._vrGrabSrc === src.handedness) {
                        // Drag: move anchor along ray at the locked distance
                        const d = this._vrGrabDist ?? 5.0;
                        _vs._anchor = { x: or.x + dr[0]*d, y: or.y + dr[1]*d, z: or.z + dr[2]*d };
                    }
                    if (!gripNow && this._vrGrabSrc === src.handedness) {
                        this._vrGrabSrc = null;
                    }
                    this._vrGripWas.set(src.handedness, gripNow);

                    vrRays.push({ or: oa, dr });
                }

                // ── Per-eye draw ──────────────────────────────────────────────
                const saved = this._saveGL(gl);
                gl.bindFramebuffer(gl.FRAMEBUFFER, xrFb);
                gl.enable(gl.BLEND);
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                gl.disable(gl.DEPTH_TEST);
                gl.disable(gl.CULL_FACE);
                for (const view of pose.views) {
                    const vp = this._xrLayer.getViewport(view);
                    gl.viewport(vp.x, vp.y, vp.width, vp.height);
                    const pv = this._m4mul(view.projectionMatrix, view.transform.inverse.matrix);
                    // Video billboard
                    this._drawQuad(gl, this._videoTex,
                        this._m4mul(pv, this._m4billboard(pcx, pcy, pcz, 0.75, 0.422, [brx,0,brz], [0,1,0])));
                    // Control bar just below
                    const barCy = pcy - 0.422 - 0.10;
                    this._drawQuad(gl, this._videoCtrlTex,
                        this._m4mul(pv, this._m4billboard(pcx, barCy, pcz, 0.75, 0.10, [brx,0,brz], [0,1,0])));
                    // Controller pointer beams
                    for (const ray of vrRays) this._drawRay(gl, pv, ray.or, ray.dr, 8.0);
                }
                this._restoreGL(gl, saved);
            }
        }

        // 6. Floating screen billboard (game capture + toolbar with all actions)
        this._renderScreenBillboard(frame, pose, gl, xrFb);

        // 7. Floating chat / video-URL input panel (only visible when active)
        this._renderFloatingInput(frame, pose, gl, xrFb);
    }

    // ── Shared: draw a blue-framed floating panel canvas onto a GL texture ──────
    _buildFloatingFrame(ctx, w, h, title, minimized) {
        const T = 40; // title bar px height
        ctx.clearRect(0, 0, w, h);
        const drawH = minimized ? T : h;
        // Background
        ctx.fillStyle = 'rgba(6,14,52,0.90)';
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(0, 0, w, drawH, minimized ? 10 : [10,10,0,0]);
        else ctx.rect(0, 0, w, drawH);
        ctx.fill();
        // Title bar
        const tg = ctx.createLinearGradient(0,0,0,T);
        tg.addColorStop(0,'rgba(30,90,220,0.97)'); tg.addColorStop(1,'rgba(12,45,140,0.97)');
        ctx.fillStyle = tg;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(0,0,w,T,[10,10,minimized?10:0,minimized?10:0]);
        else ctx.rect(0,0,w,T);
        ctx.fill();
        // Title text
        ctx.fillStyle='#b8d8ff'; ctx.font='bold 17px system-ui,sans-serif';
        ctx.textAlign='left'; ctx.textBaseline='middle';
        ctx.fillText(title, 12, T/2);
        // Minimize/restore button
        const bx=w-44,by=5,bw=36,bh=T-10;
        ctx.fillStyle='rgba(18,55,160,0.85)'; ctx.strokeStyle='rgba(80,150,255,0.6)'; ctx.lineWidth=1.5;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(bx,by,bw,bh,5); else ctx.rect(bx,by,bw,bh);
        ctx.fill(); ctx.stroke();
        ctx.fillStyle='#ddeeff'; ctx.font='bold 20px system-ui,sans-serif'; ctx.textAlign='center';
        ctx.fillText(minimized?'+':'−', bx+bw/2, T/2);
        if (!minimized) {
            ctx.strokeStyle='rgba(50,130,255,0.70)'; ctx.lineWidth=2;
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(1,1,w-2,h-2,10); else ctx.rect(1,1,w-2,h-2);
            ctx.stroke();
        }
        // UV bounds of minimize button (v measured from top of canvas = v=0)
        return { btnU0: bx/w, btnU1:(bx+bw)/w, btnV0: by/h, btnV1:(by+bh)/h };
    }

    // Like _buildFloatingFrame but with transparent body — game capture shows through
    _buildScreenFrame(ctx, w, h, title, minimized) {
        const T = 40;
        ctx.clearRect(0, 0, w, h);
        // Minimized: fill title bar area with solid bg
        if (minimized) {
            ctx.fillStyle = 'rgba(6,14,52,0.90)';
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(0,0,w,T,10); else ctx.rect(0,0,w,T);
            ctx.fill();
        }
        // Title bar gradient
        const tg = ctx.createLinearGradient(0,0,0,T);
        tg.addColorStop(0,'rgba(30,90,220,0.97)'); tg.addColorStop(1,'rgba(12,45,140,0.97)');
        ctx.fillStyle = tg;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(0,0,w,T,[10,10,minimized?10:0,minimized?10:0]); else ctx.rect(0,0,w,T);
        ctx.fill();
        // Title text
        ctx.fillStyle='#b8d8ff'; ctx.font='bold 17px system-ui,sans-serif';
        ctx.textAlign='left'; ctx.textBaseline='middle';
        ctx.fillText(title, 12, T/2);
        // Minimize button
        const bx=w-44,by=5,bw=36,bh=T-10;
        ctx.fillStyle='rgba(18,55,160,0.85)'; ctx.strokeStyle='rgba(80,150,255,0.6)'; ctx.lineWidth=1.5;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(bx,by,bw,bh,5); else ctx.rect(bx,by,bw,bh);
        ctx.fill(); ctx.stroke();
        ctx.fillStyle='#ddeeff'; ctx.font='bold 20px system-ui,sans-serif'; ctx.textAlign='center';
        ctx.fillText(minimized?'+':'−', bx+bw/2, T/2);
        // Blue border (not minimized)
        if (!minimized) {
            ctx.strokeStyle='rgba(50,130,255,0.85)'; ctx.lineWidth=3;
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(1,1,w-2,h-2,[0,0,8,8]); else ctx.rect(1,1,w-2,h-2);
            ctx.stroke();
        }
        return { btnU0: bx/w, btnU1:(bx+bw)/w, btnV0: by/h, btnV1:(by+bh)/h };
    }

    _uploadCanvas2Tex(gl, tex, canvas) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas); } catch(_e){}
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    // ── VR HUD billboard: hotbar + health captured from game canvas ───────────
    _renderHotbarBillboard(frame, pose, gl, xrFb) {
        if (!xrFb || typeof mtCanvas === 'undefined') return;
        const W = mtCanvas.width, H = mtCanvas.height;
        if (W <= 0 || H <= 0) return;
        if (!this._glInited) this._initGLResources();
        if (!this._glInited) return;

        const HB_H = Math.max(1, Math.round(H * 0.20));
        const saved = this._saveGL(gl);

        // Create/resize HUD capture FBO
        if (!this._hudTex || W !== this._hudCapW || HB_H !== this._hudCapH) {
            gl.activeTexture(gl.TEXTURE0);
            if (this._hudTex) {
                gl.bindTexture(gl.TEXTURE_2D, this._hudTex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, W, HB_H, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
                gl.bindTexture(gl.TEXTURE_2D, null);
            } else {
                this._hudTex = this._mkTex(gl, W, HB_H);
                this._hudFBO = gl.createFramebuffer();
                gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this._hudFBO);
                gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
                    gl.TEXTURE_2D, this._hudTex, 0);
                gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
            }
            this._hudCapW = W; this._hudCapH = HB_H;
        }
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this._hudFBO);
        gl.blitFramebuffer(0, 0, W, HB_H, 0, 0, W, HB_H, gl.COLOR_BUFFER_BIT, gl.LINEAR);

        // Camera vectors
        const camFwd = this._rayDir(pose.transform.orientation);
        let rx = -camFwd[2], ry = 0, rz = camFwd[0];
        const rl = Math.hypot(rx, ry, rz);
        if (rl > 1e-6) { rx /= rl; ry /= rl; rz /= rl; } else { rx=1; ry=0; rz=0; }
        const camRight=[rx,ry,rz];
        const camUp=[ry*camFwd[2]-rz*camFwd[1], rz*camFwd[0]-rx*camFwd[2], rx*camFwd[1]-ry*camFwd[0]];
        const hp = pose.transform.position;

        if (!this._hudAnchor) {
            this._hudAnchor = { x: hp.x+camFwd[0]*1.8, y: hp.y+camFwd[1]*1.8-0.45, z: hp.z+camFwd[2]*1.8 };
        }

        // Frame canvas: 500×200, title bar 40px
        const FW=500, FH=200, FT=40;
        const HUD_HW=0.5, HUD_HH=0.2;         // billboard half-extents in meters
        const TITLE_FRAC = FT/FH;              // fraction of billboard height taken by title bar

        if (!this._hudFrameTex) {
            this._hudFrameCanvas = document.createElement('canvas');
            this._hudFrameCanvas.width=FW; this._hudFrameCanvas.height=FH;
            this._hudFrameTex = this._mkTex(gl, FW, FH);
            this._hudFrameDirty = true;
        }
        if (this._hudFrameDirty) {
            this._hudFrameDirty = false;
            const fc = this._hudFrameCanvas, ctx2 = fc.getContext('2d');
            this._hudFrameBtn = this._buildFloatingFrame(ctx2, FW, FH, '🎮 HUD', !!this._hudMinimized);
            this._uploadCanvas2Tex(gl, this._hudFrameTex, fc);
        }

        const mini = !!this._hudMinimized;
        const { x:hcx, y:hcy, z:hcz } = this._hudAnchor;
        // When minimized collapse to title-bar height, keep top edge fixed
        const activeHH = mini ? HUD_HH*TITLE_FRAC : HUD_HH;
        const activeCy = mini ? hcy+HUD_HH-activeHH : hcy;

        if (!this._hudGripWas) this._hudGripWas = new Map();
        const vrRays=[];

        for (const src of this._session.inputSources) {
            const rp = frame.getPose(src.targetRaySpace, this._refSpace);
            if (!rp) continue;
            const or=rp.transform.position, dr=this._rayDir(rp.transform.orientation);
            const oa=[or.x,or.y,or.z];
            const trigNow=src.gamepad?.buttons[0]?.pressed??false;
            const gripNow=src.gamepad?.buttons[1]?.pressed??false;
            const gripWas=this._hudGripWas.get(src.handedness)??false;

            const hit=this._rayHitBillboard(oa,dr,[hcx,activeCy,hcz],camFwd,camRight,camUp,HUD_HW,activeHH);

            // Minimize button
            if (hit && trigNow && !this._hudTrigWas) {
                const b=this._hudFrameBtn;
                if (b && hit.u>=b.btnU0 && hit.u<=b.btnU1 && hit.v>=b.btnV0 && hit.v<=b.btnV1) {
                    this._hudMinimized=!this._hudMinimized; this._hudFrameDirty=true;
                }
            }
            this._hudTrigWas=trigNow;

            // Grip drag
            if (gripNow && !gripWas && hit && !this._vrGrabSrc && !this._chatGrabSrc) {
                const dx=hcx-or.x, dy=activeCy-or.y, dz=hcz-or.z;
                this._hudGrabDist=Math.sqrt(dx*dx+dy*dy+dz*dz); this._hudGrabSrc=src.handedness;
            }
            if (gripNow && this._hudGrabSrc===src.handedness) {
                const d=this._hudGrabDist??1.8;
                const newCy=or.y+dr[1]*d;
                this._hudAnchor={ x:or.x+dr[0]*d, y:mini?newCy-HUD_HH+activeHH:newCy, z:or.z+dr[2]*d };
            }
            if (!gripNow && this._hudGrabSrc===src.handedness) this._hudGrabSrc=null;
            this._hudGripWas.set(src.handedness, gripNow);

            vrRays.push({oa,dr});
        }

        // Per-eye render
        gl.bindFramebuffer(gl.FRAMEBUFFER, xrFb);
        gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.disable(gl.DEPTH_TEST); gl.disable(gl.CULL_FACE);
        for (const view of pose.views) {
            const vp=this._xrLayer.getViewport(view);
            gl.viewport(vp.x,vp.y,vp.width,vp.height);
            const pv=this._m4mul(view.projectionMatrix, view.transform.inverse.matrix);
            if (!mini) {
                // Game capture inset below title bar
                const capCy=hcy-HUD_HH*(TITLE_FRAC*0.5);
                this._drawQuad(gl, this._hudTex,
                    this._m4mul(pv, this._m4billboard(hcx,capCy,hcz, HUD_HW*0.97, HUD_HH*(1-TITLE_FRAC)*0.97, camRight,camUp)));
            }
            this._drawQuad(gl, this._hudFrameTex,
                this._m4mul(pv, this._m4billboard(hcx,activeCy,hcz, HUD_HW,activeHH, camRight,camUp)));
            for (const ray of vrRays) this._drawRay(gl, pv, ray.oa, ray.dr, 5.0);
        }
        this._restoreGL(gl, saved);
    }

    // ── VR chat billboard: floating chat panel ────────────────────────────────
    _renderChatBillboard(frame, pose, gl, xrFb) {
        if (!xrFb || typeof mtCanvas === 'undefined') return;
        if (!this._glInited) this._initGLResources();
        if (!this._glInited) return;

        const saved = this._saveGL(gl);

        const CW=600, CH=500, CT=40;           // canvas px: width, height, title-bar height
        const CHAT_HW=0.45, CHAT_HH=0.375;     // billboard half-extents: 0.9 m × 0.75 m

        // Create textures/canvas once
        if (!this._chatFrameTex) {
            this._chatCanvas = document.createElement('canvas');
            this._chatCanvas.width=CW; this._chatCanvas.height=CH;
            this._chatFrameTex = this._mkTex(gl, CW, CH);
            this._chatFrameDirty = true;
        }

        // Rebuild chat canvas when there are new messages or state changed
        if (this._chatFrameDirty || window._vrChatNewMsg) {
            this._chatFrameDirty = false; window._vrChatNewMsg = false;
            const ctx2 = this._chatCanvas.getContext('2d');
            const mini = !!this._chatMinimized;
            this._chatFrameBtn = this._buildFloatingFrame(ctx2, CW, CH, '💬 Chat', mini);

            if (!mini) {
                // Message list (bottom-up, most recent at bottom)
                const log = window._vrChatLog || [];
                ctx2.font = '13px monospace'; ctx2.textBaseline = 'bottom'; ctx2.textAlign = 'left';
                const lineH = 17, listBottom = CH - 52, listTop = CT + 4;
                let y = listBottom;
                for (let i = log.length-1; i >= 0 && y > listTop; i--) {
                    const e = log[i];
                    const line = e.name ? `<${e.name}> ${e.msg}` : e.msg;
                    ctx2.fillStyle = 'rgba(140,190,255,0.85)';
                    ctx2.fillText(line, 8, y, CW-16);
                    y -= lineH;
                }
                // "Open Chat" button
                const bx=10, by=CH-46, bw=CW-20, bh=34;
                ctx2.fillStyle='rgba(18,55,160,0.90)'; ctx2.strokeStyle='rgba(80,150,255,0.6)'; ctx2.lineWidth=1.5;
                ctx2.beginPath();
                if (ctx2.roundRect) ctx2.roundRect(bx,by,bw,bh,7); else ctx2.rect(bx,by,bw,bh);
                ctx2.fill(); ctx2.stroke();
                ctx2.fillStyle='#c8e0ff'; ctx2.font='bold 15px system-ui,sans-serif';
                ctx2.textAlign='center'; ctx2.textBaseline='middle';
                ctx2.fillText('⌨  Open Chat  (T key)', CW/2, by+bh/2);
                // Store button UV
                this._chatOpenBtnU0=bx/CW; this._chatOpenBtnU1=(bx+bw)/CW;
                this._chatOpenBtnV0=by/CH;  this._chatOpenBtnV1=(by+bh)/CH;
            }
            this._uploadCanvas2Tex(gl, this._chatFrameTex, this._chatCanvas);
        }

        // Camera vectors
        const camFwd = this._rayDir(pose.transform.orientation);
        let rx=-camFwd[2],ry=0,rz=camFwd[0];
        const rl=Math.hypot(rx,ry,rz);
        if (rl>1e-6){rx/=rl;ry/=rl;rz/=rl;}else{rx=1;ry=0;rz=0;}
        const camRight=[rx,ry,rz];
        const camUp=[ry*camFwd[2]-rz*camFwd[1], rz*camFwd[0]-rx*camFwd[2], rx*camFwd[1]-ry*camFwd[0]];
        const hp = pose.transform.position;

        // Default position: 1.5 m ahead, 0.7 m to the right, 0.1 m below eye
        if (!this._chatAnchor) {
            this._chatAnchor = {
                x: hp.x+camFwd[0]*1.5+camRight[0]*0.7,
                y: hp.y+camFwd[1]*1.5+camRight[1]*0.7-0.1,
                z: hp.z+camFwd[2]*1.5+camRight[2]*0.7,
            };
        }

        const mini=!!this._chatMinimized;
        const TITLE_FRAC=CT/CH;
        const activeHH=mini?CHAT_HH*TITLE_FRAC:CHAT_HH;
        const {x:ccx,y:ccy,z:ccz}=this._chatAnchor;
        const activeCy=mini?ccy+CHAT_HH-activeHH:ccy;

        if (!this._chatGripWas) this._chatGripWas=new Map();
        for (const src of this._session.inputSources) {
            const rp=frame.getPose(src.targetRaySpace,this._refSpace);
            if (!rp) continue;
            const or=rp.transform.position, dr=this._rayDir(rp.transform.orientation);
            const oa=[or.x,or.y,or.z];
            const trigNow=src.gamepad?.buttons[0]?.pressed??false;
            const gripNow=src.gamepad?.buttons[1]?.pressed??false;
            const gripWas=this._chatGripWas.get(src.handedness)??false;

            const hit=this._rayHitBillboard(oa,dr,[ccx,activeCy,ccz],camFwd,camRight,camUp,CHAT_HW,activeHH);

            // Minimize button
            if (hit && trigNow && !this._chatTrigWas) {
                const b=this._chatFrameBtn;
                if (b && hit.u>=b.btnU0&&hit.u<=b.btnU1&&hit.v>=b.btnV0&&hit.v<=b.btnV1) {
                    this._chatMinimized=!this._chatMinimized; this._chatFrameDirty=true;
                }
                // Open-chat button (T key)
                if (!mini && hit.u>=this._chatOpenBtnU0&&hit.u<=this._chatOpenBtnU1
                          && hit.v>=this._chatOpenBtnV0&&hit.v<=this._chatOpenBtnV1) {
                    this._btnToKey(true,false,'t','KeyT',84);
                }
            }
            this._chatTrigWas=trigNow;

            // Grip drag
            if (gripNow&&!gripWas&&hit&&!this._vrGrabSrc&&!this._hudGrabSrc) {
                const dx=ccx-or.x,dy=activeCy-or.y,dz=ccz-or.z;
                this._chatGrabDist=Math.sqrt(dx*dx+dy*dy+dz*dz); this._chatGrabSrc=src.handedness;
            }
            if (gripNow&&this._chatGrabSrc===src.handedness) {
                const d=this._chatGrabDist??1.5;
                const newCy=or.y+dr[1]*d;
                this._chatAnchor={ x:or.x+dr[0]*d, y:mini?newCy-CHAT_HH+activeHH:newCy, z:or.z+dr[2]*d };
            }
            if (!gripNow&&this._chatGrabSrc===src.handedness) this._chatGrabSrc=null;
            this._chatGripWas.set(src.handedness,gripNow);
        }

        // Per-eye render
        gl.bindFramebuffer(gl.FRAMEBUFFER,xrFb);
        gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
        gl.disable(gl.DEPTH_TEST); gl.disable(gl.CULL_FACE);
        for (const view of pose.views) {
            const vp=this._xrLayer.getViewport(view);
            gl.viewport(vp.x,vp.y,vp.width,vp.height);
            const pv=this._m4mul(view.projectionMatrix,view.transform.inverse.matrix);
            this._drawQuad(gl, this._chatFrameTex,
                this._m4mul(pv, this._m4billboard(ccx,activeCy,ccz, CHAT_HW,activeHH, camRight,camUp)));
        }
        this._restoreGL(gl, saved);
    }

    // ── VR screen billboard: game capture + toolbar (all Y-menu actions) ────────
    _renderScreenBillboard(frame, pose, gl, xrFb) {
        if (!xrFb || typeof mtCanvas === 'undefined') return;
        const W = mtCanvas.width, H = mtCanvas.height;
        if (W <= 0 || H <= 0) return;
        if (!this._glInited) this._initGLResources();
        if (!this._glInited) return;

        const saved = this._saveGL(gl);

        // Header canvas dims (title bar + toolbar only — game area is a separate quad)
        const FW = 960, FT = 42, FB = 66, HDR_H = FT + FB; // 108px header canvas
        // Game area: true 16:9 so chat/HUD at top/bottom are never cropped
        const GAME_HW = 0.9;
        const GAME_HH = GAME_HW * 9 / 16;          // ≈ 0.506 m
        const HDR_HH  = GAME_HW * HDR_H / FW;       // ≈ 0.101 m — header floats above game

        // ── Game capture FBO: resize to match actual canvas ──────────────────
        if (!this._screenTex || W !== this._screenCapW || H !== this._screenCapH) {
            if (this._screenTex) {
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, this._screenTex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, W, H, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
                gl.bindTexture(gl.TEXTURE_2D, null);
            } else {
                this._screenTex = this._mkTex(gl, W, H);
                this._screenFBO = gl.createFramebuffer();
            }
            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this._screenFBO);
            gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._screenTex, 0);
            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
            this._screenCapW = W; this._screenCapH = H;
        }
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this._screenFBO);
        gl.blitFramebuffer(0, 0, W, H, 0, 0, W, H, gl.COLOR_BUFFER_BIT, gl.NEAREST);

        // ── Header canvas: title bar + toolbar (redrawn on minimize toggle) ──
        if (!this._screenHdrTex) {
            this._screenHdrCanvas = document.createElement('canvas');
            this._screenHdrCanvas.width = FW; this._screenHdrCanvas.height = HDR_H;
            this._screenHdrTex = this._mkTex(gl, FW, HDR_H);
            this._screenHdrDirty = true;
        }
        if (this._screenHdrDirty) {
            this._screenHdrDirty = false;
            const mini = !!this._screenMinimized;
            const ctx = this._screenHdrCanvas.getContext('2d');
            ctx.clearRect(0, 0, FW, HDR_H);
            // Title bar
            const tg = ctx.createLinearGradient(0,0,0,FT);
            tg.addColorStop(0,'rgba(30,90,220,0.97)'); tg.addColorStop(1,'rgba(12,45,140,0.97)');
            ctx.fillStyle = tg;
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(0,0,FW,FT,[10,10,0,0]); else ctx.rect(0,0,FW,FT);
            ctx.fill();
            ctx.fillStyle='#b8d8ff'; ctx.font='bold 18px system-ui,sans-serif';
            ctx.textAlign='left'; ctx.textBaseline='middle';
            ctx.fillText('🖥  Screen', 12, FT/2);
            // Minimize / Restore button
            const mx=FW-58,my=5,mw=50,mh=FT-10;
            ctx.fillStyle='rgba(18,55,160,0.85)'; ctx.strokeStyle='rgba(80,150,255,0.6)'; ctx.lineWidth=1.5;
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(mx,my,mw,mh,5); else ctx.rect(mx,my,mw,mh);
            ctx.fill(); ctx.stroke();
            ctx.fillStyle='#ddeeff'; ctx.font='bold 16px system-ui,sans-serif'; ctx.textAlign='center';
            ctx.fillText(mini ? '+ Show' : '− Hide', mx+mw/2, FT/2);
            this._screenMiniBtn = { u0:mx/FW, u1:(mx+mw)/FW, v0:my/HDR_H, v1:(my+mh)/HDR_H };
            // Toolbar (only when not minimized)
            if (!mini) {
                ctx.fillStyle='rgba(6,18,60,0.95)'; ctx.fillRect(0, FT, FW, FB);
                const TOOLBAR_BTNS = [
                    { label:'💬 Chat',      action:'chat'      },
                    { label:'🎤 Voice',     action:'voice'     },
                    { label:'📺 Video',     action:'video'     },
                    { label:'🎒 Inventory', action:'inventory' },
                    { label:'⚙ Settings',  action:'settings'  },
                    { label:'🏠 Home',      action:'launcher'  },
                ];
                const NBTN=TOOLBAR_BTNS.length, BTN_GAP=10, BTN_H=FB-14;
                const BTN_W=(FW-(NBTN+1)*BTN_GAP)/NBTN;
                this._screenToolBtns = [];
                for (let i=0;i<NBTN;i++) {
                    const bx=BTN_GAP+i*(BTN_W+BTN_GAP), by=FT+7;
                    ctx.fillStyle='rgba(18,55,160,0.85)'; ctx.strokeStyle='rgba(60,130,255,0.7)'; ctx.lineWidth=1.5;
                    ctx.beginPath();
                    if (ctx.roundRect) ctx.roundRect(bx,by,BTN_W,BTN_H,7); else ctx.rect(bx,by,BTN_W,BTN_H);
                    ctx.fill(); ctx.stroke();
                    ctx.fillStyle='#c8e0ff'; ctx.font='bold 14px system-ui,sans-serif';
                    ctx.textAlign='center'; ctx.textBaseline='middle';
                    ctx.fillText(TOOLBAR_BTNS[i].label, bx+BTN_W/2, by+BTN_H/2);
                    this._screenToolBtns.push({ action:TOOLBAR_BTNS[i].action,
                        u0:bx/FW, u1:(bx+BTN_W)/FW, v0:by/HDR_H, v1:(by+BTN_H)/HDR_H });
                }
            } else {
                this._screenToolBtns = [];
            }
            // Blue border (bottom edge of header attaches to game quad top)
            ctx.strokeStyle='rgba(50,130,255,0.85)'; ctx.lineWidth=3;
            ctx.strokeRect(1, 1, FW-2, HDR_H-2);
            this._uploadCanvas2Tex(gl, this._screenHdrTex, this._screenHdrCanvas);
        }

        // Camera vectors
        const camFwd = this._rayDir(pose.transform.orientation);
        let rx=-camFwd[2],ry=0,rz=camFwd[0];
        const rl=Math.hypot(rx,ry,rz);
        if (rl>1e-6){rx/=rl;ry/=rl;rz/=rl;}else{rx=1;ry=0;rz=0;}
        const camRight=[rx,ry,rz];
        const hp = pose.transform.position;

        if (!this._screenAnchor) {
            this._screenAnchor = {
                x: hp.x+camFwd[0]*2.2,
                y: hp.y+camFwd[1]*2.2,
                z: hp.z+camFwd[2]*2.2,
            };
        }

        const mini = !!this._screenMinimized;
        const {x:scx,y:scy,z:scz} = this._screenAnchor;
        // Header sits directly above the game quad
        const hdrCy = scy + GAME_HH + HDR_HH;
        const worldUp = [0,1,0];

        if (!this._screenGripWas) this._screenGripWas = new Map();
        if (!this._screenTrigWas) this._screenTrigWas = new Map();

        let cursorWorld = null;

        for (const src of this._session.inputSources) {
            const rp = frame.getPose(src.targetRaySpace, this._refSpace);
            if (!rp) continue;
            const or = rp.transform.position;
            const dr = this._rayDir(rp.transform.orientation);
            const oa = [or.x,or.y,or.z];
            const trigNow = src.gamepad?.buttons[0]?.pressed??false;
            const gripNow = src.gamepad?.buttons[1]?.pressed??false;
            const gripWas = this._screenGripWas.get(src.handedness)??false;
            const trigWas = this._screenTrigWas.get(src.handedness)??false;
            const trigPressed = trigNow && !trigWas;
            const gripPressed = gripNow && !gripWas;
            const bothNow = trigNow && gripNow;
            const bothWas = trigWas && gripWas;

            // Hit-test header and game quads separately
            const hdrHit  = this._rayHitBillboard(oa,dr,[scx,hdrCy,scz],camFwd,camRight,worldUp,GAME_HW,HDR_HH);
            const gameHit = mini ? null :
                this._rayHitBillboard(oa,dr,[scx,scy,scz],camFwd,camRight,worldUp,GAME_HW,GAME_HH);
            const anyHit  = hdrHit || gameHit;

            // Cursor dot — prefer game hit position for accuracy
            if (gameHit) {
                cursorWorld = [
                    scx + (gameHit.u*2-1)*GAME_HW*camRight[0] - camFwd[0]*0.012,
                    scy + (1-gameHit.v*2)*GAME_HH                - camFwd[1]*0.012,
                    scz + (gameHit.u*2-1)*GAME_HW*camRight[2] - camFwd[2]*0.012,
                ];
            } else if (hdrHit) {
                cursorWorld = [
                    scx + (hdrHit.u*2-1)*GAME_HW*camRight[0] - camFwd[0]*0.012,
                    hdrCy + (1-hdrHit.v*2)*HDR_HH              - camFwd[1]*0.012,
                    scz + (hdrHit.u*2-1)*GAME_HW*camRight[2] - camFwd[2]*0.012,
                ];
            }

            // ── Move: trigger + grip together, from either quad ──────────────
            if (bothNow && !bothWas && anyHit && !this._screenGrabSrc) {
                // Distance to game anchor (header moves with it automatically)
                const dx=scx-or.x, dy=scy-or.y, dz=scz-or.z;
                this._screenGrabDist = Math.sqrt(dx*dx+dy*dy+dz*dz);
                this._screenGrabSrc = src.handedness;
            }
            if (bothNow && this._screenGrabSrc === src.handedness) {
                const d = this._screenGrabDist ?? 2.2;
                this._screenAnchor = { x:or.x+dr[0]*d, y:or.y+dr[1]*d, z:or.z+dr[2]*d };
            }
            if (!bothNow && this._screenGrabSrc === src.handedness) this._screenGrabSrc = null;

            // ── Clicks/buttons (not in move mode) ────────────────────────────
            if (anyHit && !this._screenGrabSrc) {
                if (hdrHit) {
                    // Header: minimize/restore + toolbar buttons
                    if (trigPressed && !gripNow) {
                        const mb = this._screenMiniBtn;
                        if (mb && hdrHit.u>=mb.u0&&hdrHit.u<=mb.u1&&hdrHit.v>=mb.v0&&hdrHit.v<=mb.v1) {
                            this._screenMinimized = !this._screenMinimized;
                            this._screenHdrDirty = true;
                        } else if (!mini) {
                            for (const tb of (this._screenToolBtns || [])) {
                                if (hdrHit.u>=tb.u0&&hdrHit.u<=tb.u1&&hdrHit.v>=tb.v0&&hdrHit.v<=tb.v1) {
                                    this._execYMenuAction(tb.action); break;
                                }
                            }
                        }
                    }
                } else if (gameHit) {
                    // Game area: left-click, right-click, hover
                    if (trigPressed && !gripNow) {
                        this._applyGameCursor({u: gameHit.u, v: gameHit.v}, true, false);
                    } else if (gripPressed && !trigNow) {
                        this._applyGameCursor({u: gameHit.u, v: gameHit.v}, false, true);
                    } else if (!trigNow && !gripNow) {
                        this._applyGameCursor({u: gameHit.u, v: gameHit.v}, false, false);
                    }
                }
            }

            this._screenTrigWas.set(src.handedness, trigNow);
            this._screenGripWas.set(src.handedness, gripNow);
        }

        // Per-eye render
        gl.bindFramebuffer(gl.FRAMEBUFFER, xrFb);
        gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.disable(gl.DEPTH_TEST); gl.disable(gl.CULL_FACE);
        for (const view of pose.views) {
            const vp = this._xrLayer.getViewport(view);
            gl.viewport(vp.x,vp.y,vp.width,vp.height);
            const pv = this._m4mul(view.projectionMatrix, view.transform.inverse.matrix);
            if (!mini) {
                // Full-resolution game capture — true 16:9, nothing cropped
                this._drawQuad(gl, this._screenTex,
                    this._m4mul(pv, this._m4billboard(scx,scy,scz, GAME_HW,GAME_HH, camRight,worldUp)));
            }
            // Header bar (title + toolbar) floats above game quad at all times
            this._drawQuad(gl, this._screenHdrTex,
                this._m4mul(pv, this._m4billboard(scx,hdrCy,scz, GAME_HW,HDR_HH, camRight,worldUp)));
            if (cursorWorld) {
                this._drawQuad(gl, this._cursorTex,
                    this._m4mul(pv, this._m4billboard(
                        cursorWorld[0], cursorWorld[1], cursorWorld[2],
                        0.025, 0.025, camRight, worldUp)));
            }
        }
        this._restoreGL(gl, saved);
    }

    // ── Floating chat / video-URL input panel ─────────────────────────────────
    _renderFloatingInput(frame, pose, gl, xrFb) {
        if (!this._chatMode && !this._vrUrlMode) return;
        if (!xrFb) return;
        if (!this._glInited) this._initGLResources();
        if (!this._glInited) return;

        const saved = this._saveGL(gl);
        const IW = 860, IH = 370;
        const BILL_HW = 0.68, BILL_HH = BILL_HW * IH / IW; // ≈ 0.292 m

        const isVideo = !!this._vrUrlMode;
        const curText = isVideo ? (this._vrUrlText || '') : (this._chatText || '');

        if (!this._inputTex) {
            this._inputCanvas = document.createElement('canvas');
            this._inputCanvas.width = IW; this._inputCanvas.height = IH;
            this._inputTex = this._mkTex(gl, IW, IH);
            this._inputLastText = null;
            this._inputLastMode = null;
        }

        // Redraw whenever text or mode changes
        if (curText !== this._inputLastText || isVideo !== this._inputLastMode) {
            this._inputLastText = curText; this._inputLastMode = isVideo;
            const ctx = this._inputCanvas.getContext('2d');
            ctx.clearRect(0, 0, IW, IH);
            // Background
            const accent = isVideo ? '#00bb66' : '#3388ff';
            const accentDark = isVideo ? 'rgba(0,60,30,0.97)' : 'rgba(6,14,52,0.97)';
            ctx.fillStyle = accentDark;
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(2,2,IW-4,IH-4,14); else ctx.rect(2,2,IW-4,IH-4);
            ctx.fill();
            ctx.strokeStyle = accent; ctx.lineWidth = 3;
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(2,2,IW-4,IH-4,14); else ctx.rect(2,2,IW-4,IH-4);
            ctx.stroke();
            // Title
            ctx.fillStyle = isVideo ? '#80ffd8' : '#88ccff';
            ctx.font = 'bold 30px system-ui,sans-serif';
            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
            ctx.fillText(isVideo ? '📺  Enter Video URL' : '💬  Chat Message', IW/2, 18);
            // Text display box
            const bx=20, by=68, bw=IW-40, bh=96;
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.strokeStyle = accent; ctx.lineWidth = 2;
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(bx,by,bw,bh,8); else ctx.rect(bx,by,bw,bh);
            ctx.fill(); ctx.stroke();
            // Typed text or placeholder
            ctx.font = '26px monospace'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
            ctx.fillStyle = curText ? '#ddeeff' : 'rgba(120,160,220,0.5)';
            const disp = curText || (isVideo ? 'https://...' : 'Type your message…');
            // Truncate from left if too long
            const maxW = bw - 24;
            let d = disp;
            while (d.length > 1 && ctx.measureText(d).width > maxW) d = d.slice(1);
            if (d !== disp) d = '…' + d.slice(1);
            ctx.fillText(d, bx+12, by+bh/2);
            // Cursor bar
            if (curText) {
                const tw = ctx.measureText(d).width;
                ctx.fillStyle = accent;
                ctx.fillRect(bx+14+Math.min(tw, maxW-4), by+14, 2, bh-28);
            }
            // Hint
            ctx.fillStyle = 'rgba(160,200,255,0.7)'; ctx.font = '16px system-ui,sans-serif';
            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
            ctx.fillText('Type with Meta keyboard  ·  Trigger = click buttons  ·  Grip+Trigger = move window', IW/2, by+bh+10);
            // Send / Play button
            const sbx=20, sby=IH-90, sbw=Math.round(IW*0.55)-10, sbh=72;
            ctx.fillStyle = isVideo ? 'rgba(0,100,50,0.9)' : 'rgba(20,60,180,0.9)';
            ctx.strokeStyle = accent; ctx.lineWidth = 2;
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(sbx,sby,sbw,sbh,10); else ctx.rect(sbx,sby,sbw,sbh);
            ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#ffffff'; ctx.font = 'bold 26px system-ui,sans-serif';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(isVideo ? '▶  Play' : '✉  Send', sbx+sbw/2, sby+sbh/2);
            this._inputSendBtn = { u0:sbx/IW, u1:(sbx+sbw)/IW, v0:sby/IH, v1:(sby+sbh)/IH };
            // Cancel button
            const cbx=sbx+sbw+16, cby=sby, cbw=IW-cbx-20, cbh=sbh;
            ctx.fillStyle = 'rgba(80,10,10,0.9)'; ctx.strokeStyle = '#cc4444';
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(cbx,cby,cbw,cbh,10); else ctx.rect(cbx,cby,cbw,cbh);
            ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#ffaaaa'; ctx.font = 'bold 26px system-ui,sans-serif';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('✕  Cancel', cbx+cbw/2, cby+cbh/2);
            this._inputCancelBtn = { u0:cbx/IW, u1:(cbx+cbw)/IW, v0:cby/IH, v1:(cby+cbh)/IH };
            this._uploadCanvas2Tex(gl, this._inputTex, this._inputCanvas);
        }

        // Camera vectors
        const camFwd = this._rayDir(pose.transform.orientation);
        let rx=-camFwd[2],ry=0,rz=camFwd[0];
        const rl=Math.hypot(rx,ry,rz);
        if (rl>1e-6){rx/=rl;ry/=rl;rz/=rl;}else{rx=1;ry=0;rz=0;}
        const camRight=[rx,ry,rz];
        const hp = pose.transform.position;

        // Reset anchor to front-and-centre on each new open
        if (this._inputAnchorNeedsReset || !this._inputAnchor) {
            this._inputAnchorNeedsReset = false;
            this._inputAnchor = {
                x: hp.x + camFwd[0]*1.8,
                y: hp.y + camFwd[1]*1.8 + 0.25,
                z: hp.z + camFwd[2]*1.8,
            };
        }
        const {x:icx, y:icy, z:icz} = this._inputAnchor;

        if (!this._inputGripWas) this._inputGripWas = new Map();
        if (!this._inputTrigWas) this._inputTrigWas = new Map();

        let inputCursorWorld = null;
        for (const src of this._session.inputSources) {
            const rp = frame.getPose(src.targetRaySpace, this._refSpace);
            if (!rp) continue;
            const or = rp.transform.position;
            const dr = this._rayDir(rp.transform.orientation);
            const oa = [or.x,or.y,or.z];
            const trigNow = src.gamepad?.buttons[0]?.pressed??false;
            const gripNow = src.gamepad?.buttons[1]?.pressed??false;
            const gripWas = this._inputGripWas.get(src.handedness)??false;
            const trigWas = this._inputTrigWas.get(src.handedness)??false;
            const trigPressed = trigNow && !trigWas;
            const bothNow = trigNow && gripNow;
            const bothWas = trigWas && gripWas;

            const hit = this._rayHitBillboard(oa,dr,[icx,icy,icz],camFwd,camRight,[0,1,0],BILL_HW,BILL_HH);

            if (hit) {
                inputCursorWorld = [
                    icx + (hit.u*2-1)*BILL_HW*camRight[0] - camFwd[0]*0.012,
                    icy + (1-hit.v*2)*BILL_HH              - camFwd[1]*0.012,
                    icz + (hit.u*2-1)*BILL_HW*camRight[2] - camFwd[2]*0.012,
                ];
            }

            // Grip+Trigger: move panel
            if (bothNow && !bothWas && hit && !this._inputGrabSrc) {
                const dx=icx-or.x, dy=icy-or.y, dz=icz-or.z;
                this._inputGrabDist = Math.sqrt(dx*dx+dy*dy+dz*dz);
                this._inputGrabSrc = src.handedness;
            }
            if (bothNow && this._inputGrabSrc === src.handedness) {
                const d = this._inputGrabDist ?? 1.8;
                this._inputAnchor = { x:or.x+dr[0]*d, y:or.y+dr[1]*d, z:or.z+dr[2]*d };
            }
            if (!bothNow && this._inputGrabSrc === src.handedness) this._inputGrabSrc = null;

            // Trigger alone: click Send / Cancel
            if (hit && trigPressed && !gripNow && !this._inputGrabSrc) {
                const sb = this._inputSendBtn;
                const cb = this._inputCancelBtn;
                if (sb && hit.u>=sb.u0&&hit.u<=sb.u1&&hit.v>=sb.v0&&hit.v<=sb.v1) {
                    if (isVideo) this._execYMenuAction('video_url_play');
                    else this._vrChatSend();
                } else if (cb && hit.u>=cb.u0&&hit.u<=cb.u1&&hit.v>=cb.v0&&hit.v<=cb.v1) {
                    if (isVideo) this._execYMenuAction('video_url_cancel');
                    else this._closeVRChat();
                }
            }

            this._inputTrigWas.set(src.handedness, trigNow);
            this._inputGripWas.set(src.handedness, gripNow);
        }

        // Per-eye render
        gl.bindFramebuffer(gl.FRAMEBUFFER, xrFb);
        gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.disable(gl.DEPTH_TEST); gl.disable(gl.CULL_FACE);
        for (const view of pose.views) {
            const vp = this._xrLayer.getViewport(view);
            gl.viewport(vp.x,vp.y,vp.width,vp.height);
            const pv = this._m4mul(view.projectionMatrix, view.transform.inverse.matrix);
            this._drawQuad(gl, this._inputTex,
                this._m4mul(pv, this._m4billboard(icx,icy,icz, BILL_HW,BILL_HH, camRight,[0,1,0])));
            if (inputCursorWorld) {
                this._drawQuad(gl, this._cursorTex,
                    this._m4mul(pv, this._m4billboard(
                        inputCursorWorld[0], inputCursorWorld[1], inputCursorWorld[2],
                        0.025, 0.025, camRight, [0,1,0])));
            }
        }
        this._restoreGL(gl, saved);
    }

    _execVRVideoAction(action, vs) {
        if (action === 'vr_vid_playpause') {
            vs._vid.paused ? vs._vid.play() : vs._vid.pause();
        } else if (action === 'vr_vid_stop') {
            vs.stop();
        } else if (action === 'vr_vid_close') {
            vs.stop();
        } else if (action === 'vr_vid_url') {
            // Open the URL input panel in the Y-menu
            if (window.vrManager) {
                window.vrManager._ymenuOpen = true;
                window.vrManager._vrUrlMode = true;
                window.vrManager._redrawMenuPanel();
            }
        }
    }

    // ── VR launch hint overlay ────────────────────────────────────────────────
    // Renders a "press the home button" message directly into the XR
    // framebuffer so it is visible through the headset during the game-loop
    // startup delay.  Active only on handoff-session launches (VRWebsiteMode →
    // game), removed automatically once _gameLoopRunningViaXR becomes true.

    _initHintOverlay() {
        const gl = this._getGL();

        // Draw the hint on a 2D canvas → upload as a GL texture.
        const CW = 1024, CH = 1024;
        const oc = document.createElement('canvas');
        oc.width = CW; oc.height = CH;
        const ctx = oc.getContext('2d');

        // Solid black background for the full canvas.
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, CW, CH);

        // Rounded-rect card.
        const pad = 60, r = 40;
        const bx = pad, by = CH * 0.18, bw = CW - pad * 2, bh = CH * 0.62;
        ctx.fillStyle = 'rgba(30,30,30,0.95)';
        ctx.beginPath();
        ctx.moveTo(bx + r, by);
        ctx.arcTo(bx + bw, by,       bx + bw, by + bh, r);
        ctx.arcTo(bx + bw, by + bh,  bx,      by + bh, r);
        ctx.arcTo(bx,      by + bh,  bx,      by,      r);
        ctx.arcTo(bx,      by,       bx + bw, by,      r);
        ctx.closePath();
        ctx.fill();

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Home icon
        ctx.font = '110px sans-serif';
        ctx.fillStyle = '#fff';
        ctx.fillText('🏠', CW / 2, by + bh * 0.22);

        // Title
        ctx.font = 'bold 64px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Press the Home button', CW / 2, by + bh * 0.48);

        // Body
        ctx.font = '40px sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.82)';
        ctx.fillText('Look at this browser window,', CW / 2, by + bh * 0.66);
        ctx.fillText('then close the menu to start.', CW / 2, by + bh * 0.80);

        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, oc);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);

        const vsrc = `#version 300 es
            in vec2 a_pos;
            out vec2 v_uv;
            void main() {
                v_uv = vec2(a_pos.x * 0.5 + 0.5, 0.5 - a_pos.y * 0.5);
                gl_Position = vec4(a_pos, 0.0, 1.0);
            }`;
        const fsrc = `#version 300 es
            precision mediump float;
            in vec2 v_uv;
            uniform sampler2D u_tex;
            out vec4 fragColor;
            void main() { fragColor = texture(u_tex, v_uv); }`;

        const compileShader = (type, src) => {
            const s = gl.createShader(type);
            gl.shaderSource(s, src);
            gl.compileShader(s);
            return s;
        };
        const prog = gl.createProgram();
        gl.attachShader(prog, compileShader(gl.VERTEX_SHADER,   vsrc));
        gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, fsrc));
        gl.linkProgram(prog);

        const vbuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1,-1,  1,-1,  -1, 1,
             1,-1,  1, 1,  -1, 1,
        ]), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        this._hintOverlay = { tex, prog, vbuf, aPos: gl.getAttribLocation(prog, 'a_pos') };
    }

    _renderHintOverlay(pose) {
        const gl  = this._getGL();
        const { tex, prog, vbuf, aPos } = this._hintOverlay;
        const xrFb = this._xrLayer.framebuffer;

        gl.bindFramebuffer(gl.FRAMEBUFFER, xrFb);
        gl.useProgram(prog);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.BLEND);

        for (const view of pose.views) {
            const vp = this._xrLayer.getViewport(view);
            gl.viewport(vp.x, vp.y, vp.width, vp.height);
            gl.scissor(vp.x, vp.y, vp.width, vp.height);
            gl.enable(gl.SCISSOR_TEST);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }

        gl.disable(gl.SCISSOR_TEST);
        gl.disableVertexAttribArray(aPos);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    _destroyHintOverlay() {
        if (!this._hintOverlay) return;
        const gl = this._getGL();
        gl.deleteTexture(this._hintOverlay.tex);
        gl.deleteProgram(this._hintOverlay.prog);
        gl.deleteBuffer(this._hintOverlay.vbuf);
        this._hintOverlay = null;
    }

    // ── Head tracking ─────────────────────────────────────────────────────────

    _processHeadPose(quat) {
        const { x: cx, y: cy, z: cz, w: cw } = quat;

        // ── Calibration: record the initial headset orientation the first time
        // this is called in a VR session.  All subsequent frames express the
        // orientation RELATIVE to this reference, so when the player looks
        // back to the calibration direction the relative value is exactly
        // (0, 0) and the game camera returns to its starting position.
        // This completely eliminates drift: values are derived fresh from the
        // raw quaternion each frame, never accumulated from frame to frame.
        if (!this._xrCalibQuat) {
            this._xrCalibQuat = { x: cx, y: cy, z: cz, w: cw };
        }
        const { x: bx, y: by, z: bz, w: bw } = this._xrCalibQuat;

        // Rotate the forward vector (0,0,-1) by q_current into world space,
        // and separately by q_calib into world space, then compare.
        // This keeps pitch purely world-relative (elevation above horizontal)
        // so it is never affected by yaw frame, joystick turns, or gimbal lock.
        //
        // rotate_fwd(q) = q * (0,0,-1) * conj(q)
        // Using the sandwich formula shortcut for v=(0,0,-1):
        //   t = 2 * cross(q.xyz, v)  →  cross((qx,qy,qz),(0,0,-1)) = (-qy, qx, 0)
        //   t = (-2*qy, 2*qx, 0)
        //   result = v + qw*t + cross(q.xyz, t)
        const rot_fwd = (qx, qy, qz, qw) => {
            const tx = -2*qy, ty = 2*qx; // tz=0
            return {
                x:      qw*tx + (qy*0  - qz*ty),
                y:      qw*ty + (qz*tx - qx*0 ),
                z: -1 +         (qx*ty - qy*tx),
            };
        };

        const fwd     = rot_fwd(cx, cy, cz, cw);  // current   forward in world
        const fwd_cal = rot_fwd(bx, by, bz, bw);  // calib     forward in world

        // Pitch = world-space elevation of the current forward vector.
        // Completely independent of yaw; never affected by joystick turns.
        const pitch_rel = Math.asin(Math.max(-1, Math.min(1, fwd.y)));

        // Yaw = world-space azimuth difference between current and calibration.
        // _xrYawOffset (joystick turns, degrees) is added in the same frame.
        const yaw_world     = Math.atan2(fwd.x,     -fwd.z);
        const yaw_world_cal = Math.atan2(fwd_cal.x, -fwd_cal.z);
        // Negate: in Minetest, camera_yaw decreasing = turning right.
        // Turning head right → yaw_world increases → we need xr_yaw to decrease.
        const yaw_rel       = yaw_world_cal - yaw_world;

        // Convert to degrees and push directly into the engine's camera.
        // _xrYawOffset accumulates joystick smooth-turn; adding it here keeps
        // pitch completely unaffected by joystick turns.
        if (webxr_set_look) {
            const RAD2DEG = 180 / Math.PI;
            webxr_set_look(yaw_rel * RAD2DEG + this._xrYawOffset, pitch_rel * RAD2DEG);
        }
    }

    _dispatchMouseDelta(dx, dy) {
        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) return;
        if (webxr_inject_mouse_delta) {
            // Inject directly into the engine's atomic accumulators, bypassing
            // the SDL synthetic-event pipeline which is unreliable on Quest.
            webxr_inject_mouse_delta(Math.round(dx), Math.round(dy));
        } else {
            // Fallback: synthetic DOM event (used before WASM is fully loaded).
            const rect = mtCanvas.getBoundingClientRect();
            const cx = rect.left + rect.width  / 2;
            const cy = rect.top  + rect.height / 2;
            mtCanvas.dispatchEvent(new MouseEvent('mousemove', {
                bubbles: true, cancelable: true,
                clientX: cx, clientY: cy,
                movementX: Math.round(dx),
                movementY: Math.round(dy),
            }));
        }
    }

    // ── XR controller input (immersive session) ───────────────────────────────

    _processXRInputSources(frame, dtime) {
        for (const src of this._session.inputSources) {
            if (!src.gamepad) continue;
            this._handleControllerInput(src.gamepad, src.handedness, dtime);
        }
    }

    // ── Fallback mode: Gamepad API + DeviceOrientation ────────────────────────

    _startFallbackMode() {
        this._inVR = true;
        this._setButtonActive(true);
        this._startGamepadPoll();
        // Try DeviceOrientation for head tracking in flat-screen / cardboard mode.
        if (typeof DeviceOrientationEvent !== 'undefined') {
            this._deviceOriHandler = this._onDeviceOrientation.bind(this);
            const reqPerm = DeviceOrientationEvent.requestPermission;
            if (typeof reqPerm === 'function') {
                reqPerm().then(perm => {
                    if (perm === 'granted') {
                        window.addEventListener('deviceorientation', this._deviceOriHandler);
                    }
                }).catch(() => {});
            } else {
                window.addEventListener('deviceorientation', this._deviceOriHandler);
            }
        }
    }

    _onDeviceOrientation(e) {
        if (!this._inVR || this._session) return;
        const yaw   = (e.alpha || 0) * Math.PI / 180;
        const pitch = (e.beta  || 0) * Math.PI / 180;
        if (this._prevOrient !== null) {
            let dy = yaw - this._prevOrient.yaw;
            if (dy >  Math.PI) dy -= 2 * Math.PI;
            if (dy < -Math.PI) dy += 2 * Math.PI;
            const dp = -(pitch - this._prevOrient.pitch);
            this._dispatchMouseDelta(dy * 400, dp * 400);
        }
        this._prevOrient = { yaw, pitch };
    }

    _removeDeviceOriListener() {
        if (this._deviceOriHandler) {
            window.removeEventListener('deviceorientation', this._deviceOriHandler);
            this._deviceOriHandler = null;
        }
        this._prevOrient = null;
    }

    _startGamepadPoll() {
        if (this._gamepadPollId) return;
        const poll = () => {
            if (!this._inVR || this._session) return; // XR session handles its own input
            const pads = navigator.getGamepads ? navigator.getGamepads() : [];
            for (const gp of pads) {
                if (!gp) continue;
                // Detect handedness from the gamepad id string when possible
                // (Quest controllers include 'left'/'right'; Pico controllers do not,
                // so fall back to even=left / odd=right index convention).
                const idLow = gp.id.toLowerCase();
                const h = idLow.includes('left') ? 'left'
                        : idLow.includes('right') ? 'right'
                        : (gp.index % 2 === 0 ? 'left' : 'right');
                this._handleControllerInput(gp, h);
            }
            this._gamepadPollId = requestAnimationFrame(poll);
        };
        this._gamepadPollId = requestAnimationFrame(poll);
    }

    _stopGamepadPoll() {
        if (this._gamepadPollId) {
            cancelAnimationFrame(this._gamepadPollId);
            this._gamepadPollId = null;
        }
    }

    // ── Unified controller mapping ────────────────────────────────────────────
    //
    // WebXR gamepad spec (Quest 2/3):
    //   buttons[0] = trigger    buttons[1] = grip/squeeze
    //   buttons[3] = thumbstick click
    //   Left:  buttons[4]=X  buttons[5]=Y
    //   Right: buttons[4]=A  buttons[5]=B
    //   axes[0,1] = touchpad (or unused)
    //   axes[2,3] = thumbstick X,Y

    _handleControllerInput(gp, handedness, dtime = 1/72) {
        const key  = handedness + ':' + (gp.index != null ? gp.index : 'x');
        const prev = this._gamepadStates.get(key) || { buttons: [], axes: [] };
        const btns = gp.buttons;
        const axes = gp.axes;

        // Always update state for edge-detection, but suppress game events in Y menu.
        const dispatch = !this._ymenuOpen;

        const isDown  = (i) => btns[i] ? (btns[i].pressed || btns[i].value > 0.5) : false;
        const wasDown = (i) => prev.buttons[i] ?
            (prev.buttons[i].pressed || prev.buttons[i].value > 0.5) : false;
        const ax = (hi, lo) => axes.length > hi ? axes[hi] : (axes[lo] || 0);

        if (dispatch) {
            if (handedness === 'left') {
                const lx = ax(2, 0), ly = ax(3, 1);
                const px = prev.axes[2] != null ? prev.axes[2] : (prev.axes[0] || 0);
                const py = prev.axes[3] != null ? prev.axes[3] : (prev.axes[1] || 0);
                this._stickToWASD(lx, ly, px, py);
                this._btnToKey  (isDown(0), wasDown(0), ' ',      'Space',    32);
                this._btnToKey  (isDown(1), wasDown(1), 'Shift',  'ShiftLeft',16);
                this._btnToKey  (isDown(4), wasDown(4), 'e',      'KeyE',     69);
                if (isDown(5) && !wasDown(5)) this._toggleYMenu();
                // Double-tap left grip → toggle fly (K key)
                if (isDown(1) && !wasDown(1)) {
                    const now = performance.now();
                    if (now - (this._leftGripTap || 0) < 400) {
                        this._fireKey('keydown', 'k', 'KeyK', 75);
                        this._fireKey('keyup',   'k', 'KeyK', 75);
                        this._leftGripTap = 0;
                    } else {
                        this._leftGripTap = now;
                    }
                }
            }
            if (handedness === 'right') {
                this._btnToMouse(isDown(0), wasDown(0), 0);
                this._btnToMouse(isDown(1), wasDown(1), 2);
                this._btnToKey  (isDown(4), wasDown(4), 'q', 'KeyQ', 81);
                this._btnToKey  (isDown(5), wasDown(5), 't', 'KeyT', 84);
                const rsx  = ax(2, 0);
                const prsx = prev.axes[2] != null ? prev.axes[2] : (prev.axes[0] || 0);
                // Right grip held + right stick → hotbar scroll; otherwise smooth turn
                if (isDown(1)) {
                    this._stickToHotbar(rsx, prsx);
                } else {
                    this._stickToTurn(rsx, dtime);
                }
            }
        } else {
            // Y menu open:
            // Y button (left btn 5) closes the menu
            if (handedness === 'left' && isDown(5) && !wasDown(5)) this._toggleYMenu();
            // Right stick → hotbar scroll (useful when browsing items
            // while inventory or game screen is visible in the Y menu)
            if (handedness === 'right') {
                const rsx  = ax(2, 0);
                const prsx = prev.axes[2] != null ? prev.axes[2] : (prev.axes[0] || 0);
                this._stickToHotbar(rsx, prsx);
            }
        }

        this._gamepadStates.set(key, {
            buttons: Array.from(btns, b => ({ pressed: b.pressed, value: b.value })),
            axes:    Array.from(axes),
        });
    }

    _stickToWASD(x, y, px, py) {
        const D = 0.25;
        this._btnToKey(y < -D, py < -D, 'w', 'KeyW', 87);
        this._btnToKey(y >  D, py >  D, 's', 'KeyS', 83);
        this._btnToKey(x < -D, px < -D, 'a', 'KeyA', 65);
        this._btnToKey(x >  D, px >  D, 'd', 'KeyD', 68);
    }

    // Smooth turn: rotates the calibration quaternion around world-Y so that
    // the player's forward direction shifts, giving a VR-safe smooth turn.
    // Speed is 120°/s at full deflection; deadzone = 0.25.
    _stickToTurn(x, dtime) {
        const D = 0.25;
        if (Math.abs(x) <= D) return;
        const SPEED = 120; // degrees per second at full stick
        const normalised = (Math.abs(x) - D) / (1.0 - D);
        const deltaDeg = Math.sign(x) * normalised * SPEED * dtime;
        this._rotateCalibration(deltaDeg);
    }

    // Accumulates a yaw offset (in degrees) for joystick smooth-turn.
    // Using a scalar offset instead of mutating the calibration quaternion
    // ensures pitch is never affected by turning.
    // Right stick x > 0 → deltaDeg > 0 → xr_yaw decreases → turns right.
    _rotateCalibration(deltaDeg) {
        this._xrYawOffset -= deltaDeg;
    }

    _stickToHotbar(x, px) {
        const D = 0.6;
        const rect = mtCanvas.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        if (x < -D && !(px < -D)) {
            mtCanvas.dispatchEvent(new WheelEvent('wheel',
                { bubbles: true, cancelable: true, deltaY: -100, clientX: cx, clientY: cy }));
        }
        if (x >  D && !(px >  D)) {
            mtCanvas.dispatchEvent(new WheelEvent('wheel',
                { bubbles: true, cancelable: true, deltaY:  100, clientX: cx, clientY: cy }));
        }
    }

    _btnToKey(isDown, wasDown, key, code, keyCode) {
        if (isDown  && !wasDown) this._fireKey('keydown', key, code, keyCode);
        if (!isDown &&  wasDown) this._fireKey('keyup',   key, code, keyCode);
    }

    _btnToMouse(isDown, wasDown, button) {
        if (isDown === wasDown) return;
        const rect = mtCanvas.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        const type = isDown ? 'mousedown' : 'mouseup';
        mtCanvas.dispatchEvent(new MouseEvent(type,
            { bubbles: true, cancelable: true, button, clientX: cx, clientY: cy }));
    }

    _fireKey(type, key, code, keyCode) {
        mtCanvas.dispatchEvent(new KeyboardEvent(type,
            { bubbles: true, cancelable: true, key, code, keyCode, which: keyCode }));
    }

    // ── Y Menu ────────────────────────────────────────────────────────────────
    // Press Y to enter a black virtual space: game screen ahead, menu panel below.
    // Right controller ray + trigger interact with buttons.
    // All game input is suppressed while the menu is open.

    _toggleYMenu() {
        this._ymenuOpen = !this._ymenuOpen;
        if (this._ymenuOpen) {
            this._initGLResources();
            this._ymenuHovered  = -1;
            this._ymenuTrigWas  = false;
            // Reset any open chat subpanel when re-opening the main menu
            this._chatMode      = false;
            this._chatText      = '';
            this._chatHovered   = -1;
            if (this._chatInp) { this._chatInp.value = ''; this._chatInp.blur(); }
            this._redrawMenuPanel();
        } else {
            // Closing the menu — also dismiss any active chat overlay
            if (this._chatMode) {
                this._chatMode = false;
                if (this._chatInp) { this._chatInp.value = ''; this._chatInp.blur(); }
            }
        }
    }

    // ── One-time GL resource creation ─────────────────────────────────────────

    _initGLResources() {
        if (this._glInited) return;
        this._glInited = true;
        const gl = this._getGL();

        // Save GL state — this runs inside the XR frame callback (during input
        // processing), so Irrlicht's state cache must be left completely intact.
        const _sAT  = gl.getParameter(gl.ACTIVE_TEXTURE);
        gl.activeTexture(gl.TEXTURE0);
        const _sT0  = gl.getParameter(gl.TEXTURE_BINDING_2D);
        const _sVAO = gl.getParameter(gl.VERTEX_ARRAY_BINDING);
        const _sVBO = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
        const _sPrg = gl.getParameter(gl.CURRENT_PROGRAM);
        const _sRFB = gl.getParameter(gl.READ_FRAMEBUFFER_BINDING);
        const _sDFB = gl.getParameter(gl.DRAW_FRAMEBUFFER_BINDING);

        const QV = `#version 300 es
precision highp float;
in vec2 a_pos;
uniform mat4 u_mvp;
out vec2 v_uv;
void main() {
    v_uv = a_pos * 0.5 + 0.5;
    gl_Position = u_mvp * vec4(a_pos, 0.0, 1.0);
}`;
        const QF = `#version 300 es
precision mediump float;
in vec2 v_uv;
uniform sampler2D u_tex;
out vec4 c;
void main() { c = texture(u_tex, v_uv); }`;

        // Ray (line) program
        const LV = `#version 300 es
precision highp float;
in vec3 a_pos;
uniform mat4 u_vp;
void main() { gl_Position = u_vp * vec4(a_pos, 1.0); }`;
        const LF = `#version 300 es
precision mediump float;
out vec4 c;
void main() { c = vec4(1.0, 0.4, 0.1, 1.0); }`;

        this._qProg = this._mkProg(gl, QV, QF);
        this._lProg = this._mkProg(gl, LV, LF);

        // Cache uniform locations (avoids per-frame string lookup)
        this._qMvpLoc = gl.getUniformLocation(this._qProg, 'u_mvp');
        this._qTexLoc = gl.getUniformLocation(this._qProg, 'u_tex');
        this._lVpLoc  = gl.getUniformLocation(this._lProg, 'u_vp');

        // Quad VAO — isolates attrib state from the game engine
        this._qVAO = gl.createVertexArray();
        gl.bindVertexArray(this._qVAO);
        const qvb = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, qvb);
        gl.bufferData(gl.ARRAY_BUFFER,
            new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
        const qa = gl.getAttribLocation(this._qProg, 'a_pos');
        gl.enableVertexAttribArray(qa);
        gl.vertexAttribPointer(qa, 2, gl.FLOAT, false, 0, 0);
        gl.bindVertexArray(null);

        // Line VAO
        this._lVAO = gl.createVertexArray();
        gl.bindVertexArray(this._lVAO);
        this._lVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._lVBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(6), gl.DYNAMIC_DRAW);
        const la = gl.getAttribLocation(this._lProg, 'a_pos');
        gl.enableVertexAttribArray(la);
        gl.vertexAttribPointer(la, 3, gl.FLOAT, false, 0, 0);
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        // Game-frame capture: blit default FB → FBO each Y menu frame
        this._gameTex = this._mkTex(gl, 4, 4);   // resized lazily on first use
        this._gameFBO = gl.createFramebuffer();
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this._gameFBO);
        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
            gl.TEXTURE_2D, this._gameTex, 0);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
        this._gameCapW = 0; this._gameCapH = 0;

        // Menu-panel 2D canvas → texture
        this._mCanvas = document.createElement('canvas');
        this._mCanvas.width  = 1024;
        this._mCanvas.height = 512;
        this._mCtx   = this._mCanvas.getContext('2d');
        this._menuTex = this._mkTex(gl, this._mCanvas.width, this._mCanvas.height);

        // Cursor dot texture: 32×32 glowing yellow circle with smooth alpha falloff.
        // Built from raw pixel data to avoid any canvas 2D / FLIP_Y interaction.
        {
            const SZ = 32, CX = 15.5, CY = 15.5, CR = 13;
            const d = new Uint8Array(SZ * SZ * 4);
            for (let py = 0; py < SZ; py++) for (let px = 0; px < SZ; px++) {
                const r = Math.hypot(px - CX, py - CY);
                const a = Math.max(0, 1 - r / CR);
                const i = (py * SZ + px) * 4;
                d[i] = 255; d[i+1] = 230; d[i+2] = 60;  // warm yellow
                d[i+3] = Math.round(a * a * 255);
            }
            this._cursorTex = this._mkTex(gl, SZ, SZ);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this._cursorTex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, SZ, SZ, 0, gl.RGBA, gl.UNSIGNED_BYTE, d);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }

        // Video screen texture (shared with VideoScreen for VR billboard)
        this._videoTex     = this._mkTex(gl, 4, 4);
        this._videoCtrlTex = this._mkTex(gl, 4, 4);  // control bar below video screen

        // Restore GL state so Irrlicht's cache stays in sync.
        gl.bindTexture(gl.TEXTURE_2D, _sT0);
        gl.activeTexture(_sAT);
        gl.bindVertexArray(_sVAO);
        gl.bindBuffer(gl.ARRAY_BUFFER, _sVBO);
        gl.useProgram(_sPrg);
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, _sRFB);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, _sDFB);

        // Hook into Minetest's chat receive so the floating chat panel can show messages
        if (!window._vrChatLog) {
            window._vrChatLog = [];
            const _prev = window.minetest_receive_chat_message;
            window.minetest_receive_chat_message = (name, msg) => {
                window._vrChatLog.push({ name: name || '', msg: msg || '' });
                if (window._vrChatLog.length > 30) window._vrChatLog.shift();
                window._vrChatNewMsg = true;
                if (_prev) _prev(name, msg);
            };
        }
    }

    _mkTex(gl, w, h) {
        const t = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return t;
    }

    _mkProg(gl, vsrc, fsrc) {
        const mkSh = (type, src) => {
            const s = gl.createShader(type);
            gl.shaderSource(s, src);
            gl.compileShader(s);
            if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
                console.error('[YMenu] shader:', gl.getShaderInfoLog(s));
            return s;
        };
        const p = gl.createProgram();
        gl.attachShader(p, mkSh(gl.VERTEX_SHADER, vsrc));
        gl.attachShader(p, mkSh(gl.FRAGMENT_SHADER, fsrc));
        gl.linkProgram(p);
        if (!gl.getProgramParameter(p, gl.LINK_STATUS))
            console.error('[YMenu] link:', gl.getProgramInfoLog(p));
        return p;
    }

    // ── Save & restore the full GL state we touch ─────────────────────────────

    _saveGL(gl) {
        // We always use TEXTURE0 internally.  Save it specifically so we can
        // restore it even when Irrlicht's active unit is something else.
        const activeTex = gl.getParameter(gl.ACTIVE_TEXTURE);
        let tex0;
        if (activeTex === gl.TEXTURE0) {
            tex0 = gl.getParameter(gl.TEXTURE_BINDING_2D);
        } else {
            gl.activeTexture(gl.TEXTURE0);
            tex0 = gl.getParameter(gl.TEXTURE_BINDING_2D);
            gl.activeTexture(activeTex);   // net-zero JS change; Irrlicht cache unaffected
        }
        return {
            vao:       gl.getParameter(gl.VERTEX_ARRAY_BINDING),
            prog:      gl.getParameter(gl.CURRENT_PROGRAM),
            rfb:       gl.getParameter(gl.READ_FRAMEBUFFER_BINDING),
            dfb:       gl.getParameter(gl.DRAW_FRAMEBUFFER_BINDING),
            vbo:       gl.getParameter(gl.ARRAY_BUFFER_BINDING),
            activeTex,
            tex0,
            vp:        gl.getParameter(gl.VIEWPORT),
            depth:     gl.isEnabled(gl.DEPTH_TEST),
            blend:     gl.isEnabled(gl.BLEND),
            scissor:   gl.isEnabled(gl.SCISSOR_TEST),
            cull:      gl.isEnabled(gl.CULL_FACE),
        };
    }

    _restoreGL(gl, s) {
        gl.bindVertexArray(s.vao);
        gl.useProgram(s.prog);
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, s.rfb);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, s.dfb);
        gl.bindBuffer(gl.ARRAY_BUFFER, s.vbo);
        // Restore TEXTURE0 (the only unit our code touches), then restore
        // the original active unit.  This keeps Irrlicht's C++ texture-unit
        // cache in sync with actual WebGL state.
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, s.tex0);
        gl.activeTexture(s.activeTex);
        // Restore viewport (Irrlicht caches it and may skip glViewport if it
        // thinks the value hasn't changed, but our per-eye blit changed it).
        gl.viewport(s.vp[0], s.vp[1], s.vp[2], s.vp[3]);
        s.depth   ? gl.enable(gl.DEPTH_TEST)   : gl.disable(gl.DEPTH_TEST);
        s.blend   ? gl.enable(gl.BLEND)         : gl.disable(gl.BLEND);
        s.scissor ? gl.enable(gl.SCISSOR_TEST)  : gl.disable(gl.SCISSOR_TEST);
        s.cull    ? gl.enable(gl.CULL_FACE)     : gl.disable(gl.CULL_FACE);
    }

    // ── Matrix helpers (column-major, WebGL convention) ───────────────────────

    _m4mul(a, b) {
        const o = new Float32Array(16);
        for (let c = 0; c < 4; c++)
            for (let r = 0; r < 4; r++) {
                let s = 0;
                for (let k = 0; k < 4; k++) s += a[k*4+r] * b[c*4+k];
                o[c*4+r] = s;
            }
        return o;
    }

    // Builds a scale+translate matrix for a centred world-space quad.
    // hw/hh are half-extents; cx,cy,cz is the world centre.
    _m4quad(cx, cy, cz, hw, hh) {
        const m = new Float32Array(16);
        m[0]=hw; m[5]=hh; m[10]=1; m[15]=1;
        m[12]=cx; m[13]=cy; m[14]=cz;
        return m;
    }

    // Builds a billboard model matrix: the quad always faces the camera.
    // right/up are the camera's right and up unit vectors.
    // hw/hh are half-extents; cx,cy,cz is the world centre.
    _m4billboard(cx, cy, cz, hw, hh, right, up) {
        const m = new Float32Array(16);
        m[0]=right[0]*hw; m[1]=right[1]*hw; m[2]=right[2]*hw; m[3]=0;
        m[4]=up[0]*hh;    m[5]=up[1]*hh;    m[6]=up[2]*hh;    m[7]=0;
        m[8]=0;           m[9]=0;            m[10]=1;           m[11]=0;
        m[12]=cx;         m[13]=cy;          m[14]=cz;          m[15]=1;
        return m;
    }

    // ── Rotate a vector by the conjugate (inverse) of a quaternion ───────────
    // Used to convert world-space offsets into head-local space.

    _rotByConjQuat(v, q) {
        const qx = -q.x, qy = -q.y, qz = -q.z, qw = q.w; // conjugate
        const c1 = qy*v[2] - qz*v[1];
        const c2 = qz*v[0] - qx*v[2];
        const c3 = qx*v[1] - qy*v[0];
        return [
            v[0] + 2*(qw*c1 + qy*c3 - qz*c2),
            v[1] + 2*(qw*c2 + qz*c1 - qx*c3),
            v[2] + 2*(qw*c3 + qx*c2 - qy*c1),
        ];
    }

    // ── Ray direction from XRRigidTransform orientation ───────────────────────

    _rayDir(quat) {
        // Rotate (0, 0, -1) by quaternion: v' = v + 2w*(q×v) + 2*(q×(q×v))
        // Computed with v=(0,0,-1), cross product simplified:
        const { x: qx, y: qy, z: qz, w: qw } = quat;
        const vx = 0, vy = 0, vz = -1;
        const cx  = qy*vz - qz*vy;   // = -qy
        const cy2 = qz*vx - qx*vz;   // =  qx
        const cz  = qx*vy - qy*vx;   // =  0
        return [
            vx + 2*(qw*cx  + qy*cz  - qz*cy2),
            vy + 2*(qw*cy2 + qz*cx  - qx*cz),
            vz + 2*(qw*cz  + qx*cy2 - qy*cx),
        ];
    }

    // ── Ray-axis-aligned-quad intersection ────────────────────────────────────
    // Returns {u, v} ∈ [0,1]² if the ray hits the quad, else null.

    _rayHit(origin, dir, cx, cy, pz, hw, hh) {
        if (Math.abs(dir[2]) < 1e-6) return null;
        const t = (pz - origin[2]) / dir[2];
        if (t < 0.05) return null;
        const hx = origin[0] + t * dir[0];
        const hy = origin[1] + t * dir[1];
        if (Math.abs(hx - cx) > hw || Math.abs(hy - cy) > hh) return null;
        return {
            u:  (hx - (cx - hw)) / (2 * hw),
            v: 1 - (hy - (cy - hh)) / (2 * hh),
        };
    }

    // ── Ray-billboard intersection ─────────────────────────────────────────────
    // Tests a ray against an arbitrarily-oriented billboard quad.
    // fwd is the camera forward vector (quad normal = -fwd).
    // right/up are the billboard's basis vectors; hw/hh are half-extents.
    // Returns {u, v} ∈ [0,1]² or null.

    _rayHitBillboard(origin, dir, center, fwd, right, up, hw, hh) {
        const nx = -fwd[0], ny = -fwd[1], nz = -fwd[2];
        const denom = dir[0]*nx + dir[1]*ny + dir[2]*nz;
        if (Math.abs(denom) < 1e-6) return null;
        const d = (center[0]-origin[0])*nx + (center[1]-origin[1])*ny + (center[2]-origin[2])*nz;
        const t = d / denom;
        if (t < 0.05) return null;
        const hx = origin[0] + t*dir[0] - center[0];
        const hy = origin[1] + t*dir[1] - center[1];
        const hz = origin[2] + t*dir[2] - center[2];
        const ul = hx*right[0] + hy*right[1] + hz*right[2];
        const vl = hx*up[0]    + hy*up[1]    + hz*up[2];
        if (Math.abs(ul) > hw || Math.abs(vl) > hh) return null;
        return {
            u: ul/hw * 0.5 + 0.5,
            v: 1 - (vl/hh * 0.5 + 0.5),
        };
    }

    // ── Menu panel 2D canvas drawing ──────────────────────────────────────────

    _redrawMenuPanel() {
        if (!this._mCtx) return;
        if (this._chatMode)   { this._redrawChatPanel();  return; }
        if (this._vrUrlMode)  { this._redrawVRUrlPanel(); return; }
        const ctx = this._mCtx;
        const CW = this._mCanvas.width, CH = this._mCanvas.height;
        ctx.clearRect(0, 0, CW, CH);

        // Background
        ctx.fillStyle = 'rgba(8, 14, 40, 0.97)';
        ctx.beginPath();
        ctx.roundRect(4, 4, CW - 8, CH - 8, 18);
        ctx.fill();
        ctx.strokeStyle = '#2a6fca';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Title
        ctx.fillStyle = '#88ccff';
        ctx.font = 'bold 44px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('Y Menu', CW / 2, 28);

        const defs = [
            { label: 'Inventory',  action: 'inventory' },
            { label: 'Settings',   action: 'settings'  },
            { label: 'Drop Item',  action: 'drop'      },
            { label: 'Close',      action: 'close'     },
            { label: '💬  Chat',   action: 'chat'      },
            { label: '🎤  Voice',  action: 'voice'     },
            { label: '📺  Video',  action: 'video'     },
            { label: '🏠  Launcher', action: 'launcher' },
        ];
        this._ymenuButtons = [];
        const bW = 440, bH = 82, gapX = 20, gapY = 14;
        const startX = (CW - (2 * bW + gapX)) / 2;   // = (1024-900)/2 = 62
        const startY = 90;

        for (let i = 0; i < defs.length; i++) {
            // First 4 buttons: 2×2 grid; 5th+ (Chat, Voice): full-width rows
            let bx, by, bw;
            if (i < 4) {
                const col = i % 2, row = Math.floor(i / 2);
                bx = startX + col * (bW + gapX);
                by = startY + row * (bH + gapY);
                bw = bW;
            } else {
                bw = 2 * bW + gapX;           // spans full grid width
                bx = (CW - bw) / 2;
                by = startY + 2 * (bH + gapY) + (i - 4) * (bH + gapY);
            }
            const hover    = this._ymenuHovered === i;
            const isChat   = i === 4;
            const isVoice  = i === 5;

            const accent = isVoice ? { bg: '#0e1e30', hbg: '#1a3a5a', str: '#3a8fd4', hStr: '#66c4ff', clr: '#aaddff' }
                         : isChat  ? { bg: '#0b2e18', hbg: '#145a32', str: '#1a7a3c', hStr: '#2ecc71', clr: '#90ee90' }
                         :           { bg: '#0d2244', hbg: '#1e5caa', str: '#2a6fca', hStr: '#66c0ff', clr: '#c8e4ff' };

            ctx.fillStyle   = hover ? accent.hbg : accent.bg;
            ctx.strokeStyle = hover ? accent.hStr : accent.str;
            ctx.lineWidth   = hover ? 3.5 : 2;
            ctx.beginPath();
            ctx.roundRect(bx, by, bw, bH, 12);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle    = hover ? '#ffffff' : accent.clr;
            ctx.font         = 'bold 32px system-ui, sans-serif';
            ctx.textAlign    = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(defs[i].label, bx + bw / 2, by + bH / 2);

            this._ymenuButtons.push({
                action: defs[i].action,
                u0: bx / CW, v0: by / CH,
                u1: (bx + bw) / CW, v1: (by + bH) / CH,
            });
        }
    }

    // ── Upload 2D canvas to a GL texture (with Y-flip) ────────────────────────

    _uploadCanvas(gl, tex, canvas) {
        // Always use TEXTURE0 so all our texture side-effects are confined
        // to a single unit that _restoreGL can cleanly fix up.
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    // ── Y Menu XR frame render ────────────────────────────────────────────────

    _renderYMenuFrame(frame, pose, gl) {
        const camFwd = this._rayDir(pose.transform.orientation);

        // Camera right = camFwd × worldUp (gives +X when looking forward along -Z).
        // Fallback to (1,0,0) when looking straight up/down.
        let rx = -camFwd[2], ry = 0, rz = camFwd[0];
        const rl = Math.hypot(rx, ry, rz);
        if (rl > 1e-6) { rx /= rl; ry /= rl; rz /= rl; }
        else { rx = 1; ry = 0; rz = 0; }
        const camRight = [rx, ry, rz];
        // Camera up = camRight × camFwd (gives +Y when looking forward — NOT camFwd×camRight).
        const camUp = [
            ry*camFwd[2] - rz*camFwd[1],
            rz*camFwd[0] - rx*camFwd[2],
            rx*camFwd[1] - ry*camFwd[0],
        ];

        // Full 3D head position (local-floor space; Y=0 is floor).
        const hp = pose.transform.position;

        const DIST   = 2.2;
        // Use the actual canvas aspect ratio so the game screen quad matches
        // the captured texture (VR canvas is ~square per eye on Quest, not 16:9).
        // Cap height so the panel stays within the vertical VR FOV; width is
        // derived from the capped height to preserve correct proportions.
        const _cAR = (mtCanvas.width > 0 && mtCanvas.height > 0)
            ? mtCanvas.width / mtCanvas.height : (16 / 9);
        const GAME_HH_MAX = 0.85;   // keeps top within Quest FOV at 2.2 m
        let GAME_HW, GAME_HH;
        if (1.4 / _cAR <= GAME_HH_MAX) {
            GAME_HW = 1.4; GAME_HH = GAME_HW / _cAR;
        } else {
            GAME_HH = GAME_HH_MAX; GAME_HW = GAME_HH * _cAR;
        }
        const MENU_HW = 0.9;
        const MENU_HH = MENU_HW / 1.777;   // menu canvas is 1024×512 ≈ 2:1

        // Game screen centered 0.25 m above the player's forward gaze so it
        // occupies the centre of view; menu panel placed directly below with a
        // small gap so both panels are fully visible without looking up/down much.
        const _gap  = 0.08;
        const _gcUp = 0.25;                              // game centre above gaze
        const _mcUp = _gcUp - GAME_HH - _gap - MENU_HH; // menu centre (below gaze)
        const gcx = hp.x + camFwd[0]*DIST + camUp[0]*_gcUp;
        const gcy = hp.y + camFwd[1]*DIST + camUp[1]*_gcUp;
        const gcz = hp.z + camFwd[2]*DIST + camUp[2]*_gcUp;
        const mcx = hp.x + camFwd[0]*DIST + camUp[0]*_mcUp;
        const mcy = hp.y + camFwd[1]*DIST + camUp[1]*_mcUp;
        const mcz = hp.z + camFwd[2]*DIST + camUp[2]*_mcUp;

        // Aliases used by hit-test and cursor sections below
        const GAME_CX = gcx, GAME_CY = gcy, GAME_CZ = gcz, GAME_Z = gcz;
        const MENU_CX = mcx, MENU_CY = mcy, MENU_Z = mcz;

        const saved = this._saveGL(gl);

        // ── 1. Blit game's default FB → gameTex via our FBO ──────────────────
        // The game keeps rendering to the null (default) framebuffer each tick.
        // We capture the latest frame here before drawing the Y menu scene.
        const W = mtCanvas.width, H = mtCanvas.height;
        if (W > 0 && H > 0) {
            if (W !== this._gameCapW || H !== this._gameCapH) {
                // Resize gameTex through TEXTURE0 explicitly.
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, this._gameTex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, W, H, 0,
                    gl.RGBA, gl.UNSIGNED_BYTE, null);
                gl.bindTexture(gl.TEXTURE_2D, null);
                this._gameCapW = W; this._gameCapH = H;
            }
            gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this._gameFBO);
            gl.blitFramebuffer(0, 0, W, H, 0, 0, W, H,
                gl.COLOR_BUFFER_BIT, gl.LINEAR);
        }

        // ── 2. Upload menu panel canvas → menuTex ─────────────────────────────
        this._uploadCanvas(gl, this._menuTex, this._mCanvas);


        // ── 3. Controller ray hit-test ────────────────────────────────────────
        // Right controller checks menu panel first; if it misses, checks game
        // screen and moves the game's mouse cursor there instead.
        let newHover = -1, triggerHit = null;
        this._raysByHand    = {};
        this._cursorWorldPos = null;

        for (const src of this._session.inputSources) {
            const rp = frame.getPose(src.targetRaySpace, this._refSpace);
            if (!rp) continue;
            const origin = [rp.transform.position.x,
                            rp.transform.position.y,
                            rp.transform.position.z];
            const dir = this._rayDir(rp.transform.orientation);
            this._raysByHand[src.handedness] = { origin, dir };

            if (src.handedness === 'right') {
                const gp      = src.gamepad;
                const trigNow = gp?.buttons[0]?.pressed ?? false;
                // Button 1 = grip/squeeze (side trigger) → right-click
                const gripNow = gp?.buttons[1]?.pressed ?? false;

                // Priority 1 — menu/chat panel (billboard-facing the camera)
                const mhit = this._rayHitBillboard(origin, dir,
                    [MENU_CX, MENU_CY, MENU_Z], camFwd, camRight, camUp, MENU_HW, MENU_HH);
                if (mhit) {
                    const panelBtns = this._chatMode    ? this._chatBtns
                                     : this._vrUrlMode  ? (this._vrUrlButtons || [])
                                     : this._ymenuButtons;
                    for (let bi = 0; bi < panelBtns.length; bi++) {
                        const btn = panelBtns[bi];
                        if (mhit.u >= btn.u0 && mhit.u <= btn.u1 &&
                            mhit.v >= btn.v0 && mhit.v <= btn.v1) {
                            newHover = bi;
                            if (trigNow && !this._ymenuTrigWas) triggerHit = btn;
                            break;
                        }
                    }
                } else {
                    // Priority 2 — game screen → virtual mouse cursor (billboard)
                    const ghit = this._rayHitBillboard(origin, dir,
                        [GAME_CX, GAME_CY, GAME_Z], camFwd, camRight, camUp, GAME_HW, GAME_HH);
                    if (ghit) {
                        // Recompute t for the billboard plane to get 3D cursor pos
                        const nx = -camFwd[0], ny = -camFwd[1], nz = -camFwd[2];
                        const denom = dir[0]*nx + dir[1]*ny + dir[2]*nz;
                        if (Math.abs(denom) > 1e-6) {
                            const td = ((GAME_CX-origin[0])*nx + (GAME_CY-origin[1])*ny + (GAME_Z-origin[2])*nz) / denom;
                            this._cursorWorldPos = {
                                x: origin[0] + td * dir[0],
                                y: origin[1] + td * dir[1],
                                z: origin[2] + td * dir[2],
                            };
                        }
                        this._applyGameCursor(
                            ghit,
                            trigNow && !this._screenTrigWas,
                            gripNow && !this._screenGripWas
                        );
                    }
                    this._screenTrigWas = trigNow;
                    this._screenGripWas = gripNow;
                }
                this._ymenuTrigWas = trigNow;
            }
        }

        if (this._chatMode) {
            if (newHover !== this._chatHovered) {
                this._chatHovered = newHover;
                this._redrawMenuPanel();
                this._uploadCanvas(gl, this._menuTex, this._mCanvas);
            }
        } else if (this._vrUrlMode) {
            if (newHover !== this._vrUrlHovered) {
                this._vrUrlHovered = newHover;
                this._redrawMenuPanel();
                this._uploadCanvas(gl, this._menuTex, this._mCanvas);
            }
        } else {
            if (newHover !== this._ymenuHovered) {
                this._ymenuHovered = newHover;
                this._redrawMenuPanel();
                this._uploadCanvas(gl, this._menuTex, this._mCanvas);
            }
        }

        if (triggerHit) this._execYMenuAction(triggerHit.action);

        // ── 4. Per-eye rendering ──────────────────────────────────────────────
        const xrFb = this._xrLayer.framebuffer;
        if (!xrFb) { this._restoreGL(gl, saved); return; }
        gl.bindFramebuffer(gl.FRAMEBUFFER, xrFb);
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.BLEND);
        gl.disable(gl.CULL_FACE);

        for (const view of pose.views) {
            const vp = this._xrLayer.getViewport(view);
            gl.viewport(vp.x, vp.y, vp.width, vp.height);
            gl.scissor (vp.x, vp.y, vp.width, vp.height);
            gl.enable(gl.SCISSOR_TEST);
            gl.clearColor(0.0, 0.0, 0.02, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.disable(gl.SCISSOR_TEST);

            // PV = proj * world→eye (view matrix)
            const pv = this._m4mul(view.projectionMatrix,
                                   view.transform.inverse.matrix);

            // Game screen
            this._drawQuad(gl, this._gameTex,
                this._m4mul(pv, this._m4billboard(GAME_CX, GAME_CY, GAME_CZ, GAME_HW, GAME_HH, camRight, camUp)));


            // Menu panel
            this._drawQuad(gl, this._menuTex,
                this._m4mul(pv, this._m4billboard(MENU_CX, MENU_CY, MENU_Z, MENU_HW, MENU_HH, camRight, camUp)));

            // Controller rays
            for (const h of ['left', 'right']) {
                const r = this._raysByHand[h];
                if (r) this._drawRay(gl, pv, r.origin, r.dir, 3.0);
            }

            // Cursor dot on game screen (alpha-blended, drawn last)
            if (this._cursorWorldPos) {
                const { x: dcx, y: dcy, z: dcz } = this._cursorWorldPos;
                gl.enable(gl.BLEND);
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                this._drawQuad(gl, this._cursorTex,
                    this._m4mul(pv, this._m4billboard(
                        dcx - camFwd[0]*0.005, dcy - camFwd[1]*0.005, dcz - camFwd[2]*0.005,
                        0.015, 0.015, camRight, camUp)));
                gl.disable(gl.BLEND);
            }
        }

        // Restore everything we changed
        this._restoreGL(gl, saved);
    }

    // ── Draw a world-space textured quad ──────────────────────────────────────

    _drawQuad(gl, tex, mvp) {
        gl.useProgram(this._qProg);
        gl.bindVertexArray(this._qVAO);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.uniform1i(this._qTexLoc, 0);
        gl.uniformMatrix4fv(this._qMvpLoc, false, mvp);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.bindVertexArray(null);
    }

    // ── Draw a controller pointer ray ─────────────────────────────────────────

    _drawRay(gl, pv, origin, dir, len) {
        gl.useProgram(this._lProg);
        gl.uniformMatrix4fv(this._lVpLoc, false, pv);
        gl.bindVertexArray(this._lVAO);
        gl.bindBuffer(gl.ARRAY_BUFFER, this._lVBO);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array([
            origin[0], origin[1], origin[2],
            origin[0]+dir[0]*len, origin[1]+dir[1]*len, origin[2]+dir[2]*len,
        ]));
        gl.drawArrays(gl.LINES, 0, 2);
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    // ── Y menu button actions ─────────────────────────────────────────────────

    _execYMenuAction(action) {
        // Y menu stays open so the user can see the game UI on the floating
        // game screen and interact with it via the controller cursor.
        // Only 'close' actually dismisses the overlay.
        if (action === 'close') {
            this._ymenuOpen = false;
            return;
        }
        // Defer key dispatch by one tick so the SDL event loop picks it up
        // on its next iteration (not mid-XR-frame where it could be dropped).
        if (action === 'inventory') {
            setTimeout(() => {
                this._sendKey('i', 'KeyI', 73);
            }, 0);
        } else if (action === 'settings') {
            setTimeout(() => {
                this._sendKey('Escape', 'Escape', 27);
            }, 0);
        } else if (action === 'drop') {
            setTimeout(() => {
                this._sendKey('q', 'KeyQ', 81);
            }, 0);
        } else if (action === 'chat') {
            this._openVRChat();
        } else if (action === 'video') {
            this._vrUrlMode    = true;
            this._vrUrlText    = '';
            this._vrUrlHovered = -1;
            this._vrUrlButtons = [];
            this._redrawMenuPanel();
            this._openVRUrlInput();
        } else if (action === 'video_url_play') {
            const url = this._vrUrlText?.trim();
            this._closeVRUrlInput();
            if (url && /^https?:\/\//i.test(url)) {
                window._videoScreen?.play(url);
                this._ymenuOpen = false;
            } else {
                this._redrawMenuPanel();
            }
        } else if (action === 'video_url_cancel') {
            this._closeVRUrlInput();
            this._redrawMenuPanel();
        } else if (action === 'voice') {
            if (typeof openVoiceWindow === 'function') openVoiceWindow();
        } else if (action === 'chat_send') {
            this._vrChatSend();
        } else if (action === 'chat_cancel') {
            this._closeVRChat();
        } else if (action === 'launcher') {
            this._ymenuOpen = false;
            this._returnToVRLauncher();
        }
    }

    async _returnToVRLauncher() {
        if (typeof emloop_pause === 'function') emloop_pause();
        await this.exitVR();
        window.location.href = window.location.pathname;
    }

    // ── VR floating chat overlay ──────────────────────────────────────────────

    _openVRChat() {
        this._chatMode    = true;
        this._chatText    = '';
        this._chatHovered = -1;
        if (!this._chatInp) {
            const form = document.createElement('form');
            form.style.cssText = 'position:fixed;left:50%;bottom:2px;transform:translateX(-50%);z-index:9999;';
            const inp = document.createElement('input');
            inp.type = 'text';
            inp.setAttribute('enterkeyhint', 'send');
            inp.setAttribute('autocomplete', 'off');
            inp.setAttribute('autocorrect',  'off');
            inp.setAttribute('autocapitalize', 'off');
            inp.setAttribute('spellcheck', 'false');
            inp.style.cssText =
                'width:2px;height:2px;opacity:0.01;' +
                'border:none;background:transparent;color:transparent;outline:none;';
            form.appendChild(inp);
            document.body.appendChild(form);
            // form submit fires on Meta Quest VK Enter/Send — most reliable trigger
            form.addEventListener('submit', (e) => { e.preventDefault(); this._vrChatSend(); });
            inp.addEventListener('input', () => {
                // Meta Quest VK may insert '\n' instead of firing submit
                if (inp.value.includes('\n')) {
                    inp.value = inp.value.replace(/\n/g, '');
                    this._chatText = inp.value;
                    this._vrChatSend();
                    return;
                }
                this._chatText = inp.value;
                this._redrawMenuPanel();
                const gl = this._getGL();
                if (gl && this._menuTex) this._uploadCanvas(gl, this._menuTex, this._mCanvas);
            });
            inp.addEventListener('keydown', (e) => {
                if (e.key === 'Enter')  { e.preventDefault(); this._vrChatSend(); }
                if (e.key === 'Escape') { e.preventDefault(); this._closeVRChat(); }
            });
            this._chatInp = inp;
        }
        this._chatInp.value = '';
        this._chatInp.focus();
        this._inputAnchorNeedsReset = true;
        this._redrawMenuPanel();
    }

    _closeVRChat() {
        this._chatMode    = false;
        this._chatText    = '';
        this._chatHovered = -1;
        if (this._chatInp) { this._chatInp.value = ''; this._chatInp.blur(); }
        this._redrawMenuPanel();
    }

    _vrChatSend() {
        const text = (this._chatText || '').trim();
        this._closeVRChat();
        this._ymenuOpen = false;
        if (!text) return;
        if (typeof webxr_queue_chat_message === 'function') {
            webxr_queue_chat_message(text);
        } else {
            // Fallback: simulate T → type → Enter
            const fk = (type, key, code, kc) => mtCanvas.dispatchEvent(
                new KeyboardEvent(type, { bubbles:true, cancelable:true, key, code, keyCode:kc, which:kc }));
            fk('keydown','t','KeyT',84); fk('keyup','t','KeyT',84);
            setTimeout(() => {
                for (const ch of text) {
                    const c=ch.charCodeAt(0);
                    fk('keydown',ch,'',c); fk('keypress',ch,'',c); fk('keyup',ch,'',c);
                }
                setTimeout(() => { fk('keydown','Enter','Enter',13); fk('keyup','Enter','Enter',13); }, 30);
            }, 120);
        }
    }

    // ── VR URL entry panel (canvas-drawn) ────────────────────────────────────

    _redrawVRUrlPanel() {
        const ctx = this._mCtx;
        const CW = this._mCanvas.width, CH = this._mCanvas.height;
        ctx.clearRect(0, 0, CW, CH);

        ctx.fillStyle = 'rgba(4, 14, 10, 0.97)';
        ctx.beginPath();
        ctx.roundRect(4, 4, CW - 8, CH - 8, 18);
        ctx.fill();
        ctx.strokeStyle = '#009966';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#80ffd8';
        ctx.font = 'bold 44px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('📺  Enter Video URL', CW / 2, 22);

        const txX = 40, txY = 88, txW = CW - 80, txH = 120;
        ctx.fillStyle = '#020e08';
        ctx.strokeStyle = '#009966';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(txX, txY, txW, txH, 10);
        ctx.fill();
        ctx.stroke();

        const url = this._vrUrlText || '';
        if (url) {
            ctx.fillStyle = '#ccffe8';
            ctx.font = '28px monospace';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            const pad = 14;
            let shown = url;
            ctx.save();
            ctx.beginPath();
            ctx.rect(txX + pad, txY, txW - 2 * pad, txH);
            ctx.clip();
            while (shown.length > 1 && ctx.measureText(shown + '▋').width > txW - 2 * pad)
                shown = shown.slice(1);
            ctx.fillText(shown + '▋', txX + pad, txY + txH / 2);
            ctx.restore();
        } else {
            ctx.fillStyle = '#336655';
            ctx.font = 'italic 26px system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('https://…  (use Quest VR keyboard)', CW / 2, txY + txH / 2);
        }

        ctx.fillStyle = '#559977';
        ctx.font = '22px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('Direct .mp4 / .webm URL required', CW / 2, txY + txH + 10);

        this._vrUrlButtons = [];
        const bY = CH - 90, bH = 72;
        const totalBW = CW - 60, gap = 16;
        const playBtnW = Math.round((totalBW - gap) * 0.58);
        const canBtnW  = totalBW - gap - playBtnW;
        const playBtnX = 30;
        const canBtnX  = playBtnX + playBtnW + gap;

        const playHover = this._vrUrlHovered === 0;
        ctx.fillStyle   = url ? (playHover ? 'rgba(0,100,40,0.95)' : 'rgba(0,65,28,0.85)') : 'rgba(20,40,30,0.5)';
        ctx.strokeStyle = url ? (playHover ? '#33ff88' : '#00cc55') : '#224433';
        ctx.lineWidth   = playHover ? 2.5 : 1.5;
        ctx.beginPath();
        ctx.roundRect(playBtnX, bY, playBtnW, bH, 12);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle    = url ? (playHover ? '#ffffff' : '#88ffbb') : '#446655';
        ctx.font         = 'bold 30px system-ui, sans-serif';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('▶  Play', playBtnX + playBtnW / 2, bY + bH / 2);
        this._vrUrlButtons.push({ action: 'video_url_play', u0: playBtnX/CW, v0: bY/CH, u1: (playBtnX+playBtnW)/CW, v1: (bY+bH)/CH });

        const canHover = this._vrUrlHovered === 1;
        ctx.fillStyle   = canHover ? 'rgba(60,20,20,0.9)' : 'rgba(30,10,10,0.75)';
        ctx.strokeStyle = canHover ? '#ff7777' : '#884444';
        ctx.lineWidth   = canHover ? 2.5 : 1.5;
        ctx.beginPath();
        ctx.roundRect(canBtnX, bY, canBtnW, bH, 12);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle    = canHover ? '#ffffff' : '#ffaaaa';
        ctx.font         = 'bold 30px system-ui, sans-serif';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('◄  Cancel', canBtnX + canBtnW / 2, bY + bH / 2);
        this._vrUrlButtons.push({ action: 'video_url_cancel', u0: canBtnX/CW, v0: bY/CH, u1: (canBtnX+canBtnW)/CW, v1: (bY+bH)/CH });
    }

    _openVRUrlInput() {
        if (!this._vrUrlInp) {
            const form = document.createElement('form');
            form.style.cssText = 'position:fixed;left:50%;bottom:2px;transform:translateX(-50%);z-index:9999;';
            const inp = document.createElement('input');
            inp.type = 'url';
            inp.setAttribute('enterkeyhint', 'go');
            inp.setAttribute('autocomplete', 'off');
            inp.setAttribute('autocorrect',  'off');
            inp.setAttribute('autocapitalize', 'off');
            inp.setAttribute('spellcheck', 'false');
            inp.style.cssText =
                'width:2px;height:2px;opacity:0.01;' +
                'border:none;background:transparent;color:transparent;outline:none;';
            form.appendChild(inp);
            document.body.appendChild(form);
            // form submit fires on Meta Quest VK Enter/Go — most reliable trigger
            form.addEventListener('submit', (e) => { e.preventDefault(); this._execYMenuAction('video_url_play'); });
            inp.addEventListener('input', () => {
                // Meta Quest VK may insert '\n' instead of firing submit
                if (inp.value.includes('\n')) {
                    inp.value = inp.value.replace(/\n/g, '');
                    this._vrUrlText = inp.value;
                    this._execYMenuAction('video_url_play');
                    return;
                }
                this._vrUrlText = inp.value;
                this._redrawMenuPanel();
                const gl = this._getGL();
                if (gl && this._menuTex) this._uploadCanvas(gl, this._menuTex, this._mCanvas);
            });
            inp.addEventListener('keydown', (e) => {
                if (e.key === 'Enter')  { e.preventDefault(); this._execYMenuAction('video_url_play'); }
                if (e.key === 'Escape') { e.preventDefault(); this._execYMenuAction('video_url_cancel'); }
            });
            this._vrUrlInp = inp;
        }
        this._vrUrlInp.value = '';
        this._vrUrlInp.focus();
        this._inputAnchorNeedsReset = true;
    }

    _closeVRUrlInput() {
        this._vrUrlMode    = false;
        this._vrUrlText    = '';
        this._vrUrlHovered = -1;
        this._vrUrlButtons = [];
        if (this._vrUrlInp) { this._vrUrlInp.value = ''; this._vrUrlInp.blur(); }
    }

    // ── VR chat panel canvas drawing ──────────────────────────────────────────

    _redrawChatPanel() {
        const ctx = this._mCtx;
        const CW = this._mCanvas.width, CH = this._mCanvas.height;
        ctx.clearRect(0, 0, CW, CH);

        // Background
        ctx.fillStyle = 'rgba(6, 18, 8, 0.97)';
        ctx.beginPath();
        ctx.roundRect(4, 4, CW - 8, CH - 8, 18);
        ctx.fill();
        ctx.strokeStyle = '#2a8a3a';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Title
        ctx.fillStyle = '#90ee90';
        ctx.font = 'bold 44px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('\uD83D\uDCAC  VR Chat', CW / 2, 26);

        // Text field
        const txX = 40, txY = 90, txW = CW - 80, txH = 112;
        ctx.fillStyle = '#020a02';
        ctx.strokeStyle = '#3aaa4a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(txX, txY, txW, txH, 10);
        ctx.fill();
        ctx.stroke();

        if (this._chatText) {
            ctx.fillStyle = '#e8ffe8';
            ctx.font = '34px monospace';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            const pad = 14;
            let shown = this._chatText;
            ctx.save();
            ctx.beginPath();
            ctx.rect(txX + pad, txY, txW - 2 * pad, txH);
            ctx.clip();
            // Scroll left if text overflows — show last N chars + cursor
            while (shown.length > 1 && ctx.measureText(shown + '\u258B').width > txW - 2 * pad)
                shown = shown.slice(1);
            ctx.fillText(shown + '\u258B', txX + pad, txY + txH / 2);
            ctx.restore();
        } else {
            ctx.fillStyle = '#3a6a3a';
            ctx.font = 'italic 28px system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Type with Quest VR keyboard \u2026', CW / 2, txY + txH / 2);
        }

        // Send / Cancel buttons
        this._chatBtns = [];
        const bY = 228, bH = 92, bW = (CW - 80 - 16) / 2;
        const btnDefs = [
            { label: '\u2713  Send',   action: 'chat_send',
              bg: '#0b2e18', hbg: '#145a32', stroke: '#2ecc71', hStroke: '#66ff99', clr: '#aaffaa' },
            { label: '\u2715  Cancel', action: 'chat_cancel',
              bg: '#1a0808', hbg: '#5a1414', stroke: '#cc4444', hStroke: '#ff7777', clr: '#ffaaaa' },
        ];
        for (let i = 0; i < btnDefs.length; i++) {
            const b     = btnDefs[i];
            const bx    = 40 + i * (bW + 16);
            const hover = this._chatHovered === i;
            ctx.fillStyle   = hover ? b.hbg    : b.bg;
            ctx.strokeStyle = hover ? b.hStroke : b.stroke;
            ctx.lineWidth   = hover ? 3.5 : 2;
            ctx.beginPath();
            ctx.roundRect(bx, bY, bW, bH, 12);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = hover ? '#ffffff' : b.clr;
            ctx.font = 'bold 34px system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(b.label, bx + bW / 2, bY + bH / 2);
            this._chatBtns.push({
                action: b.action,
                u0: bx / CW,         v0: bY / CH,
                u1: (bx + bW) / CW,  v1: (bY + bH) / CH,
            });
        }
    }

    // Dispatch a key down+up pair to document (SDL2/Emscripten listens there).
    _sendKey(key, code, keyCode) {
        // Irrlicht/SDL registers keyboard listeners on the canvas element.
        // Ensure it has focus so the game's event loop picks up the event.
        if (document.activeElement !== mtCanvas) mtCanvas.focus();
        const opts = { bubbles: true, cancelable: true, key, code, keyCode, which: keyCode };
        mtCanvas.dispatchEvent(new KeyboardEvent('keydown', opts));
        mtCanvas.dispatchEvent(new KeyboardEvent('keyup',   opts));
    }

    // ── Virtual mouse cursor on the game screen ───────────────────────────────
    // Called when the right controller ray hits the game screen quad.
    // Dispatches synthetic mouse events to the Minetest canvas so that game
    // UIs (inventory slots, buttons) respond to controller pointing & trigger.

    _applyGameCursor(uv, click, rightClick = false) {
        const rect = mtCanvas.getBoundingClientRect();
        // UV from _rayHit: u=0 left u=1 right; v=0 top-of-quad v=1 bottom-of-quad
        // (because world +Y is up, screen +Y is down, so higher world Y → lower v)
        const px = rect.left + uv.u * rect.width;
        const py = rect.top  + uv.v * rect.height;

        mtCanvas.dispatchEvent(new MouseEvent('mousemove', {
            bubbles: true, cancelable: true, clientX: px, clientY: py,
        }));

        if (click) {
            mtCanvas.dispatchEvent(new MouseEvent('mousedown', {
                bubbles: true, cancelable: true,
                clientX: px, clientY: py, button: 0, buttons: 1,
            }));
            mtCanvas.dispatchEvent(new MouseEvent('mouseup', {
                bubbles: true, cancelable: true,
                clientX: px, clientY: py, button: 0, buttons: 0,
            }));
            mtCanvas.dispatchEvent(new MouseEvent('click', {
                bubbles: true, cancelable: true,
                clientX: px, clientY: py, button: 0, buttons: 0,
            }));
        }

        if (rightClick) {
            // Right-click (button 2) — used for placing one item from a stack
            // in crafting grids, splitting stacks, etc.
            mtCanvas.dispatchEvent(new MouseEvent('mousedown', {
                bubbles: true, cancelable: true,
                clientX: px, clientY: py, button: 2, buttons: 2,
            }));
            mtCanvas.dispatchEvent(new MouseEvent('mouseup', {
                bubbles: true, cancelable: true,
                clientX: px, clientY: py, button: 2, buttons: 0,
            }));
            mtCanvas.dispatchEvent(new MouseEvent('contextmenu', {
                bubbles: true, cancelable: true,
                clientX: px, clientY: py, button: 2, buttons: 0,
            }));
        }
    }
}
// ===== end WebXR VR Manager =====

// ===== Video Screen =====
// Renders shared video as a WebGL billboard texture drawn into the game world each frame.
// Desktop: Y key opens URL input; video frame → canvas.drawImage() → texImage2D() → billboard.
// VR:      Y-menu "Video" button opens Quest keyboard; WebXRManager samples _vid directly.
// Both modes: arrow keys adjust distance (1–8 m); server polls for panels dropped by others.

const BLOXEL_API_BASE = 'https://bloxel.ngrok.io';

class VideoScreen {
    constructor() {
        // Hidden HTML5 video element — the actual player
        this._vid = document.createElement('video');
        this._vid.autoplay   = true;
        this._vid.playsInline = true;
        this._vid.crossOrigin = 'anonymous';
        this._vid.style.cssText =
            'position:fixed;width:1px;height:1px;opacity:0.01;pointer-events:none;top:-100px;';
        document.body.appendChild(this._vid);

        // Intermediate canvas — drawImage() lands here each frame before upload
        this._vCanvas = document.createElement('canvas');
        this._vCanvas.width  = 854;
        this._vCanvas.height = 480;
        this._vCtx = this._vCanvas.getContext('2d');

        // State
        this._active  = false;
        this._url     = '';
        this._dist    = 5.0;    // metres ahead; arrow keys adjust distance for placement
        this._anchor  = null;   // world-space {x,y,z} where the screen is locked
        this._yaw     = 0;      // accumulated camera yaw (fallback, radians)
        this._pitch   = 0;      // accumulated camera pitch (fallback, radians)

        // GL resources (initialised lazily on first active frame)
        this._gl      = null;
        this._tex     = null;
        this._prog    = null;
        this._vao     = null;
        this._mvpLoc  = null;
        this._texLoc  = null;
        this._glInited = false;

        // Desktop URL input overlay
        this._ui     = null;
        this._uiOpen = false;

        // Server polling (shared panels dropped by other players)
        this._lastPanelId = null;

        this._buildUI();
        this._attachInput();
        this._startPolling();
        requestAnimationFrame(this._loop.bind(this));
    }

    // ── Desktop URL input overlay ────────────────────────────────────────────

    _buildUI() {
        const ui = document.createElement('div');
        ui.id = 'video_screen_ui';
        ui.style.cssText =
            'display:none;position:fixed;inset:0;z-index:970;align-items:center;' +
            'justify-content:center;background:rgba(0,0,10,0.78);pointer-events:all;' +
            'backdrop-filter:blur(6px);';
        ui.innerHTML = `
<div style="background:rgba(6,10,28,0.97);border:1px solid rgba(80,130,255,0.18);
    border-radius:18px;padding:28px;width:min(500px,92vw);
    box-shadow:0 16px 60px rgba(0,10,60,0.9);">
  <div style="font:700 17px system-ui,sans-serif;color:rgba(180,220,255,0.95);margin-bottom:8px;">
    📺 Video Screen</div>
  <div style="font:400 13px system-ui,sans-serif;color:rgba(100,150,220,0.8);
    margin-bottom:18px;line-height:1.5;">
    Paste a direct video URL (.mp4, .webm, etc.) — everyone on the server sees it.</div>
  <input id="vs_url_inp" type="url" placeholder="https://example.com/video.mp4"
    autocomplete="off" style="width:100%;box-sizing:border-box;padding:11px 14px;
    border-radius:10px;border:1px solid rgba(80,130,255,0.25);
    background:rgba(8,14,40,0.9);color:#dde8f8;font:14px system-ui,sans-serif;
    outline:none;margin-bottom:20px;">
  <div style="display:flex;gap:10px;">
    <button id="vs_play_btn" style="flex:1;padding:11px;border-radius:40px;
      background:rgba(20,180,100,0.15);color:rgba(100,240,170,0.9);
      border:1px solid rgba(0,200,120,0.3);font:600 14px system-ui,sans-serif;
      cursor:pointer;">▶ Play</button>
    <button id="vs_stop_btn" style="padding:11px 18px;border-radius:40px;
      background:rgba(30,10,10,0.8);color:rgba(220,160,160,0.9);
      border:1px solid rgba(200,60,60,0.2);font:600 14px system-ui,sans-serif;
      cursor:pointer;">■ Stop</button>
    <button id="vs_cancel_btn" style="padding:11px 18px;border-radius:40px;
      background:rgba(20,20,30,0.8);color:rgba(180,180,220,0.9);
      border:1px solid rgba(100,100,180,0.2);font:600 14px system-ui,sans-serif;
      cursor:pointer;">✕</button>
  </div>
  <div style="margin-top:12px;color:rgba(100,140,180,0.5);font:11px system-ui,sans-serif;">
    ↑ ↓ arrow keys adjust distance · Esc to close</div>
</div>`;
        document.body.appendChild(ui);
        this._ui = ui;

        ui.querySelector('#vs_play_btn').addEventListener('click', () => {
            const url = ui.querySelector('#vs_url_inp').value.trim();
            if (!url || !/^https?:\/\//i.test(url)) { alert('Enter a valid https:// URL.'); return; }
            this._dropForEveryone(url);
            this.play(url);
            this._closeUI();
        });
        ui.querySelector('#vs_stop_btn').addEventListener('click', () => {
            this.stop(); this._closeUI();
        });
        ui.querySelector('#vs_cancel_btn').addEventListener('click', () => this._closeUI());
        ui.querySelector('#vs_url_inp').addEventListener('keydown', e => {
            if (e.key === 'Enter')  { ui.querySelector('#vs_play_btn').click(); }
            if (e.key === 'Escape') { this._closeUI(); }
        });
    }

    _openUI() {
        this._uiOpen = true;
        const inp = this._ui.querySelector('#vs_url_inp');
        if (inp && this._url) inp.value = this._url;
        this._ui.style.display = 'flex';
        setTimeout(() => inp?.focus(), 60);
    }

    _closeUI() {
        this._uiOpen = false;
        this._ui.style.display = 'none';
        if (typeof mtCanvas !== 'undefined') mtCanvas.focus();
    }

    // ── Input handling ───────────────────────────────────────────────────────

    _attachInput() {
        // Track camera orientation from pointer-lock mouse movement
        window.addEventListener('mousemove', e => {
            if (!document.pointerLockElement) return;
            this._yaw   -= e.movementX * 0.002;
            this._pitch -= e.movementY * 0.002;
            this._pitch  = Math.max(-1.4, Math.min(1.4, this._pitch));
        });

        // Capture phase so we see Y before SDL/canvas handlers do
        window.addEventListener('keydown', e => {
            // Don't intercept when the user is typing in a real input
            const tag = document.activeElement?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA') return;

            if (e.code === 'KeyY') {
                if (this._uiOpen) { this._closeUI(); }
                else { if (document.exitPointerLock) document.exitPointerLock(); this._openUI(); }
                e.stopPropagation(); e.preventDefault();
                return;
            }
            if (e.code === 'Escape') {
                if (this._uiOpen) { this._closeUI(); e.stopPropagation(); return; }
                if (this._active) { this.stop(); }
                return;
            }
            if (this._active && !this._uiOpen) {
                if (e.code === 'ArrowUp') {
                    e.preventDefault();
                    this._dist = Math.min(8, this._dist + 0.15);
                } else if (e.code === 'ArrowDown') {
                    e.preventDefault();
                    this._dist = Math.max(1, this._dist - 0.15);
                }
            }
        }, true); // capture=true: fires before canvas/SDL handlers
    }

    // ── Playback ─────────────────────────────────────────────────────────────

    play(url) {
        this._url    = url;
        this._active = true;
        this._anchor = null;  // recalculate world-space anchor on next frame
        this._vid.src    = BLOXEL_API_BASE + '/video_proxy.php?url=' + encodeURIComponent(url);
        this._vid.muted  = false;
        this._vid.play().catch(() => {
            this._vid.muted = true;
            this._vid.play().catch(() => {});
        });
        // Set anchor immediately if engine matrices are already available
        this._setAnchor();
    }

    stop() {
        this._active = false;
        this._vid.pause();
        this._vid.src = '';
    }

    // ── Server polling (shared panels) ───────────────────────────────────────

    _startPolling() {
        const poll = async () => {
            try {
                const r = await fetch(BLOXEL_API_BASE + '/panels.php?action=list');
                if (!r.ok) return;
                const d = await r.json();
                const panels = d.panels || [];
                if (!panels.length) return;
                const p = panels[0];
                if (p.id !== this._lastPanelId) {
                    this._lastPanelId = p.id;
                    this.play(p.url);
                }
            } catch (_e) {}
        };
        poll();
        setInterval(poll, 5000);
    }

    async _dropForEveryone(url) {
        try {
            const fd = new FormData();
            fd.append('action', 'drop');
            fd.append('url', url);
            fd.append('title', url);
            await fetch(BLOXEL_API_BASE + '/panels.php', { method: 'POST', body: fd });
        } catch (_e) {}
    }

    // ── WebGL initialisation ─────────────────────────────────────────────────

    _initGL() {
        if (typeof mtCanvas === 'undefined') return;
        const gl = mtCanvas.getContext('webgl2') || mtCanvas.getContext('webgl');
        if (!gl) return;
        this._gl = gl;

        const vs = `#version 300 es
precision highp float;
in vec2 a_pos;
uniform mat4 u_mvp;
out vec2 v_uv;
void main() {
    v_uv = vec2(a_pos.x * 0.5 + 0.5, 0.5 - a_pos.y * 0.5);
    gl_Position = u_mvp * vec4(a_pos, 0.0, 1.0);
}`;
        const fs = `#version 300 es
precision mediump float;
in vec2 v_uv;
uniform sampler2D u_tex;
out vec4 c;
void main() { c = texture(u_tex, v_uv); }`;

        const mkSh = (type, src) => {
            const s = gl.createShader(type);
            gl.shaderSource(s, src);
            gl.compileShader(s);
            return s;
        };
        this._prog = gl.createProgram();
        gl.attachShader(this._prog, mkSh(gl.VERTEX_SHADER,   vs));
        gl.attachShader(this._prog, mkSh(gl.FRAGMENT_SHADER, fs));
        gl.linkProgram(this._prog);
        this._mvpLoc = gl.getUniformLocation(this._prog, 'u_mvp');
        this._texLoc = gl.getUniformLocation(this._prog, 'u_tex');

        this._vao = gl.createVertexArray();
        gl.bindVertexArray(this._vao);
        const vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER,
            new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
        const aPos = gl.getAttribLocation(this._prog, 'a_pos');
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        this._tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this._tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 4, 4, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);

        this._glInited = true;
    }

    // ── Matrix helpers ───────────────────────────────────────────────────────

    _m4mul(a, b) {
        const o = new Float32Array(16);
        for (let c = 0; c < 4; c++)
            for (let r = 0; r < 4; r++) {
                let s = 0;
                for (let k = 0; k < 4; k++) s += a[k*4+r] * b[c*4+k];
                o[c*4+r] = s;
            }
        return o;
    }

    _m4perspective(fovY, aspect, near, far) {
        const f = 1 / Math.tan(fovY / 2);
        const m = new Float32Array(16);
        m[0]  = f / aspect;
        m[5]  = f;
        m[10] = (far + near) / (near - far);
        m[11] = -1;
        m[14] = (2 * far * near) / (near - far);
        return m;
    }

    _m4view(yaw, pitch) {
        // Irrlicht-compatible column layout: col=[Rx,Ux,Bx,0], [Ry,Uy,By,0], [Rz,Uz,Bz,0], [Tx,Ty,Tz,1]
        // Forward = (-v[2], -v[6], -v[10]) = back negated — same formula used for engine matrices.
        const cy = Math.cos(yaw),   sy = Math.sin(yaw);
        const cp = Math.cos(pitch), sp = Math.sin(pitch);
        const m = new Float32Array(16);
        // col 0: right
        m[0] =  cy;    m[1] = sy*sp; m[2] = sy*cp; m[3] = 0;
        // col 1: up
        m[4] =  0;     m[5] = cp;    m[6] = -sp;   m[7] = 0;
        // col 2: back
        m[8] = -sy;    m[9] = cy*sp; m[10]= cy*cp; m[11]= 0;
        // col 3: translation (none — camera at origin for fallback)
        m[12]= 0;      m[13]= 0;     m[14]= 0;     m[15]= 1;
        return m;
    }

    _fwd(yaw, pitch) {
        return [
            -Math.sin(yaw) * Math.cos(pitch),
             Math.sin(pitch),
            -Math.cos(yaw) * Math.cos(pitch),
        ];
    }

    _right(yaw) {
        return [Math.cos(yaw), 0, -Math.sin(yaw)];
    }

    _m4billboard(cx, cy, cz, hw, hh, right, up) {
        const m = new Float32Array(16);
        m[0]=right[0]*hw; m[1]=right[1]*hw; m[2]=right[2]*hw; m[3]=0;
        m[4]=up[0]*hh;    m[5]=up[1]*hh;    m[6]=up[2]*hh;    m[7]=0;
        m[8]=0;           m[9]=0;            m[10]=1;           m[11]=0;
        m[12]=cx;         m[13]=cy;          m[14]=cz;          m[15]=1;
        return m;
    }

    // ── Per-frame render loop ────────────────────────────────────────────────

    // ── Get view+proj matrices from the engine via WASM export ──────────────
    // Returns {view, proj} as Float32Array[16] each, or null if not available.
    // Falls back to reconstructed matrices from mouse tracking when the WASM
    // export is not yet loaded (e.g. during the loading screen).
    _getEngineMatrices() {
        if (typeof Module !== 'undefined' && Module._webxr_get_camera_matrices) {
            try {
                // Allocate two 64-byte (16 float) buffers on the WASM heap
                const vPtr = Module._malloc(64);
                const pPtr = Module._malloc(64);
                const ok   = Module._webxr_get_camera_matrices(vPtr, pPtr);
                if (ok) {
                    const view = new Float32Array(Module.HEAPF32.buffer, vPtr, 16).slice();
                    const proj = new Float32Array(Module.HEAPF32.buffer, pPtr, 16).slice();
                    Module._free(vPtr);
                    Module._free(pPtr);
                    return { view, proj };
                }
                Module._free(vPtr);
                Module._free(pPtr);
            } catch (_e) {}
        }
        // Fallback: reconstruct from accumulated mouse yaw/pitch
        const W = mtCanvas.width, H = mtCanvas.height;
        if (W <= 0 || H <= 0) return null;
        return {
            view: this._m4view(this._yaw, this._pitch),
            proj: this._m4perspective(72 * Math.PI / 180, W / H, 0.1, 100),
        };
    }

    // ── Set world-space anchor when player places the screen ─────────────────
    // Called once when play() is triggered. Places the anchor D metres ahead
    // of the camera so the screen spawns in front of the player, then stays
    // locked there even as the player walks away.
    _setAnchor() {
        const mats = this._getEngineMatrices();
        if (!mats) { this._anchor = null; return; }

        // Extract camera position from the view matrix (inverse of translation column).
        // View matrix: col3 = -R^T * camPos  →  camPos = -R * col3
        const v = mats.view;
        // R^T rows = cols 0..2 of v (column-major: row i = v[i], v[4+i], v[8+i])
        const tx = v[12], ty = v[13], tz = v[14];
        const camX = -(v[0]*tx + v[1]*ty + v[2]*tz);
        const camY = -(v[4]*tx + v[5]*ty + v[6]*tz);
        const camZ = -(v[8]*tx + v[9]*ty + v[10]*tz);

        // Camera forward = -back = -(v[2], v[6], v[10]) in Irrlicht col layout
        const fwdX = -v[2], fwdY = -v[6], fwdZ = -v[10];
        const D = this._dist;
        this._anchor = { x: camX + fwdX*D, y: camY + fwdY*D, z: camZ + fwdZ*D };
    }

    _loop() {
        requestAnimationFrame(this._loop.bind(this));

        if (!this._active) return;
        // VR mode: WebXRManager handles the billboard draw in _onXRFrame
        if (window.vrManager?._inVR) return;

        const vid = this._vid;
        if (vid.readyState < 2) return;

        if (!this._glInited) this._initGL();
        if (!this._glInited) return;

        const gl = this._gl;

        // 1. Draw current video frame onto the intermediate canvas (HTML5 canvas approach)
        this._vCtx.drawImage(vid, 0, 0, this._vCanvas.width, this._vCanvas.height);

        // 2. Upload canvas → WebGL texture (texImage2D from canvas source)
        const _sAT = gl.getParameter(gl.ACTIVE_TEXTURE);
        gl.activeTexture(gl.TEXTURE0);
        const _sT0 = gl.getParameter(gl.TEXTURE_BINDING_2D);
        gl.bindTexture(gl.TEXTURE_2D, this._tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._vCanvas); } catch (_e) {}
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

        // 3. Get camera view+projection from engine (exact matrices = world-space lock)
        const W = mtCanvas.width, H = mtCanvas.height;
        if (W <= 0 || H <= 0) return;
        const mats = this._getEngineMatrices();
        if (!mats) return;
        const pv = this._m4mul(mats.proj, mats.view);

        // 4. World-space anchor: the panel stays fixed where the player placed it.
        //    If no anchor yet (engine matrices not ready at play() time), set it now.
        if (!this._anchor) this._setAnchor();
        let cx, cy, cz;
        if (this._anchor) {
            cx = this._anchor.x; cy = this._anchor.y; cz = this._anchor.z;
        } else {
            // Ultimate fallback: float in front of camera using yaw/pitch
            const fwd = this._fwd(this._yaw, this._pitch);
            cx = fwd[0]*this._dist; cy = fwd[1]*this._dist; cz = fwd[2]*this._dist;
        }

        // Billboard always faces the camera: right = cross(worldUp, fwd-to-cam)
        // We extract camera right and up from the view matrix columns (cols 0 and 1).
        const v = mats.view;
        const rgt = [v[0], v[4], v[8]];   // camera right in world space
        const up  = [v[1], v[5], v[9]];   // camera up in world space
        const mvp = this._m4mul(pv, this._m4billboard(cx, cy, cz, 0.75, 0.422, rgt, up));

        // 5. Save GL state, render billboard, restore
        const _sVAO   = gl.getParameter(gl.VERTEX_ARRAY_BINDING);
        const _sPrg   = gl.getParameter(gl.CURRENT_PROGRAM);
        const _sVP    = gl.getParameter(gl.VIEWPORT);
        const _sDepth = gl.isEnabled(gl.DEPTH_TEST);
        const _sBlend = gl.isEnabled(gl.BLEND);
        const _sCull  = gl.isEnabled(gl.CULL_FACE);
        const _sDM    = gl.getParameter(gl.DEPTH_WRITEMASK);

        gl.viewport(0, 0, W, H);
        gl.disable(gl.DEPTH_TEST);
        gl.depthMask(false);
        gl.disable(gl.CULL_FACE);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.useProgram(this._prog);
        gl.bindVertexArray(this._vao);
        gl.uniform1i(this._texLoc, 0);
        gl.uniformMatrix4fv(this._mvpLoc, false, mvp);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        // Restore
        gl.bindVertexArray(_sVAO);
        gl.useProgram(_sPrg);
        gl.viewport(_sVP[0], _sVP[1], _sVP[2], _sVP[3]);
        gl.depthMask(_sDM);
        _sDepth ? gl.enable(gl.DEPTH_TEST)  : gl.disable(gl.DEPTH_TEST);
        _sBlend ? gl.enable(gl.BLEND)        : gl.disable(gl.BLEND);
        _sCull  ? gl.enable(gl.CULL_FACE)   : gl.disable(gl.CULL_FACE);
        gl.bindTexture(gl.TEXTURE_2D, _sT0);
        gl.activeTexture(_sAT);
    }
}

function _initVideoScreen() {
    if (!window._videoScreen) window._videoScreen = new VideoScreen();
}
// ===== end Video Screen =====


// ===== VR Website Mode =====
// Canvas-drawn billboard panel rendered in WebGL XR space.
// The website UI (sidebar + tabs) is painted onto a 2D canvas each frame,
// uploaded as a texture, and drawn as a 3D billboard 2 m in front of the player.
// Right controller ray → button hit-test. Same infrastructure as the Y-menu.

// (CSS-based dom-overlay approach removed — replaced by canvas billboard)
const _VR_WEBSITE_CSS_UNUSED = `
/* ── Transparent base so starfield shows around the panel ── */
.vr-website-mode html {
    background: transparent !important;
    height: 100% !important;
}
.vr-website-mode body {
    background: transparent !important;
    width: 100vw !important;
    height: 100vh !important;
    min-height: unset !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: center !important;
}

/* ── The floating VR panel ── */
#vr_panel_wrapper {
    display: flex !important;
    flex-direction: row !important;
    position: relative !important;
    width: min(1100px, 90vw) !important;
    height: min(720px, 86vh) !important;
    border-radius: 24px !important;
    overflow: hidden !important;
    background: rgba(4,8,26,0.97) !important;
    /* Physical panel border: top bevel bright, bottom = extrusion depth face */
    border: 2px solid rgba(80,150,255,0.55) !important;
    border-top-color: rgba(200,230,255,0.72) !important;
    border-bottom: 8px solid rgba(12,24,110,0.88) !important;
    box-shadow:
        0 0 120px rgba(10,50,255,0.20),
        0 70px 200px rgba(0,0,0,0.90),
        0 8px 40px  rgba(0,0,0,0.70),
        inset 0  1px 0 rgba(255,255,255,0.18),
        inset 0 -2px 0 rgba(0,0,80,0.50) !important;
    backdrop-filter: blur(28px) !important;
    -webkit-backdrop-filter: blur(28px) !important;
    transform: translateY(-4px) !important;
}
/* Top-edge light streak — simulates physical bevel */
#vr_panel_wrapper::before {
    content: '' !important; pointer-events: none !important;
    position: absolute !important; z-index: 1000 !important;
    top: 0 !important; left: 80px !important; right: 80px !important; height: 2px !important;
    background: linear-gradient(90deg,
        transparent 0%, rgba(140,200,255,0.65) 25%,
        rgba(220,240,255,1.0) 50%, rgba(140,200,255,0.65) 75%,
        transparent 100%) !important;
}
/* Bottom extrusion shadow — panel thickness illusion */
#vr_panel_wrapper::after {
    content: '' !important; pointer-events: none !important;
    position: absolute !important; z-index: -1 !important;
    bottom: -12px !important; left: 40px !important; right: 40px !important; height: 10px !important;
    background: rgba(8,20,100,0.50) !important;
    border-radius: 0 0 16px 16px !important;
    filter: blur(6px) !important;
}

/* ── Sidebar column ── */
.vr-website-mode .sidebar {
    flex-shrink: 0 !important;
    /* Override the page's sticky + 100svh — must stay within the bounded panel */
    position: relative !important;
    height: 100% !important;
    max-height: 100% !important;
    border-radius: 22px 0 0 22px !important;
    border-right: 1px solid rgba(80,150,255,0.28) !important;
    background: linear-gradient(180deg,rgba(10,20,55,0.99) 0%,rgba(5,10,30,0.99) 100%) !important;
    box-shadow: 4px 0 32px rgba(0,0,80,0.50), 1px 0 0 rgba(80,150,255,0.12) !important;
    backdrop-filter: blur(20px) !important; -webkit-backdrop-filter: blur(20px) !important;
    overflow-y: auto !important;
}
.vr-website-mode .sb-item { color: rgba(150,195,255,0.75) !important; }
.vr-website-mode .sb-item:hover { background: rgba(70,140,255,0.14) !important; color: #c8e4ff !important; }
.vr-website-mode .tab-btn.active.sb-item {
    background: linear-gradient(180deg,rgba(28,75,200,0.55) 0%,rgba(18,48,160,0.42) 100%) !important;
    color: #8ac8ff !important;
    border: 1px solid rgba(80,150,255,0.35) !important;
    box-shadow: 0 5px 0 rgba(0,0,80,0.55), 0 7px 18px rgba(0,70,200,0.40),
        inset 0 1px 0 rgba(255,255,255,0.14) !important;
    transform: translateY(-2px) !important;
}
.vr-website-mode .sb-name { color: #c8e4ff !important; }

/* ── Main content column ── */
.vr-website-mode .app-layout {
    flex: 1 !important;
    min-width: 0 !important;
    height: 100% !important;
    max-height: 100% !important;
    background: transparent !important;
    overflow: hidden !important;
    display: flex !important;
    flex-direction: column !important;
}
.vr-website-mode .rb-page { background: transparent !important; }
.vr-website-mode .rb-banner {
    background: rgba(6,12,38,0.95) !important;
    border-bottom: 1px solid rgba(80,150,255,0.18) !important;
    backdrop-filter: blur(12px) !important; -webkit-backdrop-filter: blur(12px) !important;
}
.vr-website-mode .panel {
    background: rgba(7,14,42,0.93) !important;
    border: 1px solid rgba(80,150,255,0.24) !important;
    border-top-color: rgba(170,215,255,0.40) !important;
    box-shadow: 0 20px 55px rgba(0,0,100,0.45), 0 0 0 1px rgba(80,150,255,0.06),
        inset 0 1px 0 rgba(255,255,255,0.09) !important;
    backdrop-filter: blur(14px) !important; -webkit-backdrop-filter: blur(14px) !important;
}
.vr-website-mode .panel::before {
    background: linear-gradient(180deg,rgba(255,255,255,0.07) 0%,transparent 100%) !important;
}

/* Auth screen constrained inside the panel */
.vr-website-mode .auth-screen {
    position: absolute !important;
    inset: 0 !important;
    border-radius: inherit !important;
}

/* ── 3-D Button Effect ── */
.vr-website-mode button {
    background: linear-gradient(180deg,#4090ff 0%,#1a52d0 52%,#0d2e96 100%) !important;
    border-top:    2px solid rgba(200,230,255,0.55) !important;
    border-left:   1px solid rgba(160,210,255,0.28) !important;
    border-right:  1px solid rgba(0,0,0,0.38) !important;
    border-bottom: 6px solid #060f56 !important;
    border-radius: 12px !important;
    box-shadow: 0 10px 28px rgba(0,0,80,0.55), inset 0 1px 0 rgba(255,255,255,0.38),
        inset 0 -1px 0 rgba(0,0,0,0.22) !important;
    color: #ddeeff !important;
    text-shadow: 0 1px 3px rgba(0,0,60,0.55) !important;
    transform: translateY(-3px) !important;
    transition: transform 0.08s, border-bottom-width 0.08s, box-shadow 0.08s !important;
    letter-spacing: 0.03em !important;
}
.vr-website-mode button:hover:not(:disabled) {
    transform: translateY(-4px) !important;
    border-bottom-width: 7px !important;
    box-shadow: 0 14px 34px rgba(28,107,255,0.58), inset 0 1px 0 rgba(255,255,255,0.45) !important;
    filter: brightness(1.13) !important;
}
.vr-website-mode button:active:not(:disabled) {
    transform: translateY(2px) !important;
    border-bottom-width: 2px !important;
    box-shadow: 0 3px 10px rgba(0,0,0,0.55), inset 0 2px 5px rgba(0,0,0,0.38) !important;
    filter: brightness(0.88) !important;
}
/* Green buttons (launch, signin) */
.vr-website-mode .wii-launch-btn {
    background: linear-gradient(180deg,#2aeb7e 0%,#00aa55 52%,#006836 100%) !important;
    border-top-color: rgba(160,255,200,0.6) !important;
    border-bottom: 6px solid #002618 !important;
    box-shadow: 0 10px 30px rgba(0,110,54,0.52), inset 0 1px 0 rgba(255,255,255,0.4) !important;
}
.vr-website-mode .wii-launch-btn:hover:not(:disabled) {
    border-bottom-width: 7px !important;
    box-shadow: 0 14px 36px rgba(0,180,85,0.58), inset 0 1px 0 rgba(255,255,255,0.48) !important;
}
.vr-website-mode .signin-btn {
    background: linear-gradient(180deg,#2aeb7e 0%,#00aa55 52%,#006836 100%) !important;
    border-top-color: rgba(160,255,200,0.6) !important;
    border-bottom: 6px solid #002618 !important;
    box-shadow: 0 10px 30px rgba(0,110,54,0.52), inset 0 1px 0 rgba(255,255,255,0.4) !important;
    color: #fff !important; text-shadow: 0 1px 3px rgba(0,40,20,0.5) !important;
}
/* Secondary buttons */
.vr-website-mode .btn-secondary {
    background: linear-gradient(180deg,#2c3b70 0%,#1c2852 52%,#0e1838 100%) !important;
    border-top-color: rgba(150,195,255,0.26) !important;
    border-bottom: 6px solid #060c1e !important;
    box-shadow: 0 10px 24px rgba(0,0,60,0.48), inset 0 1px 0 rgba(255,255,255,0.1) !important;
    color: #8aacd8 !important; text-shadow: none !important;
}
.vr-website-mode .btn-secondary:hover:not(:disabled) {
    border-bottom-width: 7px !important; filter: brightness(1.1) !important;
}
/* Input fields */
.vr-website-mode .field input,
.vr-website-mode .field select {
    background: rgba(4,10,32,0.94) !important;
    border: 1.5px solid rgba(80,150,255,0.35) !important;
    color: #c8deff !important;
    box-shadow: inset 0 3px 8px rgba(0,0,0,0.52) !important;
}
/* Exit VR button — always top-right, outside the panel */
#vr_exit_btn {
    position: fixed; top: 14px; right: 14px; z-index: 99999;
    padding: 9px 20px; border-radius: 12px;
    background: linear-gradient(180deg,#8b1c1c 0%,#5a0a0a 100%);
    border-top: 1.5px solid rgba(255,130,130,0.5);
    border-left: 1px solid rgba(200,80,80,0.28);
    border-right: 1px solid rgba(0,0,0,0.4);
    border-bottom: 5px solid #280000;
    color: #ffaaaa; font-size: 13px; font-weight: 800; font-family: inherit;
    cursor: pointer; letter-spacing: 0.04em;
    box-shadow: 0 8px 22px rgba(80,0,0,0.55), inset 0 1px 0 rgba(255,180,180,0.28);
    transform: translateY(-2px);
    transition: transform 0.08s, border-bottom-width 0.08s;
    display: none !important;
}
.vr-website-mode #vr_exit_btn { display: block !important; }
#vr_exit_btn:hover { transform: translateY(-3px); border-bottom-width: 6px; }
#vr_exit_btn:active { transform: translateY(2px); border-bottom-width: 2px; }
/* VR mode badge */
#vr_mode_badge {
    display: none; align-items: center; gap: 6px;
    background: rgba(20,60,200,0.2); border: 1px solid rgba(80,150,255,0.32);
    border-radius: 8px; padding: 4px 12px;
    font-size: 11px; font-weight: 800; color: #80b8ff;
    text-transform: uppercase; letter-spacing: 0.1em;
}
.vr-website-mode #vr_mode_badge { display: flex !important; }
`;

class VRWebsiteMode {
    static _instance = null;

    static async autoInit() {
        if (!navigator.xr) return;
        if (typeof activateBody !== 'function') return;
        try {
            const ok = await navigator.xr.isSessionSupported('immersive-vr');
            if (!ok) return;
        } catch (_e) { return; }
        setTimeout(() => VRWebsiteMode._showPrompt(), 600);
    }

    static _showPrompt() {
        if (document.getElementById('vr_website_prompt')) return;
        const el = document.createElement('div');
        el.id = 'vr_website_prompt';
        el.innerHTML = `
<div style="position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:radial-gradient(ellipse at center,rgba(6,14,50,0.97) 0%,rgba(2,4,14,0.98) 100%);">
  <div style="background:rgba(8,16,50,0.97);border:1px solid rgba(90,160,255,0.38);border-top-color:rgba(180,220,255,0.52);border-radius:26px;padding:46px 54px;text-align:center;max-width:400px;width:90vw;box-shadow:0 40px 100px rgba(0,0,0,0.85),0 0 0 1px rgba(90,160,255,0.08);backdrop-filter:blur(24px);">
    <div style="font-size:62px;margin-bottom:20px;filter:drop-shadow(0 4px 18px rgba(80,150,255,0.65));">🥽</div>
    <h2 style="font-size:24px;font-weight:900;color:#e8f4ff;margin:0 0 10px;letter-spacing:0.02em;font-family:inherit;">VR Headset Detected</h2>
    <p style="font-size:13px;color:#7aacce;margin:0 0 34px;line-height:1.65;font-family:inherit;">Browse the entire launcher and launch games<br>from inside immersive VR space.</p>
    <button id="vrp_enter" style="display:block;width:100%;min-height:54px;background:linear-gradient(180deg,#4090ff 0%,#1a52d0 52%,#0d2e96 100%);border-top:2px solid rgba(200,230,255,0.55);border-left:1px solid rgba(160,210,255,0.28);border-right:1px solid rgba(0,0,0,0.38);border-bottom:7px solid #060f56;border-radius:14px;color:#ddeeff;font-size:16px;font-weight:900;font-family:inherit;cursor:pointer;margin-bottom:14px;box-shadow:0 12px 32px rgba(0,0,80,0.6),inset 0 1px 0 rgba(255,255,255,0.38);transform:translateY(-3px);letter-spacing:0.04em;text-shadow:0 1px 3px rgba(0,0,60,0.55);transition:transform 0.08s,border-bottom-width 0.08s;">🥽&nbsp; Enter VR Mode</button>
    <button id="vrp_skip" style="display:block;width:100%;min-height:40px;background:transparent;border:1px solid rgba(90,160,255,0.2);border-radius:12px;color:rgba(120,172,220,0.7);font-size:13px;font-weight:700;font-family:inherit;cursor:pointer;transition:background 0.15s;">Continue in browser</button>
  </div>
</div>`;
        document.body.appendChild(el);
        const yesBtn = document.getElementById('vrp_enter');
        yesBtn.onmouseenter = () => { yesBtn.style.transform = 'translateY(-4px)'; yesBtn.style.borderBottomWidth = '8px'; };
        yesBtn.onmouseleave = () => { yesBtn.style.transform = 'translateY(-3px)'; yesBtn.style.borderBottomWidth = '7px'; };
        yesBtn.onmousedown  = () => { yesBtn.style.transform = 'translateY(2px)';  yesBtn.style.borderBottomWidth = '3px'; };
        document.getElementById('vrp_enter').addEventListener('click', () => {
            el.remove();
            new VRWebsiteMode().enter();
        });
        document.getElementById('vrp_skip').addEventListener('click', () => el.remove());
    }

    constructor() {
        VRWebsiteMode._instance = this;
        this._session       = null;
        this._refSpace      = null;
        this._gl            = null;
        this._xrLayer       = null;
        this._bgCanvas      = null;
        // Panel 2D canvas + texture
        this._pCanvas       = null;
        this._pCtx          = null;
        this._pTex          = null;
        // GL programs
        this._starProg      = null;
        this._starVAO       = null;
        this._starCount     = 0;
        this._uVP           = null;
        this._uTime         = null;
        this._qProg         = null;
        this._qVAO          = null;
        this._qMvpLoc       = null;
        this._qTexLoc       = null;
        this._lProg         = null;
        this._lVAO          = null;
        this._lVBO          = null;
        this._lVpLoc        = null;
        this._cursorTex     = null;
        // Panel UI state
        this._tab           = 'play';
        this._servers       = null;
        this._worlds        = null;
        this._hovered       = -1;
        this._trigWas       = false;
        this._scrollY       = 0;
        this._lastScrollT   = 0;
        this._buttons       = [];
        this._dirty         = true;
        this._cursorHitPos  = null;
        // Panel dimensions (user-adjustable via resize handle)
        this._PHW           = 0.75;
        this._PHH           = 0.4375;
        // Panel world position: null = follow left hand; {x,y,z} = pinned
        this._panelPos      = null;
        this._dragActive    = false;
        this._dragDist      = 0;
        this._resizeActive  = false;
        this._resizePHW0    = 0;
        this._resizePHH0    = 0;
        // Play tab interactive state
        this._playFocus     = null;    // 'name' | 'worldname'
        this._playShift     = false;
        this._playEditBuf   = '';
        this._playWorldSel  = null;    // null=uninit, ''=new world, else=world id
        this._playWScroll   = 0;
        this._playMsg       = '';
        // Settings tab state
        this._sgrp          = 0;
        this._sscroll       = 0;
        // Sign-in overlay
        this._signInMode    = false;
        this._siField       = 0;
        this._siUsername    = '';
        this._siPassword    = '';
        this._siMsg         = '';
        this._siShift       = false;
        this._siWorking     = false;
    }

    // handoffSession: existing XRSession passed from game (no user gesture needed)
    async enter(handoffSession = null) {
        // Panel drawing canvas (never added to DOM — used as texture source only)
        this._pCanvas = document.createElement('canvas');
        this._pCanvas.width  = 1800;
        this._pCanvas.height = 1050;
        this._pCtx = this._pCanvas.getContext('2d');
        // WebGL background canvas
        this._bgCanvas = document.createElement('canvas');
        this._bgCanvas.id = 'vr_bg_canvas';
        this._bgCanvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;';
        document.body.insertBefore(this._bgCanvas, document.body.firstChild);

        const gl = this._bgCanvas.getContext('webgl2', { xrCompatible: true, alpha: false });
        if (!gl) { alert('WebGL2 not available'); this._cleanup(); return; }
        this._gl = gl;
        try { await gl.makeXRCompatible(); } catch (_e) {}

        if (handoffSession) {
            // Reuse the session handed off from the game — no requestSession() needed
            this._session = handoffSession;
            window._vrHandoffSession = null;
        } else {
            // Fresh start — requires a user gesture (the "Enter VR Mode" button click)
            try {
                this._session = await navigator.xr.requestSession('immersive-vr', {
                    requiredFeatures: ['local-floor'],
                    optionalFeatures: ['bounded-floor'],
                });
            } catch (err) {
                alert('Could not start VR session: ' + err.message);
                this._cleanup();
                return;
            }
        }

        this._xrLayer = new XRWebGLLayer(this._session, gl, { antialias: true, alpha: false });
        this._session.updateRenderState({ baseLayer: this._xrLayer });
        this._refSpace = await this._session.requestReferenceSpace('local-floor')
            .catch(() => this._session.requestReferenceSpace('local'));
        // Store handler so we can remove it before handing the session back
        this._endHandler = () => this._onSessionEnd();
        this._session.addEventListener('end', this._endHandler);

        this._initGLResources();
        this._fetchData();
        this._draw();
        this._uploadPanel();
        this._session.requestAnimationFrame(this._onFrame.bind(this));
        window._vrWebsiteLaunching = false;
    }

    // ── GL resource init ─────────────────────────────────────────────────────

    _initGLResources() {
        const gl = this._gl;

        // Quad shader (canvas texture → billboard)
        const QV = `#version 300 es
precision highp float;
in vec2 a_pos; uniform mat4 u_mvp; out vec2 v_uv;
void main() { v_uv = a_pos * 0.5 + 0.5; gl_Position = u_mvp * vec4(a_pos, 0.0, 1.0); }`;
        const QF = `#version 300 es
precision mediump float;
in vec2 v_uv; uniform sampler2D u_tex; out vec4 c;
void main() { c = texture(u_tex, v_uv); }`;

        // Line shader (controller rays)
        const LV = `#version 300 es
precision highp float;
in vec3 a_pos; uniform mat4 u_vp;
void main() { gl_Position = u_vp * vec4(a_pos, 1.0); }`;
        const LF = `#version 300 es
precision mediump float; out vec4 c;
void main() { c = vec4(0.3, 0.75, 1.0, 0.85); }`;

        this._qProg   = this._mkProg(gl, QV, QF);
        this._lProg   = this._mkProg(gl, LV, LF);
        this._qMvpLoc = gl.getUniformLocation(this._qProg, 'u_mvp');
        this._qTexLoc = gl.getUniformLocation(this._qProg, 'u_tex');
        this._lVpLoc  = gl.getUniformLocation(this._lProg, 'u_vp');

        // Quad VAO
        this._qVAO = gl.createVertexArray();
        gl.bindVertexArray(this._qVAO);
        const qvb = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, qvb);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
        const qa = gl.getAttribLocation(this._qProg, 'a_pos');
        gl.enableVertexAttribArray(qa);
        gl.vertexAttribPointer(qa, 2, gl.FLOAT, false, 0, 0);
        gl.bindVertexArray(null);

        // Line VAO
        this._lVAO = gl.createVertexArray();
        gl.bindVertexArray(this._lVAO);
        this._lVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._lVBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(6), gl.DYNAMIC_DRAW);
        const la = gl.getAttribLocation(this._lProg, 'a_pos');
        gl.enableVertexAttribArray(la);
        gl.vertexAttribPointer(la, 3, gl.FLOAT, false, 0, 0);
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        // Panel texture
        this._pTex = this._mkTex(gl, this._pCanvas.width, this._pCanvas.height);

        // Cursor dot — 32×32 glowing blue circle
        const SZ = 32, CX = 15.5, CY = 15.5, CR = 13;
        const cd = new Uint8Array(SZ * SZ * 4);
        for (let py = 0; py < SZ; py++) for (let px = 0; px < SZ; px++) {
            const r = Math.hypot(px - CX, py - CY);
            const a = Math.max(0, 1 - r / CR);
            const i = (py * SZ + px) * 4;
            cd[i] = 80; cd[i+1] = 200; cd[i+2] = 255; cd[i+3] = Math.round(a * a * 255);
        }
        this._cursorTex = this._mkTex(gl, SZ, SZ);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this._cursorTex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, SZ, SZ, 0, gl.RGBA, gl.UNSIGNED_BYTE, cd);
        gl.bindTexture(gl.TEXTURE_2D, null);

        this._initStarfield();
    }

    // ── Data fetching ────────────────────────────────────────────────────────

    async _fetchData() {
        try {
            const r = await fetch('./servers.json');
            const data = await r.json();
            this._servers = Array.isArray(data) ? data : (data.servers || []);
        } catch (_e) { this._servers = []; }
        this._dirty = true;

        try {
            this._worlds = window.listPersistedWorlds ? await window.listPersistedWorlds() : [];
        } catch (_e) { this._worlds = []; }
        // Default world selection: first existing world, or "new world" if none
        if (this._playWorldSel === null) {
            this._playWorldSel = this._worlds.length > 0 ? this._worlds[0].id : '';
            const sel = document.getElementById('multiplayer_world');
            if (sel) { sel.value = this._playWorldSel; sel.dispatchEvent(new Event('change')); }
        }
        this._dirty = true;
    }

    // ── Canvas panel drawing ─────────────────────────────────────────────────

    _draw() {
        const ctx = this._pCtx;
        const CW = 1800, CH = 1050, SB = 270;
        ctx.clearRect(0, 0, CW, CH);

        // Panel background
        const bg = ctx.createLinearGradient(0, 0, 0, CH);
        bg.addColorStop(0, 'rgba(6,12,36,0.99)');
        bg.addColorStop(1, 'rgba(3,6,20,0.99)');
        ctx.fillStyle = bg;
        ctx.beginPath(); ctx.roundRect(0, 0, CW, CH, 22); ctx.fill();

        // Outer border
        ctx.strokeStyle = 'rgba(55,125,255,0.55)'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.roundRect(2, 2, CW-4, CH-4, 20); ctx.stroke();
        // Inner highlight (top bevel)
        ctx.strokeStyle = 'rgba(180,220,255,0.65)'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.roundRect(3.5, 3.5, CW-7, CH-7, 19); ctx.stroke();

        // Drag handle bar at top (grab to move panel)
        const dbg = ctx.createLinearGradient(0,0,0,38);
        dbg.addColorStop(0,'rgba(45,95,210,0.50)'); dbg.addColorStop(1,'rgba(20,50,140,0.18)');
        ctx.fillStyle = dbg;
        ctx.beginPath(); ctx.roundRect(2,2,CW-4,34,[20,20,0,0]); ctx.fill();
        ctx.fillStyle = 'rgba(140,190,255,0.38)';
        for (let i=0; i<9; i++) { ctx.beginPath(); ctx.arc(CW/2-112+i*28, 19, 3.5, 0, Math.PI*2); ctx.fill(); }

        // Resize handle triangle (bottom-right corner)
        ctx.fillStyle = 'rgba(70,140,255,0.55)';
        ctx.beginPath(); ctx.moveTo(CW-8,CH-8); ctx.lineTo(CW-46,CH-8); ctx.lineTo(CW-8,CH-46); ctx.closePath(); ctx.fill();

        this._buttons = [];

        // Sign-in overlay replaces normal tab content
        if (this._signInMode) {
            this._drawSignInOverlay(ctx, CW, CH);
            return;
        }

        // Sidebar separator
        ctx.strokeStyle = 'rgba(55,120,255,0.22)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(SB, 12); ctx.lineTo(SB, CH-12); ctx.stroke();

        this._drawSidebar(ctx, SB, CH);
        this._drawContent(ctx, SB, CW, CH);
    }

    _drawSidebar(ctx, SB, CH) {
        // Sidebar tinted bg
        const sbg = ctx.createLinearGradient(0, 0, SB, 0);
        sbg.addColorStop(0, 'rgba(7,14,46,0.99)');
        sbg.addColorStop(1, 'rgba(5,10,30,0.96)');
        ctx.fillStyle = sbg;
        ctx.beginPath(); ctx.roundRect(0, 0, SB, CH, [22,0,0,22]); ctx.fill();

        // Logo
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 34px system-ui,sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('🎮 Bloxel', SB/2, 52);

        const tabs = [
            { id: 'play',     icon: '▶',  label: 'Play'     },
            { id: 'discover', icon: '🌐', label: 'Discover' },
            { id: 'settings', icon: '⚙',  label: 'Settings' },
            { id: 'account',  icon: '👤', label: 'Account'  },
            { id: 'friends',  icon: '👥', label: 'Friends'  },
        ];
        const TH = 80, TP = 10, TY0 = 106;
        for (let i = 0; i < tabs.length; i++) {
            const t = tabs[i];
            const bx = TP, by = TY0 + i*(TH+8), bw = SB-TP*2;
            const active = this._tab === t.id;
            const hov    = this._hovered === i;
            if (active) {
                const ag = ctx.createLinearGradient(bx, by, bx, by+TH);
                ag.addColorStop(0, '#1e5caa'); ag.addColorStop(1, '#0e2e6a');
                ctx.fillStyle = ag;
                ctx.beginPath(); ctx.roundRect(bx, by, bw, TH, 12); ctx.fill();
                ctx.strokeStyle = 'rgba(70,155,255,0.65)'; ctx.lineWidth = 2; ctx.stroke();
                ctx.fillStyle = '#4090ff'; ctx.fillRect(bx, by+10, 4, TH-20);
            } else if (hov) {
                ctx.fillStyle = 'rgba(55,115,215,0.20)';
                ctx.beginPath(); ctx.roundRect(bx, by, bw, TH, 12); ctx.fill();
            }
            ctx.fillStyle = active ? '#ddeeff' : (hov ? '#b8d8f8' : '#7a9cc0');
            ctx.font = `${active ? 'bold ' : ''}28px system-ui,sans-serif`;
            ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
            ctx.fillText(t.icon + '  ' + t.label, bx+18, by+TH/2);
            this._buttons.push({ u0:bx/1800, v0:by/1050, u1:(bx+bw)/1800, v1:(by+TH)/1050, action:'tab:'+t.id });
        }

        // Sign-in / account button at bottom
        const auth = window._etherdeckAuth;
        const li = auth?.isLoggedIn();
        const slabel = li ? ('👤 '+( auth.getUsername()||'Account')) : '🔑 Sign In';
        const sy = CH-82, sh = 62, sw = SB-TP*2;
        const shov = this._hovered === tabs.length;
        this._drawBtn(ctx, TP, sy, sw, sh, slabel,
            li  ? {top:'#175a28',bot:'#0a2c14',depth:'#051008',rim:'rgba(60,200,100,0.5)',htop:'#22823a',hbot:'#145020'}
                : {top:'#1a3a8a',bot:'#0c1e58',depth:'#05082a',rim:'rgba(70,140,255,0.5)',htop:'#2650ae',hbot:'#162a78'},
            shov, 26);
        this._buttons.push({ u0:TP/1800, v0:sy/1050, u1:(TP+sw)/1800, v1:(sy+sh)/1050, action: li?'signout':'signin' });
    }

    _drawContent(ctx, SB, CW, CH) {
        const cx = SB+22, cw = CW-SB-44;
        const titles = {play:'▶  Play', discover:'🌐  Discover', settings:'⚙  Settings', account:'👤  Account', friends:'👥  Friends'};
        ctx.fillStyle = 'rgba(240,248,255,0.92)';
        ctx.font = 'bold 40px system-ui,sans-serif';
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(titles[this._tab]||this._tab, cx, 52);
        ctx.strokeStyle = 'rgba(70,130,255,0.22)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(cx, 88); ctx.lineTo(CW-22, 88); ctx.stroke();

        const fn = {play:'_drawPlayTab', discover:'_drawDiscoverTab', settings:'_drawSettingsTab', account:'_drawAccountTab', friends:'_drawFriendsTab'}[this._tab];
        if (fn) this[fn](ctx, cx, 100, cw, CH-112);
    }

    _drawPlayTab(ctx, cx, cy, cw, ch) {
        const CW=1800, CH=1050;
        const kbActive = this._playFocus !== null;
        const kbY = 488;   // keyboard top when active

        // ── Player Name ──────────────────────────────────────────────────────
        const nameVal = this._playFocus==='name' ? this._playEditBuf
                      : (document.getElementById('multiplayer_username')?.value||'');
        const nameFoc = this._playFocus==='name';
        ctx.fillStyle='rgba(165,205,255,0.65)'; ctx.font='21px system-ui,sans-serif';
        ctx.textAlign='left'; ctx.textBaseline='top'; ctx.fillText('Player Name', cx, cy);
        ctx.fillStyle=nameFoc?'rgba(22,48,115,0.92)':'rgba(14,26,66,0.82)';
        ctx.beginPath(); ctx.roundRect(cx, cy+24, cw*0.52, 50, 8); ctx.fill();
        ctx.strokeStyle=nameFoc?'rgba(80,165,255,0.9)':'rgba(55,115,255,0.4)';
        ctx.lineWidth=nameFoc?2.5:1.5; ctx.stroke();
        ctx.fillStyle=nameVal?'#e8f0ff':'rgba(120,160,210,0.45)';
        ctx.font='26px system-ui,sans-serif'; ctx.textBaseline='middle';
        ctx.fillText((nameVal||'YourName')+(nameFoc?'|':''), cx+12, cy+49);
        this._buttons.push({u0:cx/CW, v0:cy/CH, u1:(cx+cw*0.52)/CW, v1:(cy+74)/CH, action:'pf:name'});
        cy += 84;

        // ── Game (read-only) ─────────────────────────────────────────────────
        ctx.fillStyle='rgba(165,205,255,0.65)'; ctx.font='21px system-ui,sans-serif';
        ctx.textBaseline='top'; ctx.fillText('Game', cx, cy);
        ctx.fillStyle='rgba(10,18,52,0.75)';
        ctx.beginPath(); ctx.roundRect(cx, cy+24, cw*0.38, 46, 8); ctx.fill();
        ctx.strokeStyle='rgba(45,90,190,0.35)'; ctx.lineWidth=1; ctx.stroke();
        ctx.fillStyle='rgba(160,200,255,0.7)'; ctx.font='24px system-ui,sans-serif'; ctx.textBaseline='middle';
        ctx.fillText('minetest_game', cx+12, cy+47);
        cy += 66;

        // ── World selector ───────────────────────────────────────────────────
        ctx.fillStyle='rgba(165,205,255,0.65)'; ctx.font='21px system-ui,sans-serif';
        ctx.textBaseline='top'; ctx.fillText('World', cx, cy);
        cy += 26;

        const worlds = this._worlds || [];
        const allItems = [{id:'', title:'＋  New World…'}].concat(worlds);
        const selId = this._playWorldSel ?? '';
        const maxRows = kbActive ? 3 : 6;
        const maxScroll = Math.max(0, allItems.length - maxRows);
        if (this._playWScroll > maxScroll) this._playWScroll = maxScroll;
        const visible = allItems.slice(this._playWScroll, this._playWScroll + maxRows);

        const rh=64, rg=6;
        for (let i=0; i<visible.length; i++) {
            const item=visible[i], ry=cy+i*(rh+rg);
            const sel=item.id===selId;
            ctx.fillStyle=sel?'rgba(22,54,140,0.9)':'rgba(11,20,58,0.72)';
            ctx.beginPath(); ctx.roundRect(cx, ry, cw-4, rh, 9); ctx.fill();
            ctx.strokeStyle=sel?'rgba(70,155,255,0.72)':'rgba(40,80,190,0.32)';
            ctx.lineWidth=sel?2:1; ctx.stroke();
            if (sel) { ctx.fillStyle='#4090ff'; ctx.fillRect(cx, ry+10, 4, rh-20); }
            ctx.fillStyle=sel?'#ddeeff':'#7a9cc0';
            ctx.font=`${sel?'bold ':''}25px system-ui,sans-serif`;
            ctx.textBaseline='middle';
            ctx.fillText(item.title||item.id, cx+16, ry+rh/2);
            this._buttons.push({u0:cx/CW, v0:ry/CH, u1:(cx+cw-4)/CW, v1:(ry+rh)/CH, action:'psel:'+item.id});
        }
        if (allItems.length > maxRows) {
            ctx.fillStyle='rgba(110,160,255,0.45)'; ctx.font='19px system-ui,sans-serif';
            ctx.textAlign='center'; ctx.textBaseline='top';
            ctx.fillText('↑↓ thumbstick to scroll', cx+cw/2, cy+visible.length*(rh+rg)+2);
        }
        cy += visible.length*(rh+rg) + (allItems.length>maxRows ? 26 : 12);

        // ── New World name input (only when "New World" is selected) ─────────
        if (selId === '') {
            const wnFoc = this._playFocus==='worldname';
            const wnVal = wnFoc ? this._playEditBuf
                        : (document.getElementById('new_world_name')?.value||'');
            ctx.fillStyle='rgba(165,205,255,0.65)'; ctx.font='21px system-ui,sans-serif';
            ctx.textAlign='left'; ctx.textBaseline='top'; ctx.fillText('World Name', cx, cy);
            ctx.fillStyle=wnFoc?'rgba(22,48,115,0.92)':'rgba(14,26,66,0.82)';
            ctx.beginPath(); ctx.roundRect(cx, cy+24, cw*0.52, 50, 8); ctx.fill();
            ctx.strokeStyle=wnFoc?'rgba(80,165,255,0.9)':'rgba(55,115,255,0.4)';
            ctx.lineWidth=wnFoc?2.5:1.5; ctx.stroke();
            ctx.fillStyle=wnVal?'#e8f0ff':'rgba(120,160,210,0.45)';
            ctx.font='26px system-ui,sans-serif'; ctx.textBaseline='middle';
            ctx.fillText((wnVal||'My World')+(wnFoc?'|':''), cx+12, cy+49);
            this._buttons.push({u0:cx/CW, v0:cy/CH, u1:(cx+cw*0.52)/CW, v1:(cy+74)/CH, action:'pf:worldname'});
            cy += 84;
            if (this._playMsg) {
                ctx.fillStyle='rgba(255,90,90,0.9)'; ctx.font='22px system-ui,sans-serif';
                ctx.textBaseline='top'; ctx.fillText(this._playMsg, cx, cy); cy += 30;
            }
        }

        // ── Launch button ────────────────────────────────────────────────────
        const launchY = Math.min(cy+6, kbActive ? kbY-90 : CH-120);
        const lhov = this._hovered===this._buttons.length;
        this._drawBtn(ctx, cx, launchY, 310, 66, '▶  Launch Game',
            {top:'#1a8038',bot:'#0d4020',depth:'#051808',rim:'rgba(60,210,110,0.5)',htop:'#24a84a',hbot:'#165a2a'}, lhov, 27);
        this._buttons.push({u0:cx/CW, v0:launchY/CH, u1:(cx+310)/CW, v1:(launchY+66)/CH, action:'play_launch'});

        // ── VR keyboard when a field is focused ──────────────────────────────
        if (kbActive) this._drawPlayKeyboard(ctx, CW, CH, kbY);
    }

    _drawPlayKeyboard(ctx, CW, CH, startY) {
        const lbl = this._playFocus==='name' ? 'Player Name' : 'World Name';
        ctx.fillStyle='rgba(140,185,255,0.55)'; ctx.font='20px system-ui,sans-serif';
        ctx.textAlign='center'; ctx.textBaseline='top';
        ctx.fillText('Editing: '+lbl, CW/2, startY-22);

        const KW=122, KH=78, KG=7;
        const rows=[['1','2','3','4','5','6','7','8','9','0'],
                    ['q','w','e','r','t','y','u','i','o','p'],
                    ['a','s','d','f','g','h','j','k','l'],
                    ['z','x','c','v','b','n','m']];
        for (let ri=0; ri<rows.length; ri++) {
            const row=rows[ri], rowW=row.length*(KW+KG)-KG;
            let kx=Math.round((CW-rowW)/2);
            const ky=startY+ri*(KH+KG);
            for (const rawCh of row) {
                const ch=(this._playShift&&/[a-z]/.test(rawCh))?rawCh.toUpperCase():rawCh;
                const hov=this._hovered===this._buttons.length;
                this._drawKeyBtn(ctx, kx, ky, KW, KH, ch, hov);
                this._buttons.push({u0:kx/CW, v0:ky/CH, u1:(kx+KW)/CW, v1:(ky+KH)/CH, action:'pk_key:'+rawCh});
                kx+=KW+KG;
            }
        }
        const sy=startY+4*(KH+KG);
        const spec=[
            {w:156, label:this._playShift?'⬆ ON':'⬆ Shift', action:'pk_shift'},
            {w:468, label:'Space', action:'pk_space'},
            {w:190, label:'⌫ Bksp', action:'pk_bksp'},
            {w:244, label:'✓ Done', action:'pk_done', accent:true},
            {w:200, label:'✕ Cancel', action:'pk_cancel'},
        ];
        const specW=spec.reduce((s,b)=>s+b.w,0)+(spec.length-1)*KG;
        let sx=Math.round((CW-specW)/2);
        for (const b of spec) {
            const hov=this._hovered===this._buttons.length;
            this._drawKeyBtn(ctx, sx, sy, b.w, KH, b.label, hov, !!b.accent);
            this._buttons.push({u0:sx/CW, v0:sy/CH, u1:(sx+b.w)/CW, v1:(sy+KH)/CH, action:b.action});
            sx+=b.w+KG;
        }
    }

    _drawDiscoverTab(ctx, cx, cy, cw, ch) {
        const pname = document.getElementById('player_name')?.value || '';
        this._drawField(ctx, cx, cy, cw*0.5, 'Your Name', pname || '(set in browser)');
        cy += 92;

        const servers = this._servers;
        if (!servers) { ctx.fillStyle='rgba(130,175,255,0.6)'; ctx.font='26px system-ui,sans-serif'; ctx.textAlign='left'; ctx.textBaseline='top'; ctx.fillText('Loading servers…',cx,cy); return; }
        if (!servers.length) { ctx.fillStyle='rgba(130,175,255,0.5)'; ctx.font='26px system-ui,sans-serif'; ctx.textAlign='left'; ctx.textBaseline='top'; ctx.fillText('No servers available.',cx,cy); return; }

        const show = Math.min(servers.length, 6), rh = 98, rg = 8;
        for (let i = 0; i < show; i++) {
            const s = servers[i+this._scrollY]; if (!s) break;
            const ry = cy + i*(rh+rg);
            ctx.fillStyle = 'rgba(14,28,68,0.68)';
            ctx.beginPath(); ctx.roundRect(cx, ry, cw-192, rh, 12); ctx.fill();
            ctx.strokeStyle = 'rgba(45,105,210,0.42)'; ctx.lineWidth = 1.5; ctx.stroke();
            ctx.fillStyle = '#e8f4ff'; ctx.font = 'bold 27px system-ui,sans-serif';
            ctx.textAlign = 'left'; ctx.textBaseline = 'top';
            ctx.fillText(s.name||s.id||'Server', cx+14, ry+12);
            if (s.motd||s.description) {
                const d = (s.motd||s.description||'').slice(0,52);
                ctx.fillStyle = 'rgba(150,195,255,0.72)'; ctx.font = '21px system-ui,sans-serif';
                ctx.fillText(d+(d.length<(s.motd||s.description||'').length?'…':''), cx+14, ry+46);
            }
            if (s.players) {
                ctx.fillStyle = 'rgba(100,210,120,0.85)'; ctx.font = '21px system-ui,sans-serif';
                ctx.textAlign = 'right'; ctx.textBaseline = 'top';
                ctx.fillText('👥 '+s.players, cx+cw-198, ry+12);
            }
            const jbx = cx+cw-185, jbh = rh-18;
            const jhov = this._hovered === this._buttons.length;
            this._drawBtn(ctx, jbx, ry+9, 170, jbh, '⮕  Join',
                {top:'#1a5282',bot:'#0c2848',depth:'#050e1e',rim:'rgba(50,155,255,0.5)',htop:'#2670a8',hbot:'#143862'}, jhov, 23);
            this._buttons.push({ u0:cx/1800, v0:ry/1050, u1:(cx+cw)/1800, v1:(ry+rh)/1050, action:'join:'+i });
        }
        // Scroll hint
        if (this._servers && this._servers.length > 6) {
            ctx.fillStyle = 'rgba(120,170,255,0.5)'; ctx.font = '20px system-ui,sans-serif';
            ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
            ctx.fillText('Thumbstick to scroll  ↑↓', cx+cw/2, 1050-18);
        }
    }

    _drawSettingsTab(ctx, cx, cy, cw, ch) {
        const CW=1800, CH=1050;
        const groups = window._gameSettingsGroups;
        if (!groups) {
            ctx.fillStyle='rgba(160,195,255,0.65)'; ctx.font='26px system-ui,sans-serif';
            ctx.textAlign='left'; ctx.textBaseline='top';
            ctx.fillText('Settings loading… (launch the page first)', cx, cy); return;
        }
        const SHORT=['General','Mouse','Perf','Camera','Effects','Filters','Shadows','Post FX','Audio','HUD'];

        // ── Group tab strip ──────────────────────────────────────────────────
        const TW=140, TH=44, TG=6;
        let tx=cx;
        for (let i=0; i<groups.length; i++) {
            const active=i===this._sgrp, hov=this._hovered===this._buttons.length;
            ctx.fillStyle=active?'rgba(28,68,175,0.92)':(hov?'rgba(20,48,120,0.70)':'rgba(10,18,54,0.72)');
            ctx.beginPath(); ctx.roundRect(tx, cy, TW, TH, [8,8,0,0]); ctx.fill();
            if (active) { ctx.strokeStyle='rgba(70,155,255,0.65)'; ctx.lineWidth=1.5; ctx.stroke(); }
            ctx.fillStyle=active?'#ddeeff':'#5a88b0';
            ctx.font=`${active?'bold ':''}17px system-ui,sans-serif`;
            ctx.textAlign='center'; ctx.textBaseline='middle';
            ctx.fillText(SHORT[i]||groups[i].title.slice(0,8), tx+TW/2, cy+TH/2);
            this._buttons.push({u0:tx/CW, v0:cy/CH, u1:(tx+TW)/CW, v1:(cy+TH)/CH, action:'sgrp:'+i});
            tx+=TW+TG;
        }
        cy+=TH+2;
        // Tab strip bottom border
        ctx.strokeStyle='rgba(45,100,210,0.35)'; ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx+cw, cy); ctx.stroke();
        cy+=10;

        // ── Settings rows ────────────────────────────────────────────────────
        const stored=JSON.parse(localStorage.getItem('bloxel_game_settings')||'{}');
        const group=groups[this._sgrp];
        const settings=group.settings;
        const rowH=72, rowG=5;
        const resetFooter=68;
        const maxVisible=Math.floor((CH-cy-resetFooter)/(rowH+rowG));
        const maxScroll=Math.max(0, settings.length-maxVisible);
        if (this._sscroll>maxScroll) this._sscroll=maxScroll;

        const vis=settings.slice(this._sscroll, this._sscroll+maxVisible);
        for (let i=0; i<vis.length; i++) {
            const s=vis[i], ry=cy+i*(rowH+rowG);
            const cur=Object.prototype.hasOwnProperty.call(stored,s.key)?stored[s.key]:s.default;

            // Row bg
            ctx.fillStyle='rgba(10,19,54,0.68)';
            ctx.beginPath(); ctx.roundRect(cx, ry, cw, rowH, 7); ctx.fill();
            ctx.strokeStyle='rgba(35,75,185,0.28)'; ctx.lineWidth=1; ctx.stroke();

            // Label + desc
            ctx.fillStyle='#cce4ff'; ctx.font='bold 22px system-ui,sans-serif';
            ctx.textAlign='left'; ctx.textBaseline='top';
            ctx.fillText(s.label, cx+12, ry+7);
            ctx.fillStyle='rgba(110,158,210,0.62)'; ctx.font='15px system-ui,sans-serif';
            const desc=s.desc.length>72?s.desc.slice(0,71)+'…':s.desc;
            ctx.fillText(desc, cx+12, ry+35);

            // Control — right side
            const ctrlX=cx+cw-300;
            if (s.type==='bool') {
                const on=cur==='true';
                const hov=this._hovered===this._buttons.length;
                const ac=on?{top:'#196632',bot:'#0b3318',depth:'#051208',rim:'rgba(55,195,100,0.5)',htop:'#22884a',hbot:'#134820'}
                           :{top:'#282840',bot:'#141420',depth:'#0a0a18',rim:'rgba(70,70,115,0.4)',htop:'#363650',hbot:'#1c1c30'};
                this._drawBtn(ctx, ctrlX, ry+12, 130, rowH-24, on?'ON':'OFF', ac, hov, 22);
                this._buttons.push({u0:ctrlX/CW, v0:ry/CH, u1:(ctrlX+130)/CW, v1:(ry+rowH)/CH, action:'stog:'+s.key});
            } else if (s.type==='enum') {
                const ci=s.values.indexOf(cur), lhov=this._hovered===this._buttons.length;
                this._drawKeyBtn(ctx, ctrlX, ry+14, 44, rowH-28, '◀', lhov);
                this._buttons.push({u0:ctrlX/CW, v0:ry/CH, u1:(ctrlX+44)/CW, v1:(ry+rowH)/CH, action:'senum:'+s.key+':-1'});
                ctx.fillStyle='#ddeeff'; ctx.font='bold 21px system-ui,sans-serif';
                ctx.textAlign='center'; ctx.textBaseline='middle';
                ctx.fillText(cur, ctrlX+144, ry+rowH/2);
                const rhov=this._hovered===this._buttons.length;
                this._drawKeyBtn(ctx, ctrlX+246, ry+14, 44, rowH-28, '▶', rhov);
                this._buttons.push({u0:(ctrlX+246)/CW, v0:ry/CH, u1:(ctrlX+290)/CW, v1:(ry+rowH)/CH, action:'senum:'+s.key+':1'});
            } else if ((s.type==='float'||s.type==='int') && s.min!==undefined) {
                const lhov=this._hovered===this._buttons.length;
                this._drawKeyBtn(ctx, ctrlX, ry+14, 50, rowH-28, '−', lhov);
                this._buttons.push({u0:ctrlX/CW, v0:ry/CH, u1:(ctrlX+50)/CW, v1:(ry+rowH)/CH, action:'snum:'+s.key+':-1'});
                const disp=s.type==='int'?String(parseInt(cur)):parseFloat(cur).toFixed(2);
                ctx.fillStyle='#ddeeff'; ctx.font='bold 21px system-ui,sans-serif';
                ctx.textAlign='center'; ctx.textBaseline='middle';
                ctx.fillText(disp, ctrlX+150, ry+rowH/2);
                const rhov=this._hovered===this._buttons.length;
                this._drawKeyBtn(ctx, ctrlX+248, ry+14, 50, rowH-28, '+', rhov);
                this._buttons.push({u0:(ctrlX+248)/CW, v0:ry/CH, u1:(ctrlX+298)/CW, v1:(ry+rowH)/CH, action:'snum:'+s.key+':1'});
            } else {
                ctx.fillStyle='rgba(120,168,215,0.72)'; ctx.font='20px system-ui,sans-serif';
                ctx.textAlign='right'; ctx.textBaseline='middle';
                ctx.fillText(String(cur).slice(0,22), cx+cw-12, ry+rowH/2);
            }
        }

        // Scroll indicator
        if (settings.length>maxVisible) {
            ctx.fillStyle='rgba(110,160,255,0.45)'; ctx.font='19px system-ui,sans-serif';
            ctx.textAlign='center'; ctx.textBaseline='bottom';
            const range=`${this._sscroll+1}–${Math.min(this._sscroll+maxVisible,settings.length)} of ${settings.length}`;
            ctx.fillText('↑↓ thumbstick  '+range, cx+cw/2, CH-resetFooter-4);
        }

        // Reset defaults button
        const rsy=CH-58, rsw=250, rsx=cx+cw-rsw;
        const rshov=this._hovered===this._buttons.length;
        this._drawBtn(ctx, rsx, rsy, rsw, 50, '↺  Reset Defaults',
            {top:'#541414',bot:'#2c0808',depth:'#120404',rim:'rgba(215,70,70,0.5)',htop:'#721818',hbot:'#3c0e0e'}, rshov, 20);
        this._buttons.push({u0:rsx/CW, v0:rsy/CH, u1:(rsx+rsw)/CW, v1:(rsy+50)/CH, action:'sreset'});
    }

    _drawAccountTab(ctx, cx, cy, cw, ch) {
        const auth = window._etherdeckAuth;
        if (auth?.isLoggedIn()) {
            ctx.fillStyle = 'rgba(200,228,255,0.85)'; ctx.font = 'bold 32px system-ui,sans-serif';
            ctx.textAlign = 'left'; ctx.textBaseline = 'top';
            ctx.fillText('Signed in as', cx, cy);
            ctx.fillStyle = '#ffffff'; ctx.font = 'bold 52px system-ui,sans-serif';
            ctx.fillText(auth.getUsername()||'User', cx, cy+44);
            if (auth.getEmail()) {
                ctx.fillStyle = 'rgba(150,195,255,0.72)'; ctx.font = '25px system-ui,sans-serif';
                ctx.fillText(auth.getEmail(), cx, cy+110);
            }
            cy += 180;
            const soh = this._hovered === this._buttons.length;
            this._drawBtn(ctx, cx, cy, 250, 62, '🚪  Sign Out',
                {top:'#541414',bot:'#2c0808',depth:'#120404',rim:'rgba(215,70,70,0.5)',htop:'#721818',hbot:'#3c0e0e'}, soh, 25);
            this._buttons.push({ u0:cx/1800, v0:cy/1050, u1:(cx+250)/1800, v1:(cy+62)/1050, action:'signout' });
        } else {
            ctx.fillStyle = 'rgba(190,215,255,0.78)'; ctx.font = '28px system-ui,sans-serif';
            ctx.textAlign = 'left'; ctx.textBaseline = 'top';
            ctx.fillText('Sign in with your EtherDeck account to', cx, cy);
            ctx.fillText('access friends, cloud saves, and more.', cx, cy+38);
            cy += 110;
            const sih = this._hovered === this._buttons.length;
            this._drawBtn(ctx, cx, cy, 270, 68, '🔑  Sign In',
                {top:'#1c56a8',bot:'#0c2868',depth:'#06102e',rim:'rgba(75,155,255,0.55)',htop:'#2870cc',hbot:'#183888'}, sih, 27);
            this._buttons.push({ u0:cx/1800, v0:cy/1050, u1:(cx+270)/1800, v1:(cy+68)/1050, action:'signin' });
        }
    }

    _drawFriendsTab(ctx, cx, cy, cw, ch) {
        const items = document.querySelectorAll('#friends_list .friend-row, #friends_list [data-username]');
        if (!items.length) {
            ctx.fillStyle = 'rgba(160,195,255,0.62)'; ctx.font = '27px system-ui,sans-serif';
            ctx.textAlign = 'left'; ctx.textBaseline = 'top';
            ctx.fillText('No friends online — sign in to see friends.', cx, cy);
            return;
        }
        const show = Math.min(items.length, 8), rh = 70, rg = 8;
        for (let i = 0; i < show; i++) {
            const el = items[i], ry = cy + i*(rh+rg);
            const name = el.dataset?.username || el.querySelector('[class*="name"]')?.textContent || 'Friend';
            ctx.fillStyle = 'rgba(14,28,68,0.62)';
            ctx.beginPath(); ctx.roundRect(cx, ry, cw*0.65, rh, 10); ctx.fill();
            ctx.fillStyle = '#c8e4ff'; ctx.font = 'bold 25px system-ui,sans-serif';
            ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
            ctx.fillText('👤 '+name, cx+14, ry+rh/2);
        }
    }

    // ── Sign-in overlay ───────────────────────────────────────────────────────

    _drawSignInOverlay(ctx, CW, CH) {
        // Title
        ctx.fillStyle = '#e8f4ff'; ctx.font = 'bold 46px system-ui,sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText('🔑  Sign In to Bloxel', CW/2, 44);

        const fx = 400, fw = 1000;

        // Username / ID field
        const uf = this._siField === 0;
        ctx.fillStyle = uf ? 'rgba(22,48,115,0.92)' : 'rgba(10,20,60,0.85)';
        ctx.beginPath(); ctx.roundRect(fx, 118, fw, 68, 10); ctx.fill();
        ctx.strokeStyle = uf ? 'rgba(80,165,255,0.9)' : 'rgba(50,100,200,0.42)';
        ctx.lineWidth = uf ? 2.5 : 1.5; ctx.stroke();
        ctx.fillStyle = 'rgba(160,205,255,0.65)'; ctx.font = '21px system-ui,sans-serif';
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('Username or Email', fx+14, 122);
        ctx.fillStyle = '#ffffff'; ctx.font = '30px system-ui,sans-serif'; ctx.textBaseline = 'middle';
        ctx.fillText((this._siUsername||'') + (uf ? '|' : ''), fx+14, 152);
        this._buttons.push({ u0:fx/CW, v0:118/CH, u1:(fx+fw)/CW, v1:186/CH, action:'si_field:0' });

        // Password field
        const pf = this._siField === 1;
        ctx.fillStyle = pf ? 'rgba(22,48,115,0.92)' : 'rgba(10,20,60,0.85)';
        ctx.beginPath(); ctx.roundRect(fx, 208, fw, 68, 10); ctx.fill();
        ctx.strokeStyle = pf ? 'rgba(80,165,255,0.9)' : 'rgba(50,100,200,0.42)';
        ctx.lineWidth = pf ? 2.5 : 1.5; ctx.stroke();
        ctx.fillStyle = 'rgba(160,205,255,0.65)'; ctx.font = '21px system-ui,sans-serif';
        ctx.textBaseline = 'top'; ctx.fillText('Password', fx+14, 212);
        ctx.fillStyle = '#ffffff'; ctx.font = '30px system-ui,sans-serif'; ctx.textBaseline = 'middle';
        ctx.fillText('•'.repeat(this._siPassword.length) + (pf ? '|' : ''), fx+14, 242);
        this._buttons.push({ u0:fx/CW, v0:208/CH, u1:(fx+fw)/CW, v1:276/CH, action:'si_field:1' });

        // Status / error message
        if (this._siWorking) {
            ctx.fillStyle = 'rgba(120,185,255,0.85)'; ctx.font = '26px system-ui,sans-serif';
            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
            ctx.fillText('Signing in…', CW/2, 292);
        } else if (this._siMsg) {
            const isErr = this._siMsg.startsWith('!');
            ctx.fillStyle = isErr ? 'rgba(255,90,90,0.9)' : 'rgba(90,220,130,0.9)';
            ctx.font = '26px system-ui,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
            ctx.fillText(isErr ? this._siMsg.slice(1) : this._siMsg, CW/2, 292);
        }

        // Virtual QWERTY keyboard
        const KW=122, KH=82, KG=7;
        const rows = [
            ['1','2','3','4','5','6','7','8','9','0'],
            ['q','w','e','r','t','y','u','i','o','p'],
            ['a','s','d','f','g','h','j','k','l'],
            ['z','x','c','v','b','n','m'],
        ];
        const kStartY = 336;
        for (let ri = 0; ri < rows.length; ri++) {
            const row = rows[ri];
            const rowW = row.length*(KW+KG)-KG;
            let kx = Math.round((CW-rowW)/2);
            const ky = kStartY + ri*(KH+KG);
            for (const rawCh of row) {
                const ch = (this._siShift && /[a-z]/.test(rawCh)) ? rawCh.toUpperCase() : rawCh;
                const hov = this._hovered === this._buttons.length;
                this._drawKeyBtn(ctx, kx, ky, KW, KH, ch, hov);
                this._buttons.push({ u0:kx/CW, v0:ky/CH, u1:(kx+KW)/CW, v1:(ky+KH)/CH, action:'si_key:'+rawCh });
                kx += KW+KG;
            }
        }

        // Special row: Shift / Space / Bksp / Sign In / Cancel
        const sy = kStartY + 4*(KH+KG);
        const spec = [
            { w:158, label: this._siShift ? '⬆ ON' : '⬆ Shift', action:'si_shift' },
            { w:476, label: 'Space', action:'si_space' },
            { w:188, label: '⌫ Bksp', action:'si_bksp' },
            { w:244, label: this._siWorking ? '…' : '↵ Sign In', action:'si_submit', accent:true },
            { w:208, label: '✕ Cancel', action:'si_cancel' },
        ];
        const specTotalW = spec.reduce((s,b)=>s+b.w,0) + (spec.length-1)*KG;
        let sx = Math.round((CW-specTotalW)/2);
        for (const b of spec) {
            const hov = this._hovered === this._buttons.length;
            this._drawKeyBtn(ctx, sx, sy, b.w, KH, b.label, hov, !!b.accent);
            this._buttons.push({ u0:sx/CW, v0:sy/CH, u1:(sx+b.w)/CW, v1:(sy+KH)/CH, action:b.action });
            sx += b.w+KG;
        }
    }

    _drawKeyBtn(ctx, x, y, w, h, label, hov, accent=false) {
        const ac = accent
            ? {top:'#1c56a8',bot:'#0c2868',depth:'#06102e',rim:'rgba(75,155,255,0.55)',htop:'#2870cc',hbot:'#183888'}
            : {top:'#1a2860',bot:'#0e1840',depth:'#070a22',rim:'rgba(55,105,200,0.38)',htop:'#263878',hbot:'#16244e'};
        this._drawBtn(ctx, x, y, w, h, label, ac, hov, 24);
    }

    // ── UI drawing helpers ────────────────────────────────────────────────────

    _drawField(ctx, x, y, w, label, value) {
        ctx.fillStyle = 'rgba(165,205,255,0.65)'; ctx.font = '21px system-ui,sans-serif';
        ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillText(label, x, y);
        ctx.fillStyle = 'rgba(14,26,66,0.82)';
        ctx.beginPath(); ctx.roundRect(x, y+24, w, 46, 8); ctx.fill();
        ctx.strokeStyle = 'rgba(55,115,255,0.4)'; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.fillStyle = '#e8f0ff'; ctx.font = '24px system-ui,sans-serif';
        ctx.fillText(value, x+12, y+28);
    }

    // 3D extruded button — accent: {top,bot,depth,rim,htop,hbot}
    _drawBtn(ctx, x, y, w, h, label, ac, hov, fs=26) {
        const lift = hov ? 3 : 0;
        // Depth extrusion face (darker slab behind/below the button)
        ctx.fillStyle = ac.depth;
        ctx.beginPath(); ctx.roundRect(x+2, y+7-lift, w-4, h, 10); ctx.fill();
        // Main face gradient
        const gr = ctx.createLinearGradient(x, y-lift, x, y+h-lift);
        gr.addColorStop(0, hov ? ac.htop : ac.top);
        gr.addColorStop(1, hov ? ac.hbot : ac.bot);
        ctx.fillStyle = gr;
        ctx.beginPath(); ctx.roundRect(x, y-lift, w, h-4, 10); ctx.fill();
        // Top-rim bevel highlight
        ctx.strokeStyle = ac.rim; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.roundRect(x+1, y-lift+1, w-2, h-6, 9); ctx.stroke();
        // Right-side dark edge (thickness illusion)
        ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x+w-1, y-lift+3); ctx.lineTo(x+w-1, y-lift+h-6); ctx.stroke();
        // Label
        ctx.fillStyle = '#ffffff'; ctx.font = `bold ${fs}px system-ui,sans-serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(label, x+w/2, y+(h-4)/2-lift);
    }

    _uploadPanel() {
        const gl = this._gl;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this._pTex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._pCanvas);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.bindTexture(gl.TEXTURE_2D, null);
        this._dirty = false;
    }

    // ── XR frame loop ─────────────────────────────────────────────────────────

    _onFrame(time, frame) {
        if (!this._session) return;
        this._session.requestAnimationFrame(this._onFrame.bind(this));

        const gl   = this._gl;
        const pose = frame.getViewerPose(this._refSpace);
        if (!pose) return;

        if (this._dirty) { this._draw(); this._uploadPanel(); }

        // Camera basis vectors (billboard orientation)
        const camFwd = this._rayDir(pose.transform.orientation);
        let rx = -camFwd[2], ry = 0, rz = camFwd[0];
        const rl = Math.hypot(rx, rz);
        if (rl > 1e-6) { rx /= rl; rz /= rl; } else { rx = 1; rz = 0; }
        const camRight = [rx, ry, rz];
        const camUp = [
            ry*camFwd[2] - rz*camFwd[1],
            rz*camFwd[0] - rx*camFwd[2],
            rx*camFwd[1] - ry*camFwd[0],
        ];

        // Panel position: follow left hand, or use pinned custom position
        const hp = pose.transform.position;
        let pcx, pcy, pcz;
        if (this._panelPos) {
            ({ x: pcx, y: pcy, z: pcz } = this._panelPos);
        } else {
            let leftFound = false;
            for (const src of this._session.inputSources) {
                if (src.handedness !== 'left') continue;
                const gp = src.gripSpace ? frame.getPose(src.gripSpace, this._refSpace) : null;
                if (!gp) continue;
                pcx = gp.transform.position.x;
                pcy = gp.transform.position.y + 0.20;
                pcz = gp.transform.position.z;
                leftFound = true;
                break;
            }
            if (!leftFound) {
                pcx = hp.x + camFwd[0]*1.8;
                pcy = hp.y + camFwd[1]*1.8;
                pcz = hp.z + camFwd[2]*1.8;
            }
        }
        const PHW = this._PHW, PHH = this._PHH;

        this._processInput(frame, camFwd, camRight, camUp, pcx, pcy, pcz, PHW, PHH);

        // ── Render ──
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._xrLayer.framebuffer);
        for (const view of pose.views) {
            const vp = this._xrLayer.getViewport(view);
            gl.viewport(vp.x, vp.y, vp.width, vp.height);
            gl.scissor (vp.x, vp.y, vp.width, vp.height);
            gl.enable(gl.SCISSOR_TEST);
            gl.clearColor(0.005, 0.008, 0.028, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.disable(gl.SCISSOR_TEST);

            const pv = this._m4mul(view.projectionMatrix, view.transform.inverse.matrix);

            // Starfield
            gl.useProgram(this._starProg);
            gl.uniformMatrix4fv(this._uVP, false, pv);
            gl.uniform1f(this._uTime, time / 1000);
            gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
            gl.disable(gl.DEPTH_TEST);
            gl.bindVertexArray(this._starVAO);
            gl.drawArrays(gl.POINTS, 0, this._starCount);
            gl.bindVertexArray(null);
            gl.disable(gl.BLEND);

            // Panel billboard
            const mvp = this._m4mul(pv, this._m4billboard(pcx, pcy, pcz, PHW, PHH, camRight, camUp));
            gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            this._drawQuad(gl, this._pTex, mvp);
            gl.disable(gl.BLEND);

            // Right controller ray
            for (const src of this._session.inputSources) {
                if (src.handedness !== 'right') continue;
                const rp = frame.getPose(src.targetRaySpace, this._refSpace);
                if (!rp) continue;
                const ro = [rp.transform.position.x, rp.transform.position.y, rp.transform.position.z];
                this._drawRay(gl, pv, ro, this._rayDir(rp.transform.orientation), 3.0);
            }

            // Cursor dot on panel surface
            if (this._cursorHitPos) {
                const { x: dcx, y: dcy, z: dcz } = this._cursorHitPos;
                gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                this._drawQuad(gl, this._cursorTex,
                    this._m4mul(pv, this._m4billboard(dcx, dcy, dcz, 0.013, 0.013, camRight, camUp)));
                gl.disable(gl.BLEND);
            }
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    // ── Controller input ─────────────────────────────────────────────────────

    _processInput(frame, camFwd, camRight, camUp, pcx, pcy, pcz, PHW, PHH) {
        this._cursorHitPos = null;
        let newHover = -1, triggerBtn = null;

        for (const src of this._session.inputSources) {
            if (src.handedness !== 'right') continue;
            const rp = frame.getPose(src.targetRaySpace, this._refSpace);
            if (!rp) continue;
            const ro     = [rp.transform.position.x, rp.transform.position.y, rp.transform.position.z];
            const dir    = this._rayDir(rp.transform.orientation);
            const trigNow  = src.gamepad?.buttons[0]?.pressed ?? false;
            const trigWas  = this._trigWas;
            const trigDown = trigNow && !trigWas;
            const trigUp   = !trigNow && trigWas;
            const axes     = src.gamepad?.axes || [];
            const ryAx     = axes.length > 3 ? axes[3] : (axes[1] || 0);

            // ── Active drag: move panel along ray ────────────────────────────
            if (this._dragActive) {
                if (trigNow) {
                    this._panelPos = {
                        x: ro[0]+dir[0]*this._dragDist,
                        y: ro[1]+dir[1]*this._dragDist,
                        z: ro[2]+dir[2]*this._dragDist,
                    };
                }
                if (trigUp) this._dragActive = false;
                this._trigWas = trigNow; continue;
            }

            // ── Active resize: scale panel ───────────────────────────────────
            if (this._resizeActive) {
                if (trigNow) {
                    const nx=-camFwd[0], ny=-camFwd[1], nz=-camFwd[2];
                    const den=dir[0]*nx+dir[1]*ny+dir[2]*nz;
                    if (Math.abs(den)>1e-6) {
                        const dp=(pcx-ro[0])*nx+(pcy-ro[1])*ny+(pcz-ro[2])*nz;
                        const t=dp/den;
                        if (t>0.05) {
                            const hx=ro[0]+t*dir[0]-pcx, hy=ro[1]+t*dir[1]-pcy, hz=ro[2]+t*dir[2]-pcz;
                            const newW=Math.abs(hx*camRight[0]+hy*camRight[1]+hz*camRight[2]);
                            const ratio=this._resizePHW0/this._resizePHH0;
                            this._PHW=Math.max(0.28,Math.min(1.6,newW));
                            this._PHH=Math.max(0.15,Math.min(1.0,this._PHW/ratio));
                            this._dirty=true;
                        }
                    }
                }
                if (trigUp) this._resizeActive = false;
                this._trigWas = trigNow; continue;
            }

            // ── Normal hit testing ───────────────────────────────────────────
            const hit = this._rayHitBillboard(ro, dir, [pcx,pcy,pcz], camFwd, camRight, camUp, PHW, PHH);
            if (hit) {
                // Cursor 3D position
                const nx=-camFwd[0], ny=-camFwd[1], nz=-camFwd[2];
                const den=dir[0]*nx+dir[1]*ny+dir[2]*nz;
                if (Math.abs(den)>1e-6) {
                    const dp=(pcx-ro[0])*nx+(pcy-ro[1])*ny+(pcz-ro[2])*nz;
                    const t=dp/den;
                    this._cursorHitPos={
                        x:ro[0]+t*dir[0]-camFwd[0]*0.003,
                        y:ro[1]+t*dir[1]-camFwd[1]*0.003,
                        z:ro[2]+t*dir[2]-camFwd[2]*0.003,
                    };
                }

                // Drag handle: top 3.5% of panel (the grab-dot bar)
                if (hit.v < 0.035 && trigDown) {
                    const den2=dir[0]*nx+dir[1]*ny+dir[2]*nz;
                    if (Math.abs(den2)>1e-6) {
                        const dp2=(pcx-ro[0])*nx+(pcy-ro[1])*ny+(pcz-ro[2])*nz;
                        this._dragDist=dp2/den2;
                        this._dragActive=true;
                        this._panelPos=this._panelPos||{x:pcx,y:pcy,z:pcz};
                    }
                    this._trigWas=trigNow; continue;
                }

                // Resize handle: bottom-right corner (u>0.92 && v>0.88)
                if (hit.u > 0.92 && hit.v > 0.88 && trigDown) {
                    this._resizeActive=true;
                    this._resizePHW0=PHW;
                    this._resizePHH0=PHH;
                    this._trigWas=trigNow; continue;
                }

                // Regular button hit
                for (let bi=0; bi<this._buttons.length; bi++) {
                    const btn=this._buttons[bi];
                    if (hit.u>=btn.u0&&hit.u<=btn.u1&&hit.v>=btn.v0&&hit.v<=btn.v1) {
                        newHover=bi;
                        if (trigDown) triggerBtn=btn;
                        break;
                    }
                }
            }

            // Thumbstick Y → scroll lists
            const now=performance.now();
            if (Math.abs(ryAx)>0.3 && now-this._lastScrollT>220) {
                this._lastScrollT=now;
                const dir=ryAx>0?1:-1;
                if (this._tab==='discover'&&this._servers) {
                    const max=Math.max(0,this._servers.length-6);
                    this._scrollY=Math.max(0,Math.min(max,this._scrollY+dir));
                    this._dirty=true;
                } else if (this._tab==='play') {
                    const worlds=this._worlds||[];
                    const total=worlds.length+1;
                    const maxR=this._playFocus?3:6;
                    this._playWScroll=Math.max(0,Math.min(Math.max(0,total-maxR),this._playWScroll+dir));
                    this._dirty=true;
                } else if (this._tab==='settings'&&window._gameSettingsGroups) {
                    const grp=window._gameSettingsGroups[this._sgrp];
                    const maxV=Math.floor((1050-156-68)/(72+5));
                    this._sscroll=Math.max(0,Math.min(Math.max(0,grp.settings.length-maxV),this._sscroll+dir));
                    this._dirty=true;
                }
            }
            this._trigWas=trigNow;
        }

        if (newHover!==this._hovered) { this._hovered=newHover; this._dirty=true; }
        if (triggerBtn) this._execAction(triggerBtn.action);
    }

    _execAction(action) {
        if (action.startsWith('tab:')) {
            this._tab=action.slice(4); this._hovered=-1; this._scrollY=0; this._dirty=true; return;
        }
        if (action==='signin') {
            this._signInMode=true; this._siMsg=''; this._hovered=-1; this._dirty=true; return;
        }
        if (action==='signout') { window._etherdeckAuth?.logout?.(); this._dirty=true; return; }
        if (action==='newworld') {
            if (typeof switchTab==='function') switchTab('singleplayer');
            setTimeout(()=>{
                const sel=document.getElementById('multiplayer_world');
                if (sel){sel.value='';sel.dispatchEvent(new Event('change'));}
                document.getElementById('new_world_name')?.focus();
            },100); return;
        }
        if (action.startsWith('launch:')) {
            const wid=action.slice(7);
            const sel=document.getElementById('multiplayer_world');
            if (sel){sel.value=wid;sel.dispatchEvent(new Event('change'));}
            setTimeout(()=>document.getElementById('launch_server')?.click(),80); return;
        }
        if (action.startsWith('join:')) {
            const idx=parseInt(action.slice(5));
            const server=this._servers?.[idx+this._scrollY];
            if (!server) return;
            if (window._vrJoinServer) window._vrJoinServer(server);
            else document.querySelectorAll('#server_cards button')[idx]?.click();
            return;
        }
        // ── Sign-in overlay actions ──────────────────────────────────────────
        if (action==='si_cancel') {
            this._signInMode=false; this._siMsg=''; this._hovered=-1; this._dirty=true; return;
        }
        if (action==='si_shift') { this._siShift=!this._siShift; this._dirty=true; return; }
        if (action.startsWith('si_field:')) {
            this._siField=parseInt(action.slice(9)); this._dirty=true; return;
        }
        if (action.startsWith('si_key:')) {
            const rawCh=action.slice(7);
            const ch=(this._siShift&&/[a-z]/.test(rawCh))?rawCh.toUpperCase():rawCh;
            if (this._siField===0) this._siUsername+=ch; else this._siPassword+=ch;
            this._siShift=false; this._dirty=true; return;
        }
        if (action==='si_space') {
            if (this._siField===0) this._siUsername+=' '; else this._siPassword+=' ';
            this._dirty=true; return;
        }
        if (action==='si_bksp') {
            if (this._siField===0) this._siUsername=this._siUsername.slice(0,-1);
            else this._siPassword=this._siPassword.slice(0,-1);
            this._dirty=true; return;
        }
        if (action==='si_submit') {
            if (this._siWorking) return;
            const auth=window._etherdeckAuth;
            if (!auth){this._siMsg='!Auth unavailable';this._dirty=true;return;}
            this._siWorking=true; this._siMsg=''; this._dirty=true;
            auth.login(this._siUsername.trim(), this._siPassword)
                .then(res=>{
                    this._siWorking=false;
                    if (res.success) {
                        this._signInMode=false;
                        this._siUsername=''; this._siPassword=''; this._siMsg='';
                        this._tab='account';
                    } else {
                        this._siMsg='!'+(res.message||'Login failed');
                    }
                    this._dirty=true;
                })
                .catch(err=>{
                    this._siWorking=false;
                    this._siMsg='!Error: '+err.message;
                    this._dirty=true;
                });
            return;
        }
        // ── Play tab field focus / keyboard ──────────────────────────────────
        if (action.startsWith('pf:')) {
            const field=action.slice(3);
            if (this._playFocus===field) { this._playFocus=null; this._playEditBuf=''; }
            else {
                this._playFocus=field;
                this._playEditBuf=field==='name'
                    ? (document.getElementById('multiplayer_username')?.value||'')
                    : (document.getElementById('new_world_name')?.value||'');
            }
            this._playShift=false; this._dirty=true; return;
        }
        if (action.startsWith('psel:')) {
            this._playWorldSel=action.slice(5);
            this._playMsg='';
            const sel=document.getElementById('multiplayer_world');
            if (sel){sel.value=this._playWorldSel; sel.dispatchEvent(new Event('change'));}
            this._dirty=true; return;
        }
        if (action==='play_launch') {
            const uname=(this._playFocus==='name'?this._playEditBuf
                        :(document.getElementById('multiplayer_username')?.value||'')).trim();
            if (!uname){this._playMsg='Enter a player name'; this._dirty=true; return;}
            const unEl=document.getElementById('multiplayer_username');
            if (unEl) unEl.value=uname;
            const wid=this._playWorldSel??'';
            const selEl=document.getElementById('multiplayer_world');
            if (selEl){selEl.value=wid; selEl.dispatchEvent(new Event('change'));}
            if (wid==='') {
                const wname=(this._playFocus==='worldname'?this._playEditBuf
                            :(document.getElementById('new_world_name')?.value||'')).trim();
                if (!wname){this._playMsg='Enter a world name'; this._dirty=true; return;}
                const wnEl=document.getElementById('new_world_name');
                if (wnEl) wnEl.value=wname;
            }
            this._playMsg=''; this._dirty=true;
            setTimeout(()=>document.getElementById('launch_server')?.click(), 80);
            return;
        }
        if (action.startsWith('pk_key:')) {
            const r=action.slice(7);
            const c=(this._playShift&&/[a-z]/.test(r))?r.toUpperCase():r;
            this._playEditBuf+=c; this._playShift=false; this._dirty=true; return;
        }
        if (action==='pk_space'){this._playEditBuf+=' '; this._dirty=true; return;}
        if (action==='pk_bksp'){this._playEditBuf=this._playEditBuf.slice(0,-1); this._dirty=true; return;}
        if (action==='pk_shift'){this._playShift=!this._playShift; this._dirty=true; return;}
        if (action==='pk_cancel'){this._playFocus=null; this._playEditBuf=''; this._playShift=false; this._dirty=true; return;}
        if (action==='pk_done'){
            if (this._playFocus==='name'){
                const el=document.getElementById('multiplayer_username');
                if (el) el.value=this._playEditBuf;
            } else if (this._playFocus==='worldname'){
                const el=document.getElementById('new_world_name');
                if (el) el.value=this._playEditBuf;
            }
            this._playFocus=null; this._playEditBuf=''; this._playShift=false; this._dirty=true; return;
        }
        // ── Settings tab ─────────────────────────────────────────────────────
        if (action.startsWith('sgrp:')){
            this._sgrp=parseInt(action.slice(5)); this._sscroll=0; this._dirty=true; return;
        }
        if (action.startsWith('stog:')){
            const key=action.slice(5);
            const m=JSON.parse(localStorage.getItem('bloxel_game_settings')||'{}');
            const def=window._gameSettingsGroups?.flatMap(g=>g.settings).find(s=>s.key===key)?.default??'false';
            const cur=Object.prototype.hasOwnProperty.call(m,key)?m[key]:def;
            m[key]=cur==='true'?'false':'true';
            localStorage.setItem('bloxel_game_settings',JSON.stringify(m));
            this._dirty=true; return;
        }
        if (action.startsWith('senum:')){
            const parts=action.split(':'), key=parts[1], delta=parseInt(parts[2]);
            const s=window._gameSettingsGroups?.flatMap(g=>g.settings).find(s=>s.key===key);
            if (!s?.values) return;
            const m=JSON.parse(localStorage.getItem('bloxel_game_settings')||'{}');
            const cur=Object.prototype.hasOwnProperty.call(m,key)?m[key]:s.default;
            const ci=s.values.indexOf(cur), ni=(ci+delta+s.values.length)%s.values.length;
            m[key]=s.values[ni];
            localStorage.setItem('bloxel_game_settings',JSON.stringify(m));
            this._dirty=true; return;
        }
        if (action.startsWith('snum:')){
            const parts=action.split(':'), key=parts[1], dir=parseInt(parts[2]);
            const s=window._gameSettingsGroups?.flatMap(g=>g.settings).find(s=>s.key===key);
            if (!s) return;
            const m=JSON.parse(localStorage.getItem('bloxel_game_settings')||'{}');
            const cur=parseFloat(Object.prototype.hasOwnProperty.call(m,key)?m[key]:s.default);
            const step=s.type==='int'?1:Math.max(0.01,(s.max-s.min)/20);
            let nv=cur+dir*step;
            if (s.min!==undefined) nv=Math.max(s.min,nv);
            if (s.max!==undefined) nv=Math.min(s.max,nv);
            m[key]=s.type==='int'?String(Math.round(nv)):nv.toFixed(2);
            localStorage.setItem('bloxel_game_settings',JSON.stringify(m));
            this._dirty=true; return;
        }
        if (action==='sreset'){
            localStorage.removeItem('bloxel_game_settings'); this._dirty=true; return;
        }
    }

    // ── Starfield ────────────────────────────────────────────────────────────

    _initStarfield() {
        const gl = this._gl;
        const VS = `#version 300 es
precision highp float;
in vec3 a_pos; in float a_br; uniform mat4 u_vp; uniform float u_t; out float v_br;
void main() {
    v_br = a_br * (0.5 + 0.5 * sin(u_t * 1.7 + a_pos.x * 6.3 + a_pos.y * 4.8));
    gl_Position = u_vp * vec4(a_pos, 1.0); gl_PointSize = max(1.5, a_br * 4.5); }`;
        const FS = `#version 300 es
precision mediump float;
in float v_br; out vec4 col;
void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float a = max(0.0, 1.0 - d * d * 3.2);
    col = vec4(0.72 + v_br*0.28, 0.86 + v_br*0.14, 1.0, a * v_br); }`;
        this._starProg = this._mkProg(gl, VS, FS);
        this._uVP   = gl.getUniformLocation(this._starProg, 'u_vp');
        this._uTime = gl.getUniformLocation(this._starProg, 'u_t');
        const N = 1400, d = new Float32Array(N*4);
        for (let i = 0; i < N; i++) {
            const band = Math.random() < 0.4;
            const th = Math.random()*Math.PI*2;
            const ph = band ? Math.PI/2+(Math.random()-0.5)*0.6 : Math.acos(2*Math.random()-1);
            const r = 8+Math.random()*2.5;
            d[i*4] = r*Math.sin(ph)*Math.cos(th); d[i*4+1] = r*Math.sin(ph)*Math.sin(th)*0.75;
            d[i*4+2] = r*Math.cos(ph); d[i*4+3] = band ? 0.1+Math.random()*0.5 : 0.15+Math.random()*0.85;
        }
        this._starVAO = gl.createVertexArray();
        gl.bindVertexArray(this._starVAO);
        const vbo = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, d, gl.STATIC_DRAW);
        const aP = gl.getAttribLocation(this._starProg, 'a_pos');
        gl.enableVertexAttribArray(aP); gl.vertexAttribPointer(aP, 3, gl.FLOAT, false, 16, 0);
        const aB = gl.getAttribLocation(this._starProg, 'a_br');
        gl.enableVertexAttribArray(aB); gl.vertexAttribPointer(aB, 1, gl.FLOAT, false, 16, 12);
        gl.bindVertexArray(null); this._starCount = N;
    }

    // ── GL helpers ────────────────────────────────────────────────────────────

    _mkTex(gl, w, h) {
        const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null); return t;
    }

    _mkProg(gl, vsrc, fsrc) {
        const mk = (t, s) => { const sh = gl.createShader(t); gl.shaderSource(sh, s); gl.compileShader(sh); if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) console.error('[VRWeb]', gl.getShaderInfoLog(sh)); return sh; };
        const p = gl.createProgram();
        gl.attachShader(p, mk(gl.VERTEX_SHADER, vsrc));
        gl.attachShader(p, mk(gl.FRAGMENT_SHADER, fsrc));
        gl.linkProgram(p); return p;
    }

    _drawQuad(gl, tex, mvp) {
        gl.useProgram(this._qProg); gl.bindVertexArray(this._qVAO);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.uniform1i(this._qTexLoc, 0); gl.uniformMatrix4fv(this._qMvpLoc, false, mvp);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); gl.bindVertexArray(null);
    }

    _drawRay(gl, pv, origin, dir, len) {
        gl.useProgram(this._lProg); gl.uniformMatrix4fv(this._lVpLoc, false, pv);
        gl.bindVertexArray(this._lVAO); gl.bindBuffer(gl.ARRAY_BUFFER, this._lVBO);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array([
            origin[0],origin[1],origin[2],
            origin[0]+dir[0]*len, origin[1]+dir[1]*len, origin[2]+dir[2]*len,
        ]));
        gl.drawArrays(gl.LINES, 0, 2); gl.bindVertexArray(null); gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    _m4mul(a, b) {
        const o = new Float32Array(16);
        for (let c = 0; c < 4; c++)
            for (let r = 0; r < 4; r++) {
                let s = 0;
                for (let k = 0; k < 4; k++) s += a[k*4+r] * b[c*4+k];
                o[c*4+r] = s;
            }
        return o;
    }

    _m4billboard(cx, cy, cz, hw, hh, right, up) {
        const m = new Float32Array(16);
        m[0]=right[0]*hw; m[1]=right[1]*hw; m[2]=right[2]*hw; m[3]=0;
        m[4]=up[0]*hh;    m[5]=up[1]*hh;    m[6]=up[2]*hh;    m[7]=0;
        m[8]=0; m[9]=0; m[10]=1; m[11]=0;
        m[12]=cx; m[13]=cy; m[14]=cz; m[15]=1;
        return m;
    }

    _rayDir(quat) {
        const {x: qx, y: qy, z: qz, w: qw} = quat;
        const cx = -qy, cy2 = qx, cz = 0;
        return [
            2*(qw*cx  + qy*cz  - qz*cy2),
            2*(qw*cy2 + qz*cx  - qx*cz),
            -1 + 2*(qw*cz + qx*cy2 - qy*cx),
        ];
    }

    _rayHitBillboard(origin, dir, center, fwd, right, up, hw, hh) {
        const nx=-fwd[0], ny=-fwd[1], nz=-fwd[2];
        const denom = dir[0]*nx + dir[1]*ny + dir[2]*nz;
        if (Math.abs(denom) < 1e-6) return null;
        const d = (center[0]-origin[0])*nx + (center[1]-origin[1])*ny + (center[2]-origin[2])*nz;
        const t = d/denom; if (t < 0.05) return null;
        const hx = origin[0]+t*dir[0]-center[0];
        const hy = origin[1]+t*dir[1]-center[1];
        const hz = origin[2]+t*dir[2]-center[2];
        const ul = hx*right[0]+hy*right[1]+hz*right[2];
        const vl = hx*up[0]+hy*up[1]+hz*up[2];
        if (Math.abs(ul) > hw || Math.abs(vl) > hh) return null;
        return { u: ul/hw*0.5+0.5, v: 1-(vl/hh*0.5+0.5) };
    }

    exit() {
        if (this._session) this._session.end().catch(() => {});
        else this._onSessionEnd();
    }

    detachForGameLaunch() {
        window._vrWebsiteLaunching = true;
        if (this._session) {
            // Remove our end-listener so it doesn't fire when the game takes over
            if (this._endHandler) this._session.removeEventListener('end', this._endHandler);
            // Hand off the live session to the game — do NOT call session.end()
            window._vrHandoffSession = this._session;
            this._session = null;
        }
        this._cleanup();
    }

    _onSessionEnd() { this._session = null; this._cleanup(); }

    _cleanup() {
        document.getElementById('vr_bg_canvas')?.remove();
        VRWebsiteMode._instance = null;
    }
}

// Auto-detect VR headset when the launcher page loads (not during gameplay)
if (typeof document !== 'undefined' && !window._vrWebsiteInitDone) {
    window._vrWebsiteInitDone = true;
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => VRWebsiteMode.autoInit());
    } else {
        VRWebsiteMode.autoInit();
    }
}
// ===== end VR Website Mode =====

// Pulled from builtin/mainmenu/settings/dlg_settings.lua
const SUPPORTED_LANGUAGES = [
	['be', "Беларуская [be]"],
	['bg', "Български [bg]"],
	['ca', "Català [ca]"],
	['cs', "Česky [cs]"],
	['cy', "Cymraeg [cy]"],
	['da', "Dansk [da]"],
	['de', "Deutsch [de]"],
	['el', "Ελληνικά [el]"],
	['en', "English [en]"],
	['eo', "Esperanto [eo]"],
	['es', "Español [es]"],
	['et', "Eesti [et]"],
	['eu', "Euskara [eu]"],
	['fi', "Suomi [fi]"],
	['fil', "Wikang Filipino [fil]"],
	['fr', "Français [fr]"],
	['gd', "Gàidhlig [gd]"],
	['gl', "Galego [gl]"],
	['hu', "Magyar [hu]"],
	['id', "Bahasa Indonesia [id]"],
	['it', "Italiano [it]"],
	['ja', "日本語 [ja]"],
	['jbo', "Lojban [jbo]"],
	['kk', "Қазақша [kk]"],
	['ko', "한국어 [ko]"],
	['ky', "Kırgızca / Кыргызча [ky]"],
	['lt', "Lietuvių [lt]"],
	['lv', "Latviešu [lv]"],
	['mn', "Монгол [mn]"],
	['mr', "मराठी [mr]"],
	['ms', "Bahasa Melayu [ms]"],
	['nb', "Norsk Bokmål [nb]"],
	['nl', "Nederlands [nl]"],
	['nn', "Norsk Nynorsk [nn]"],
	['oc', "Occitan [oc]"],
	['pl', "Polski [pl]"],
	['pt', "Português [pt]"],
	['pt_BR', "Português do Brasil [pt_BR]"],
	['ro', "Română [ro]"],
	['ru', "Русский [ru]"],
	['sk', "Slovenčina [sk]"],
	['sl', "Slovenščina [sl]"],
	['sr_Cyrl', "Српски [sr_Cyrl]"],
	['sr_Latn', "Srpski (Latinica) [sr_Latn]"],
	['sv', "Svenska [sv]"],
	['sw', "Kiswahili [sw]"],
	['tr', "Türkçe [tr]"],
	['tt', "Tatarça [tt]"],
	['uk', "Українська [uk]"],
	['vi', "Tiếng Việt [vi]"],
	['zh_CN', "中文 (简体) [zh_CN]"],
	['zh_TW', "正體中文 (繁體) [zh_TW]"],
];

const SUPPORTED_LANGUAGES_MAP = new Map(SUPPORTED_LANGUAGES);

function getDefaultLanguage() {
    const fuzzy = [];

    const url_params = new URLSearchParams(window.location.search);
    if (url_params.has("lang")) {
        const lang = url_params.get("lang");
        if (SUPPORTED_LANGUAGES_MAP.has(lang)) {
            return lang;
        }
        alert(`Invalid lang parameter: ${lang}`);
        return 'en';
    }

    for (let candidate of navigator.languages) {
        candidate = candidate.replaceAll('-', '_');

        if (SUPPORTED_LANGUAGES_MAP.has(candidate)) {
            return candidate;
        }

        // Try stripping off the country code
        const parts = candidate.split('_');
        if (parts.length > 2) {
            const rcandidate = parts.slice(0, 2).join('_');
            if (SUPPORTED_LANGUAGES_MAP.has(rcandidate)) {
                return rcandidate;
            }
        }

        // Try just matching the language code
        if (parts.length > 1) {
            if (SUPPORTED_LANGUAGES_MAP.has(parts[0])) {
                return parts[0];
            }
        }

        // Try fuzzy match (ignore country code of both)
        for (let entry of SUPPORTED_LANGUAGES) {
            if (entry[0].split('_')[0] == parts[0]) {
                fuzzy.push(entry[0]);
            }
        }
    }

    if (fuzzy.length > 0) {
        return fuzzy[0];
    }

    return 'en';
}
