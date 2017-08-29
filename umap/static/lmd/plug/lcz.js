L.Storage.LiChengZhuang = L.Storage.SVGObject.extend({
  lczType: L.Storage.GB_TYPE_LCZ, //更换
  defaultName: '里程桩',
  CLASS_ALIAS: '里程桩',
  CLASS_NAME: 'lcz',
  defaultColor: 'white',

  initialize: function(map, latlng, options) {
      L.Storage.LmdFeatureMixin.initialize.call(this, map, latlng, options)
  },


  preInit: function() {
    if (!this.properties['className']) {
        this.properties['className'] = this.getClassName()

        this.properties._storage_options = {
            gbc: 1,
            scale:  10,
            rotate:  0,
            color: this.defaultColor,
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

  //图片加载需要更换
  getSvgData() {
    var text = this.getTypeName();
    var size = 18;
    var color = this.getOption('color') || this.defaultColor;
    var tail = +this.getOption('tail') || (18 * text.length);
    var svgStr = '<text x="20" font-size="' + size + '">' + text + '</text>' +
                     '<path stroke-width="2px" stroke-opacity="1" stroke="' + color + '" fill="none" d="m 20,8 ' + tail + ',0"></path>' +
                     '<image xlink:href="./static/storage/src/img/' + this.MT + '/' + this.MIC + '/'  +
                     '.png" x = ' + (tail + 35) + ' y="-30"' + '  height="60" />';

    return svgStr
  },


  resetTooltip: function(e){

    L.Storage.FeatureMixin.resetTooltip.call(this,e)
    
    if(!e) return
    var lr = +this.getOption('lr')
    var selfValue = e.helper.value()
    if(e.helper.name === 'gbc') {
        this.updateName(e);
        this.setSvgText(this.getSvgData())
    }
  },
  getBasicOptions: function () {
    return [
    'properties._storage_options.gbc',//类别
    'properties._storage_options.lr',
    'properties._storage_options.gbss',//起始桩号
    'properties._storage_options.gbse',//结束桩号
    'properties._storage_options.gbs',//间距
    'properties._storage_options.gbn',//数量
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

        var lcz = this.lczType
        var lczOptions = L.Storage.getGBOptions(lcz)
        L.FormBuilder.GuardbarCatSwitcher.prototype.selectOptions =  lczOptions;
        //只有左右
        L.FormBuilder.LeftRightChoice.prototype.choices = L.FormBuilder.LeftRightChoice.prototype.choicesLR;


        return L.Storage.LmdFeatureMixin.edit.call(this, e);

    }
  },

  getTypeName: function(){
    var lcz = this.lczType
    var lczOptions = L.Storage.getGBOptions(lcz)
    var typeNames = lmd.getOptionsToMap(lczOptions)
    var type = this.getOption('gbc')
    return typeNames[type] || ''
  },


  //name是自动生成的，依据所选择的参数
  updateName: function(e){
    if(!e) return

    var name = e.target.helpers['properties.name']
    var nameValue = name.value()
    if(nameValue && nameValue.startsWith('@')) {
      return
    }

    var lcz = e.target.helpers['properties._storage_options.gbc']
    var text = lcz.getSelectText()
    var result = text.trim()
    this.properties.name = name.input.value = result

    return
  },

  getStringMap: function(){
      var stringMap = L.Storage.FeatureMixin.getStringMap.call(this);
      var gbn = this.getOption('gbn');
      stringMap['gbn'] = ['gbn'];
      return stringMap;
      }
  });

  lmd.tjLiChengZhuang = function(){
      var data = []
      var titles = {no:'序号',
                  lcz: '类别',
                  gbss:'起始桩号',
                  gbsb:'结束桩号',
                  gbs: '间距',
                  gbn: '数量',
                  ds: '状态',
      }
      data.push(lmd.objectToArray(titles))
      delete titles.no

      //this means map
      var i = 1
      var className = null;
      this.eachLayerFeature(function (feature) {
          className = feature.getClassName();
          if(className === L.Storage.LiChengZhuang.prototype.CLASS_NAME) {
              data.push(lmd.getTjData(feature,i,titles))
              i++
          }
  })

  lmd.processData(data)
    new CsvGenerator(data,  '里程桩.csv').download(true);
  }
  lmd.tjs.push({ label: '里程桩', process: lmd.tjLiChengZhuang});

L.Storage.DataLayer.prototype._pointToClass['lcz'] = L.Storage.LiChengZhuang;

L.S.Editable.prototype.createLiChengZhuang = function( latlng ){
    return new L.Storage.LiChengZhuang(this.map, latlng)
};

L.Editable.prototype.startLiChengZhuang = function(latlng,options){
    latlng = latlng || this.map.getCenter();
    var label = this.createLiChengZhuang(latlng, options);
    this.connectCreatedToMap(label);
    var editor = label.enableEdit();
    editor.startDrawing();
    return label;
};

L.Storage.Map.include({
    startLiChengZhuang: function(){
        return this.editTools.startLiChengZhuang();
    }
});

L.Storage.SubDrawLiChengZhuangAction = L.Storage.SubAction.extend({

    options: {
        toolbarIcon: {
          html: '里程桩',
          tooltip: '里程桩'
        }
    },

    addHooks: function () {
        this.map.startLiChengZhuang();
        L.Storage.SubAction.prototype.addHooks.call(this)
    }
});

L.Storage.DrawOtherAction.prototype.options.subActions.push(L.Storage.SubDrawLiChengZhuangAction);
