
function get_model_center() {
    let cx = window.model.x + window.model.width / 2;
    let cy = window.model.y + window.model.height / 2;
    return { x: cx, y: cy };
}

function resize_model() {
    if (!window.model) return;
    if (!window.app) return;

    window.model.scale.set(1);
    window.app.stage.scale.set(1);

    const scaleX = window.innerWidth / window.model.width;
    const scaleY = window.innerHeight / window.model.height;
    window.model.scale.set(Math.min(scaleX, scaleY));

    window.model.x = (window.innerWidth - window.model.width) / 2;
    window.model.y = (window.innerHeight - window.model.height) / 2;
}

export {
    get_model_center,
    resize_model,
};
