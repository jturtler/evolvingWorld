//	- PhysicsHandler	- Class to manage physical related decision/detection --> collision with something..  detect bounds..
//						- Based on each object location..

function PhysicsHandler(stageObj, canvas_width, canvas_height) 
{
  var me = this;

  me.stageObj = stageObj;
  me.canvas_width = canvas_width;
  me.canvas_height = canvas_height;
  me.proxyDistance = 100;
  me.proxyLines = [];
  //me.runOnce = true;

  me.performPhysics = function (kids) 
  {
    // reset
    var objInProxyList = {};

    // clear proxy lines
    me.clearProxyLines(me.proxyLines, me.stageObj);

    // go through each kids and perform physics related tasks..
    kids.forEach((kid) => 
    {
      me.wallReachedNotify(kid, me.canvas_width, me.canvas_height);

      me.collectObjectProximity(kid, kids, objInProxyList);
    });

    // Draw line btween
    me.proxyLinesDraw(objInProxyList, me.proxyLines, me.stageObj);
    // https://7thzero.com/blog/how-draw-line-using-createjs-easeljs

    me.kidsTouchNotify( objInProxyList );

  };

  me.wallReachedNotify = function (kid, canvas_width, canvas_height) 
  {
    var ObjectLoc_Left = kid.x - kid.size;
    var ObjectLoc_Right = kid.x + kid.size;
    var ObjectLoc_Top = kid.y - kid.size;
    var ObjectLoc_Bottom = kid.y + kid.size;

    // When reaching left wall, we only notify it if it reach the position of 0 or less
    //	And the direction was left (minus), not right or straight down.
    if ( ObjectLoc_Left <= 0 && kid.movementX < 0 ) kid.addNotice_WallTouched('reachedWall_Left');
    else if ( ObjectLoc_Right >= canvas_width && kid.movementX > 0 ) kid.addNotice_WallTouched('reachedWall_Right');
    else if ( ObjectLoc_Top <= 0 && kid.movementY < 0 ) kid.addNotice_WallTouched('reachedWall_Top');
    else if ( ObjectLoc_Bottom >= canvas_height && kid.movementY > 0 ) kid.addNotice_WallTouched('reachedWall_Bottom');
  };

  me.collectObjectProximity = function (kid, kids, objInProxyList) 
  {
    kids.forEach((otherKid) => 
    {
      if (kid != otherKid) 
      {
        var distBtw = me.getDistance(kid, otherKid);

        if (distBtw < me.proxyDistance) 
        {
          var orderedCombo = me.getObj_OrderedCombo(kid, otherKid, distBtw);

          // Only add if not already in - find by key (property)
          if (!objInProxyList[orderedCombo.key])
            objInProxyList[orderedCombo.key] = orderedCombo.objs;
        }
      }
    });
  };

  me.getObj_OrderedCombo = function (obj1, obj2, distance) 
  {
    var orderedCombo = { key: '', objs: {} };

    if (obj1.name < obj2.name) {
      orderedCombo.key = obj1.name + ':' + obj2.name;
      orderedCombo.objs.obj1 = obj1;
      orderedCombo.objs.obj2 = obj2;
    } else {
      orderedCombo.key = obj2.name + ':' + obj1.name;
      orderedCombo.objs.obj1 = obj2;
      orderedCombo.objs.obj2 = obj1;
    }

    orderedCombo.objs.distance = distance;

    return orderedCombo;
  };

  me.getDistance = function (obj1, obj2) {
    var xA = obj1.x;
    var yA = obj1.y;
    var xB = obj2.x;
    var yB = obj2.y;

    var xDiff = xA - xB;
    var yDiff = yA - yB;

    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
  };

  me.clearProxyLines = function( proxyLines, stageObj ) 
  {
    proxyLines.forEach((line, i, list) => {
      stageObj.removeChild(line);
      list.splice(i, 1);
    });
  };

  me.proxyLinesDraw = function( objInProxyList, proxyLines, stageObj) 
  {
    Object.keys(objInProxyList).forEach((key) => 
    {
      var proxyData = objInProxyList[key];

      if (proxyData && proxyData.obj1 && proxyData.obj2) 
      {
        var obj1 = proxyData.obj1;
        var obj2 = proxyData.obj2;

        var line = new createjs.Shape();

        line.graphics
          .setStrokeStyle(1)
          .beginStroke('green')
          .moveTo(obj1.x, obj1.y)
          .lineTo(obj2.x, obj2.y)
          .endStroke();

        stageObj.addChild(line);
        proxyLines.push(line);
      }
    });
  };

  me.kidsTouchNotify = function( objInProxyList )
  {
    Object.keys(objInProxyList).forEach((key) => 
    {
      var proxyData = objInProxyList[key];

      if (proxyData && proxyData.obj1 && proxyData.obj2) 
      {
        var obj1 = proxyData.obj1;
        var obj2 = proxyData.obj2;

        if ( proxyData.distance <= ( obj1.size + obj2.size ) )
        {
          me.kidsInteract( obj1, obj2 );
        }
      }
    });
  };


  // ----------------------------------
  // ---- Kids Interaction Related -----
  //    Should have it's own class?

  me.kidsInteract = function( kid1, kid2 )
  {
    // By each other's compatibility, either absorb/fight, grow friendship/procreate
    me.kidsAbsorb( kid1, kid2 );
    // Or me.kidsStayTogether();
    // Or me.kidsHaveRelationship();
    // Or me.kidsCreateOffspring();
  };

  me.kidsAbsorb = function( kid1, kid2 )
  {
    // Both kids stop moving..
    // kid1.moveCloser( kids2 );  kid2.stay();

    // kids.setModeInteract( true );

    // 'size' bigger one takes size 2 from smaller one, but bigger one only takes 50%, size 1.
    if ( kid1.size > kid2.size )
    {
      kid2.size = kid2.size - 2;
      kid1.size++;      

      console.log( 'kid1 size win' );
    } 
    else if ( kid1.size < kid2.size )
    {
      kid1.size = kid1.size - 2;
      kid2.size++;      

      console.log( 'kid2 size win' );
    }   

  };  

}
