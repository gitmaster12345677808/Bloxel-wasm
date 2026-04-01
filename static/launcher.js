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
}

body {
    font-family: Verdana, Geneva, sans-serif;
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

#controls {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 8px;
    min-height: 44px;
    padding: 8px 0;
    font-size: 14px;
}

#controls span {
    display: flex;
    align-items: center;
    gap: 8px;
}

#controls select,
#controls input[type="button"] {
    min-height: 40px;
    border: 1px solid #3b4756;
    border-radius: 10px;
    background: #0d131a;
    color: #f4f7fb;
    padding: 0 12px;
}

#visor_toggle {
    min-height: 40px;
    border: 1px solid #3b4756;
    border-radius: 10px;
    background: #0d131a;
    color: #f4f7fb;
    padding: 0 12px;
    cursor: pointer;
}

#controls_hint {
    color: #9ca9bc;
}

#join_code_banner {
    display: none;
    align-items: center;
    gap: 8px;
    background: rgba(10, 40, 22, 0.9);
    border: 1px solid #2a6040;
    border-radius: 10px;
    padding: 4px 12px;
    font-size: 12px;
    color: #a8f0c8;
    cursor: pointer;
    user-select: all;
    max-width: 280px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

#join_code_banner.visible {
    display: inline-flex;
}

#join_code_banner .jcb-label {
    font-size: 10px;
    color: #6aad8a;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    flex-shrink: 0;
}

#join_code_text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1 1 auto;
    min-width: 0;
}

#join_code_banner .jcb-copy-hint {
    font-size: 10px;
    color: #6aad8a;
    flex-shrink: 0;
}

.console {
    width: min(100%, 1200px);
  margin: 0 auto;
    margin-top: 0;
    border: 1px solid #1d2631;
    border-radius: 12px;
    padding-left: 0;
    padding-right: 0;
  display: block;
    background-color: #020406;
  color: white;
  font-family: 'Lucida Console', Monaco, monospace;
  outline: none;
    box-sizing: border-box;
    resize: none;
}

#header {
    flex: 0 0 auto;
    padding: max(8px, env(safe-area-inset-top)) 12px 0;
}

#footer {
    flex: 0 0 auto;
    padding: 8px 12px max(10px, env(safe-area-inset-bottom));
}

#canvas_container {
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
    overflow: hidden;
}

body.visor-hidden #header,
body.visor-hidden #footer {
    display: none;
}

body.visor-hidden #canvas_container {
    padding-top: max(8px, env(safe-area-inset-top));
    padding-bottom: max(8px, env(safe-area-inset-bottom));
}

#overlay_visor_button {
    display: none;
    position: absolute;
    top: max(10px, env(safe-area-inset-top));
    right: max(10px, env(safe-area-inset-right));
    z-index: 10;
    min-height: 40px;
    padding: 0 14px;
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 10px;
    background: rgba(13, 19, 26, 0.75);
    color: #f4f7fb;
    font-size: 14px;
    cursor: pointer;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
}

body.visor-hidden #overlay_visor_button {
    display: inline-flex;
    align-items: center;
}

#overlay_chat_button {
    display: none;
    position: absolute;
    bottom: max(10px, env(safe-area-inset-bottom));
    right: max(10px, env(safe-area-inset-right));
    z-index: 10;
    min-height: 40px;
    padding: 0 14px;
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 10px;
    background: rgba(13, 19, 26, 0.75);
    color: #f4f7fb;
    font-size: 14px;
    cursor: pointer;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
}

body.visor-hidden #overlay_chat_button {
    display: inline-flex;
    align-items: center;
}

#chat_overlay {
    display: none;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 20;
    padding: 8px 12px max(10px, env(safe-area-inset-bottom));
    background: rgba(13, 19, 26, 0.88);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    align-items: center;
    gap: 8px;
}

#chat_overlay.visible {
    display: flex;
}

#chat_input {
    flex: 1 1 auto;
    min-height: 40px;
    border: 1px solid #3b4756;
    border-radius: 10px;
    background: #0d131a;
    color: #f4f7fb;
    padding: 0 12px;
    font-size: 15px;
    outline: none;
    box-sizing: border-box;
}

#chat_send_btn, #chat_cancel_btn {
    min-height: 40px;
    padding: 0 14px;
    border: 1px solid #3b4756;
    border-radius: 10px;
    background: #0d131a;
    color: #f4f7fb;
    font-size: 14px;
    cursor: pointer;
    flex-shrink: 0;
}

#chat_send_btn {
    background: #0d2b1a;
    border-color: #2a6040;
}

#chat_mode_btn {
    min-height: 40px;
    padding: 0 10px;
    border: 1px solid #3b4756;
    border-radius: 10px;
    background: #1a1a0d;
    color: #c8b86a;
    font-size: 13px;
    cursor: pointer;
    flex-shrink: 0;
    white-space: nowrap;
}

#chat_mode_btn.replace-mode {
    background: #1a0d2b;
    border-color: #5a3090;
    color: #c89af4;
}

#progressbar_div {
    margin: 0 auto 8px;
    width: min(460px, 100%);
}

#progressbar {
    width: 100%;
    height: 12px;
}

@media (max-width: 700px) {
    #controls {
        font-size: 13px;
    }

    #controls span {
        width: 100%;
        justify-content: center;
    }
}
`;

const rtHTML = `
  <div id="header">

  <div class="emscripten">
    <span id="controls">
      <span>
        <select id="resolution" onchange="fixGeometry()">
          <option value="high">High Res</option>
          <option value="medium">Medium</option>
          <option value="low">Low Res</option>
        </select>
      </span>
      <span>
        <select id="aspectRatio" onchange="fixGeometry()">
          <option value="any">Fit Screen</option>
          <option value="4:3">4:3</option>
          <option value="16:9">16:9</option>
          <option value="5:4">5:4</option>
          <option value="21:9">21:9</option>
          <option value="32:9">32:9</option>
          <option value="1:1">1:1</option>
        </select>
      </span>
            <span>
                <input id="console_button" type="button" value="Show Console" onclick="consoleToggle()">
                <input id="visor_toggle" type="button" value="Hide Visor" onclick="toggleVisorMode()">
                <input id="chat_button" type="button" value="Chat" onclick="openChatOverlay()">
            </span>
            <span id="controls_hint">Landscape works best on phones and tablets.</span>
        <div id="join_code_banner" onclick="copyJoinCode()">
          <span class="jcb-label">Join&#160;Link:</span>
          <span id="join_code_text"></span>
          <span class="jcb-copy-hint">&#x2398;&#160;Copy</span>
        </div>
    </span>
    <div id="progressbar_div" style="display: none">
      <progress id="progressbar" value="0" max="100">0%</progress>
    </div>
  </div>

  </div>

  <div class="emscripten" id="canvas_container">
    <button id="overlay_visor_button" onclick="toggleVisorMode()">Show Visor</button>
    <button id="overlay_chat_button" onclick="openChatOverlay()">Chat</button>
    <div id="chat_overlay">
      <button id="chat_mode_btn" onclick="toggleChatMode()" title="Switch between Chat mode (opens chat) and Type mode (replaces text in current field)">Chat</button>
      <input id="chat_input" type="text" placeholder="Chat message..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
      <button id="chat_send_btn" onclick="sendChatMessage()">Send</button>
      <button id="chat_cancel_btn" onclick="closeChatOverlay()">&#x2715;</button>
    </div>
  </div>

  <div id="footer">
    <textarea id="console_output" class="console" rows="8" style="display: none; height: 200px"></textarea>
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

function setVisorJoinCode(url) {
    joinCodeUrl = url;
    if (joinCodeBanner && joinCodeText) {
        joinCodeText.textContent = url;
        joinCodeBanner.classList.add('visible');
    }
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
    document.body.classList.toggle('visor-hidden', hidden);
    if (visorToggleButton) {
        visorToggleButton.value = hidden ? 'Show Visor' : 'Hide Visor';
    }
    fixGeometry(true);
}

function toggleVisorMode() {
    const willHide = !visorHidden;
    setVisorMode(willHide);
    if (willHide && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
    }
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
    const resolutionSelect = document.getElementById('resolution');
    const aspectRatioSelect = document.getElementById('aspectRatio');
    const controlsHint = document.getElementById('controls_hint');
    if (!resolutionSelect || !aspectRatioSelect || !controlsHint) {
        return;
    }

    if (isMobileLayout()) {
        resolutionSelect.value = 'high';
        aspectRatioSelect.value = 'any';
        controlsHint.textContent = 'Canvas size is capped on mobile. Install to home screen for the cleanest layout.';
        return;
    }

    controlsHint.textContent = 'Full screen: try F11 or Command+Shift+F.';
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
    visorToggleButton = document.getElementById('visor_toggle');
    overlayVisorButton = document.getElementById('overlay_visor_button');
    chatOverlay = document.getElementById('chat_overlay');
    chatInput = document.getElementById('chat_input');
    chatModeBtn = document.getElementById('chat_mode_btn');
    joinCodeBanner = document.getElementById('join_code_banner');
    joinCodeText = document.getElementById('join_code_text');
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
    // Triggers the first and all future updates
    consoleUpdate();

    setVisorMode(false);

    progressBar = document.getElementById('progressbar');
    progressBarDiv = document.getElementById('progressbar_div');
    updateProgressBar(0, 0);
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
    emloop_invoke_main(argc, argv);
    // Pausing and unpausing here gives the browser time to redraw the DOM
    // before Minetest freezes the main thread generating the world. If this
    // is not done, the page will stay frozen for several seconds
    emloop_request_animation_frame();
    mtScheduler.setCondition("main_called");
}

var emloop_pause;
var emloop_unpause;
var emloop_init_sound;
var emloop_invoke_main;
var emloop_install_pack;
var emloop_set_minetest_conf;
var irrlicht_want_pointerlock;
var irrlicht_force_pointerlock;
var irrlicht_resize;
var emsocket_init;
var emsocket_set_proxy;
var emsocket_set_vpn;

// Called when the wasm module is ready
function emloop_ready() {
    emloop_pause = cwrap("emloop_pause", null, []);
    emloop_unpause = cwrap("emloop_unpause", null, []);
    emloop_init_sound = cwrap("emloop_init_sound", null, []);
    emloop_invoke_main = cwrap("emloop_invoke_main", null, ["number", "number"]);
    emloop_install_pack = cwrap("emloop_install_pack", null, ["number", "number", "number"]);
    emloop_set_minetest_conf = cwrap("emloop_set_minetest_conf", null, ["number"]);
    irrlicht_want_pointerlock = cwrap("irrlicht_want_pointerlock", "number");
    irrlicht_force_pointerlock = cwrap("irrlicht_force_pointerlock", null);
    irrlicht_resize = cwrap("irrlicht_resize", null, ["number", "number"]);
    emsocket_init = cwrap("emsocket_init", null, []);
    emsocket_set_proxy = cwrap("emsocket_set_proxy", null, ["number"]);
    emsocket_set_vpn = cwrap("emsocket_set_vpn", null, ["number"]);
    mtScheduler.setCondition("wasmReady");
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

const PERSIST_MOUNT = '/persist';
const PERSIST_MT_DIR = PERSIST_MOUNT + '/.minetest';
const PERSIST_WORLDS_DIR = PERSIST_MT_DIR + '/worlds';

// Lists worlds stored in OPFS (the WasmFS backend mounted at /persist).
// OPFS root "/" corresponds to WASM path "/persist/", so world dirs are at
// OPFS ".minetest/worlds/<name>".
async function listPersistedWorlds() {
    try {
        if (!navigator.storage || !navigator.storage.getDirectory) return [];
        const root = await navigator.storage.getDirectory();
        const mtDir = await root.getDirectoryHandle('.minetest', { create: false }).catch(() => null);
        if (!mtDir) return [];
        const worldsDir = await mtDir.getDirectoryHandle('worlds', { create: false }).catch(() => null);
        if (!worldsDir) return [];
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
                }
            } catch (_e) {}
            worlds.push({ id: name, title, gameid, path: PERSIST_WORLDS_DIR + '/' + name });
        }
        worlds.sort((a, b) => a.title.localeCompare(b.title));
        return worlds;
    } catch (_e) {
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
    const header = document.getElementById('header');
    const footer = document.getElementById('footer');
    const headerHeight = header ? header.offsetHeight : 0;
    const footerHeight = footer ? footer.offsetHeight : 0;
    screenX = Math.max(1, viewport.width - 24);
    screenY = Math.max(1, viewport.height - headerHeight - footerHeight - 24);

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
        activateBody();
        fixGeometry();
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
