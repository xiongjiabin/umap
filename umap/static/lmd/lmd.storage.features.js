
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
    //added by xiongjiabin
    getBasicOptions: function () {
        this.properties['className'] = this.getClassName()
        return [
          'properties._storage_options.mt',
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
            'properties._storage_options.lmdIconClass',
            'properties._storage_options.iconUrl',
        ];
    },

    getIconClass: function () {
        return this.getOption('lmdIconClass');
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
      var mt = this.properties._storage_options.mt || 1
      var mtOptions = lmd.getMarkerCategorySecond(mt)
      L.FormBuilder.MarkerShapeSwitcher.prototype.selectOptions = mtOptions;
      var msh = this.properties._storage_options.msh || mtOptions[0][0] || 1
      L.FormBuilder.MarkerSpeedSizeSwitcher.prototype.selectOptions = lmd.getMarkerCategoryThird(mt,msh);

      L.Storage.LmdFeatureMixin.edit.call(this,e)
    },

    //added by xiongjiabin
    //for listen the select change event for basic operations 2016-10-18
    //对应编辑框的select的变化是一个体系，之间都有一些错综复杂的关系
    //这个东西，可能就是react处理data的优势了，数据变化对应试图发生变化
    change: function ( e ){
        //console.log(e);
        if(!e.target) return;
        if(e.target.name === 'mt') {
          //console.log('markerType changed, new value:', e.target.value)
          var msh = this.xiongjiabin.helpers['properties._storage_options.msh']
          var mshOptions = lmd.getMarkerCategorySecond(e.target.value)
          msh.resetOptions(mshOptions);
          var mss = this.xiongjiabin.helpers['properties._storage_options.mss']
          mss.resetOptions(lmd.getMarkerCategoryThird(e.target.value,mshOptions[0][0]))
          this._redraw();
        } else if(e.target.name === 'msh') {
          var mt = this.properties._storage_options.mt
          var mssObject = this.xiongjiabin.helpers['properties._storage_options.mss']
          mssObject.resetOptions(lmd.getMarkerCategoryThird(mt, e.target.value))
          this._redraw();
          //console.log('markerContent changed, new value:', e.target.value)
        } else {
          //console.log('un defined message')
        }
    },


});
