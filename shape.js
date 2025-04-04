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
    console.log(`Type : ${this.type}, Pos : ${this.pos}`);
  }

  init_points(type) {

    switch (type) {
      case "I":
        this.points = ["0,0", "0,1", "0,2", "0,3"];
        break;
      case "O" :
        this.points =["0,0", "1,0", "0,1", "1,1"];
        break;
      case "T":
        this.points = ["0,0", "-1,0", "1,0", "0,1"];
        break;
      case "J":
        this.points = ["0,0", "0,1", "0,2", "-1,2"];
        break;
      case "L":
        this.points = ["0,0", "0,1", "0,2", "1,2"];
        break;
      case "S" :
        this.points = ["0,0", "1,0", "0,1", "-1,1"];
        break;
      default:
        break;
    }


  }

} 
