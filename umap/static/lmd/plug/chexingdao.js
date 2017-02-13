/*
车行道边缘线，不可见
2017-2-13
*/

L.Storage.CheXingDao = L.Storage.Hide.extend({

  getDisplayName: function(){
    var gbss = this.getOption('gbss') || ''
    var gbse = this.getOption('gbse') || ''
    return '**' + '车行道边缘线(' + gbss + '-' + gbse + ')' + '**'
  },

  getBasicOptions: function(){
    return [
    'properties._storage_options.lr',
    'properties._storage_options.gbss',//起始桩号
    'properties._storage_options.gbse',
    'properties._storage_options.gbl',//总长
    'properties._storage_options.ds', //设备状态
    ]
  },

  getClassName: function(){
     return 'cxd'
  }

});

//车行道统计
lmd.tjCheXingDao = function(){
  var data = []
  var titles = {no:'序号',
                gbss: '起始桩号',
                gbse: '结束桩号',
                gbl: '长度(m)',
                pos: '侧别',
                ds: '状态',
                description:'备注'
              }
  data.push(lmd.objectToArray(titles))
  delete titles.no

  //this means map
  var i = 1
  this.eachLayerFeature(function (feature) {
      if(feature.getClassName() === 'cxd'){
        data.push(lmd.getTjData(feature,i,titles))
        i++
      }
  })

  lmd.processData(data)
  new CsvGenerator(data,  '车行道边缘线.csv').download(true);
}


lmd.tjs.push({ label: '车行道边缘线', process: lmd.tjCheXingDao});

L.Storage.DataLayer.prototype._pointToClass['cxd'] = L.Storage.CheXingDao;

L.S.Editable.prototype.createCheXingDao = function( latlng ){
   return new L.Storage.CheXingDao(this.map, latlng)
};

L.Editable.prototype.startCheXingDao = function(latlng,options){
  latlng = latlng || this.map.getCenter();
  var label = this.createCheXingDao(latlng, options);
  this.connectCreatedToMap(label);
  var editor = label.enableEdit();
  editor.startDrawing();
  return label;
};

L.Storage.Map.include({
  startCheXingDao: function(){
      return this.editTools.startCheXingDao();
  }
});

L.Storage.SubDrawCheXingDaoAction = L.Storage.SubAction.extend({

    options: {
        toolbarIcon: {
          html: '车行道(隐藏)',
          tooltip: '车行道边缘线'
        }
    },

    addHooks: function () {
        this.map.startCheXingDao();
        L.Storage.SubAction.prototype.addHooks.call(this)
    }
});

L.Storage.DrawOtherAction.prototype.options.subActions.push(L.Storage.SubDrawCheXingDaoAction);
