/*
中心线单，不可见
2017-2-13
*/

L.Storage.BxZxxd = L.Storage.Hide.extend({
  defaultName: '中心线(单)',
  posData: L.FormBuilder.LeftRightChoice.prototype.choicesM,
  preInit: function(){

    if (!this.properties._storage_options.lineType) {
       this.properties._storage_options['lineType'] = "1";
       this.properties._storage_options['lineWidth'] = "10";
       this.properties._storage_options['hColor'] = "2";
       this.properties._storage_options['gbm'] = "2";
       this.properties._storage_options['lr'] =  3;
       this.properties.name = this.defaultName;
    }
    return L.Storage.Hide.prototype.preInit.call(this)
  },
  getDisplayName: function(){
    var gbss = this.getOption('gbss') || ''
    var gbse = this.getOption('gbse') || ''
    var snsString = L.Storage.LmdFeatureMixin.showSubNice.call(this,gbss);
    var sneString = L.Storage.LmdFeatureMixin.showSubNice.call(this,gbse);

    var lineType = this.getOption('lineType') || 2;
    var lineTypeStr = lmd.getOptionsToMap(L.FormBuilder.LineSwitcher.prototype.allSelectOptions)[lineType] || '';
    return '<tspan x=0 dy=0>**' + this.properties.name + '-' + lineTypeStr + '**</tspan>'+
           '<tspan x=0 dy=1.2em>(' + snsString + '-' + sneString + ')</tspan>'
  },

  getBasicOptions: function(){
    return [
    'properties._storage_options.lr',
    'properties._storage_options.lineType',//实线，虚线等等
    'properties._storage_options.gbss',//起始桩号
    'properties._storage_options.gbse',
    'properties._storage_options.lineWidth',//线宽
    'properties._storage_options.gbl',//总长
    'properties._storage_options.gba',//面积
    'properties._storage_options.hColor',//颜色
    'properties._storage_options.gbm', //材料
    'properties._storage_options.ds', //设施状态
    ]
  },

  CLASS_NAME: 'bxzxxd',
  getClassName: function(){
     return this.CLASS_NAME
  },

  edit: function(e){
    if(!this.map.editEnabled) {
        return false
    }

    L.FormBuilder.LineSwitcher.prototype.selectOptions = [
        ["1","虚线"],
        ["2","实线"]
    ];
    L.FormBuilder.LineWidthSwitcher.prototype.selectOptions = [
      ["10","10cm"],
      ["15","15cm"],
      ["30","30cm"]
    ];

    var builder = L.Storage.Hide.prototype.edit.call(this,e);

    return builder;
  },

  resetTooltip: function(e){
    if(!e) return
    L.Storage.Hide.prototype.resetTooltip.call(this,e);

    //处理面积部分计算
    if(e.helper.name in {'gbss':0,'gbse':0,'gbl':0, 'lane':0, 'lineWidth':0, 'lineType':0, 'lr': 0}){
      var lineType = + (this.getOption('lineType') || 1);
      var lineWidth = + (this.getOption('lineWidth') || 10);
      var lane = 1;
      var gbaControl = e.target.helpers['properties._storage_options.gba']

      var area = 0;
      var len = +this.getOption('gbl');
      if(lineType === 1){ //虚线
        area = 0.4 * len * lineWidth / 100;
      }else if(lineType === 2){ //实线
        area = len * lineWidth / 100;
      }
      area = (area * lane).toFixed(2);
      this.properties._storage_options.gba = gbaControl.input.value = area;
    }
  },

  getStringMap: function(){
    var stringMap = L.Storage.Hide.prototype.getStringMap.call(this);
    var lineType = + (this.getOption('lineType') || 1);
    var lineWidth = + (this.getOption('lineWidth') || 10);
    var hColor =  +(this.getOption('hColor'));
    var gbm = +(this.getOption('gbm'));
    stringMap['lineType'] = lmd.getOptionsToMap(L.FormBuilder.LineSwitcher.prototype.allSelectOptions)[lineType] || '';
    stringMap['lineWidth'] = lmd.getOptionsToMap(L.FormBuilder.LineWidthSwitcher.prototype.allSelectOptions)[lineWidth] || '';
    stringMap['hColor'] = lmd.getOptionsToMap(L.FormBuilder.ColorSwitcher.prototype.selectOptions)[hColor] || '';
    stringMap['gbm'] = lmd.getOptionsToMap(L.FormBuilder.MaterialSwitcher.prototype.selectOptions)[gbm] || '';

    return stringMap;
  },

});

//车行道统计
lmd.tjBxZxxd = function(){
  var data = []
  var titles = {no:'序号',
                gbss: '起始桩号',
                gbse: '结束桩号',
                lineType: '形式',
                lineWidth: '线宽(cm)',
                gbl: '长度(m)',
                area: '面积(m2)',
                pos: '侧别',
                hColor: '颜色',
                gbm: '材料',
                ds: '状态',
                description:'备注'
              }
  data.push(lmd.objectToArray(titles))
  delete titles.no

  //this means map
  var i = 1
  this.eachLayerFeature(function (feature) {
      if(feature.getClassName() === L.Storage.BxZxxd.prototype.CLASS_NAME){
        data.push(lmd.getTjData(feature,i,titles))
        i++
      }
  })

  lmd.processData(data)
  new CsvGenerator(data,  '中心线单.csv').download(true);
}


lmd.tjs.push({ label: '中心线单', process: lmd.tjBxZxxd});

L.Storage.DataLayer.prototype._pointToClass[L.Storage.BxZxxd.prototype.CLASS_NAME] = L.Storage.BxZxxd;

L.S.Editable.prototype.createBxZxxd = function( latlng ){
   return new L.Storage.BxZxxd(this.map, latlng)
};

L.Editable.prototype.startBxZxxd = function(latlng,options){
  latlng = latlng || this.map.getCenter();
  var label = this.createBxZxxd(latlng, options);
  this.connectCreatedToMap(label);
  var editor = label.enableEdit();
  editor.startDrawing();
  return label;
};

L.Storage.Map.include({
  startBxZxxd: function(){
      return this.editTools.startBxZxxd();
  }
});

L.Storage.SubDrawBxZxxdAction = L.Storage.SubAction.extend({

    options: {
        toolbarIcon: {
          html: '中心线(单)',
          tooltip: '中心线(单),不用渲染'
        }
    },

    addHooks: function () {
        this.map.startBxZxxd();
        L.Storage.SubAction.prototype.addHooks.call(this)
    }
});

L.Storage.DrawAllBiaoxianAction.prototype.options.subActions.push(L.Storage.SubDrawBxZxxdAction);
