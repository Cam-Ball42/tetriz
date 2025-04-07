import Position from "./structs/position.js";

export default class Shape {
  pos;
  type;
  id;
  points;

  constructor(type, pos, id) {
    this.type = type;
    this.pos = pos;
    this.init_points(type);
  }

  get type() {
    return this.type;
  }

  get pos() {
    return this.pos;
  }

  get points() {
    return this.points;
    
 
  }
  set points(points) {
    this.points = points;
    
  }

  test() {
    console.log(`Type : ${this.type}, Pos : ${this.pos.to_string()}`);
  }

  init_points(type) {
    switch (type) {
      case "I":
        this.points = [new Position(0,0), new Position(0,1), new Position(0,2), new Position(0,3)];
        break;
      case "O" :
        this.points =[new Position(0,0), new Position(1,0), new Position(0,1), new Position(1,1)];
        break;
      case "T":
        this.points = [new Position(0,0), new Position(-1,0), new Position(1,0), new Position(0,1)];
        break;
      case "J":
        this.points = [new Position(0,0), new Position(0,1), new Position(0,2), new Position(-1,2)];
        break;
      case "L":
        this.points = [new Position(0,0), new Position(0,1), new Position(0,2), new Position(1,2)];
        break;
      case "S" :
        this.points = [new Position(0,0), new Position(1,0), new Position(0,1), new Position(-1,1)];
        break;
      case "Z" :
        this.points = [new Position(0,0), new Position(-1,0), new Position(0,1), new Position(1,1)];
        break;
      default:
        break;
    }


  }

} 
