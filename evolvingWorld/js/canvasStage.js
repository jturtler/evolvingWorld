//	- CanvasStage Class - Main Stage Class, Starting point

function CanvasStage() {
  var me = this;

  me.canvas_width = 700; // must match the '<canvas>' tag width
  me.canvas_height = 500;

  me._bStop = false;
  me._initialKidsNum = 10;
  me.kidsBuilder;
  me.physicsHandler;
  // -------------------

  me.startUp = function () {
    // -- Setup Stage and Objects
    var stageObj = new createjs.Stage('demoCanvas'); //me.setUp_StageObj();
    INFO.stage = stageObj;

    // --- Initial Kids Build using 'KidsBuilder' class.
    me.kidsBuilder = new KidsBuilder(
      stageObj,
      me.canvas_width,
      me.canvas_height
    );
    me.physicsHandler = new PhysicsHandler(
      stageObj,
      me.canvas_width,
      me.canvas_height
    );

    me.kidsBuilder.createKids(me._initialKidsNum);

    // -- Render Objects In Stage
    me.setUp_TickRendering(stageObj);

    // -- Key Action Setup
    me.setUp_KeyDown_BtnClicks(stageObj);
  };

  // ---------------------------------------------------
  // -- Setups: Setup Stage and Objects, Setup Rendering

  me.setUp_StageObj = function () {
    return new createjs.Stage('demoCanvas');
  };

  me.setUp_TickRendering = function (stageObj) {
    createjs.Ticker.framerate = 10;
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
      INFO.kids.forEach((kid, i, list) => {
        kid.performNext();
        if (kid.died) list.splice(i, 1);
      });

      me.physicsHandler.performPhysics(INFO.kids);

      stageObj.update();
    }
  };

  // Handle Key Down Function
  me.handleKeyDown = function (event, stageObj) {
    switch (event.keyCode) {
      case 83: //_keycode_s:
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
