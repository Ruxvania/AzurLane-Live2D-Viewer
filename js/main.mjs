import { $, rand_val } from "./utils.mjs";
import { cookies } from './cookie_loader.mjs'
import { load_model } from "./model_loader.mjs";
import { live2d_models, bgs, shipmodels, loadingbgs } from "./assets_loader.mjs";
import { hit_area_frames } from "./pixi_canvas_initializer.mjs";

load_model(cookies.cache.model).then(() => {
    update_motion_list();
});
$("#bg").style.backgroundImage = `url("${cookies.cache.bg}")`;

init_controls();

function init_controls() {
    init_model_selector();
    init_background_list();
    init_hitareas_checkbox();
}

function init_model_selector() {
    let model_selector = $('#model-select');

    for (let i = 0; i < live2d_models.length; i++) {
        let option = new Option(live2d_models[i].name, i, false, false);

        if (cookies.cache.model.includes(live2d_models[i].name)) {
            option.selected = true;
        }

        model_selector.options.add(option);
    }

    model_selector.onchange = async (e) => {
        let index = e.target.value;
        let path = `${live2d_models[index].path}/${live2d_models[index].name}.model3.json`;

        $('#loading').style.visibility = 'visible';
        $('#loading').style.backgroundImage = `url("${rand_val(loadingbgs).path}")`;

        await load_model(path);

        cookies.cache.model = path;
        cookies.save();

        update_motion_list();
        $('#loading').style.visibility = 'hidden';
    };
}

function init_hitareas_checkbox() {
    let checkbox = $("#show-hitareas");
    checkbox.onchange = (e) => {
        hit_area_frames.visible = e.target.checked;
    };
}

function update_motion_list() {
    if (!window.model) return;

    let motion_list = $("#motion-list");
    motion_list.innerHTML = "";

    let motions = Object.keys(window.model.internalModel.motionManager.definitions);
    motions = motions.sort((a, b) => a.localeCompare(b));

    for (let motion of motions) {
        let button = document.createElement('button');
        button.innerHTML = motion;
        button.classList.add('control');
        button.onclick = () => {
            if (!window.model) return;
            window.model.motion(motion, 0, PIXI.live2d.MotionPriority.NORMAL);
        };

        motion_list.appendChild(button);
    }
}

async function init_background_list() {
    let background_list = $('#background-list');

    $('#bg-select-button').onclick = () => { // toggle display of background list
        let vis = background_list.style.visibility;
        vis = (vis == 'hidden' ? 'visible' : 'hidden');
        background_list.style.visibility = vis;
    };

    for (let i = 0; i < bgs.length; i++) {
        let img = document.createElement('img');
        img.src = bgs[i].path;
        img.title = bgs[i].name;
        img.dataset.i = i;
        img.classList.add('background-item');
        img.onclick = (e) => {
            let path = bgs[e.target.dataset.i].path;
            $("#bg").style.backgroundImage = `url("${path}")`;

            cookies.cache.bg = path;
            cookies.save();
        };

        background_list.appendChild(img);

        preload_img(bgs[i].path);
    }
}

function preload_img(url) {
    let img = new Image();
    img.src = url;
}
