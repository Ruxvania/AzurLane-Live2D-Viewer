import { get_model_center, resize_model } from "./model_utils.mjs";
import { $ } from "./utils.mjs";

window.app = new PIXI.Application({
    view: $("#canvas"),
    autoStart: true,
    resizeTo: window,
    backgroundAlpha: 0
});

window.app.view.addEventListener('mouseup', (e) => {
    if (!window.model) return;
    if (e.button !== 0) return;

    // TODO: Change how main animation is called
    if (window.model_type === "live2d") {
    window.model.motion(`main_${Math.floor(Math.random() * 3) + 1}`, 0, PIXI.live2d.MotionPriority.NORMAL);
    }
});

window.app.view.onwheel = (e) => {
    let scale = -(Math.sign(e.deltaY) * 0.01);

    let center1 = get_model_center();

    window.model.scale.x += scale;
    window.model.scale.y += scale;

    let center2 = get_model_center();

    window.model.x += center1.x - center2.x;
    window.model.y += center1.y - center2.y;
};

window.onresize = () => {
    resize_model();
};

window.onmousedown = (e) => {
    if (e.button == 1) { // middle button pressed
        resize_model();
    }
};

function on_frame_update() {
    if (!window.model) return requestAnimationFrame(on_frame_update);
    if (!window.model.internalModel) return requestAnimationFrame(on_frame_update);
    if (!window.model.internalModel.motionManager.playing) window.model.motion('idle', 0, PIXI.live2d.MotionPriority.IDLE);

    requestAnimationFrame(on_frame_update);
}
on_frame_update();

const hit_area_frames = new PIXI.live2d.HitAreaFrames();
hit_area_frames.visible = false;

export {
    hit_area_frames
};
