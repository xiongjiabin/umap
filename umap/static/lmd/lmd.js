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

        /*L.control.coordinates({
			position:"bottomright",
			useDMS:true,
			labelTemplateLat:"N {y}",
			labelTemplateLng:"E {x}",
			useLatLngOrder:true
		}).addTo(map);*/
    }
};
