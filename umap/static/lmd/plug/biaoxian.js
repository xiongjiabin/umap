L.Storage.Biaoxian = L.Storage.Jiansu.extend({
  gbType: L.Storage.GB_TYPE_BIAOXIAN,
  dsColors: [null, 'White', 'White','White'], //所有都一样
  defaultName: '横向减速标线-急弯',
  CLASS_ALIAS: '横向减速标线',

  //added by xiongjiabin
  getBasicOptions: function () {
      return [
        'properties._storage_options.gbc',//类别
        'properties._storage_options.lr',
        'properties._storage_options.gbss',//起始桩号
        'properties._storage_options.gbse',
        'properties._storage_options.gbl',//总长
        'properties._storage_options.jslmTs',//每道设置条数
        'properties._storage_options.gbw',//宽度
        'properties._storage_options.gba',//面积
        'properties._storage_options.hColor',//改成color
        'properties._storage_options.gbm', //材料
        'properties._storage_options.ds',
      ];
  },

  edit: function(e) {
    if(this.map.editEnabled) {
        var gbt = L.Storage.GB_TYPE_JIANSU; //类别属性和减速路面一样，
        var gbcOptions = L.Storage.getGBOptions(gbt)
        L.FormBuilder.GuardbarCatSwitcher.prototype.selectOptions =  gbcOptions;

        //解决侧别的问题
        L.FormBuilder.LeftRightChoice.prototype.choices = L.FormBuilder.LeftRightChoice.prototype.choicesLRM;
        var builder = L.Storage.LmdFeatureMixin.edit.call(this, e);
    }
  },

  CLASS_NAME: 'biaoxian',
  getClassName: function () {
      return this.CLASS_NAME; //历史遗留问题，用标线来代替横向减速标线
  },

  setStyle: function (options) {
      L.Storage.BarTypeRect.call(this,options)
  },

  //name是自动生成的，依据所选择的参数
  updateName: function(e){
    if(!e) return

    var name = e.target.helpers['properties.name']
    var nameValue = name.value()
    if(nameValue && nameValue.startsWith('@')) {
      return
    }

    var gbc = e.target.helpers['properties._storage_options.gbc']
    var text = gbc.getSelectText()
    var result = this.CLASS_ALIAS + '-' + text.trim()
    this.properties.name = name.input.value = result

    return
  },

  getStringMap: function(){
    var stringMap = L.Storage.Jiansu.prototype.getStringMap.call(this);
    var hColor =  +(this.getOption('hColor'));
    var gbm = +(this.getOption('gbm'));

    stringMap['hColor'] = lmd.getOptionsToMap(L.FormBuilder.ColorSwitcher.prototype.selectOptions)[hColor] || '';
    stringMap['gbm'] = lmd.getOptionsToMap(L.FormBuilder.MaterialSwitcher.prototype.selectOptions)[gbm] || '';

    var num = 1;
    var lr = +this.getOption('lr') || 1;
    if(lmd.POS_MIDDLE === lr) num = 2;
    stringMap['num'] = num;

    return stringMap;
  },
});

//横向减速标线
lmd.tjHxbx = function(){
  var data = []
  var titles = {no:'序号',
                name: '类型',
                gbss: '起始桩号',
                gbse: '结束桩号',
                pos: '侧别',
                num: '数量(处)',
                gbl: '长度(米)',
                jslmTs: '每道设置条数',
                hColor:'颜色',
                gbm: '材料',
                gbw: '宽度(米)',
                gba: '面积(平方米)',
                ds: '状态',
                description:'备注'
              }
  data.push(lmd.objectToArray(titles))
  delete titles.no

  //this means map
  var i = 1
  this.eachLayerFeature(function (feature) {
      if(feature.getClassName() in { 'biaoxian':0, 'zxbx': 0 }) {
          data.push(lmd.getTjData(feature,i,titles))
          i++
      }
  })

  lmd.processData(data)

  new CsvGenerator(data,  '减速标线.csv').download(true);
}

lmd.tjs.push({ label: '减速标线', process: lmd.tjHxbx});

L.Storage.Zxbx = L.Storage.Guardbar.extend({
  gbType: L.Storage.GB_TYPE_BIAOXIAN,
  dsColors: [null, 'White', 'White','White'], //所有都一样
  defaultName: '纵向减速标线-急弯',
  CLASS_ALIAS: '纵向减速标线',

  CLASS_NAME: 'zxbx',
  getClassName: function () {
      return this.CLASS_NAME;
  },

 getDisplayName: function(){
    var gbss = this.getOption('gbss') || 0
    var gbse = this.getOption('gbse') || 0
    return  this.properties.name + '(' + gbss + '-' + gbse + ')'
 },

  //added by xiongjiabin
  getBasicOptions: function () {
      return [
        'properties._storage_options.gbc',//类别
        'properties._storage_options.lr',
        'properties._storage_options.gbss',//起始桩号
        'properties._storage_options.gbse',
        'properties._storage_options.gbl',//总长
        'properties._storage_options.jslmTs',//每道设置条数
        'properties._storage_options.gba',//数量
        'properties._storage_options.hColor',//改成color
        'properties._storage_options.gbm', //材料
        'properties._storage_options.ds',
      ];
  },

  resetTooltip: function(e){
    if(!e) return
    L.Storage.Guardbar.prototype.resetTooltip.call(this,e);

    //处理面积部分计算
    if(e.helper.name in {'gbss':0,'gbse':0,'gbl':0,'jslmTs':0}){
      var gbl = +this.getOption('gbl');
      var jslmTs = +this.getOption('jslmTs');
      var area = 0;
      if(gbl > 0  && gbl < 30){

      }else{
        area = 3 + (gbl - 30) * 0.3 / 2;
        area = (jslmTs * area).toFixed(2);
      }

      var gbaControl = e.target.helpers['properties._storage_options.gba']
      this.properties._storage_options.gba = gbaControl.input.value = area
    } else if (e.helper.name in {gbc: 0} ) {
      this.updateName(e);
    }
  },

  setStyle: function (options) {
      L.Storage.BarTypeRect.call(this,options)
  },
  //name是自动生成的，依据所选择的参数
  updateName: function(e){
    if(!e) return

    var name = e.target.helpers['properties.name']
    var nameValue = name.value()
    if(nameValue && nameValue.startsWith('@')) {
      return
    }

    var gbc = e.target.helpers['properties._storage_options.gbc']
    var text = gbc.getSelectText()
    var result = this.CLASS_ALIAS + '-' + text.trim()
    this.properties.name = name.input.value = result

    return
  },

  edit: function(e) {
    if(this.map.editEnabled) {
        var gbt = L.Storage.GB_TYPE_JIANSU; //类别属性和减速路面一样，
        var gbcOptions = L.Storage.getGBOptions(gbt)
        L.FormBuilder.GuardbarCatSwitcher.prototype.selectOptions =  gbcOptions;

        //解决侧别的问题
        L.FormBuilder.LeftRightChoice.prototype.choices = L.FormBuilder.LeftRightChoice.prototype.choicesLRM;
        var builder = L.Storage.LmdFeatureMixin.edit.call(this, e);
    }
  },

  getStringMap: function(){
    var stringMap = L.Storage.Guardbar.prototype.getStringMap.call(this);
    var hColor =  +(this.getOption('hColor'));
    var gbm = +(this.getOption('gbm'));

    stringMap['hColor'] = lmd.getOptionsToMap(L.FormBuilder.ColorSwitcher.prototype.selectOptions)[hColor] || '';
    stringMap['gbm'] = lmd.getOptionsToMap(L.FormBuilder.MaterialSwitcher.prototype.selectOptions)[gbm] || '';

    var jslmTs = this.getOption('jslmTs');
    stringMap['jslmTs'] = jslmTs;
    var num = 1;
    var lr = +this.getOption('lr') || 1;
    if(lmd.POS_MIDDLE === lr) num = 2;
    stringMap['num'] = num;

    return stringMap;
  },
});

L.Storage.DataLayer.prototype._lineToClass[L.Storage.Zxbx.prototype.CLASS_NAME] = L.Storage.Zxbx;

L.S.Editable.prototype.createZxbx = function( latlng ){
   return new L.Storage.Zxbx(this.map, latlng)
};

L.Editable.prototype.startZxbx = function(latlng,options){
   var line = this.createZxbx([], options);
   this.connectCreatedToMap(line);
   line.enableEdit().newShape(latlng);
   return line;
};

L.Storage.Map.include({
  startZxbx: function(){
      return this.editTools.startZxbx();
  }
});

L.Storage.SubDrawZxbxAction = L.Storage.SubAction.extend({

    options: {
        toolbarIcon: {
          html: '纵向减速标线',
          tooltip: '纵向减速标线'
        }
    },

    addHooks: function () {
        this.map.startZxbx();
        L.Storage.SubAction.prototype.addHooks.call(this)
    }
});

L.Storage.DrawAllBiaoxianAction.prototype.options.subActions.push(L.Storage.SubDrawZxbxAction);


//综合标线统计
lmd.tjBiaoXian = function(){
  var data = []
  var titles = {no:'序号',
                name: '设施',
                gbss: '起始桩号',
                gbse: '结束桩号',
                gba: '面积(m2)',
                pos: '侧别',
                hColor: '颜色',
                ds: '状态',
                description:'备注'
              }
  data.push(lmd.objectToArray(titles))
  delete titles.no

  var tjClasses = {};
  tjClasses[L.Storage.BxZxxd.prototype.CLASS_NAME] = 0; //中心线单
  tjClasses[L.Storage.BxZxxs.prototype.CLASS_NAME] = 0; //中心线双
  tjClasses[L.Storage.Biaoxian.prototype.CLASS_NAME] = 0; //横向减速标线
  tjClasses[L.Storage.Zxbx.prototype.CLASS_NAME] = 0; //纵向减速标线
  tjClasses[L.Storage.CxdFjx.prototype.CLASS_NAME] = 0; //车行道分界线
  tjClasses[L.Storage.CheXingDao.prototype.CLASS_NAME] = 0; //车行道边缘线
  tjClasses[L.Storage.Rxhdx.prototype.CLASS_NAME] = 0; //人行横道线

  //this means map
  var i = 1
  this.eachLayerFeature(function (feature) {
      if(feature.getClassName() in tjClasses){
        data.push(lmd.getTjData(feature,i,titles,1))
        i++
      }
  })

  lmd.processData(data)
  new CsvGenerator(data,  '标线合计.csv').download(true);
}


lmd.tjs.push({ label: '标线合计', process: lmd.tjBiaoXian});
