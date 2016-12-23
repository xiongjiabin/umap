L.SVG.include({

  _initContainer: function () {
    this._container = L.SVG.create('svg');

    // makes it possible to click through svg root; we'll reset it back in individual paths
    this._container.setAttribute('pointer-events', 'none');

    this._rootGroup = L.SVG.create('g');
    this._container.appendChild(this._rootGroup);

    //add pre defined markers xiongjiabin
    this._initPredefinedMarkers();
  },

  _initPredefinedMarkers: function(){
    this._defs = L.SVG.create('defs')
    this._defs.innerHTML = '<g id="lmdcross"><path d="M -8,-8 L 8,8 M -8,8 L 8,-8"></path></g>'
                        +  '<g id="lmdtrian"><path d="M 0,8 L -8,-8 8,-8 0,8"></path></g>'

    //add other markers
    this._container.appendChild(this._defs)
  },

  _delPolyMarker: function( layer ){
    if(layer._polyMarker){
      L.DomUtil.remove(layer._polyMarker)
      layer._polyMarker  = null
    }
  },

  _updatePolyMarker: function( layer, options ){
    var i = 0, len = 0, j = 0, jlen = 0
    var point = null
    options = options || {}
    if(layer._parts && layer._parts.length > 0){
    }else{
      return
    }

    if(layer._polyMarker){
      L.DomUtil.remove(layer._polyMarker)
      layer._polyMarker  = null
    }

    layer._polyMarker = L.SVG.create('g')

    if(options.fill){
      layer._polyMarker.setAttribute('stroke-width', 1);
      layer._polyMarker.setAttribute('fill', options.fillColor);
    }else{
      layer._polyMarker.setAttribute('stroke-width', options.weight || 4);
      layer._polyMarker.setAttribute('fill', 'none');
      layer._polyMarker.setAttribute('stroke', options.color || 'red');
    }

    var lmdtype = options['lmdtype'] || 'lmdcross'

    //<use xlink:href="#m_cross" x="962" y="180"></use>
    for (i = 0, len = layer._rings.length; i < len; i++) {
      for(j = 0, jlen = layer._rings[i].length; j < jlen; j++){
        point = layer._rings[i][j]
        layer._polyMarker.innerHTML +=
            '<use xlink:href="#' + lmdtype + '" x="' + point.x + '" y="' + point.y + '"></use>'
      }
    }
    this._rootGroup.appendChild(layer._polyMarker)
  },

  //we want to include a direct svg object
  _initSVGOjbect: function(layer) {
    var svgObject = layer._svgObject = L.SVG.create('g');
    var svgObjectChild = layer._svgObjectChild = L.SVG.create('g')
    if (layer.options.className) {
      L.DomUtil.addClass(svgObject, layer.options.className)
    }

    if (layer.options.interactive) {
      L.DomUtil.addClass(svgObject, 'leaflet-interactive')
    }

    this._updateSVGText(layer)
  },

  _addSVGObject: function(layer) {
    //'<circle cx="92" cy="18" r="14.5" /> <rect width="178" height="20" x="2" y="31" />'
    layer._svgObjectChild.innerHTML = layer.options.svgText
    layer._svgObject.appendChild(layer._svgObjectChild)
    this._rootGroup.appendChild(layer._svgObject)
  },

  _removeSVGObject: function(layer) {
    L.DomUtil.remove(layer._svgObject)
    layer.removeInteractiveTarget(layer._svgObject)
  },

  _updateSVGPosition: function(layer) {
    var pos = layer._point || new L.Point(0, 0)
    L.DomUtil.setPosition(layer._svgObject, pos)
  },

  _updateSVGText: function(layer) {
    layer._svgObjectChild.innerHTML = layer.options.svgText;
  },

  _updateSVGStyle: function(layer) {
    var path = layer._svgObject,options = layer.options, pathChild = layer._svgObjectChild;
    var scale = options.scale || 10, rotate = options.rotate || 0

    if (!path) return;

    if (options.stroke) {
      path.setAttribute('stroke', options.color);
      path.setAttribute('stroke-opacity', options.opacity);
      path.setAttribute('stroke-width', options.weight);
      path.setAttribute('stroke-linecap', options.lineCap);
      path.setAttribute('stroke-linejoin', options.lineJoin);

      if (options.dashArray) {
        path.setAttribute('stroke-dasharray', options.dashArray);
      } else {
        path.removeAttribute('stroke-dasharray');
      }

      if (options.dashOffset) {
        path.setAttribute('stroke-dashoffset', options.dashOffset);
      } else {
        path.removeAttribute('stroke-dashoffset');
      }
    } else {
      path.setAttribute('stroke', 'none');
    }

    if (options.fill) {
      path.setAttribute('fill', options.fillColor || options.color);
      path.setAttribute('fill-opacity', options.fillOpacity);
      path.setAttribute('fill-rule', options.fillRule || 'evenodd');
    } else {
      path.setAttribute('fill', '#ffcc00');
    }
    path.setAttribute('pointer-events', 'auto')

    var transformStr =  (scale ? ' scale(' + scale/10 + ')' : '') +
                        (rotate ? ' rotate(' + rotate + ')' : '');
    pathChild.setAttribute('transform', transformStr)
  },

})

L.Polyline.include({
  delPolyMakrer: function() {
    if(this._renderer){
      this._renderer._delPolyMarker(this)
    }
  },

  updatePolyMarker: function(options){
    if(this._renderer){
      this._renderer._updatePolyMarker(this, options)
    }
  },
})

L.SVGObject = L.Layer.extend({

  // @section
  // @aka Polyline options
  options: {
    stroke: false,
    draggable: true,
    interactive: true,
    svgText: '',
    scale: 10,
    rotate: 0,
    fill: true,
    fillOpacity:1,
    fillRule: 'evenodd',
    color: '#ffcc00'
  },
  _point: null,
  _svgObject: null,
  _renderer: null,

  initialize: function(latlng, options) {
    L.setOptions(this, options);
    this.setLatLng(latlng);
  },

  getLatLng: function() {
    return this._latlng;
  },

  beforeAdd: function(map) {
    // Renderer is set here because we need to call renderer.getEvents
    // before this.getEvents.
    this._renderer = map.getRenderer(this);
  },

  onAdd: function() {
    this._renderer._initSVGOjbect(this);
    this._renderer._addSVGObject(this);
    this._initInteraction();
    this.update()
    this.updateStyle()
  },

  onRemove: function() {
    this._renderer._removeSVGObject(this);
  },

  getEvents: function() {
    return {
      zoom: this.update,
      viewreset: this.update
    };
  },

  setLatLng: function(latlng) {
    var oldLatLng = this._latlng;
    this._latlng = L.latLng(latlng);
    this.update();

    // @event move: Event
    // Fired when the marker is moved via [`setLatLng`](#marker-setlatlng) or by [dragging](#marker-dragging). Old and new coordinates are included in event arguments as `oldLatLng`, `latlng`.
    return this.fire('move', {
      oldLatLng: oldLatLng,
      latlng: this._latlng
    });
  },

  //负责更新图形
  setSvgText: function(svgText) {
    this.options.svgText = svgText;
    this._renderer._updateSVGText(this)
  },

  //负责更新位置
  update: function() {
    if (!this._map || !this._latlng) {
      return;
    }
    this._point = this._map.latLngToLayerPoint(this._latlng)
    this._renderer._updateSVGPosition(this);
  },

  //负责更新样式，大小，旋转
  updateStyle: function(options) {
    options = options || {}
    for(var i in options){
      this.options[i] = options[i]
    }
    this._renderer._updateSVGStyle(this);
  },

  _initInteraction: function() {

    if (!this.options.interactive) {
      return;
    }

    L.DomUtil.addClass(this._svgObject, 'leaflet-interactive');

    this.addInteractiveTarget(this._svgObject);

    if (L.Handler.SVGObjectDrag) {
      var draggable = this.options.draggable;
      if (this.dragging) {
        draggable = this.dragging.enabled();
        this.dragging.disable();
      }

      this.dragging = new L.Handler.SVGObjectDrag(this);

      if (draggable) {
        this.dragging.enable();
      }
    }
  },

  toGeoJSON: function() {
    return L.GeoJSON.getFeature(this, {
      type: 'Point',
      coordinates: L.GeoJSON.latLngToCoords(this.getLatLng())
    });
  },

});

L.svgObject = function(latlng, options) {
  return new L.SVGObject(latlng, options);
};


L.Handler.SVGObjectDrag = L.Handler.extend({
  initialize: function(marker) {
    this._marker = marker;
  },

  addHooks: function() {
    var icon = this._marker._svgObject;

    if (!this._draggable) {
      this._draggable = new L.Draggable(icon, icon, true);
    }

    this._draggable.on({
      dragstart: this._onDragStart,
      drag: this._onDrag,
      dragend: this._onDragEnd
    }, this).enable();

    L.DomUtil.addClass(icon, 'leaflet-marker-draggable');
  },

  removeHooks: function() {
    this._draggable.off({
      dragstart: this._onDragStart,
      drag: this._onDrag,
      dragend: this._onDragEnd
    }, this).disable();

    if (this._marker._svgObject) {
      L.DomUtil.removeClass(this._marker._svgObject,
        'leaflet-marker-draggable');
    }
  },

  moved: function() {
    return this._draggable && this._draggable._moved;
  },

  _onDragStart: function() {

    this._oldLatLng = this._marker.getLatLng();
    this._marker
      .fire('movestart')
      .fire('dragstart');
  },

  _onDrag: function(e) {
    var marker = this._marker,
      iconPos = L.DomUtil.getPosition(marker._svgObject),
      latlng = marker._map.layerPointToLatLng(iconPos);

    marker._latlng = latlng;
    e.latlng = latlng;
    e.oldLatLng = this._oldLatLng;

    // @event drag: Event
    // Fired repeatedly while the user drags the marker.
    marker
      .fire('move', e)
      .fire('drag', e);
  },

  _onDragEnd: function(e) {
    // @event dragend: DragEndEvent
    // Fired when the user stops dragging the marker.

    // @event moveend: Event
    // Fired when the marker stops moving (because of dragging).
    delete this._oldLatLng;
    this._marker
      .fire('moveend')
      .fire('dragend', e);
  }
});
