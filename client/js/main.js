pico.def('main', function(){
    this.use('piCanvas');
    this.use('gameLayer');

    var
    me = this,
    onFingerUp = function(evt, x, y){
    },
    onFingerDown = function(evt, x, y){
    },
    onFingerMove = function(evt, x, y){
    },
    onLoad = function(){
        pico.changeUIState('home');

        var
        c = me.piCanvas,
        db = document.body,
        cw = Math.min(G_CLIENT.MAX_WIDTH, Math.max(db.scrollWidth, db.offsetWidth, db.clientWidth)),
        ch = Math.min(G_CLIENT.MAX_HEIGHT, Math.max(db.scrollHeight, db.offsetHeight, db.clientHeight)),
        stage = document.querySelector('div#stage'),
        ss = stage.style;

        ss.width = cw + 'px';
        ss.height = ch + 'px';

        c.init(stage, cw, ch);

        me.gameLayer.init(function(err){
            if (err) return console.error(err);
        });
    };

    pico.slot(pico.LOAD, onLoad); 
});
