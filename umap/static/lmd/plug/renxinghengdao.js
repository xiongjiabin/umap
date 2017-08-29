
L.Storage.Rxhdx = L.Storage.SVGObject.extend({

  dsColors: [null, 'White', 'White','White'],
  defaultColor: 'White',
  defaultName: '人行横道线',
  CLASS_ALIAS: '人行横道线',

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
        scale:  10,
        rotate:  0,
        color: this.defaultColor,
        sn: '',
        showText: true,
        height:50,
        gbm: "2",
        hColor: "1", //defalut white
        lane: 1,
      }
      this.properties.name = this.defaultName
    }

    var options = {}
    var _storage_options = this.properties._storage_options

    options.svgText = this.getSvgData(_storage_options['sn'],
                                      _storage_options['color'],_storage_options['height'],
                                      _storage_options['width'],_storage_options['fontSize'])

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

  getSvgData(sn, color, height, width, fontSize) {
    var typeSvg = {
      1: '<path class="leaflet-interactive" stroke-dasharray="3,3" stroke-width="{{width}}" stroke-opacity="1" stroke="{{color}}" fill="none" ' +
         'd="m -{{height}},0 {{height2}},0 "/>'
    }
    var textTemplate = '<text style="font-size:{{fontSize}}px;text-decoration: underline;" x="{{height}}" y="5">' + this.defaultName + '{{sn}}</text>'
    var svgStr = typeSvg[1]

    height = +height || 50
    height2 = height * 2
    color = color || defaultColor
    width = +width || 20
    fontSize = +fontSize || 14;
    //var space = width * 2.5

    svgStr = svgStr.replace(/{{height}}/g,height).
                    replace(/{{height2}}/g,height2).
                    replace(/{{color}}/g,color).
                    replace(/{{width}}/g,width);
                    //replace(/{{space}}/g,space);


    var showText = this.getOption('showText')
    if(showText){
      var snStr = L.Storage.LmdFeatureMixin.showSubNice.call(this,sn)
      textTemplate =  textTemplate.replace('{{height}}',height + 2)
                      .replace('{{sn}}',snStr)
                      .replace('{{fontSize}}',fontSize)

      svgStr += textTemplate
    }

    return svgStr
  },

  _redraw: function() {
    var sn = this.getOption('sn')
    var height = this.getOption('height')
    var color = this.getOption('color')
    var width = this.getOption('width')
    var fontSize = this.getOption('fontSize')
    this.setSvgText(this.getSvgData(sn,color, height,width,fontSize))
    L.Storage.SVGObject.prototype._redraw.call(this)
  },

  resetTooltip: function(e){
    L.Storage.FeatureMixin.resetTooltip.call(this,e)

    if(!e) return
    var selfValue = e.helper.value()
    var sn = this.getOption('sn')
    var height = this.getOption('height')
    var color = this.getOption('color')
    var width = this.getOption('width')
    var fontSize = this.getOption('fontSize')
    /*this.setSvgText(this.getSvgData(sn,color,height,width))*/

    if (e.helper.name === 'sn') {
      var data = this.map.getAnchorLatLngBySubNo(sn)
      var pos = 'left'
      if(data && (data[pos] !== undefined)){
          this.properties._storage_options['rotate'] = data[pos]
          this.setSvgText(this.getSvgData(sn,color,height,width,fontSize))
          this.updateStyle()
          if(data.point){
              this.setLatLng(data.point)
          }
      }
    }else if(e.helper.name === 'ds') {
        color = this.dsColors[selfValue] || this.defaultColor
        this.properties._storage_options['color'] = color
        this.setSvgText(this.getSvgData(sn,color,height,width,fontSize))
        this.updateStyle()
    }else if(e.helper.name in {roadWidth2:0,roadWidth:0,roadWidth3:0,gbs:0,lane:0,tzxxk:0}) {
        var gbnControl = e.target.helpers['properties._storage_options.gbn'];
        var tzxbxmjControl = e.target.helpers['properties._storage_options.tzxbxmj'];
        var roadWidth = +this.getOption('roadWidth'); //设置宽度
        var roadWidth2 = +this.getOption('roadWidth2');//道路宽度
        var roadWidth3 = +this.getOption('roadWidth3');//线宽
        var gbs = +this.getOption('gbs'); //间距
        var lane = +this.getOption('lane') || 1;
        var gbn = 0;
        if(roadWidth3 + gbs) {
            //gbn = roadWidth2 * roadWidth3 * (roadWidth * (roadWidth3 / (roadWidth3 + gbs)));
            gbn = roadWidth * roadWidth3 * roadWidth2 / (roadWidth3 + gbs);
            gbn = gbn.toFixed(2);
        }
        var tzxxk = +this.getOption('tzxxk');
        this.properties._storage_options.tzxbxmj = tzxbxmjControl.input.value = roadWidth2 * tzxxk;
        this.properties._storage_options.gbn = gbnControl.input.value = gbn * lane;
    }else if(e.helper.name in {ygbxszgs: 0}){
        var gbaControl = e.target.helpers['properties._storage_options.gba'];
        this.properties._storage_options.gba = gbaControl.input.value = +selfValue * 1.1416;
    }
  },

  //added by xiongjiabin
  getBasicOptions: function() {
    return [
      'properties._storage_options.sn',
      'properties._storage_options.roadWidth2',//道路宽度
      'properties._storage_options.roadWidth',//设置宽度
      'properties._storage_options.roadWidth3',//线宽
      'properties._storage_options.gbs',//间距
      'properties._storage_options.lane',//设置道数
      'properties._storage_options.gbn',//数量
      'properties._storage_options.ygbxszgs',//预告标线设置个数
      'properties._storage_options.gba',//预告标线面积
      'properties._storage_options.tzxxk',//停止线线宽
      'properties._storage_options.tzxbxmj',//停止线标线面积
      'properties._storage_options.hColor',
      'properties._storage_options.gbm',//材料
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
      'properties._storage_options.showText',
      'properties._storage_options.fontSize'
    ];
  },

  CLASS_NAME: 'rxhdx',
  getClassName: function() {
    return this.CLASS_NAME;
  },

  getDisplayName: function(){
    var displayName = L.Storage.FeatureMixin.getDisplayName.call(this)
    var sn = this.getOption('sn')
    if(sn){
      displayName = displayName + '_' +  L.Storage.LmdFeatureMixin.showSubNice.call(this,sn)
    }
    return displayName
  },

  edit: function(e) {
    if(!this.map.editEnabled) {
        return false
    }

    //修改label代码
    var builder = L.Storage.LmdFeatureMixin.edit.call(this, e);
    var gba = builder && builder.helpers['properties._storage_options.gba']
    var lane = builder && builder.helpers['properties._storage_options.lane']
    gba && gba.label && (gba.label.innerHTML = '预告标线面积(平方米)')
    lane && lane.label && (lane.label.innerHTML = '设置道数(一个交叉口可能设置多个人行横道)')
  },


  getStringMap: function( type ){
    var stringMap = L.Storage.FeatureMixin.getStringMap.call(this)
    stringMap['roadWidth2'] = this.getOption('roadWidth2')
    stringMap['roadWidth'] = this.getOption('roadWidth')
    stringMap['roadWidth3'] = this.getOption('roadWidth3')
    stringMap['gbs'] = this.getOption('gbs')
    stringMap['gbn'] = this.getOption('gbn')
    stringMap['gba'] = this.getOption('gba')
    stringMap['lane'] = this.getOption('lane') || 1
    stringMap['ygbxszgs'] = this.getOption('ygbxszgs')
    stringMap['tzxbxmj'] = this.getOption('tzxbxmj')
    if(type === 1){
        stringMap['gba'] = +stringMap['gbn'] + (+stringMap['gba']);
    }
    return stringMap
  },

});

//j减速丘统计
lmd.tjRxhdx = function(){
  var data = []
  var titles = {no:'序号',
                sn: '桩号',
                roadWidth2: '道路宽度',
                roadWidth: '设置宽度',
                roadWidth3: '线宽',
                gbs: '间距',
                lane: '设置道数',
                gbn: '数量',
                ygbxszgs: '预告标线设置个数',
                gba: '预告标线面积(平方米)',
                tzxbxmj: '停止线标线面积',
                name: '名称',
                ds: '状态',
                description:'备注'
              }
  data.push(lmd.objectToArray(titles))
  delete titles.no

  //this means map
  var i = 1
  this.eachLayerFeature(function (feature) {
      if(feature.getClassName() === L.Storage.Rxhdx.prototype.CLASS_NAME){
        data.push(lmd.getTjData(feature,i,titles))
        i++
      }
  })

  lmd.processData(data)
  new CsvGenerator(data,  '人行横道线.csv').download(true);
}

lmd.tjs.push({ label: '人行横道线', process: lmd.tjRxhdx});


L.Storage.DataLayer.prototype._pointToClass[L.Storage.Rxhdx.prototype.CLASS_NAME] = L.Storage.Rxhdx;

L.S.Editable.prototype.createRxhdx = function( latlng ){
   return new L.Storage.Rxhdx(this.map, latlng)
};

L.Editable.prototype.startRxhdx = function(latlng,options){
  latlng = latlng || this.map.getCenter();
  var label = this.createRxhdx(latlng, options);
  this.connectCreatedToMap(label);
  var editor = label.enableEdit();
  editor.startDrawing();
  return label;
};

L.Storage.Map.include({
  startRxhdx: function(){
      return this.editTools.startRxhdx();
  }
});

L.Storage.SubDrawRxhdxAction = L.Storage.SubAction.extend({

    options: {
        toolbarIcon: {
          html: '人行横道线',
          tooltip: '人行横道线,斑马线'
        }
    },

    addHooks: function () {
        this.map.startRxhdx();
        L.Storage.SubAction.prototype.addHooks.call(this)
    }
});

L.Storage.DrawAllBiaoxianAction.prototype.options.subActions.push(L.Storage.SubDrawRxhdxAction);
