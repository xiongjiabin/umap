var lmd = {
  POS_LEFT: 1,
  POS_RIGHT: 2,
  POS_MIDDLE: 3,
  POS_BOTH: 4,

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
  },

  getLmdZoom: function(map){
    if(!map) return 1
    var zoom,scaleZoom
    var ZOOMS = { 16:0.6, 17:0.8, 18: 1}
    zoom = map.getZoom()
    if(zoom < 16){
      scaleZoom = map.getZoomScale(zoom,16)
      scaleZoom = scaleZoom > 1? 1: scaleZoom
    }else{
      scaleZoom = ZOOMS[zoom]
    }
    return scaleZoom
  },

  //change
  /*        [1, L._('left')],
          [2, L._('right')],
          [3, L._('middle')]
  to [1]=L.left,[2]=l.right
  */
  getOptionsToMap: function( options ){
      var results = []
      if(!options) return results
      var i = 0, len = options.length
      for(; i < len; i++){
        if(options[i]) {
          results[options[i][0]] = options[i][1]
        }
      }
      return results
  },

};

L.Storage.Map.include({

  _SUBNO_BUFFER: [null],//需要清空在删除lay的清空下,存在一个bug,xiongjiabin
  getAnchorLatLngBySubNo: function( subNo ) {
    var i = 0, j = 0, len = 0, len1 = 0, subHelp = null
    var scaleSubNo = parseFloat(subNo) * 10

    if (this._SUBNO_BUFFER[scaleSubNo]) {
      return this._SUBNO_BUFFER[scaleSubNo]
    }
    var floorOldSubNo = floorSubNo = Math.floor( scaleSubNo )
    var ceilOldSubNo = ceilSubNo  = Math.ceil( scaleSubNo )
    var floorData = null
    var ceilData = null
    var floorOldData = null
    var result = {}

    if(floorSubNo === ceilSubNo) {
      floorSubNo = floorSubNo - 1
      ceilSubNo = ceilSubNo + 1
    }

    for (i = 0, len = this.datalayers_index.length; i < len; i++) {
      var subHelpData = this.datalayers_index[i].options &&
                        this.datalayers_index[i].options.subHelpData
      if(!subHelpData) continue
      for(j = 0, len1 = subHelpData.length; j < len1; j++) {
        subHelp = subHelpData[j]
        //得一段路必须在一个完整的地方，交叉的情况暂时不考虑
        if(floorSubNo >= subHelp.min && floorSubNo <= subHelp.max) {
          floorData  = [subHelp['data'][floorSubNo][1],subHelp['data'][floorSubNo][0]]

          if(ceilSubNo >= subHelp.min && ceilSubNo <= subHelp.max) {
            ceilData  = [subHelp['data'][ceilSubNo][1],subHelp['data'][ceilSubNo][0]]
          }

          if(floorOldSubNo >= subHelp.min && floorOldSubNo <= subHelp.max) {
            floorOldData  = [subHelp['data'][floorOldSubNo][1],subHelp['data'][floorOldSubNo][0]]
          }
        }

        if(floorData && ceilData) {
            break
        }else{
            floorData = ceilData = null
        }
      }

      if(floorData && ceilData){
          break //退出，并且知道属于哪一个layer
      }
    }

    if(floorData && ceilData) {
       if(floorOldSubNo === ceilOldSubNo) {
         result['point'] = floorOldData
       }

       //采用新的turf算法解决有弯曲的时候寻找到的点可能不在线上的问题
       //从layer中找到这条线，然后使用long函数去沿着线去寻找这个点
       var floorPoint = turf.point([floorData[1],floorData[0]])
       var ceilPoint  = turf.point([ceilData[1],ceilData[0]])
       var feature = null
       var layer = this.datalayers_index[i]
       var factor = 0, along = null,lineGeojson,sliced
       for (var k = 0; k < layer._index.length; k++) {
           feature = layer._layers[layer._index[k]];

           if(feature.properties &&
              feature.properties._storage_options &&
              feature.properties._storage_options['road']){
               //如果是条路的话
               lineGeojson = feature.toGeoJSON()
               sliced = turf.lineSlice(floorPoint,ceilPoint,lineGeojson)
               if(sliced){
                 var temp = turf.point(sliced.geometry.coordinates[0])
                 if((turf.distance(temp,floorPoint) * 1000) > 5){
                     sliced.geometry.coordinates.reverse()
                 }
               }


               if(result['point']) {
                   factor = turf.distance(floorPoint,ceilPoint) * 5 // *1000 / 200
               }else{
                   factor = turf.distance(floorPoint,ceilPoint) * 10 // * 1000 / 100
                   //实际的距离可能不是100米，俩个桩号之间，所以要生成一个factor
                   along = turf.along(sliced, (scaleSubNo - floorSubNo )/10 * factor )
                   if(along) {
                       temp = along.geometry.coordinates
                       result['point'] = [temp[1],temp[0]]
                   }
               }

               var m1 = 0
               if(((scaleSubNo - floorSubNo )/10 - 0.002) > 0){
                   m1 = turf.along(sliced, ((scaleSubNo - floorSubNo )/10 - 0.002) * factor)
               }else{
                   m1 = turf.along(sliced, 0)
               }
               var a1 = turf.along(sliced, ((scaleSubNo - floorSubNo )/10 + 0.002) * factor)
               var right = Math.round((360 + turf.bearing(m1,a1)) % 360)
               var left  = Math.round((360 + turf.bearing(a1,m1)) % 360)
               //console.log('m1-a1:right:' + right )
               //console.log('a1-m1:left :' + left )

               result['left'] = left
               result['right'] = right

               this._SUBNO_BUFFER[scaleSubNo] = result
               return this._SUBNO_BUFFER[scaleSubNo]
            }
        }
    }

    //console.log('no found this sub ' + subNo)
    return null
  },

  getLineBetweenSubNos: function( beginSubNo, endSubNo ) {
    var i = 0, j = 0, len = 0, len1 = 0, subHelp = null
    var beginScaleSubNo = parseFloat(beginSubNo) * 10
    var endScaleSubNo = parseFloat(endSubNo) * 10
    var beginPoint = null, endPoint = null
    var beginData = null, endData = null

    beginData = this.getAnchorLatLngBySubNo(beginSubNo)
    if(!beginData || !beginData['point']) return null
    beginPoint = beginData['point']
    endData = this.getAnchorLatLngBySubNo(endSubNo)
    if(!endData || !endData['point']) return null
    endPoint = endData['point']

    var beginFloorSubNo = Math.floor( beginScaleSubNo )
    var beginCeilSubNo  = Math.ceil( beginScaleSubNo )
    var endFloorSubNo = Math.floor( endScaleSubNo )
    var endCeilSubNo  = Math.ceil( endScaleSubNo )
    var floorSubNo = beginFloorSubNo < endFloorSubNo ? beginFloorSubNo : endFloorSubNo
    var ceilSubNo  = beginCeilSubNo  < endCeilSubNo  ? endCeilSubNo    : beginCeilSubNo

    var found = false
    for (i = 0, len = this.datalayers_index.length; i < len; i++) {
      var subHelpData = this.datalayers_index[i].options &&
                        this.datalayers_index[i].options.subHelpData
      if(!subHelpData) continue
      for(j = 0, len1 = subHelpData.length; j < len1; j++) {
        subHelp = subHelpData[j]
        //得一段路必须在一个完整的地方，交叉的情况暂时不考虑
        if(floorSubNo >= subHelp.min && floorSubNo <= subHelp.max) {
          if(ceilSubNo >= subHelp.min && ceilSubNo <= subHelp.max) {
              found  = true
          }
        }
        if( found ) break
      }
      if( found ) break //退出，并且知道属于哪一个layer
    }

    if( found ) {
       var beginPointGeojson = turf.point([beginPoint[1],beginPoint[0]])
       var endPointGeojson   = turf.point([endPoint[1],endPoint[0]])
       var feature = null
       var layer = this.datalayers_index[i]
       var lineGeojson,sliced,  k = 0
       for ( len1 = layer._index.length; k < len1; k++) {
           feature = layer._layers[layer._index[k]];
           if(feature.properties &&
              feature.properties._storage_options &&
              feature.properties._storage_options['road']){
               //如果是条路的话
               lineGeojson = feature.toGeoJSON()
               sliced = turf.lineSlice(beginPointGeojson,endPointGeojson,lineGeojson)
               if( sliced ){
                 var temp = turf.point(sliced.geometry.coordinates[0])
                 if((turf.distance(temp,beginPointGeojson) * 1000) > 5){
                   sliced.geometry.coordinates.reverse()
                 }

                 //感觉turf.lineslice有一个bug，会在开始或者结束有一个重复的坐标,somttimes
                 var temp1 = null, temp2 = null
                 var newCoordinates = []
                 for(j = 0; j < sliced.geometry.coordinates.length; j++){
                     temp2 = sliced.geometry.coordinates[j]
                     if(!temp1 ){
                         newCoordinates.push(L.latLng([temp2[1],temp2[0],temp2[2] || 0]))
                     }else{
                         if(temp1[0] === temp2[0] && temp1[1] === temp2[1] && temp1[2] === temp2[2]){

                         }else{
                            newCoordinates.push(L.latLng([temp2[1],temp2[0],temp2[2] || 0]))
                         }
                     }
                    temp1 = temp2
                 }

                 return newCoordinates
               }
            }
        }
    }

    console.log('no found this line ' + beginSubNo + ':' + endSubNo )
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
    if(result) result[2] = result[2]/10
    return result
  },

  getLatLngsInBounds: function(){
    var bounds = this.getBounds()
    var i = 0,len = this.datalayers_index.length;
    var j, len1, k, len2;
    var latlng = null
    var result = []
    var duplicate = []
    var subHelpData = []
    for (; i < len; i++) {
      //如果这个图层影藏的话，不需要继续处理
      //fixed bug http://lamudatech.com:3000/xiongjiabin/umap/issues/8
      if(!this.datalayers_index[i].isVisible()){
        continue
      }
      subHelpData = this.datalayers_index[i].options &&
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
    step = step || 1
    for(i = 1; i < MAX_SHOWED - 1; i++){
      markerShowIndex[i] = step * i
    }
    if(results.length > 1) markerShowIndex.push(results.length - 1)

    var myIcon = L.divIcon({className: 'storage-circle-icon'});
    for(i = 0; i < markerShowIndex.length ; i++){
      index = markerShowIndex[i]
      if(!results[index]) continue
       temp = L.marker([results[index][0],results[index][1]],{
          title: results[index][2],
          interactive: false,
          icon: myIcon
      }).bindTooltip(results[index][2]/10 + '',{className:'padding1', permanent:true}).addTo(this)
      //xiongjiabin  添加permanent：true，让其不去监听preclick事件，不去发生变化当点击等事件的时候
      temp.openTooltip()
      this._MARKER_SHOW.push(temp)
    }
    //console.log(results)
    //console.log(markerShowIndex)
    results = null
    //console.timeEnd('showmarker')
  },

  createDefaultLayer: function(names){

    if(!Array.isArray(names)) return 0;

    var oldNames = {};
    this.eachDataLayer(function (datalayer) {
      oldNames[datalayer.getName()] = 1;
    });

    var count = 0;
    for(var i = 0, len = names.length; i < len; i++){
      if(oldNames[names[i]]){
        continue;
      }
      this.createDataLayer({name: names[i]});
      count++;
    }
    return count;
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
