var lmd = {
  init: function(map) {

    //init the latlng show events
    L.control.coordinates({
      position: "bottomleft",
      decimals: 4,
      decimalSeperator: ".",
      labelTemplateLat: "纬:{y}",
      labelTemplateLng: "经:{x}",
      labelTemplateSub: "桩号:{subno}"
    }).addTo(map);
  },

  bench: function(that, fun1, count){
    console.time('test')
    for(var i = 0; i < count; i++){
      fun1(that)
    }
    console.timeEnd('test')
  }
};

L.Storage.Map.include({

  _SUBNO_BUFFER: [null],//需要清空在删除lay的清空下,存在一个bug,xiongjiabin
  getAnchorLatLngBySubNo: function( subNo ) {
    var i = 0, j = 0, len = 0, len1 = 0, subHelp = null
    var scaleSubNo = parseFloat(subNo) * 10

    if (this._SUBNO_BUFFER[scaleSubNo]) {
      return this._SUBNO_BUFFER[scaleSubNo]
    }
    var floorSubNo = Math.floor( scaleSubNo )
    var ceilSubNo  = Math.ceil( scaleSubNo )
    var floorData = null
    var ceilData = null

    for (i = 0, len = this.datalayers_index.length; i < len; i++) {
      var subHelpData = this.datalayers_index[i].options &&
                        this.datalayers_index[i].options.subHelpData
      if(!subHelpData) continue
      for(j = 0, len1 = subHelpData.length; j < len1; j++){
        subHelp = subHelpData[j]
        if(floorSubNo >= subHelp.min && floorSubNo <= subHelp.max){
          floorData  = [subHelp['data'][floorSubNo][1],subHelp['data'][floorSubNo][0]]
        }
        if(ceilSubNo >= subHelp.min && ceilSubNo <= subHelp.max){
          ceilData  = [subHelp['data'][ceilSubNo][1],subHelp['data'][ceilSubNo][0]]
        }
      }
    }

    if(floorData && ceilData){
       if(floorSubNo === ceilSubNo) {
         this._SUBNO_BUFFER[scaleSubNo] = floorData
         return this._SUBNO_BUFFER[scaleSubNo]
       }
       //就平均值
       var diff1 = scaleSubNo - floorSubNo
       var diff2 = ceilSubNo - scaleSubNo
       var lat, lng, ratio
       if(diff1 < diff2){
         ratio = diff1 / (ceilSubNo - floorSubNo )
         lat = floorData[0] + (ceilData[0] - floorData[0]) * ratio
         lng = floorData[1] + (ceilData[1] - floorData[1]) * ratio
       }else{
         ratio = diff2 / (ceilSubNo - floorSubNo )
         lat = ceilData[0] - (ceilData[0] - floorData[0]) * ratio
         lng = ceilData[1] - (ceilData[1] - floorData[1]) * ratio
       }
       this._SUBNO_BUFFER[scaleSubNo] = [lat,lng]
       return this._SUBNO_BUFFER[scaleSubNo]
    }

    console.log('no found this sub ' + subNo)
    return null
  },

  latLngBetween : function(latlng, leftLatLng, rightLatLng){
    var bounds = L.latLngBounds(leftLatLng,rightLatLng)
    var found = false
    var leftDistance = 0, rightDistance = 0, ratio = 0
    if (bounds.isValid() ){
      found = bounds.contains(latlng)
      if(found){
        leftDistance = latlng.distanceTo(leftLatLng)
        rightDistance = latlng.distanceTo(rightLatLng)
        if(leftDistance <= rightDistance){
          ratio = leftDistance / (leftDistance + rightDistance)
          return [1, ratio]
        } else {
          ratio = rightDistance / (leftDistance + rightDistance)
          return [0, ratio]
        }
      }
    }
    return false
  },

  findSubNoInSubHelp : function(latlng, subLatLngs, subHelpNo ){
    var RANGE = 10
    var beginFind = (subHelpNo - RANGE) >= 0 ? (subHelpNo - RANGE): 0
    if(beginFind >= subLatLngs.length){
      beginFind = 0
    }
    var ii = beginFind, len1 = subLatLngs.length
    var leftLatLng = null,rightLatLng = null
    var nextIndex = 0
    var bFound = false
    var newSubNo = 0
    var safeCount = 0

    if( !Array.isArray(subLatLngs) ) return null
    for(;; ){
      if(subLatLngs[ii]){
        nextIndex = ii + 1
        while(1){
          if(nextIndex >= len1) break
          if(!subLatLngs[nextIndex]) {
            nextIndex++
          }else{
            break
          }
        }
        if(subLatLngs[nextIndex]){
          leftLatLng = L.latLng(subLatLngs[ii][0],subLatLngs[ii][1])
          rightLatLng = L.latLng(subLatLngs[nextIndex][0],subLatLngs[nextIndex][1])
          bFound = this.latLngBetween(latlng,leftLatLng,rightLatLng)
          if(bFound) {
            if(bFound[0]){
              newSubNo = ii + bFound[1] * (nextIndex - ii) //using left
            }else{
              newSubNo = nextIndex - bFound[1] * (nextIndex - ii)
            }
            break
          }
        }
        ii = nextIndex
      }else{
        ii++
      }
      if(ii >= len1) ii = 0
      if(ii === beginFind ) break
      if(safeCount++ > len1) break
    }

    if(bFound){
      return [ii, nextIndex,newSubNo]
    }
    return null
  },

  HELP_SUBNO: 0,
  getSubNoByLatLng: function(latlng,helpSubNo){

    var i = 0,j = 0,len = 0,subHelpData = null,subHelp = null
    var validSubHelp = null,validI = -1, validJ = -1
    var result = null

    helpSubNo = helpSubNo || this.HELP_SUBNO
    if(helpSubNo > 0){
      for (i = 0; i < this.datalayers_index.length && !validSubHelp; i++) {
        var subHelpData = this.datalayers_index[i].options && this.datalayers_index[i].options.subHelpData
        if(!subHelpData) continue
        for(j = 0,len = subHelpData.length; j < len; j++){
          subHelp = subHelpData[j]
          if(helpSubNo >= subHelp.min && helpSubNo <= subHelp.max){
            //找到对应的辅助帮助的layer
            validSubHelp = subHelp
            validI = i
            validJ = j
            break
          }
        }
      }
    }

    latlng = L.latLng(latlng[0],latlng[1])
    //find the relative
    if(validSubHelp){
      result = this.findSubNoInSubHelp(latlng, validSubHelp['data'], helpSubNo)
    }
    //not found in the history, try to find all
    if(!result){
      for (i = 0; i < this.datalayers_index.length && !result; i++) {
        var subHelpData = this.datalayers_index[i].options && this.datalayers_index[i].options.subHelpData
        if(!subHelpData) continue
        for(j = 0,len = subHelpData.length; j < len; j++){
          if( i === validI && validJ === j){
            continue
          }
          result = this.findSubNoInSubHelp(latlng, subHelpData[j]['data'], 0)
          if(result) break
        }
      }
    }

    if(result){
      this.HELP_SUBNO = result[1]
    }
    return result
  },

  getLatLngsInBounds: function(){
    var bounds = this.getBounds()
    var i = 0,len = this.datalayers_index.length;
    var j, len1, k, len2;
    var latlng = null
    var result = []
    var duplicate = []
    for (; i < len; i++) {
      var subHelpData = this.datalayers_index[i].options &&
                        this.datalayers_index[i].options.subHelpData
      if(!subHelpData) continue
      for(j = 0,len1 = subHelpData.length; j < len1; j++){
        subHelp = subHelpData[j]
        for(k = subHelp.min, len2 = subHelp['data'].length; k < len2; k++){
          if(!subHelp['data'][k]) continue
          if(duplicate[k]) continue
          latlng = [subHelp['data'][k][1],subHelp['data'][k][0]]
          if(bounds.contains(latlng)){
            result.push([latlng[0],latlng[1],k])
            duplicate[k] = 1
          }
        }
      }
    }
    duplicate = []
    return result
  },

  _MARKER_SHOW: [],
  handleShowMarker: function(){
    var MAX_SHOWED = 10
    //console.time('showmarker')
    var results = this.getLatLngsInBounds()
    var temp = null,index = 0
    var i = 0, step = Math.floor((results.length ) / (MAX_SHOWED ))
    while(this._MARKER_SHOW.length > 0){
      this._MARKER_SHOW.pop().remove()
    }
    var markerShowIndex = []
    if(results.length > 0) markerShowIndex.push(0)
    if(results.length > 1) markerShowIndex.push(results.length - 1)
    step = step || 1
    for(i = 1; i < MAX_SHOWED - 1; i++){
      markerShowIndex[i] = step * i
    }

    var myIcon = L.divIcon({className: 'storage-circle-icon'});
    for(i = 0; i < markerShowIndex.length ; i++){
      index = markerShowIndex[i]
      if(!results[index]) continue
       temp = L.marker([results[index][0],results[index][1]],{
          title: results[index][2],
          interactive: false,
          icon: myIcon
      }).bindTooltip(results[index][2]/10 + '',{className:'padding1'}).addTo(this)
      temp.openTooltip()
      this._MARKER_SHOW.push(temp)
    }
    //console.log(results)
    //console.log(markerShowIndex)
    results = null
    //console.timeEnd('showmarker')
  },

})

L.DomUtil.setTransformRotate = function(el, offset, scale, rotate) {
  var pos = offset || new L.Point(0, 0);
  el.style[L.DomUtil.TRANSFORM] =
    (L.Browser.ie3d ?
      'translate(' + pos.x + 'px,' + pos.y + 'px)' :
      'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)') +
    (scale ? ' scale(' + scale + ')' : '') +
    (rotate ? ' rotate(' + rotate + ')' : '');
};
