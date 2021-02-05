//  - Kids Class 		- Kids object...

function Kid(stage, name, attribute, locationX, locationY) {
  var me = this;

  // New
  me.stage = stage;
  me.canvasBoundsX = stage.canvas.width;
  me.canvasBoundsY = stage.canvas.height;

  me.name = name;

  me.attribute = attribute;

  me.size; // radius
  me.color;
  me.speed;

  me.x = locationX;
  me.y = locationY;

  me.wallTouches = [];
  // ----------------------------

  me.movementX;
  me.movementY;

  me.directionAngle;
  me.tempAngle;

  me.modeInteract = false;

  // ----------------------------

  me.tickCount = 0;
  me.age = 0;
  me.agingSpeed = 40; // frameRate = 10 (per seconds). Thus, every 4 seconds, it ages.. But, we should not conver to seconds
  //   since we can later use 'frameRate' to speed up / speed down...

  me.middleAge = 10;
  me.sizeIncreaseRate = 2;

  me.directionChange_Rate = 20;
  me.directionChange_DegreeLimit = 45;  // +/- 30 degree
  me.changeAngle = 0;


  me.flashActionNextId = 0;
  me.flashAction = {}; // id: { count: 0, action: "", color: "", sizePercentage: "" };

  me.collision;
  me.printStatus = false;

  me.died = false;

  // --------------------
  // Object Layer
  me.label = new createjs.Text(name, 'normal 11px Arial', 'White');
  me.shape = new createjs.Shape();

  // --------------------------------------------
  // ----- Methods ------------------------------

  me.initializeObj = function () {
    // Expand the attribute
    me.color = me.attribute.color;
    me.speed = me.attribute.speed;
    me.size = me.attribute.size;

    me.setUpShape();
    me.setUpLabel();

    me.addChild(me.shape, me.label);

    me.setLocation(me.x, me.y);

    me.directionAngle = Math.random() * 360;
    me.setDirectionXY_ByAngle( me.directionAngle, me.speed );

    //me.tempAngle = me.getAngleFromDirectionXY( me.movementX, me.movementY );

    me.setUpClick();
  };

  // ----------------------------------------------
  // -- Events

  me.setUpClick = function () {
    me.shape.addEventListener('click', me.performClick);
  };

  // On click, show the click reaction
  me.performClick = function () {
    console.log('click test: ' + me.name);

    Util.outputMsgAdd(JSON.stringify(me.getObjQuickInfo()), 10);
  };

  // -----------------------------------
  // --- Actions

  me.performNext = function () {
    // 1st, make the directional location one movement
    me.moveNext(me.wallTouches, me.modeInteract );

    // --------------

    me.tickCount++;

    var newAge = Math.floor( me.tickCount / me.agingSpeed );
    me.changeByAge(newAge);  // Not too good...  Changes age & size..

    // Direction
    me.setDirectionChange_InFrequency( me.tickCount, me.directionChange_Rate, me.directionChange_DegreeLimit );

    // -----------------------

    if (me.size <= 0) 
    {
      me.deleteThisKid(me.stage);
      me.died = true;
    } 
    else 
    {
      // paint over - after clearing
      me.paintClear(me.shape.graphics);
      me.paintShape(me.color, me.size, me.shape.graphics);

      me.displayFlash(me.flashAction);
    }

    // clear wallTouches after each perform
    me.wallTouches = [];
  };

  // ------------  Flash Action Related ---------

  me.addFlashAction = function (count, action, color, sizePercentage) {
    me.flashAction[me.flashActionNextId] = {
      count: count,
      action: action,
      color: color,
      sizePercentage: sizePercentage,
    };

    me.flashActionNextId++;
  };

  me.removeFlashAction = function (id) {
    delete me.flashAction[id];
  };

  me.displayFlash = function (flashAction) {
    // For each flash action, paint them.
    for (var propName in flashAction) {
      var item_flash = flashAction[propName];

      // Take care of flash handling
      if (item_flash.count > 0) {
        item_flash.count--;

        // remove the
        if (item_flash.action == 'innerCircle') {
          var newSize = Math.floor(me.size / (100 / item_flash.sizePercentage));
          me.paintShape(item_flash.color, newSize, me.shape.graphics);
        } else if (item_flash.action == 'outerCircle') {
          // 'sizePercentage' should be changed to 'addedSize'
          var newSize = me.size + item_flash.sizePercentage;
          me.paintShape(item_flash.color, newSize, me.shape.graphics);
          me.paintShape(me.color, me.size, me.shape.graphics);
        }

        if (item_flash.count <= 0) {
          me.removeFlashAction(propName);
        }
      }
    }
  };

  // -----------------

  me.changeByAge = function (newAge) {
    // If age is changed, set size accordingly
    if (newAge != me.age) {
      var ageDiff = newAge - me.age;

      me.age = newAge;

      // Add short term flash when age is changed.
      me.addFlashAction(2, 'outerCircle', Constants.AGING_COLOR, 2);

      me.size = me.setSizeByAgeChange(me.size, ageDiff, newAge, me.middleAge);

      //me.setLabelChange( me.age );
    }
  };

  me.setSizeByAgeChange = function (size, ageChange, newAge, middleAge) {
    // for now, simply increase size 1 as age gets one older.
    var sizeChange = ageChange * me.sizeIncreaseRate;

    // if the age is over the middle Age, shrink size rather than increase.
    if (newAge > middleAge) sizeChange = sizeChange * -1;

    var newSize = size + sizeChange;

    return newSize;
  };

  // ----------------------------
  me.setDirectionChange_InFrequency = function( tickCount, directionChange_Rate, directionChange_DegreeLimit )
  {
    if ( tickCount !== 0 )
    {
      var remainder = tickCount % directionChange_Rate;

      if ( remainder === 0 )
      {        
       // Angles ranging: +30  ~ -30 
        me.changeAngle = ( ( directionChange_DegreeLimit * 2 ) * Math.random() ) - directionChange_DegreeLimit;

        me.directionAngle += me.changeAngle;
        
        // Since angles are always positive, add 360 and divide by 360 to get only remainder.
        me.directionAngle = ( me.directionAngle + 360 ) % 360;
        
        me.setDirectionXY_ByAngle( me.directionAngle, me.speed );
      }  
    }
  };


  // ----------------------------

  me.paintClear = function (graphics) {
    if (graphics !== undefined) {
      graphics.clear();
    }
  };

  // me.shape.graphics
  me.paintShape = function (color, size, graphics) {
    if (graphics !== undefined) {
      graphics.beginFill(color);
      graphics.drawCircle(0, 0, size);
      graphics.endFill();
    }
  };

  me.setLabelChange = function (age) {
    me.label.text = me.name; // + "\n" + age;
  };

  // ----------------------------------
  // ---- Movement Related -----
  
  me.setDirectionXY_ByAngle = function( angle, speed ) 
  {
    var anglePi = Math.PI * ( angle / 180 );

    me.movementX = Math.cos(anglePi) * speed;
    me.movementY = Math.sin(anglePi) * speed;
  };


  
  me.getAngle_ByDirectionalXY = function( movementX, movementY )
  {


  };
  //directionAngle = Math.random() * 360;


  /*
  me.getRandom_Limited = function( speed, directionChange_DegreeLimit ) 
  {
    var angle =  Math.PI * ( directionChange_DegreeLimit / 180 );

    // var angle = Math.random() * ( Math.PI * degreeLimit );  /// 0 - 90

    me.movementX = Math.cos(angle) * speed;
    me.movementY = Math.sin(angle) * speed;
  };
  */

  me.setDirection_Bounce = function (wallTouches) 
  {
    var bBounce = false;
  
    if (wallTouches.indexOf('reachedWall_Left') >= 0) {
      me.movementX = -me.movementX;
      bBounce = true;
    } else if (wallTouches.indexOf('reachedWall_Right') >= 0) {
      me.movementX = -me.movementX;
      bBounce = true;
    } else if (wallTouches.indexOf('reachedWall_Top') >= 0) {
      me.movementY = -me.movementY;
      bBounce = true;
    } else if (wallTouches.indexOf('reachedWall_Bottom') >= 0) {
      me.movementY = -me.movementY;
      bBounce = true;
    }

    if ( bBounce )
    { 
      me.directionAngle = me.getAngleFromDirectionXY( me.movementX, me.movementY );

      me.addFlashAction(3, 'innerCircle', Constants.WALL_CONTACT_COLOR, 70);
    }
  };


  me.getAngleFromDirectionXY = function( movementX, movementY )
  {
    var angle = ( Math.atan2( movementY, movementX ) / Math.PI ) * 180;

    // QUESTION: Why I have to do this?
    if ( angle < 0 )
    {
      angle = angle + 360;
    }

    return angle;
  };


  me.moveNext = function( wallTouches, modeInteract ) 
  {
    if ( modeInteract ) {}
    else
    {
      // sets me.movementX, me.movementY
      me.setDirection_Bounce(wallTouches);

      me.setLocation(me.x + me.movementX, me.y + me.movementY);
    }
  };

  me.setLocation = function (locX, locY) 
  {
    if (locX) me.x = locX;
    if (locY) me.y = locY;
  };

  // -----------------------------------------
  // ---- Setup Methods -----

  me.setUpLabel = function () {
    me.label.textAlign = 'center';
    me.label.textBaseline = 'middle';
  };

  me.setUpShape = function () {
    if (me.shape.graphics !== undefined) {
      me.shape.graphics.beginFill(me.color).drawCircle(0, 0, me.size);
    }
  };

  me.deleteThisKid = function (stage) {
    stage.removeChild(me);
  };

  // -----------------------------------------
  // ---- Others Methods -----

  me.addNotice_WallTouched = function ( notice ) 
  {
    me.wallTouches.push( notice );
  };

  me.getObjQuickInfo = function () {
    return {
      name: me.name,
      age: me.age,
      size: me.size,
      speed: me.speed,
      angle: me.directionAngle.toFixed(0),
      changeAngle: me.changeAngle,
      attr: me.attribute,
      loc: [me.x.toFixed(0), me.y.toFixed(2)],
    };
  };

  // -----------------------------------------

  me.initializeObj();
}
