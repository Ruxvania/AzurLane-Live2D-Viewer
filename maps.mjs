import fs from 'fs';

map_directory("./bg", "./maps/bg.map.json");
map_directory("./live2d", "./maps/live2d.map.json");
map_directory("./loadingbg", "./maps/loadingbg.map.json");
map_directory("./shipmodels", "./maps/shipmodels.map.json");
map_directory("./spine", "./maps/spine.map.json");

function map_directory(listed_directory, json_path) {
    const map = [];
    for (const dirent of fs.readdirSync(listed_directory, { withFileTypes: true })) {
        const name = dirent.name;
        const path = `${listed_directory.replace(/^\./gm, "")}/${name}`; // remove dot at start
        const dir = dirent.isFile() ? "file" : "dir";
        map.push({ name, path, dir });
    }
    fs.writeFileSync(json_path, JSON.stringify(map), 'utf8');
}
