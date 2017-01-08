L.Storage.GB_NORMAL_LINE = 1
L.Storage.GB_RECT = 2
L.Storage.GB_VERTICAL_LINE = 3
L.Storage.GB_CIRCLE = 4
L.Storage.GB_CROSS = 5
L.Storage.GB_OTHER = 99

L.Storage.GB_TYPE_BIAOXIAN = 1
L.Storage.GB_TYPE_HULAN = 2
L.Storage.GB_TYPE_LUNKUO = 3
L.Storage.GB_TYPE_FANGXUAN = 4
L.Storage.GB_TYPE_JIANSU = 5
L.Storage.GB_TYPE_JIANSUQIU = 6
L.Storage.GB_TYPE_BIANGOU = 7

L.Storage.guardbarData = [
  null,
  {name: '标线', childs: [
    null,
    {name:'横向减速标线',type: L.Storage.GB_RECT, defaultOptions: {}},
    {name:'纵向减速标线',type: L.Storage.GB_RECT},
    {name:'收费站广场减速标线',type: L.Storage.GB_RECT},
    {name:'行人横穿设施',type: L.Storage.GB_NORMAL_LINE,defaultOptions:{lineCap:'butt'}}
  ]},
  { name: '防护设施',
    defaultData:{
      gbc: "10", //默认示警墩
      weight:"10",
    },
    childs: [
    null,
    {name:'波形梁钢护栏', type: L.Storage.GB_NORMAL_LINE},
    {name:'路基混泥土护栏', type: L.Storage.GB_NORMAL_LINE},
    {name:'强梁混泥土护栏',   type: L.Storage.GB_NORMAL_LINE},
    {name:'金属梁柱式护栏', type: L.Storage.GB_NORMAL_LINE},
    {name:'组合式护栏', type: L.Storage.GB_NORMAL_LINE},
    {name:'缆索护栏', type: L.Storage.GB_CIRCLE},
    {name:'波形梁护栏外展端头',type: L.Storage.GB_NORMAL_LINE},
    {name:'外展示警墩', type:L.Storage.GB_NORMAL_LINE},
    {name:'中央分隔带混凝土护栏',type: L.Storage.GB_NORMAL_LINE},
    {name:'示警墩', type: L.Storage.GB_CIRCLE},
    {name:'示警桩', type: L.Storage.GB_RECT},
    {name:'中间隔离', type: L.Storage.GB_NORMAL_LINE},
    {name:'机非隔离', type: L.Storage.GB_NORMAL_LINE},
    {name:'路宅分离', type: L.Storage.GB_NORMAL_LINE},
  ]},
  {name:'轮廓标', childs: [
    null,
    {name:'附着式轮廓标',type: L.Storage.GB_CROSS, defaultOptions:{lmdtype:'lmdtrian',width:2,fill:true}},
    {name:'柱状轮廓标', type: L.Storage.GB_CROSS, defaultOptions:{lmdtype:'lmdtrian',width:2,fill:true}},
  ]},
  {name: '防眩设施', childs: [
    null,
    {name:'防眩板', type: L.Storage.GB_NORMAL_LINE},
    {name:'防眩网',type: L.Storage.GB_NORMAL_LINE},
    {name:'植树', type: L.Storage.GB_NORMAL_LINE},
    {name:'其他',type: L.Storage.GB_NORMAL_LINE},
  ]},
  {name:'减速路面', childs: [
    null,
    {name:'急弯',type: L.Storage.GB_VERTICAL_LINE},
    {name:'过村',type: L.Storage.GB_VERTICAL_LINE},
    {name:'事故多发',type: L.Storage.GB_VERTICAL_LINE},
    {name:'隧道洞口',type: L.Storage.GB_VERTICAL_LINE},
    {name:'学校',type: L.Storage.GB_VERTICAL_LINE},
  ]},
  {name:'减速丘',childs: [
    null,
    {name:'大型减速丘',type: L.Storage.GB_VERTICAL_LINE},
    {name:'预制减速垄',type: L.Storage.GB_VERTICAL_LINE},
    {name:'预制断开式减速垄',type: L.Storage.GB_VERTICAL_LINE},
  ]},
  {name:'边沟',childs: [
    null,
    {name:'浅碟形边沟',type: L.Storage.GB_NORMAL_LINE},
    {name:'加铺盖板',type: L.Storage.GB_NORMAL_LINE}
  ]}
];

L.Storage.getGBOptions = function(gbt){
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
  if(gbt <= 0 || gbt >= L.Storage.guardbarData.length){
    return []
  }
  var temp = L.Storage.guardbarData[gbt]
  return temp['childs'][gbc]
}

L.Storage.getGBDefaultData = function(gbt){
  if(gbt <= 0 || gbt >= L.Storage.guardbarData.length){
    return {}
  }
  var temp = L.Storage.guardbarData[gbt]
  return temp['defaultData']
}


L.Storage.Guardbar = L.Storage.Polyline.extend({
    gbType: L.Storage.GB_TYPE_HULAN,

    preInit: function() {
      if (!this.properties['className']) {
        this.properties['className'] = this.getClassName()
      }

      if (!this.properties._storage_options.gbc) {
        var defaultData = L.Storage.getGBDefaultData(this.gbType) || {}
        this.properties._storage_options = {
          gbc: "1",
          weight:"10",
          offset: 40
        }
        for(var i in defaultData){
          this.properties._storage_options[i] = defaultData[i]
        }

      }
    },

    edit: function(e) {
      if(this.map.editEnabled) {
          if (!this.editEnabled()) this.enableEdit();

          var gbt = this.gbType
          var gbcOptions = L.Storage.getGBOptions(gbt)
          L.FormBuilder.GuardbarCatSwitcher.prototype.selectOptions =  gbcOptions;

          var builder = L.Storage.LmdFeatureMixin.edit.call(this, e);

          if(this.gbType === L.Storage.GB_TYPE_HULAN){
            var gbc = +this.getOption('gbc')
            var gbsControl = builder.helpers['properties._storage_options.gbs']
            var gbnControl = builder.helpers['properties._storage_options.gbn']
            if(gbc === 10 || gbc === 11 ){
              gbsControl.show()
              gbnControl.show()
            }else{
              gbsControl.clear().hide()
              gbnControl.clear().hide()
            }
        }
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
          'properties._storage_options.gbs',//间距
          'properties._storage_options.gbn',//数量
          'properties._storage_options.gblev',//级别
          'properties._storage_options.gbm', //材料
          'properties._storage_options.ds',
        ];
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
            'properties._storage_options.zoomTo'
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

    _redraw: function (e) {
      
      if(e && e.helper.name in {'offset': 0}){
          var gbss = this.getOption('gbss')
          var gbse = this.getOption('gbse')
          if(gbss && gbse && gbse > gbss){
              var gl   = +this.getOption('lr') || 1
              var offset = this.getOption('offset') || 40
              if(gl !== 2) offset = 0 - offset

              //console.time('get line between sub :', gbss + '->' + gbse)
              //var oldLatlngs = this.getLatLngs()
              var newCoordinates = this.map.getLineBetweenSubNos(gbss,gbse)
              var offsetLatLngs = this.getOffSetLatlngs(offset, newCoordinates)
              this.setLatLngs(offsetLatLngs)
              this.editor && this.editor.reset();
              //console.timeEnd('get line between sub :', gbss + '->' + gbse)
          }
      }

      this.setStyle();
      this.resetTooltip();
    },

    getClassName: function () {
        return 'guardbar';
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

    getStringMap: function(){
      var stringMap = L.Storage.FeatureMixin.getStringMap.call(this)

      var sns = this.getOption('gbss')
      var sne = this.getOption('gbse')
      var snsString = L.Storage.LmdFeatureMixin.showSubNice.call(this,sns)
      var sneString = L.Storage.LmdFeatureMixin.showSubNice.call(this,sne)
      if(sne > sns ){
        stringMap['gbss'] = snsString
        stringMap['gbse'] = sneString
      }else{
        stringMap['gbss'] = sneString
        stringMap['gbse'] = snsString
      }

      stringMap['gbl'] = this.getOption('gbl');//长度
      stringMap['gbn'] = this.getOption('gbn');//数量
      stringMap['gba'] = this.getOption('gba');//面积
      stringMap['gbw'] = this.getOption('gbw');//宽度
      stringMap['gblev'] = this.getOption('gblev');//级别


      var gbd = gbd || L.FormBuilder.DirectionChoice.prototype.default
      stringMap['gbd'] = lmd.getOptionsToMap(L.FormBuilder.DirectionChoice.prototype.choices)[gbd] || ''

      var gbtype = this.gbType
      var gbcat  = +this.getOption('gbc')
      var classObject = L.Storage.getGBClass(gbtype, gbcat)
      if(classObject) {
        stringMap['gbc'] = classObject['name'] || this.getOption('name');//类别
      }else{
        stringMap['gbc'] = this.getOption('name')
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
      var text = gbc.getSelectText()
      var result = text.trim()
      this.properties.name = name.input.value = result

      return
    },

    resetTooltip: function(e) {

      L.Storage.FeatureMixin.resetTooltip.call(this,e)
      if (!e) return;
      var needDrawAgain = false

      if(e.helper.name === 'gbc') {
          this._redraw();

          if(this.gbType === L.Storage.GB_TYPE_HULAN){
              var gbc = +this.getOption('gbc')
              var gbsControl = e.target.helpers['properties._storage_options.gbs']
              var gbnControl = e.target.helpers['properties._storage_options.gbn']
              if(gbc === 10 || gbc === 11 ){
                gbsControl.show()
                gbnControl.show()
              }else{
                gbsControl.clear().hide()
                gbnControl.clear().hide()
              }
          }

      } else if(e.helper.name in {'gbss':0,'gbse':0}){
          //计算长度
          var gbss = this.getOption('gbss') * 1000
          var gbse = this.getOption('gbse') * 1000
          var distance = 0
          if(gbss > gbse){
              distance = gbss - gbse
          }else{
              distance = gbse - gbss
          }
          distance = Math.ceil(distance)

          var gblControl = e.target.helpers['properties._storage_options.gbl']
          if(gblControl) {
              this.properties._storage_options.gbl = gblControl.input.value = distance

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
              var gbn = Math.ceil(distance / gbs)
              var gbnControl = e.target.helpers['properties._storage_options.gbn']
              if(gbnControl){
                  this.properties._storage_options.gbn = gbnControl.input.value = gbn
              }
          }

          needDrawAgain = true
      }else if(e.helper.name in {'gbs': 0}){

        var gbs = +this.getOption('gbs')
        var distance = +this.getOption('gbl')
        if(gbs > 0 && distance > 0){
            var gbn = Math.ceil(distance / gbs)
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
      }else if(e.helper.name in {'lr': 0}){
          needDrawAgain = true
      }else{
        //nothing to do
      }

      this.updateName(e)

      if(needDrawAgain){
        var gbss = this.getOption('gbss')
        var gbse = this.getOption('gbse')
        if(gbss && gbse && gbse > gbss){
            var gl   = +this.getOption('lr') || 1
            var offset = this.getOption('offset') || 40
            if(gl !== 2) offset = 0 - offset

            //console.time('get line between sub :', gbss + '->' + gbse)
            //var oldLatlngs = this.getLatLngs()
            var newCoordinates = this.map.getLineBetweenSubNos(gbss,gbse)
            var offsetLatLngs = this.getOffSetLatlngs(offset, newCoordinates)
            this.setLatLngs(offsetLatLngs)
            this._redraw()
            this.editor && this.editor.reset();
            //console.timeEnd('get line between sub :', gbss + '->' + gbse)
        }
      }

    }
});

L.Storage.Biaoxian = L.Storage.Guardbar.extend({
  gbType: L.Storage.GB_TYPE_BIAOXIAN,

  getClassName: function () {
      return 'biaoxian';
  },
});

L.Storage.Lunkuo = L.Storage.Guardbar.extend({
  gbType: L.Storage.GB_TYPE_LUNKUO,

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

  getClassName: function () {
      return 'fangxuan';
  },
});

L.Storage.Jiansu = L.Storage.Guardbar.extend({
  gbType: L.Storage.GB_TYPE_JIANSU,

  getClassName: function () {
      return 'jiansu';
  },

  //added by xiongjiabin
  getBasicOptions: function () {
      return [
        'properties._storage_options.gbc',//类别
        'properties._storage_options.lr',
        'properties._storage_options.gbss',//起始桩号
        'properties._storage_options.gbse',
        'properties._storage_options.gbl',//总长
        'properties._storage_options.gbw',//宽度
        'properties._storage_options.gba',//面积
        'properties._storage_options.ds',
      ];
  },

});

L.Storage.JianSuQiu = L.Storage.Guardbar.extend({
  gbType: L.Storage.GB_TYPE_JIANSUQIU,

  getClassName: function () {
      return 'jiansuqiu';
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

});

L.Storage.Biangou = L.Storage.Guardbar.extend({
  gbType: L.Storage.GB_TYPE_BIANGOU,

  preInit: function() {
    if (!this.properties['className']) {
      this.properties['className'] = this.getClassName()
    }

    if (!this.properties._storage_options.gbc) {
      this.properties._storage_options = {
        gbc: "1",
        color: "blue",
        weight:"10"
      }

    }
  },

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
  options['weight'] = 20;
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
  options['weight'] = 5;
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
