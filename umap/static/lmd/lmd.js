var lmd = {
    init: function(map){

        //init the latlng show events
        L.control.coordinates({
          position:"bottomleft",
          decimals:6,
          decimalSeperator:".",
          labelTemplateLat:"纬度: {y}",
	        labelTemplateLng:"经度: {x}"
		    }).addTo(map);
    },

    getLatLngFromSubNo: function( subNo ){
        //just for test it
        return [32.004200,117.344413];
    }
};


L.DomUtil.setTransformRotate = function(el, offset, scale, rotate){
  var pos = offset || new L.Point(0, 0);
  el.style[L.DomUtil.TRANSFORM] =
    (L.Browser.ie3d ?
      'translate(' + pos.x + 'px,' + pos.y + 'px)' :
      'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)') +
    (scale ? ' scale(' + scale + ')' : '') +
    (rotate ? ' rotate(' + rotate + ')' : '');
};
