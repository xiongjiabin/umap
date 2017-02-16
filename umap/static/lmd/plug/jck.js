/*
交叉口
2017-2-13
*/

L.Storage.Jck = L.Storage.Hide.extend({

  preInit: function(){

    if (!this.properties._storage_options.crossType) {
       this.properties._storage_options['crossType'] = 1;
       this.properties._storage_options['scale'] = 5;
       this.properties._storage_options['rotate'] = 0;
       this.properties._storage_options['color'] = 'Red';
    }
    return L.Storage.Hide.prototype.preInit.call(this)
  },

  getDisplayName: function(){
    var sn = this.getOption('sn') || ''
    return '<tspan x=0 dy=0>**交叉口**</tspan>'+
           '<tspan x=0 dy=1.2em>(' + L.Storage.LmdFeatureMixin.showSubNice.call(this,sn) + ')</tspan>'
  },

  getBasicOptions: function(){
    return [
    'properties._storage_options.lr',
    'properties._storage_options.sn',//桩号
    'properties._storage_options.crossType',//交叉类型
    ]
  },

  CLASS_NAME: 'jck',
  getClassName: function(){
     return this.CLASS_NAME
  },


  getStringMap: function(){
    var stringMap = L.Storage.Hide.prototype.getStringMap.call(this);
    var crossType = + (this.getOption('crossType') || 1);
    stringMap['crossType'] = lmd.getOptionsToMap(L.FormBuilder.CrossTypeSwitcher.prototype.selectOptions)[crossType] || '';

    return stringMap;
  },

  getWarningOptions: function(){
    return [
      'properties._storage_options.jgNum',
      'properties._storage_options.jgContent',
      'properties._storage_options.ps',
      'properties._storage_options.jgSize'
    ]
  },

  getJsrxOptions: function(){
    return [
      'properties._storage_options.jsrxBx',
      'properties._storage_options.jsrxNum',
      'properties._storage_options.jsrxSize'
    ]
  },

  getTcrxOptions: function(){
    return [
      'properties._storage_options.tcrxBx',
      'properties._storage_options.tcrxNum',
      'properties._storage_options.tcrxSize'
    ]
  },

  getJsqOptions: function(){
    return [
      'properties._storage_options.jsqBx',
      'properties._storage_options.jsqBz',
      'properties._storage_options.jsqSize',
      'properties._storage_options.jsqXjjsl',
    ]
  },

  getOtherOptions: function(){
    return [
      'properties._storage_options.oQhbx',
      'properties._storage_options.oRxhd',
      'properties._storage_options.oJsbx',
      'properties._storage_options.oDkbz',
      'properties._storage_options.oQcgm',
      'properties._storage_options.oJdgz'
    ]
  },


  appendEditFieldsets: function (container) {

    var jsrxFields = this.getJsrxOptions();
    var builder = new L.S.FormBuilder(this, jsrxFields, {});
    var jsrxProperties = L.DomUtil.createFieldset(container, '减速让行(单柱式)');
    jsrxProperties.appendChild(builder.build());

    var tcrxFields = this.getTcrxOptions();
    var builder = new L.S.FormBuilder(this, tcrxFields, {});
    var tcrxProperties = L.DomUtil.createFieldset(container, '停车让行让行(单柱式)');
    tcrxProperties.appendChild(builder.build());

    var jsqFields = this.getJsqOptions();
    var builder = new L.S.FormBuilder(this, jsqFields, {});
    var jsqProperties = L.DomUtil.createFieldset(container, '减速丘');
    jsqProperties.appendChild(builder.build());

    var warningFields = this.getWarningOptions();
    var builder = new L.S.FormBuilder(this, warningFields, {});
    var warningProperties = L.DomUtil.createFieldset(container, '警告标志');
    warningProperties.appendChild(builder.build());

    var otherFields = this.getOtherOptions();
    var builder = new L.S.FormBuilder(this, otherFields, {});
    var otherProperties = L.DomUtil.createFieldset(container, '其他特性');
    otherProperties.appendChild(builder.build());

    L.Storage.Hide.prototype.appendEditFieldsets.call(this,container);
  },
});

//车行道统计
lmd.tjJck = function(){
  var data = []
  var titles = {no:'序号',
                sn: '桩号',
                crossType: '类型',
                pos: '侧别',
                description:'备注'
              }
  data.push(lmd.objectToArray(titles))
  delete titles.no

  //this means map
  var i = 1
  this.eachLayerFeature(function (feature) {
      if(feature.getClassName() === L.Storage.Jck.prototype.CLASS_NAME){
        data.push(lmd.getTjData(feature,i,titles))
        i++
      }
  })

  lmd.processData(data)
  new CsvGenerator(data,  '交叉口.csv').download(true);
}


lmd.tjs.push({ label: '交叉口', process: lmd.tjJck});

L.Storage.DataLayer.prototype._pointToClass[L.Storage.Jck.prototype.CLASS_NAME] = L.Storage.Jck;

L.S.Editable.prototype.createJck = function( latlng ){
   return new L.Storage.Jck(this.map, latlng)
};

L.Editable.prototype.startJck = function(latlng,options){
  latlng = latlng || this.map.getCenter();
  var label = this.createJck(latlng, options);
  this.connectCreatedToMap(label);
  var editor = label.enableEdit();
  editor.startDrawing();
  return label;
};

L.Storage.Map.include({
  startJck: function(){
      return this.editTools.startJck();
  }
});

L.Storage.SubDrawJckAction = L.Storage.SubAction.extend({

    options: {
        toolbarIcon: {
          html: '交叉口',
          tooltip: '定义好交叉口'
        }
    },

    addHooks: function () {
        this.map.startJck();
        L.Storage.SubAction.prototype.addHooks.call(this)
    }
});

L.Storage.DrawOtherAction.prototype.options.subActions.push(L.Storage.SubDrawJckAction);
