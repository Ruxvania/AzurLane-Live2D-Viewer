const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => p.querySelectorAll(s);
const rand_val = (arr) => arr[Math.floor(Math.random() * arr.length)];


export {
    $,
    $$,
    rand_val
};
