//ElectJS

function _(selector) {
    let elems = null;
    
    if(typeof selector == "string"){
        elems = document.querySelectorAll(selector);
    }else if(typeof selector == "object"){
        try{
            if(selector.length == undefined){
                elems = [selector]
            }else{
                elems = selector;
            }
        }catch(e){
            return null;
        }
    }

    let _ = {};

    _.html = function(text) {
        if (text != undefined) {
            elems.forEach(function(elem) {
                elem.innerHTML = text;
            })
        } else {
            return elems[0].innerHTML;
        }
    }
    _.text = function(text) {
        if (text != undefined) {
            elems.forEach(function(elem) {
                elem.innerText = text;
            })
        } else {
            return elems[0].innerText;
        }
    }

    _.val = function(text) {
        if (text != undefined) {
            elems.forEach(function(elem) {
                elem.value = text;
            })
        } else {
            return elems[0].value;
        }
    }
    _.attr = function(attribute) {
        if (attribute != undefined) {
            return {
                "set": function(value) {
                    if (value != undefined) {
                        elems.forEach(function(elem) {
                            elem.setAttribute(attribute, value);
                        });
                    } else {
                        return elems[0].getAttribute(attribute);
                    }
                },
                "get": function() {
                    return elems[0].getAttribute(attribute);
                }
            }
        }
    }
    _.show = function() {
        elems.forEach(function(elem) {
            elem.style.display = "block";
        })
    }
    _.flex = function() {
        elems.forEach(function(elem) {
            elem.style.display = "flex";
        })
    }
    _.hide = function() {
        elems.forEach(function(elem) {
            elem.style.display = "none";
        })
    }
    _.first = function(){
        elems = [elems[0]];
        return _;
    }
    _.second = function(){
        elems = [elems[1]];
        return _;
    }
    _.third = function(){
        elems = [elems[2]];
        return _;
    }
    _.last = function(){
        elems = [elems[elems.length-1]];
        return _;
    }
    _.at = function(index){
        if(typeof index == "number" && index <= elems.length && index >= 1){
            elems = [elems[index-1]];
            return _;
        }
    }
    _.children = function(){
        elems = elems[0].children;
        return _;
    }
    _.parent = function(){
        elems = [elems[0].parentElement];
        return _;
    }
    _.this = function(){
        return elems[0];
    }
    _.on = function(event,callback){
        if(typeof callback == "function"){
            elems.forEach(function(elem) {
                elem.addEventListener(event,function(){
                    callback(elem);
                });
            })
        }
    }
    _.click = function(callback){
        if(typeof callback == "function"){
            elems.forEach(function(elem) {
                elem.addEventListener("click",function(){
                    callback(elem);
                });
            })
        }
    }
    _.hover = function(callback){
        if(typeof callback == "function"){
            elems.forEach(function(elem) {
                elem.addEventListener("mouseover",function(){
                    callback(elem);
                });
            })
        }
    }
    _.after = function(...nodes){
        elems[0].after(nodes);
    }
    _.before = function(...nodes){
        elems[0].before(nodes);
    }


    if(elems.length != 0){
        return _;
    }else{
        return null;
    }
}

try {
    module.exports = _
} catch (error) {
    
}