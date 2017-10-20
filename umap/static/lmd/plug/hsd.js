L.Storage.HuangShanDeng = L.Storage.SVGObject.extend({
  CLASS_ALIAS: '黄闪灯',
  CLASS_NAME: 'hsd',
  defaultColor: 'white',
  GuardbarCatSwitcher:[
      ["1","单柱式"],
      ["2","附着式"],
      ["3","悬臂式"]
  ],
  picUrl: "/static/storage/src/img/hsd.png",

  preInit: function() {
      if (!this.properties['className']) {
          this.properties['className'] = this.getClassName()

          this.properties._storage_options = {
              gbc: 1,
              scale:  10,
              rotate:  0,
              color: this.defaultColor,
              sn: '',
              gbn: 1,
              lr: 1,
          }
          this.properties.name = lmd.getOptionsToMap(this.GuardbarCatSwitcher)[this.properties._storage_options['gbc']] || '';
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

  getBasicOptions: function () {
      var props = [
          'gbc',//类别
          'lr', //侧别
          'sn',//桩号
          'gbn',//数量
          'ds', //状态
      ];
      return L.Storage.FeatureMixin.addPropertiesPrex(props);
  },

  getShapeOptions: function() {
      var props = [
          'color', //颜色
          'rotate', //旋转
          'scale', //放大缩小
          'tail' //尾巴
      ];
      return L.Storage.FeatureMixin.addPropertiesPrex(props);
  },

  getSvgData() {
      var sn = this.getOption('sn');
      var snTxt = sn ? L.Storage.LmdFeatureMixin.showSubNice.call(this,sn) : '';

      //图片加载需要更换
      var text = snTxt + ' ' + this.CLASS_ALIAS + '(' + this.properties.name + ')';
      var size = 18;
      var color = this.map.getRenderColor(this.getOption('color') || this.defaultColor);
      var tail = +this.getOption('tail') || (18 * text.length);
      var svgStr = '<text x="20" font-size="' + size + '">' + text + '</text>' +
                       '<path stroke-width="2px" stroke-opacity="1" stroke="' + color + '" fill="none" d="m 20,8 ' + tail + ',0"></path>' +
                       '<image xlink:href="' + this.picUrl + '" x = ' + (tail + 35) + ' y="-30"' + '  height="60" />';

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
     }else if(e.helper.name === 'gbc'){
        this.updateName(e);
        this.setSvgText(this.getSvgData())
     }
  },

  edit: function(e) {
    if(this.map.editEnabled) {
        if (!this.editEnabled()) this.enableEdit();

        var builder = L.Storage.LmdFeatureMixin.edit.call(this, e)

        L.FormBuilder.GuardbarCatSwitcher.prototype.selectOptions = this.GuardbarCatSwitcher;

        //只有左右，中间
        L.FormBuilder.LeftRightChoice.prototype.choices = L.FormBuilder.LeftRightChoice.prototype.choicesLRM;

        return L.Storage.LmdFeatureMixin.edit.call(this, e);
    }
  },


  getDisplayName: function(){
    var displayName = L.Storage.FeatureMixin.getDisplayName.call(this) || this.CLASS_ALIAS;
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
      stringMap['gbn'] = +this.getOption('gbn');
      return stringMap;
  }
});

lmd.tjHuangShanDeng = function(){
    var data = []
    var titles = {no:'序号',
                sn: '桩号',
                pos: '侧别',
                name: '类别',
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
        if(className === L.Storage.HuangShanDeng.prototype.CLASS_NAME) {
            data.push(lmd.getTjData(feature,i,titles))
            i++
        }
    })

    lmd.processData(data)
    new CsvGenerator(data,  '黄闪灯.csv').download(true);
}
lmd.tjs.push({ label: '黄闪灯', process: lmd.tjHuangShanDeng});

L.Storage.DataLayer.prototype._pointToClass['hsd'] = L.Storage.HuangShanDeng;

L.S.Editable.prototype.createHuangShanDeng = function( latlng ){
   return new L.Storage.HuangShanDeng(this.map, latlng)
};

L.Editable.prototype.startHuangShanDeng = function(latlng,options){
  latlng = latlng || this.map.getCenter();
  var label = this.createHuangShanDeng(latlng, options);
  this.connectCreatedToMap(label);
  var editor = label.enableEdit();
  editor.startDrawing();
  return label;
};

L.Storage.Map.include({
  startHuangShanDeng: function(){
      return this.editTools.startHuangShanDeng();
  }
});

L.Storage.SubDrawHuangShanDengAction = L.Storage.SubAction.extend({

    options: {
        toolbarIcon: {
          html: '黄闪灯',
          tooltip: '黄闪灯'
        }
    },

    addHooks: function () {
        this.map.startHuangShanDeng();
        L.Storage.SubAction.prototype.addHooks.call(this)
    }
});

L.Storage.DrawAllLureAction.prototype.options.subActions.push(L.Storage.SubDrawHuangShanDengAction);
