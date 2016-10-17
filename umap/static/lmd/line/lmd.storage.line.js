L.Storage.Pillar = L.Polyline.extend({
    parentClass: L.Polyline,
    includes: [L.Storage.FeatureMixin, L.Storage.PathMixin, L.Mixin.Events],

    staticOptions: {
        stroke: true,
        fill: false
    },

    isSameClass: function (other) {
        return other instanceof L.S.Polyline;
    },

    getClassName: function () {
        return 'pillar';
    },

    getMeasure: function () {
        var length = L.GeoUtil.lineLength(this.map, this._defaultShape());
        return L.GeoUtil.readableDistance(length, this.map.measureTools.getMeasureUnit());
    },

    getContextMenuEditItems: function (e) {
        var items = L.S.PathMixin.getContextMenuEditItems.call(this, e),
            vertexClicked = e.vertex, index;

        if (vertexClicked) {
            index = e.vertex.getIndex();
            if (index !== 0 && index !== e.vertex.getLastIndex()) {
                items.push({
                    text: L._('Split line'),
                    callback: e.vertex.split,
                    context: e.vertex
                });
            } else if (index === 0 || index === e.vertex.getLastIndex()) {
                items.push({
                    text: L._('Continue line (Ctrl-click)'),
                    callback: e.vertex.continue,
                    context: e.vertex.continue
                });
            }
        }
        return items;
    },


    isMulti: function () {
        return !L.Polyline._flat(this._latlngs) && this._latlngs.length > 1;
    },

    getVertexActions: function (e) {
        var actions = L.S.FeatureMixin.getVertexActions.call(this, e),
            index = e.vertex.getIndex();
        if (index === 0 || index === e.vertex.getLastIndex()) actions.push(L.S.ContinueLineAction);
        else actions.push(L.S.SplitLineAction);
        return actions;
    }

});
