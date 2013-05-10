pico.def('gameLayer', function(){
    this.use('piCanvas');
    this.use('piAtlas');
    this.use('piHexGameMap');

    var
    me = this,
    worldMap,
    gameMap,
    lastX, lastY,
    terrainUpdated = true,
    layerTerrain, atlasTerrain,
    onUpdate = function(layers, elapsed){
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

        a.create('../res/img/terrain.png', '../res/cfg/terrain.json', function(err, terrain){
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

            return cb();
        });
    };
});
