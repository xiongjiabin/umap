
L.Storage.Hide = L.Storage.SVGObject.extend({
  defaultName: '',

  initialize: function(map, latlng, options) {
    L.Storage.LmdFeatureMixin.initialize.call(this, map, latlng, options)
  },

  //对影藏元素支持copy
  isCopy: function(){
    return true;
  },

  preInit: function() {
    if (!this.properties['className']) {
      this.properties['className'] = this.getClassName()

      this.properties._storage_options['scale'] = this.properties._storage_options['scale'] || 5;
      this.properties._storage_options['rotate'] = this.properties._storage_options['rotate'] || 0;
      this.properties._storage_options['color'] = this.properties._storage_options['color'] || 'Black';
      this.properties.name = this.defaultName;
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

    if (!e) return;
    this.setSvgText(this.getSvgData())
    var gbs, distance, gbn, gbnControl, gbss, gbse, gblControl

    if(e.helper.name in {'gbss':0,'gbse':0,'sn':0,'lr':0 }){
        var lr = +this.getOption('lr')
        var multipe = 1
        if (lr === lmd.POS_BOTH) {
            multipe = 2
        }
        //计算长度
        gbss = this.getOption('gbss') * 1000
        gbse = this.getOption('gbse') * 1000
        distance = 0
        if(gbss > gbse){
            distance = gbss - gbse
        }else{
            distance = gbse - gbss
        }
        distance = Math.ceil(distance)

        gblControl = e.target.helpers['properties._storage_options.gbl']
        if(gblControl) {
            this.properties._storage_options.gbl = gblControl.input.value = distance * multipe
        }

        gbs = +this.getOption('gbs')
        if(gbs > 0){
            gbn = (Math.ceil(distance / gbs) + 1) * multipe
            gbnControl = e.target.helpers['properties._storage_options.gbn']
            if(gbnControl){
                this.properties._storage_options.gbn = gbnControl.input.value = gbn
            }
        }

        var sn = this.getOption('sn')
        if(sn !== null){
            sn = +sn;
            var data = this.map.getAnchorLatLngBySubNo(sn)
            var pos = lr == LMD.POS_RIGHT ? 'right' : 'left'
            if(data && (data[pos] !== undefined)){
                this.properties._storage_options['rotate'] = data[pos]
                this.updateStyle()
                if(data.point){
                    this.setLatLng(data.point)
                }
            }
        }

    } else if(e.helper.name in {'gbs': 0}){
      var lr = +this.getOption('lr')
      var multipe = 1
      if (lr === lmd.POS_BOTH) {
          multipe = 2
      }
      gbs = +this.getOption('gbs')
      distance = +this.getOption('gbl')
      if(gbs > 0 && distance > 0){
          gbn = (Math.ceil(distance / (gbs * multipe)) + 1) * 2
          gbnControl = e.target.helpers['properties._storage_options.gbn']
          if(gbnControl){
              this.properties._storage_options.gbn = gbnControl.input.value = gbn
          }
      }
    } /*else if (e.helper.name === 'sn' || e.helper.name === 'lr') {
        var lr = +this.getOption('lr')
        var sn = +this.getOption('sn')
        var data = this.map.getAnchorLatLngBySubNo(sn)
        var pos = lr == 2 ? 'right' : 'left'
        if(data && (data[pos] !== undefined)){
            this.properties._storage_options['rotate'] = data[pos]
            this.updateStyle()
            if(data.point){
              this.setLatLng(data.point)
            }
        }
    }*/ else {

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

    //解决侧别的问题, 只有左右，中间
    L.FormBuilder.LeftRightChoice.prototype.choices = this.posData ||
                                                      L.FormBuilder.LeftRightChoice.prototype.choicesLRMBoth;

    return L.Storage.LmdFeatureMixin.edit.call(this, e)
  },

  isHide: function(){
    return true
  },

  getStringMap: function(){
    var stringMap = L.Storage.FeatureMixin.getStringMap.call(this)
    if(!stringMap['name']){
        stringMap['name'] = this.defaultName || ''
    }

    var sns = this.getOption('gbss')
    var sne = this.getOption('gbse')
    var snsString = L.Storage.LmdFeatureMixin.showSubNice.call(this,sns)
    var sneString = L.Storage.LmdFeatureMixin.showSubNice.call(this,sne)
    if(sne > sns ){
      stringMap['gbss'] = snsString
      stringMap['gbse'] = sneString
      stringMap['sortField'] = {k1:sns};
    }else{
      stringMap['gbss'] = sneString
      stringMap['gbse'] = snsString
      stringMap['sortField'] = {k1:sne};
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
  defaultName: '突起路标',
  posData: L.FormBuilder.LeftRightChoice.prototype.choicesNoM,

  getDisplayName: function(){
    var gbss = this.getOption('gbss') || ''
    var gbse = this.getOption('gbse') || ''
    return '<tspan x=0 dy=0>**' + this.defaultName + '**</tspan>'+
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
  defaultName: '挡土墙',

  resetTooltip: function(e) {

    if(!e) return
    if(e.helper.name === 'dtqType') {
        this.updateName(e)
    }

    L.Storage.Hide.prototype.resetTooltip.call(this,e)

  },

  //name是自动生成的，依据所选择的参数
  updateName: function(e){
    if(!e) return

    var name = e.target.helpers['properties.name']
    var nameValue = name.value()
    if(nameValue && nameValue.startsWith('@')) {
      return
    }

    var dtqType = e.target.helpers['properties._storage_options.dtqType']
    var text = dtqType.getSelectText()
    var result = text.trim()
    this.properties.name = name.input.value = result

    return
  },

  getDisplayName: function(){
    var gbss = this.getOption('gbss') || ''
    var gbse = this.getOption('gbse') || ''
    var name = this.properties.name || this.defaultName
    return '<tspan x=0 dy=0>**' + name + '**</tspan>'+
           '<tspan x=0 dy=1.2em>(' + gbss + '-' + gbse + ')</tspan>'
  },

  getBasicOptions: function(){
    return [
    'properties._storage_options.dtqType',
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
