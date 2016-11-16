//这个类主要作用是做一些自己的特殊处理，有别于L.Storage.FeatureMixin
//比如对待名字的处理,增加桩号等基本属性
L.Storage.LmdFeatureMixin = {
  edit: function(e) {
    if (!this.map.editEnabled || this.isReadOnly()) return;
    var container = L.DomUtil.create('div');

    var builder = new L.S.FormBuilder(this, ['datalayer'], {
      callback: function() {
          this.edit(e);
        } // removeLayer step will close the edit panel, let's reopen it
    });
    container.appendChild(builder.build());

    var properties = [],
      property, i = 0,
      len = 0;

    // add a basic properties for our new design
    var basicOptions = this.getBasicOptions();
    for (i = 0, len = basicOptions.length; i < len; i++) {
      property = basicOptions[i];
      if (L.Util.indexOf(['name', 'description', 'className'], property) !==
        -1) {
        continue;
      }
      properties.push(property);
    }

    //添加在layer自定义的属性列表
    for (i = 0; i < this.datalayer._propertiesIndex.length; i++) {
      property = this.datalayer._propertiesIndex[i];
      if (L.Util.indexOf(['name', 'description', 'className'], property) !==
        -1) {
        continue;
      }
      properties.push(['properties.' + property, {
        label: property
      }]);
    }

    // We always want name and description for now (properties management to come)
    properties.push('properties.name');
    properties.push('properties.description');
    builder = new L.S.FormBuilder(this, properties, {
      id: 'storage-feature-properties',
      callback: this.resetTooltip,
      listenChange: true
    });
    container.appendChild(builder.build());
    this.appendEditFieldsets(container);
    var advancedActions = L.DomUtil.createFieldset(container, L._(
      'Advanced actions'));
    this.getAdvancedEditActions(advancedActions);
    this.map.ui.openPanel({
      data: {
        html: container
      },
      className: 'dark'
    });
    this.map.editedFeature = this;
    if (!this.isOnScreen()) this.bringToCenter(e);

  },

  initialize: function(map, latlng, options) {
    this.map = map;
    if (typeof options === 'undefined') {
      options = {};
    }
    // DataLayer the marker belongs to
    this.datalayer = options.datalayer || null;
    this.properties = {
      _storage_options: {}
    };
    if (options.geojson) {
      this.populate(options.geojson);
    }
    var isDirty = false,
      self = this;
    try {
      Object.defineProperty(this, 'isDirty', {
        get: function() {
          return isDirty;
        },
        set: function(status) {
          if (!isDirty && status) {
            self.fire('isdirty');
          }
          isDirty = status;
          if (self.datalayer) {
            self.datalayer.isDirty = status;
          }
        }
      });
    } catch (e) {
      // Certainly IE8, which has a limited version of defineProperty
    }
    var newOptiosn = this.preInit();
    this.addInteractions();
    this.parentClass.prototype.initialize.call(this, latlng, newOptiosn);
  },
}

L.Storage.LmdMarker = L.Storage.Marker.extend({

  preInit: function() {
    if (!this.properties['className']) {
      this.properties['className'] = this.getClassName()
    }
    if (!this.properties._storage_options.mt) {
      this.properties._storage_options = {
        mt: "" + lmd.MARKER_WARMING,
        mic: "1",
        msh: "1",
        mss: "1",
        lr: "1",
        ds: "1",
        width: "60",
        height: "60"
      }
    }
  },

  addInteractions: function() {
    L.Storage.FeatureMixin.addInteractions.call(this);
    this.on('dragend', function(e) {
      this.caculateHelpXY()
      this.isDirty = true;
      this.edit(e);
    }, this);
    if (!this.isReadOnly()) this.on('mouseover', this._enableDragging);
    this.on('mouseout', this._onMouseOut);
    this._popupHandlersAdded = true; // prevent Leaflet from binding event on bindPopup

    this.on('editable:drawing:clicked', function(e) {
      this.caculateHelpXY()
    }, this)
  },

  caculateHelpXY: function() {

    if (this.helpPath) {
      this.helpPath.remove();
      this.helpPath = null;
    }
    var latlng = this.getLatLng()
    var center = lmd.getLatLngFromSubNo()
    var latlngs = [center, latlng]
    this.helpPath = L.polyline(latlngs, {
      color: 'grey'
    }).addTo(this.map);
    var latlngPoint = this.map.latLngToLayerPoint(latlng);
    var centerPoint = this.map.latLngToLayerPoint(center);
    this.properties._storage_options['helpX'] = Math.round(latlngPoint[
      'x'] - centerPoint['x'])
    this.properties._storage_options['helpY'] = Math.round(latlngPoint[
      'y'] - centerPoint['y'])

  },

  //added by xiongjiabin
  getBasicOptions: function() {
    return [
      'properties._storage_options.mt',
      'properties._storage_options.mic',
      'properties._storage_options.msh',
      'properties._storage_options.mss',
      'properties._storage_options.lr',
      'properties._storage_options.sn',
      'properties._storage_options.ds'
    ];
  },

  getShapeOptions: function() {
    return [
      'properties._storage_options.color',
      'properties._storage_options.iconUrl',
      'properties._storage_options.width',
      'properties._storage_options.height',
      'properties._storage_options.helpX',
      'properties._storage_options.helpY'
    ];
  },


  getEvents: function() {
    return {
      zoom: this.zoom,
      viewreset: this.update
    };
  },

  zoom: function() {
    var helpX = this.properties._storage_options['helpX'] || 0
    var helpY = this.properties._storage_options['helpY'] || 0
    if (helpX || helpY) {
      var center = lmd.getLatLngFromSubNo()
      var centerPoint = this.map.latLngToLayerPoint(center)
      var destX = centerPoint['x'] + helpX
      var destY = centerPoint['y'] + helpY
      var dest = this.map.layerPointToLatLng([destX, destY])
      this.setLatLng(dest)
    }
  },

  _getIconUrl: function(name) {
    var baseUrl = '/static/storage/src/img/'
    var mt = this.getOption('mt')
    var mic = this.getOption('mic')
    var msh = this.getOption('msh')
    if (!mt || !mic || !msh) {
      return baseUrl + 'marker.png'
    }
    return baseUrl + [mt, mic, ''].join('/') + msh + '.jpg'
  },

  getIconClass: function() {
    var mt = this.getOption('mt')
    var mic = this.getOption('mic')
    var className = lmd.getMarkerThirdClass(mt, mic)
    return className
  },

  getIcon: function() {
    var Class = L.Storage.Icon[this.getIconClass()] || L.Storage.Icon.Rect;
    return new Class(this.map, {
      feature: this
    });
  },

  getClassName: function() {
    return 'lmdMarker';
  },

  edit: function(e) {
    //通过改变对应的select的prototype的selectOptions来改变需要变化的options值
    //初始化的情况下，其实js中的class也是一个value,可以随便去改变其值 10-20 aftrer third debate of trump&hilary
    var mt = this.getOption('mt') || 1
    var mtOptions = lmd.getMarkerCategorySecond(mt)
    L.FormBuilder.MarkerIconClassSwitcher.prototype.selectOptions =
      mtOptions;
    var mic = this.getOption('mic') || mtOptions[0][0] || 1
    L.FormBuilder.MarkerSpeedSizeSwitcher.prototype.selectOptions = lmd.getMarkerCategoryThird(
      mt, mic);
    L.FormBuilder.MarkerShapeSwitcher.prototype.selectOptions = lmd.getMarkerCategoryThirdWife(
      mt, mic);

    L.Storage.LmdFeatureMixin.edit.call(this, e)
  },

  //added by xiongjiabin
  //for listen the select change event for basic operations 2016-10-18
  //对应编辑框的select的变化是一个体系，之间都有一些错综复杂的关系
  //这个东西，可能就是react处理data的优势了，数据变化对应试图发生变化
  change: function(e) {
    //console.log(e);
    if (!e.target) return;
    var msh = this.xiongjiabin.helpers['properties._storage_options.msh']
    var mic = this.xiongjiabin.helpers['properties._storage_options.mic']
    var mss = this.xiongjiabin.helpers['properties._storage_options.mss']

    if (e.target.name === 'mt') {
      //console.log('markerType changed, new value:', e.target.value)
      var mshOptions = lmd.getMarkerCategorySecond(e.target.value)
      mic.resetOptions(mshOptions);
      mss.resetOptions(lmd.getMarkerCategoryThird(e.target.value,
        mshOptions[0][0]))
      msh.resetOptions(lmd.getMarkerCategoryThirdWife(e.target.value,
        mshOptions[0][0]))
      this._redraw();
    } else if (e.target.name === 'mic') {
      var mt = this.getOption('mt');
      mss.resetOptions(lmd.getMarkerCategoryThird(mt, e.target.value))
      msh.resetOptions(lmd.getMarkerCategoryThirdWife(mt, e.target.value))
      this._redraw();
    } else if (e.target.name === 'msh') {
      this._redraw();
    } else {

    }
  }
});

L.Storage.SVGObject = L.SVGObject.extend({
  parentClass: L.SVGObject,
  includes: [L.Storage.FeatureMixin, L.Mixin.Events],

  preInit: function() {},

  addInteractions: function() {
    L.Storage.FeatureMixin.addInteractions.call(this);
    this.on('dragend', function(e) {
      this.isDirty = true;
      this.edit(e);
    }, this);
    if (!this.isReadOnly()) this.on('mouseover', this._enableDragging);
    this.on('mouseout', this._onMouseOut);
    this._popupHandlersAdded = true; // prevent Leaflet from binding event on bindPopup
  },

  _onMouseOut: function() {
    if (this.dragging && this.dragging._draggable && !this.dragging._draggable
      ._moving) {
      // Do not disable if the mouse went out while dragging
      this._disableDragging();
    }
  },

  _enableDragging: function() {
    // TODO: start dragging after 1 second on mouse down
    if (this.map.editEnabled) {
      if (!this.editEnabled()) this.enableEdit();
      // Enabling dragging on the marker override the Draggable._OnDown
      // event, which, as it stopPropagation, refrain the call of
      // _onDown with map-pane element, which is responsible to
      // set the _moved to false, and thus to enable the click.
      // We should find a cleaner way to handle this.
      this.map.dragging._draggable._moved = false;
    }
  },

  _disableDragging: function() {
    if (this.map.editEnabled) {
      if (this.editor && this.editor.drawing) return; // when creating a new marker, the mouse can trigger the mouseover/mouseout event
      // do not listen to them
      this.disableEdit();
    }
  },

  _redraw: function() {
    if (this.datalayer && this.datalayer.isVisible()) {
      var color = this.getOption('color');
      var scale = this.getOption('scale');
      var rotate = this.getOption('rotate');
      var options = {}
      if(color) options['color'] = color
      options['scale'] = scale
      options['rotate'] = rotate
      this.updateStyle(options)
    }
  },

  _update: function(){
    if (this.datalayer && this.datalayer.isVisible()) {
      this.update()
    }
  },

  getCenter: function() {
    return this._latlng;
  },

  getClassName: function() {
    return 'svgobject';
  },

  getShapeOptions: function() {
    return [
      'properties._storage_options.color',
      'properties._storage_options.rotate',
      'properties._storage_options.scale'
    ];
  },

  getAdvancedOptions: function() {
    return [
      'properties._storage_options.zoomTo'
    ];
  },

  appendEditFieldsets: function(container) {
    L.Storage.FeatureMixin.appendEditFieldsets.call(this, container);
    var coordinatesOptions = [
      ['_latlng.lat', {
        handler: 'FloatInput',
        label: L._('Latitude')
      }],
      ['_latlng.lng', {
        handler: 'FloatInput',
        label: L._('Longitude')
      }]
    ];
    var builder = new L.S.FormBuilder(this, coordinatesOptions, {
      callback: function() {
        this._update();
        this.bringToCenter();
      },
      callbackContext: this
    });
    var fieldset = L.DomUtil.createFieldset(container, L._('Coordinates'));
    fieldset.appendChild(builder.build());
  },

  bringToCenter: function(e, callback) {
    callback = callback || function() {}; // mandatory for zoomToShowLayer
    if (this.datalayer.isClustered() && !this._icon) {
      this.datalayer.layer.zoomToShowLayer(this, callback);
    } else {
      L.Storage.FeatureMixin.bringToCenter.call(this, e, callback);
    }
  },

  isOnScreen: function() {
    var bounds = this.map.getBounds();
    return bounds.contains(this._latlng);
  },

});

L.Storage.LmdPillar = L.Storage.SVGObject.extend({

  initialize: function(map, latlng, options) {

    L.Storage.LmdFeatureMixin.initialize.call(this, map, latlng, options)
  },

  preInit: function() {
    if (!this.properties['className']) {
      this.properties['className'] = this.getClassName()
    }

    if (!this.properties._storage_options.ps) {
      this.properties._storage_options = {
        ps: 1,
        scale: 5,
        rotate: 0,
        color: 'Yellow'
      }
    }

    var options = {}
    var _storage_options = this.properties._storage_options
    if(_storage_options['ps']){
      options.svgText = this.getSvgData(_storage_options['ps'])
    }
    var validObj = {rotate:1,scale:1,color:1}
    for(var i in _storage_options){
      if(validObj[i]){
        options[i] = _storage_options[i]
      }
    }
    return options
  },

  getSvgData(type) {
    var typeSvg = {
      1: '<circle cx="91.837326" cy="17.580078" r="14.5" /> <rect width="178" height="20" x="2" y="31.325439" />', //单柱式
      2: '<circle cx="42.341717" cy="16.31813" r="14.5" /> <circle cx="129.88086" cy="15.88588" r="14.5" /> <rect width="178" height="25" x="2" y="30.106392" />', //双柱式
      3: '<rect width="149" height="25" x="2" y="2" /><circle cx="166" cy="15" r="15" /> ', //单悬臂式
      4: '<rect width="72.986015" height="25" x="106.27666" y="14.277634" /> <circle cx="90.311035" cy="16.431107" r="14.5" /> <rect width="72.478447" height="24.748737" x="2" y="14.679733" />', //双悬臂式
      5: '<rect width="121.90018" height="25" x="31.11552" y="3.5418777" /> <circle cx="16.5" cy="15.179672" r="14.5" /> <circle cx="167.53844" cy="15.409348" r="14.5" />', //门架式
      //5: ' <text font-family="Verdana" font-size="55"> 新建混泥土护栏 </text>'
    }
    var svgStr = typeSvg[type] || typeSvg[1]

    return svgStr
  },

  //added by xiongjiabin
  getBasicOptions: function() {
    return [
      'properties._storage_options.ps',
      'properties._storage_options.lr',
      'properties._storage_options.sn',
      'properties._storage_options.ds',

      //pillar attributes
      'properties._storage_options.pd',
      'properties._storage_options.pt',
      'properties._storage_options.ph',
      'properties._storage_options.pb'
    ];
  },


  getClassName: function() {
    return 'lmdPillar';
  },

  edit: function(e) {
    L.Storage.LmdFeatureMixin.edit.call(this, e)
  },

  change: function(e) {
    if (!e.target) return;
    var ps = this.xiongjiabin.helpers['properties._storage_options.ps']
    if (e.target.name === 'ps') {
      var svgStr = this.getSvgData(e.target.value)
      this.setSvgText(svgStr);
    }
  }
});
