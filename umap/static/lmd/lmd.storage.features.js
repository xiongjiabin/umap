
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
     if (L.Util.indexOf(['name', 'description'], property) !== -1) {continue;}
     properties.push(property);
  }

  //添加在layer自定义的属性列表
  for (i = 0; i < this.datalayer._propertiesIndex.length; i++) {
    property = this.datalayer._propertiesIndex[i];
    if (L.Util.indexOf(['name', 'description'], property) !== -1) {continue;}
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
          'properties._storage_options.markerType',
          'properties._storage_options.markerContent',
          'properties._storage_options.leftRight',
          'properties._storage_options.subNum',
          'properties._storage_options.devStatus'
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
      L.Storage.LmdFeatureMixin.edit.call(this,e)
    },
    //added by xiongjiabin
    //for listen the select change event for basic operations 2016-10-
    change: function ( e ){
        //console.log(e);
        if(!e.target) return;
        if(e.target.name === 'markerType') {
          console.log('markerType changed, new value:', e.target.value)
          var theObject = this.xiongjiabin.helpers['properties._storage_options.markerContent']
          var options = [
            ["1",'I love you'],
            ["2",'I hate you'],
            ["3",'I like you']
          ];
          theObject.resetOptions(options);
          this._redraw();
        } else if(e.target.name === 'markerContent') {
          this._redraw();
          console.log('markerContent changed, new value:', e.target.value)
        } else {
          console.log('un defined message')
        }
    }

});
