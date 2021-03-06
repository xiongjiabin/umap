/*
中心线双，不可见
2017-2-13
*/

L.Storage.BxZxxs = L.Storage.Hide.extend({
  defaultName: '中心线(双)',
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

  CLASS_NAME: 'bxzxxs',
  getClassName: function(){
     return this.CLASS_NAME
  },

  edit: function(e){
    if(!this.map.editEnabled) {
        return false
    }

    L.FormBuilder.LineSwitcher.prototype.selectOptions = [
        ["3","虚实线"],
        ["4","双实线"]
    ];
    L.FormBuilder.LineWidthSwitcher.prototype.selectOptions = [
        ["10","10cm"],
        ["15","15cm"]
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
        if(lineType === 3){ //虚实线
            area = 1.4 * len * lineWidth / 100;
        }else if(lineType === 4){ //双实线
            area = 2* len * lineWidth / 100;
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
lmd.tjBxZxxs = function(){
  var data = []
  var titles = {no:'序号',
                gbss: '起始桩号',
                gbse: '结束桩号',
                lineType: '形式',
                lineWidth: '线宽(cm)',
                gbl: '长度(m)',
                gba: '面积(m2)',
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
      if(feature.getClassName() === L.Storage.BxZxxs.prototype.CLASS_NAME){
        data.push(lmd.getTjData(feature,i,titles))
        i++
      }
  })

  lmd.processData(data)
  new CsvGenerator(data,  '中心线(双).csv').download(true);
}


lmd.tjs.push({ label: '中心线(双)', process: lmd.tjBxZxxs});

L.Storage.DataLayer.prototype._pointToClass[L.Storage.BxZxxs.prototype.CLASS_NAME] = L.Storage.BxZxxs;

L.S.Editable.prototype.createBxZxxs = function( latlng ){
   return new L.Storage.BxZxxs(this.map, latlng)
};

L.Editable.prototype.startBxZxxs = function(latlng,options){
  latlng = latlng || this.map.getCenter();
  var label = this.createBxZxxs(latlng, options);
  this.connectCreatedToMap(label);
  var editor = label.enableEdit();
  editor.startDrawing();
  return label;
};

L.Storage.Map.include({
  startBxZxxs: function(){
      return this.editTools.startBxZxxs();
  }
});

L.Storage.SubDrawBxZxxsAction = L.Storage.SubAction.extend({

    options: {
        toolbarIcon: {
          html: '中心线(双)',
          tooltip: '中心线(双),不用渲染'
        }
    },

    addHooks: function () {
        this.map.startBxZxxs();
        L.Storage.SubAction.prototype.addHooks.call(this)
    }
});

L.Storage.DrawAllBiaoxianAction.prototype.options.subActions.push(L.Storage.SubDrawBxZxxsAction);
