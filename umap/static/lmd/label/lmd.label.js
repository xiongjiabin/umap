
L.Storage.LmdLabel = L.Storage.SVGObject.extend({

  initialize: function(map, latlng, options) {

    L.Storage.LmdFeatureMixin.initialize.call(this, map, latlng, options)
  },

  preInit: function() {
    if (!this.properties['className']) {
      this.properties['className'] = this.getClassName()
    }

    if (!this.properties._storage_options.color) {
      this.properties._storage_options = {
        scale: 5,
        rotate: 0,
        color: 'Yellow'
      }
    }

    var options = {}
    var _storage_options = this.properties._storage_options
    options.svgText = this.getSvgData()

    var validObj = {rotate:1,scale:1,color:1}
    for(var i in _storage_options){
      if(validObj[i]){
        options[i] = _storage_options[i]
      }
    }
    return options
  },

  getSvgData: function() {
    var name = this.getDisplayName()|| '请输入文字'
    var size = this.getOption('size') || 35
    return ' <text font-family="Verdana" font-size="' + size + '">' + name + '</text>'
  },

  resetTooltip: function(){
    this.setSvgText(this.getSvgData())
  },

  //added by xiongjiabin
  getBasicOptions: function() {
    return [
    ];
  },


  getClassName: function() {
    return 'lmdLabel';
  },

  edit: function(e) {
    L.Storage.LmdFeatureMixin.edit.call(this, e)
  },

});
