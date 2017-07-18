L.FormBuilder.Element.include({

    getParentNode: function () {
        if (this.options.wrapper) {
            return L.DomUtil.create(this.options.wrapper, this.options.wrapperClass || '', this.form);
        }
        var className = 'formbox';
        if (this.options.inheritable) {
            className += this.get(true) === undefined ? ' inheritable undefined' : ' inheritable ';
        }
        this.wrapper = L.DomUtil.create('div', className, this.form);
        this.header = L.DomUtil.create('div', 'header', this.wrapper);
        if (this.options.inheritable) {
            var undefine = L.DomUtil.add('a', 'button undefine', this.header, L._('clear'));
            var define = L.DomUtil.add('a', 'button define', this.header, L._('define'));
            L.DomEvent.on(define, 'click', function (e) {
                L.DomEvent.stop(e);
                this.fetch();
                this.fire('define');
                L.DomUtil.removeClass(this.wrapper, 'undefined');
            }, this);
            L.DomEvent.on(undefine, 'click', function (e) {
                L.DomEvent.stop(e);
                L.DomUtil.addClass(this.wrapper, 'undefined');
                this.clear();
                this.sync();
            }, this);
        }
        this.quickContainer = L.DomUtil.create('span', 'quick-actions show-on-defined', this.header);
        this.extendedContainer = L.DomUtil.create('div', 'show-on-defined', this.wrapper);
        return this.extendedContainer;
    },

    getLabelParent: function () {
        return this.header;
    },

    clear: function () {
        this.input.value = '';
        return this
    },

    get: function (own) {
        if (!this.options.inheritable || own) return this.builder.getter(this.field);
        var path = this.field.split('.'),
            key = path[path.length - 1];
        return this.obj.getOption(key);
    },

    buildLabel: function () {
        if (this.options.label) {
            this.label = L.DomUtil.create('label', '', this.getLabelParent());
            this.label.innerHTML = this.options.label;
            if (this.options.helpEntries) this.builder.map.help.button(this.label, this.options.helpEntries);
            else if (this.options.helpText) {
                var info = L.DomUtil.create('i', 'info', this.label);
                L.DomEvent.on(info, 'mouseover', function () {
                    this.builder.map.ui.tooltip({anchor: info, content: this.options.helpText, position: 'top'});
                }, this);
            }
        }
    },

    show: function(){
        if(this.wrapper) {
            this.wrapper.style.display = "block"
        }
        return this
    },

    hide: function(){
        if(this.wrapper){
            this.wrapper.style.display = "none"
        }
        return this
    }

});

L.FormBuilder.Select.include({

    clear: function () {
        this.select.value = '';
    }

});

L.FormBuilder.CheckBox.include({

    value: function () {
        return L.DomUtil.hasClass(this.wrapper, 'undefined') ? undefined : this.input.checked;
    },

    clear: function () {
        this.fetch();
    }

});

L.FormBuilder.ColorPicker = L.FormBuilder.Input.extend({

    colors: [
        'Black', 'Navy', 'DarkBlue', 'MediumBlue', 'Blue', 'DarkGreen',
        'Green', 'Teal', 'DarkCyan', 'DeepSkyBlue', 'DarkTurquoise',
        'MediumSpringGreen', 'Lime', 'SpringGreen', 'Aqua', 'Cyan',
        'MidnightBlue', 'DodgerBlue', 'LightSeaGreen', 'ForestGreen',
        'SeaGreen', 'DarkSlateGray', 'DarkSlateGrey', 'LimeGreen',
        'MediumSeaGreen', 'Turquoise', 'RoyalBlue', 'SteelBlue',
        'DarkSlateBlue', 'MediumTurquoise', 'Indigo', 'DarkOliveGreen',
        'CadetBlue', 'CornflowerBlue', 'MediumAquaMarine', 'DimGray',
        'DimGrey', 'SlateBlue', 'OliveDrab', 'SlateGray', 'SlateGrey',
        'LightSlateGray', 'LightSlateGrey', 'MediumSlateBlue', 'LawnGreen',
        'Chartreuse', 'Aquamarine', 'Maroon', 'Purple', 'Olive', 'Gray',
        'Grey', 'SkyBlue', 'LightSkyBlue', 'BlueViolet', 'DarkRed',
        'DarkMagenta', 'SaddleBrown', 'DarkSeaGreen', 'LightGreen',
        'MediumPurple', 'DarkViolet', 'PaleGreen', 'DarkOrchid',
        'YellowGreen', 'Sienna', 'Brown', 'DarkGray', 'DarkGrey',
        'LightBlue', 'GreenYellow', 'PaleTurquoise', 'LightSteelBlue',
        'PowderBlue', 'FireBrick', 'DarkGoldenRod', 'MediumOrchid',
        'RosyBrown', 'DarkKhaki', 'Silver', 'MediumVioletRed', 'IndianRed',
        'Peru', 'Chocolate', 'Tan', 'LightGray', 'LightGrey', 'Thistle',
        'Orchid', 'GoldenRod', 'PaleVioletRed', 'Crimson', 'Gainsboro',
        'Plum', 'BurlyWood', 'LightCyan', 'Lavender', 'DarkSalmon',
        'Violet', 'PaleGoldenRod', 'LightCoral', 'Khaki', 'AliceBlue',
        'HoneyDew', 'Azure', 'SandyBrown', 'Wheat', 'Beige', 'WhiteSmoke',
        'MintCream', 'GhostWhite', 'Salmon', 'AntiqueWhite', 'Linen',
        'LightGoldenRodYellow', 'OldLace', 'Red', 'Fuchsia', 'Magenta',
        'DeepPink', 'OrangeRed', 'Tomato', 'HotPink', 'Coral', 'DarkOrange',
        'LightSalmon', 'Orange', 'LightPink', 'Pink', 'Gold', 'PeachPuff',
        'NavajoWhite', 'Moccasin', 'Bisque', 'MistyRose', 'BlanchedAlmond',
        'PapayaWhip', 'LavenderBlush', 'SeaShell', 'Cornsilk',
        'LemonChiffon', 'FloralWhite', 'Snow', 'Yellow', 'LightYellow',
        'Ivory', 'White'
    ],

    getParentNode: function () {
        L.FormBuilder.CheckBox.prototype.getParentNode.call(this);
        return this.quickContainer;
    },

    build: function () {
        L.FormBuilder.Input.prototype.build.call(this);
        this.input.placeholder = this.options.placeholder || L._('Inherit');
        this.container = L.DomUtil.create('div', 'storage-color-picker', this.extendedContainer);
        this.container.style.display = 'none';
        for (var idx in this.colors) {
            this.addColor(this.colors[idx]);
        }
        this.spreadColor();
        this.input.autocomplete = 'off';
        L.DomEvent.on(this.input, 'focus', this.onFocus, this);
        L.DomEvent.on(this.input, 'blur', this.onBlur, this);
        L.DomEvent.on(this.input, 'change', this.sync, this);
        this.on('define', this.onFocus);
    },

    onFocus: function () {
        this.container.style.display = 'block';
        this.spreadColor();
    },

    onBlur: function () {
        var self = this,
            closePicker = function () {
                self.container.style.display = 'none';
            };
        // We must leave time for the click to be listened.
        window.setTimeout(closePicker, 100);
    },

    sync: function () {
        this.spreadColor();
        L.FormBuilder.Input.prototype.sync.call(this);
    },

    spreadColor: function () {
        if (this.input.value) this.input.style.backgroundColor = this.input.value;
        else this.input.style.backgroundColor = 'inherit';
    },

    addColor: function (colorName) {
        var span = L.DomUtil.create('span', '', this.container);
        span.style.backgroundColor = span.title = colorName;
        var updateColorInput = function () {
            this.input.value = colorName;
            this.sync();
            this.container.style.display = 'none';
        };
        L.DomEvent.on(span, 'mousedown', updateColorInput, this);
    }

});

L.FormBuilder.TextColorPicker = L.FormBuilder.ColorPicker.extend({
    colors: [
        'Black', 'DarkSlateGrey', 'DimGrey', 'SlateGrey', 'LightSlateGrey',
        'Grey', 'DarkGrey', 'LightGrey', 'White'
    ]

});

L.FormBuilder.IconClassSwitcher = L.FormBuilder.Select.extend({

    selectOptions: [
        ['Default', L._('Default')],
        ['Circle', L._('Circle')],
        ['Drop', L._('Drop')],
        ['Ball', L._('Ball')],
        ['Rect', L._('Rect')]
    ]
});

L.FormBuilder.PopupTemplate = L.FormBuilder.Select.extend({

    selectOptions: [
        ['Default', L._('Name and description')],
        ['Large', L._('Name and description (large)')],
        ['Table', L._('Table')],
        ['GeoRSSImage', L._('GeoRSS (title + image)')],
        ['GeoRSSLink', L._('GeoRSS (only link)')],
        ['SimplePanel', L._('Side panel')]
    ],

    toJS: function () {
        var value = L.FormBuilder.Select.prototype.toJS.apply(this);
        if (value === 'table') { value = 'Table'; }
        return value;
    }

});

L.FormBuilder.LayerTypeChooser = L.FormBuilder.Select.extend({

    selectOptions: [
        ['Default', L._('Default')],
        ['Cluster', L._('Clustered')],
        ['Heat', L._('Heatmap')]
    ]

});

L.FormBuilder.DataLayerSwitcher = L.FormBuilder.Select.extend({

    getOptions: function () {
        var options = [];
        this.builder.map.eachDataLayer(function (datalayer) {
            if(datalayer.isLoaded() && !datalayer.isRemoteLayer() && datalayer.isBrowsable()) {
                options.push([L.stamp(datalayer), datalayer.getName()]);
            }
        });
        return options;
    },

    toHTML: function () {
        return L.stamp(this.obj.datalayer);
    },

    toJS: function () {
        return this.builder.map.datalayers[this.value()];
    },

    set: function () {
        this.builder.map.lastUsedDataLayer = this.toJS();
        this.obj.changeDataLayer(this.toJS());
    }

});

L.FormBuilder.onLoadPanel = L.FormBuilder.Select.extend({

    selectOptions: [
        ['none', L._('None')],
        ['caption', L._('Caption')],
        ['databrowser', L._('Data browser')]
    ]

});

L.FormBuilder.DataFormat = L.FormBuilder.Select.extend({

    selectOptions: [
        [undefined, L._('Choose the data format')],
        ['geojson', 'geojson'],
        ['osm', 'osm'],
        ['csv', 'csv'],
        ['gpx', 'gpx'],
        ['kml', 'kml'],
        ['georss', 'georss']
    ]

});

L.FormBuilder.LabelDirection = L.FormBuilder.Select.extend({

    selectOptions: [
        ['auto', L._('Automatic')],
        ['left', L._('On the left')],
        ['right', L._('On the right')],
        ['top', L._('On the top')],
        ['bottom', L._('On the bottom')]
    ]

});

L.FormBuilder.LicenceChooser = L.FormBuilder.Select.extend({

    getOptions: function () {
        var licences = [],
            licencesList = this.builder.obj.options.licences,
            licence;
        for (var i in licencesList) {
            licence = licencesList[i];
            licences.push([i, licence.name]);
        }
        return licences;
    },

    toHTML: function () {
        return this.get().name;
    },

    toJS: function () {
        return this.builder.obj.options.licences[this.value()];
    }

});

L.FormBuilder.NullableBoolean = L.FormBuilder.Select.extend({
    selectOptions: [
        [undefined, L._('inherit')],
        [true, L._('yes')],
        [false, L._('no')]
    ],

    toJS: function () {
        var value = this.value();
        switch (value) {
            case 'true':
            case true:
                value = true;
                break;
            case 'false':
            case false:
                value = false;
                break;
            default:
                value = undefined;
        }
        return value;
    }

});

L.FormBuilder.IconUrl = L.FormBuilder.Input.extend({

    type: function () {
        return 'hidden';
    },

    build: function () {
        L.FormBuilder.Input.prototype.build.call(this);
        this.parentContainer = L.DomUtil.create('div', 'storage-form-iconfield', this.parentNode);
        this.buttonsContainer = L.DomUtil.create('div', '', this.parentContainer);
        this.pictogramsContainer = L.DomUtil.create('div', 'storage-pictogram-list', this.parentContainer);
        this.input.type = 'hidden';
        this.input.placeholder = L._('Url');
        this.udpatePreview();
        this.on('define', this.fetchIconList);
    },

    udpatePreview: function () {
        if (this.value() && this.value().indexOf('{') === -1) { // Do not try to render URL with variables
            var img = L.DomUtil.create('img', '', L.DomUtil.create('div', 'storage-icon-choice', this.buttonsContainer));
            img.src = this.value();
            L.DomEvent.on(img, 'click', this.fetchIconList, this);
        }
        this.button = L.DomUtil.create('a', '', this.buttonsContainer);
        this.button.innerHTML = this.value() ? L._('Change symbol') : L._('Add symbol');
        this.button.href = '#';
        L.DomEvent
            .on(this.button, 'click', L.DomEvent.stop)
            .on(this.button, 'click', this.fetchIconList, this);
    },

    addIconPreview: function (pictogram) {
        var baseClass = 'storage-icon-choice',
            value = pictogram.src,
            className = value === this.value() ? baseClass + ' selected' : baseClass,
            container = L.DomUtil.create('div', className, this.pictogramsContainer),
            img = L.DomUtil.create('img', '', container);
        img.src = value;
        if (pictogram.name && pictogram.attribution) {
            img.title = pictogram.name + ' — © ' + pictogram.attribution;
        }
        L.DomEvent.on(container, 'click', function (e) {
            this.input.value = value;
            this.sync();
            this.unselectAll(this.pictogramsContainer);
            L.DomUtil.addClass(container, 'selected');
            this.pictogramsContainer.innerHTML = '';
            this.udpatePreview();
        }, this);
    },

    clear: function () {
        this.input.value = '';
        this.unselectAll(this.pictogramsContainer);
        this.sync();
        this.pictogramsContainer.innerHTML = '';
        this.udpatePreview();
    },

    buildIconList: function (data) {
        this.pictogramsContainer.innerHTML = '';
        this.buttonsContainer.innerHTML = '';
        for (var idx in data.pictogram_list) {
            this.addIconPreview(data.pictogram_list[idx]);
        }
        var cancelButton = L.DomUtil.create('a', '', this.pictogramsContainer);
        cancelButton.innerHTML = L._('Cancel');
        cancelButton.href = '#';
        cancelButton.style.display = 'block';
        cancelButton.style.clear = 'both';
        L.DomEvent
            .on(cancelButton, 'click', L.DomEvent.stop)
            .on(cancelButton, 'click', function (e) {
                this.pictogramsContainer.innerHTML = '';
                this.udpatePreview();
            }, this);
        var customButton = L.DomUtil.create('a', '', this.pictogramsContainer);
        customButton.innerHTML = L._('Set URL');
        customButton.href = '#';
        customButton.style.display = 'block';
        customButton.style.clear = 'both';
        this.builder.map.help.button(customButton, 'formatIconURL');
        L.DomEvent
            .on(customButton, 'click', L.DomEvent.stop)
            .on(customButton, 'click', function (e) {
                this.input.type = 'url';
                this.pictogramsContainer.innerHTML = '';
            }, this);
    },

    fetchIconList: function (e) {
        this.builder.map.get(this.builder.map.options.urls.pictogram_list_json, {
            callback: this.buildIconList,
            context: this
        });
    },

    unselectAll: function (container) {
        var els = container.querySelectorAll('div.selected');
        for (var el in els) {
            if (els.hasOwnProperty(el)) L.DomUtil.removeClass(els[el], 'selected');
        }
    }

});

L.FormBuilder.Url = L.FormBuilder.Input.extend({

    type: function () {
        return 'url';
    }

});

L.FormBuilder.Switch = L.FormBuilder.CheckBox.extend({

    getParentNode: function () {
        L.FormBuilder.CheckBox.prototype.getParentNode.call(this);
        if (this.options.inheritable) return this.quickContainer;
        return this.extendedContainer;
    },

    build: function () {
        L.FormBuilder.CheckBox.prototype.build.apply(this);
        if (this.options.inheritable) this.label = L.DomUtil.create('label', '', this.input.parentNode);
        else this.input.parentNode.appendChild(this.label);
        L.DomUtil.addClass(this.input.parentNode, 'with-switch');
        var id = (this.builder.options.id || Date.now()) + '.' + this.name;
        this.label.setAttribute('for', id);
        L.DomUtil.addClass(this.input, 'switch');
        this.input.id = id;
    }

});

L.FormBuilder.MultiChoice = L.FormBuilder.Element.extend({

    default: 'null',
    className: 'storage-multiplechoice',

    clear: function () {
        var checked = this.container.querySelector('input[type="radio"]:checked');
        if (checked) checked.checked = false;
    },

    fetch: function () {
        var value = this.backup = this.toHTML();
        if (value === null || value === undefined) value = this.default;
        this.container.querySelector('input[type="radio"][value="' + value + '"]').checked = true;
    },

    value: function () {
        var checked = this.container.querySelector('input[type="radio"]:checked');
        if (checked) return checked.value;
    },

    getChoices: function () {
        return this.options.choices || this.choices;
    },

    build: function () {
        var choices = this.getChoices();
        this.container = L.DomUtil.create('div', this.className + ' by' + choices.length, this.parentNode);
        for (var i = 0; i < choices.length; i++) {
            this.addChoice(choices[i][0], choices[i][1], i);
        }
        this.fetch();
    },

    addChoice: function (value, label, counter) {
        var input = L.DomUtil.create('input', '', this.container);
        label = L.DomUtil.add('label', '', this.container, label);
        input.type = 'radio';
        input.name = this.name;
        input.value = value;
        var id = Date.now() + '.' + this.name + '.' + counter;
        label.setAttribute('for', id);
        input.id = id;
        L.DomEvent.on(input, 'change', this.sync, this);
    }

});

L.FormBuilder.ControlChoice = L.FormBuilder.MultiChoice.extend({

    default: 'null',

    choices: [
        [true, L._('always')],
        [false, L._('never')],
        ['null', L._('hidden')]
    ],

    toJS: function () {
        var value = this.value();
        switch (value) {
            case 'true':
            case true:
                value = true;
                break;
            case 'false':
            case false:
                value = false;
                break;
            default:
                value = null;
        }
        return value;
    }

});

L.FormBuilder.DataLayersControl = L.FormBuilder.ControlChoice.extend({

    choices: [
        [true, L._('collapsed')],
        ['expanded', L._('expanded')],
        [false, L._('never')],
        ['null', L._('hidden')]
    ],

    toJS: function () {
        var value = this.value();
        if (value !== 'expanded') value = L.FormBuilder.ControlChoice.prototype.toJS.call(this);
        return value;
    }

});

L.FormBuilder.OutlinkTarget = L.FormBuilder.MultiChoice.extend({

    default: 'blank',

    choices: [
        ['blank', L._('new window')],
        ['self', L._('iframe')],
        ['parent', L._('parent window')]
    ]

});

L.FormBuilder.Range = L.FormBuilder.Input.extend({

    type: function () {
        return 'range';
    },

    value: function () {
        return L.DomUtil.hasClass(this.wrapper, 'undefined') ? undefined : this.input.value;
    }

});

L.FormBuilder.DevStatusSwitcher = L.FormBuilder.MultiChoice.extend({
    //第一个参数可以是数字
    default: 1,
    choices: [
        [1, L._('Add device')],
        [2, '现状保留'],
        [3, '现状拆除']
    ]
});

L.FormBuilder.LeftRightChoice = L.FormBuilder.MultiChoice.extend({

    default: 1,
    choices: [
       [1, L._('left')],
       [2, L._('right')],
       [3, L._('middle')],
    ],
    choicesLR: [
        [1, L._('left')],
        [2, L._('right')]
    ],
    choicesLRM: [
        [1, L._('left')],
        [2, L._('right')],
        [3, L._('middle')]
    ],
    choicesNoM: [
        [1, L._('left')],
        [2, L._('right')],
        [5, '中分左'],
        [6, '中分右'],
        [4, '两侧'],
    ],
    choicesM: [
        [3, L._('middle')]
    ],
    choicesLRBoth: [
        [1, L._('left')],
        [2, L._('right')],
        [4, '两侧']
    ],
    choicesLRMBoth: [
       [1, L._('left')],
       [2, L._('right')],
       [3, L._('middle')],
       [4, '两侧']
    ],
    choicesNoMBoth: [
        [1, L._('left')],
        [2, L._('right')],
        [5, '中分左'],
        [6, '中分右'],
    ],
    allChoices:[
       [1, L._('left')],
       [2, L._('right')],
       [3, L._('middle')],
       [4, '两侧'],
       [5, '中分左'],
       [6, '中分右'],
    ]
});

L.FormBuilder.DirectionChoice = L.FormBuilder.MultiChoice.extend({

    default: 2,
    choices: [
        [1, '单向'],
        [2, '双向']
    ],
});

L.FormBuilder.FangxiangChoice = L.FormBuilder.MultiChoice.extend({

    default: 1,
    choices: [
        [1, '面向小桩号方向'],
        [2, '面向大桩号方向'],
        [3, '双向']
    ],
});


L.FormBuilder.PillSuppSwitcher = L.FormBuilder.Select.extend({

    selectOptions: [
        ["1", L._('Single Support')],
        ["2", L._('Double Support')],
        ["3", L._('Single Arm Support')],
        ["4", L._('Doulle Arms Support')],
        ["5", L._('Door Support')],
        ["6", "附着式"]
    ]

});

L.FormBuilder.PillDiamSwitcher = L.FormBuilder.Select.extend({
    //第一个参数必须是字符串
    selectOptions: [
      ["60","60"],
      ["70","70"],
      ["89","89"],
      ["114","114"],
      ["133","133"],
      ["140","140"],
      ["159","159"],
      ["165","165"],
      ["180","180"],
      ["219","219"],
      ["273","273"],
      ["325","325"],
      ["377","377"]
    ]
});

L.FormBuilder.MarkerTypeSwitcher = L.FormBuilder.Select.extend({
    selectOptions: [
      ["1", L._('warming indication')],
      ["2", L._('forbid indication')],
      ["3", L._('point indication')],
      ["4", L._('road indication')],
      ["5", '辅助标志'],
      ["6", '道路安全标志'],
      ["7", '告示标志'],
      ["8", '旅游景区标志']
    ],
    build: function () {
        L.FormBuilder.Select.prototype.build.call(this);
        L.DomEvent.on(this.select, 'change', this.sync, this);
    },

    sync: function () {
        L.FormBuilder.Select.prototype.sync.call(this);
    },
});

L.FormBuilder.EmptySwitcher = L.FormBuilder.Select.extend({
    selectOptions: [
    ],

    resetOptions: function( newOptions ) {
        if(newOptions instanceof Array ){
            this.selectOptions = []
            for(var i = 0, len = newOptions.length; i < len; i++){
                this.selectOptions.push(newOptions[i]);
            }
            //reset all options
            L.FormBuilder.Select.prototype.buildOptions.call(this);
        }
    }
});

L.FormBuilder.MarkerShapeSwitcher = L.FormBuilder.EmptySwitcher.extend({});
L.FormBuilder.MarkerSpeedSizeSwitcher = L.FormBuilder.EmptySwitcher.extend({});
L.FormBuilder.MarkerIconClassSwitcher = L.FormBuilder.EmptySwitcher.extend({});

L.FormBuilder.GuardbarCatSwitcher = L.FormBuilder.EmptySwitcher.extend({
  selectOptions: [
    ["1","横向减速标线"],
    ["2","纵向减速标线"],
    ["3","收费站广场减速标线"],
    ["4","行人横穿设施"]
  ]
});

L.FormBuilder.MaterialSwitcher = L.FormBuilder.EmptySwitcher.extend({
  selectOptions: [
    ["0","无"],
    ["1","溶剂型"],
    ["2","热熔普通型"],
    ["3","热熔反光型"],
    ["4","热熔凸起型"],
    ["5","双组分"],
    ["6","水性"],
    ["7","树脂防滑型"],
    ["8","预成型标线带标线"]
  ]
});

L.FormBuilder.LmbjMaterialSwitcher = L.FormBuilder.EmptySwitcher.extend({
  selectOptions: [
    ["0","无"],
    ["1","反光漆"],
    ["2","反光膜"]
  ]
});

L.FormBuilder.XiujianSwitch = L.FormBuilder.EmptySwitcher.extend({
  selectOptions: [
    ["1","修剪树木"],
    ["2","削挖土坡"],
    ["3","拆除广告牌"],
    ["4","移除大石"],
    ["5","清除灌木"],
    ["99","其他"]
  ]
});


L.FormBuilder.DangTuQiangSwitch = L.FormBuilder.EmptySwitcher.extend({
  selectOptions: [
    ["1","挡土墙"],
    ["2","挡土墙表面处理"],
    ["3","挡土墙+表面处理"],
    ["99","其他挡墙"]
  ]
});

L.FormBuilder.DangTuQiangCLSwitch = L.FormBuilder.EmptySwitcher.extend({
  selectOptions: [
    [undefined, "无"],
    ["1","片石"],
    ["2","块石"],
    ["3","砖"],
    ["4","混凝土"],
    ["5","钢筋混凝土"]
  ]
});

L.FormBuilder.DangTuQiangLXSwitch = L.FormBuilder.EmptySwitcher.extend({
  selectOptions: [
    [undefined,"无"],
    ["1","重力式"],
    ["2","衡重式"],
    ["3","混凝土半重力式"],
    ["4","悬臂式"],
    ["5","扶壁式"],
    ["6","锚杆式"],
    ["7","拱式"],
    ["8","锚定板式"],
    ["9","桩板式"],
    ["10","垛式"],
    ["11","加筋土式"],
    ["12","竖向预应力锚杆式"],
    ["13","土钉式"],
    ["99","其他挡土墙"]
  ]
});

L.FormBuilder.LevelSwitch = L.FormBuilder.Select.extend({

  selectOptions: [
    [undefined,"无"],
    ["A","A"],
    ["B","B"],
    ["C","C"],
    ["Am,","Am"],
    ["SA","SA"],
    ["SAm","SAm"],
    ["SB","SB"],
    ["SBm","SBm"],
    ["SS,","SS"],
    ["HB","HB"],
    ["HA","HA"]
  ]
});

L.FormBuilder.ShaperSwitcher = L.FormBuilder.EmptySwitcher.extend({
  selectOptions: [
    ["1","圆形"],
    ["2","方形"]
  ]
});

L.FormBuilder.ColorSwitcher = L.FormBuilder.EmptySwitcher.extend({
  selectOptions: [
    ["0","无"],
    ["1","白色"],
    ["2","黄色"],
    ["3","红色"],
    ["99","其他"]
  ]
});

L.FormBuilder.LineSwitcher = L.FormBuilder.EmptySwitcher.extend({
  allSelectOptions: [
    ["1","虚线"],
    ["2","实线"],
    ["3","虚实线"],
    ["4","双实线"]
  ]
});

L.FormBuilder.LineWidthSwitcher = L.FormBuilder.EmptySwitcher.extend({
  allSelectOptions: [
    ["8", "8cm"]
    ["10","10cm"],
    ["15","15cm"],
    ["20","20cm"],
    ["30","30cm"]
  ]
});

//交叉口类型
L.FormBuilder.CrossTypeSwitcher = L.FormBuilder.EmptySwitcher.extend({
  selectOptions: [
    ["1", "接入口"],
    ["2","T型"],
    ["3","十字形"],
    ["4","5支交叉"],
    ["5","中分带开口"],
    ["99","其他"]
  ]
});

//减速让行版面尺寸
L.FormBuilder.jsrxSizeSwitcher = L.FormBuilder.EmptySwitcher.extend({
  selectOptions: [
    [undefined,"无"],
    ["L90", "40-70_____L90"],
    ["L70", "<40  _____L70"]
  ]
});

//停车让行版面尺寸
L.FormBuilder.tcrxSizeSwitcher = L.FormBuilder.EmptySwitcher.extend({
  selectOptions: [
    [undefined,"无"],
    ["L80", "40-70_____D80"],
    ["L60", "<40  _____D60"]
  ]
});

//立柱的直径
L.FormBuilder.DiameterSwitcher = L.FormBuilder.EmptySwitcher.extend({
  selectOptions: [
    [undefined,"无"],
    ["60", "60mm"],
    ["76", "76mm"],
    ["89", "89mm"]
  ]
});

//警告减速丘版面尺寸
L.FormBuilder.jgSizeSwitcher = L.FormBuilder.EmptySwitcher.extend({
  selectOptions: [
    [undefined,"无"],
    ["L130", "100-120_____L130"],
    ["L110", "71-99  _____L110"],
    ["L90", "40-70   _____L90"],
    ["L70", "<40     _____L70"],
  ]
});

//警告减速丘版面尺寸
L.FormBuilder.jsqSizeSwitcher = L.FormBuilder.EmptySwitcher.extend({
  selectOptions: [
    [undefined,"无"],
    ["L90", "40-70   _____L90"],
    ["L70", "<40     _____L70"],
  ]
});

L.FormBuilder.jsqTypeSwitcher = L.FormBuilder.EmptySwitcher.extend({
  selectOptions: [
    [undefined, "无"],
    ["1", "大型减速丘"],
    ["2", "预制减速垄"],
    ["3", "预制断开式减速垄"],
  ]
});

L.FormBuilder.DangerousType = L.FormBuilder.EmptySwitcher.extend({
    selectOptions:[
        ["1", "急弯"],
        ["2", "过村"],
        ["3", "事故多发"],
        ["4", "隧道洞口"],
        ["5", "学校"],
        ["6", "交叉口"],
        ["7", "陡坡"],
    ]
});

L.FormBuilder.CustomerSwitcher = L.FormBuilder.EmptySwitcher.extend({});

L.FormBuilder.DefaultDataLayerSwitcher = L.FormBuilder.Select.extend({

    getOptions: function () {
        var options = [["0",'无']]; //select必须是字符串位收尾
        this.builder.map.eachDataLayer(function (datalayer) {
            if(datalayer.isLoaded() && !datalayer.isRemoteLayer() && datalayer.isBrowsable()) {
                options.push([datalayer.getOption('id') + "", datalayer.getName()]);
            }
        });
        return options;
    },

});

L.Storage.FormBuilder = L.FormBuilder.extend({

    options: {
        className: 'storage-form'
    },

    defaultOptions: {
        name: {label: L._('name')},
        description: {label: L._('description'), handler: 'Textarea', helpEntries: 'textFormatting'},
        color: {handler: 'ColorPicker', label: L._('color'), helpEntries: 'colorValue', inheritable: true},
        opacity: {handler: 'Range', min: 0.1, max: 1, step: 0.1, label: L._('opacity'), inheritable: true},
        stroke: {handler: 'Switch', label: L._('stroke'), helpEntries: 'stroke', inheritable: true},
        weight: {handler: 'Range', min: 1, max: 20, step: 1, label: L._('weight'), inheritable: true},
        fill: {handler: 'Switch', label: L._('fill'), helpEntries: 'fill', inheritable: true},
        fillColor: {handler: 'ColorPicker', label: L._('fill color'), helpEntries: 'fillColor', inheritable: true},
        fillOpacity: {handler: 'Range', min: 0.1, max: 1, step: 0.1, label: L._('fill opacity'), inheritable: true},
        smoothFactor: {handler: 'Range', min: 0, max: 10, step: 0.5, label: L._('Simplify'), helpEntries: 'smoothFactor', inheritable: true},
        dashArray: {label: L._('dash array'), helpEntries: 'dashArray', inheritable: true},
        iconClass: {handler: 'IconClassSwitcher', label: L._('Icon shape'), inheritable: true},
        iconUrl: {handler: 'IconUrl', label: L._('Icon symbol'), inheritable: true},
        popupTemplate: {handler: 'PopupTemplate', label: L._('Popup style'), inheritable: true},
        popupContentTemplate: {label: L._('Popup content template'), handler: 'Textarea', helpEntries: ['dynamicProperties', 'textFormatting'], placeholder: '# {name}', inheritable: true},
        datalayer: {handler: 'DataLayerSwitcher', label: L._('Choose the layer of the feature')},
        defaultLayer: {handler: 'DefaultDataLayerSwitcher', label: L._('Default Layer'), helpEntries:'defaultLayer'},
        tileOpacity: {handler: 'Range', min: 0.1, max: 1, step: 0.1, label: '背景透明度'},
        moreControl: {handler: 'Switch', label: L._('Do you want to display the «more» control?')},
        scrollWheelZoom: {handler: 'Switch', label: L._('Allow scroll wheel zoom?')},
        miniMap: {handler: 'Switch', label: L._('Do you want to display a minimap?')},
        scaleControl: {handler: 'Switch', label: L._('Do you want to display the scale control?')},
        onLoadPanel: {handler: 'onLoadPanel', label: L._('Do you want to display a panel on load?')},
        displayPopupFooter: {handler: 'Switch', label: L._('Do you want to display popup footer?')},
        captionBar: {handler: 'Switch', label: L._('Do you want to display a caption bar?')},
        zoomTo: {handler: 'IntInput', placeholder: L._('Inherit'), helpEntries: 'zoomTo', label: L._('Default zoom level'), inheritable: true},
        showLabel: {handler: 'Switch', label: L._('Display label'), inheritable: true},
        labelHover: {handler: 'Switch', label: L._('Only display label on mouse hover'), inheritable: true},
        labelDirection: {handler: 'LabelDirection', label: L._('Label direction'), inheritable: true},
        labelInteractive: {handler: 'Switch', label: L._('Labels are clickable'), inheritable: true},
        labelKey: {helpEntries: 'labelKey', placeholder: L._('Default: name'), label: L._('Label key'), inheritable: true},
        zoomControl: {handler: 'ControlChoice', label: L._('Display the zoom control')},
        searchControl: {handler: 'ControlChoice', label: L._('Display the search control')},
        fullscreenControl: {handler: 'ControlChoice', label: L._('Display the fullscreen control')},
        embedControl: {handler: 'ControlChoice', label: L._('Display the embed control')},
        locateControl: {handler: 'ControlChoice', label: L._('Display the locate control')},
        measureControl: {handler: 'ControlChoice', label: L._('Display the measure control')},
        tilelayersControl: {handler: 'ControlChoice', label: L._('Display the tile layers control')},
        editinosmControl: {handler: 'ControlChoice', label: L._('Display the control to open OpenStreetMap editor')},
        datalayersControl: {handler: 'DataLayersControl', label: L._('Display the data layers control')},

        //added by xiongjiabin 2016-09-30
        sn: {handler:'FloatInput',label: L._('Sub Number')},
        ds: {handler: 'DevStatusSwitcher', label: L._('Device Status')},
        lr: {handler: 'LeftRightChoice', label: L._('Direction')},

        //pillar attributes
        ps: {handler:'PillSuppSwitcher',label: L._('Support Type')},
        pd: {handler:'PillDiamSwitcher',label:L._('Pillar Diam')},
        pt: {handler:'FloatInput', label: L._('Pillar Thickness')},
        ph: {handler:'FloatInput', label: L._('Pillar Height')},
        pb: {label: L._('Pillar Base')},

        //marker attributes 2016-10-20
        mt: {handler:'MarkerTypeSwitcher', label: '类型'},
        msh:{handler:'MarkerShapeSwitcher', label: '内容'},
        mss:{handler:'MarkerSpeedSizeSwitcher', label: '速度&尺寸'},
        mic: {handler:'MarkerIconClassSwitcher', label: '图形'},
        size: {},

        //旋转
        rotate: {handler: 'Range', min:0,max:360, step: 1, label: '旋转'},
        scale:  {handler: 'Range', min:0,max:20,step: 1, label: '缩放'},//针对小数有一个bug,0.4 = 0,
        width:  {handler: 'Range', min:0,max:300,step:1,label: '宽度'},
        height: {handler: 'Range', min:0,max:300,step:1,label: '高度'},
        helpX:  {handler: 'IntInput', label: '辅助X'},
        helpY:  {handler: 'IntInput', label: '辅助Y'},
        isBindSN: {handler: 'Switch', label: '是否绑定桩号',helpEntries:'isBindSNHelp'},
        rotateCenter: {handler: 'Range', min:0,max:360, step: 1, label: '中心旋转'},

        //护栏部分
        gbc: {handler: 'GuardbarCatSwitcher', label: '类别'},
        gbl: {handler: 'FloatInput', label: '总长(m)'},
        gbw: {handler: 'FloatInput', label: '宽度(m)'},
        gbs: {handler: 'FloatInput', label: '间距(m)'},
        gbn: {handler: 'IntInput', label: '数量'},
        gbss: {handler: 'FloatInput', label: '起始桩号'},
        gbse: {handler: 'FloatInput', label: '结束桩号'},
        gbm:  {handler: 'MaterialSwitcher',label: '材料'},
        gba: {handler: 'FloatInput', label: '面积(m2)'},
        gbd: {handler: 'DirectionChoice',label: '方向'},
        gblev: {handler: 'LevelSwitch', label:'级别'},
        offset: {handler: 'Range', min: 0, max: 200, step: 1, label: '中线偏移'},
        jslmTs: {handler: 'IntInput', label: '每道设置条数'},

        speed: {handler: 'IntInput', label: '默认速度', helpEntries: 'defaultSpeed'},
        zIndex: {handler:'IntInput', label: '重叠级别(默认400,越大越突出)'},

        //修建
        at: {handler: 'XiujianSwitch', label: '清除类型'},

        //road
        road: {handler: 'Switch', label: '是否定义为主路',helpEntries:'roadHelp'},
        tail: {handler: 'Range', min:220, max:900, step:10,label: '尾巴'},

        //影藏元素
        hShape: {handler: 'ShaperSwitcher', label: '形式'},
        hColor: {handler: 'ColorSwitcher', label: '颜色'},
        hHeight: {handler: 'FloatInput', label: '高度(m)'},
        bulk: {handler: 'IntInput', label: '体积(m3)'},
        lineType: {handler:'LineSwitcher', label: '形式'},
        lineWidth: {handler: 'LineWidthSwitcher', label: '线宽'},
        lane: {handler: 'IntInput', label: '道数'},

        //交叉口特性
        crossType: {handler:'CrossTypeSwitcher', label: '交叉类型'},
        jsrxBx: {handler: 'FloatInput', label: '标线(平方)'},
        jsrxNum: {handler: 'IntInput', label: '数量(块)'},
        jsrxSize:{handler:'jsrxSizeSwitcher', label: '版面尺寸'},

        tcrxBx: {handler:'FloatInput', label: '标线(平方)'},
        tcrxNum: {handler:'IntInput', label: '数量(块)'},
        tcrxSize: {handler: 'tcrxSizeSwitcher', label: '版面尺寸'},

        jsqType: {handler:'jsqTypeSwitcher', label: '减速丘类型'},
        jsqBx: {handler:'FloatInput', label: '减速丘标线(平方)'},
        jsqBz: {handler:'IntInput', label: '标志(块)'},
        jsqSize: {handler: 'jsqSizeSwitcher', label: '版面尺寸'},
        jsqWidth:{handler:'FloatInput',label: '设置宽度(m)'},

        jgContent: {label: '标志内容'},
        jgSize: {handler:'jgSizeSwitcher', label: '版面尺寸'},
        jgNum: {handler:'IntInput', label:"数量(块)"},

        oQhbx: {handler:'FloatInput',label:'渠化标线(平方)'},
        oRxhd: {handler:'FloatInput',label: '被交道人行横道线(平方)'},
        oJsbx: {handler:'FloatInput',label: '被交道减速标线(平方)'},
        oDkbz: {handler:'IntInput', label: '道口标柱(个)'},
        oQcgm: {handler:'FloatInput',label: '清除内侧灌木(平方)'},
        oJdgz: {handler:'FloatInput',label: '被交道路改造(平方)'},
        oXjsm: {handler:'IntInput',label: '修剪树木(棵)'},

        bjdKd: { label: '被交道宽度(以逗号隔开)'},

        //挡土墙
        dtqType: {handler:'DangTuQiangSwitch', label: '处置类型'},
        dtqLx: {handler:'DangTuQiangLXSwitch', label: '类型'},
        dtqCL: {handler:'DangTuQiangCLSwitch', label: '材料'},

        showText: {handler: 'Switch', label: '显示文字桩号'},
        roadWidth: {handler:'FloatInput',label:'设置宽度(米)'},
        roadWidth2: {handler:'FloatInput',label:'道路宽度(米)'},
        roadWidth3: {handler:'FloatInput',label: '线宽'},
        tzxxk: {handler: 'FloatInput', label: '停止线线宽'},
        tzxbxmj: {handler: 'FloatInput', label: '停止线标线面积'},

        //help text
        textX:  {handler: 'Range', min:-200,max:200,step:1,label: '相对位置X'},
        textY: {handler: 'Range', min:-200,max:200,step:1,label: '相对位置Y'},
        text: {label: '附带文字内容'},
        textLat: {handler: 'FloatInput', label: L._('Latitude')},
        textLng: {handler: 'FloatInput', label: L._('Longitude')},
        zoomCreate: {handler:'IntInput', label: '元素创建时zoom'},
        fontSize: {handler: 'Range', min: 10, max:40, step:1, label: '文字大小'},

        //立面标记
        lmbjm: {handler: 'LmbjMaterialSwitcher', label: '材料'},

        //打印框
        gbssAngle: {handler: 'FloatInput', label: '起始桩号角度(自动生成)'},
        gbseAngle: {handler: 'FloatInput', label: '结束桩号角度(自动生成)'},
        centerGPS: {label:'中心GPS'},

        //预告标线设置个数
        ygbxszgs: {handler: 'IntInput', label: '预告标线设置个数'},

        //自定义类型
        category: {handler: 'CustomerSwitcher', label: '类型'},
        //线性诱导标方向
        direction: {handler: 'FangxiangChoice', label: '方向'},
        diameter:{handler:'DiameterSwitcher', label: '立柱直径'},

        dangerousType: {handler: 'DangerousType', label: '位置'},
    },

    initialize: function (obj, fields, options) {
        this.map = obj.getMap();
        L.FormBuilder.prototype.initialize.call(this, obj, fields, options);
        this.on('finish', this.finish);
    },

    setter: function (field, value) {
        L.FormBuilder.prototype.setter.call(this, field, value);
        this.obj.isDirty = true;
    },

    finish: function () {
        this.map.ui.closePanel();
    }

});
