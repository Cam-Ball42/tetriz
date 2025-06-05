import Position from "./position.js";

export default class particle {
  pos;
  velocity;
  color;
  speed;
  strength;

  constructor(position, color, initalVel, speed, strength = 150) {
    this.pos = position;
    this.color = color;
    this.velocity = initalVel;
    this.strength = strength;
    this.speed = speed;
  }

  move() {
    this.last_pos = this.pos;
    this.pos.x = this.pos.x + this.speed * this.velocity[0];
    this.pos.y = this.pos.y + this.speed * this.velocity[1];
    this.strength -= 1;
    // this.velocity[0] -= 1;
    // this.velocity[1] -= 1;
  }

  set_random_vels() {
    this.velocity = [];
    const randomx = Math.floor(Math.random() * (10 - -10 + 1) + -10) / 10;
    const randomy = Math.floor(Math.random() * (10 - -10 + 1) + -10) / 10;
    this.velocity = [randomx, randomy];
  }
}
