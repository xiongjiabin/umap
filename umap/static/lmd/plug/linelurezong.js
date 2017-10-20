L.Storage.ZongLineLure = L.Storage.SVGObject.extend({
  gbType: L.Storage.GB_TYPE_LINELURE, //share gbc type with linelure 横向线性
  defaultName: '单柱式',
  CLASS_ALIAS: '线性诱导(纵向)',
  CLASS_NAME: 'zlinelure',
  defaultColor: 'white',

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

          this.properties._storage_options = {
              gbc: 1,
              scale:  10,
              rotate:  0,
              color: this.defaultColor,
              sn: '',
              lr: 1,
          }
          this.properties.name = this.defaultName
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

  isCopy: function(){
      return true;
  },

  //显示的名字不随着类型变化而变化
  getClassAlias: function(){
      return this.CLASS_ALIAS;
  },

  getSvgData() {
      var sn = this.getOption('sn');
      var snTxt = '';
      if(sn){
          var snTxt = L.Storage.LmdFeatureMixin.showSubNice.call(this,sn);
      }
      var text = snTxt + ' ' + this.getTypeName();
      var msh = this.getOption('msh') || 1;
      var size = 18;
      var color = this.map.getRenderColor(this.getOption('color') || this.defaultColor);
      var tail = +this.getOption('tail') || (18 * text.length);
      var svgStr = '<text x="20" font-size="' + size + '">' + text + '</text>' +
                       '<path stroke-width="2px" stroke-opacity="1" stroke="' + color + '" fill="none" d="m 20,8 ' + tail + ',0"></path>' +
                       '<image xlink:href="/static/storage/src/img/' + this.MT + '/' + this.MIC + '/' + msh +
                       '.png" x = ' + (tail + 35) + ' y="-30"' + '  height="60" />';

      return svgStr
  },

  _redraw: function() {
    this.setSvgText(this.getSvgData())
    L.Storage.SVGObject.prototype._redraw.call(this)
  },

  resetTooltip: function(e){
    L.Storage.FeatureMixin.resetTooltip.call(this,e)

    if(!e) return
    var selfValue = e.helper.value()
    var lr = +this.getOption('lr')
    var sn = this.getOption('sn')

    if (e.helper.name === 'sn' || e.helper.name === 'lr') {
        var data = this.map.getAnchorLatLngBySubNo(sn)
        var pos = lmd.getRotateLeftRight(lr);
        if(data && (data[pos] !== undefined)){
            this.properties._storage_options['rotate'] = data[pos]
            this.setSvgText(this.getSvgData())
            this.updateStyle()
            if(data.point){
                this.setLatLng(data.point)
            }
         }
      }else if(e.helper.name === 'msh' || e.helper.name === 'gbc' ){
          if(e.helper.name === 'gbc') {
              this.updateName(e);
          }
          this.setSvgText(this.getSvgData())
      }else {

      }
  },

  getBasicOptions: function () {
      return [
        'properties._storage_options.gbc',//类别
        'properties._storage_options.lr',
        'properties._storage_options.direction',//方向
        'properties._storage_options.msh', // 内容
        'properties._storage_options.mss', //速度&尺寸
        'properties._storage_options.sn',//桩号
        'properties._storage_options.diameter',//立柱直径
        'properties._storage_options.ds',
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

  MT:4,
  MIC:2,
  edit: function(e) {
    if(this.map.editEnabled) {
        if (!this.editEnabled()) this.enableEdit();

        var gbt = this.gbType
        var gbcOptions = L.Storage.getGBOptions(gbt)
        L.FormBuilder.GuardbarCatSwitcher.prototype.selectOptions =  gbcOptions;

        var mt = this.MT, mic = this.MIC; //the data in lmd.marker.data.js
        var mssResult = lmd.getMarkerCategoryThird(mt, mic, this.getOption('speed'))
        L.FormBuilder.MarkerSpeedSizeSwitcher.prototype.selectOptions = mssResult[0];
        L.FormBuilder.MarkerShapeSwitcher.prototype.selectOptions = lmd.getMarkerCategoryThirdWife(mt, mic);

        //只有左右，中间
        L.FormBuilder.LeftRightChoice.prototype.choices = L.FormBuilder.LeftRightChoice.prototype.choicesLRM;


        return L.Storage.LmdFeatureMixin.edit.call(this, e);

    }
  },

  getTypeName: function(){
    var gbt = this.gbType
    var gbcOptions = L.Storage.getGBOptions(gbt)
    var typeNames = lmd.getOptionsToMap(gbcOptions)
    var type = this.getOption('gbc')
    return typeNames[type] || ''
  },

  getDisplayName: function(){
    var displayName = L.Storage.FeatureMixin.getDisplayName.call(this) || this.getTypeName()
    var sn = this.getOption('sn')
    if(sn){
      displayName = displayName + '_' +  L.Storage.LmdFeatureMixin.showSubNice.call(this,sn)
    }
    return displayName
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
      var stringMap = L.Storage.FeatureMixin.getStringMap.call(this);
      var direction = this.getOption('direction') || 1;
      var msh = this.getOption('msh');
      var mss = this.getOption('mss');
      var diameter = this.getOption('diameter');

      stringMap['diameter'] =  lmd.getOptionsToMap(L.FormBuilder.DiameterSwitcher.prototype.selectOptions)[diameter] || '';
      var result = lmd.getMarkerCategoryValue({mt: this.MT, mic: this.MIC, msh: msh, mss: mss });
      stringMap['msh'] = result['msh'];
      stringMap['mss'] = result['mss'];

      stringMap['direction'] = lmd.getOptionsToMap(L.FormBuilder.FangxiangChoice.prototype.choices)[direction] || '';
      stringMap['gbss'] = stringMap['sn'];

      stringMap['name'] = stringMap['name'] + this.CLASS_ALIAS;

      return stringMap;
  }
});

L.Storage.DataLayer.prototype._pointToClass['zlinelure'] = L.Storage.ZongLineLure;

L.S.Editable.prototype.createZongLineLure = function( latlng ){
   return new L.Storage.ZongLineLure(this.map, latlng)
};

L.Editable.prototype.startZongLineLure = function(latlng,options){
  latlng = latlng || this.map.getCenter();
  var label = this.createZongLineLure(latlng, options);
  this.connectCreatedToMap(label);
  var editor = label.enableEdit();
  editor.startDrawing();
  return label;
};

L.Storage.Map.include({
  startZongLineLure: function(){
      return this.editTools.startZongLineLure();
  }
});

L.Storage.SubDrawZongLineLureAction = L.Storage.SubAction.extend({

    options: {
        toolbarIcon: {
          html: '线性诱导标(纵向)',
          tooltip: '包含纵向线性诱导标'
        }
    },

    addHooks: function () {
        this.map.startZongLineLure();
        L.Storage.SubAction.prototype.addHooks.call(this)
    }
});

L.Storage.DrawAllLureAction.prototype.options.subActions.push(L.Storage.SubDrawZongLineLureAction);
