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

    return builder
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

  showSubNice: function(sn){
    var a = parseInt(sn)
    var temp = (+sn * 1000 - a * 1000)

    if(temp < 10){
      temp = '00' + temp
    }else if(temp < 100) {
      temp = '0' + temp
    }

    return 'K' + a + '+' + temp
  }
}

L.Storage.SVGObject = L.SVGObject.extend({
  parentClass: L.SVGObject,
  includes: [L.Storage.FeatureMixin, L.Mixin.Events],

  preInit: function() {},

  addInteractions: function() {
    L.Storage.FeatureMixin.addInteractions.call(this);
    this.on('dragend', this._onDragEnd, this);
    if (!this.isReadOnly()) this.on('mouseover', this._enableDragging);
    this.on('mouseout', this._onMouseOut);
    this._popupHandlersAdded = true; // prevent Leaflet from binding event on bindPopup
  },

  _onDragEnd: function(e){
    this.isDirty = true;
    this.edit(e);
  },

  _onMouseOut: function() {
    if (this.dragging && this.dragging._draggable && !this.dragging._draggable._moving) {
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

  getEvents: function() {
    return {
      zoom: this._redraw,
      viewreset: this.update
    };
  },

  _redraw: function() {
    if (this.datalayer && this.datalayer.isVisible()) {
      this.updateStyle()
      this.update()
    }
  },

  updateStyle: function(){
    if (this.datalayer && this.datalayer.isVisible()) {
      var color = this.getOption('color');
      var scale = this.getOption('scale');
      var rotate = this.getOption('rotate');
      var options = {}
      if(color) options['color'] = color

      var scaleZoom = lmd.getLmdZoom(this.map)

      options['scale'] = scale * scaleZoom
      options['rotate'] = rotate
      this.parentClass.prototype.updateStyle.call(this,options)
    }
    return this
  },

  _update: function(){
    if (this.datalayer && this.datalayer.isVisible()) {
      this.update()
    }
    return this
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

L.Storage.LmdUpdateXYMixin = {

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
    var sn = +this.getOption('sn')
    if(sn){
      var data = this.map.getAnchorLatLngBySubNo(sn)
      if(data['point']){
          var center = [data['point'][0],data['point'][1]]
          var latlngs = [center, latlng]
          this.helpPath = L.polyline(latlngs, {color: 'grey'}).addTo(this.map);
          var latlngPoint = this.map.latLngToLayerPoint(latlng);
          var centerPoint = this.map.latLngToLayerPoint(center);
          var scaleZoom = lmd.getLmdZoom(this.map)
          this.properties._storage_options['helpX'] = Math.round((latlngPoint['x'] - centerPoint['x'])/scaleZoom)
          this.properties._storage_options['helpY'] = Math.round((latlngPoint['y'] - centerPoint['y'])/scaleZoom)
      }
    }
  },

  update: function(){
    var helpX = this.getOption('helpX') || 0
    var helpY = this.getOption('helpY') || 0
    if (helpX || helpY) {
      var subNo = +this.getOption('sn')
      if(subNo > 0){
        var data = this.map.getAnchorLatLngBySubNo(subNo)
        if(data && data['point']){
          var center = [data['point'][0],data['point'][1]]
          var scaleZoom = lmd.getLmdZoom(this.map)

          var centerPoint = this.map.latLngToLayerPoint(center)
          var destX = centerPoint['x'] + helpX * scaleZoom
          var destY = centerPoint['y'] + helpY * scaleZoom
          var dest = this.map.layerPointToLatLng([destX, destY])
          this._latlng = dest

          if (this.helpPath) {
            this.helpPath.remove();
            this.helpPath = null;
            var latlngs = [center, dest]
            this.helpPath = L.polyline(latlngs, {color: 'grey'}).addTo(this.map);
          }

        }
      }
    }

    this.parentClass.prototype.update.call(this)
  },

  del: function () {
    L.Storage.FeatureMixin.del.call(this)
    if (this.helpPath) {
      this.helpPath.remove();
      this.helpPath = null;
    }
  },
}
