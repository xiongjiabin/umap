L.Storage.LmdPillar = L.Storage.SVGObject.extend({

  initialize: function(map, latlng, options) {
    L.Storage.LmdFeatureMixin.initialize.call(this, map, latlng, options)
  },

  _onDragEnd: function(e){
    this.isDirty = true;
    if(!this.getOption('sn')){
      var latlng = this.getLatLng()
      var result = this.map.getSubNoByLatLng([latlng.lng, latlng.lat])
      if(result){
        this.properties._storage_options['sn'] = parseInt(result[2] * 1000) / 1000
        this.resetTooltip()
      }
    }
    this.edit(e);
  },

  preInit: function() {
    if (!this.properties['className']) {
      this.properties['className'] = this.getClassName()
    }

    if (!this.properties._storage_options.ps) {
      var preOptions = this.getSamePreviousOptions()
      //console.log(preOptions)
      this.properties._storage_options = {
        ps: 1,
        scale: preOptions['scale'] || 3,
        rotate: preOptions['rotate'] || 0,
        color: preOptions['color'] || 'Yellow',
        sn: ''
      }
    }

    var options = {}
    var _storage_options = this.properties._storage_options
    if(_storage_options['ps']){
      options.svgText = this.getSvgData(
                            _storage_options['ps'],
                            _storage_options['sn'],
                            _storage_options['color'],
                            _storage_options['tail'])
    }
    var validObj = {rotate:1,scale:1,color:1}
    for(var i in _storage_options){
      if(validObj[i]){
        options[i] = _storage_options[i]
      }
    }
    return options
  },

  isCopy: function(){
      return true;
  },

  getSvgData(type,sn, color, tail) {
    var typeSvg = {
      1: '<circle cx="92" cy="-17" r="15" />' +
         '<rect width="178" height="20" x="0" y="-10" />' +
         '<path stroke-width="2px" stroke-opacity="1" stroke="{{color}}" fill="none" d="m 180,25 {{tail}},0"/>' +
         '<text style="font-size:70px;" x="200" y="20">{{桩号}}</text>', //单柱式

      2: '<circle cx="42" cy="-30" r="15"/><circle cx="129" cy="-30" r="15"/>' +
         '<rect width="178" height="25" x="0" y="-15" />' +
         '<path stroke-width="2px" stroke-opacity="1" stroke="{{color}}" fill="none" d="m 180,25 {{tail}},0"/>' +
         '<text style="font-size:70px;" x="200" y="20">{{桩号}}</text>', //双柱式

      3: '<rect width="150" height="25" x="0" y="-12.5" />' +
         '<circle cx="168" cy="0" r="15" />' +
         '<path stroke-width="2px" stroke-opacity="1" stroke="{{color}}" fill="none" d="m 180,25 {{tail}},0"/>' +
         '<text style="font-size:70px;" x="200" y="20">{{桩号}}</text>', //单悬臂式

      4: '<rect width="73" height="25" x="106" y="-12.5" />' +
         '<circle cx="90" cy="-12.5" r="15" /> ' +
         '<rect width="72" height="25" x="2" y="-12.5"/>' +
         '<path stroke-width="2px" stroke-opacity="1" stroke="{{color}}" fill="none" d="m 180,25 {{tail}},0"/> '+
         '<text style="font-size:70px;" x="200" y="20">{{桩号}}</text>', //双悬臂式

      5: '<circle cx="16" cy="-7.5" r="15" />'+
         '<rect width="121" height="25" x="32" y="-20" />' +
         '<circle cx="168" cy="-7.5" r="15" />' +
         '<path stroke-width="2px" stroke-opacity="1" stroke="{{color}}" fill="none" d="m 180,25 {{tail}},0"/> ' +
         '<text style="font-size:70px;" x="200" y="20">{{桩号}}</text>', //门架式

      6: '<circle cx="52" cy="-20" r="10"/><circle cx="119" cy="-20" r="10"/>' +
         '<rect width="200" height="20" x="0" y="-10" />' +
         '<path stroke-width="2px" stroke-opacity="1" stroke="{{color}}" fill="none" d="m 202,25 {{tail}},0"/>' +
         '<text style="font-size:70px;" x="220" y="20">{{桩号}}</text>', //附着式
    }
    var svgStr = typeSvg[type] || typeSvg[1]
    tail = tail || 320
    color = color || 'Yellow'
    if(sn || (sn === 0)){ //sn可能为0
      snStr = L.Storage.LmdFeatureMixin.showSubNice.call(this,sn)
      svgStr = svgStr.replace('{{桩号}}', snStr)
    }
    svgStr = svgStr.replace('{{tail}}',tail)
    svgStr = svgStr.replace('{{color}}',color)

    return svgStr
  },

  _redraw: function() {
    var ps = this.getOption('ps')
    var sn = this.getOption('sn')
    var tail = this.getOption('tail')
    var color = this.getOption('color')
    this.setSvgText(this.getSvgData(ps,sn,color, tail))
    L.Storage.SVGObject.prototype._redraw.call(this)
  },

  resetTooltip: function(e){
    var ps = this.getOption('ps')
    var sn = this.getOption('sn')
    var tail = this.getOption('tail')
    var color = this.getOption('color')
    this.setSvgText(this.getSvgData(ps,sn,color,tail))

    if(!e) return
    var selfValue = e.helper.value()

    if (e.helper.name === 'sn' || e.helper.name === 'lr') {
      var lr = +this.getOption('lr')
      var data = this.map.getAnchorLatLngBySubNo(sn)
      var pos = lr == 2 ? 'right' : 'left'
      if(data && (data[pos] !== undefined)){
          this.properties._storage_options['rotate'] = data[pos]
          this.updateStyle()
          if(data.point){
              this.setLatLng(data.point)
          }
      }
    }else if(e.helper.name === 'ds') {
        //设备状态更新导致颜色更新 http://lamudatech.com:3000/xiongjiabin/umap/issues/9
        var dsColors = [null,'Yellow','Lime','Fuchsia']
        color = dsColors[selfValue] || 'Yellow'
        this.properties._storage_options['color'] = color
        this.setSvgText(this.getSvgData(ps,sn,color,tail))
        this.updateStyle()
    }
  },

  //added by xiongjiabin
  getBasicOptions: function() {
    return [
      'properties._storage_options.ps',
      'properties._storage_options.lr',
      'properties._storage_options.sn',
      'properties._storage_options.ds',

      //pillar attributes
      'properties._storage_options.pd',
      'properties._storage_options.pt',
      'properties._storage_options.ph',
      'properties._storage_options.pb'
    ];
  },

  getShapeOptions: function() {
    return [
      'properties._storage_options.color',
      'properties._storage_options.rotate',
      'properties._storage_options.scale',
      'properties._storage_options.tail'
    ];
  },

  getClassName: function() {
    return 'lmdPillar';
  },

  getTypeName: function(){
    var typeNames = lmd.getOptionsToMap(L.FormBuilder.PillSuppSwitcher.prototype.selectOptions)
    var type = this.getOption('ps')
    return typeNames[type] || ''
  },

  getDisplayName: function(){
    var displayName = L.Storage.FeatureMixin.getDisplayName.call(this) || this.getTypeName()
    var sn = this.getOption('sn')
    var pos = this.getOption('lr') || L.FormBuilder.LeftRightChoice.prototype.default
    var posText = lmd.getOptionsToMap(L.FormBuilder.LeftRightChoice.prototype.choices)
    if(posText[pos]){
      displayName = displayName + '_' +  posText[pos]
    }
    if(sn){
      displayName = displayName + '_' +  L.Storage.LmdFeatureMixin.showSubNice.call(this,sn)
    }
    return displayName
  },

  edit: function(e) {
    if(!this.map.editEnabled) {
        return false
    }

    //解决侧别的问题,pillar 只有左右，中间
    L.FormBuilder.LeftRightChoice.prototype.choices = L.FormBuilder.LeftRightChoice.prototype.choicesLRM;

    L.Storage.LmdFeatureMixin.edit.call(this, e)
  },

  getStringMap: function(){
    var stringMap = L.Storage.FeatureMixin.getStringMap.call(this)

    stringMap['pt'] = this.getTypeName()

    stringMap['pd'] = this.getOption('pd')
    stringMap['ph'] = this.getOption('ph')
    stringMap['pb'] = this.getOption('pb')

    return stringMap
  },

});
