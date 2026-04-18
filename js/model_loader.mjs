import { hit_area_frames } from './pixi_canvas_initializer.mjs';

function on_hit(hitAreas) {
    model.motion(hitAreas[0], 0, PIXI.live2d.MotionPriority.NORMAL);
}

function on_pointerdown(e) {
    model.dragging = true;
    model._pointerX = e.data.global.x - model.x;
    model._pointerY = e.data.global.y - model.y;
}

function on_pointermove(e) {
    if (!model.dragging) return;

    model.position.x = e.data.global.x - model._pointerX;
    model.position.y = e.data.global.y - model._pointerY;
}

function on_pointerupoutside(e) {
    model.dragging = false;
}

function on_pointerup(e) {
    model.dragging = false;
}

function load_model(options) {
    return new Promise((res, rej) => {
        if (!window.app) return;
        if (window.model) window.app.stage.removeChild(window.model);

        if (options.type === "live2d" || options.type === undefined) {
            let model = PIXI.live2d.Live2DModel.fromSync(options.path);

            model.once('load', () => {
                window.app.stage.addChild(model);
                window.model = model;
                window.model_type = "live2d";
                window.onresize();

                model.on('hit', on_hit);
                model.on("pointerdown", on_pointerdown);
                model.on("pointermove", on_pointermove);
                model.on("pointerupoutside", on_pointerupoutside);
                model.on("pointerup", on_pointerup);

                window.model.addChild(hit_area_frames);

                model.internalModel.motionManager.groups.idle = 'idle';
                model.motion("login", 0, PIXI.live2d.MotionPriority.FORCE);

                res();
            });
        } else {
            if (PIXI.Loader.shared.resources.model) {
                PIXI.Loader.shared.reset();
            }
            try {
                PIXI.Loader.shared
                    .add('model', options.path, {
                        metadata: { spineAtlasFile: options.altasPath }
                    })
                    .load(on_load);
            } catch (error) {
                rej(error);
            }
            function on_load(loader, resources) {
                try {
                    const model = new PIXI.spine.Spine(resources.model.spineData);
                    window.app.stage.addChild(model);
                    window.model = model;
                    window.model_type = "spine";
                    window.onresize();

                    model.interactive = true;
                    model.on("pointerdown", on_pointerdown);
                    model.on("pointermove", on_pointermove);
                    model.on("pointerupoutside", on_pointerupoutside);
                    model.on("pointerup", on_pointerup);

                    model.state.setAnimation(0, 'normal', true);

                    res();
                } catch (error) {
                    rej(error);
                }
            }
        }
    });
}

export {
    load_model
};
