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

    return builder
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
      var data = this.map.getAnchorLatLngBySubNo(sn)
      if(data['point']){
          var center = [data['point'][0],data['point'][1]]
          var latlngs = [center, latlng]
          this.helpPath = L.polyline(latlngs, {color: 'grey'}).addTo(this.map);
          var latlngPoint = this.map.latLngToLayerPoint(latlng);
          var centerPoint = this.map.latLngToLayerPoint(center);
          this.properties._storage_options['helpX'] = Math.round(latlngPoint['x'] - centerPoint['x'])
          this.properties._storage_options['helpY'] = Math.round(latlngPoint['y'] - centerPoint['y'])
      }
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
        var data = this.map.getAnchorLatLngBySubNo(subNo)
        if(data && data['point']){
          var center = [data['point'][0],data['point'][1]]
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

    if(!this.map.editEnabled) {
        return false
    }
    //通过改变对应的select的prototype的selectOptions来改变需要变化的options值
    //初始化的情况下，其实js中的class也是一个value,可以随便去改变其值 10-20 aftrer third debate of trump&hilary
    var mt = this.getOption('mt') || 1
    var mtOptions = lmd.getMarkerCategorySecond(mt)
    L.FormBuilder.MarkerIconClassSwitcher.prototype.selectOptions =  mtOptions;
    var mic = this.getOption('mic') || mtOptions[0][0] || 1
    var mssResult = lmd.getMarkerCategoryThird(mt, mic, this.getOption('speed'))
    L.FormBuilder.MarkerSpeedSizeSwitcher.prototype.selectOptions = mssResult[0];
    L.FormBuilder.MarkerShapeSwitcher.prototype.selectOptions = lmd.getMarkerCategoryThirdWife(mt, mic);

    var builder = L.Storage.LmdFeatureMixin.edit.call(this, e)

    //做些恶心的事情，xiongjiabin 已知bug，暂时没找到合适方法解决
    //默认size会显示出来
    //已经找到方法做这个问题
    var result = lmd.getMarkerCategoryValue(this.properties._storage_options)
    result['customize'] ? builder.helpers['properties._storage_options.size'].show()
                          : builder.helpers['properties._storage_options.size'].clear().hide()
  },

  //name是自动生成的，依据所选择的参数
  updateName: function(e){
    if(!e) return
    var reg = /^\W*\d*\s+(.+)$/
    var name = e.target.helpers['properties.name']
    var nameValue = name.value()
    if(nameValue && nameValue.startsWith('@')) {
      return
    }
    var msh = e.target.helpers['properties._storage_options.msh']
    var text = msh.getSelectText()
    var result = text.trim().match(reg)
    if(result){
        this.properties.name = name.input.value = result[1]
    }else{
        this.properties.name = name.input.value = option[1].trim()
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
      var mssResult = lmd.getMarkerCategoryThird(selfValue, mshOptions[0][0],this.getOption('speed'))
      mss.resetOptions(mssResult[0])
      if(mssResult[1] > 1){
          this.properties._storage_options['mss'] = mss.select.value = mssResult[1]
      }

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
      var mssResult = lmd.getMarkerCategoryThird(mt, selfValue,this.getOption('speed'))
      mss.resetOptions(mssResult[0])
      if(mssResult[1] > 1){
          this.properties._storage_options['mss'] = mss.select.value = mssResult[1]
      }

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

    } else if (e.helper.field === 'properties._storage_options.mss') {

      needToProcessSize = true

    } else if (e.helper.field === 'properties._storage_options.sn' ||
               e.helper.field === 'properties._storage_options.lr') {
      var lr = +this.getOption('lr')
      var sn = this.getOption('sn')
      var data = this.map.getAnchorLatLngBySubNo(sn)
      var pos = lr == 2 ? 'right' : 'left'
      if(data && data[pos]){
          this.properties._storage_options['rotate'] = data[pos]
          this.caculateHelpXY()
          this._redraw();
      }
    } else {
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
      //console.log(preOptions)
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
                            _storage_options['sn'],
                            _storage_options['tail'])
    }
    var validObj = {rotate:1,scale:1,color:1}
    for(var i in _storage_options){
      if(validObj[i]){
        options[i] = _storage_options[i]
      }
    }
    return options
  },

  getSvgData(type,sn, tail) {
    var typeSvg = {
      1: '<circle cx="92" cy="17" r="15" /> <rect width="178" height="20" x="2" y="31" /><path stroke-width="2px" stroke-opacity="1" stroke="Yellow" fill="none" d="m 180,65 {{tail}},0"/> <text style="font-size:70px;" x="200" y="60">{{桩号}}</text>', //单柱式
      2: '<circle cx="42" cy="16" r="14"/><circle cx="129" cy="16" r="14" /> <rect width="178" height="25" x="2" y="30" /> <path stroke-width="2px" stroke-opacity="1" stroke="Yellow" fill="none" d="m 180,65 {{tail}},0"/> <text style="font-size:70px;" x="200" y="60">{{桩号}}</text>', //双柱式
      3: '<rect width="149" height="25" x="2" y="30" /><circle cx="166" cy="45" r="15" /><path stroke-width="2px" stroke-opacity="1" stroke="Yellow" fill="none" d="m 180,65 {{tail}},0"/> <text style="font-size:70px;" x="200" y="60">{{桩号}}</text>', //单悬臂式
      4: '<rect width="73" height="25" x="106" y="25" /><circle cx="90" cy="25" r="15" /> <rect width="72" height="25" x="2" y="25"/><path stroke-width="2px" stroke-opacity="1" stroke="Yellow" fill="none" d="m 180,65 {{tail}},0"/> <text style="font-size:70px;" x="200" y="60">{{桩号}}</text>', //双悬臂式
      5: '<rect width="121" height="25" x="31" y="25" /><circle cx="16" cy="35" r="15" /> <circle cx="167" cy="35" r="15" /><path stroke-width="2px" stroke-opacity="1" stroke="Yellow" fill="none" d="m 180,65 {{tail}},0"/> <text style="font-size:70px;" x="200" y="60">{{桩号}}</text>', //门架式
    }
    var svgStr = typeSvg[type] || typeSvg[1]
    tail = tail || 320
    if(sn){
      snStr = L.Storage.LmdFeatureMixin.showSubNice.call(this,sn)
      svgStr = svgStr.replace('{{桩号}}', snStr)
      svgStr = svgStr.replace('{{tail}}',tail)
    }

    return svgStr
  },

  _redraw: function() {
    var ps = this.getOption('ps')
    var sn = this.getOption('sn')
    var tail = this.getOption('tail')
    this.setSvgText(this.getSvgData(ps,sn,tail))
    L.Storage.SVGObject.prototype._redraw.call(this)
  },

  resetTooltip: function(e){
    var ps = this.getOption('ps')
    var sn = this.getOption('sn')
    var tail = this.getOption('tail')
    this.setSvgText(this.getSvgData(ps,sn,tail))

    if(!e) return

    if (e.helper.field === 'properties._storage_options.sn' ||
        e.helper.field === 'properties._storage_options.lr') {
      var lr = +this.getOption('lr')
      var data = this.map.getAnchorLatLngBySubNo(sn)
      var pos = lr == 2 ? 'right' : 'left'
      if(data && data[pos]){
          this.properties._storage_options['rotate'] = data[pos]
          this.updateStyle()
          if(data.point){
              this.setLatLng(data.point)
          }
      }
    }
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

  getShapeOptions: function() {
    return [
      'properties._storage_options.color',
      'properties._storage_options.rotate',
      'properties._storage_options.scale',
      'properties._storage_options.tail'
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



L.PolylineOffset = {
  translatePoint: function(pt, dist, radians) {
    return L.point(pt.x + dist * Math.cos(radians), pt.y + dist * Math.sin(radians));
  },

  offsetPointLine: function(points, distance) {
    var l = points.length;
    if (l < 2) {
      throw new Error('Line should be defined by at least 2 points');
    }

    var a = points[0], b;
    var offsetAngle, segmentAngle;
    var offsetSegments = [];

    for(var i=1; i < l; i++) {
      b = points[i];
      // angle in (-PI, PI]
      segmentAngle = Math.atan2(a.y - b.y, a.x - b.x);
      // angle in (-1.5 * PI, PI/2]
      offsetAngle = segmentAngle - Math.PI/2;

      // store offset point and other information to avoid recomputing it later
      offsetSegments.push({
        angle: segmentAngle,
        offsetAngle: offsetAngle,
        distance: distance,
        original: [a, b],
        offset: [
          this.translatePoint(a, distance, offsetAngle),
          this.translatePoint(b, distance, offsetAngle)
        ]
      });
      a = b;
    }

    return offsetSegments;
  },

  pointsToLatLngs: function(pts, map) {
    var ll = [];
    for(var i=0, l=pts.length; i<l; i++) {
      ll[i] = map.layerPointToLatLng(pts[i]);
    }
    return ll;
  },

  offsetPoints: function(pts, offset) {
    var offsetSegments = this.offsetPointLine(pts, offset);
    return this.joinLineSegments(offsetSegments, offset, 'round');
  },

  /**
  Return the intersection point of two lines defined by two points each
  Return null when there's no unique intersection
  */
  intersection: function(l1a, l1b, l2a, l2b) {
    var line1 = this.lineEquation(l1a, l1b),
        line2 = this.lineEquation(l2a, l2b);

    if (line1 == null || line2 == null) {
      return null;
    }

    if(line1.hasOwnProperty('x')) {
      if(line2.hasOwnProperty('x')) {
        return null;
      }
      return L.point(line1.x, line2.a * line1.x + line2.b);
    }
    if(line2.hasOwnProperty('x')) {
      return L.point(line2.x, line1.a * line2.x + line1.b);
    }

    if (line1.a == line2.a) {
      return null;
    }

    var x = (line2.b - line1.b) / (line1.a - line2.a),
        y = line1.a * x + line1.b;

    return L.point(x, y);
  },

  /**
  Find the coefficients (a,b) of a line of equation y = a.x + b,
  or the constant x for vertical lines
  Return null if there's no equation possible
  */
  lineEquation: function(pt1, pt2) {
    if (pt1.x != pt2.x) {
      var a = (pt2.y - pt1.y) / (pt2.x - pt1.x);
      return {
        a: a,
        b: pt1.y - a * pt1.x
      };
    }

    if (pt1.y != pt2.y) {
      return { x: pt1.x };
    }

    return null;
  },

  /**
  Join 2 line segments defined by 2 points each,
  with a specified methodnormalizeAngle( (default : intersection);
  */
  joinSegments: function(s1, s2, offset, joinStyle) {
    var jointPoints = [];
    switch(joinStyle) {
      case 'round':
        jointPoints = this.circularArc(s1, s2, offset);
        break;
      case 'cut':
        jointPoints = [
          this.intersection(s1.offset[0], s1.offset[1], s2.original[0], s2.original[1]),
          this.intersection(s1.original[0], s1.original[1], s2.offset[0], s2.offset[1])
        ];
        break;
      case 'straight':
        jointPoints = [s1.offset[1], s2.offset[0]];
        break;
      case 'intersection':
      default:
        jointPoints = [this.intersection(s1.offset[0], s1.offset[1], s2.offset[0], s2.offset[1])];
    }
    // filter out null-results
    return jointPoints.filter(function(v) {return v;});
  },

  joinLineSegments: function(segments, offset, joinStyle) {
    var l = segments.length;
    var joinedPoints = [];
    var s1 = segments[0], s2 = segments[0];
    joinedPoints.push(s1.offset[0]);

    for(var i=1; i<l; i++) {
      s2 = segments[i];
      joinedPoints = joinedPoints.concat(this.joinSegments(s1, s2, offset, joinStyle));
      s1 = s2;
    }
    joinedPoints.push(s2.offset[1]);

    return joinedPoints;
  },

  /**
  Interpolates points between two offset segments in a circular form
  */
  circularArc: function(s1, s2, distance) {
    if (s1.angle == s2.angle)
      return [s1.offset[1]];

    var center = s1.original[1];
    var points = [];

    if (distance < 0) {
      var startAngle = s1.offsetAngle;
      var endAngle = s2.offsetAngle;
    } else {
      // switch start and end angle when going right
      var startAngle = s2.offsetAngle;
      var endAngle = s1.offsetAngle;
    }

    if (endAngle < startAngle) {
      endAngle += Math.PI * 2; // the end angle should be bigger than the start angle
    }

    if (endAngle > startAngle + Math.PI) {
      return [this.intersection(s1.offset[0], s1.offset[1], s2.offset[0], s2.offset[1])];
    }

    // Step is distance dependent. Bigger distance results in more steps to take
    var step = Math.abs(8/distance);
    for (var a = startAngle; a < endAngle; a += step) {
      points.push(this.translatePoint(center, distance, a));
    }
    points.push(this.translatePoint(center, distance, endAngle));

    if (distance > 0) {
      // reverse all points again when going right
      points.reverse();
    }

    return points;
  }
}

  L.Polyline.include({
    getOffSetLatlngs: function(offset, latlngs, tolerance){
      if(!offset) return latlngs
      tolerance = tolerance || 1
      latlngs  = latlngs || this._latlngs
      var results = []
      var newLatlngs = []
      var i,len

      this._offsetProjectLatlngs(offset, latlngs, results)
      //let points to latlngs
      if(results.length === 1){
        newLatlngs = L.PolylineOffset.pointsToLatLngs(results[0],this._map)
      } else {
        for(i = 0, len = results.length; i < len; i++){
          if(!results[i]) break
          newLatlngs.push(L.PolylineOffset.pointsToLatLngs(results[i],this._map))
        }
      }
      return newLatlngs
    },

    _offsetProjectLatlngs: function (offset, latlngs, result) {
      var flat = latlngs[0] instanceof L.LatLng,
          len = latlngs.length,
          i, ring;

      if (flat) {
        ring = [];
        for (i = 0; i < len; i++) {
          ring[i] = this._map.latLngToLayerPoint(latlngs[i]);
        }
        // Offset management hack ---
        if(offset) {
          ring = L.PolylineOffset.offsetPoints(ring, offset);
        }
        // Offset management hack END ---
        result.push(ring);
      } else {
        for (i = 0; i < len; i++) {
            this._projectLatlngs(latlngs[i], result);
        }
      }
    }
  });
