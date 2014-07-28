pico.def('uiLayer', function(){
    this.use('piCanvas');
    this.use('piAtlas');

    var
    me = this,
    atlasTerrain,
    layerUI,
    onUpdate = function(){
    };

    this.onFingerUp = function(evt, x, y){
    };
    this.onFingerDown = function(evt, x, y){
    };
    this.onFingerMove = function(evt, x, y){
    };

    this.init = function(cb){
        if (!cb) cb = function(){};

        var
        c = me.piCanvas,
        a = me.piAtlas;

        a.create('../res/img/terrain.png', '../res/cfg/terrain.json', function(err, terrain){
            if (err) return cb(err);

            atlasTerrain = terrain;

            var
            cx = Math.floor(c.getStageWidth()-c.getCanvasWidth()),
            cy = Math.floor(c.getStageHeight()-c.getCanvasHeight());

            layerUI = c.addLayer(me.moduleName);
            layerUI.setPanLimits(cx, 0, cy, 0);
            c.slot(c.UPDATE, onUpdate);

            cb();
        });
    };
});
