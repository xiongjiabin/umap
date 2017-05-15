/*
车行道边缘线，不可见
2017-2-13
*/

L.Storage.CheXingDao = L.Storage.Hide.extend({
  defaultName: '车行道边缘线',

  preInit: function(){

    if (!this.properties._storage_options.lineType) {
       this.properties._storage_options['lineType'] = "2";
       this.properties._storage_options['lineWidth'] = "10";
       this.properties._storage_options['lane'] = 1;
       this.properties._storage_options['hColor'] = "2";
       this.properties._storage_options['gbm'] = "2";
       this.properties.name = this.defaultName;
    }
    return L.Storage.Hide.prototype.preInit.call(this)
  },

  getDisplayName: function(){

    var gbss = this.getOption('gbss') || ''
    var gbse = this.getOption('gbse') || ''
    var lineType = this.getOption('lineType') || 2;
    var lineTypeStr = lmd.getOptionsToMap(L.FormBuilder.LineSwitcher.prototype.allSelectOptions)[lineType] || '';
    return '<tspan x=0 dy=0>**' + this.properties.name + '-' + lineTypeStr + '**</tspan>'+
           '<tspan x=0 dy=1.2em>(' + gbss + '-' + gbse + ')</tspan>'
  },

  getBasicOptions: function(){
    return [
    'properties._storage_options.lr',
    'properties._storage_options.lineType',//实线，虚线等等
    'properties._storage_options.gbss',//起始桩号
    'properties._storage_options.gbse',
    'properties._storage_options.lineWidth',//线宽
    'properties._storage_options.lane',//道数
    'properties._storage_options.gbl',//总长
    'properties._storage_options.gba',//面积
    'properties._storage_options.hColor',//颜色
    'properties._storage_options.gbm',//材料
    'properties._storage_options.ds', //设施状态
    ]
  },

  getClassName: function(){
     return 'cxd'
  },

  isHide: function(){
     return true
  },

  edit: function(e){
    if(!this.map.editEnabled) {
        return false
    }

    L.FormBuilder.LineSwitcher.prototype.selectOptions = [
        ["1","虚线"],
        ["2","实线"],
        ["3","虚实线"]
    ];
    L.FormBuilder.LineWidthSwitcher.prototype.selectOptions = [
      ["10","10cm"],
      ["15","15cm"],
      ["20","20cm"]
    ];
    var builder = L.Storage.Hide.prototype.edit.call(this,e);
    //var laneControl = builder && builder.helpers['properties._storage_options.lane'];
    //(laneControl && laneControl.label) && (laneControl.label.innerHTML = '条数');
    return builder;
  },

  resetTooltip: function(e){
    if(!e) return
    L.Storage.Hide.prototype.resetTooltip.call(this,e);

    //处理面积部分计算
    if(e.helper.name in {'gbss':0,'gbse':0,'gbl':0, 'lane':0, 'lineWidth':0, 'lineType':0}){
      var lineType = + (this.getOption('lineType') || 1);
      var lineWidth = + (this.getOption('lineWidth') || 10);
      var lane = +(this.getOption('lane') || 1);
      var gbaControl = e.target.helpers['properties._storage_options.gba']

      var area = 0;
      var len = +this.getOption('gbl');
      if(lineType === 1){ //虚线
        area = lineWidth / 100 * len * 2 / 6
      }else if(lineType === 2){ //实线
        area = lineWidth / 100 * len;
      }else if(lineType === 3){
        area = lineWidth / 100 * len * (1 + 2/6);
      }
      area = (area * lane).toFixed(1);
      this.properties._storage_options.gba = gbaControl.input.value = area
    }
  },

  getStringMap: function(){
    var stringMap = L.Storage.Hide.prototype.getStringMap.call(this);
    var lineType = + (this.getOption('lineType') || 1);
    var lineWidth = + (this.getOption('lineWidth') || 10);
    var lane = +(this.getOption('lane') || 1);
    var hColor =  +(this.getOption('hColor'));
    var gbm = +(this.getOption('gbm'));
    stringMap['lineType'] = lmd.getOptionsToMap(L.FormBuilder.LineSwitcher.prototype.allSelectOptions)[lineType] || '';
    stringMap['lineWidth'] = lmd.getOptionsToMap(L.FormBuilder.LineWidthSwitcher.prototype.allSelectOptions)[lineWidth] || '';
    stringMap['lane'] = lane;
    stringMap['hColor'] = lmd.getOptionsToMap(L.FormBuilder.ColorSwitcher.prototype.selectOptions)[hColor] || '';
    stringMap['gbm'] = lmd.getOptionsToMap(L.FormBuilder.MaterialSwitcher.prototype.selectOptions)[gbm] || '';

    return stringMap;
  },

});

//车行道统计
lmd.tjCheXingDao = function(){
  var data = []
  var titles = {no:'序号',
                gbss: '起始桩号',
                gbse: '结束桩号',
                lineType: '形式',
                lineWidth: '线宽(cm)',
                lane: '道数',
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
      if(feature.getClassName() === 'cxd'){
        data.push(lmd.getTjData(feature,i,titles))
        i++
      }
  })

  lmd.processData(data)
  new CsvGenerator(data,  '车行道边缘线.csv').download(true);
}


lmd.tjs.push({ label: '车行道边缘线', process: lmd.tjCheXingDao});

L.Storage.DataLayer.prototype._pointToClass['cxd'] = L.Storage.CheXingDao;

L.S.Editable.prototype.createCheXingDao = function( latlng ){
   return new L.Storage.CheXingDao(this.map, latlng)
};

L.Editable.prototype.startCheXingDao = function(latlng,options){
  latlng = latlng || this.map.getCenter();
  var label = this.createCheXingDao(latlng, options);
  this.connectCreatedToMap(label);
  var editor = label.enableEdit();
  editor.startDrawing();
  return label;
};

L.Storage.Map.include({
  startCheXingDao: function(){
      return this.editTools.startCheXingDao();
  }
});

L.Storage.SubDrawCheXingDaoAction = L.Storage.SubAction.extend({

    options: {
        toolbarIcon: {
          html: '车行道边缘线',
          tooltip: '车行道边缘线，不用渲染'
        }
    },

    addHooks: function () {
        this.map.startCheXingDao();
        L.Storage.SubAction.prototype.addHooks.call(this)
    }
});

L.Storage.DrawAllBiaoxianAction.prototype.options.subActions.push(L.Storage.SubDrawCheXingDaoAction);
