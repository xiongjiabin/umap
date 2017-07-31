L.Storage.SheShi = L.Storage.Polygon.extend({
    CLASS_NAME: 'sheshi',
    preInit: function() {
        if (!this.properties['className']) {
            this.properties['className'] = this.getClassName()

            this.properties._storage_options = {
                tjssType: "1",
                lr: "1",
                color:'Red',
                fillOpacity: '0.6'
            }
            this.properties.name = this.defaultName
        }
    },

    getBasicOptions: function () {
      return [
        'properties._storage_options.tjssType',//类别
        'properties._storage_options.lr',
        'properties._storage_options.sn',//桩号
        'properties._storage_options.gba',//面积
        'properties._storage_options.ds',
        ];
    },

    getClassName: function() {
        return this.CLASS_NAME;
    },

    edit: function(e) {
        if(!this.map.editEnabled) {
            return false
        }
        //SheShi 只有左右，中间，两侧
        L.FormBuilder.LeftRightChoice.prototype.choices =
                  L.FormBuilder.LeftRightChoice.prototype.choicesLRBoth;

        L.Storage.LmdFeatureMixin.edit.call(this, e)

    },

    resetTooltip: function(e) {
        L.Storage.FeatureMixin.resetTooltip.call(this,e)
        if(!e) return
        var gbn = e.target.helpers['properties._storage_options.gbn']
        if(e.helper.name === 'tjssType') {
            this.updateName(e)
        }
    },

    //name是自动生成的，依据所选择的参数
    updateName: function(e){
        if(!e) return
        var name = e.target.helpers['properties.name']
        var nameValue = name.value()
        if(nameValue && nameValue.startsWith('@')) {
            return
        }

        var tjssType = e.target.helpers['properties._storage_options.tjssType']
        var text = tjssType.getSelectText()
        var result = text.trim()
        this.properties.name = name.input.value = result
        return
    },

    getStringMap: function(){
        var stringMap = L.Storage.FeatureMixin.getStringMap.call(this)
        var sn = this.getOption('sn')
        var snString = L.Storage.LmdFeatureMixin.showSubNice.call(this,sn)
        stringMap['sn'] = snString
        stringMap['gba'] = this.getOption('gba');

        stringMap['sortField'] = {k1: sn}
        return stringMap
    },
});

//土建设施设计
lmd.tjSheShi = function(){
  var data = []
  var titles = {no:'序号',
                name: '类型',
                sn: '桩号',
                gba:'面积(m2)',
                ds: '状态',
                }
  data.push(lmd.objectToArray(titles))
  delete titles.no

  //this means map
  var i = 1
  var className = null;
  this.eachLayerFeature(function (feature) {
      className = feature.getClassName();
      if(className === L.Storage.SheShi.prototype.CLASS_NAME) {
        data.push(lmd.getTjData(feature,i,titles))
        i++
      }
  })

  lmd.processData(data)
  new CsvGenerator(data,  '土建设施.csv').download(true);
}


lmd.tjs.push({ label: '土建设施', process: lmd.tjSheShi});

L.Storage.DataLayer.prototype._lineToClass[L.Storage.SheShi.prototype.CLASS_NAME] = L.Storage.SheShi;

L.S.Editable.prototype.createSheShi = function( latlng ){
   return new L.Storage.SheShi(this.map, latlng)
};

L.Editable.prototype.startSheShi = function(latlng,options){
   var line = this.createSheShi([], options);
   this.connectCreatedToMap(line);
   line.enableEdit().newShape(latlng);
   return line;
};

L.Storage.Map.include({
  startSheShi: function(){
    return this.editTools.startSheShi();
    }
});

L.Storage.SubDrawSheShiAction = L.Storage.SubAction.extend({

    options: {
        toolbarIcon: {
          html: '土建设施',
          tooltip: '停车场,观景台,错车道,避险车道'
        }
    },

    addHooks: function () {
        this.map.startSheShi();
        L.Storage.SubAction.prototype.addHooks.call(this)
    },

});

L.Storage.DrawOtherAction.prototype.options.subActions.push(L.Storage.SubDrawSheShiAction);
