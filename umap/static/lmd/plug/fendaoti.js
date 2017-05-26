L.Storage.FenDaoTi = L.Storage.Guardbar.extend({
  gbType: L.Storage.GB_TYPE_FENDAOTI,
  CLASS_NAME: 'fendaoti',

  getBasicOptions: function () {
      return [
        'properties._storage_options.gbc',//类别
        'properties._storage_options.lr',
        'properties._storage_options.gbss',//起始桩号
        'properties._storage_options.gbse',
        'properties._storage_options.gbl',//总长
        'properties._storage_options.gbs',//间距
        'properties._storage_options.gbn',//数量
        'properties._storage_options.ds',
      ];
  },

});

//分道体统计
lmd.tjFenDaoTi = function(){
  var data = []
  var titles = {no:'序号',
                name: '类型',
                gbss: '起始桩号',
                gbse: '结束桩号',
                pos: '侧别',
                gbl: '长度(米)',
                gbs: '间距(米)',
                gbn: '数量(个)',
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
      if(className === L.Storage.FenDaoTi.prototype.CLASS_NAME) {
          data.push(lmd.getTjData(feature,i,titles))
          i++
      }
  })

  lmd.processData(data)
  new CsvGenerator(data,  '分道体.csv').download(true);
}


lmd.tjs.push({ label: '分道体', process: lmd.tjFenDaoTi});

L.Storage.DataLayer.prototype._lineToClass[L.Storage.FenDaoTi.prototype.CLASS_NAME] = L.Storage.FenDaoTi;

L.S.Editable.prototype.createFenDaoTi = function( latlng ){
   return new L.Storage.FenDaoTi(this.map, latlng)
};

L.Editable.prototype.startFenDaoTi = function(latlng,options){
   var line = this.createFenDaoTi([], options);
   this.connectCreatedToMap(line);
   line.enableEdit().newShape(latlng);
   return line;
};

L.Storage.Map.include({
  startFenDaoTi: function(){
    return this.editTools.startFenDaoTi();
  }
});

L.Storage.SubDrawFenDaoTiAction = L.Storage.SubAction.extend({

    options: {
        toolbarIcon: {
          html: '分道体',
          tooltip: '包含柱式，片式分道体'
        }
    },

    addHooks: function () {
        this.map.startFenDaoTi();
        L.Storage.SubAction.prototype.addHooks.call(this)
    }
});

L.Storage.DrawOtherAction.prototype.options.subActions.push(L.Storage.SubDrawFenDaoTiAction);
