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

#vr_toggle_btn {
    min-height: 40px;
    border: 1px solid #5a3090;
    border-radius: 10px;
    background: #1a0d2b;
    color: #c89af4;
    padding: 0 12px;
    cursor: pointer;
    font-weight: 700;
}

#vr_toggle_btn.vr-active {
    background: #3b1a6e;
    border-color: #9b59f7;
    color: #f0eafa;
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
                <input id="voice_btn" type="button" value="🎤 Voice" onclick="openVoiceWindow()">
                <input id="vr_toggle_btn" type="button" value="VR Mode" onclick="window.vrManager && window.vrManager.toggleVR()">
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

let _voicePopup = null;
let _voicePlayerName = 'Player';

function openVoiceWindow() {
    const JITSI_HOST = 'voip.ngrok.pro';
    const JITSI_ROOM = 'FurrianEmpire';
    const dn = encodeURIComponent(_voicePlayerName);
    const url = 'https://' + JITSI_HOST + '/' + JITSI_ROOM
        + '#userInfo.displayName=' + dn
        + '&config.prejoinPageEnabled=false'
        + '&config.prejoinConfig.enabled=false'
        + '&config.startWithVideoMuted=true'
        + '&config.startWithAudioMuted=false'
        + '&config.disableDeepLinking=true';
    if (_voicePopup && !_voicePopup.closed) {
        _voicePopup.focus();
    } else {
        _voicePopup = window.open(url, 'bloxel_voice',
            'width=960,height=720,resizable=yes,scrollbars=no');
    }
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
var webxr_inject_mouse_delta;
var webxr_queue_chat_message;

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
    webxr_inject_mouse_delta = cwrap("webxr_inject_mouse_delta", null, ["number", "number"]);
    webxr_queue_chat_message  = cwrap("webxr_queue_chat_message",  null, ["string"]);
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

function handleExitMessage(text) {
    if (text.includes('main() exited with return value 0')) {
        window.location.href = window.location.pathname;
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
        // Capture player name for voice chat before DOM is wiped
        if (this.args.name) _voicePlayerName = this.args.name;
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
        // Auto-open voice chat popup when the game launches
        openVoiceWindow();
    }
}

// ===== WebXR VR Manager =====
// Provides full WebXR immersive-vr support for Meta Quest Browser.
//
// Features:
//   • Enters an immersive-vr WebXR session using the game's WebGL2 context
//   • Maps 6-DoF head rotation → synthetic mousemove events → in-game look
//   • Maps Quest controller input → keyboard/mouse events → movement/interaction
//   • Blits the game's rendered frame to the XR compositor framebuffer each tick
//   • Falls back to Gamepad API + DeviceOrientation on non-immersive browsers
//
// Controller layout (Quest 2/3, WebXR gamepad spec):
//   Left:  trigger(0)=Jump  grip(1)=Sneak  X(4)=Inventory  Y(5)=Menu
//          thumbstick axes[2,3] → WASD movement
//   Right: trigger(0)=Dig(LMB)  grip(1)=Place(RMB)  A(4)=Drop  B(5)=Chat
//          thumbstick axes[2,3] → hotbar scroll

class WebXRManager {
    constructor() {
        this._session       = null;
        this._xrLayer       = null;
        this._refSpace      = null;
        this._gl            = null;
        this._prevOrient    = null;
        this._gamepadStates = new Map();
        this._deviceOriHandler = null;
        this._gamepadPollId    = null;
        this._inVR              = false;
        this._immersiveSupported = false;
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

            this._session = await navigator.xr.requestSession('immersive-vr', {
                requiredFeatures: ['local-floor'],
                optionalFeatures: ['bounded-floor', 'hand-tracking'],
            });

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

            this._session.addEventListener('end', () => this._onSessionEnd());
            this._inVR = true;
            this._prevOrient = null;
            this._session.requestAnimationFrame(this._onXRFrame.bind(this));
            this._setButtonActive(true);
        } catch (err) {
            console.error('[WebXR] Failed to start immersive-vr session:', err);
            alert('Could not start VR session: ' + err.message +
                '\nEnsure you are using Meta Quest Browser 21+ and have WebXR enabled.');
        }
    }

    exitVR() {
        if (this._session) {
            this._session.end().catch(() => {});
        } else {
            // Escape fallback mode.
            this._inVR = false;
            this._stopGamepadPoll();
            this._removeDeviceOriListener();
            this._setButtonActive(false);
        }
    }

    _onSessionEnd() {
        this._session    = null;
        this._xrLayer    = null;
        this._refSpace   = null;
        this._inVR       = false;
        this._prevOrient = null;
        this._stopGamepadPoll();
        this._removeDeviceOriListener();
        this._setButtonActive(false);
        // Restore canvas geometry after exiting VR.
        if (typeof fixGeometry === 'function') fixGeometry(true);
    }

    _setButtonActive(active) {
        const btn = document.getElementById('vr_toggle_btn');
        if (!btn) return;
        btn.value = active ? 'Exit VR' : 'VR Mode';
        btn.classList.toggle('vr-active', active);
    }

    // ── XR animation frame ────────────────────────────────────────────────────

    _onXRFrame(time, frame) {
        if (!this._session) return;
        this._session.requestAnimationFrame(this._onXRFrame.bind(this));

        const gl   = this._getGL();
        const pose = frame.getViewerPose(this._refSpace);
        if (!pose) return;

        // 1. Head-rotation → camera look (always active, even in Y menu)
        this._processHeadPose(pose.transform.orientation);

        // 2. Quest controller input
        this._processXRInputSources(frame);

        // 3. Y Menu: render black space with floating game screen + menu panel
        if (this._ymenuOpen) {
            this._renderYMenuFrame(frame, pose, gl);
            return;
        }

        // 4. Normal mode: parallax-crop blit to each eye viewport.
        //
        // The engine renders a normal (mono) frame to the default framebuffer.
        // Each eye gets a slightly different horizontal crop derived from the
        // eye's lateral position in the XR reference space (view.transform.position.x).
        // On Quest this is typically ±0.032 m (64 mm IPD).
        //
        // Positive eyeX (right eye) → that eye sits to the right, so objects
        // appear shifted LEFT relative to center.  We skip `shiftPx` pixels on
        // the LEFT side of the source image to replicate this shift.
        // Similarly the left eye (negative eyeX) crops from the right side.
        //
        // Scale factor: Minetest default horizontal FoV ≈ 72°,
        //   tan(36°) ≈ 0.727 → pixelsPerMetre ≈ (W/2) / 0.727 ≈ W * 0.687.
        const xrFb = this._xrLayer.framebuffer;
        if (xrFb) {
            gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, xrFb);
            const W = mtCanvas.width;
            const H = mtCanvas.height;
            for (const view of pose.views) {
                const vp      = this._xrLayer.getViewport(view);
                const eyeX    = view.transform.position.x;
                const shiftPx = Math.round(eyeX * W * 0.687);
                const srcX0   = Math.max(0,  shiftPx);
                const srcX1   = Math.min(W, W + shiftPx);
                gl.blitFramebuffer(
                    srcX0, 0, srcX1, H,
                    vp.x, vp.y, vp.x + vp.width, vp.y + vp.height,
                    gl.COLOR_BUFFER_BIT, gl.LINEAR
                );
            }
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
    }

    // ── Head tracking ─────────────────────────────────────────────────────────

    _processHeadPose(quat) {
        const { x, y, z, w } = quat;
        // Quaternion → yaw (left/right, Y-axis) and pitch (up/down, X-axis).
        const yaw   = Math.atan2(2 * (w * y + x * z), 1 - 2 * (y * y + z * z));
        const sinp  = Math.max(-1, Math.min(1, 2 * (w * x - z * y)));
        const pitch = Math.asin(sinp);

        if (this._prevOrient !== null) {
            let dy = yaw - this._prevOrient.yaw;
            // Wrap-around correction at ±π.
            if (dy >  Math.PI) dy -= 2 * Math.PI;
            if (dy < -Math.PI) dy += 2 * Math.PI;
            const dp = pitch - this._prevOrient.pitch;
            const SENS = 600; // pixels per radian
            // Both axes are negated: WebXR pose deltas use OpenXR conventions
            // (right-hand coordinate system) which are opposite to Irrlicht/SDL's
            // expected movementX/movementY sign for look-right and look-up.
            this._dispatchMouseDelta(-dy * SENS, -dp * SENS);
        }
        this._prevOrient = { yaw, pitch };
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

    _processXRInputSources(frame) {
        for (const src of this._session.inputSources) {
            if (!src.gamepad) continue;
            this._handleControllerInput(src.gamepad, src.handedness);
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
                // Heuristic: Quest controllers identify themselves in the id string.
                const h = gp.id.toLowerCase().includes('left') ? 'left' : 'right';
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

    _handleControllerInput(gp, handedness) {
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
            }
            if (handedness === 'right') {
                this._btnToMouse(isDown(0), wasDown(0), 0);
                this._btnToMouse(isDown(1), wasDown(1), 2);
                this._btnToKey  (isDown(4), wasDown(4), 'q', 'KeyQ', 81);
                this._btnToKey  (isDown(5), wasDown(5), 't', 'KeyT', 84);
                const rsx = ax(2, 0);
                const prsx = prev.axes[2] != null ? prev.axes[2] : (prev.axes[0] || 0);
                this._stickToHotbar(rsx, prsx);
            }
        } else {
            // Y menu open: only Y button (left btn 5) can close it
            if (handedness === 'left' && isDown(5) && !wasDown(5)) this._toggleYMenu();
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

        // Restore GL state so Irrlicht's cache stays in sync.
        gl.bindTexture(gl.TEXTURE_2D, _sT0);
        gl.activeTexture(_sAT);
        gl.bindVertexArray(_sVAO);
        gl.bindBuffer(gl.ARRAY_BUFFER, _sVBO);
        gl.useProgram(_sPrg);
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, _sRFB);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, _sDFB);
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

    // ── Menu panel 2D canvas drawing ──────────────────────────────────────────

    _redrawMenuPanel() {
        if (!this._mCtx) return;
        if (this._chatMode) { this._redrawChatPanel(); return; }
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
            { label: '💬  Chat',   action: 'chat'      },  // full-width 3rd row
            { label: '🎤  Voice',  action: 'voice'     },  // full-width 4th row
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
        // World-space layout  (Y=up, -Z=forward, local-floor reference space)
        const GAME_Z = -2.2, GAME_CX = 0, GAME_CY = 1.45, GAME_HW = 1.2,  GAME_HH = 0.675;
        const MENU_Z = -1.8, MENU_CX = 0, MENU_CY = 0.55, MENU_HW = 0.9,  MENU_HH = 0.45;

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

                // Priority 1 — menu/chat panel
                const mhit = this._rayHit(origin, dir,
                    MENU_CX, MENU_CY, MENU_Z, MENU_HW, MENU_HH);
                if (mhit) {
                    const panelBtns = this._chatMode ? this._chatBtns : this._ymenuButtons;
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
                    // Priority 2 — game screen → virtual mouse cursor
                    const ghit = this._rayHit(origin, dir,
                        GAME_CX, GAME_CY, GAME_Z, GAME_HW, GAME_HH);
                    if (ghit) {
                        const t = (GAME_Z - origin[2]) / dir[2];
                        this._cursorWorldPos = {
                            x: origin[0] + t * dir[0],
                            y: origin[1] + t * dir[1],
                        };
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
                this._m4mul(pv, this._m4quad(GAME_CX, GAME_CY, GAME_Z, GAME_HW, GAME_HH)));

            // Menu panel
            this._drawQuad(gl, this._menuTex,
                this._m4mul(pv, this._m4quad(MENU_CX, MENU_CY, MENU_Z, MENU_HW, MENU_HH)));

            // Controller rays
            for (const h of ['left', 'right']) {
                const r = this._raysByHand[h];
                if (r) this._drawRay(gl, pv, r.origin, r.dir, 3.0);
            }

            // Cursor dot on game screen (alpha-blended, drawn last)
            if (this._cursorWorldPos) {
                const { x: dcx, y: dcy } = this._cursorWorldPos;
                gl.enable(gl.BLEND);
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                this._drawQuad(gl, this._cursorTex,
                    this._m4mul(pv, this._m4quad(dcx, dcy, GAME_Z + 0.005, 0.015, 0.015)));
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
        } else if (action === 'voice') {
            if (typeof openVoiceWindow === 'function') openVoiceWindow();
        } else if (action === 'chat_send') {
            this._vrChatSend();
        } else if (action === 'chat_cancel') {
            this._closeVRChat();
        }
    }

    // ── VR floating chat overlay ──────────────────────────────────────────────

    _openVRChat() {
        this._chatMode    = true;
        this._chatText    = '';
        this._chatHovered = -1;
        if (!this._chatInp) {
            const inp = document.createElement('input');
            inp.type = 'text';
            inp.setAttribute('enterkeyhint', 'send');
            inp.setAttribute('autocomplete', 'off');
            inp.setAttribute('autocorrect',  'off');
            inp.setAttribute('autocapitalize', 'off');
            inp.setAttribute('spellcheck', 'false');
            // Tiny off-screen element — Quest VK shows when this is focused.
            inp.style.cssText =
                'position:fixed;left:50%;bottom:2px;transform:translateX(-50%);' +
                'width:2px;height:2px;opacity:0.01;z-index:9999;' +
                'border:none;background:transparent;color:transparent;outline:none;';
            document.body.appendChild(inp);
            inp.addEventListener('input', () => {
                this._chatText = inp.value;
                this._redrawMenuPanel();
                // Push texture update immediately so typing feels live.
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
        const text = this._chatText;
        this._closeVRChat();
        this._ymenuOpen = false;
        if (!text || !webxr_queue_chat_message) return;
        // Deliver the message directly into the C++ game loop via
        // client->typeChatMessage(), which bypasses the key system and works
        // even when inventory or other formspecs are open.
        webxr_queue_chat_message(text);
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

/* STALE_OLD_YMENU_BEGIN — removed, replaced by clean implementation above
// STALE_REMOVED _initGLResources() {
        if (this._glInited) return;
        this._glInited = true;
        const gl = this._getGL();

        // ── Textured-quad shader ──────────────────────────────────────────────
        const qvSrc = `#version 300 es
in vec2 a_pos;
uniform mat4 u_mvp;
out vec2 v_uv;
void main() {
    v_uv = vec2(a_pos.x * 0.5 + 0.5, 0.5 - a_pos.y * 0.5);
    gl_Position = u_mvp * vec4(a_pos, 0.0, 1.0);
}`;
        const qfSrc = `#version 300 es
precision mediump float;
in vec2 v_uv;
uniform sampler2D u_tex;
out vec4 fragColor;
void main() { fragColor = texture(u_tex, v_uv); }`;

        // ── Ray shader ────────────────────────────────────────────────────────
        const lvSrc = `#version 300 es
in vec3 a_pos;
uniform mat4 u_vp;
void main() { gl_Position = u_vp * vec4(a_pos, 1.0); }`;
        const lfSrc = `#version 300 es
precision mediump float;
out vec4 fragColor;
void main() { fragColor = vec4(1.0, 0.35, 0.1, 0.9); }`;

        this._quadProg = this._compileProgram(gl, qvSrc, qfSrc);
        this._lineProg = this._compileProgram(gl, lvSrc, lfSrc);

        // Quad: unit square via triangle-strip, vertex positions in [-1,1]
        this._quadVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._quadVBO);
        gl.bufferData(gl.ARRAY_BUFFER,
            new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

        // Line VBO: 2 points, updated each frame per controller
        this._lineVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._lineVBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(6), gl.DYNAMIC_DRAW);

        // Game-screen texture (uploaded from canvas each frame)
        this._gameTex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this._gameTex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // Menu-panel texture (from 2D canvas)
        this._menuTex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this._menuTex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // 2D canvas for the menu panel UI
        this._menuCanvas = document.createElement('canvas');
        this._menuCanvas.width  = 1024;
        this._menuCanvas.height = 512;
        this._menuCtx = this._menuCanvas.getContext('2d');

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    _compileProgram(gl, vsrc, fsrc) {
        const mk = (type, src) => {
            const s = gl.createShader(type);
            gl.shaderSource(s, src);
            gl.compileShader(s);
            if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
                console.error('[YMenu] shader:', gl.getShaderInfoLog(s));
            return s;
        };
        const p = gl.createProgram();
        gl.attachShader(p, mk(gl.VERTEX_SHADER, vsrc));
        gl.attachShader(p, mk(gl.FRAGMENT_SHADER, fsrc));
        gl.linkProgram(p);
        return p;
    }

    // ── Menu canvas ───────────────────────────────────────────────────────────

    _redrawYMenuCanvas() {
        if (!this._menuCtx) return;
        const ctx = this._menuCtx;
        const CW = this._menuCanvas.width, CH = this._menuCanvas.height;
        ctx.clearRect(0, 0, CW, CH);

        // Background
        ctx.fillStyle = 'rgba(8, 14, 40, 0.95)';
        ctx.beginPath();
        ctx.roundRect(4, 4, CW - 8, CH - 8, 18);
        ctx.fill();
        ctx.strokeStyle = '#2a5fa8';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Title
        ctx.fillStyle = '#88ccff';
        ctx.font = 'bold 44px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('Y  Menu', CW / 2, 28);

        // Buttons (stored for hit-testing)
        const defs = [
            { label: '  Inventory',  action: 'inventory' },
            { label: '  Settings',   action: 'settings'  },
            { label: '  Drop Item',  action: 'drop'      },
            { label: '  Close Menu', action: 'close'     },
        ];
        this._ymenuButtons = [];
        const cols = 2, rows = 2;
        const bW = 440, bH = 90, gapX = 20, gapY = 16;
        const gridW = cols * bW + (cols - 1) * gapX;
        const startX = (CW - gridW) / 2;
        const startY = 100;

        for (let i = 0; i < defs.length; i++) {
            const col = i % cols, row = Math.floor(i / cols);
            const bx = startX + col * (bW + gapX);
            const by = startY + row * (bH + gapY);
            const hover = this._ymenuHovered === i;

            ctx.fillStyle = hover ? '#1e4d8a' : '#0e2448';
            ctx.strokeStyle = hover ? '#66b8ff' : '#2a5fa8';
            ctx.lineWidth = hover ? 3.5 : 2;
            ctx.beginPath();
            ctx.roundRect(bx, by, bW, bH, 12);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = hover ? '#ffffff' : '#c8e4ff';
            ctx.font = 'bold 30px system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(defs[i].label, bx + bW / 2, by + bH / 2);

            // Store normalised UV bounds for ray hit-testing
            this._ymenuButtons.push({
                action: defs[i].action,
                u0: bx / CW, v0: by / CH,
                u1: (bx + bW) / CW, v1: (by + bH) / CH,
            });
        }
    }

    // ── Matrix helpers (column-major, WebGL convention) ───────────────────────

    _mat4mul(a, b) {
        const o = new Float32Array(16);
        for (let c = 0; c < 4; c++)
            for (let r = 0; r < 4; r++) {
                let s = 0;
                for (let k = 0; k < 4; k++) s += a[k*4+r] * b[c*4+k];
                o[c*4+r] = s;
            }
        return o;
    }

    _mat4trs(tx, ty, tz, sx, sy) {
        // Translation + XY scale only (quads live in Z=0 plane)
        const m = new Float32Array(16);
        m[0]=sx; m[5]=sy; m[10]=1; m[15]=1;
        m[12]=tx; m[13]=ty; m[14]=tz;
        return m;
    }

    // ── Ray-quad intersection ─────────────────────────────────────────────────
    // Quad is axis-aligned, at world z=planeZ, centred at (cx, cy), half-size (hw, hh).
    // Returns {u, v, t} if hit, null otherwise.
    _rayHitQuad(origin, dir, cx, cy, planeZ, hw, hh) {
        if (Math.abs(dir[2]) < 1e-6) return null;
        const t = (planeZ - origin[2]) / dir[2];
        if (t < 0.05) return null;
        const hx = origin[0] + t * dir[0];
        const hy = origin[1] + t * dir[1];
        if (Math.abs(hx - cx) > hw || Math.abs(hy - cy) > hh) return null;
        return {
            t,
            u: (hx - (cx - hw)) / (2 * hw),
            v: 1 - (hy - (cy - hh)) / (2 * hh),
        };
    }

    // ── Upload canvas to GL texture ───────────────────────────────────────────
    _uploadTex(gl, tex, src) {
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    // ── Draw a textured quad ──────────────────────────────────────────────────
    _drawQuad(gl, tex, mvp) {
        gl.useProgram(this._quadProg);
        const aPos = gl.getAttribLocation(this._quadProg, 'a_pos');
        gl.bindBuffer(gl.ARRAY_BUFFER, this._quadVBO);
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
        gl.uniformMatrix4fv(gl.getUniformLocation(this._quadProg, 'u_mvp'), false, mvp);
        gl.uniform1i(gl.getUniformLocation(this._quadProg, 'u_tex'), 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.disableVertexAttribArray(aPos);
    }

    // ── Draw a controller ray line ────────────────────────────────────────────
    _drawRay(gl, vp, origin, dir, len) {
        const end = [
            origin[0] + dir[0] * len,
            origin[1] + dir[1] * len,
            origin[2] + dir[2] * len,
        ];
        gl.bindBuffer(gl.ARRAY_BUFFER, this._lineVBO);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0,
            new Float32Array([origin[0], origin[1], origin[2], end[0], end[1], end[2]]));
        gl.useProgram(this._lineProg);
        const aPos = gl.getAttribLocation(this._lineProg, 'a_pos');
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
        gl.uniformMatrix4fv(gl.getUniformLocation(this._lineProg, 'u_vp'), false, vp);
        gl.lineWidth(3);
        gl.drawArrays(gl.LINES, 0, 2);
        gl.disableVertexAttribArray(aPos);
    }

    // ── Y menu render + interaction for one XR frame ──────────────────────────
    _renderYMenuFrame(frame, pose, gl) {
        // Upload game canvas as texture
        this._uploadTex(gl, this._gameTex, mtCanvas);

        // World-space layout (local-floor, Y=up, -Z=forward)
        const GAME_Z  = -2.2;  // game screen Z position
        const GAME_CY = 1.45;  // game screen centre height (eye level)
        const GAME_HW = 1.2;   // game screen half-width  → 2.4 m wide
        const GAME_HH = 0.675; // game screen half-height → 1.35 m tall (16:9)
        const MENU_Z  = -1.85;
        const MENU_CY = 0.55;
        const MENU_HW = 0.9;
        const MENU_HH = 0.45;

        // ── Controller ray hit-testing (once per frame, not per eye) ──────────
        let newHover = -1;
        let triggerHit = null; // { action } if trigger pressed on a button

        for (const src of this._session.inputSources) {
            if (src.handedness !== 'left' && src.handedness !== 'right') continue;
            const rayPose = frame.getPose(src.targetRaySpace, this._refSpace);
            if (!rayPose) continue;

            const rp = rayPose.transform.position;
            const ro = rayPose.transform.orientation;
            const origin = [rp.x, rp.y, rp.z];

            // Rotate (0,0,-1) by the quaternion to get ray direction
            const qx=ro.x, qy=ro.y, qz=ro.z, qw=ro.w;
            const dir = [
                2*(qy*(-1)*qz - qw*(-1)*qy) + 0, // simplified quat*vec
                // Full quaternion rotation of (0,0,-1):
                // v' = q * (0,0,-1) * q_conj
                2*(qw*(-qx) + qy*(-qz) - 0      ),
                0,0 // placeholder – computed below properly
            ];
            // Proper quaternion rotation of (0,0,-1):
            const dx = 2*(qy*(-1)*qx + qw*(-1)*(-qy));  // too complex inline
            // Use the standard formula: q*(0,0,-1)*q^{-1}
            // = rotate_vec(q, {0,0,-1})
            const vx=0, vy=0, vz=-1;
            const tx=2*(qy*vz - qz*vy);
            const ty=2*(qz*vx - qx*vz);
            const tz=2*(qx*vy - qy*vx);
            const rdx = vx + qw*tx + qy*tz - qz*ty;
            const rdy = vy + qw*ty + qz*tx - qx*tz;
            const rdz = vz + qw*tz + qx*ty - qy*tx;
            const rayDir = [rdx, rdy, rdz];

            // Track per-source ray (used for drawing)
            if (!this._raysByHand) this._raysByHand = {};
            this._raysByHand[src.handedness] = { origin, dir: rayDir, rayPose };

            // Only the right controller ray interacts with menu buttons
            if (src.handedness === 'right') {
                const hit = this._rayHitQuad(
                    origin, rayDir, 0, MENU_CY, MENU_Z, MENU_HW, MENU_HH);
                if (hit) {
                    for (let bi = 0; bi < this._ymenuButtons.length; bi++) {
                        const btn = this._ymenuButtons[bi];
                        if (hit.u >= btn.u0 && hit.u <= btn.u1 &&
                            hit.v >= btn.v0 && hit.v <= btn.v1) {
                            newHover = bi;
                            // Trigger (button 0) clicked?
                            const gp = src.gamepad;
                            if (gp && gp.buttons[0] && gp.buttons[0].pressed) {
                                const key = 'right:' + (gp.index ?? 'x');
                                const prev = this._gamepadStates.get(key);
                                const wasTrig = prev?.buttons[0]?.pressed;
                                if (!wasTrig) triggerHit = btn;
                            }
                            break;
                        }
                    }
                }
            }
        }

        if (newHover !== this._ymenuHovered) {
            this._ymenuHovered = newHover;
            this._redrawYMenuCanvas();
        }
        this._uploadTex(gl, this._menuTex, this._menuCanvas);

        if (triggerHit) this._execYMenuAction(triggerHit.action);

        // ── Per-eye rendering ─────────────────────────────────────────────────
        const xrFb = this._xrLayer.framebuffer;
        gl.bindFramebuffer(gl.FRAMEBUFFER, xrFb);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        for (const view of pose.views) {
            const vp = this._xrLayer.getViewport(view);
            gl.viewport(vp.x, vp.y, vp.width, vp.height);
            gl.scissor (vp.x, vp.y, vp.width, vp.height);
            gl.enable(gl.SCISSOR_TEST);
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            // proj and view matrices from XR
            const proj = view.projectionMatrix;
            // view.transform.matrix = eye→world, need world→eye (inverse)
            const eyeM = view.transform.inverse.matrix; // world-to-camera
            const pv   = this._mat4mul(proj, eyeM);

            // Game screen
            const gameMVP = this._mat4mul(pv,
                this._mat4trs(0, GAME_CY, GAME_Z, GAME_HW, GAME_HH));
            this._drawQuad(gl, this._gameTex, gameMVP);

            // Menu panel
            const menuMVP = this._mat4mul(pv,
                this._mat4trs(0, MENU_CY, MENU_Z, MENU_HW, MENU_HH));
            this._drawQuad(gl, this._menuTex, menuMVP);

            // Controller rays
            if (this._raysByHand) {
                for (const h of ['left', 'right']) {
                    const r = this._raysByHand[h];
                    if (r) this._drawRay(gl, pv, r.origin, r.dir, 3.0);
                }
            }

            gl.disable(gl.SCISSOR_TEST);
        }

        gl.disable(gl.BLEND);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    // ── Execute a Y menu button action ────────────────────────────────────────
    _execYMenuAction(action) {
        switch (action) {
            case 'inventory':
                this._fireKey('keydown', 'e', 'KeyE', 69);
                this._fireKey('keyup',   'e', 'KeyE', 69);
                this._ymenuOpen = false;
                break;
            case 'settings':
                this._fireKey('keydown', 'Escape', 'Escape', 27);
                this._fireKey('keyup',   'Escape', 'Escape', 27);
                this._ymenuOpen = false;
                break;
            case 'drop':
                this._fireKey('keydown', 'q', 'KeyQ', 81);
                this._fireKey('keyup',   'q', 'KeyQ', 81);
                this._ymenuOpen = false;
                break;
            case 'close':
                this._ymenuOpen = false;
                break;
        }
    }
}
STALE_OLD_YMENU_END */

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
