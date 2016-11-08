
//这个类主要作用是做一些自己的特殊处理，有别于L.Storage.FeatureMixin
//比如对待名字的处理,增加桩号等基本属性
L.Storage.LmdFeatureMixin  = {
  edit: function(e) {
  if(!this.map.editEnabled || this.isReadOnly()) return;
  var container = L.DomUtil.create('div');

  var builder = new L.S.FormBuilder(this, ['datalayer'], {
    callback: function () {this.edit(e);}  // removeLayer step will close the edit panel, let's reopen it
  });
  container.appendChild(builder.build());

  var properties = [], property,i = 0, len = 0;

  // add a basic properties for our new design
  var basicOptions = this.getBasicOptions();
  for(i = 0, len = basicOptions.length; i < len; i++){
     property = basicOptions[i];
     if (L.Util.indexOf(['name', 'description','className'], property) !== -1) {continue;}
     properties.push(property);
  }

  //添加在layer自定义的属性列表
  for (i = 0; i < this.datalayer._propertiesIndex.length; i++) {
    property = this.datalayer._propertiesIndex[i];
    if (L.Util.indexOf(['name', 'description','className'], property) !== -1) {continue;}
      properties.push(['properties.' + property, {label: property}]);
  }

  // We always want name and description for now (properties management to come)
  properties.push('properties.name');
  properties.push('properties.description');
  builder = new L.S.FormBuilder(this, properties,{
      id: 'storage-feature-properties',
      callback: this.resetTooltip,
      listenChange: true
    }
  );
  container.appendChild(builder.build());
  this.appendEditFieldsets(container);
  var advancedActions = L.DomUtil.createFieldset(container, L._('Advanced actions'));
  this.getAdvancedEditActions(advancedActions);
  this.map.ui.openPanel({data: {html: container}, className: 'dark'});
  this.map.editedFeature = this;
  if (!this.isOnScreen()) this.bringToCenter(e);
}}

L.Storage.LmdMarker = L.Storage.Marker.extend({

    preInit: function() {
      if(!this.properties['className']){
        this.properties['className'] = this.getClassName()
      }
      if(!this.properties._storage_options.mt) {
        this.properties._storage_options = {
          mt: "" + lmd.MARKER_WARMING,
          mic: "1",
          msh: "1",
          mss: "1",
          lr: "1",
          ds: "1"
        }
      }
    },

    //added by xiongjiabin
    getBasicOptions: function () {
        return [
          'properties._storage_options.mt',
          'properties._storage_options.mic',
          'properties._storage_options.msh',
          'properties._storage_options.mss',
          'properties._storage_options.lr',
          'properties._storage_options.sn',
          'properties._storage_options.ds'
        ];
    },

    getShapeOptions: function () {
        return [
            'properties._storage_options.color',
            'properties._storage_options.iconUrl',
        ];
    },

    _getIconUrl: function (name) {
        var baseUrl = '/static/storage/src/img/'
        var mt = this.getOption('mt')
        var mic = this.getOption('mic')
        var msh = this.getOption('msh')
        if(!mt || !mic || !msh) {
            return baseUrl + 'marker.png'
        }
        return baseUrl +  [mt,mic,''].join('/') + msh + '.jpg'
    },

    getIconClass: function () {
        var mt = this.getOption('mt')
        var mic = this.getOption('mic')
        var className = lmd.getMarkerThirdClass(mt,mic)
        return className
    },

    getIcon: function () {
        var Class = L.Storage.Icon[this.getIconClass()] || L.Storage.Icon.Rect;
        return new Class(this.map, {feature: this});
    },

    getClassName: function () {
        return 'lmdMarker';
    },

    edit: function (e){
        //通过改变对应的select的prototype的selectOptions来改变需要变化的options值
        //初始化的情况下，其实js中的class也是一个value,可以随便去改变其值 10-20 aftrer third debate of trump&hilary
        var mt = this.getOption('mt') || 1
        var mtOptions = lmd.getMarkerCategorySecond(mt)
        L.FormBuilder.MarkerIconClassSwitcher.prototype.selectOptions = mtOptions;
        var mic = this.getOption('mic') || mtOptions[0][0] || 1
        L.FormBuilder.MarkerSpeedSizeSwitcher.prototype.selectOptions = lmd.getMarkerCategoryThird(mt,mic);
        L.FormBuilder.MarkerShapeSwitcher.prototype.selectOptions = lmd.getMarkerCategoryThirdWife(mt,mic);

        L.Storage.LmdFeatureMixin.edit.call(this,e)
    },

    //added by xiongjiabin
    //for listen the select change event for basic operations 2016-10-18
    //对应编辑框的select的变化是一个体系，之间都有一些错综复杂的关系
    //这个东西，可能就是react处理data的优势了，数据变化对应试图发生变化
    change: function ( e ){
        //console.log(e);
        if(!e.target) return;
        var msh = this.xiongjiabin.helpers['properties._storage_options.msh']
        var mic = this.xiongjiabin.helpers['properties._storage_options.mic']
        var mss = this.xiongjiabin.helpers['properties._storage_options.mss']

        if(e.target.name === 'mt') {
          //console.log('markerType changed, new value:', e.target.value)
          var mshOptions = lmd.getMarkerCategorySecond(e.target.value)
          mic.resetOptions(mshOptions);
          mss.resetOptions(lmd.getMarkerCategoryThird(e.target.value,mshOptions[0][0]))
          msh.resetOptions(lmd.getMarkerCategoryThirdWife(e.target.value,mshOptions[0][0]))
          this._redraw();
        } else if(e.target.name === 'mic') {
          var mt = this.getOption('mt');
          mss.resetOptions(lmd.getMarkerCategoryThird(mt, e.target.value))
          msh.resetOptions(lmd.getMarkerCategoryThirdWife(mt,e.target.value))
          this._redraw();
        } else if(e.target.name === 'msh'){
          this._redraw();
        }else {

        }
    }
});


L.Storage.LmdPillar = L.Storage.Marker.extend({

    getSvgData( type, rotate, scale,translatex, translatey){
      translatex = translatex || 75
      translatey = translatey || 75
      var svgHeader = '<?xml version="1.0" encoding="UTF-8" standalone="no"?> <svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" version="1.1">';
      var svgFooter = '</svg>';
      var rotateStr = '<g style="fill:#ffcc00" transform="translate(' + translatex + ',' + translatey + ') rotate(' + rotate + ') scale(' + scale + ')">';
      var svgStr = svgHeader +  rotateStr

      var typeSvg = {
        1:'<circle cx="91.837326" cy="17.580078" r="14.5" /> <rect width="178" height="20" x="2" y="31.325439" /></g>',//单柱式
        2:'<circle cx="42.341717" cy="16.31813" r="14.5" /> <circle cx="129.88086" cy="15.88588" r="14.5" /> <rect width="178" height="25" x="2" y="30.106392" /></g>',//双柱式
        3:'<rect width="149" height="25" x="2" y="2" /><circle cx="166" cy="15" r="15" /> </g>',//单悬臂式
        4:'<rect width="72.986015" height="25" x="106.27666" y="14.277634" /> <circle cx="90.311035" cy="16.431107" r="14.5" /> <rect width="72.478447" height="24.748737" x="2" y="14.679733" /></g>',//双悬臂式
        5:'<rect width="121.90018" height="25" x="31.11552" y="3.5418777" /> <circle cx="16.5" cy="15.179672" r="14.5" /> <circle cx="167.53844" cy="15.409348" r="14.5" /></g>',//门架式
      }
      svgStr += typeSvg[type] || typeSvg[1]

      svgStr += svgFooter;
      console.log(svgStr)
      return svgStr
    },

    preInit: function() {
      if(!this.properties['className']){
        this.properties['className'] = this.getClassName()
      }
    },

    //added by xiongjiabin
    getBasicOptions: function () {
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

    getShapeOptions: function () {
        return [
            'properties._storage_options.color',
            'properties._storage_options.iconUrl',
            'properties._storage_options.rotate'
        ];
    },

    _getIconUrl: function (name) {
      var ps = this.getOption('ps')
      var rotate = this.getOption('rotate') || 0
      var icon = this.getSvgData(ps,rotate,0.4,75,75)
      // here's the trick, base64 encode the URL
      var svgURL = "data:image/svg+xml;base64," + btoa(icon);
      return svgURL
    },

    getIcon: function () {
        var Class =  L.Storage.Icon.Pillar;
        return new Class(this.map, {feature: this});
    },

    getClassName: function () {
        return 'lmdPillar';
    },

    edit: function (e){
        L.Storage.LmdFeatureMixin.edit.call(this,e)
    },

    change: function ( e ){
        //console.log(e);
        if(!e.target) return;
        var ps = this.xiongjiabin.helpers['properties._storage_options.ps']
        if(e.target.name === 'ps') {
          this._redraw();
        }
    }
});
