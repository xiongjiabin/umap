L.Storage.Icon.Rect = L.Storage.Icon.extend({
    initialize: function(map, options) {
        var default_options = {
            iconAnchor: new L.Point(6, 6),
            popupAnchor: new L.Point(0, -6),
            tooltipAnchor: new L.Point(6, 0),
            className: 'storage-rect-icon'
        };
        options = L.Util.extend({}, default_options, options);
        L.Storage.Icon.prototype.initialize.call(this, map, options);
    },

    _setColor: function() {
        this.elements.main.style.backgroundColor = this._getColor();
    },

    createIcon: function() {
      this.elements = {};
      this.elements.main = L.DomUtil.create('div');
      this.elements.container = L.DomUtil.create('div', 'icon_container', this.elements.main);
      this.elements.img = L.DomUtil.create('img', null, this.elements.container);
      var src = this._getIconUrl('icon');
      if (src) this.elements.img.src = src;
      this._setColor();
      this._setIconStyles(this.elements.main, 'icon');
      return this.elements.main;
    }

});

L.Storage.Icon.Square = L.Storage.Icon.Rect.extend({
    initialize: function(map, options) {
        var default_options = {
            iconAnchor: new L.Point(6, 6),
            popupAnchor: new L.Point(0, -6),
            tooltipAnchor: new L.Point(6, 0),
            className: 'storage-square-icon'
        };
        options = L.Util.extend({}, default_options, options);
        L.Storage.Icon.prototype.initialize.call(this, map, options);
    }
});

//这个是针对所有的
L.Storage.Icon.Opaque = L.Storage.Icon.Rect.extend({
    initialize: function(map, options) {
        var default_options = {
            iconAnchor: new L.Point(6, 6),
            popupAnchor: new L.Point(0, -6),
            tooltipAnchor: new L.Point(6, 0),
            className: 'storage-opaque-icon'
        };
        options = L.Util.extend({}, default_options, options);
        L.Storage.Icon.prototype.initialize.call(this, map, options);
    },

    _setColor: function() {
        //对透明的图形来说，不需要底图
    },
});

L.Storage.Icon.LmdCircle = L.Storage.Icon.Rect.extend({
    initialize: function(map, options) {
        var default_options = {
            iconAnchor: new L.Point(6, 6),
            popupAnchor: new L.Point(0, -6),
            tooltipAnchor: new L.Point(6, 0),
            className: 'storage-lmdcircle-icon'
        };
        options = L.Util.extend({}, default_options, options);
        L.Storage.Icon.prototype.initialize.call(this, map, options);
    }
});

//这个是针对所有的
L.Storage.Icon.Pillar = L.Storage.Icon.Rect.extend({
    initialize: function(map, options) {
        var default_options = {
            iconAnchor: new L.Point(6, 6),
            popupAnchor: new L.Point(75, 75),
            tooltipAnchor: new L.Point(6, 0),
            className: 'storage-pillar-icon'
        };
        options = L.Util.extend({}, default_options, options);
        L.Storage.Icon.prototype.initialize.call(this, map, options);
    },

    _setColor: function() {
        //对透明的图形来说，不需要底图
    },
});
