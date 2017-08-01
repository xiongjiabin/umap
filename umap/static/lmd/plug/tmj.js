L.Storage.TuMianJing = L.Storage.HuangShanDeng.extend({
  CLASS_ALIAS: '凸面镜',
  CLASS_NAME: 'tumianjing',
  defaultColor: 'white',
  GuardbarCatSwitcher:[
      ["1","单柱式"],
      ["2","附着式"]
  ],
  picUrl: "/static/storage/src/img/tmj.png",

  preInit: function() {
    if (!this.properties['className']) {
        this.properties['className'] = this.getClassName()

        this.properties._storage_options = {
            gbc: 1,
            tmjwz:1,
            scale:  10,
            rotate:  0,
            color: this.defaultColor,
            sn: '',
            gbn: 1,
            lr: 1,
        }
        this.properties.name = lmd.getOptionsToMap(this.GuardbarCatSwitcher)[this.properties._storage_options['gbc']] || '';
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

  getBasicOptions: function () {
      return [
        'properties._storage_options.gbc',//类别
        'properties._storage_options.lr',
        'properties._storage_options.tmjwz',//位置
        'properties._storage_options.sn',//桩号
        'properties._storage_options.gbn',//数量
        'properties._storage_options.tmjcc', //尺寸
        'properties._storage_options.ds',
      ];
  },


  getStringMap: function(){
      var stringMap = L.Storage.FeatureMixin.getStringMap.call(this);
      stringMap['tmjcc'] = this.getOption('tmjcc');
      var tmjwz = +this.getOption('tmjwz');
      stringMap['tmjwz'] = lmd.getOptionsToMap(L.FormBuilder.Tmjwz.prototype.selectOptions)[tmjwz] || '';
      return stringMap;
  }
});

lmd.tjTuMianJing = function(){
    var data = []
    var titles = {no:'序号',
        sn: '桩号',
        pos: '侧别',
        name: '类别',
        tmjwz: '位置',
        gbn: '数量(个)',
        tmjcc: '立柱尺寸(mm)',
        ds: '状态',
    }
    data.push(lmd.objectToArray(titles))
    delete titles.no

    var i = 1
    var className = null;
    this.eachLayerFeature(function (feature) {
        className = feature.getClassName();
        if(className === L.Storage.TuMianJing.prototype.CLASS_NAME) {
            data.push(lmd.getTjData(feature,i,titles))
            i++
        }
    })

    lmd.processData(data)
    new CsvGenerator(data,  '凸面镜.csv').download(true);
}

lmd.tjs.push({ label: '凸面镜', process: lmd.tjTuMianJing});

//凸面镜的尺寸
L.FormBuilder.TmjSizeSwitcher = L.FormBuilder.EmptySwitcher.extend({
    selectOptions: [
        [undefined,"无"],
        ["600", "600mm"],
        ["800", "800mm"],
        ["1000", "1000mm"],
    ]
});

L.FormBuilder.Tmjwz = L.FormBuilder.EmptySwitcher.extend({
    selectOptions:[
        ["1", "急弯"],
        ["2", "交叉口"],

    ]
});
L.Storage.FormBuilder.prototype.defaultOptions['tmjcc'] = {handler:'TmjSizeSwitcher','label':'尺寸'};
L.Storage.FormBuilder.prototype.defaultOptions['tmjwz'] = {handler:'Tmjwz','label': '位置'};


L.Storage.DataLayer.prototype._pointToClass['tumianjing'] = L.Storage.TuMianJing;

L.S.Editable.prototype.createTuMianJing = function( latlng ){
   return new L.Storage.TuMianJing(this.map, latlng)
};

L.Editable.prototype.startTuMianJing = function(latlng,options){
  latlng = latlng || this.map.getCenter();
  var label = this.createTuMianJing(latlng, options);
  this.connectCreatedToMap(label);
  var editor = label.enableEdit();
  editor.startDrawing();
  return label;
};

L.Storage.Map.include({
  startTuMianJing: function(){
      return this.editTools.startTuMianJing();
  }
});

L.Storage.SubDrawTuMianJingAction = L.Storage.SubAction.extend({

    options: {
        toolbarIcon: {
          html: '凸面镜',
          tooltip: '凸面镜'
        }
    },
    addHooks: function () {
        this.map.startTuMianJing();
        L.Storage.SubAction.prototype.addHooks.call(this)
    }
});

L.Storage.DrawOtherAction.prototype.options.subActions.push(L.Storage.SubDrawTuMianJingAction);
