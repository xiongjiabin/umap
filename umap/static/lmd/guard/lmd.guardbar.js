L.Storage.GB_NORMAL_LINE = 1
L.Storage.GB_RECT = 2
L.Storage.GB_VERTICAL_LINE = 3
L.Storage.GB_CIRCLE = 4
L.Storage.GB_CROSS = 5
L.Storage.GB_DOT = 6
L.Storage.GB_OTHER = 99

L.Storage.GB_TYPE_BIAOXIAN = 1 //标线也是逃兵，不符合这些原有的规则
L.Storage.GB_TYPE_HULAN = 2
L.Storage.GB_TYPE_LUNKUO = 3
L.Storage.GB_TYPE_FANGXUAN = 4
L.Storage.GB_TYPE_BAOCENGPUZHUANG = 5 // 后来改成 薄层铺装,原来的减速路面
L.Storage.GB_TYPE_JIANSUQIU = 6 //减速丘不符合这些规则，放在svgobject中实现 xiongjiabin 17_3_03
L.Storage.GB_TYPE_BIANGOU = 7
L.Storage.GB_TYPE_LURE = 8 //警用诱导设施，新增的，从护栏里面分拆开来
L.Storage.GB_TYPE_ISOLATION = 9 //隔离设施
L.Storage.GB_TYPE_LINELURE = 10 //线性诱导设施
L.Storage.GB_TYPE_FENDAOTI = 11 //分道体
L.Storage.GB_TYPE_ZXBX = 12 //纵向标线

L.Storage.OFFSET_PLUS = 20; //定义字和设施之间的关系

L.Storage.guardbarData = [
  null,
  {name: '标线',
   defaultData: {
     color: 'White',
     weight: 20,
     opacity: 1,
     gbm: '4'
   },
   childs: [
    {name:'横向标线',type: L.Storage.GB_RECT, defaultOptions: {}}, //一言难尽的修改
  ]},
  { name: '防护设施',
    defaultData:{
      gbc: "1", //默认示警墩
      weight:"10",
      color: "red",
    },
    childs: [
    null,
    {name:'波形梁钢护栏', type: L.Storage.GB_NORMAL_LINE},
    {name:'路基混凝土护栏', type: L.Storage.GB_NORMAL_LINE},
    {name:'强梁混凝土护栏',   type: L.Storage.GB_NORMAL_LINE},
    {name:'金属梁柱式护栏', type: L.Storage.GB_NORMAL_LINE},
    {name:'组合式护栏', type: L.Storage.GB_NORMAL_LINE},
    {name:'缆索护栏', type: L.Storage.GB_CIRCLE,defaultOptions:{weight:20}},
    {name:'波形梁钢护栏外展端头',type: L.Storage.GB_NORMAL_LINE},
    {name:'外展示警墩', type:L.Storage.GB_NORMAL_LINE},
    {name:'中央分隔带混凝土护栏',type: L.Storage.GB_NORMAL_LINE},
    /*{name:'示警墩', type: L.Storage.GB_RECT, show: false}, //这些事第一个版本的数据，为了保证兼容，放在这里可以显示出来
    {name:'示警桩', type: L.Storage.GB_CIRCLE, show: false},
    {name:'中间隔离', type: L.Storage.GB_NORMAL_LINE, show: false},
    {name:'机非隔离', type: L.Storage.GB_NORMAL_LINE, show: false},
    {name:'路宅分离', type: L.Storage.GB_NORMAL_LINE, show: false},
    {name:'连续示警墩', type: L.Storage.GB_RECT, show: false},
    {name:'防护墙', type: L.Storage.GB_NORMAL_LINE, show: false},*/
  ]},
  {name:'轮廓标',
   defaultData:{ color: "Yellow"},
   childs: [
    null,
    {name:'附着式轮廓标',type: L.Storage.GB_CROSS, defaultOptions:{lmdtype:'lmdtrian',weight:2,fill:true}},
    //一个上午的时间，不同的渲染样式，需要不通的fill 2017-5-23
    //{name:'附着式轮廓标',type: L.Storage.GB_CROSS, defaultOptions:{lmdtype:'lmdcross',weight:2,fill:false}},
    {name:'柱式轮廓标', type: L.Storage.GB_CROSS, defaultOptions:{lmdtype:'lmdtrian',weight:2,fill:true}},
  ]},
  {name: '防眩设施',
   defaultData:{ color: "White",lr: 3, offset: 0},//default middle
   posData: L.FormBuilder.LeftRightChoice.prototype.choicesM,
   childs: [
    null,
    {name:'防眩板', type: L.Storage.GB_NORMAL_LINE},
    {name:'防眩网',type: L.Storage.GB_NORMAL_LINE},
    {name:'植树', type: L.Storage.GB_NORMAL_LINE},
    {name:'其他',type: L.Storage.GB_NORMAL_LINE},
  ]},
  {name:'薄层铺装',
   defaultData:{ color: "white", dangerousType: "1"},
   posData: L.FormBuilder.LeftRightChoice.prototype.choicesLRBoth,
   childs: [
    null,
    {name:'薄层铺装(条状)',type: L.Storage.GB_VERTICAL_LINE},
    {name:'薄层铺装(块状)',type: L.Storage.GB_VERTICAL_LINE},
    {name:'薄层铺装(带状)',type: L.Storage.GB_VERTICAL_LINE},
  ]},
  {name:'减速丘',
   defaultData:{ color: "White"},
   posData: L.FormBuilder.LeftRightChoice.prototype.choicesLRBoth,
   childs: [
    null,
    {name:'大型减速丘',type: L.Storage.GB_VERTICAL_LINE},
    {name:'预制减速垄',type: L.Storage.GB_VERTICAL_LINE},
    {name:'预制断开式减速垄',type: L.Storage.GB_VERTICAL_LINE},
  ]},
  {name:'边沟',
    posData: L.FormBuilder.LeftRightChoice.prototype.choicesLRBoth,
    childs: [
    null,
    {name:'浅碟形边沟',type: L.Storage.GB_NORMAL_LINE},
    {name:'边沟加铺盖板',type: L.Storage.GB_NORMAL_LINE},
    {name:'矩形边沟',type: L.Storage.GB_NORMAL_LINE},
    {name:'梯形边沟',type: L.Storage.GB_NORMAL_LINE},
    {name:'掩埋式边沟',type: L.Storage.GB_NORMAL_LINE},
    {name:'其他',type: L.Storage.GB_NORMAL_LINE},
  ]},{
    name: '警诱',
    defaultData:{
      gbc: "1", //默认连续示警墩
      weight:"10",
      color: "red",
    },
    childs: [
    null,
    {name:'示警墩', type: L.Storage.GB_RECT},
    {name:'连续示警墩', type: L.Storage.GB_RECT},
    {name:'示警桩', type: L.Storage.GB_CIRCLE},
    {name:'其他警示设施', type: L.Storage.GB_NORMAL_LINE},
  ]}, {
    name: '隔离设施',
    defaultData:{
        gbc: "1", //默认
        weight:"10",
        color: "red",
    },
    childs: [
      null,
      {name:'移动护栏', type: L.Storage.GB_NORMAL_LINE},
      {name:'路宅分离', type: L.Storage.GB_NORMAL_LINE},
    ]},{
      name: '线性诱导设施',
      defaultData:{
          gbc: "1", //默认
          weight:"12",
          color: "white",
      },
      childs: [
        null,
        {name:'单柱式', type: L.Storage.GB_CROSS,defaultOptions:{lmdtype:'lmdcross',weight:4,fill:false,'color':"white"}},
        {name:'混凝土附着式', type: L.Storage.GB_CROSS,defaultOptions:{lmdtype:'lmdcross',weight:4,fill:false,'color':"white"}},
        {name:'波形梁钢护栏附着式', type: L.Storage.GB_CROSS,defaultOptions:{lmdtype:'lmdcross',weight:4,fill:false,'color':"white"}},
      ]},{
      name: '分道体',
      posData: L.FormBuilder.LeftRightChoice.prototype.choicesM,
      defaultData:{
          gbc: "1",
          weight:"10",
          color: "red",
          lr:lmd.POS_MIDDLE
      },
      childs: [
          null,
          {name:'柱式分道体', type: L.Storage.GB_CIRCLE},
          {name:'片式分道体', type: L.Storage.GB_CIRCLE},
      ]},
      {name: '纵向标线',
       defaultData: {
         color: 'White',
         weight: 5,
         opacity: 1,
         gbm: '4'
       },
       childs: [
        {name:'纵向标线',type: L.Storage.GB_DOT, defaultOptions: {}}, //一言难尽的修改
      ]},
];

L.Storage.getGBOptions = function(gbt){
  gbt = gbt || 0;
  if(gbt <= 0 || gbt >= L.Storage.guardbarData.length){
    return []
  }
  var temp = L.Storage.guardbarData[gbt]
  var result = [], child = null
  for(var i = 0, len = temp['childs'].length; i < len; i++){
      child = temp['childs'][i]
      if(child){
          result.push( [ "" + i, child.name] )
      }
  }
  return result
};

L.Storage.getGBClass = function(gbt, gbc){
  gbt = gbt || 0;
  if(gbt <= 0 || gbt >= L.Storage.guardbarData.length){
    return []
  }
  var temp = L.Storage.guardbarData[gbt]
  gbc = (+gbc) || 0
  return temp && temp['childs'][gbc]
}

L.Storage.getGBDefaultData = function(gbt){
  gbt = gbt || 0;
  if(gbt <= 0 || gbt >= L.Storage.guardbarData.length){
    return {}
  }
  var temp = L.Storage.guardbarData[gbt]
  return temp && temp['defaultData']
}

L.Storage.getGBPosData = function(gbt){
  gbt = gbt || 0;
  if(gbt <= 0 || gbt >= L.Storage.guardbarData.length){
    return {}
  }
  var temp = L.Storage.guardbarData[gbt]
  return temp && temp['posData']
}


L.Storage.Guardbar = L.Storage.Polyline.extend({
    gbType: L.Storage.GB_TYPE_HULAN,
    dsColors: [null, 'Red', 'Lime','Fuchsia'],
    CLASS_NAME: 'guardbar',

    preInit: function() {
      if (!this.properties['className']) {
        this.properties['className'] = this.getClassName()

        var defaultData = L.Storage.getGBDefaultData(this.gbType) || {}
        this.properties._storage_options = {
          gbc: "1",
          weight:"10",
          offset: lmd.DEFAULT_OFFSET,
          lr: lmd.POS_LEFT
        }
        for(var i in defaultData){
          this.properties._storage_options[i] = defaultData[i]
        }
        var gbtype = this.gbType
        var gbcat  = this.properties._storage_options['gbc']
        var classObject = L.Storage.getGBClass(gbtype, gbcat)

        this.properties.name = this.defaultName || classObject['name'] || ''
        this.properties._storage_options['zoomCreate'] = this.map.getZoom()
      }

      this.on('remove', function(e){
         if (this.brotherOtherSide) {
             this.brotherOtherSide.remove();
             this.brotherOtherSide = null;
         }

         if (this.textHelpObject) {
             this.textHelpObject.remove();
             this.textHelpObject = null;
         }
      })

    },

    doMoreThings: function() {
      this._follow();

      var latlngs = this.getLatLngs();
      var geojson = this.toGeoJSON();
      if(this.brotherOtherSide) {
          this.brotherOtherSide.remove && this.brotherOtherSide.remove();
          this.brotherOtherSide = null;
      }
      var pos = +this.getOption('lr') || lmd.POS_LEFT;
      if (pos != lmd.POS_BOTH) {
          return null;
      }

      var offset = geojson.properties._storage_options.offset = 0 - geojson.properties._storage_options.offset;
      if(latlngs && latlngs.length > 1) {
          var zoom = this.getOption('zoomCreate') || this.map.getZoom();
          var scale = this.map.getZoomScale(zoom, this.map.getZoom());
          //console.log('scale:',scale,zoom,this.map.getZoom());
          var offsetLatLngs = this.getOffSetLatlngs(2 * offset / scale, latlngs);
          var lineClass = {
            'polyline': L.Storage.Polyline,
            'guardbar': L.Storage.Guardbar,
            'biaoxian': L.Storage.Biaoxian,
            'lunkuo'  : L.Storage.Lunkuo,
            'fangxuan': L.Storage.Fangxuan,
            'jiansu'  : L.Storage.Jiansu,
            'biangou' : L.Storage.Biangou
          }//copy from leaflet.storage.layer.js line 626
          var className = L.Storage.DataLayer.prototype._lineToClass[this.getClassName()];
          if(!className) {
              className = lineClass[this.getClassName()] || L.Storage.Guardbar;
          }

          this.brotherOtherSide = new className(
                     this.map,
                     offsetLatLngs,
                     {'geojson': geojson, 'datalayer': null},
                     true
              ).addTo(this.map);

          return this.brotherOtherSide;
      }
      return null;
    },

    //如果有txt属性需要填充的话，就得增加_follow函数处理
    _follow: function(e){
      var text = this.getOption('text');
      var lat = +this.getOption('textLat');
      var lng = +this.getOption('textLng');
      if (!text || !lat || !lng) {
          if(this.textHelpObject) {
              this.textHelpObject.remove();
              this.textHelpObject = null;
          }
          return;
      }

      var size = 35;
      var color = this.getOption('color') || "Blue";
      var tail = this.getOption('tail') || (27 * text.length);

      var options = {
        rotate: +this.getOption('rotate'),
        color: this.getOption('color'),
        //svgText: formatText,
        interactive: false
      };

      var scaleZoom = lmd.getLmdZoom(this.map)
      var scale = this.getOption('scale');
      (scale === null) && (scale = 5);
      options['scale'] = (+scale) * scaleZoom;
      //console.log('tail,length,scale,ratio:',tail,text.length,options['scale'],tail/text.length);


      var txtX = +this.getOption('textX');
      var txtY = +this.getOption('textY');

      var scaleZoom = lmd.getLmdZoom(this.map);
      var centerPoint = this.map.latLngToLayerPoint({lat:lat,lng:lng});
      var destX = centerPoint['x'] + txtX * scaleZoom;
      var destY = centerPoint['y'] + txtY * scaleZoom;
      var latlng = this.map.layerPointToLatLng([destX, destY]);

      const preTail = L.Storage.OFFSET_PLUS * scaleZoom;
      var formatText = '<text  font-size="' + size + '">' + text + '</text>' +
                       '<path stroke-width="2px" stroke-opacity="1" stroke="' + color + '" fill="none" d="m -' +
                       preTail + ',15 ' + (tail+preTail) + ',0"></path>';
      options['svgText'] = formatText;


      if (!this.textHelpObject) {
          this.textHelpObject = new L.SVGObject(latlng, options).addTo(this.map);
      }else{
          this.textHelpObject.setSvgText(formatText)
                             .updateStyle(options)
                             .setLatLng(latlng);
      }
    },

    isCopy: function(){
        //只有护栏支持copy
        if(this.getClassName() in { guardbar: 1}){
            return true;
        }
        return false;
    },

    edit: function(e) {
      if(this.map.editEnabled) {
          if (!this.editEnabled()) this.enableEdit();

          var gbt = this.gbType
          var gbcOptions = L.Storage.getGBOptions(gbt)
          L.FormBuilder.GuardbarCatSwitcher.prototype.selectOptions =  gbcOptions;

          //解决侧别的问题
          L.FormBuilder.LeftRightChoice.prototype.choices = L.Storage.getGBPosData(gbt) ||
                                                            L.FormBuilder.LeftRightChoice.prototype.choicesNoM;

          return L.Storage.LmdFeatureMixin.edit.call(this, e);

      }
    },

    //added by xiongjiabin
    getBasicOptions: function () {
        return [
          'properties._storage_options.gbc',//类别
          'properties._storage_options.lr',
          'properties._storage_options.gbss',//起始桩号
          'properties._storage_options.gbse',
          'properties._storage_options.gbl',//总长
          //'properties._storage_options.gba',//面积
          //'properties._storage_options.gbs',//间距
          //'properties._storage_options.gbn',//数量
          'properties._storage_options.gblev',//级别
          //'properties._storage_options.gbm', //材料
          'properties._storage_options.ds',
        ];
    },

    getTextOptions: function(){
      return [
        'properties._storage_options.text',
        'properties._storage_options.scale',
        'properties._storage_options.rotate',
        'properties._storage_options.tail',
        'properties._storage_options.textX',
        'properties._storage_options.textY',
        'properties._storage_options.textLat',
        'properties._storage_options.textLng'
      ]
    },

    getShapeOptions: function () {
        return [
            'properties._storage_options.color',
            'properties._storage_options.opacity',
            'properties._storage_options.weight',
            'properties._storage_options.offset'
        ];
    },

    getAdvancedOptions: function () {
        return [
            'properties._storage_options.smoothFactor',
            'properties._storage_options.zoomTo',
            'properties._storage_options.zoomCreate'
        ];
    },

    setStyle: function (options) {
      var gbtype = this.gbType
      var gbcat  = +this.getOption('gbc')
      var classObject = L.Storage.getGBClass(gbtype, gbcat)

      if(!classObject) {
          L.Storage.BarTypeNormal.call(this,options)
          return
      }
      var type = classObject['type']
      var optionsDefault = JSON.parse(JSON.stringify(classObject['defaultOptions']||{}))
      if(optionsDefault && options){
          for(var i in optionsDefault){
            if(options[i] === undefined) {
              options[i] = optionsDefault[i]
            }
          }
      }else if(!options && optionsDefault){
          options = optionsDefault
      }

      if( type === L.Storage.GB_NORMAL_LINE ){
          L.Storage.BarTypeNormal.call(this,options)
      }else if(type === L.Storage.GB_RECT) {
          L.Storage.BarTypeRect.call(this,options)
      }else if(type === L.Storage.GB_CIRCLE) {
          L.Storage.BarTypeCircle.call(this,options)
      }else if(type === L.Storage.GB_VERTICAL_LINE) {
          L.Storage.BarTypeLine.call(this,options)
      }else if(type === L.Storage.GB_CROSS) {
          L.Storage.BarTypeCustomize.call(this,options)
      }else if(type === L.Storage.GB_DOT){
          L.Storage.DotTypeLine.call(this,options)
      }else {
          L.Storage.BarTypeNormal.call(this,options)
      }
    },

    _updatePath: function(){
      this.parentClass.prototype._updatePath.call(this)
      var gbtype = this.gbType
      var gbcat  = +this.getOption('gbc')
      var classObject = L.Storage.getGBClass(gbtype, gbcat)
      if(classObject){
        if(classObject['type'] === L.Storage.GB_CROSS){
          L.Storage.BarTypeCustomize.call(this,this.options)
        }
      }
    },

    moveTo: function( gbss, gbse, offset ) {
      gbss = +gbss;
      gbse = +gbse;
      var temp = gbss;
      if(gbse < gbss ){
          gbss = gbse;
          gbse = temp;
      }

      var gl   = +this.getOption('lr') || lmd.POS_LEFT
      var offset = this.getOption('offset') * 2
      if(gl === lmd.POS_LEFT || gl === lmd.POS_MIDDLE_LEFT) offset = 0 - offset

      //console.time('get line between sub :', gbss + '->' + gbse)
      //var oldLatlngs = this.getLatLngs()
      var newCoordinates = this.map.getLineBetweenSubNos(gbss,gbse)
      if(newCoordinates) {
          var offsetLatLngs = this.getOffSetLatlngs(offset, newCoordinates)
          this.setLatLngs(offsetLatLngs);
          this.properties._storage_options.gbss = null;
          this.properties._storage_options.gbse = null;
          return true;
      }
      return false;
    },

    getEvents: function() {
      return {
        zoom: this._follow,
      };
    },

    _redraw: function (e) {

      if(e && e.helper && e.helper.name in {'offset': 0}){
          var gbss = this.getOption('gbss')
          var gbse = this.getOption('gbse')
          var lr = +this.getOption('lr')
          if( gbse && gbse > gbss){
              var gl   = lr || lmd.POS_LEFT
              var lineOffset = offset = +this.getOption('offset')
              if(gl === lmd.POS_LEFT || gl === lmd.POS_MIDDLE_LEFT) lineOffset = 0 - lineOffset
              //if(gl === lmd.POS_MIDDLE) offset = 0;

              //console.time('get line between sub :', gbss + '->' + gbse)
              //var oldLatlngs = this.getLatLngs()
              var newCoordinates = this.map.getLineBetweenSubNos(gbss,gbse)
              if(newCoordinates) {
                  var offsetLatLngs = this.getOffSetLatlngs(lineOffset, newCoordinates)
                  if(offsetLatLngs && offsetLatLngs.length > 0) this.setLatLngs(offsetLatLngs);
                  this.editor && this.editor.reset();
              }else{
                  console.error('没有找到对应的桩号坐标，是不是没有设置为路?')
              }
              //console.timeEnd('get line between sub :', gbss + '->' + gbse)

              //偏移发生变化，重新计算文字的相对x和y位置
              var rotate = +this.getOption('rotate');
              var degrees = (rotate) / 180 * Math.PI;
              //var offset = this.getOption('offset');
              var textX = 0;
              var textY = 0;
              offset += L.Storage.OFFSET_PLUS ;
              if(offset != 0){
                  textX = offset * Math.cos(degrees);
                  textY = offset * Math.sin(degrees);
              }
              var textXControl = this.getElementByName('textX');
              var textYControl = this.getElementByName('textY');
              var _storage_options = this.properties._storage_options;
              textXControl && (textXControl.value = _storage_options.textX = textX);
              textYControl && (textYControl.value = _storage_options.textY = textY);

          }
      }

      this.setStyle();
      this.resetTooltip();

      this.doMoreThings();
    },

    getClassName: function () {
        return this.CLASS_NAME;
    },

    getContextMenuEditItems: function (e) {
        var items = L.S.PathMixin.getContextMenuEditItems.call(this, e),
            vertexClicked = e.vertex, index;
        if (vertexClicked) {
            index = e.vertex.getIndex();
            if (index !== 0 && index !== e.vertex.getLastIndex()) {
                items.push({
                    text: L._('Split line'),
                    callback: e.vertex.split,
                    context: e.vertex
                });
            } else if (index === 0 || index === e.vertex.getLastIndex()) {
                items.push({
                    text: L._('Continue line (Ctrl-click)'),
                    callback: e.vertex.continue,
                    context: e.vertex.continue
                });
            }
        }
        return items;
    },

    getContextMenuMultiItems: function (e) {
        var items = L.S.PathMixin.getContextMenuMultiItems.call(this, e);
        items.push({
            text: L._('Merge lines'),
            callback: this.mergeShapes,
            context: this
        });
        return items;
    },

    caculateLanesAndSpace: function( len ){
        var spaces = [17,20,23,26,28,30,32];
        var maxSpace = 32
        var tempLen = len;
        var i, j;
        if(tempLen <= 0){
          return null;
        }
        i = 0;
        while(tempLen >= 0){
          tempLen = tempLen - (spaces[i] || maxSpace);
          i++;
        }
        var result = {lanes: i , space:[]};
        for(j = 0; j < i - 1; j++){
          result.space.push( spaces[j] || maxSpace )
        }
        return result;
    },

    getStringMap: function(){
      var stringMap = L.Storage.FeatureMixin.getStringMap.call(this)

      var sns = this.getOption('gbss')
      var sne = this.getOption('gbse')
      var snsString = sns ? L.Storage.LmdFeatureMixin.showSubNice.call(this,sns):''
      var sneString = sne ? L.Storage.LmdFeatureMixin.showSubNice.call(this,sne):''
      if(sne > sns ){
        stringMap['gbss'] = snsString
        stringMap['gbse'] = sneString
        stringMap['sortField'] = {k1:sns}
      }else{
        stringMap['gbss'] = sneString
        stringMap['gbse'] = snsString
        stringMap['sortField'] = {k1:sne}
      }

      stringMap['key'] = +sns

      stringMap['gbl'] = this.getOption('gbl');//长度
      stringMap['gbn'] = this.getOption('gbn');//数量
      stringMap['gba'] = this.getOption('gba');//面积
      stringMap['gbw'] = this.getOption('gbw');//宽度
      stringMap['gblev'] = this.getOption('gblev');//级别
      stringMap['gbs'] = this.getOption('gbs');//间距

      var gbd = this.getOption('gbd')
      gbd = gbd || L.FormBuilder.DirectionChoice.prototype.default
      stringMap['gbd'] = lmd.getOptionsToMap(L.FormBuilder.DirectionChoice.prototype.choices)[gbd] || ''

      var gbtype = this.gbType
      var gbcat  = +this.getOption('gbc')
      var classObject = L.Storage.getGBClass(gbtype, gbcat)
      if(classObject) {
        stringMap['gbc'] = classObject['name'] || this.properties.name//类别
      }else{
        stringMap['gbc'] = this.properties.name
      }

      return stringMap
    },

    //name是自动生成的，依据所选择的参数
    updateName: function(e){
      if(!e) return

      var name = e.target.helpers['properties.name']
      var nameValue = name.value()
      if(nameValue && nameValue.startsWith('@')) {
        return
      }

      var gbc = e.target.helpers['properties._storage_options.gbc']
      if(!gbc) {
        return
      }
      var text = gbc.getSelectText()
      var result = text.trim()
      this.properties.name = name.input.value = result
      this.CLASS_ALIAS = result;

      return
    },

    getClassAlias: function(){
       if(this.CLASS_ALIAS) return this.CLASS_ALIAS;
       var gbtype = this.gbType
       var gbcat  = +this.getOption('gbc')
       var classObject = L.Storage.getGBClass(gbtype, gbcat)
       if(classObject) {
         this.CLASS_ALIAS = classObject['name'] || this.properties.name;//类别
       }else{
         this.CLASS_ALIAS = this.properties.name
       }
       return this.CLASS_ALIAS;
    },

    updateText: function(e){
      var text = this.getOption('text');
      if(text && text.startsWith('@')) {
        return;
      }
      var sns = this.getOption('gbss')
      var sne = this.getOption('gbse')
      var snsString = L.Storage.LmdFeatureMixin.showSubNice.call(this,sns)
      var sneString = L.Storage.LmdFeatureMixin.showSubNice.call(this,sne)
      var classAlias = this.getClassAlias();
      this.properties._storage_options.text = classAlias + '(' + snsString + '-' + sneString + ')'
      if (e) {
          var textControl = this.getElementByName('text');
          textControl && (textControl.value = this.properties._storage_options.text);
      }
    },

    resetTooltip: function(e) {

      if(this._rings && this._rings.length > 0) { //如果元素还没有创建，但是这个时候去显示tooltip，导致太多的异常
          L.Storage.FeatureMixin.resetTooltip.call(this,e)
      }
      if (!e) return;
      var needDrawAgain = false
      var selfValue = e.helper.value()
      var _storage_options = this.properties._storage_options;

      if(e.helper.name === 'gbc') {
          this.updateName(e);
          this.updateText(e);
          this._redraw();

      } else if(e.helper.name in {'gbss':0,'gbse':0, 'lr':0 }){
          //计算长度
          var gbss = this.getOption('gbss') * 1000
          var gbse = this.getOption('gbse') * 1000
          var lr = +this.getOption('lr') || lmd.POS_LEFT
          var multipe = 1
          var distance = 0
          if (gbss > gbse) {
              distance = gbss - gbse
          }else{
              distance = gbse - gbss
          }
          if (lr === lmd.POS_BOTH) {
              multipe = 2;
          }

          var gblControl = e.target.helpers['properties._storage_options.gbl']
          if(gblControl) {
              this.properties._storage_options.gbl = gblControl.input.value = Math.ceil(distance * multipe)

              var gbaControl = e.target.helpers['properties._storage_options.gba']
              if(gbaControl){
                  var gbl = +this.getOption('gbl')
                  var gbw = +this.getOption('gbw')
                  if(gbl > 0 && gbw > 0) {
                      var area = (gbl * gbw).toFixed(2)
                      this.properties._storage_options.gba = gbaControl.input.value = area
                  }
              }
          }

          var gbs = +this.getOption('gbs')
          if(gbs > 0){
              var gbn = (Math.ceil(distance / gbs) + 1) * multipe
              var gbnControl = e.target.helpers['properties._storage_options.gbn']
              if(gbnControl){
                  this.properties._storage_options.gbn = gbnControl.input.value = gbn
              }
          }

          //计算文字的位置
          if (gbse > gbss) {
              var snMiddle = (gbss + gbse) / 2000;
              var data = this.map.getAnchorLatLngBySubNo(snMiddle);
              var pos = lmd.getRotateLeftRight(lr);
              var rotateControl = this.getElementByName('rotate');
              var txtLatControl = this.getElementByName('textLat');
              var txtLngControl = this.getElementByName('textLng');
              if(data && (data[pos] !== undefined)){
                  rotateControl && (_storage_options.rotate = rotateControl.value = data[pos]);
                  txtLatControl && (_storage_options.textLat = txtLatControl.value = data.point[0]);
                  txtLngControl && (_storage_options.textLng = txtLngControl.value = data.point[1]);
              }else{
                  rotateControl && (_storage_options.rotate = rotateControl.value = 0);
                  txtLatControl && (_storage_options.textLat = txtLatControl.value = 0);
                  txtLngControl && (_storage_options.textLng = txtLngControl.value = 0);
              }

              var rotate = +this.getOption('rotate');
              var offset = +this.getOption('offset');
              if(lr === lmd.POS_MIDDLE) offset = 0;
              var degrees = (rotate ) / 180 * Math.PI
              var textX = 0;
              var textY = 0;
              offset += L.Storage.OFFSET_PLUS ;
              if(offset != 0){
                 textX = offset * Math.cos(degrees);
                 textY = offset * Math.sin(degrees);
              }
              var textXControl = this.getElementByName('textX');
              var textYControl = this.getElementByName('textY');
              textXControl && (textXControl.value = _storage_options.textX = textX);
              textYControl && (textYControl.value = _storage_options.textY = textY);
          }
          this.updateText(e);

          needDrawAgain = true
      }else if(e.helper.name in {'gbs': 0}){

        var gbs = +this.getOption('gbs')
        var distance = +this.getOption('gbl')
        var lr = +this.getOption('lr') || lmd.POS_LEFT
        var multipe = 1
        if (lr === lmd.POS_BOTH) {
            multipe = 2;
        }

        if(gbs > 0 && distance > 0){
            var gbn = (Math.ceil( distance / (gbs * multipe) ) + 1) * multipe
            var gbnControl = e.target.helpers['properties._storage_options.gbn']
            if(gbnControl){
                this.properties._storage_options.gbn = gbnControl.input.value = gbn
            }
        }
      }else if(e.helper.name in {'gbl':0, 'gbw':0}){
          var gbaControl = e.target.helpers['properties._storage_options.gba']
          if(gbaControl){
              var gbl = +this.getOption('gbl')
              var gbw = +this.getOption('gbw')
              if(gbl > 0 && gbw > 0) {
                  var area = (gbl * gbw).toFixed(2)
                  this.properties._storage_options.gba = gbaControl.input.value = area
              }
          }
      }else if(e.helper.name === 'ds') {
          //设备状态更新导致颜色更新 http://lamudatech.com:3000/xiongjiabin/umap/issues/9
          var dsColors = this.dsColors || []
          var color = dsColors[selfValue] || 'Blue'
          this.properties._storage_options['color'] = color
          this.setStyle()
          this._follow()
      }else {

      }


      if(needDrawAgain){
        var gbss = this.getOption('gbss')
        var gbse = this.getOption('gbse')
        if(gbss && gbse && gbse > gbss){
            var gl   = +this.getOption('lr') || lmd.POS_LEFT
            var offset = this.getOption('offset')
            if(offset === null ) offset = lmd.DEFAULT_OFFSET
            if(gl === lmd.POS_LEFT || gl === lmd.POS_MIDDLE_LEFT) offset = 0 - offset
            if(gl === lmd.POS_MIDDLE) offset = 0
            offset = +offset;

            //console.time('get line between sub :', gbss + '->' + gbse)
            //var oldLatlngs = this.getLatLngs()
            var newCoordinates = this.map.getLineBetweenSubNos(gbss,gbse)
            if(newCoordinates){
                var offsetLatLngs = this.getOffSetLatlngs(offset, newCoordinates)
                this.setLatLngs(offsetLatLngs)
                this._redraw()
                this.editor && this.editor.reset();
            }else{
                console.error('没有找到对应的桩号坐标，是不是没有设置为路?')
            }
            //console.timeEnd('get line between sub :', gbss + '->' + gbse)
        }
      }

    },

    getElementByName: function(name){
      var elems = document.getElementsByName(name);
      if (elems.length > 0) {
          return elems[0];
      }
      return null;
    },

    getDisplayName: function(){
      var sns = this.getOption('gbss');
      var sne = this.getOption('gbse');
      var snsString = L.Storage.LmdFeatureMixin.showSubNice.call(this,sns);
      var sneString = L.Storage.LmdFeatureMixin.showSubNice.call(this,sne);
      var name = this.properties.name || this.getClassAlias();
      return name + '(' + snsString + '-' + sneString + ')'
    },
});

L.Storage.Lunkuo = L.Storage.Guardbar.extend({
  gbType: L.Storage.GB_TYPE_LUNKUO,
  dsColors: [null, 'Yellow', 'Lime','Fuchsia'],

  getClassName: function () {
      return 'lunkuo';
  },

  //added by xiongjiabin
  getBasicOptions: function () {
      return [
        'properties._storage_options.gbc',//类别
        'properties._storage_options.lr',
        'properties._storage_options.gbss',//起始桩号
        'properties._storage_options.gbse',
        'properties._storage_options.gbl',//总长
        'properties._storage_options.gbs',//间距
        'properties._storage_options.gbn',//数量
        'properties._storage_options.gbd',//方向
        'properties._storage_options.ds',
      ];
  },
});

L.Storage.Fangxuan = L.Storage.Guardbar.extend({
  gbType: L.Storage.GB_TYPE_FANGXUAN,
  dsColors: [null, 'White', 'Lime','Fuchsia'],
  GBC_TYPE_FANGXUAN_NET: 2,
  units: ['块','米','棵',''],

  getClassName: function () {
      return 'fangxuan';
  },

  //added by xiongjiabin
  getBasicOptions: function () {
      return [
        'properties._storage_options.gbc',//类别
        'properties._storage_options.lr',
        'properties._storage_options.gbss',//起始桩号
        'properties._storage_options.gbse',
        'properties._storage_options.gbl',//总长
        'properties._storage_options.gbs',//间距
        'properties._storage_options.gbn',//数量
        'properties._storage_options.ds',
      ];
  },

  resetTooltip: function(e) {

    L.Storage.Guardbar.prototype.resetTooltip.call(this, e);
    if(!e) return;
    var gbnControl = e.target.helpers['properties._storage_options.gbn']
    var gbsControl = e.target.helpers['properties._storage_options.gbs']
    var gbc, gbss, gbse, gbl,gbs,gbn;

    gbc = +this.getOption('gbc');
    if(e.helper.name === 'gbc') {
        if(gbc === this.GBC_TYPE_FANGXUAN_NET) {//防眩网
            gbsControl && gbsControl.label && (gbsControl.label.innerHTML = '渐变段长度(米)')
            gbnControl && gbnControl.label && (gbnControl.label.innerHTML = '标准段长度(米)')
        }else{
            gbsControl && gbsControl.label && (gbsControl.label.innerHTML = '间距(米)')
            gbnControl && gbnControl.label && (gbnControl.label.innerHTML = '数量(' + this.units[gbc - 1] + ')')
        }
    }

    if(e.helper.name in {'gbss':0,'gbse':0,'gbl':0, 'gbs':0,'gbc':0}){
        gbl = +this.getOption('gbl');
        gbs = +this.getOption('gbs');
        if(gbc === this.GBC_TYPE_FANGXUAN_NET){
            this.properties._storage_options.gbn = gbnControl.input.value = gbl - 2 * gbs;
        }else{
            (gbs > 0) && (this.properties._storage_options.gbn = gbnControl.input.value = (Math.ceil(gbl / gbs) + 1));
        }
    }
  },

  edit: function(e) {

    if(this.map.editEnabled) {
        var builder = L.Storage.Guardbar.prototype.edit.call(this,e);
        var gbnControl = builder.helpers['properties._storage_options.gbn']
        var gbsControl = builder.helpers['properties._storage_options.gbs']
        var gbc = +this.getOption('gbc');
        if(gbc === this.GBC_TYPE_FANGXUAN_NET) {//防眩网
            gbsControl && gbsControl.label && (gbsControl.label.innerHTML = '渐变段长度(米)')
            gbnControl && gbnControl.label && (gbnControl.label.innerHTML = '标准段长度(米)')
        }else{
            gbnControl && gbnControl.label && (gbnControl.label.innerHTML = '数量(' + this.units[gbc - 1] + ')')
        }
    }
  },

  getStringMap: function(){
      var stringMap = L.Storage.Guardbar.prototype.getStringMap.call(this);
      var gbc = +this.getOption('gbc');
      stringMap['gbn'] = stringMap['gbn'] + this.units[gbc - 1] || '';
      return stringMap;
  },
});

L.Storage.Jiansu = L.Storage.Guardbar.extend({
  gbType: L.Storage.GB_TYPE_BAOCENGPUZHUANG,
  dsColors: [null, 'White', 'Lime','Fuchsia'],

  getClassName: function () {
      return 'jiansu';//原来的jiansu
  },

  //added by xiongjiabin
  getBasicOptions: function () {
      return [
        'properties._storage_options.gbc',//类别
        'properties._storage_options.dangerousType',//危险类型
        'properties._storage_options.lr',
        'properties._storage_options.gbss',//起始桩号
        'properties._storage_options.gbse',
        'properties._storage_options.gbl',//总长
        'properties._storage_options.jslmTs',//每道设置条数
        'properties._storage_options.gbw',//宽度
        'properties._storage_options.gba',//面积
        'properties._storage_options.ds',
      ];
  },

  resetTooltip: function(e){
      L.Storage.Guardbar.prototype.resetTooltip.call(this,e);
      if(!e) return;

      if(e.helper.name in {'gbss':0,'gbse':0,'gbl':0,'jslmTs':0,'gbw':0}){
          var gbl = +this.getOption('gbl');
          var ret = this.caculateLanesAndSpace(gbl);
          var gbaControl = e.target.helpers['properties._storage_options.gba'];
          var descControl = e.target.helpers['properties.description'];

          if(!ret){
              this.properties._storage_options.gba = gbaControl.input.value = 0;
          }else {
              var gbw = +this.getOption('gbw');
              var jslmTs = +this.getOption('jslmTs');
              var area = (0.45 * gbw * jslmTs * ret['lanes']).toFixed(2);
              this.properties._storage_options.gba = gbaControl.input.value = area
              descControl.input.value = this.properties.description = '一处设置' + ret['lanes'] + '道,' +
                                                                    '每道' + jslmTs + '条,' +
                                                                    '间距(米):' + ret['space'].join('_');
          }
      }
  },

  //name是自动生成的，依据所选择的参数
  updateName: function(e){
    if(!e) return

    L.Storage.Guardbar.prototype.updateName.call(this,e);

    return
  },

  getStringMap: function(){
      var stringMap = L.Storage.Guardbar.prototype.getStringMap.call(this);
      var jslmTs = this.getOption('jslmTs');
      stringMap['jslmTs'] = jslmTs;
      return stringMap;
  },
});


L.Storage.Biangou = L.Storage.Guardbar.extend({
  gbType: L.Storage.GB_TYPE_BIANGOU,
  dsColors: [null, 'Blue', 'Lime','Fuchsia'],

  getClassName: function (){
      return 'biangou'
  },

  getBasicOptions: function () {
      return [
        'properties._storage_options.gbc',//类别
        'properties._storage_options.lr',
        'properties._storage_options.gbss',//起始桩号
        'properties._storage_options.gbse',
        'properties._storage_options.gbl',//总长
        'properties._storage_options.ds',
      ];
  },

});


L.Storage.BarTypeNormal = function(options){
  options = options || {};
  var option;
  for (var idx in this.styleOptions) {
      option = this.styleOptions[idx];
      options[option] = this.getOption(option);
  }
  this.parentClass.prototype.setStyle.call(this, options);
};

L.Storage.BarTypeRect  = function(options){
  options = options || {};
  var option;
  for (var idx in this.styleOptions) {
      option = this.styleOptions[idx];
      options[option] = this.getOption(option);
  }
  options['dashArray'] = '10,5';
  options['opacity'] = 1;
  options['lineCap'] = 'butt';
  if (options.interactive) this.options.pointerEvents = 'visiblePainted';
  else this.options.pointerEvents = 'stroke';
  this.parentClass.prototype.setStyle.call(this, options);
};

L.Storage.BarTypeCircle = function(options){
  options = options || {};
  var option;
  for (var idx in this.styleOptions) {
      option = this.styleOptions[idx];
      options[option] = this.getOption(option);
  }
  options['dashArray'] = '0,25';
  options['opacity'] = 1;
  options['lineCap'] = 'round';
  if (options.interactive) this.options.pointerEvents = 'visiblePainted';
  else this.options.pointerEvents = 'stroke';
  this.parentClass.prototype.setStyle.call(this, options);
};

L.Storage.BarTypeLine = function(options){
  options = options || {};
  var option;
  for (var idx in this.styleOptions) {
      option = this.styleOptions[idx];
      options[option] = this.getOption(option);
  }
  options['dashArray'] = '5,20';
  options['lineCap'] = 'butt';
  options['opacity'] = 1;
  options['weight'] = options.weight || 20;
  if (options.interactive) this.options.pointerEvents = 'visiblePainted';
  else this.options.pointerEvents = 'stroke';
  this.parentClass.prototype.setStyle.call(this, options);
};
L.Storage.BarTypeCustomize = function(options){
  options = options || {};
  var option;
  for (var idx in this.styleOptions) {
      option = this.styleOptions[idx];
      options[option] = this.getOption(option);
  }
  options['dashArray'] = '';
  options['lineCap'] = 'round';
  options['opacity'] = 0.4;
  options['weight'] = options.weight || 5;
  if (options.interactive) this.options.pointerEvents = 'visiblePainted';
  else this.options.pointerEvents = 'stroke';
  this.parentClass.prototype.setStyle.call(this, options);


  var gbtype = this.gbType
  var gbcat  = +this.getOption('gbc')
  var classObject = L.Storage.getGBClass(gbtype, gbcat)
  if(!classObject) {
      return
  }
  var type = classObject['type']
  var optionsDefault = JSON.parse(JSON.stringify(classObject['defaultOptions']||{}))
  optionsDefault['color'] = optionsDefault['fillColor'] = this.getOption('color')
  this.updatePolyMarker(optionsDefault);
}

L.Storage.DotTypeLine = function(options){
  options = options || {};
  var option;
  for (var idx in this.styleOptions) {
      option = this.styleOptions[idx];
      options[option] = this.getOption(option);
  }
  options['dashArray'] = '15,5';
  options['lineCap'] = 'butt';
  options['opacity'] = 1;
  options['weight'] = options.weight || 5;
  if (options.interactive) this.options.pointerEvents = 'visiblePainted';
  else this.options.pointerEvents = 'stroke';
  this.parentClass.prototype.setStyle.call(this, options);
};
