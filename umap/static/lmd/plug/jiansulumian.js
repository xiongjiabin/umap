/*
减速路面，不可见
2017-5-17
*/

L.Storage.JianSuLuMian = L.Storage.Hide.extend({
  defaultName: '减速路面',
  CLASS_NAME: 'jslm',

  preInit: function(){

    if (!this.properties._storage_options.category) {
       this.properties._storage_options['category'] = "1";
       this.properties.name = this.defaultName;
    }
    return L.Storage.Hide.prototype.preInit.call(this)
  },

  getDisplayName: function(){

    var sn = this.getOption('sn')
    var snString = sn ? L.Storage.LmdFeatureMixin.showSubNice.call(this,sn):''
    var category = this.getOption('category') || 1;
    var categoryStr = lmd.getOptionsToMap(this.categoryOptions)[category] || '';
    return '<tspan x=0 dy=0>**' + this.properties.name + '-' + categoryStr + '**</tspan>'+
           '<tspan x=0 dy=1.2em>(' + snString + ')</tspan>'
  },

  getBasicOptions: function(){
    return [
    'properties._storage_options.lr',
    'properties._storage_options.category',//天然块石，预知水泥混泥土
    'properties._storage_options.sn',
    'properties._storage_options.gbw',//线宽
    'properties._storage_options.gbl',//总长
    'properties._storage_options.ds', //设施状态
    ]
  },

  getClassName: function(){
     return this.CLASS_NAME
  },

  isHide: function(){
     return true
  },

  categoryOptions: [ ["1","天然块石"],["2","预制水泥混凝土块"]],
  edit: function(e){
    if(!this.map.editEnabled) {
        return false
    }

    (L.FormBuilder.CustomerSwitcher) &&
    (L.FormBuilder.CustomerSwitcher.prototype.selectOptions = this.categoryOptions);

    var builder = L.Storage.Hide.prototype.edit.call(this,e);
    var gbwControl = builder && builder.helpers['properties._storage_options.gbw'];
    (gbwControl && gbwControl.label) && (gbwControl.label.innerHTML = '设置宽度(m)');
    var gblControl = builder && builder.helpers['properties._storage_options.gbl'];
    (gblControl && gblControl.label) && (gblControl.label.innerHTML = '设置长度(m)');
    return builder;
  },

  resetTooltip: function(e){
    if(!e) return
    L.Storage.Hide.prototype.resetTooltip.call(this,e);
  },

  getStringMap: function(){
    var stringMap = L.Storage.Hide.prototype.getStringMap.call(this);
    var category = +(this.getOption('category') || 1);
    stringMap['category'] = lmd.getOptionsToMap(this.categoryOptions)[category] || '';

    return stringMap;
  },

});

//车行道统计
lmd.tjJinaSuLuMian = function(){
  var data = []
  var titles = {no:'序号',
                sn: '桩号',
                category: '类型',
                gbw: '设置宽度(米)',
                gbl: '设置长度(米)',
                pos: '侧别',
                ds: '状态',
                description:'备注'
              }
  data.push(lmd.objectToArray(titles))
  delete titles.no

  //this means map
  var i = 1
  this.eachLayerFeature(function (feature) {
      if(feature.getClassName() === 'jslm'){
        data.push(lmd.getTjData(feature,i,titles))
        i++
      }
  })

  lmd.processData(data)
  new CsvGenerator(data,  '减速路面.csv').download(true);
}


lmd.tjs.push({ label: '减速路面', process: lmd.tjJinaSuLuMian});

L.Storage.DataLayer.prototype._pointToClass['jslm'] = L.Storage.JianSuLuMian;

L.S.Editable.prototype.createJianSuLuMian = function( latlng ){
   return new L.Storage.JianSuLuMian(this.map, latlng)
};

L.Editable.prototype.startJianSuLuMian = function(latlng,options){
  latlng = latlng || this.map.getCenter();
  var label = this.createJianSuLuMian(latlng, options);
  this.connectCreatedToMap(label);
  var editor = label.enableEdit();
  editor.startDrawing();
  return label;
};

L.Storage.Map.include({
  startJianSuLuMian: function(){
      return this.editTools.startJianSuLuMian();
  }
});

L.Storage.SubDrawJianSuLuMianAction = L.Storage.SubAction.extend({

    options: {
        toolbarIcon: {
          html: '减速路面',
          tooltip: '减速路面，不用渲染'
        }
    },

    addHooks: function () {
        this.map.startJianSuLuMian();
        L.Storage.SubAction.prototype.addHooks.call(this)
    }
});

L.Storage.DrawOtherAction.prototype.options.subActions.push(L.Storage.SubDrawJianSuLuMianAction);
