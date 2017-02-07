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
      tolerance = tolerance || 6 //熊佳斌 相隔太近的points，小于10个像素的排除掉
      latlngs  = latlngs || this._latlngs
      var results = []
      var newLatlngs = []
      var i,len

      this._offsetProjectLatlngs(offset, latlngs, results, tolerance)
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

    _offsetProjectLatlngs: function (offset, latlngs, result, tolerance) {
      var flat = latlngs[0] instanceof L.LatLng,
          len = latlngs.length,
          i, ring, tmpPoint;

      if (flat) {
        ring = [];
        ring[0] = this._map.latLngToLayerPoint(latlngs[0])
        for (i = 1; i < len; i++) {
           tmpPoint = this._map.latLngToLayerPoint(latlngs[i]);
           //丢掉相隔太近的点
           //console.log(Math.abs(tmpPoint['x'] - ring[ring.length - 1]['x']))
           //console.log(Math.abs(tmpPoint['y'] - ring[ring.length - 1]['y']))
           if ((i < (len-1)) &&
               Math.abs(tmpPoint['x'] - ring[ring.length - 1]['x']) <= tolerance &&
               Math.abs(tmpPoint['y'] - ring[ring.length - 1]['y'] <= tolerance)){

           }else{
               ring.push(tmpPoint)
           }
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
