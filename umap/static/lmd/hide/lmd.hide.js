
L.Storage.Hide = L.Storage.SVGObject.extend({

  initialize: function(map, latlng, options) {
    L.Storage.LmdFeatureMixin.initialize.call(this, map, latlng, options)
  },

  preInit: function() {
    if (!this.properties['className']) {
      this.properties['className'] = this.getClassName()
    }

    if (!this.properties._storage_options.color) {
      this.properties._storage_options['scale'] = 5;
      this.properties._storage_options['rotate'] = 0;
      this.properties._storage_options['color'] = 'Black';
    }

    var options = {}
    var _storage_options = this.properties._storage_options
    options.svgText = this.getSvgData()

    var validObj = {rotate:1,scale:1,color:1}
    for(var i in _storage_options){
      if(validObj[i]){
        options[i] = _storage_options[i]
      }
    }
    return options
  },

  getDisplayName: function(){
    return '影藏元素'
  },

  getSvgData: function() {
    var name = this.getDisplayName()
    var size = this.getOption('size') || 35
    return '<text font-family="Verdana" font-size="' + size + '">' + name + '</text>'
  },

  resetTooltip: function(e){

    this.setSvgText(this.getSvgData())
    if (!e) return;

    if(e.helper.name in {'gbss':0,'gbse':0}){
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
        }

        var gbs = +this.getOption('gbs')
        if(gbs > 0){
            var gbn = Math.ceil(distance / gbs) + 1
            var gbnControl = e.target.helpers['properties._storage_options.gbn']
            if(gbnControl){
                this.properties._storage_options.gbn = gbnControl.input.value = gbn
            }
        }

    } else if(e.helper.name in {'gbs': 0}){

      var gbs = +this.getOption('gbs')
      var distance = +this.getOption('gbl')
      if(gbs > 0 && distance > 0){
          var gbn = Math.ceil(distance / gbs) + 1
          var gbnControl = e.target.helpers['properties._storage_options.gbn']
          if(gbnControl){
              this.properties._storage_options.gbn = gbnControl.input.value = gbn
          }
      }
    } else{
      //nothing to do
    }

  },

  //added by xiongjiabin
  getBasicOptions: function() {
    return [
    ];
  },

  getClassName: function() {
    return 'lmdHide'
  },

  edit: function(e) {
    if(!this.map.editEnabled) {
        return false
    }
    L.Storage.LmdFeatureMixin.edit.call(this, e)
  },

  isHide: function(){
    return true
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

    stringMap['key'] = +sns

    stringMap['gbl'] = this.getOption('gbl');//长度
    stringMap['gbn'] = this.getOption('gbn');//数量
    stringMap['gbs'] = this.getOption('gbs');//间距
    stringMap['gbw'] = this.getOption('gbw');//宽度

    return stringMap
  },
});

L.Storage.TuQiLuBiao = L.Storage.Hide.extend({

  getDisplayName: function(){
    var gbss = this.getOption('gbss') || ''
    var gbse = this.getOption('gbse') || ''
    return '<tspan x=0 dy=0>**突起路标**</tspan>'+
           '<tspan x=0 dy=1.2em>(' + gbss + '-' + gbse + ')</tspan>'
  },

  getBasicOptions: function(){
    return [
    'properties._storage_options.lr',
    'properties._storage_options.gbss',//起始桩号
    'properties._storage_options.gbse',
    'properties._storage_options.gbl',//总长
    'properties._storage_options.gbs',//间距
    'properties._storage_options.gbn',//数量
    'properties._storage_options.hShape',
    'properties._storage_options.hColor',
    'properties._storage_options.ds', //设施状态
    ]
  },

  getClassName: function(){
     return 'tqlb'
  },

  getStringMap: function(){
      var stringMap = L.Storage.Hide.prototype.getStringMap.call(this)

      var hShape = this.getOption('hShape')
      var hColor = this.getOption('hColor')

      stringMap['hShape'] = lmd.getOptionsToMap(L.FormBuilder.ShaperSwitcher.prototype.selectOptions)[hShape] || ''
      stringMap['hColor'] = lmd.getOptionsToMap(L.FormBuilder.ColorSwitcher.prototype.selectOptions)[hColor] || ''

      return stringMap
  },

});


L.Storage.DangTuQiang = L.Storage.Hide.extend({

  getDisplayName: function(){
    var gbss = this.getOption('gbss') || ''
    var gbse = this.getOption('gbse') || ''
    return '<tspan x=0 dy=0>**挡土墙**</tspan>'+
           '<tspan x=0 dy=1.2em>(' + gbss + '-' + gbse + ')</tspan>'
  },

  getBasicOptions: function(){
    return [
    'properties._storage_options.lr',
    'properties._storage_options.gbss',//起始桩号
    'properties._storage_options.gbse',
    'properties._storage_options.gbl',//总长
    'properties._storage_options.hHeight',//高度
    'properties._storage_options.gba',//面积
    'properties._storage_options.bulk',//体积
    'properties._storage_options.ds', //设施状态
    ]
  },

  getClassName: function(){
     return 'dtq'
  },

  getStringMap: function(){
      var stringMap = L.Storage.Hide.prototype.getStringMap.call(this)

      stringMap['hHeight'] = this.getOption('hHeight');//高度
      stringMap['gba'] = this.getOption('gba');//面积
      stringMap['bulk'] = this.getOption('bulk');//体积
      return stringMap
  },

});
