/*
立面/实体标记，不可见
2017-2-13
*/

L.Storage.Lmbj = L.Storage.Hide.extend({
  defaultName: '立面/实体标记',
  preInit: function(){

    return L.Storage.Hide.prototype.preInit.call(this)
  },
  getDisplayName: function(){
    var gbss = this.getOption('gbss') || ''
    var gbse = this.getOption('gbse') || ''
    var pos = this.getOption('lr') || L.FormBuilder.LeftRightChoice.prototype.default
    var posStr = lmd.getOptionsToMap(L.FormBuilder.LeftRightChoice.prototype.allChoices)[pos] || ''
    return '<tspan x=0 dy=0>**' + this.properties.name + '**</tspan>' +
           '<tspan x=0 dy=1.2em>(' + gbss + '-' + gbse + ')</tspan>' + posStr;
  },

  getBasicOptions: function(){
    return [
    'properties._storage_options.lr',
    'properties._storage_options.gbss',//起始桩号
    'properties._storage_options.gbse',
    //'properties._storage_options.gbl',//总长
    'properties._storage_options.gba',//面积
    //'properties._storage_options.hColor',//颜色
    'properties._storage_options.lmbjm', //材料
    'properties._storage_options.ds', //设施状态
    ]
  },

  CLASS_NAME: 'lmbj',
  getClassName: function(){
     return this.CLASS_NAME
  },

  edit: function(e){
    if(!this.map.editEnabled) {
        return false
    }

    L.FormBuilder.LeftRightChoice.prototype.choices = L.FormBuilder.LeftRightChoice.prototype.choicesLRBoth;

    return L.Storage.LmdFeatureMixin.edit.call(this, e)

  },

  getStringMap: function(){
    var stringMap = L.Storage.Hide.prototype.getStringMap.call(this);
    var gba =  +(this.getOption('gba'));
    var lmbjm = +(this.getOption('lmbjm'));

    stringMap['gba'] = gba;
    stringMap['lmbjm'] = lmd.getOptionsToMap(L.FormBuilder.LmbjMaterialSwitcher.prototype.selectOptions)[lmbjm] || '';

    return stringMap;
  },

});

//车行道统计
lmd.tjLmbj = function(){
  var data = []
  var titles = {no:'序号',
                gbss: '起始桩号',
                gbse: '结束桩号',
                gba: '面积(m2)',
                pos: '侧别',
                //hColor: '颜色',
                lmbjm: '材料',
                ds: '状态',
                description:'备注'
              }
  data.push(lmd.objectToArray(titles))
  delete titles.no

  //this means map
  var i = 1
  this.eachLayerFeature(function (feature) {
      if(feature.getClassName() === L.Storage.Lmbj.prototype.CLASS_NAME){
        data.push(lmd.getTjData(feature,i,titles))
        i++
      }
  })

  lmd.processData(data)
  new CsvGenerator(data,  '立面标记.csv').download(true);
}


lmd.tjs.push({ label: '立面/实体标记', process: lmd.tjLmbj});

L.Storage.DataLayer.prototype._pointToClass[L.Storage.Lmbj.prototype.CLASS_NAME] = L.Storage.Lmbj;

L.S.Editable.prototype.createLmbj = function( latlng ){
   return new L.Storage.Lmbj(this.map, latlng)
};

L.Editable.prototype.startLmbj = function(latlng,options){
  latlng = latlng || this.map.getCenter();
  var label = this.createLmbj(latlng, options);
  this.connectCreatedToMap(label);
  var editor = label.enableEdit();
  editor.startDrawing();
  return label;
};

L.Storage.Map.include({
  startLmbj: function(){
      return this.editTools.startLmbj();
  }
});

L.Storage.SubDrawLmbjAction = L.Storage.SubAction.extend({

    options: {
        toolbarIcon: {
          html: '立面/实体标记',
          tooltip: '立面/实体标记，不用渲染'
        }
    },

    addHooks: function () {
        this.map.startLmbj();
        L.Storage.SubAction.prototype.addHooks.call(this)
    }
});

L.Storage.DrawAllBiaoxianAction.prototype.options.subActions.push(L.Storage.SubDrawLmbjAction);
