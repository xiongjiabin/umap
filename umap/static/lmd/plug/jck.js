/*
交叉口
2017-2-13
*/

L.Storage.Jck = L.Storage.Hide.extend({
  defaultName: '交叉口',

  preInit: function(){

    if (!this.properties._storage_options.crossType) {
       this.properties._storage_options['crossType'] = "1";
       this.properties._storage_options['scale'] = 5;
       this.properties._storage_options['rotate'] = 0;
       this.properties._storage_options['color'] = 'Red';
       this.properties.name = this.defaultName;
    }
    return L.Storage.Hide.prototype.preInit.call(this)
  },

  getDisplayName: function(){
    var sn = this.getOption('sn') || ''
    return '<tspan x=0 dy=0>**' + this.properties.name + '**</tspan>'+
           '<tspan x=0 dy=1.2em>(' + L.Storage.LmdFeatureMixin.showSubNice.call(this,sn) + ')</tspan>'
  },

  getBasicOptions: function(){
    return [
    'properties._storage_options.lr',
    'properties._storage_options.sn',//桩号
    'properties._storage_options.crossType',//交叉类型
    'properties._storage_options.bjdKd',//被交道宽度
    ]
  },

  CLASS_NAME: 'jck',
  getClassName: function(){
     return this.CLASS_NAME
  },


  getStringMap: function(){
    var stringMap = L.Storage.Hide.prototype.getStringMap.call(this);
    var crossType = + (this.getOption('crossType') || 1);
    stringMap['bjdKd'] = this.getOption('bjdKd');
    stringMap['crossType'] = lmd.getOptionsToMap(L.FormBuilder.CrossTypeSwitcher.prototype.selectOptions)[crossType] || '';
    stringMap['jsrxBx'] = this.getOption('jsrxBx');
    stringMap['jsrxNum'] = this.getOption('jsrxNum');
    stringMap['jsrxSize'] = this.getOption('jsrxSize');
    stringMap['tcrxBx'] = this.getOption('tcrxBx');
    stringMap['tcrxNum'] = this.getOption('tcrxNum');
    stringMap['tcrxSize'] = this.getOption('tcrxSize');
    stringMap['jsqBx'] = this.getOption('jsqBx');
    stringMap['jsqBz'] = this.getOption('jsqBz');
    stringMap['jsqSize'] = this.getOption('jsqSize');
    stringMap['jsqXjjsl'] = this.getOption('jsqXjjsl');
    stringMap['jgNum'] = +this.getOption('jgNum');
    if(stringMap['jgNum'] > 0) {
      stringMap['jgContent'] = this.getOption('jgContent');
      stringMap['jgSize'] = this.getOption('jgSize');
      stringMap['jgType'] = lmd.getOptionsToMap(L.FormBuilder.PillSuppSwitcher.prototype.selectOptions)[this.getOption('jgType') || 1];
    }
    stringMap['oQhbx'] = this.getOption('oQhbx');
    stringMap['oRxhd'] = this.getOption('oRxhd');
    stringMap['oJsbx'] = this.getOption('oJsbx');
    stringMap['oDkbz'] = this.getOption('oDkbz');
    stringMap['oQcgm'] = this.getOption('oQcgm');
    stringMap['oJdgz'] = this.getOption('oJdgz');
    stringMap['oXjsm'] = this.getOption('oXjsm');
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

  /*getBjdkdOptions: function(){
    return [
      'properties._storage_options.bjdKd',
    ]
  },*/

  getOtherOptions: function(){
    return [
      'properties._storage_options.oQhbx',
      'properties._storage_options.oRxhd',
      'properties._storage_options.oJsbx',
      'properties._storage_options.oDkbz',
      'properties._storage_options.oQcgm',
      'properties._storage_options.oXjsm',
      'properties._storage_options.oJdgz'
    ]
  },


  appendEditFieldsets: function (container) {

    /*var bjdFields = this.getBjdkdOptions();
    var builder = new L.S.FormBuilder(this, bjdFields, {});
    var bjdProperties = L.DomUtil.createFieldset(container, '被交道宽度');
    bjdProperties.appendChild(builder.build());*/

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
                bjdKd: '被交道宽度',
                jsrxBx: '减速让行标线(m2)',
                jsrxNum: '禁令标志(块)',
                jsrxSize: '版面尺寸',
                tcrxBx: '停车让行标线(m2)',
                tcrxNum: '禁令标志(块)',
                tcrxSize: '版面尺寸',
                jsqBx: '减速丘标线',
                jsqBz: '减速丘标志(块)',
                jsqSize: '版面尺寸',
                jsqXjjsl: '橡胶减速垄(m)',
                jgContent: '警告标志内容',
                jgSize:'版面尺寸',
                jgType:'支撑形式',
                jgNum: '数量(块)',
                oQhbx: '渠化标线(m2)',
                oRxhd: '被交道人行横道线(m2)',
                oJsbx: '被交道减速标线(m2)',
                oDkbz: '道口标柱(个)',
                oQcgm: '清除内侧灌木(m2)',
                oXjsm: '修剪树木(棵)',
                oJdgz: '被交道改造(m2)',
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
