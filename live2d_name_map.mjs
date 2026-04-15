import fs from 'fs';
import skin_data from './data/ship_skin_template.json' with { type: 'json' };
import skin_data_statistics from './data/ship_data_statistics.json' with { type: 'json' };

const live2d_paintings = get_directories("./live2d");
const painting_name_map = [];

console.log(skin_data_statistics[705023])

for (const painting of live2d_paintings) {
    let name;
    let skin_id;
    let ship_group;
    let ship_name;
    for (const key of Object.keys(skin_data)) {
        if (skin_data[key].painting.toLowerCase() === painting.replace('_hx', '')) {
            name = skin_data[key].name;
            skin_id = key;
            ship_group = skin_data[key].ship_group;
        }
    }

    console.log({painting, name, skin_id, ship_group})

    for (const key of Object.keys(skin_data_statistics)) {
        if (key.startsWith(ship_group)) {
            ship_name = skin_data_statistics[key].name;
        }
    }

    if (!name) {
        console.warn(`Name not found for ${painting}`);
    }

    painting_name_map.push({
        painting: painting,
        name: name,
        skin_id: skin_id,
        ship_name: ship_name
    });
}

console.log(painting_name_map);
fs.writeFileSync('./maps/live2d_name.map.json', JSON.stringify(painting_name_map), 'utf8');

function get_directories(listed_directory) {
    return fs.readdirSync(listed_directory, { withFileTypes: true }) // Returns array of "Dirent" objects apparently
        .filter(dirent => dirent.isDirectory()) // Remove dirents from the array that aren't directorys
        .map(dirent => dirent.name) // Make an array of directory names
}