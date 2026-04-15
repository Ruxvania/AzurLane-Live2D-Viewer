import { $, rand_val } from "./utils.mjs";
import { cookies } from './cookie_loader.mjs'
import { load_model } from "./model_loader.mjs";
import { live2d_models, bgs, shipmodels, loadingbgs, live2d_model_names } from "./assets_loader.mjs";
import { hit_area_frames } from "./pixi_canvas_initializer.mjs";

load_model(cookies.cache.model).then(() => {
    update_motion_list();
});
$("#bg").style.backgroundImage = `url("${cookies.cache.bg}")`;

init_controls();

function init_controls() {
    init_model_selector();
    init_model_search();
    init_background_list();
    init_hitareas_checkbox();
}

function init_model_search() {
    $('#model-search').addEventListener('input', (event) => {
        const value = event.target.value;
        Array.from($('#model-select').children).forEach((child) => {
            const shipmodel_img = child.firstElementChild;
            console.log(shipmodel_img.dataset.tags);
            if (shipmodel_img.dataset.tags.split(",").some(tag => tag.toLowerCase().includes(value.toLowerCase()))) {
                child.classList.remove('model-search-filtered');
            } else {
                child.classList.add('model-search-filtered');
            }
        });
    })
}

function init_model_selector() {
    let model_selector = $('#model-select');

    for (let i = 0; i < live2d_models.length; i++) {
        let shipmodel_img = document.createElement('img');
        let shipmodel_img_container = document.createElement('div');
        shipmodel_img_container.appendChild(shipmodel_img);

        let model_painting = live2d_models[i].name;
        let shipmodel_name;
        if (model_painting.includes('hx')) {
            shipmodel_name = model_painting.replace('_hx', '');
            shipmodel_img.classList.add('shipmodel-img-hx');
        } else {
            shipmodel_name = model_painting;
        }
        for (const shipmodel_file of shipmodels) {
            if (shipmodel_file.name.toLowerCase().replace(".png", "") === shipmodel_name.toLowerCase()) {
                shipmodel_name = shipmodel_file.name.replace(".png", "");
            }
        }

        let model_name;
        let ship_name;
        for (const pair of live2d_model_names) {
            if (pair.painting === model_painting.replace('_hx', '')) {
                model_name = pair.name;
                ship_name = pair.ship_name;
            }
        }

        shipmodel_img_container.classList.add('shipmodel-img-container');
        shipmodel_img.classList.add('shipmodel-img');
        shipmodel_img.src = `./shipmodels/${shipmodel_name}.png`;
        shipmodel_img.title = model_name;
        shipmodel_img.dataset.i = i;

        shipmodel_img.dataset.painting = model_painting;
        shipmodel_img.dataset.name = model_name;
        shipmodel_img.dataset.ship_name = ship_name;
        shipmodel_img.dataset.tags = [model_painting, model_name, ship_name];

        shipmodel_img.onclick = async (e) => {
            $('#loading').style.visibility = 'visible';

            const i = e.target.dataset.i;
            const path = `${live2d_models[i].path}/${live2d_models[i].name}.model3.json`;
            await load_model(path);

            cookies.cache.model = path;
            cookies.save();

            update_motion_list();
            $('#loading').style.visibility = 'hidden';
        };

        model_selector.appendChild(shipmodel_img_container);
    }
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
        const readableMotion = motion.replaceAll('_', ' ') // Add spaces
            .replace(/\b\w/g, character => character.toUpperCase()) // Capitalize words
            .replace(/(?<![ 0-9])(?=[0-9])|(?<=[0-9])(?![ 0-9])/g, ' ') // Add spaces around numbers
            .trim();
        button.innerHTML = readableMotion;
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
