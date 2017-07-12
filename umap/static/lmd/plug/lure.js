L.Storage.Lure = L.Storage.Guardbar.extend({
  gbType: L.Storage.GB_TYPE_LURE,
  defaultName: '示警墩',
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
        'properties._storage_options.gblev',//级别
        'properties._storage_options.ds',
      ];
  },

  getStringMap: function(){
      var stringMap = L.Storage.Guardbar.prototype.getStringMap.call(this);
      var gblev = this.getOption('gblev');

      return stringMap;
  }

});

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
          html: '警诱设施(示警墩/示警桩)',
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
