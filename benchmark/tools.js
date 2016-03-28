var POTATOES = POTATOES || {};
(function () {
    POTATOES.Tools = {};

    // Public methods
    POTATOES.Tools.addClass = function (e, name) {
        var className = e.className;
        var names = className.split(" ");
        var len = names.length;
        var toAdd;

        if (name.indexOf(" ") >= 0) {
            var namesToAdd = name.split(" ");
            removeEmpties(namesToAdd);
            for (var i = 0; i < l; i++) {
                var found = namesToAdd.indexOf(names[i]);
                if (found >= 0) {
                    namesToAdd.splice(found, 1);
                }
            }
            if (namesToAdd.length > 0) {
                toAdd = namesToAdd.join(" ");
            }
        }
        else {
            var saw = false;
            for (var i = 0; i < len; i++) {
                if (names[i] === name) {
                    saw = true;
                    break;
                }
            }
            if (!saw) { toAdd = name; }

        }
        if (toAdd) {
            if (len > 0 && names[0].length > 0) {
                e.className = className + " " + toAdd;
            }
            else {
                e.className = toAdd;
            }
        }
        return e;
    };

    POTATOES.Tools.removeClass = function(e, name) {
        var original = e.className;
        var namesToRemove;

        if (name.indexOf(" ") >= 0) {
            namesToRemove = name.split(" ");
        } else {
            if (original.indexOf(name) < 0) {
                return e;
            }
            namesToRemove = [name];
        }
        var removed;
        var names = original.split(" ");
        var namesLen = names.length;

        for (var i = namesLen - 1; i >= 0; i--) {
            if (namesToRemove.indexOf(names[i]) >= 0) {
                names.splice(i, 1);
                removed = true;
            }
        }

        if (removed) {
            e.className = names.join(" ");
        }
        return e;
    };

    POTATOES.Tools.queueNewFrame = function (func) {
        if (window.requestAnimationFrame)
            window.requestAnimationFrame(func);
        else if (window.msRequestAnimationFrame)
            window.msRequestAnimationFrame(func);
        else if (window.webkitRequestAnimationFrame)
            window.webkitRequestAnimationFrame(func);
        else if (window.mozRequestAnimationFrame)
            window.mozRequestAnimationFrame(func);
        else if (window.oRequestAnimationFrame)
            window.oRequestAnimationFrame(func);
        else {
            window.setTimeout(func, 16);
        }
    };
})();