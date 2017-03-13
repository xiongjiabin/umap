/*
人行横道预警线，不可见
2017-2-13
*/

L.Storage.Rxhdyjx = L.Storage.Hide.extend({
  defaultName: '人行横道预警线',
  preInit: function(){

    return L.Storage.Hide.prototype.preInit.call(this)
  },
  getDisplayName: function(){
    var sn = this.getOption('sn') || ''
    var pos = this.getOption('lr') || L.FormBuilder.LeftRightChoice.prototype.default
    var posStr = lmd.getOptionsToMap(L.FormBuilder.LeftRightChoice.prototype.allChoices)[pos] || ''

    return '<tspan x=0 dy=0>**' + this.properties.name + '**</tspan>'+ posStr +
           '<tspan x=0 dy=1.2em>(' + L.Storage.LmdFeatureMixin.showSubNice.call(this,sn) + ')</tspan>'

  },

  getBasicOptions: function(){
    return [
    'properties._storage_options.lr',
    'properties._storage_options.sn',//桩号
    //'properties._storage_options.gbl',//总长
    //'properties._storage_options.gba',//面积
    'properties._storage_options.hColor',//颜色
    'properties._storage_options.gbm', //材料
    'properties._storage_options.ds', //设施状态
    ]
  },

  CLASS_NAME: 'rxhdyjx',
  getClassName: function(){
     return this.CLASS_NAME
  },

  edit: function(e){
    if(!this.map.editEnabled) {
        return false
    }

    L.FormBuilder.LeftRightChoice.prototype.choices = L.FormBuilder.LeftRightChoice.prototype.choicesLR;

    return L.Storage.LmdFeatureMixin.edit.call(this, e)

  },

  getStringMap: function(){
    var stringMap = L.Storage.Hide.prototype.getStringMap.call(this);
    var gbm = +(this.getOption('gbm'));

    stringMap['gbm'] = lmd.getOptionsToMap(L.FormBuilder.MaterialSwitcher.prototype.selectOptions)[gbm] || '';
    var hColor =  +(this.getOption('hColor'));
    stringMap['hColor'] = lmd.getOptionsToMap(L.FormBuilder.ColorSwitcher.prototype.selectOptions)[hColor] || '';
    stringMap['sortField'] = { k1: this.getOption('sn')};

    return stringMap;
  },

});

//车行道统计
lmd.tjRxhdyjx = function(){
  var data = []
  var titles = {no:'序号',
                sn: '桩号',
                //gba: '面积(m2)',
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
      if(feature.getClassName() === L.Storage.Rxhdyjx.prototype.CLASS_NAME){
        data.push(lmd.getTjData(feature,i,titles))
        i++
      }
  })

  lmd.processData(data)
  new CsvGenerator(data,  '人行横道预警线.csv').download(true);
}


lmd.tjs.push({ label: '人行横道预警线', process: lmd.tjRxhdyjx});

L.Storage.DataLayer.prototype._pointToClass[L.Storage.Rxhdyjx.prototype.CLASS_NAME] = L.Storage.Rxhdyjx;

L.S.Editable.prototype.createRxhdyjx = function( latlng ){
   return new L.Storage.Rxhdyjx(this.map, latlng)
};

L.Editable.prototype.startRxhdyjx = function(latlng,options){
  latlng = latlng || this.map.getCenter();
  var label = this.createRxhdyjx(latlng, options);
  this.connectCreatedToMap(label);
  var editor = label.enableEdit();
  editor.startDrawing();
  return label;
};

L.Storage.Map.include({
  startRxhdyjx: function(){
      return this.editTools.startRxhdyjx();
  }
});

L.Storage.SubDrawRxhdyjxAction = L.Storage.SubAction.extend({

    options: {
        toolbarIcon: {
          html: '人行横道预警线',
          tooltip: '人行横道预警线，不用渲染'
        }
    },

    addHooks: function () {
        this.map.startRxhdyjx();
        L.Storage.SubAction.prototype.addHooks.call(this)
    }
});

L.Storage.DrawAllBiaoxianAction.prototype.options.subActions.push(L.Storage.SubDrawRxhdyjxAction);
