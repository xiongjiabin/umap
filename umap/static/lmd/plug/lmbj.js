/*
立面/实体标记，不可见
2017-2-13
*/

L.Storage.Lmbj = L.Storage.Hide.extend({
  defaultName: '立面/实体标记',
  preInit: function(){

    return L.Storage.Hide.prototype.preInit.call(this)
  },
  getDisplayName: function(){
    var gbss = this.getOption('gbss') || ''
    var gbse = this.getOption('gbse') || ''
    var pos = this.getOption('lr') || L.FormBuilder.LeftRightChoice.prototype.default
    var posStr = lmd.getOptionsToMap(L.FormBuilder.LeftRightChoice.prototype.allChoices)[pos] || ''
    return '<tspan x=0 dy=0>**' + this.properties.name + '**</tspan>' +
           '<tspan x=0 dy=1.2em>(' + gbss + '-' + gbse + ')</tspan>' + posStr;
  },

  getBasicOptions: function(){
    return [
    'properties._storage_options.lr',
    'properties._storage_options.gbss',//起始桩号
    'properties._storage_options.gbse',
    //'properties._storage_options.gbl',//总长
    'properties._storage_options.gbw',//宽度
    'properties._storage_options.hHeight',//宽度
    'properties._storage_options.gba',//面积
    //'properties._storage_options.hColor',//颜色
    'properties._storage_options.lmbjm', //材料
    'properties._storage_options.ds', //设施状态
    ]
  },

  CLASS_NAME: 'lmbj',
  getClassName: function(){
     return this.CLASS_NAME
  },

  resetTooltip: function(e){

    if (!e) return;
    this.setSvgText(this.getSvgData())
    var distance, gbss, gbse,gbw, hHeight, gbaControl

    if(e.helper.name in {'gbss':0,'gbse':0, 'lr':0, 'gbw':0, 'hHeight':0}){
        var lr = +this.getOption('lr')
        var multipe = 1
        if (lr === lmd.POS_BOTH) {
            multipe = 2
        }
        //计算长度
        gbss = this.getOption('gbss');
        gbse = this.getOption('gbse');
        if( gbss && gbse ){
            gbss = gbss * 1000
            gbse = gbse * 1000
            distance = 0
            if(gbss > gbse){
                distance = gbss - gbse
            }else{
                distance = gbse - gbss
            }
            distance = Math.ceil(distance) * multipe
        }else if( (gbss && !gbse) || (!gbss && gbse) ){
            distance = 1 * multipe
        }

        gbw = +this.getOption('gbw')
        hHeight = +this.getOption('hHeight')
        gbaControl = e.target.helpers['properties._storage_options.gba']
        if(gbaControl){
            this.properties._storage_options.gba = gbaControl.input.value = distance * gbw * hHeight
        }
    }
  },


  edit: function(e){
    if(!this.map.editEnabled) {
        return false
    }

    L.FormBuilder.LeftRightChoice.prototype.choices = L.FormBuilder.LeftRightChoice.prototype.choicesLRBoth;

    var builder = L.Storage.LmdFeatureMixin.edit.call(this, e)
    var gbw = builder && builder.helpers['properties._storage_options.gbw']
    var hHeight = builder && builder.helpers['properties._storage_options.hHeight']
    var gbse = builder && builder.helpers['properties._storage_options.gbse']
    gbw && gbw.label && (gbw.label.innerHTML = '设置宽度(米)')
    hHeight && hHeight.label && (hHeight.label.innerHTML = '设置高度(米)')
    gbse && gbse.label && (gbse.label.innerHTML = gbse.label.innerHTML + '(为空的时候长度为1米)')
  },

  getStringMap: function(){
    var stringMap = L.Storage.Hide.prototype.getStringMap.call(this);
    var gba =  +(this.getOption('gba'));
    var lmbjm = +(this.getOption('lmbjm'));

    stringMap['gba'] = gba;
    stringMap['lmbjm'] = lmd.getOptionsToMap(L.FormBuilder.LmbjMaterialSwitcher.prototype.selectOptions)[lmbjm] || '';

    if(lmbjm === 1){ //反光漆
        stringMap['gba'] = 0;
        stringMap['gbaBlack'] = stringMap['gbaYellow'] = (gba/2).toFixed(2);

    }else{
        stringMap['gbaBlack'] = stringMap['gbaYellow'] = 0;
    }

    stringMap['gbw'] = +this.getOption('gbw');
    stringMap['hHeight'] = +this.getOption('hHeight');

    return stringMap;
  },

});

//车行道统计
lmd.tjLmbj = function(){
  var data = []
  var titles = {no:'序号',
                gbss: '起始桩号',
                gbse: '结束桩号',
                gbw: '设置宽度(m)',
                hHeight:'设置高度(m)',
                gba: '面积(m2)',
                gbaYellow: '黄色面积(m2)',
                gbaBlack: '黑色面积(m2)',
                pos: '侧别',
                //hColor: '颜色',
                lmbjm: '材料',
                ds: '状态',
                description:'备注'
              }
  data.push(lmd.objectToArray(titles))
  delete titles.no

  //this means map
  var i = 1
  this.eachLayerFeature(function (feature) {
      if(feature.getClassName() === L.Storage.Lmbj.prototype.CLASS_NAME){
        data.push(lmd.getTjData(feature,i,titles))
        i++
      }
  })

  lmd.processData(data)
  new CsvGenerator(data,  '立面标记.csv').download(true);
}


lmd.tjs.push({ label: '立面/实体标记', process: lmd.tjLmbj});

L.Storage.DataLayer.prototype._pointToClass[L.Storage.Lmbj.prototype.CLASS_NAME] = L.Storage.Lmbj;

L.S.Editable.prototype.createLmbj = function( latlng ){
   return new L.Storage.Lmbj(this.map, latlng)
};

L.Editable.prototype.startLmbj = function(latlng,options){
  latlng = latlng || this.map.getCenter();
  var label = this.createLmbj(latlng, options);
  this.connectCreatedToMap(label);
  var editor = label.enableEdit();
  editor.startDrawing();
  return label;
};

L.Storage.Map.include({
  startLmbj: function(){
      return this.editTools.startLmbj();
  }
});

L.Storage.SubDrawLmbjAction = L.Storage.SubAction.extend({

    options: {
        toolbarIcon: {
          html: '立面/实体标记',
          tooltip: '立面/实体标记，不用渲染'
        }
    },

    addHooks: function () {
        this.map.startLmbj();
        L.Storage.SubAction.prototype.addHooks.call(this)
    }
});

L.Storage.DrawAllBiaoxianAction.prototype.options.subActions.push(L.Storage.SubDrawLmbjAction);
