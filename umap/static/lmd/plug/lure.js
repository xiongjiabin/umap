L.Storage.Lure = L.Storage.Guardbar.extend({
  gbType: L.Storage.GB_TYPE_LURE,
  defaultName: '警诱设施',
  CLASS_ALIAS: '警诱设施',
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
