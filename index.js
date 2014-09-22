// API
// var localizer = Localizer(source);
// localizer.where('path.to.prop').then('newvalue');
// localizer.where('path.to.prop').if({key: value}).then({anotherkey: value, andalso: anothervalue});


var L = function (source) {
    this.source = source;
    this.target = [];
    this.leaf = null;
};

L.prototype.where = function (path) {
    var paths = path.split('.'),
        source = this.source,
        step, leaf = paths.length - 1;
    for (var i = 0; i <= leaf; i++) {
        step = source[paths[i]];
        this.leaf = paths[i];
        if (typeof step !== 'undefined') {
            if (i === leaf) {
                if (L.isObject(step) || L.isObjectsArray(step)) source = step;
                else continue;  // Keep parent as reference.
            } else if (step instanceof Object) {
                source = step; // Continue.
            } else {
                // We have hit somethings that is not an object,
                // and we are not at the leaf of the path, that's
                // and invalid path.
                source = null;
                break;
            }
        } else return this;
    }
    if (source) this.target = Array.isArray(source) ? source : [source];
    return this;
};

L.prototype.if = function (rules) {
    if (!(rules instanceof Object) || Array.isArray(rules)) {
        var tmp = rules;
        rules = {};
        rules[this.leaf] = tmp;
    }
    var target = [];
    main: for (var i = 0; i < this.target.length; i++) {
        for (var path in rules) {
            if (!L.hasValue(this.target[i], path, rules[path])) continue main;
        }
        target.push(this.target[i]);
    }
    this.target = target;
    return this;
};

L.prototype.then = function (rules) {
    if (!(rules instanceof Object) || Array.isArray(rules)) {
        var tmp = rules;
        rules = {};
        rules[this.leaf] = tmp;
    }
    for (var i = 0; i < this.target.length; i++) {
        for (var path in rules) {
            L.setValue(this.target[i], path, rules[path]);
        }
    }
    return this;
};

L.prototype.fromString = function (rules) {
    rules = typeof rules === "string" ? JSON.parse(rules) : rules;
    if (!Array.isArray(rules)) rules = [rules];
    for (var i = 0, rule; i < rules.length; i++) {
        rule = rules[i];
        if (rule.where) this.where(rule.where);
        else continue;
        if (rule.if) this.if(rule.if);
        if (rule.then) this.then(rule.then);
    }
    return this;
};

/*
* Turns {"Datasource": {"id": "xxx"}} into {"Datasource.id": "xxx"}
*/
L.flaten = function (obj) {
    var output = {};
    var flaten = function (els, prefix) {
        prefix = prefix && prefix + '.' || "";
        var key;
        for (var el in els) {
            key = prefix + el;
            value = els[el];
            if (value instanceof Object) {
                flaten(value, key);
            } else {
                output[key] = value;
            }
        }
    };
    flaten(obj);
    return output;
};

L.hasValue = function (obj, path, expected) {
    var flat = L.flaten(obj),
        current = flat[path];
    return expected instanceof Array && expected.indexOf(current) != -1 || current == expected;
};

L.setValue = function(obj, path, value) {
    var path_elements = path.split('.'),
        field = obj;
    for (var el in path_elements) {
        if (typeof field === "undefined") {
            break;
        }
        if (L.isObject(field[path_elements[el]])) {
            field = field[path_elements[el]];
        }
        else {
            field[path_elements[el]] = value;
        }
    }
};

L.isObject = function (what) {
    return what && what.constructor == Object;
};

L.isObjectsArray = function (what) {
    return Array.isArray(what) && what.every(L.isObject);
};

exports.Localizer = L;
