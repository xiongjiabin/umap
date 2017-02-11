
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

  resetTooltip: function(e){
    if(!e) return
    var selfValue = null,snControl = null, sn = '', ratate = 0;

    if(e.helper.name === 'name'){
        this.setSvgText(this.getSvgData())
    }else if(e.helper.name === 'sn'){
        this.caculateHelpXY();
    }else if(e.helper.name === 'isBindSN'){
        selfValue = e.helper.value();
        snControl = e.target.helpers['properties._storage_options.sn'];
        if(selfValue){
          snControl.show();
          var nearFeature = this.datalayer.findNearInScreenFeature(this.getLatLng(),
                               function(feature){
                                   return (feature.getClassName() === 'lmdMarker')
                               });
          if(nearFeature){
              rotate = nearFeature.getOption('rotate');
              sn     = nearFeature.getOption('sn')
              this.setSingleOption('rotate', rotate);
              this.setSingleOption('sn', sn);
              snControl.input.value = sn;
              this.caculateHelpXY();
              this._redraw();
          }else{
              this.setSingleOption('helpX',0);
              this.setSingleOption('helpY',0);
          }
        }else{
          //disabled the bind sn
          snControl.hide().clear();
        }
    }
  },

  addInteractions: function() {
      L.Storage.LmdUpdateXYMixin.addInteractions.call(this);
  },

  caculateHelpXY: function() {
      L.Storage.LmdUpdateXYMixin.caculateHelpXY.call(this);
  },

  update: function(){
     L.Storage.LmdUpdateXYMixin.update.call(this);
  },

  del: function () {
     L.Storage.LmdUpdateXYMixin.del.call(this);
  },

  //added by xiongjiabin
  getBasicOptions: function() {
    return [
      "properties._storage_options.isBindSN",
      'properties._storage_options.sn',
    ];
  },

  getShapeOptions: function() {
    var shapeOptions = L.Storage.SVGObject.prototype.getShapeOptions.call(this);
    shapeOptions.push('properties._storage_options.helpX');
    shapeOptions.push('properties._storage_options.helpY');
    return shapeOptions;
  },

  getClassName: function() {
    return 'lmdLabel';
  },

  edit: function(e) {
    var builder = L.Storage.LmdFeatureMixin.edit.call(this, e);
    var isBindSN = this.getOption('isBindSN');
    var snControl = builder.helpers['properties._storage_options.sn'];
    if(!isBindSN){
      //disabled the bind sn
      snControl.hide();
    }
  },

});
