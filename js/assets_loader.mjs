
async function load_json(path) {
    const resp = await fetch(path);
    return await resp.json();
}

const live2d_models = await load_json('./maps/live2d.map.json');
const live2d_model_names = await load_json('./maps/live2d_name.map.json');
const spine_models = await load_json('./maps/spine.map.json');
const bgs = await load_json('./maps/bg.map.json');
const loadingbgs = await load_json('./maps/loadingbg.map.json');
const shipmodels = await load_json('./maps/shipmodels.map.json');

export {
    live2d_models,
    live2d_model_names,
    spine_models,
    bgs,
    loadingbgs,
    shipmodels,
};
