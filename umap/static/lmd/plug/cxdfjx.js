/*
车行道分界线，不可见
2017-2-13
*/

L.Storage.CxdFjx = L.Storage.Hide.extend({

  preInit: function(){

    if (!this.properties._storage_options.lineType) {
       this.properties._storage_options['lineType'] = 1;
       this.properties._storage_options['lineWidth'] = 8;
    }
    return L.Storage.Hide.prototype.preInit.call(this)
  },
  getDisplayName: function(){
    var gbss = this.getOption('gbss') || ''
    var gbse = this.getOption('gbse') || ''
    return '<tspan x=0 dy=0>**车行道分界线**</tspan>'+
           '<tspan x=0 dy=1.2em>(' + gbss + '-' + gbse + ')</tspan>'
  },

  getBasicOptions: function(){
    return [
    'properties._storage_options.lr',
    'properties._storage_options.lineType',//实线，虚线等等
    'properties._storage_options.gbss',//起始桩号
    'properties._storage_options.gbse',
    'properties._storage_options.lineWidth',//线宽
    'properties._storage_options.gbl',//总长
    'properties._storage_options.ds', //设施状态
    ]
  },

  CLASS_NAME: 'cxdfjx',
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
      ["8","8cm"],
      ["10","10cm"],
      ["15","15cm"]
    ];
    L.Storage.Hide.prototype.edit.call(this,e);
  },

  getStringMap: function(){
    var stringMap = L.Storage.Hide.prototype.getStringMap.call(this);
    var lineType = + (this.getOption('lineType') || 1);
    var lineWidth = + (this.getOption('lineWidth') || 8);
    stringMap['lineType'] = lmd.getOptionsToMap(L.FormBuilder.LineSwitcher.prototype.selectOptions)[lineType] || '';
    stringMap['lineWidth'] = lmd.getOptionsToMap(L.FormBuilder.LineWidthSwitcher.prototype.selectOptions)[lineWidth] || '';

    var area = 0;
    var len = +this.getOption('gbl');
    var speed = +(this.getOption('speed'));
    if(lineType === 1){ //虚线
      if(speed < 60) {
        area = lineWidth / 100 * len * 2 / 6;
      }else{
        area = lineWidth / 100 * len * 6 / 15;
      }
      stringMap['description'] += '设计速度:' + speed;
    }else if(lineType === 2){ //实线
      area = lineWidth / 100 * len;
    }

    area = area.toFixed(1);
    stringMap['area'] = area;
    return stringMap;
  },

});

//车行道统计
lmd.tjCxdFjx = function(){
  var data = []
  var titles = {no:'序号',
                gbss: '起始桩号',
                gbse: '结束桩号',
                lineType: '形式',
                lineWidth: '线宽(cm)',
                gbl: '长度(m)',
                area: '面积(m2)',
                pos: '侧别',
                ds: '状态',
                description:'备注'
              }
  data.push(lmd.objectToArray(titles))
  delete titles.no

  //this means map
  var i = 1
  this.eachLayerFeature(function (feature) {
      if(feature.getClassName() === L.Storage.CxdFjx.prototype.CLASS_NAME){
        data.push(lmd.getTjData(feature,i,titles))
        i++
      }
  })

  lmd.processData(data)
  new CsvGenerator(data,  '车行道分界线.csv').download(true);
}


lmd.tjs.push({ label: '车行道分界线', process: lmd.tjCxdFjx});

L.Storage.DataLayer.prototype._pointToClass[L.Storage.CxdFjx.prototype.CLASS_NAME] = L.Storage.CxdFjx;

L.S.Editable.prototype.createCxdFjx = function( latlng ){
   return new L.Storage.CxdFjx(this.map, latlng)
};

L.Editable.prototype.startCxdFjx = function(latlng,options){
  latlng = latlng || this.map.getCenter();
  var label = this.createCxdFjx(latlng, options);
  this.connectCreatedToMap(label);
  var editor = label.enableEdit();
  editor.startDrawing();
  return label;
};

L.Storage.Map.include({
  startCxdFjx: function(){
      return this.editTools.startCxdFjx();
  }
});

L.Storage.SubDrawCxdFjxAction = L.Storage.SubAction.extend({

    options: {
        toolbarIcon: {
          html: '车行道分界线',
          tooltip: '车行道分界线，不用渲染'
        }
    },

    addHooks: function () {
        this.map.startCxdFjx();
        L.Storage.SubAction.prototype.addHooks.call(this)
    }
});

L.Storage.DrawOtherAction.prototype.options.subActions.push(L.Storage.SubDrawCxdFjxAction);
