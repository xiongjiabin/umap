L.Storage.Lure = L.Storage.Guardbar.extend({
  gbType: L.Storage.GB_TYPE_LURE,
  CLASS_NAME: 'lure',

  getBasicOptions: function () {
      return [
        'properties._storage_options.gbc',//类别
        'properties._storage_options.lr',
        'properties._storage_options.gbss',//起始桩号
        'properties._storage_options.gbse',
        'properties._storage_options.gbl',//总长
        'properties._storage_options.gbs',//间距
        'properties._storage_options.gbn',//数量
        'properties._storage_options.tgsl',//铜管数量，只有连续示警墩的时候有作用
        'properties._storage_options.gblev',//级别
        'properties._storage_options.ds',
      ];
  },

  getStringMap: function(){
      var stringMap = L.Storage.Guardbar.prototype.getStringMap.call(this);
      var gbc = +this.getOption('gbc');
      if(gbc === 2){
          stringMap['tgsl'] = +this.getOption('tgsl');
      }
      return stringMap;
  },

  resetTooltip: function(e) {

    L.Storage.Guardbar.prototype.resetTooltip.call(this, e);
    if(!e) return;
    if(e.helper.name in {'gbc':0,'lr':0,'gbss':0,'gbse':0,'gbl':0,'gbs':0,'gbn':0}){
        var tgslControl = e.target.helpers['properties._storage_options.tgsl']
        var gbnControl = e.target.helpers['properties._storage_options.gbn']
        var gbc = +this.getOption('gbc');
        if(gbc === 2) {//联系书经炖
            tgslControl.show();
            gbnControl && gbnControl.label && (gbnControl.label.innerHTML = '示警墩数量(个)');
            var gbn = +this.getOption('gbn');
            if(gbn >= 1){
                this.properties._storage_options.tgsl = tgslControl.input.value = 2 * (gbn - 1);
            }else{
                this.properties._storage_options.tgsl = tgslControl.input.value = 0;
            }
        }else{
            tgslControl.hide().clear();
            gbnControl && gbnControl.label && (gbnControl.label.innerHTML = '数量(个)');
        }
    }
  },

  edit: function(e) {
    if(this.map.editEnabled) {
        var builder = L.Storage.Guardbar.prototype.edit.call(this,e);
        var tgslControl = builder.helpers['properties._storage_options.tgsl']
        var gbnControl = builder.helpers['properties._storage_options.gbn']
        var gbc = +this.getOption('gbc');
        if(gbc === 2) {//l谦虚示警墩
            tgslControl.show();
            gbnControl && gbnControl.label && (gbnControl.label.innerHTML = '示警墩数量(个)')
        }else{
            tgslControl.hide();
            gbnControl && gbnControl.label && (gbnControl.label.innerHTML = '数量(个)')
        }
    }
  }

});

L.Storage.FormBuilder.prototype.defaultOptions['tgsl'] = {handler:'FloatInput','label':'铜管数量(根)'};

L.Storage.DataLayer.prototype._lineToClass[L.Storage.Lure.prototype.CLASS_NAME] = L.Storage.Lure;

L.S.Editable.prototype.createLure = function( latlng ){
   return new L.Storage.Lure(this.map, latlng)
};

L.Editable.prototype.startLure = function(latlng,options){
   var line = this.createLure([], options);
   this.connectCreatedToMap(line);
   line.enableEdit().newShape(latlng);
   return line;
};

L.Storage.Map.include({
  startLure: function(){
    return this.editTools.startLure();
  }
});

L.Storage.SubDrawLureAction = L.Storage.SubAction.extend({

    options: {
        toolbarIcon: {
          html: '示警墩/示警桩',
          tooltip: '包含示警墩,示警桩,连续示警墩等'
        }
    },

    addHooks: function () {
        this.map.startLure();
        L.Storage.SubAction.prototype.addHooks.call(this)
    }
});

L.Storage.DrawAllLureAction.prototype.options.subActions.push(L.Storage.SubDrawLureAction);


//警诱设施
lmd.tjLure = function(){
  var data = []
  var titles = {no:'序号',
                name: '类型',
                gbss: '起始桩号',
                gbse: '结束桩号',
                pos: '侧别',
                gbl: '长度(米)',
                gbs: '间距(米)',
                gbn: '数量(个)',
                tgsl: '铜管数量(根)',
                gblev: '级别',
                ds: '状态',
                description:'备注'
              }
  data.push(lmd.objectToArray(titles))
  delete titles.no

  //this means map
  var i = 1
  var className = null;
  this.eachLayerFeature(function (feature) {
      className = feature.getClassName();
      if(className === L.Storage.Lure.prototype.CLASS_NAME ) {
          data.push(lmd.getTjData(feature,i,titles))
          i++
      }
  })

  lmd.processData(data)
  new CsvGenerator(data,  '警诱设施.csv').download(true);
}


lmd.tjs.push({ label: '警诱设施', process: lmd.tjLure});
