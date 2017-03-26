
L.Storage.JianSuQiu = L.Storage.SVGObject.extend({

  dsColors: [null, 'White', 'Lime','Fuchsia'],
  defaultColor: 'White',
  defaultName: '大型减速丘',
  CLASS_ALIAS: '大型减速丘',

  initialize: function(map, latlng, options) {
    L.Storage.LmdFeatureMixin.initialize.call(this, map, latlng, options)
  },

  _onDragEnd: function(e){
    this.isDirty = true;
    this.edit(e);
  },

  preInit: function() {
    if (!this.properties['className']) {
      this.properties['className'] = this.getClassName()
    }

    if (!this.properties._storage_options.gbc) {
      //console.log(preOptions)
      this.properties._storage_options = {
        gbc: 1,
        scale:  10,
        rotate:  0,
        color: this.defaultColor,
        sn: '',
        lr: 1,
        showText: true,
        height:50
      }
      this.properties.name = this.defaultName
    }

    var options = {}
    var _storage_options = this.properties._storage_options
    if(_storage_options['gbc']){
        options.svgText = this.getSvgData(_storage_options['lr'],_storage_options['sn'],
                                          _storage_options['color'],_storage_options['height'],
                                          _storage_options['width'])
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

  getSvgData(lr, sn, color, height, width) {
    var typeSvg = {
      1: '<path class="leaflet-interactive" stroke-width="{{width}}" stroke-opacity="1" stroke="{{color}}" fill="none" d="m 0,0 {{height}},0"/>',
      2: '<path class="leaflet-interactive" stroke-width="{{width}}" stroke-opacity="1" stroke="{{color}}" fill="none" d="m 0,0 {{height}},0"/>' +
         '<path class="leaflet-interactive" stroke-width="{{width}}" stroke-opacity="1" stroke="{{color}}" fill="none" d="m 0,0 -{{height}},0"/>'
    }
    var textTemplate = '<text style="font-size:14px;" x="{{height}}" y="5">减速丘{{sn}}</text>'

    var svgStr = typeSvg[1]
    if(lr == lmd.POS_BOTH) {
        svgStr = typeSvg[2]
    }
    height = height || 50
    color = color || defaultColor
    width = width || 25

    svgStr = svgStr.replace(/{{height}}/g,height)
    svgStr = svgStr.replace(/{{color}}/g,color)
    svgStr = svgStr.replace(/{{width}}/g,width)

    var showText = this.getOption('showText')
    if(showText){
      var snStr = L.Storage.LmdFeatureMixin.showSubNice.call(this,sn)
      svgStr += textTemplate.replace('{{height}}',height).replace('{{sn}}',snStr)
    }

    return svgStr
  },

  _redraw: function() {
    var lr = this.getOption('lr')
    var sn = this.getOption('sn')
    var height = this.getOption('height')
    var color = this.getOption('color')
    var width = this.getOption('width')
    this.setSvgText(this.getSvgData(lr,sn,color, height,width))
    L.Storage.SVGObject.prototype._redraw.call(this)
  },

  resetTooltip: function(e){
    var lr = +this.getOption('lr')
    var sn = this.getOption('sn')
    var height = this.getOption('height')
    var color = this.getOption('color')
    var width = this.getOption('width')
    /*this.setSvgText(this.getSvgData(lr,sn,color,height,width))*/

    if(!e) return
    var selfValue = e.helper.value()

    if (e.helper.name === 'sn' || e.helper.name === 'lr') {

      var data = this.map.getAnchorLatLngBySubNo(sn)
      var pos = lr == lmd.POS_RIGHT ? 'right' : 'left'
      if(data && (data[pos] !== undefined)){
          this.properties._storage_options['rotate'] = data[pos]
          this.setSvgText(this.getSvgData(lr,sn,color,height,width))
          this.updateStyle()
          if(data.point){
              this.setLatLng(data.point)
          }
      }
    }else if(e.helper.name === 'ds') {
        color = this.dsColors[selfValue] || this.defaultColor
        this.properties._storage_options['color'] = color
        this.setSvgText(this.getSvgData(lr,sn,color,height,width))
        this.updateStyle()
    }else if(e.helper.name === 'gbc'){
        this.updateName(e)
    }
  },

  //added by xiongjiabin
  getBasicOptions: function() {
    return [
      'properties._storage_options.gbc',
      'properties._storage_options.lr',
      'properties._storage_options.sn',
      'properties._storage_options.roadWidth',
      'properties._storage_options.ds'
    ];
  },

  getShapeOptions: function() {
    return [
      'properties._storage_options.color',
      'properties._storage_options.rotate',
      'properties._storage_options.scale',
      'properties._storage_options.height',
      'properties._storage_options.width',
      'properties._storage_options.showText'
    ];
  },

  CLASS_NAME: 'jiansuqiu',
  getClassName: function() {
    return 'jiansuqiu';
  },

  getTypeName: function(){
    var typeNames = lmd.getOptionsToMap(L.FormBuilder.PillSuppSwitcher.prototype.selectOptions)
    var type = this.getOption('gbc')
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

    //解决侧别的问题,减速丘 只有左右，俩侧
    L.FormBuilder.LeftRightChoice.prototype.choices = L.FormBuilder.LeftRightChoice.prototype.choicesLRBoth;
    var gbcOptions = L.Storage.getGBOptions(L.Storage.GB_TYPE_JIANSUQIU)
    L.FormBuilder.GuardbarCatSwitcher.prototype.selectOptions =  gbcOptions;

    L.Storage.LmdFeatureMixin.edit.call(this, e)
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

  getStringMap: function(){
    var stringMap = L.Storage.FeatureMixin.getStringMap.call(this)
    var roadWidth = this.getOption('roadWidth')
    stringMap['roadWidth'] = roadWidth
    return stringMap
  },

});

//j减速丘统计
lmd.tjJianSuQiu = function(){
  var data = []
  var titles = {no:'序号',
                sn: '桩号',
                roadWidth: '设置道路宽度',
                pos: '侧别',
                name: '名称',
                ds: '状态',
                description:'备注'
              }
  data.push(lmd.objectToArray(titles))
  delete titles.no

  //this means map
  var i = 1
  this.eachLayerFeature(function (feature) {
      if(feature.getClassName() === L.Storage.JianSuQiu.prototype.CLASS_NAME){
        data.push(lmd.getTjData(feature,i,titles))
        i++
      }
  })

  lmd.processData(data)
  new CsvGenerator(data,  '减速丘.csv').download(true);
}


lmd.tjs.push({ label: '减速丘', process: lmd.tjJianSuQiu});
