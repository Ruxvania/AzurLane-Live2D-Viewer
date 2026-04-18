import { $, rand_val } from "./utils.mjs";
import { cookies } from './cookie_loader.mjs'
import { load_model } from "./model_loader.mjs";
import { live2d_models, bgs, shipmodels, loadingbgs, painting_data, spine_models } from "./assets_loader.mjs";
import { hit_area_frames } from "./pixi_canvas_initializer.mjs";

load_model({
    path: cookies.cache.model,
    type: "live2d"
}).then(() => {
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

    const paintings = [];
    for (const painting of live2d_models) {
        paintings.push({
            name: painting.name,
            path: painting.path,
            type: painting.type,
            animation_type: "live2d"
        });
    }
    for (const painting of spine_models) {
        paintings.push({
            name: painting.name,
            path: painting.path,
            type: painting.type,
            animation_type: "spine"
        });
    }

    for (let i = 0; i < paintings.length; i++) {
        let shipmodel_img = document.createElement('img');
        let shipmodel_img_container = document.createElement('div');
        shipmodel_img_container.appendChild(shipmodel_img);

        let model_painting = paintings[i].name;
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
        for (const pair of painting_data) {
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

        shipmodel_img.onclick = async (event) => {
            $('#loading > p').innerText = 'Loading...';
            $('#loading').style.visibility = 'visible';

            const i = event.target.dataset.i;
            let path;
            let altasPath;
            if (paintings[i].animation_type === "live2d") {
                path = `${paintings[i].path}/${paintings[i].name}.model3.json`;
            } else {
                path = `${paintings[i].path}/${paintings[i].name}.skel`;
                altasPath = `${paintings[i].path}/${paintings[i].name}.atlas`;
            }
            load_model({
                path: path,
                altasPath: altasPath,
                type: paintings[i].animation_type
            }).then(() => {
                cookies.cache.model = path;
                cookies.save();

                update_motion_list();
                $('#loading').style.visibility = 'hidden';
            }).catch((error) => {
                $('#loading > p').innerText = 'Loading Failed';
            });
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
    if (window.model_type !== "live2d") return;

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
