pico.def('gameLayer', function(){
    this.use('piCanvas');
    this.use('piAtlas');
    this.use('piGameTileMatch');

    var
    me = this,
    terrainUpdated = true,
    layerTerrain, atlasTerrain,
    onUpdate = function(layers, elapsed){
        if (!terrainUpdated) return;

        var
        ctx = layerTerrain.getContext(),
        c = me.piCanvas,
        cw = c.getStageWidth(),
        ch = c.getStageHeight(),
        lx = Math.ceil((cw+18) / 54),
        ly = Math.ceil(ch / 72),
        x, y, r, ox, oy;

        for(x=0; x<lx; x++){
            oy = x % 2 ? -36 : 0;
            ox = Math.floor((x * 54)-18);
            for (y=0; y<ly; y++){
                r = Math.floor(Math.random()*8);
                atlasTerrain.drawImage(ctx, 'g'+r, ox, Math.floor((y * 72)+oy));
            }
            if (oy) atlasTerrain.drawImage(ctx, 'g'+r, ox, Math.floor((ly * 72)+oy));
        }


        terrainUpdated = false;
    };

    this.init = function(cb){
        if (!cb) cb = function(){};

        var
        a = me.piAtlas,
        c = me.piCanvas,
        g = me.piGameTileMatch;

        a.create('../res/img/terrain.png', '../res/cfg/terrain.json', function(err, terrain){
            if (err) return cb(err);

            atlasTerrain = terrain;

            var
            cx = Math.floor(c.getStageWidth()-c.getCanvasWidth()),
            cy = Math.floor(c.getStageHeight()-c.getCanvasHeight());

            layerTerrain = c.addLayer(me.moduleName);
            layerTerrain.setPanLimits(cx, 0, cy, 0);
            c.slot(c.UPDATE, onUpdate);

            return cb();
        });
    };
});
