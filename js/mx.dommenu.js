/* global module */
/* global require */

(function() {
    var common = require("./common");

   var DomMenu = function(Mx, menu, options) {
        this.options = {
            itemClass: "sigplot-menu-item"
        };
        common.update(this.options, options);
        this._Mx = Mx;
        this._container = Mx.root;
        this._menu = document.createElement("div");
        var style = "z-index:2;float:left;position:relative;left:" + Mx.xpos + "px;top:" + Mx.ypos + "px;";
        this._menu.classList.add("sigplot-menu");
        var d = new Date();
        this._menuId = "menu-" + d.getSeconds() + d.getMilliseconds();
        this._menu.classList.add(this._menuId);
        this._menu.style = style;
        this._items = [];
        this.setCSS();
        this.createMenu(menu);
    };
    DomMenu.prototype = {
        createMenu: function(menu) {
            var self = this;
            var Mx = this._Mx;
            var originalFinalize = menu.finalize;
            menu.finalize = function() {
                self.remove();
                originalFinalize();
            };
            this.finalize = menu.finalize;
            var title = document.createElement("div");
            title.addEventListener("mousedown", function(e) {
                e.preventDefault();
                self._movingOffsetX = e.offsetX;
                self._movingOffsetY = e.offsetY;
                self._moving = true;
            });
            title.addEventListener("mouseup", function(e) {
                e.preventDefault();
                self._moving = false;
            });
            self._moveMenu = function(e) {
                if (self._moving) {
                    self._menu.style.position = 'fixed';
                    self._menu.style.top = e.clientY - self._movingOffsetY + 'px';
                    self._menu.style.left = e.clientX - self._movingOffsetX + 'px';
                }
            };
            document.body.addEventListener("mousemove", self._moveMenu);
            title.classList.add("sigplot-menu-title");
            title.innerText = menu.title;
            this._menu.append(title);
            var list = document.createElement("ul");
            list.classList.add("sigplot-menu-list");
            menu.items.forEach(function(item) {
                var li = self._createMenuItem(item, menu);
                list.append(li);
            });
            this._menu.append(list);
            this._container.append(this._menu);
            this._menu.addEventListener("contextmenu", function(e) {
                e.preventDefault();
                self.finalize();
            });
            Mx.menu = this;
            Mx.widget = {
                type: "MENU",
                callback: function(event) {
                    if (event.type === "mousedown") {
                        if (event.which === 1 || event.which === 2 || event.which === 3) {
                            if ((self._Mx.menu === self) && (!event.target.classList.contains(self.options.itemClass))) {
                                self.finalize();
                            }
                            if (!self._Mx.menu) {
                                self.finalize();
                            }
                        }
                    }
                    if (event.type === "mouseup") {
                        self._moving = false;
                    }
                    if (event.type === "keydown") {
                        self._handleKeyEvents(event);
                    }
                }
            };
        },
        _handleKeyEvents: function(event) {
            var self = this;
            if (event.key === "ArrowDown") {
                event.preventDefault();
                if (!self._active) {
                    self._setActive(self._items[0]);
                } else {
                    var target = self._items.indexOf(self._active) + 1;

                    if (target > self._items.length - 1) {
                        return; //Last item in the list keep it active
                    }
                    self._setActive(self._items[target]);
                }
            }
            if (event.key === "ArrowUp") {
                event.preventDefault();
                if (!self._active) {
                    self._setActive(self._items[0]);
                } else {
                    var target = self._items.indexOf(self._active) - 1;
                    if (target < 0) {
                        return; // First item in the list keep it active
                    }
                    self._setActive(self._items[target]);
                }
            }

            if (event.key === "Enter") {
                event.preventDefault();
                if (!self._active) {
                    self._setActive(self._items[0]);
                }

                var el = self._active;
                if (el.onclick) {
                    el.onclick();
                } else if (el.click) {
                    el.click();
                }
            }
        },
        _setActive: function(li) {
            if (this._active) {
                this._clearActive();
            }
            this._active = li;
            li.classList.add('active');
        },
        _clearActive: function() {
            this._active.classList.remove('active');
            this._active = null;
        },
        _createMenuItem: function(item, menu) {
            var self = this;
            var Mx = this._Mx;
            var li = document.createElement("li");
            li.className += " " + self.options.itemClass;
            li.innerText = item.text;
            if (item.style) {
                li.className += " " + item.style;
            }
            if (item.hasOwnProperty("checked")) {
                li.className += " sigplot-menu-checkbox";
                if (item.checked) {
                    li.className += " checked";
                }
            }
            li.addEventListener("click", function() {
                self.remove();
                Mx.menu = undefined;
                Mx.widget = null;
                if (item.handler) {
                    item.handler();
                } else if (item.menu) {
                    var newmenu = item.menu;
                    if (typeof item.menu === 'function') {
                        newmenu = item.menu();
                    }
                    newmenu.finalize = menu.finalize;
                    new DomMenu(Mx, newmenu);
                }

                if ((!Mx.menu) && (menu.finalize)) {
                    menu.finalize();
                }
            });
            li.addEventListener("mouseenter", function(e) {
                self._setActive(e.target);
            });
            li.addEventListener("mouseleave", function(e) {
                self._clearActive();
            });
            self._items.push(li);
            return li;
        },
        remove: function() {

            var Mx = this._Mx;
            Mx.menu = undefined;
            Mx.widget = null;
            this._menu.remove();
            document.body.removeEventListener("mousemove", this._moveMenu);
        },
        setCSS: function() {
            var Mx = this._Mx;
            var cssId = "mx-menu-css"; // id so we can always replace the css if we want to update this with mx.setTheme..
            var style = document.createElement('style');
            var textContent;
            style.id = cssId;
            //This really sucks...... and I hate it. -Sean
            /* jshint ignore:start */
            textContent = "" +
                "." + this._menuId + "{\n" +
                "background-color: " + Mx.xwbg + ";\n" +
                "font: " + Mx.font.font + ";\n" +
                "color:" + Mx.xwfg + "\n" +
                "}   \n" +
                ".sigplot-menu-list {\n" +
                "    margin: 0px;\n" +
                "    list-style: none;\n" +
                "    padding: 0px;\n" +
                "}\n" +
                "." + this._menuId + ">div {\n" +
                "    cursor: move;\n" +
                "    text-align: center;\n" +
                "    border-bottom: 2px solid " + Mx.xwts + ";\n" +
                "}\n" +
                "." + this._menuId + ">ul>li{\n" +
                "    border-top: 2px solid " + Mx.bg + ";\n" +
                "    background-color: " + Mx.xwlo + ";\n" +
                "    padding: 1px;\n" +
                "    padding-right: 5px;\n" +
                "    padding-left: 5px;\n" +
                "    cursor:default;\n" +
                "}\n" +
                "." + this._menuId + ">ul>li.active{\n" +
                "    background-color: " + Mx.hi + ";\n" +
                "}\n" +
                "." + this._menuId + " {\n" +
                "    position: relative;\n" +
                "    color: white;\n" +
                "    float: left;\n" +
                "    border-radius: 5px;\n" +
                "    padding: 3px;\n" +
                "    font: " + Mx.font.font + ";\n" +
                "    color:" + Mx.xwfg + "\n" +
                "}\n" +
                "." + this._menuId + ">ul>li.separator {\n" +
                "    background-color: " + Mx.xwbs + ";\n" +
                "}\n" +
                ".sigplot-menu-checkbox:before{\n" +
                "    margin-right: 3px; \n" +
                "}\n" +
                ".sigplot-menu-checkbox.checked:before {\n" +
                "    content: '\\25b8';\n" +
                "    width: 2px;\n" +
                "    height: 3px;\n" +
                "}\n" +
                ".sigplot-menu-checkbox.checkbox:before {\n" +
                "    content: '\\25A1';\n" +
                "    width: 2px;\n" +
                "    height: 3px;\n" +
                "}\n" +
                ".sigplot-menu-checkbox.checkbox.checked:before {\n" +
                "    content: '\\25A3';\n" +
                "    width: 2px;\n" +
                "    height: 3px;\n" +
                "}\n";

            /* jshint ignore:end */
            if (!this._container.getElementsByTagName("style").length) {
                var style = document.createElement('style');
                style.textContent = textContent;
                this._container.appendChild(style);
            } else {
                var style = this._container.getElementsByTagName("style")[0];
                style.textContent = textContent;
            }
        }
    };

        module.exports = DomMenu;

}());

