
async function load_json(path) {
    const resp = await fetch(path);
    return await resp.json();
}

const live2d_models = await load_json('./maps/live2d.map.json');
const bgs = await load_json('./maps/bg.map.json');
const loadingbgs = await load_json('./maps/loadingbg.map.json');
const shipmodels = await load_json('./maps/shipmodels.map.json');

export {
    live2d_models,
    bgs,
    loadingbgs,
    shipmodels,
};
