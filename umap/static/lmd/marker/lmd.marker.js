L.Storage.LmdMarker = L.Storage.Marker.extend({

  defaultName: '交叉路口(T右)',
  preInit: function() {
    if (!this.properties['className']) {
      this.properties['className'] = this.getClassName()
      this.properties.name = this.defaultName
      var preOptions = this.getPreviousOptions()
      this.properties._storage_options = {
        mt: "" + lmd.MARKER_WARMING,
        mic: "1",
        msh: "1",
        mss: "1",
        lr: "1",
        ds: "1",
        width:  "0",
        height: "60",
        rotate: preOptions['rotate'] || "0",
        sn: preOptions['sn'] || ''
      }
    }
  },

  isCopy: function(){
      return true;
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

  _getIconUrl: function(name) {
    var name = name
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

    //解决侧别的问题,marker 只有左右，中间
    L.FormBuilder.LeftRightChoice.prototype.choices = L.FormBuilder.LeftRightChoice.prototype.choicesLRM;

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
        this.properties.name = name.input.value = text.trim()
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
      if(data && (data[pos] !== undefined)){
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
    var iconUrl = this._getIconUrl();
    if(iconUrl){
        stringMap['pic'] = window.location.protocol +
                           "//" +
                           window.location.host
                           + iconUrl
    }else{
        stringMap['pic'] = ""
    }

    return stringMap
  },

});
