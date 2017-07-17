L.Storage.Isolation = L.Storage.Guardbar.extend({
  gbType: L.Storage.GB_TYPE_ISOLATION,
  //defaultName: '隔离设施',
  //CLASS_ALIAS: '隔离设施',
  CLASS_NAME: 'isolation',

  //added by xiongjiabin
  getBasicOptions: function () {
      return [
        'properties._storage_options.gbc',//类别
        'properties._storage_options.lr',
        'properties._storage_options.gbss',//起始桩号
        'properties._storage_options.gbse',
        'properties._storage_options.gbl',//总长
        'properties._storage_options.ds',
      ];
  },
});

L.Storage.DataLayer.prototype._lineToClass[L.Storage.Isolation.prototype.CLASS_NAME] = L.Storage.Isolation;

L.S.Editable.prototype.createIsolation = function( latlng ){
   return new L.Storage.Isolation(this.map, latlng)
};

L.Editable.prototype.startIsolation = function(latlng,options){
   var line = this.createIsolation([], options);
   this.connectCreatedToMap(line);
   line.enableEdit().newShape(latlng);
   return line;
};

L.Storage.Map.include({
  startIsolation: function(){
    return this.editTools.startIsolation();
  }
});

L.Storage.SubDrawIsolationAction = L.Storage.SubAction.extend({

    options: {
        toolbarIcon: {
          html: '隔离设施',
          tooltip: '包含移动护栏,路宅分离'
        }
    },

    addHooks: function () {
        this.map.startIsolation();
        L.Storage.SubAction.prototype.addHooks.call(this)
    }
});

L.Storage.DrawOtherAction.prototype.options.subActions.push(L.Storage.SubDrawIsolationAction);
