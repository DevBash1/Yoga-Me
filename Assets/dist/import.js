(function() {
    let store = {}
    let config = null;
    let __filename = "";

    function ajaxSync(url) {
        let res = false;

        let xhr;

        if (window.XMLHttpRequest) {
            // code for modern browsers
            xhr = new XMLHttpRequest();
        } else {
            // code for old IE browsers
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xhr.onload = function() {
            if (xhr.status == 200) {
                res = xhr.responseText;
                set(url,res);
            }
        }

        xhr.onerror = function() {
            console.warn("Could Not Load Module from '" + url + "'");
            res = false
            return false;
        }

        xhr.open("GET", url, false);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        try {
            xhr.send();
        } catch (e) {
            console.warn("Could Not Load Module from '" + url + "'");
            return false;
        }

        return res;
    }

    function ajax(url) {
        let res = false;

        let xhr;

        if (window.XMLHttpRequest) {
            // code for modern browsers
            xhr = new XMLHttpRequest();
        } else {
            // code for old IE browsers
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xhr.onload = function() {
            if (xhr.status == 200) {
                res = xhr.responseText;
                set(url,res);
            }
        }

        xhr.onerror = function() {
            console.warn("Could Not Load Module from '" + url + "'");
            res = false
            return false;
        }

        xhr.open("GET", url, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        try {
            xhr.send();
        } catch (e) {
            console.warn("Could Not Load Module from '" + url + "'");
            return false;
        }

        return res;
    }

    function get(name) {
        return localStorage.getItem("require_" + name)
    }

    function set(name, code) {
        localStorage.setItem("require_" + name, code);
    }

    function has(name) {
        return Object.keys(localStorage).includes("require_" + name)
    }

    if (config == null) {
        let defaultConfig = {
            cache: true,
            where: "modules/"
        }
        let response = ajaxSync("app.json")
        if (response) {
            try {
                config = JSON.parse(response);
            } catch (e) {
                console.error("[app.json]: " + e);
                config = defaultConfig;
            }
        } else {
            config = defaultConfig;
        }
        // console.log(config);
    }

    if (config.cache) {
        if (config.modules) {
            Object.keys(config.modules).forEach(function(module) {
                ajax(resolve(module));
            })
        }
    }

    function run(code) {
        module = {}
        module.exports = false

        try {
            return eval(code);
        } catch (e) {
            makeError(e);
        }
        return module.exports;
    }

    function runF(code) {
        let result = (new Function("module.exports = false; eval(`" + code + "`); return module.exports;"));

        try {
            return result();
        } catch (e) {
            makeError(e)
        }
        return false;
    }

    function makeError(error) {
        if (!error.fileName) {
            return console.error(`[${__filename}]: ` + error.message);
        }
        throw new EvalError(error,__filename,error.lineNumber);
    }

    function resolve(name) {
        if (config.modules) {
            if (config.modules[name]) {
                return config.modules[name];
            }
        }
        if (name.includes(".js")) {
            if (name.includes("/")) {
                if (name.startsWith("/")) {
                    return name;
                } else {
                    return config.where + name;
                }
            } else {
                return config.where + name;
            }
        } else {
            if (name.includes("/")) {
                if (name.startsWith("/")) {
                    return name + ".js";
                } else {
                    return config.where + name + ".js";
                }
            } else {
                return config.where + name + ".js";
            }
        }
    }

    function getCode(name) {
        let url = resolve(name);
        let code = false;
        if (config.cache) {
            if (has(url)) {
                code = get(url);
            } else {
                code = ajaxSync(url);
            }
        } else {
            code = ajaxSync(url);
        }
        if (!code) {
            return code;
        }
        if (code.trim().startsWith("{") && code.trim().endsWith("}")) {
            try {
                return JSON.parse(code.trim());
            } catch (e) {
                throw new Error(e);
            }
        }
        if (code) {
            return run(code)
        } else {
            return code;
        }
    }

    function getFileName(name) {
        name = resolve(name);
        if (name.includes("/")) {
            return name.substring(name.lastIndexOf("/") + 1);
        } else {
            return name;
        }
    }

    function require(name) {
        __filename = getFileName(name);
        let response = getCode(name)
        return response
        // return module.exports;
    }

    window.require = require;
}
)()
