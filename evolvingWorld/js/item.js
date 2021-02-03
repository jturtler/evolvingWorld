class Item {
  constructor(stageObj, name) {
    this.stageObj = stageObj;
    this.name = name;
    this.attribute;
    this.locX;
    this.locY;
  }

  // method

  /*calcArea() {
    return this.height * this.width;
  }
  */

  createItem(name) {
    if (!this.name) this.name = 'item';

    // TODO: Need to randomly give diff attributes to the kids...
    /*  
    Item.prototype = new createjs.Container();
    var ItemObj = new Item(
      this.stageObj,
      this.name,
      this.attribute,
      this..locX,
      this.locY
    );
  };
*/
    this.stageObj.addChild(ItemObj);

    INFO.items.push(kidObj); //Do I need INFO.kids to keep track of items?

    return kidObj;
  }
}

class ItemBuilder {
  constructor(stageObj, name) {
    this.stageObj = stageObj;
    this.name = name;
    this.attribute;
    this.locX;
    this.locY;
  }

  // method

  /*calcArea() {
      return this.height * this.width;
    }
    */

  createItem(name) {
    if (!this.name) this.name = 'item';

    // TODO: Need to randomly give diff attributes to the kids...
    /*  
      Item.prototype = new createjs.Container();
      var ItemObj = new Item(
        this.stageObj,
        this.name,
        this.attribute,
        this..locX,
        this.locY
      );
    };
  */
    this.stageObj.addChild(ItemObj);

    INFO.items.push(kidObj); //Do I need INFO.kids to keep track of items?

    return kidObj;
  }
}

//const square = new Rectangle(10, 10);
//console.log(square.area); // 100
