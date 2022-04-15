// handles LocalStorage Data Manipulating

function set(key, value) {
    localStorage.setItem(key, value);
}

function remove(key) {
    localStorage.removeItem(key);
}

function get(key) {
    return localStorage.getItem(key);
}

function has(key) {
    if(localStorage.getItem(key) != null){
        return true;
    }else{
        return false;
    }
}

function clear() {
    localStorage.clear();
}

module.exports = {
    set,
    get,
    has,
    remove,
    clear
}
