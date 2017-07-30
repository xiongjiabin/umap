L.Storage.LineLure = L.Storage.Guardbar.extend({
  gbType: L.Storage.GB_TYPE_LINELURE,
  defaultName: '单柱式',
  CLASS_ALIAS: '线性诱导(横向)',
  CLASS_NAME: 'linelure',

  getBasicOptions: function () {
      return [
        'properties._storage_options.gbc',//类别
        'properties._storage_options.lr',
        'properties._storage_options.direction',//方向
        'properties._storage_options.msh', // 内容
        'properties._storage_options.mss', //速度&尺寸
        'properties._storage_options.gbss',//起始桩号
        'properties._storage_options.gbse',
        'properties._storage_options.gbl',//总长
        'properties._storage_options.gbs',//间距
        'properties._storage_options.gbn',//数量
        'properties._storage_options.diameter',//立柱直径
        'properties._storage_options.ds',
      ];
  },

  resetTooltip: function(e){
    L.Storage.Guardbar.prototype.resetTooltip.call(this,e);

    if(!e) return
    var selfValue = e.helper.value()

    if (e.helper.name === 'msh') {
        this._follow();
    }
  },

  //显示的名字不随着类型变化而变化
  getClassAlias: function(){
      return this.CLASS_ALIAS;
  },
 //加上图片处理
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

    var msh = this.getOption('msh') || 1;
    var size = 18;
    var color = this.getOption('color') || "Blue";
    var tail = +this.getOption('tail') || (15 * text.length);
    var formatText = '<text  font-size="' + size + '">' + text + '</text>' +
                     '<path stroke-width="2px" stroke-opacity="1" stroke="' + color + '" fill="none" d="m 0,8 ' + tail + ',0"></path>' +
                     '<image xlink:href="/static/storage/src/img/' + this.MT + '/' + this.MIC + '/' + msh +
                     '.png" x = ' + (tail + 10) + ' y="-30"' + '  height="60" />';

    var options = {
      rotate: +this.getOption('rotate'),
      color: this.getOption('color'),
      svgText: formatText,
      interactive: false
    };

    var scaleZoom = lmd.getLmdZoom(this.map)
    var scale = this.getOption('scale');
    (scale === null) && (scale = 10);
    options['scale'] = (+scale) * scaleZoom;


    var txtX = +this.getOption('textX');
    var txtY = +this.getOption('textY');

    var scaleZoom = lmd.getLmdZoom(this.map);
    var centerPoint = this.map.latLngToLayerPoint({lat:lat,lng:lng});
    var destX = centerPoint['x'] + txtX * scaleZoom;
    var destY = centerPoint['y'] + txtY * scaleZoom;
    var latlng = this.map.layerPointToLatLng([destX, destY]);

    if (!this.textHelpObject) {
        this.textHelpObject = new L.SVGObject(latlng, options).addTo(this.map);
    }else{
        this.textHelpObject.setSvgText(formatText)
                           .updateStyle(options)
                           .setLatLng(latlng);
    }
  },

  MT:4,
  MIC:1,
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
        L.FormBuilder.LeftRightChoice.prototype.choices = L.FormBuilder.LeftRightChoice.prototype.choicesNoMBoth;

        return L.Storage.LmdFeatureMixin.edit.call(this, e);

    }
  },

  getStringMap: function(){
      var stringMap = L.Storage.Guardbar.prototype.getStringMap.call(this);
      var direction = this.getOption('direction') || 1;
      var msh = this.getOption('msh');
      var mss = this.getOption('mss');
      var diameter = this.getOption('diameter');

      stringMap['diameter'] =  lmd.getOptionsToMap(L.FormBuilder.DiameterSwitcher.prototype.selectOptions)[diameter] || '';
      var result = lmd.getMarkerCategoryValue({mt: this.MT, mic: this.MIC, msh: msh, mss: mss });
      stringMap['msh'] = result['msh'];
      stringMap['mss'] = result['mss'];

      stringMap['direction'] = lmd.getOptionsToMap(L.FormBuilder.FangxiangChoice.prototype.choices)[direction] || ''

      stringMap['name'] = stringMap['name'] + this.CLASS_ALIAS;
      return stringMap;
  }
});


//线性诱导标统计
lmd.tjLineLure = function(){
  var data = []
  var titles = {no:'序号',
                name: '类型',
                gbss: '起始桩号',
                gbse: '结束桩号',
                pos: '侧别',
                direction: '方向',
                gbl: '长度(米)',
                gbs: '间距(米)',
                gbn: '数量(个)',
                msh: '标志',
                mss: '标志尺寸',
                diameter: '立柱直径',
                ds: '状态',
                description:'备注'
              }
  data.push(lmd.objectToArray(titles))
  delete titles.no

  //this means map
  var i = 1
  var className = null;
  this.eachLayerFeature(function (feature) {
      className = feature.getClassName();
      if(className === L.Storage.LineLure.prototype.CLASS_NAME ||
         className === L.Storage.ZongLineLure.prototype.CLASS_NAME) {
          data.push(lmd.getTjData(feature,i,titles))
          i++
      }
  })

  lmd.processData(data)
  new CsvGenerator(data,  '线性诱导标.csv').download(true);
}


lmd.tjs.push({ label: '线性诱导标', process: lmd.tjLineLure});

L.Storage.DataLayer.prototype._lineToClass[L.Storage.LineLure.prototype.CLASS_NAME] = L.Storage.LineLure;

L.S.Editable.prototype.createLineLure = function( latlng ){
   return new L.Storage.LineLure(this.map, latlng)
};

L.Editable.prototype.startLineLure = function(latlng,options){
   var line = this.createLineLure([], options);
   this.connectCreatedToMap(line);
   line.enableEdit().newShape(latlng);
   return line;
};

L.Storage.Map.include({
  startLineLure: function(){
    return this.editTools.startLineLure();
  }
});

L.Storage.SubDrawLineLureAction = L.Storage.SubAction.extend({

    options: {
        toolbarIcon: {
          html: '线性诱导标(横向)',
          tooltip: '包含横向线性诱导标'
        }
    },

    addHooks: function () {
        this.map.startLineLure();
        L.Storage.SubAction.prototype.addHooks.call(this)
    }
});

L.Storage.DrawAllLureAction.prototype.options.subActions.push(L.Storage.SubDrawLineLureAction);
