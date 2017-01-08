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


L.PolylineOffset = {
  translatePoint: function(pt, dist, radians) {
    return L.point(pt.x + dist * Math.cos(radians), pt.y + dist * Math.sin(radians));
  },

  offsetPointLine: function(points, distance) {
    var l = points.length;
    if (l < 2) {
      throw new Error('Line should be defined by at least 2 points');
    }

    var a = points[0], b;
    var offsetAngle, segmentAngle;
    var offsetSegments = [];

    for(var i=1; i < l; i++) {
      b = points[i];
      // angle in (-PI, PI]
      segmentAngle = Math.atan2(a.y - b.y, a.x - b.x);
      // angle in (-1.5 * PI, PI/2]
      offsetAngle = segmentAngle - Math.PI/2;

      // store offset point and other information to avoid recomputing it later
      offsetSegments.push({
        angle: segmentAngle,
        offsetAngle: offsetAngle,
        distance: distance,
        original: [a, b],
        offset: [
          this.translatePoint(a, distance, offsetAngle),
          this.translatePoint(b, distance, offsetAngle)
        ]
      });
      a = b;
    }

    return offsetSegments;
  },

  pointsToLatLngs: function(pts, map) {
    var ll = [];
    for(var i=0, l=pts.length; i<l; i++) {
      ll[i] = map.layerPointToLatLng(pts[i]);
    }
    return ll;
  },

  offsetPoints: function(pts, offset) {
    var offsetSegments = this.offsetPointLine(pts, offset);
    return this.joinLineSegments(offsetSegments, offset, 'round');
  },

  /**
  Return the intersection point of two lines defined by two points each
  Return null when there's no unique intersection
  */
  intersection: function(l1a, l1b, l2a, l2b) {
    var line1 = this.lineEquation(l1a, l1b),
        line2 = this.lineEquation(l2a, l2b);

    if (line1 == null || line2 == null) {
      return null;
    }

    if(line1.hasOwnProperty('x')) {
      if(line2.hasOwnProperty('x')) {
        return null;
      }
      return L.point(line1.x, line2.a * line1.x + line2.b);
    }
    if(line2.hasOwnProperty('x')) {
      return L.point(line2.x, line1.a * line2.x + line1.b);
    }

    if (line1.a == line2.a) {
      return null;
    }

    var x = (line2.b - line1.b) / (line1.a - line2.a),
        y = line1.a * x + line1.b;

    return L.point(x, y);
  },

  /**
  Find the coefficients (a,b) of a line of equation y = a.x + b,
  or the constant x for vertical lines
  Return null if there's no equation possible
  */
  lineEquation: function(pt1, pt2) {
    if (pt1.x != pt2.x) {
      var a = (pt2.y - pt1.y) / (pt2.x - pt1.x);
      return {
        a: a,
        b: pt1.y - a * pt1.x
      };
    }

    if (pt1.y != pt2.y) {
      return { x: pt1.x };
    }

    return null;
  },

  /**
  Join 2 line segments defined by 2 points each,
  with a specified methodnormalizeAngle( (default : intersection);
  */
  joinSegments: function(s1, s2, offset, joinStyle) {
    var jointPoints = [];
    switch(joinStyle) {
      case 'round':
        jointPoints = this.circularArc(s1, s2, offset);
        break;
      case 'cut':
        jointPoints = [
          this.intersection(s1.offset[0], s1.offset[1], s2.original[0], s2.original[1]),
          this.intersection(s1.original[0], s1.original[1], s2.offset[0], s2.offset[1])
        ];
        break;
      case 'straight':
        jointPoints = [s1.offset[1], s2.offset[0]];
        break;
      case 'intersection':
      default:
        jointPoints = [this.intersection(s1.offset[0], s1.offset[1], s2.offset[0], s2.offset[1])];
    }
    // filter out null-results
    return jointPoints.filter(function(v) {return v;});
  },

  joinLineSegments: function(segments, offset, joinStyle) {
    var l = segments.length;
    var joinedPoints = [];
    var s1 = segments[0], s2 = segments[0];
    joinedPoints.push(s1.offset[0]);

    for(var i=1; i<l; i++) {
      s2 = segments[i];
      joinedPoints = joinedPoints.concat(this.joinSegments(s1, s2, offset, joinStyle));
      s1 = s2;
    }
    joinedPoints.push(s2.offset[1]);

    return joinedPoints;
  },

  /**
  Interpolates points between two offset segments in a circular form
  */
  circularArc: function(s1, s2, distance) {
    if (s1.angle == s2.angle)
      return [s1.offset[1]];

    var center = s1.original[1];
    var points = [];

    if (distance < 0) {
      var startAngle = s1.offsetAngle;
      var endAngle = s2.offsetAngle;
    } else {
      // switch start and end angle when going right
      var startAngle = s2.offsetAngle;
      var endAngle = s1.offsetAngle;
    }

    if (endAngle < startAngle) {
      endAngle += Math.PI * 2; // the end angle should be bigger than the start angle
    }

    if (endAngle > startAngle + Math.PI) {
      return [this.intersection(s1.offset[0], s1.offset[1], s2.offset[0], s2.offset[1])];
    }

    // Step is distance dependent. Bigger distance results in more steps to take
    var step = Math.abs(8/distance);
    for (var a = startAngle; a < endAngle; a += step) {
      points.push(this.translatePoint(center, distance, a));
    }
    points.push(this.translatePoint(center, distance, endAngle));

    if (distance > 0) {
      // reverse all points again when going right
      points.reverse();
    }

    return points;
  }
}

  L.Polyline.include({
    getOffSetLatlngs: function(offset, latlngs, tolerance){
      if(!offset) return latlngs
      tolerance = tolerance || 1
      latlngs  = latlngs || this._latlngs
      var results = []
      var newLatlngs = []
      var i,len

      this._offsetProjectLatlngs(offset, latlngs, results)
      //let points to latlngs
      if(results.length === 1){
        newLatlngs = L.PolylineOffset.pointsToLatLngs(results[0],this._map)
      } else {
        for(i = 0, len = results.length; i < len; i++){
          if(!results[i]) break
          newLatlngs.push(L.PolylineOffset.pointsToLatLngs(results[i],this._map))
        }
      }
      return newLatlngs
    },

    _offsetProjectLatlngs: function (offset, latlngs, result) {
      var flat = latlngs[0] instanceof L.LatLng,
          len = latlngs.length,
          i, ring;

      if (flat) {
        ring = [];
        for (i = 0; i < len; i++) {
          ring[i] = this._map.latLngToLayerPoint(latlngs[i]);
        }
        // Offset management hack ---
        if(offset) {
          ring = L.PolylineOffset.offsetPoints(ring, offset);
        }
        // Offset management hack END ---
        result.push(ring);
      } else {
        for (i = 0; i < len; i++) {
            this._projectLatlngs(latlngs[i], result);
        }
      }
    }
  });
