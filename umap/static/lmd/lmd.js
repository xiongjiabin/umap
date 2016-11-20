var lmd = {
  init: function(map) {

    //init the latlng show events
    L.control.coordinates({
      position: "bottomleft",
      decimals: 6,
      decimalSeperator: ".",
      labelTemplateLat: "纬度: {y}",
      labelTemplateLng: "经度: {x}"
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
    var newSubNo = Math.round(parseFloat(subNo) * 10)
    if (this._SUBNO_BUFFER[newSubNo]) {
      return this._SUBNO_BUFFER[newSubNo]
    }

    for (i = 0, len = this.datalayers_index.length; i < len; i++) {
      var subHelpData = this.datalayers_index[i].options &&
                        this.datalayers_index[i].options.subHelpData
      if(!subHelpData) continue
      for(j = 0, len1 = subHelpData.length; j < len1; j++){
        subHelp = subHelpData[j]
        if(newSubNo >= subHelp.min && newSubNo <= subHelp.max){
          this._SUBNO_BUFFER[newSubNo]  = [subHelp['data'][newSubNo][1],subHelp['data'][newSubNo][0]]
          return this._SUBNO_BUFFER[newSubNo]
        }
      }
    }

    console.log('no found this sub ' + subNo)
    return null
  },

  latLngBetween : function(latlng, leftLatLng, rightLatLng){
    var bounds = L.latLngBounds(leftLatLng,rightLatLng)
    if (bounds.isValid() ){
      return bounds.contains(latlng)
    }
    return false
  },

  findSubNoInSubHelp : function(latlng, subLatLngs, subHelpNo ){
    var RANGE = 10
    var beginFind = (subHelpNo - RANGE) >= 0 ? (subHelpNo - RANGE): 0
    var ii = beginFind, len1 = subLatLngs.length
    var leftLatLng = null,rightLatLng = null
    var nextIndex = 0
    var bFound = false
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
          if(bFound) break
        }
        ii = nextIndex
      }else{
        ii++
      }
      if(ii >= len1) ii = 0
      if(ii === beginFind ) break
    }

    if(bFound){
      return [ii, nextIndex]
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
          result = this.findSubNoInSubHelp(latlng, subHelpData[j]['data'], helpSubNo)
          if(result) break
        }
      }
    }

    if(result){
      this.HELP_SUBNO = result[1]
    }
    return result
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
