//	- CanvasStage Class - Main Stage Class, Starting point
function CanvasStage() 
{
  var me = this;

  me.canvas_width = 700; // must match the '<canvas>' tag width
  me.canvas_height = 500;

  me._bStop = false;
  me._initialKidsNum = 10;
  me.kidsBuilder;
  me.physicsHandler;
  me.framerate = 10;  // 10 frame per sec..

  me.stageObj;
  me.kids = [];
  // -------------------

  me.startUp = function () {
    // -- Setup Stage and Objects
    me.stageObj = new createjs.Stage('demoCanvas'); //me.setUp_StageObj();
    CanvasStage.stageObj = me.stageObj;

    // --- Initial Kids Build using 'KidsBuilder' class.
    me.kidsBuilder = new KidsBuilder( me.stageObj, me.kids, me.canvas_width, me.canvas_height );
    me.physicsHandler = new PhysicsHandler( me.stageObj, me.canvas_width, me.canvas_height );


    me.kidsBuilder.createKids(me._initialKidsNum);

    // -- Render Objects In Stage
    me.setUp_TickRendering(me.stageObj);

    // -- Key Action Setup
    me.setUp_KeyDown_BtnClicks(me.stageObj);
  };

  // ---------------------------------------------------
  // -- Setups: Setup Stage and Objects, Setup Rendering

  me.setUp_StageObj = function () {
    return new createjs.Stage('demoCanvas');
  };

  me.setUp_TickRendering = function (stageObj) {
    createjs.Ticker.framerate = me.framerate;
    createjs.Ticker.addEventListener('tick', function (event) {
      me.tickRender(stageObj);
    });
  };

  me.setUp_KeyDown_BtnClicks = function (stageObj) {
    // key down handle
    window.onkeydown = function (event) {
      me.handleKeyDown(event, stageObj);
    };

    // btn clicks handle
    $('#btnStartStop').click(me.stopStart);
    $('#btnAddKid').click(function () {
      me.kidsBuilder.createKid();
    });

    Util.outputMsgAdd("Key: 's' to stop/start, 'a' to add new kid");
  };

  // -------------------------------------------------------

  me.tickRender = function (stageObj) {
    if (!me._bStop) {
      // NOTE: Put this in 'PhysicsHandler'?
      me.kids.forEach((kid, i, list) => {
        kid.performNext();
        if (kid.died) list.splice(i, 1);
      });

      me.physicsHandler.performPhysics(me.kids);

      stageObj.update();
    }
  };

  // Handle Key Down Function
  me.handleKeyDown = function (event, stageObj) {
    switch (event.keyCode) {
      case 83: //_keycode_s:
      case 32: //_keycode space:
        me.stopStart();
        return false;

      case 65: //_keycode_a:
        var kidObj = me.kidsBuilder.createKid();
        return false;
    }
  };

  me.stopStart = function () {
    me._bStop = !me._bStop;
    var msg = me._bStop ? 'Stopped' : 'Started';
    Util.outputMsgAdd(msg, 4);
  };
}
