
L.Storage.LmdArea = L.Storage.Polygon.extend({

  preInit: function() {
    if (!this.properties['className']) {
      this.properties['className'] = this.getClassName()
    }
    if (!this.properties._storage_options.at) {
      this.properties._storage_options = {
        at: "1",
        lr: "1",
        color:'Cyan',
        fillOpacity: '0.6'
      }
    }
  },

  //added by xiongjiabin
  getBasicOptions: function() {
    return [
      'properties._storage_options.at',
      'properties._storage_options.lr',
      'properties._storage_options.gbss',//起始桩号
      'properties._storage_options.gbse',
      'properties._storage_options.gbn',//面积或者数量
      'properties._storage_options.ds'
    ];
  },


  getClassName: function() {
    return 'lmdArea';
  },

  edit: function(e) {

    if(!this.map.editEnabled) {
        return false
    }
    L.Storage.LmdFeatureMixin.edit.call(this, e)
  },


  resetTooltip: function(e) {
    L.Storage.FeatureMixin.resetTooltip.call(this,e)
    if(!e) return
    this.updateName(e)
  },

  //name是自动生成的，依据所选择的参数
  updateName: function(e){
    if(!e) return

    var name = e.target.helpers['properties.name']
    var nameValue = name.value()
    if(nameValue && nameValue.startsWith('@')) {
      return
    }

    var at = e.target.helpers['properties._storage_options.at']
    var text = at.getSelectText()
    var result = text.trim()
    this.properties.name = name.input.value = result

    return
  },

  getStringMap: function(){

    var stringMap = L.Storage.FeatureMixin.getStringMap.call(this)

    var sns = this.getOption('gbss')
    var sne = this.getOption('gbse')
    var snsString = L.Storage.LmdFeatureMixin.showSubNice.call(this,sns)
    var sneString = L.Storage.LmdFeatureMixin.showSubNice.call(this,sne)
    if(sne > sns ){
      stringMap['gbss'] = snsString
      stringMap['gbse'] = sneString
    }else{
      stringMap['gbss'] = sneString
      stringMap['gbse'] = snsString
    }

    stringMap['gbn'] = this.getOption('gbn');//数量

    return stringMap

  },

});
