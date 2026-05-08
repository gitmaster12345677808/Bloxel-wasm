#pragma once

#include <functional>
#include <pthread.h>
#include <string>

using AsyncPayload = std::function<std::function<void()>()>;

struct MainLoop {
    MainLoop() = delete;
    static void NextFrame(std::function<void()> callback);
    static void DelayNextFrameUntilRedraw();
    static void RunAsyncThenResume(AsyncPayload payload);
};

#ifdef __EMSCRIPTEN__
// Consume a chat message queued by webxr_queue_chat_message() from JS.
// Returns true if a message was available; sets `out` to the UTF-8 text.
bool webxr_consume_pending_chat(std::string &out);

// Read the latest absolute headset orientation set by webxr_set_look().
// yaw_deg > 0 = turned right of calibration; pitch_deg > 0 = looking up.
// valid is false when no VR session is active (normal mouse mode).
void webxr_consume_look(float &yaw, float &pitch, bool &valid);

// Push the camera's view and projection matrices each frame so JS can
// render world-space overlays (e.g. the video screen billboard) with the
// exact same matrices the engine uses. Call once per frame before beginScene.
void webxr_push_camera_matrices(const float* view16, const float* proj16);

// Read the dominant (right) controller's position in head-local space (meters).
// valid is false when no controller data has been sent from JS yet.
void webxr_consume_right_hand(float &lx, float &ly, float &lz, bool &valid);

// Returns true when the local player body should be rendered in first-person VR
// (set by JS when an immersive XR session is active).
bool webxr_is_body_visible();
#endif
