//这个类主要作用是做一些自己的特殊处理，有别于L.Storage.FeatureMixin
//比如对待名字的处理,增加桩号等基本属性
L.Storage.LmdFeatureMixin = {
  edit: function(e) {
    if (!this.map.editEnabled || this.isReadOnly()) return;
    var container = L.DomUtil.create('div');

    var builder = new L.S.FormBuilder(this, ['datalayer'], {
      callback: function() {
          this.edit(e);
        } // removeLayer step will close the edit panel, let's reopen it
    });
    container.appendChild(builder.build());

    var properties = [],
      property, i = 0,
      len = 0;

    // add a basic properties for our new design
    var basicOptions = this.getBasicOptions();
    for (i = 0, len = basicOptions.length; i < len; i++) {
      property = basicOptions[i];
      if (L.Util.indexOf(['name', 'description', 'className'], property) !==
        -1) {
        continue;
      }
      properties.push(property);
    }

    //添加在layer自定义的属性列表
    for (i = 0; i < this.datalayer._propertiesIndex.length; i++) {
      property = this.datalayer._propertiesIndex[i];
      if (L.Util.indexOf(['name', 'description', 'className'], property) !==
        -1) {
        continue;
      }
      properties.push(['properties.' + property, {
        label: property
      }]);
    }

    // We always want name and description for now (properties management to come)
    properties.push('properties.name');
    properties.push('properties.description');
    builder = new L.S.FormBuilder(this, properties, {
      id: 'storage-feature-properties',
      callback: this.resetTooltip,
    });
    container.appendChild(builder.build());
    this.appendEditFieldsets(container);
    var advancedActions = L.DomUtil.createFieldset(container, L._(
      'Advanced actions'));
    this.getAdvancedEditActions(advancedActions);
    this.map.ui.openPanel({
      data: {
        html: container
      },
      className: 'dark'
    });
    this.map.editedFeature = this;
    if (!this.isOnScreen()) this.bringToCenter(e);

  },

  initialize: function(map, latlng, options) {
    this.map = map;
    if (typeof options === 'undefined') {
      options = {};
    }
    // DataLayer the marker belongs to
    this.datalayer = options.datalayer || null;
    this.properties = {
      _storage_options: {}
    };
    if (options.geojson) {
      this.populate(options.geojson);
    }
    var isDirty = false,
      self = this;
    try {
      Object.defineProperty(this, 'isDirty', {
        get: function() {
          return isDirty;
        },
        set: function(status) {
          if (!isDirty && status) {
            self.fire('isdirty');
          }
          isDirty = status;
          if (self.datalayer) {
            self.datalayer.isDirty = status;
          }
        }
      });
    } catch (e) {
      // Certainly IE8, which has a limited version of defineProperty
    }
    var newOptiosn = this.preInit();
    this.addInteractions();
    this.parentClass.prototype.initialize.call(this, latlng, newOptiosn);
  },

  showSubNice: function(sn){
    var a = parseInt(sn)
    var snStr = 'K' + a + '+' + (+sn * 1000 - a * 1000)
    return snStr
  }
}

L.Storage.LmdMarker = L.Storage.Marker.extend({

  preInit: function() {
    if (!this.properties['className']) {
      this.properties['className'] = this.getClassName()
    }
    if (!this.properties._storage_options.mt) {
      var preOptions = this.getPreviousOptions()
      this.properties._storage_options = {
        mt: "" + lmd.MARKER_WARMING,
        mic: "1",
        msh: "1",
        mss: "1",
        lr: "1",
        ds: "1",
        width:  "60",
        height: "60",
        rotate: preOptions['rotate'] || "0",
        sn: preOptions['sn'] || ''
      }
    }
  },

  addInteractions: function() {
    L.Storage.FeatureMixin.addInteractions.call(this);
    this.on('dragend', function(e) {
      this.caculateHelpXY()
      this.isDirty = true;
      this.edit(e);
    }, this);
    if (!this.isReadOnly()) this.on('mouseover', this._enableDragging);
    this.on('mouseout', this._onMouseOut);
    this._popupHandlersAdded = true; // prevent Leaflet from binding event on bindPopup

    this.on('editable:drawing:clicked', function(e) {
      this.caculateHelpXY()
    }, this)
  },

  caculateHelpXY: function() {

    if (this.helpPath) {
      this.helpPath.remove();
      this.helpPath = null;
    }
    var latlng = this.getLatLng()
    var sn = +this.getOption('sn')
    if(sn){
      var center = this.map.getAnchorLatLngBySubNo(sn)
      var latlngs = [center, latlng]
      this.helpPath = L.polyline(latlngs, {color: 'grey'}).addTo(this.map);
      var latlngPoint = this.map.latLngToLayerPoint(latlng);
      var centerPoint = this.map.latLngToLayerPoint(center);
      this.properties._storage_options['helpX'] = Math.round(latlngPoint['x'] - centerPoint['x'])
      this.properties._storage_options['helpY'] = Math.round(latlngPoint['y'] - centerPoint['y'])
    }
  },

  del: function () {
    L.Storage.FeatureMixin.del.call(this)
    if (this.helpPath) {
      this.helpPath.remove();
      this.helpPath = null;
    }
  },
  //added by xiongjiabin
  getBasicOptions: function() {
    return [
      'properties._storage_options.mt',
      'properties._storage_options.mic',
      'properties._storage_options.msh',
      'properties._storage_options.mss',
      'properties._storage_options.size',
      'properties._storage_options.lr',
      'properties._storage_options.sn',
      'properties._storage_options.ds'
    ];
  },

  getShapeOptions: function() {
    return [
      'properties._storage_options.color',
      'properties._storage_options.iconUrl',
      'properties._storage_options.width',
      'properties._storage_options.height',
      'properties._storage_options.rotate',
      'properties._storage_options.helpX',
      'properties._storage_options.helpY'
    ];
  },


  getEvents: function() {
    return {
      zoom: this._redraw,
      viewreset: this.update
    };
  },

  update: function(){
    var helpX = this.properties._storage_options['helpX'] || 0
    var helpY = this.properties._storage_options['helpY'] || 0
    if (helpX || helpY) {
      var subNo = +this.getOption('sn')
      if(subNo > 0){
        var center = this.map.getAnchorLatLngBySubNo(subNo)
        if(center){
          var scaleZoom = lmd.getLmdZoom(this.map)

          var centerPoint = this.map.latLngToLayerPoint(center)
          var destX = centerPoint['x'] + helpX * scaleZoom
          var destY = centerPoint['y'] + helpY * scaleZoom
          var dest = this.map.layerPointToLatLng([destX, destY])
          this._latlng = dest

          if (this.helpPath) {
            this.helpPath.remove();
            this.helpPath = null;
            var latlngs = [center, dest]
            this.helpPath = L.polyline(latlngs, {color: 'grey'}).addTo(this.map);
          }

        }
      }
    }

    this.parentClass.prototype.update.call(this)

  },

  _getIconUrl: function(name) {
    var baseUrl = '/static/storage/src/img/'
    var mt = this.getOption('mt')
    var mic = this.getOption('mic')
    var msh = this.getOption('msh')
    if (!mt || !mic || !msh) {
      return baseUrl + 'marker.png'
    }
    return baseUrl + [mt, mic, ''].join('/') + msh + '.png'
  },

  getIconClass: function() {
    var mt = this.getOption('mt')
    var mic = this.getOption('mic')
    var className = lmd.getMarkerThirdClass(mt, mic)
    return className
  },

  getIcon: function() {
    var Class = L.Storage.Icon[this.getIconClass()] || L.Storage.Icon.Rect;
    return new Class(this.map, {
      feature: this
    });
  },

  getClassName: function() {
    return 'lmdMarker';
  },

  getDisplayName: function(){
    var displayName = L.Storage.FeatureMixin.getDisplayName.call(this) || ''
    var sn = this.getOption('sn')
    var pos = this.getOption('lr') || L.FormBuilder.LeftRightChoice.prototype.default
    var posText = lmd.getOptionsToMap(L.FormBuilder.LeftRightChoice.prototype.choices)
    if(posText[pos]){
      displayName = displayName + '_' +  posText[pos]
    }
    if(sn){
      displayName = displayName + '_' +  L.Storage.LmdFeatureMixin.showSubNice.call(this,sn)
    }
    return displayName
  },

  edit: function(e) {
    //通过改变对应的select的prototype的selectOptions来改变需要变化的options值
    //初始化的情况下，其实js中的class也是一个value,可以随便去改变其值 10-20 aftrer third debate of trump&hilary
    var mt = this.getOption('mt') || 1
    var mtOptions = lmd.getMarkerCategorySecond(mt)
    L.FormBuilder.MarkerIconClassSwitcher.prototype.selectOptions =  mtOptions;
    var mic = this.getOption('mic') || mtOptions[0][0] || 1
    L.FormBuilder.MarkerSpeedSizeSwitcher.prototype.selectOptions = lmd.getMarkerCategoryThird(mt, mic);
    L.FormBuilder.MarkerShapeSwitcher.prototype.selectOptions = lmd.getMarkerCategoryThirdWife(mt, mic);

    L.Storage.LmdFeatureMixin.edit.call(this, e)

    //做些恶心的事情，xiongjiabin 已知bug，暂时没找到合适方法解决
    //默认size会显示出来
    //var result = lmd.getMarkerCategoryValue(this.properties._storage_options)
    //result['customize'] ? this.helpXiongjiabin['helpers']['properties._storage_options.size'].show()
    //                      : this.helpXiongjiabin['helpers']['properties._storage_options.size'].clear().hide()
    //delete this.helpXiongjiabin
  },

  //name是自动生成的，依据所选择的参数
  updateName: function(e){
    if(!e) return
    var reg = /^\W*\d*\s+(.+)$/
    var msh = e.target.helpers['properties._storage_options.msh']
    var name = e.target.helpers['properties.name']
    var nameValue = name.value()
    if(nameValue && nameValue.startsWith('@')) {
      return
    }
    var value = msh.value()
    var selectOptions = msh.getOptions()
    var i = 0, len = selectOptions.length
    var option = null, result = null
    for(; i < len; i++){
      option = selectOptions[i]
      if(+option[0] === +value) {
         result = option[1].trim().match(reg)
         if(result){
           this.properties.name = name.input.value = result[1]
         }else{
           this.properties.name = name.input.value = option[1].trim()
         }
         break
      }
    }
    return
  },

  //added by xiongjiabin
  //for listen the select change event for basic operations 2016-10-18
  //对应编辑框的select的变化是一个体系，之间都有一些错综复杂的关系
  //这个东西，可能就是react处理data的优势了，数据变化对应试图发生变化
  resetTooltip: function(e) {

    L.Storage.FeatureMixin.resetTooltip.call(this,e)
    //console.log(e);
    if (!e) return;
    var msh = e.target.helpers['properties._storage_options.msh']
    var mic = e.target.helpers['properties._storage_options.mic']
    var mss = e.target.helpers['properties._storage_options.mss']
    var size = e.target.helpers['properties._storage_options.size']
    var result = null, needToProcessSize = false
    var selfValue = e.helper.value()

    if (e.helper.field === 'properties._storage_options.mt') {
      //console.log('markerType changed, new value:', selfValue)
      var mshOptions = lmd.getMarkerCategorySecond(selfValue)
      this.properties._storage_options['mic'] = mic.select.value = '' //xiongjiabin 丑陋的代码 12/5
      mic.resetOptions(mshOptions);
      this.properties._storage_options['mss'] = mss.select.value = ''
      mss.resetOptions(lmd.getMarkerCategoryThird(selfValue, mshOptions[0][0]))
      this.properties._storage_options['msh'] = msh.select.value = ''
      msh.resetOptions(lmd.getMarkerCategoryThirdWife(selfValue, mshOptions[0][0]))

      this.properties._storage_options['mic'] = mic.value()
      this.properties._storage_options['mss'] = mss.value()
      this.properties._storage_options['msh'] = msh.value()

      this.updateName(e)
      this._redraw();
      needToProcessSize = true

    } else if (e.helper.field === 'properties._storage_options.mic') {
      var mt = this.getOption('mt');
      this.properties._storage_options['mss'] = mss.select.value = ''
      mss.resetOptions(lmd.getMarkerCategoryThird(mt, selfValue))
      this.properties._storage_options['msh'] = msh.select.value = ''
      msh.resetOptions(lmd.getMarkerCategoryThirdWife(mt, selfValue))

      this.properties._storage_options['mss'] = mss.value()
      this.properties._storage_options['msh'] = msh.value()

      this.updateName(e)
      this._redraw();
      needToProcessSize = true

    } else if (e.helper.field === 'properties._storage_options.msh') {

      this.updateName(e)
      this._redraw();

      needToProcessSize = true

    } else  if (e.helper.field === 'properties._storage_options.mss') {
      needToProcessSize = true
    }else{
      //noting to process
    }

    if(needToProcessSize){
      result = lmd.getMarkerCategoryValue(this.properties._storage_options)
      result['customize'] ? size.show(): size.clear().hide()
    }
  },


  getStringMap: function(){
    var stringMap = L.Storage.FeatureMixin.getStringMap.call(this)

    var result = lmd.getMarkerCategoryValue(this.properties._storage_options)
    stringMap['mt'] = result['mt']
    stringMap['mic'] = result['mic']
    stringMap['msh'] = result['msh']
    if(!result['customize']){
        stringMap['mss'] = result['mss']
    }else{
        stringMap['mss'] = this.getOption('size') || ''
    }
    stringMap['num'] = 1

    return stringMap
  },

});

L.Storage.SVGObject = L.SVGObject.extend({
  parentClass: L.SVGObject,
  includes: [L.Storage.FeatureMixin, L.Mixin.Events],

  preInit: function() {},

  addInteractions: function() {
    L.Storage.FeatureMixin.addInteractions.call(this);
    this.on('dragend', this._onDragEnd, this);
    if (!this.isReadOnly()) this.on('mouseover', this._enableDragging);
    this.on('mouseout', this._onMouseOut);
    this._popupHandlersAdded = true; // prevent Leaflet from binding event on bindPopup
  },

  _onDragEnd: function(e){
    this.isDirty = true;
    this.edit(e);
  },

  _onMouseOut: function() {
    if (this.dragging && this.dragging._draggable && !this.dragging._draggable
      ._moving) {
      // Do not disable if the mouse went out while dragging
      this._disableDragging();
    }
  },

  _enableDragging: function() {
    // TODO: start dragging after 1 second on mouse down
    if (this.map.editEnabled) {
      if (!this.editEnabled()) this.enableEdit();
      // Enabling dragging on the marker override the Draggable._OnDown
      // event, which, as it stopPropagation, refrain the call of
      // _onDown with map-pane element, which is responsible to
      // set the _moved to false, and thus to enable the click.
      // We should find a cleaner way to handle this.
      this.map.dragging._draggable._moved = false;
    }
  },

  _disableDragging: function() {
    if (this.map.editEnabled) {
      if (this.editor && this.editor.drawing) return; // when creating a new marker, the mouse can trigger the mouseover/mouseout event
      // do not listen to them
      this.disableEdit();
    }
  },

  getEvents: function() {
    return {
      zoom: this._redraw,
      viewreset: this.update
    };
  },

  _redraw: function() {
    if (this.datalayer && this.datalayer.isVisible()) {
      this.updateStyle()
      this.update()
    }
  },

  updateStyle: function(){
    if (this.datalayer && this.datalayer.isVisible()) {
      var color = this.getOption('color');
      var scale = this.getOption('scale');
      var rotate = this.getOption('rotate');
      var options = {}
      if(color) options['color'] = color

      var scaleZoom = lmd.getLmdZoom(this.map)

      options['scale'] = scale * scaleZoom
      options['rotate'] = rotate
      this.parentClass.prototype.updateStyle.call(this,options)
    }
    return this
  },

  _update: function(){
    if (this.datalayer && this.datalayer.isVisible()) {
      this.update()
    }
    return this
  },

  getCenter: function() {
    return this._latlng;
  },

  getClassName: function() {
    return 'svgobject';
  },

  getShapeOptions: function() {
    return [
      'properties._storage_options.color',
      'properties._storage_options.rotate',
      'properties._storage_options.scale'
    ];
  },

  getAdvancedOptions: function() {
    return [
      'properties._storage_options.zoomTo'
    ];
  },

  appendEditFieldsets: function(container) {
    L.Storage.FeatureMixin.appendEditFieldsets.call(this, container);
    var coordinatesOptions = [
      ['_latlng.lat', {
        handler: 'FloatInput',
        label: L._('Latitude')
      }],
      ['_latlng.lng', {
        handler: 'FloatInput',
        label: L._('Longitude')
      }]
    ];
    var builder = new L.S.FormBuilder(this, coordinatesOptions, {
      callback: function() {
        this._update();
        this.bringToCenter();
      },
      callbackContext: this
    });
    var fieldset = L.DomUtil.createFieldset(container, L._('Coordinates'));
    fieldset.appendChild(builder.build());
  },

  bringToCenter: function(e, callback) {
    callback = callback || function() {}; // mandatory for zoomToShowLayer
    if (this.datalayer.isClustered() && !this._icon) {
      this.datalayer.layer.zoomToShowLayer(this, callback);
    } else {
      L.Storage.FeatureMixin.bringToCenter.call(this, e, callback);
    }
  },

  isOnScreen: function() {
    var bounds = this.map.getBounds();
    return bounds.contains(this._latlng);
  },

});

L.Storage.LmdPillar = L.Storage.SVGObject.extend({

  initialize: function(map, latlng, options) {
    L.Storage.LmdFeatureMixin.initialize.call(this, map, latlng, options)
  },

  _onDragEnd: function(e){
    this.isDirty = true;
    if(!this.getOption('sn')){
      var latlng = this.getLatLng()
      var result = this.map.getSubNoByLatLng([latlng.lng, latlng.lat])
      if(result){
        this.properties._storage_options['sn'] = parseInt(result[2] * 1000) / 1000
        this.resetTooltip()
      }
    }
    this.edit(e);
  },

  preInit: function() {
    if (!this.properties['className']) {
      this.properties['className'] = this.getClassName()
    }

    if (!this.properties._storage_options.ps) {
      var preOptions = this.getSamePreviousOptions()
      console.log(preOptions)
      this.properties._storage_options = {
        ps: 1,
        scale: preOptions['scale'] || 3,
        rotate: preOptions['rotate'] || 0,
        color: preOptions['color'] || 'Yellow',
        sn: ''
      }
    }

    var options = {}
    var _storage_options = this.properties._storage_options
    if(_storage_options['ps']){
      options.svgText = this.getSvgData(
                            _storage_options['ps'],
                            _storage_options['sn'])
    }
    var validObj = {rotate:1,scale:1,color:1}
    for(var i in _storage_options){
      if(validObj[i]){
        options[i] = _storage_options[i]
      }
    }
    return options
  },

  getSvgData(type,sn) {
    var typeSvg = {
      1: '<circle cx="92" cy="17" r="15" /> <rect width="178" height="20" x="2" y="31" /><path stroke-width="1px" stroke-opacity="1" stroke="Yellow" fill="none" d="m 180,65 320,0"/> <text style="font-size:70px;" x="200" y="60">{{桩号}}</text>', //单柱式
      2: '<circle cx="42" cy="16" r="14"/><circle cx="129" cy="16" r="14" /> <rect width="178" height="25" x="2" y="30" /> <path stroke-width="1px" stroke-opacity="1" stroke="Yellow" fill="none" d="m 180,65 320,0"/> <text style="font-size:70px;" x="200" y="60">{{桩号}}</text>', //双柱式
      3: '<rect width="149" height="25" x="2" y="30" /><circle cx="166" cy="45" r="15" /><path stroke-width="1px" stroke-opacity="1" stroke="Yellow" fill="none" d="m 180,65 320,0"/> <text style="font-size:70px;" x="200" y="60">{{桩号}}</text>', //单悬臂式
      4: '<rect width="73" height="25" x="106" y="25" /> <circle cx="90" cy="25" r="15" /> <rect width="72" height="25" x="2" y="25"/><path stroke-width="1px" stroke-opacity="1" stroke="Yellow" fill="none" d="m 180,65 320,0"/> <text style="font-size:70px;" x="200" y="60">{{桩号}}</text>', //双悬臂式
      5: '<rect width="121" height="25" x="31" y="25" /> <circle cx="16" cy="35" r="15" /> <circle cx="167" cy="35" r="15" /><path stroke-width="1px" stroke-opacity="1" stroke="Yellow" fill="none" d="m 180,65 320,0"/> <text style="font-size:70px;" x="200" y="60">{{桩号}}</text>', //门架式
    }
    var svgStr = typeSvg[type] || typeSvg[1]
    if(sn){
      snStr = L.Storage.LmdFeatureMixin.showSubNice.call(this,sn)
      svgStr = svgStr.replace('{{桩号}}', snStr)
    }

    return svgStr
  },


  resetTooltip: function(){
    var ps = this.getOption('ps')
    var sn = this.getOption('sn')
    this.setSvgText(this.getSvgData(ps,sn))
  },

  //added by xiongjiabin
  getBasicOptions: function() {
    return [
      'properties._storage_options.ps',
      'properties._storage_options.lr',
      'properties._storage_options.sn',
      'properties._storage_options.ds',

      //pillar attributes
      'properties._storage_options.pd',
      'properties._storage_options.pt',
      'properties._storage_options.ph',
      'properties._storage_options.pb'
    ];
  },


  getClassName: function() {
    return 'lmdPillar';
  },

  getTypeName: function(){
    var typeNames = lmd.getOptionsToMap(L.FormBuilder.PillSuppSwitcher.prototype.selectOptions)
    var type = this.getOption('ps')
    return typeNames[type] || ''
  },

  getDisplayName: function(){
    var displayName = L.Storage.FeatureMixin.getDisplayName.call(this) || this.getTypeName()
    var sn = this.getOption('sn')
    var pos = this.getOption('lr') || L.FormBuilder.LeftRightChoice.prototype.default
    var posText = lmd.getOptionsToMap(L.FormBuilder.LeftRightChoice.prototype.choices)
    if(posText[pos]){
      displayName = displayName + '_' +  posText[pos]
    }
    if(sn){
      displayName = displayName + '_' +  L.Storage.LmdFeatureMixin.showSubNice.call(this,sn)
    }
    return displayName
  },

  edit: function(e) {
    L.Storage.LmdFeatureMixin.edit.call(this, e)
  },

  getStringMap: function(){
    var stringMap = L.Storage.FeatureMixin.getStringMap.call(this)

    stringMap['pt'] = this.getTypeName()

    stringMap['pd'] = this.getOption('pd')
    stringMap['ph'] = this.getOption('ph')
    stringMap['pb'] = this.getOption('pb')

    return stringMap
  },

});

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

L.Storage.Guardbar = L.Storage.Polyline.extend({


    preInit: function() {
      if (!this.properties['className']) {
        this.properties['className'] = this.getClassName()
      }

      if (!this.properties._storage_options.gbt) {
        this.properties._storage_options = {
          gbt: "1",
          color: "yellow",
          weight:"10"
        }
      }
    },

    edit: function(e) {
      L.Storage.LmdFeatureMixin.edit.call(this, e)
    },

    //added by xiongjiabin
    getBasicOptions: function () {
        return [
          'properties._storage_options.gbt',//类型
          'properties._storage_options.lr',
          'properties._storage_options.gbss',//起始桩号
          'properties._storage_options.gbse',
          'properties._storage_options.gbl',//总长
          'properties._storage_options.gbs',//间距
          'properties._storage_options.gbn',//数量
          'properties._storage_options.ds',
        ];
    },

    getShapeOptions: function () {
        return [
            'properties._storage_options.color',
            'properties._storage_options.weight',
        ];
    },

    getAdvancedOptions: function () {
        return [
            'properties._storage_options.smoothFactor',
            'properties._storage_options.zoomTo'
        ];
    },

    setStyle: function (options) {
      var gbtype = +this.getOption('gbt')
      if(gbtype === 1){
        L.Storage.BarTypeRect.call(this,options)
      }else if(gbtype === 3){
        L.Storage.BarTypeCircle.call(this,options)
      }else if(gbtype === 2){
        L.Storage.BarTypeLine.call(this,options)
      }else if(gbtype === 4){
        L.Storage.BarTypeCustomize.call(this,options)
      }
    },

    _updatePath: function(){
      this.parentClass.prototype._updatePath.call(this);
      var gbtype = +this.getOption('gbt')
      if(gbtype === 4){
        L.Storage.BarTypeCustomize.call(this,null)
      }
    },

    getClassName: function () {
        return 'guardbar';
    },

    getContextMenuEditItems: function (e) {
        var items = L.S.PathMixin.getContextMenuEditItems.call(this, e),
            vertexClicked = e.vertex, index;
        if (vertexClicked) {
            index = e.vertex.getIndex();
            if (index !== 0 && index !== e.vertex.getLastIndex()) {
                items.push({
                    text: L._('Split line'),
                    callback: e.vertex.split,
                    context: e.vertex
                });
            } else if (index === 0 || index === e.vertex.getLastIndex()) {
                items.push({
                    text: L._('Continue line (Ctrl-click)'),
                    callback: e.vertex.continue,
                    context: e.vertex.continue
                });
            }
        }
        return items;
    },

    getContextMenuMultiItems: function (e) {
        var items = L.S.PathMixin.getContextMenuMultiItems.call(this, e);
        items.push({
            text: L._('Merge lines'),
            callback: this.mergeShapes,
            context: this
        });
        return items;
    },


    resetTooltip: function(e) {

      L.Storage.FeatureMixin.resetTooltip.call(this,e)
      if (!e) return;

      if (e.helper.name === 'options.gbt') {
        this._redraw();
      } else {

      }

    }
});

L.Storage.BarTypeRect  = function(options){
  options = options || {};
  var option;
  for (var idx in this.styleOptions) {
      option = this.styleOptions[idx];
      options[option] = this.getOption(option);
  }
  options['dashArray'] = '20,10';
  if(options['weight'] < 15) options['weight'] = 15;
  options['opacity'] = 1;
  options['lineCap'] = 'butt';
  if (options.interactive) this.options.pointerEvents = 'visiblePainted';
  else this.options.pointerEvents = 'stroke';
  this.parentClass.prototype.setStyle.call(this, options);
};

L.Storage.BarTypeCircle = function(options){
  options = options || {};
  var option;
  for (var idx in this.styleOptions) {
      option = this.styleOptions[idx];
      options[option] = this.getOption(option);
  }
  options['dashArray'] = '0,25';
  if(options['weight'] < 15) options['weight'] = 15;
  options['opacity'] = 1;
  options['lineCap'] = 'round';
  if (options.interactive) this.options.pointerEvents = 'visiblePainted';
  else this.options.pointerEvents = 'stroke';
  this.parentClass.prototype.setStyle.call(this, options);
};

L.Storage.BarTypeLine = function(options){
  options = options || {};
  var option;
  for (var idx in this.styleOptions) {
      option = this.styleOptions[idx];
      options[option] = this.getOption(option);
  }
  options['dashArray'] = '5,20';
  options['lineCap'] = 'butt';
  options['opacity'] = 1;
  options['weight'] = 20;
  if (options.interactive) this.options.pointerEvents = 'visiblePainted';
  else this.options.pointerEvents = 'stroke';
  this.parentClass.prototype.setStyle.call(this, options);
};
L.Storage.BarTypeCustomize = function(options){
  options = options || {};
  var option;
  for (var idx in this.styleOptions) {
      option = this.styleOptions[idx];
      options[option] = this.getOption(option);
  }
  options['dashArray'] = '';
  options['lineCap'] = 'round';
  options['opacity'] = 0.4;
  options['weight'] = 5;
  if (options.interactive) this.options.pointerEvents = 'visiblePainted';
  else this.options.pointerEvents = 'stroke';
  this.parentClass.prototype.setStyle.call(this, options);
  this.updatePolyMarker();
}

L.Storage.Scale = L.Control.Scale.extend({

  onAdd: function (map) {
    var className = 'leaflet-control-scale',
        container = L.DomUtil.create('div', className),
        options = this.options;

    this._addScales(options, className + '-line', container);

    map.on('zoomend', this._update, this)
    map.whenReady(this._delayUpdate, this)

    return container;
  },

  _delayUpdate: function(){
    var that = this
    setTimeout(function() { that._update()}, 7000)
  },

  _addScales: function (options, className, container) {
		if (options.metric) {
      this._mLmdScale = L.DomUtil.create('div',className, container);
      this._mLmdScale.style.height="5mm"
			this._mScale = L.DomUtil.create('div', className, container);
		}
		if (options.imperial) {
			this._iScale = L.DomUtil.create('div', className, container);
		}
	},

  _updateMetric: function (maxMeters) {
    var meters = this._getRoundNum(maxMeters),
        label = meters < 1000 ? meters + ' m' : (meters / 1000) + ' km';

    this._updateScale(this._mScale, label, meters / maxMeters);
    if(this._mLmdScale.offsetHeight) {
      var ration = this.options.maxWidth / this._mLmdScale.offsetHeight * 5 / 1000,
        lmdScale = this._getRoundNum(maxMeters/ration),
        lmdScaleLable = lmdScale < 1000 ? lmdScale : (lmdScale /1000) + 'k';

      this._updateLmdScale(this._mLmdScale, lmdScaleLable);
      console.log(ration,lmdScale)
    }
  },

  _updateLmdScale: function (scale, text) {
    scale.innerHTML = '1:' + text;
  },
})
