
L.Storage.PrintRect = L.Storage.SVGObject.extend({

  defaultColor: 'red',
  defaultName: '打印框',
  CLASS_ALIAS: '打印框',
  ratio: 4961 / 3508,
  widthMeters: 2000,

  initialize: function(map, latlng, options) {
    L.Storage.LmdFeatureMixin.initialize.call(this, map, latlng, options)
  },

  preInit: function() {
    if (!this.properties['className']) {
      this.properties['className'] = this.getClassName()

      //console.log(preOptions)
      this.properties._storage_options = {
        rotateCenter:  0,
        color: this.defaultColor
      }
      this.properties.name = this.defaultName
    }

    var options = {}
    var _storage_options = this.properties._storage_options
    var gbss = this.getOption('gbss');
    var gbse = this.getOption('gbse');

    options.svgText = this.getSvgData(gbss, gbse , _storage_options['color'],_storage_options['rotateCenter'])

    var validObj = { color:1}
    for(var i in _storage_options){
      if(validObj[i]){
        options[i] = _storage_options[i]
      }
    }
    return options
  },

  isCopy: function(){
      return true;
  },

  resetTooltip: function(e){
    if( !e ) return

    if (e.helper.name in {'gbss': 0, 'gbse': 0, 'rotateCenter': 0}) {
        this._redraw();

        if(e.helper.name === 'gbss'){
            var sn = +this.getOption('gbss');
            var endSn = sn + 0.05;
            var gbssAngleControl = e.target.helpers['properties._storage_options.gbssAngle']
            gbssAngleControl.input.value = this.properties._storage_options['gbssAngle'] = this.map.getSubAngle(endSn,sn);
        }

        if(e.helper.name === 'gbse'){
            sn = +this.getOption('gbse');
            var beginSn = sn - 0.05;
            var gbseAngleControl = e.target.helpers['properties._storage_options.gbseAngle']
            gbseAngleControl.input.value = this.properties._storage_options['gbseAngle'] = this.map.getSubAngle(beginSn,sn);
        }

        if(e.helper.name in {gbse:0,gbss:0}){
            this.updateName(e);
        }
    }
  },

  updateName: function(e){
    if(!e) return
    var reg = /^\W*\d*\s+(.+)$/
    var name = e.target.helpers['properties.name']
    var nameValue = name.value()
    if(nameValue && nameValue.startsWith('@')) {
      return
    }

    var text = this.defaultName + '(' + (+this.getOption('gbss')) + '-' + (+this.getOption('gbse')) + ')'
    this.properties.name = name.input.value = text.trim()
    return
  },

  getDistancePxs: function( distance ){
    var map = this.map,
        y = map.getSize().y / 2;
    var pxs = 100;

    var maxMeters = map.distance(
        map.layerPointToLatLng([0, y]),
        map.layerPointToLatLng([pxs, y]));
    return Math.round(distance / maxMeters * pxs);
  },

  getSvgData(gbss, gbse, color, rotate) {
    gbse = +gbse || 0;
    gbss = +gbss || 0;
    var typeSvg = {
      "a3": '<rect transform="rotate({{rotate}},{{cx}},{{cy}})" ' +
            'style="stroke:black;fill:{{color}}; fill-opacity:0.3; stroke-width:1px" x="0" y="0" width="{{width}}" height="{{height}}"/>' +
            '<rect transform="rotate({{rotate}},{{cx}},{{cy}})" width="20" height="20" style="fill:yellow" x="0" y="0" />'
    }
    var svgStr = typeSvg["a3"]
    var textTemplate = '<text style="font-size:14pt;" x="{{width}}" y="{{height}}">{{gbss}} - {{gbse}}</text>'

    color = color || defaultColor
    var width = this.getDistancePxs(this.widthMeters);
    var height = Math.round(width / this.ratio);
    var fontSize = 14;
    var cx = width/2;
    var cy = height/2;


    svgStr = svgStr.replace(/{{height}}/g,height).
                    replace(/{{color}}/g,color).
                    replace(/{{width}}/g,width).
                    replace(/{{rotate}}/g,rotate).
                    replace(/{{cx}}/g,cx).
                    replace(/{{cy}}/g,cy);

    textTemplate = textTemplate.
                    replace(/{{height}}/g, cy).
                    replace(/{{width}}/g,cx).
                    replace(/{{gbse}}/g,gbse).
                    replace(/{{gbss}}/g,gbss);
    svgStr = svgStr + textTemplate;

    return svgStr
  },

  _redraw: function() {
    var gbss = this.getOption('gbss')
    var gbse = this.getOption('gbse')
    var color = this.getOption('color')
    var rotate = this.getOption('rotateCenter')
    this.setSvgText(this.getSvgData(gbss, gbse ,color,rotate))
    L.Storage.SVGObject.prototype._redraw.call(this)
  },

  _onDragEnd: function(e){
    this.isDirty = true;

    var latlng = this.getLatLng();
    var width = this.getDistancePxs(this.widthMeters);
    var height = Math.round(width / this.ratio);
    var cx = width/2;
    var cy = height/2;
    var centerPoint = this.map.latLngToLayerPoint(latlng);
    var destX = centerPoint['x'] + cx;
    var destY = centerPoint['y'] + cy;
    var dest = this.map.layerPointToLatLng([destX, destY]);
    //更新gps值
    this.properties._storage_options['centerGPS'] = dest.lat + '/' + dest.lng;

    this.edit(e);
  },

  getBasicOptions: function() {
    return [
      'properties._storage_options.gbss',//起始桩号
      'properties._storage_options.gbse',
      'properties._storage_options.rotateCenter',
      'properties._storage_options.gbssAngle',
      'properties._storage_options.gbseAngle',
    ];
  },

  getShapeOptions: function() {
    return [
      'properties._storage_options.color',
      'properties._storage_options.centerGPS'
    ];
  },

  CLASS_NAME: 'prect',
  getClassName: function() {
    return this.CLASS_NAME;
  },

  edit: function(e) {
    if(!this.map.editEnabled) {
        return false
    }

    L.Storage.LmdFeatureMixin.edit.call(this, e);
  },


  getStringMap: function(){
    var stringMap = {};
    stringMap['gbss'] = this.getOption('gbss');
    stringMap['gbse'] = this.getOption('gbse');
    stringMap['rotateCenter'] = this.getOption('rotateCenter');
    stringMap['gbssAngle'] = this.getOption('gbssAngle');
    stringMap['gbseAngle'] = this.getOption('gbseAngle');
    stringMap['centerGPS'] = this.getOption('centerGPS');
    return stringMap
  },

});

function prettyDate(date) {
    if(!date) date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    if(month < 10){
        month = '0' + month;
    }
    return [year,month].join('.');
}

//
lmd.tjPrintRect = function(){

  var project = {
    'lmd': 'lamudatech',
    'company':  '',
    'project': this.getOption('name'),
    'address': '',
    'date': prettyDate(),
    'left': '',
    'right': '',
    'totalPages': 1,
    'digram': '',
    'current':0,
    pages: []
  };


  var pages = [];
  var errorTxt = '';
  this.eachLayerFeature(function (feature) {
      if(feature.getClassName() === L.Storage.PrintRect.prototype.CLASS_NAME){
        errorTxt = '';
        var stringmap = feature.getStringMap();
        if(stringmap['gbss'] === null){
          errorTxt = '起始桩号为空 ';
        }
        if(stringmap['gbse'] === null){
          errorTxt += '结束桩号为空 ';
        }
        if(stringmap['centerGPS'] === null){
          errorTxt += 'GPS中心为空 ';
        }
        if(errorTxt){
          feature.bringToCenter();
          feature.map.ui.alert({content: feature.properties.name + ':' + errorTxt, level:'error'});
          throw new Error();
        }
        pages.push( stringmap )
      }
  })

  pages.sort(function(a,b){
    return a.gbss - b.gbss;
  })

  var normalPages = [];
  var page = null;
  for(var i = 0 ,len = pages.length; i < len; i++){
    page = pages[i];
    normalPages.push({
      'page': i + 1,
      'subs': L.Storage.LmdFeatureMixin.showSubNice.call(this,page['gbss']) +
              '-' +
              L.Storage.LmdFeatureMixin.showSubNice.call(this,page['gbse']),
      'angle': 360 - (+page['rotateCenter']),
      'url': window.location.origin + window.location.pathname + '#18/' + page['centerGPS'] || '',
      'gbssAngle': +page['gbssAngle'],
      'gbseAngle': +page['gbseAngle']
    })
  }
  project.totalPages = normalPages.length;
  project.pages = normalPages;

  new JsonGenerator(project, 'print.lmd').download(true);
}

lmd.tjs.push({ label: '打印框', process: lmd.tjPrintRect});


L.Storage.DataLayer.prototype._pointToClass[L.Storage.PrintRect.prototype.CLASS_NAME] = L.Storage.PrintRect;

L.S.Editable.prototype.createPrintRect = function( latlng ){
   return new L.Storage.PrintRect(this.map, latlng)
};

L.Editable.prototype.startPrintRect = function(latlng,options){
  latlng = latlng || this.map.getCenter();
  var label = this.createPrintRect(latlng, options);
  this.connectCreatedToMap(label);
  var editor = label.enableEdit();
  editor.startDrawing();
  return label;
};

L.Storage.Map.include({
  startPrintRect: function(){
      return this.editTools.startPrintRect();
  }
});

L.Storage.SubDrawPrintRectAction = L.Storage.SubAction.extend({

    options: {
        toolbarIcon: {
          html: '打印框',
          tooltip: '打印框'
        }
    },

    addHooks: function () {
        this.map.startPrintRect();
        L.Storage.SubAction.prototype.addHooks.call(this)
    }
});

L.Storage.DrawOtherAction.prototype.options.subActions.push(L.Storage.SubDrawPrintRectAction);
