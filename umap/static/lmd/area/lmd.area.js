
L.Storage.LmdArea = L.Storage.Polygon.extend({

  //    ["1","修剪树木"],
  //    ["2","削挖土坡"],
  //    ["3","拆除广告牌"],
  //    ["4","移除大石"],
  //    ["5","清除灌木"],
  //    ["99","其他"]
  units:  ['','棵','立方','个','立方','平方'],
  defaultName: '修剪树木',

  preInit: function() {
    if (!this.properties['className']) {
      this.properties['className'] = this.getClassName()

      this.properties._storage_options = {
        at: "1",
        lr: "1",
        color:'Red',
        fillOpacity: '0.6'
      }
      this.properties.name = this.defaultName
    }
  },

  //added by xiongjiabin
  getBasicOptions: function() {
    return [
      'properties._storage_options.at',
      'properties._storage_options.lr',
      'properties._storage_options.gbss',//起始桩号
      'properties._storage_options.gbse',
      'properties._storage_options.gbn',//面积或者数量
      //'properties._storage_options.ds'
    ];
  },


  getClassName: function() {
    return 'lmdArea';
  },

  edit: function(e) {

    if(!this.map.editEnabled) {
        return false
    }
    //解决侧别的问题,area 只有左右，中间
    L.FormBuilder.LeftRightChoice.prototype.choices = L.FormBuilder.LeftRightChoice.prototype.choicesLRM;

    var builder = L.Storage.LmdFeatureMixin.edit.call(this, e)
    var gbn = builder && builder.helpers['properties._storage_options.gbn']
    //at.fire('change')
    this.gbnDisplay(gbn,this.getOption('at'))
  },

  resetTooltip: function(e) {
    L.Storage.FeatureMixin.resetTooltip.call(this,e)
    if(!e) return
    var gbn = e.target.helpers['properties._storage_options.gbn']
    if(e.helper.name === 'at') {
        this.updateName(e)
        this.gbnDisplay(gbn,e.helper.value())
    }
  },

  gbnDisplay: function(gbn, value){
      if(!gbn) return
      //var unitStr = this.units[value] | ''
      if(this.units[value]){
          gbn.label.innerHTML = '数量 （' + this.units[value] + ')'
      }else{
          gbn.label.innerHTML = '数量'
      }
  },

  //name是自动生成的，依据所选择的参数
  updateName: function(e){
    if(!e) return

    var name = e.target.helpers['properties.name']
    var nameValue = name.value()
    if(nameValue && nameValue.startsWith('@')) {
      return
    }

    var at = e.target.helpers['properties._storage_options.at']
    var text = at.getSelectText()
    var result = text.trim()
    this.properties.name = name.input.value = result

    return
  },

  getStringMap: function(){

    var stringMap = L.Storage.FeatureMixin.getStringMap.call(this)
    if(!stringMap['name']){
        stringMap['name'] = this.defaultName
    }

    var sns = this.getOption('gbss')
    var sne = this.getOption('gbse')
    var snsString = L.Storage.LmdFeatureMixin.showSubNice.call(this,sns)
    var sneString = L.Storage.LmdFeatureMixin.showSubNice.call(this,sne)
    if(sne > sns ){
      stringMap['gbss'] = snsString
      stringMap['gbse'] = sneString
      stringMap['sortField'] = {k1: sns}
    }else{
      stringMap['gbss'] = sneString
      stringMap['gbse'] = snsString
      stringMap['sortField'] = {k1: sne}
    }

    var unit = this.units[this.getOption('at')] || ''
    stringMap['gbn'] = this.getOption('gbn') + unit;//数量

    return stringMap
  },
});
