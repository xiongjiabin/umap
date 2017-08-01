L.Storage.HlbShanDeng = L.Storage.HuangShanDeng.extend({
  CLASS_ALIAS: '红蓝爆闪灯',
  CLASS_NAME: 'hlbsd',
  defaultColor: 'white',
  GuardbarCatSwitcher:[
      ["1","单柱式"],
      ["2","附着式"]
  ],
  picUrl: "/static/storage/src/img/hlbsd.png",

});

lmd.tjHlbShanDeng = function(){
    var data = []
    var titles = {no:'序号',
                sn: '桩号',
                pos: '侧别',
                name: '类别',
                gbn: '数量(个)',
                ds: '状态',
    }
    data.push(lmd.objectToArray(titles))
    delete titles.no

    //this means map
    var i = 1
    var className = null;
    this.eachLayerFeature(function (feature) {
        className = feature.getClassName();
        if(className === L.Storage.HlbShanDeng.prototype.CLASS_NAME) {
            data.push(lmd.getTjData(feature,i,titles))
            i++
        }
})

  lmd.processData(data)
  new CsvGenerator(data,  '红蓝爆闪灯.csv').download(true);
}
lmd.tjs.push({ label: '红蓝爆闪灯', process: lmd.tjHlbShanDeng});

L.Storage.DataLayer.prototype._pointToClass['hlbsd'] = L.Storage.HlbShanDeng;

L.S.Editable.prototype.createHlbShanDeng = function( latlng ){
   return new L.Storage.HlbShanDeng(this.map, latlng)
};

L.Editable.prototype.startHlbShanDeng = function(latlng,options){
  latlng = latlng || this.map.getCenter();
  var label = this.createHlbShanDeng(latlng, options);
  this.connectCreatedToMap(label);
  var editor = label.enableEdit();
  editor.startDrawing();
  return label;
};

L.Storage.Map.include({
  startHlbShanDeng: function(){
      return this.editTools.startHlbShanDeng();
  }
});

L.Storage.SubDrawHlbShanDengAction = L.Storage.SubAction.extend({

    options: {
        toolbarIcon: {
          html: '红蓝爆闪灯',
          tooltip: '红蓝爆闪灯'
        }
    },

    addHooks: function () {
        this.map.startHlbShanDeng();
        L.Storage.SubAction.prototype.addHooks.call(this)
    }
});

L.Storage.DrawAllLureAction.prototype.options.subActions.push(L.Storage.SubDrawHlbShanDengAction);
