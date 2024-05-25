import Cookies from 'https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/+esm'
import { DEFAULT_CONFIG } from './defaults.mjs';

const cookies = {
    cache: {
        model: Cookies.get('model'),
        bg: Cookies.get('bg')
    },
    save: () => {
        Cookies.set('model', cookies.cache.model);
        Cookies.set('bg', cookies.cache.bg);
    },
};

if (cookies.model === undefined || cookies.model === undefined) {
    cookies.cache = {
        model: DEFAULT_CONFIG.model,
        bg: DEFAULT_CONFIG.background
    }
    cookies.save();
}

export {
    cookies
};
