pico.def('gameLayer', function(){
    this.use('piCanvas');
    this.use('piAtlas');
    this.use('piHexGameMap');
    this.use('piParticleSystem');

    var
    me = this,
    worldMap,
    gameMap,
    emitter,
    lastX, lastY,
    terrainUpdated = true,
    layerTerrain, atlasTerrain,
    onUpdate = function(layers, elapsed){
        me.piParticleSystem.update(elapsed);
        if (!terrainUpdated) return;

        terrainUpdated = false;
    },
    onMapUpdate = function(map){
        var
        ctx = layerTerrain.getContext(),
        c = me.piCanvas,
        r,isGrass;

        map.eachViewTile(function(tile){
            isGrass = undefined !== tile.data;
            r = Math.floor(Math.random()*(isGrass ? 8 : 7));
            atlasTerrain.drawImage(ctx, (isGrass ? 'g' : 'r')+r, tile.x, tile.y);
        });
    },
    download = function(screen, url, cb){
        pico.ajax('get', url, null, {}, function(err, data){
            try{
                var json = JSON.parse(data);
            }catch(exp){
                return console.error(exp);
            }
            return new HexGameMap(screen, json.tile, json.col, json.row);
        });
    };

    this.onFingerUp = function(evt, x, y){
    };
    this.onFingerDown = function(evt, x, y){
        lastX = x;
        lastY = y;
    };
    this.onFingerMove = function(evt, x, y){
        worldMap.pan(x-lastX, y-lastY);
        lastX = x;
        lastY = y;
    };

    this.init = function(cb){
        if (!cb) cb = function(){};

        var
        a = me.piAtlas,
        c = me.piCanvas,
        g = me.piHexGameMap;

        a.create('http://107.20.154.29:5000/res/img/terrain.png', 'http://107.20.154.29:5000/res/cfg/terrain.json', function(err, terrain){
            if (err) return cb(err);

            atlasTerrain = terrain;

            var
            sw = c.getStageWidth(),
            sh = c.getStageHeight(),
            cx = Math.floor(sw-c.getCanvasWidth()),
            cy = Math.floor(sh-c.getCanvasHeight());

            layerTerrain = c.addLayer(me.moduleName);
            layerTerrain.setPanLimits(cx, 0, cy, 0);
            c.slot(c.UPDATE, onUpdate);

            g.slot(g.UPDATE, onMapUpdate);
            worldMap = g.create(
                'worldMap',
                {
                    width:sw,
                    height:sh
                },
                {
                    base:G_CLIENT.TILE_BASE,
                    side:G_CLIENT.TILE_SIDE,
                    height:G_CLIENT.TILE_HEIGHT
                },
                5,
                6
            );

            emitter = me.piParticleSystem.createEmitter({
                layer: layerTerrain,
                origin: [100, 100, 0, 0], 
                offset: 0
            });
            emitter.start({
                rate: 100,
                angle: [0, 2 * Math.PI],
                speed: [10, 15],
                life: [4, 1]
            });

            return cb();
        });
    };
});
