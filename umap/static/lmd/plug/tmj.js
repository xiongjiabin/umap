L.Storage.TuMianJing = L.Storage.SVGObject.extend({
  gbType: L.Storage.GB_TYPE_TUMIANJING, //类型和线性诱导标一致
  defaultName: '凸面镜',
  CLASS_ALIAS: '凸面镜',
  CLASS_NAME: 'tumianjing',
  defaultColor: 'white',

  initialize: function(map, latlng, options) {
    L.Storage.LmdFeatureMixin.initialize.call(this, map, latlng, options)
  },


  preInit: function() {
    if (!this.properties['className']) {
        this.properties['className'] = this.getClassName()

        this.properties._storage_options = {
            gbc: 1,
            tmjwz:1,
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

  getSvgData() {
    var sn = this.getOption('sn');
    var snTxt = '';
    if(sn){
        var snTxt = L.Storage.LmdFeatureMixin.showSubNice.call(this,sn);
    }
    var text = snTxt + ' ' + this.getTypeName();
    var size = 18;
    var color = this.getOption('color') || this.defaultColor;
    var tail = +this.getOption('tail') || (18 * text.length);
    //图片的加载需更换
    var svgStr = '<text x="20" font-size="' + size + '">' + text + '</text>' +
                       '<path stroke-width="2px" stroke-opacity="1" stroke="' + color + '" fill="none" d="m 20,8 ' + tail + ',0"></path>' +
                       '<image xlink:href="./static/storage/src/img/' + this.MT + '/' + this.MIC + '/'   +
                       '.png" x = ' + (tail + 35) + ' y="-30"' + '  height="60" />';

    return svgStr
  },



  resetTooltip: function(e){
    var lr = +this.getOption('lr')
    var sn = this.getOption('sn')

    if(!e) return
    var selfValue = e.helper.value()

    if (e.helper.name === 'sn' || e.helper.name === 'lr') {
    var data = this.map.getAnchorLatLngBySubNo(sn)
    var pos = lmd.getRotateLeftRight(lr);
    if(data && (data[pos])!== undefined){
        this.setSvgText(this.getSvgData())
        this.updateStyle()
        if(data.point){
            this.setLatLng(data.point)
        }
     }
    }else if(  e.helper.name === 'gbc' ){
      this.updateName(e);
      this.setSvgText(this.getSvgData())
      }else {

    }
    },

  getBasicOptions: function () {
      return [
        'properties._storage_options.gbc',//类别
        'properties._storage_options.lr',
        'properties._storage_options.tmjwz',//位置
        'properties._storage_options.sn',//桩号
        'properties._storage_options.gbn',//数量
        'properties._storage_options.tmjcc', //尺寸
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
        var tmjTypeOptions = L.Storage.getGBOptions(gbt)
        L.FormBuilder.GuardbarCatSwitcher.prototype.selectOptions =  tmjTypeOptions;

        var mt = this.MT, mic = this.MIC; //the data in lmd.marker.data.js
        var tmjccResult = lmd.getMarkerCategoryThird(mt, mic, this.getOption('speed'))
        L.FormBuilder.MarkerSpeedSizeSwitcher.prototype.selectOptions = tmjccResult[0];
        L.FormBuilder.MarkerShapeSwitcher.prototype.selectOptions = lmd.getMarkerCategoryThirdWife(mt, mic);
        //只有左右，中间
        L.FormBuilder.LeftRightChoice.prototype.choices = L.FormBuilder.LeftRightChoice.prototype.choicesLRM;
        return L.Storage.LmdFeatureMixin.edit.call(this, e);
    }
  },
  getTypeName: function(){
    var gbt = this.gbType
    var tmjTypeOptions = L.Storage.getGBOptions(gbt)
    var typeNames = lmd.getOptionsToMap(tmjTypeOptions)
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

    var tmjType = e.target.helpers['properties._storage_options.gbc']
    var text = tmjType.getSelectText()
    var result = text.trim()
    this.properties.name = name.input.value = result

    return
  },

  getStringMap: function(){
    var stringMap = L.Storage.FeatureMixin.getStringMap.call(this);
    var tmjcc = this.getOption('tmjcc');
    var diameter = this.getOption('diameter');
    var gbn = this.getOption('gbn');
    stringMap['diameter'] =  lmd.getOptionsToMap(L.FormBuilder.DiameterSwitcher.prototype.selectOptions)[diameter] || '';
    var result = lmd.getMarkerCategoryValue({mt: this.MT, mic: this.MIC,  tmjcc: tmjcc });
    stringMap['tmjcc'] = result['tmjcc'];
    stringMap['gbn'] = ['gbn'];
    stringMap['gbss'] = stringMap['sn'];
    return stringMap;
    }
  });

  lmd.tjTuMianJing = function(){
    var data = []
    var titles = {no:'序号',
                  name: '类型',
                  sn: '桩号',
                  gbn: '数量(个)',
                  ds: '状态',
     }
     data.push(lmd.objectToArray(titles))
     delete titles.no
     //this means map
     var i = 1
     var className = null;
     this.eachLayerFeature(function (feature) {
         className = feature.getClassName();
         if(className === L.Storage.TuMianJing.prototype.CLASS_NAME) {
             data.push(lmd.getTjData(feature,i,titles))
             i++
         }
    })

    lmd.processData(data)
      new CsvGenerator(data,  '凸面镜.csv').download(true);
    }
    lmd.tjs.push({ label: '凸面镜', process: lmd.tjTuMianJing});

L.Storage.DataLayer.prototype._pointToClass['tumianjing'] = L.Storage.TuMianJing;

L.S.Editable.prototype.createTuMianJing = function( latlng ){
   return new L.Storage.TuMianJing(this.map, latlng)
};

L.Editable.prototype.startTuMianJing = function(latlng,options){
  latlng = latlng || this.map.getCenter();
  var label = this.createTuMianJing(latlng, options);
  this.connectCreatedToMap(label);
  var editor = label.enableEdit();
  editor.startDrawing();
  return label;
};

L.Storage.Map.include({
  startTuMianJing: function(){
      return this.editTools.startTuMianJing();
  }
});

L.Storage.SubDrawTuMianJingAction = L.Storage.SubAction.extend({

    options: {
        toolbarIcon: {
          html: '凸面镜',
          tooltip: '凸面镜'
        }
    },
    addHooks: function () {
        this.map.startTuMianJing();
        L.Storage.SubAction.prototype.addHooks.call(this)
    }
});

L.Storage.DrawOtherAction.prototype.options.subActions.push(L.Storage.SubDrawTuMianJingAction);
