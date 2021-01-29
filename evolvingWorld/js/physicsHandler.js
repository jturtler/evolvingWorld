//	- PhysicsHandler	- Class to manage physical related decision/detection --> collision with something..  detect bounds..
//						- Based on each object location..

function PhysicsHandler(stageObj, canvas_width, canvas_height) {
  var me = this;

  me.stageObj = stageObj;
  me.canvas_width = canvas_width;
  me.canvas_height = canvas_height;
  me.proxyDistance = 100;
  me.proxyLines = [];
  //me.runOnce = true;

  me.performPhysics = function (kids) {
    // reset
    var objInProxyList = {};

    // clear proxy lines
    me.clearProxyLines(me.proxyLines, me.stageObj);

    // go through each kids and perform physics related tasks..
    kids.forEach((kid) => {
      me.wallReachedNotice(kid, me.canvas_width, me.canvas_height);

      me.collectObjectProximity(kid, kids, objInProxyList);
    });

    // Draw line btween
    me.addAndDrawProxyLine(objInProxyList, me.proxyLines, me.stageObj);
    // https://7thzero.com/blog/how-draw-line-using-createjs-easeljs
  };

  me.wallReachedNotice = function (kid, canvas_width, canvas_height) {
    var ObjectLoc_Left = kid.x - kid.size;
    var ObjectLoc_Right = kid.x + kid.size;
    var ObjectLoc_Top = kid.y - kid.size;
    var ObjectLoc_Bottom = kid.y + kid.size;

    // When reaching left wall, we only notify it if it reach the position of 0 or less
    //	And the direction was left (minus), not right or straight down.
    if (ObjectLoc_Left <= 0 && kid.movementX < 0)
      kid.addNotice('reachedWall_Left');
    else if (ObjectLoc_Right >= canvas_width && kid.movementX > 0)
      kid.addNotice('reachedWall_Right');
    else if (ObjectLoc_Top <= 0 && kid.movementY < 0)
      kid.addNotice('reachedWall_Top');
    else if (ObjectLoc_Bottom >= canvas_height && kid.movementY > 0)
      kid.addNotice('reachedWall_Bottom');
  };

  me.collectObjectProximity = function (kid, kids, objInProxyList) {
    kids.forEach((otherKid) => {
      if (kid != otherKid) {
        var distBtw = me.getDistance(kid, otherKid);

        if (distBtw < me.proxyDistance) {
          var orderedCombo = me.getObj_OrderedCombo(kid, otherKid);

          // Only add if not already in - find by key (property)
          if (!objInProxyList[orderedCombo.key])
            objInProxyList[orderedCombo.key] = orderedCombo.objs;
        }
      }
    });
  };

  me.getObj_OrderedCombo = function (obj1, obj2) {
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

  me.clearProxyLines = function (proxyLines, stageObj) {
    proxyLines.forEach((line, i, list) => {
      stageObj.removeChild(line);
      list.splice(i, 1);
    });
  };

  me.addAndDrawProxyLine = function (objInProxyList, proxyLines, stageObj) {
    Object.keys(objInProxyList).forEach((key) => {
      var item = objInProxyList[key];

      if (item && item.obj1 && item.obj2) {
        var obj1 = item.obj1;
        var obj2 = item.obj2;

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
}
