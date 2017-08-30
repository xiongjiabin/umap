var MM_PER_PIX = 4961 / 420 //* (window.devicePixelRatio || 1),
 var lmd = {
  POS_LEFT: 1,
  POS_RIGHT: 2,
  POS_MIDDLE: 3,
  POS_BOTH: 4,
  POS_MIDDLE_LEFT: 5, //中分左
  POS_MIDDLE_RIGHT: 6, //中分右
  MIN_VALID_TWO_SUBS: 10,
  DEFAULT_ROAD_LINE: 0.5 * MM_PER_PIX,
  DEFAULT_ROAD_COLOR: '#00EEEE',
  DEFAULT_FACILITY_LINE: 1 * MM_PER_PIX,
  DEFAULT_NOTE_LINE: 0.1 * MM_PER_PIX,
  DEFAULT_PILLAR_HEIGHT: 6 * MM_PER_PIX,
  DEFAULT_MARKER_WIDTH: 7.5 * MM_PER_PIX,
  DEFAULT_MARKER_FONT_HEIGHT: 3 * MM_PER_PIX,
  DEFAULT_KSUB_HEIGHT: Math.round(6 * MM_PER_PIX),
  DEFAULT_SUB_FONT: 3 * MM_PER_PIX,
  DEFAULT_SUB_HEIGHT: Math.round(2.5 * MM_PER_PIX),

  DEFAULT_OFFSET: 80,

  _map: null,
  init: function(map) {

    if(map.options && map.options.noControl) return;
    //init the latlng show events
    L.control.coordinates({
      position: "bottomleft",
      decimals: 4,
      decimalSeperator: ".",
      labelTemplateLat: "纬:{y}",
      labelTemplateLng: "经:{x}",
      labelTemplateSub: "桩号:{subno}"
    }).addTo(map);

    lmd._map = map
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
    }else if(zoom > 18){
      scaleZoom = map.getZoomScale(zoom,18)
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

  getRotateLeftRight: function( lr , defaultPos){
      lr = +lr;
      var pos = defaultPos || 'right';
      if(pos == 'right') {
          if(lr === lmd.POS_LEFT || lr === lmd.POS_MIDDLE_LEFT){
              pos = 'left';
          }
      }else{
          if(lr === lmd.POS_RIGHT || lr === lmd.POS_MIDDLE_RIGHT){
              pos = 'right';
          }
      }
      return pos;
  },

  eachFeature(callback){
      if(!lmd._map) {
          console.log('map is empty')
          return
      }
      if(!callback) {
          return
      }
      lmd._map.eachLayerFeature(function (feature) {
          callback(feature)
      })
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
    var floorSubNo, ceilSubNo
    var floorOldSubNo = floorSubNo = Math.floor( scaleSubNo )
    var ceilOldSubNo = ceilSubNo  = Math.ceil( scaleSubNo )
    var floorData = null
    var ceilData = null
    var floorOldData = null
    var result = {}
    var subHelpData

    if(floorSubNo === ceilSubNo) {
      floorSubNo = floorSubNo - 1
      ceilSubNo = ceilSubNo + 1
      if(floorSubNo < 0) {
          floorSubNo = 0;
      }
    }

    for (i = 0, len = this.datalayers_index.length; i < len; i++) {
      subHelpData = this.datalayers_index[i].options &&
                        this.datalayers_index[i].options.subHelpData
      if(!subHelpData) continue
      for(j = 0, len1 = subHelpData.length; j < len1; j++) {
        subHelp = subHelpData[j]
        //得一段路必须在一个完整的地方，交叉的情况暂时不考虑
        if(scaleSubNo >= subHelp.min && scaleSubNo <= subHelp.max) {
            if(floorSubNo < subHelp.min) floorSubNo = subHelp.min;
            if(ceilSubNo  > subHelp.max) ceilSubNo  = subHelp.max;

            floorData  = subHelp['data'][floorSubNo] &&
                       [subHelp['data'][floorSubNo][1],subHelp['data'][floorSubNo][0]]

            if(ceilSubNo >= subHelp.min && ceilSubNo <= subHelp.max) {
                ceilData  = subHelp['data'][ceilSubNo] &&
                        [subHelp['data'][ceilSubNo][1],subHelp['data'][ceilSubNo][0]]
            }

            if(floorOldSubNo >= subHelp.min && floorOldSubNo <= subHelp.max) {
                floorOldData  = subHelp['data'][floorOldSubNo] &&
                            [subHelp['data'][floorOldSubNo][1],subHelp['data'][floorOldSubNo][0]]
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
       var temp = 0
       for (var k = 0; k < layer._index.length; k++) {
           feature = layer._layers[layer._index[k]]
           if(feature.properties && feature.properties._storage_options) {
               if(!feature.properties._storage_options['road']){
                   if(!feature.properties['className']){ //寻找没有设置是路，但是公里数比较比较高的
                       lineGeojson = feature.toGeoJSON()
                       if(!lineGeojson || lineGeojson.type === 'Point' || lineGeojson.type === 'MultiPoint'){
                            continue;
                       }
                       try{
                         temp = turf.lineDistance(lineGeojson)
                       }catch (e){
                         continue;
                       }
                       if(temp >= 3){ //if 3公里以上的，默认为路
                           console.log('公里数为' + temp + '公里,默认为路')
                       }else{
                           continue
                       }
                   }else{
                       continue
                   }
               }else{
                   //如果是条路的话
                   lineGeojson = feature.toGeoJSON();
               }

               //解决一个bug的问题，当这个line是multiline的时候，turf的方式不管用，得转化成一个一个lineString xiongjaibin 2017-05-11
               var lineGeos = [];
               if(lineGeojson.geometry.type === 'MultiLineString'){
                   for(i = 0; i < lineGeojson.geometry.coordinates.length; i++){
                       lineGeos.push(turf.lineString(lineGeojson.geometry.coordinates[i]));
                   }
               }else{
                   lineGeos.push(lineGeojson);
               }

               for(i = 0; i < lineGeos.length; i++) {
                   var tempLineGeoJson = lineGeos[i]

                   try{
                   sliced = turf.lineSlice(floorPoint,ceilPoint,tempLineGeoJson)
                   if(sliced){
                       var lineDist = 1000 * turf.lineDistance(sliced)
                       if(!lineDist || lineDist <= lmd.MIN_VALID_TWO_SUBS) { //本来求的是一段桩号之间的距离100m，如果小于50米，认为这个不是这段线里面的
                           console.log("距离不满足，继续找下一个:" + lineDist)
                           continue; //继续寻找下一个
                       }
                       //lineSlice有一个bug，他是去找俩个点在另外一条路上的最近的俩个点的line，就有可能偷到别人的线上去
                       //when first coordinate is far away from the floorPoint,then the line is not the line
                       temp = turf.point(sliced.geometry.coordinates[0])
                       if((turf.distance(temp,floorPoint) * 1000) > 5){
                           //sliced.geometry.coordinates.reverse()
                           contniue;
                       }
                   }else {
                       continue;
                   }

                   if(result['point'] && ((ceilSubNo - floorSubNo) > 1 )) {
                       factor = lineDist  / 200
                   }else{
                       factor = lineDist  / 100
                       if(!result['point']){
                           //实际的距离可能不是100米，俩个桩号之间，所以要生成一个factor
                           along = turf.along(sliced, (scaleSubNo - floorSubNo )/10 * factor )
                           if(along) {
                               temp = along.geometry.coordinates
                               result['point'] = [temp[1],temp[0]]
                           }
                       }else{
                           /*L.geoJSON(sliced, {
                               style: function (feature) {
                                   return {color: 'yellow', weight:20};
                               }
                           }).addTo(this);*/
                       }
                   }

                   var m1 = 0
                   temp = (scaleSubNo - floorSubNo )/10;
                   if((temp - 0.002) > 0){
                       m1 = turf.along(sliced, (temp - 0.002) * factor)
                   }else{
                       m1 = turf.along(sliced, 0)
                   }
                   var a1 = turf.along(sliced, (temp + 0.002) * factor)
                   var right = Math.round((360 + turf.bearing(m1,a1)) % 360)
                   var left  = Math.round((360 + turf.bearing(a1,m1)) % 360)
                   }catch(e){
                       console.log('是不是有断头路');
                       continue;
                   }
                   //console.log('m1-a1:right:' + right )
                   //console.log('a1-m1:left :' + left )

                   result['left'] = left
                   result['right'] = right
                   result['line'] = tempLineGeoJson

                   this._SUBNO_BUFFER[scaleSubNo] = result
                   return this._SUBNO_BUFFER[scaleSubNo]
                }
            }
        }
    }

    //console.log('no found this sub ' + subNo)
    return null
  },

  getLineBetweenSubNos: function( beginSubNo, endSubNo) {
      var i = 0, j = 0, sliced,temp
      var beginPoint = null, endPoint = null,beginPointGeojson
      var beginData = null, endData = null,endPointGeojson

      beginData = this.getAnchorLatLngBySubNo(beginSubNo)
      if(!beginData || !beginData['point']) return null
      beginPoint = beginData['point']
      endData = this.getAnchorLatLngBySubNo(endSubNo)
      if(!endData || !endData['point']) return null
      endPoint = endData['point']

      //用开始的那个点所在的线
      var tempLineGeoJson = beginData['line']

      try{
          beginPointGeojson = turf.point([beginPoint[1],beginPoint[0]])
          endPointGeojson   = turf.point([endPoint[1],endPoint[0]])

         sliced = turf.lineSlice(beginPointGeojson,endPointGeojson,tempLineGeoJson)
         if( sliced ){
            temp = 1000 * turf.lineDistance(sliced)
             if(!temp || temp < 1) { //这个地方不是一段100米的桩号，是查找的桩号之间的距离，不可能小于1米，小于1米，说明没有找到
                 console.log("距离不满足，继续找下一个:" + temp)
                 return null //继续寻找下一个
             }
             temp = turf.point(sliced.geometry.coordinates[0])
             //if((turf.distance(temp,beginPointGeojson) * 1000) > 5){
             //   sliced.geometry.coordinates.reverse()
             //}

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
      }catch(e){
          return null
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
        subHelpData = this.datalayers_index[i].options && this.datalayers_index[i].options.subHelpData
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
        subHelpData = this.datalayers_index[i].options && this.datalayers_index[i].options.subHelpData
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
    var subHelp
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
    var MAX_SHOWED = 40
    var results = this.getLatLngsInBounds()
    var temp = null,index = 0
    var i = 0, step = Math.floor((results.length ) / (MAX_SHOWED ))
    var markerShowIndex = []
    if(results.length > 0) markerShowIndex.push(0)
    step = step || 1
    for(i = 1; i < MAX_SHOWED - 1; i++){
      markerShowIndex[i] = step * i
    }
    if(results.length > 1) markerShowIndex.push(results.length - 1)

    for(i = 0; i < markerShowIndex.length ; i++) {
        index = markerShowIndex[i]
        if(!results[index]) continue
        if(this._MARKER_SHOW[results[index][2]]) continue
        this.createSubMarker(results[index]);
        this._MARKER_SHOW[results[index][2]] = 1;
    }
  },

  createSubMarker: function( result  ) {
      var latlng = [result[0],result[1]];
      var sn = +result[2];
      var k = sn / 10;
      var sk = sn % 10;
      var formatText = '<path stroke-width="2px" stroke-opacity="1" stroke="white" fill="none" d="m 0,0 -' + lmd.DEFAULT_SUB_HEIGHT +
                       ',0 ' + lmd.DEFAULT_SUB_HEIGHT * 2 + ',0"></path>' +
                       '<text x="' + (lmd.DEFAULT_SUB_HEIGHT + 20) + '" y="-6" class="subm">' + sk + '</text>';
      if(sk === 0) {
          var trikyNumber = ((k + '').length + 1) * -10;
          formatText = '<path stroke-width="4px" stroke-opacity="1" stroke="white" fill="none" d="m 0,0 -' + lmd.DEFAULT_KSUB_HEIGHT +
                       ',0 ' + lmd.DEFAULT_KSUB_HEIGHT * 2 + ',0"></path>' +
                       '<text x="' + (lmd.DEFAULT_KSUB_HEIGHT + 20) + '" y="' + trikyNumber + '" style="letter-spacing:2px" class="subkm">K' + k + '</text>';
      }

      var options = {
        rotate: 0,
        color: 'white',
        scale: 10,//* lmd.getLmdZoom(this),
        svgText: formatText,
        interactive: false,
      };


      var data = this.getAnchorLatLngBySubNo(sn / 10);
      if(data) {
          options['rotate'] = data['left'];
      }

      return new L.SVGObject(latlng, options).addTo(this);
  },

  createDefaultLayer: function(names){
    names = names || this.defaultLayerNames;
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

  defaultLayerNames : ['标志','标线','防护设施','警示诱导','交叉口','清除危险物', '打印框', '文字', '底图', '其他'],
  getFacilityDefaultLayer: function( classAlias ){
      var aliasToLayerNames = {
          'lmdMarker': 0, //标志
          'lmdPillar': 0, //立柱
          'tqlb': 1, //突起路标
          'biaoxian':1, //横向减速标线
          'zxbx': 1,//纵向减速标线
          'rxhdx': 1, //人行横道县
          'cxd': 1, //车行道边缘线
          'cxdfjx': 1, //车行道分界线
          'bxzxxd': 1, //中心线单
          'bxzxxs': 1, //中心线双
          'lmbj': 1, //立面标记
          'guardbar': 2, //防护
          'lunkuo': 3, //轮廓
          'lure': 3, //警佑
          'linelure': 3,//横向线性导向
          'zlinelure': 3, //纵向线性诱导
          'hsd':3,//黄闪灯
          'hlbsd': 3,//红黄爆闪灯
          'jck': 4, //交叉口
          'lmdArea': 5, //清除障碍物
          'prect': 6, //打印框
          'lmdLabel': 7, //文字
      }
      var index = aliasToLayerNames[classAlias];
      if(index === undefined) {
          index = this.defaultLayerNames.length - 1;
      }
      var layerName = this.defaultLayerNames[index];
      if(!layerName) return null;
      var nameToLayer = [];
      this.eachDataLayer(function (datalayer) {
          nameToLayer[datalayer.getName()] = datalayer;
      });

      return nameToLayer[layerName];
  },

  getSubAngle: function(begin, end){
     var beginLatLng = this.getAnchorLatLngBySubNo(begin);
     if(!beginLatLng) return 0;
     var endLatLng = this.getAnchorLatLngBySubNo(end);
     if(!endLatLng) return 0;
     var beginPoint = turf.point([beginLatLng['point'][1],beginLatLng['point'][0]]);
     var endPoint  = turf.point([endLatLng['point'][1],endLatLng['point'][0]]);

     //有关bearing的意思，详见 http://www.icsm.gov.au/mapping/web_images/figure_magnetic_bearing.jpg
     var angle  = Math.round(turf.bearing(beginPoint,endPoint));
     if(angle < 0){
       angle = 360 + angle;
     }
     return angle;
  }
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

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};
