import * as drawTools from "./draw_tools.js";
import Position from "./structs/position.js";
import Shape from "./shape.js";
import * as leaderboard from "./leaderboard.js";
import Grid from "./gridlogic.js";

let delta_time = 0;
let last_time = 0;
let drop_counter = 0;
const drop_interval = 500;
let game_over = false;

const debug_positions = [];

const rows = 20;
const columns = 10;

let current_leaderboard;

let current_score = 0;

const score_element = document.getElementById("cur-score");
const level_element = document.getElementById("level");

const game_grid = new Grid();
game_grid.init_state();

const canvas = document.getElementById("game_canvas");
let ctx;
const fx_canvas = document.getElementById("fx_canvas");
let fxctx;
if (canvas.getContext) {
  ctx = canvas.getContext("2d");
  drawTools.init_tools(canvas.width, canvas.height, columns, rows);
  drawTools.set_ctx(ctx);
  fxctx = fx_canvas.getContext("2d");
  drawTools.set_fxctx(fxctx);

  draw();
}
//init fx ctx
leaderboard.refresh_leaderboard();
// leaderboard.add_highscore("cam", 420);
game_loop();

function game_loop(current_time) {
  if (last_time === 0) {
    last_time = current_time;
    delta_time = 0;
    requestAnimationFrame(game_loop);
    return;
  }

  delta_time = current_time - last_time;
  if (Number.isNaN(delta_time)) {
    delta_time = 0;
  }
  last_time = current_time;
  drop_counter += Number.parseFloat(delta_time);

  if (game_grid.active_shape == null) {
    game_grid.set_active_shape(game_grid.spawn_shape());
  }

  if (drop_counter > drop_interval) {
    if (game_grid.move_shape(0, 1, game_grid.active_shape) === false) {
      game_grid.remove_full_lines(game_grid.check_lines(0, rows));
      for (const point of game_grid.active_shape.points) {
        if (
          point.x + game_grid.active_shape.pos.x === 4 &&
          game_grid.active_shape.pos.y + point.y === 0
        ) {
          game_over = true;
        }
      }

      game_grid.active_shape = null;
    }
    game_grid.sync_state();
    drop_counter = 0;
  }

  updateScore();
  draw();
  if (game_over === false) {
    requestAnimationFrame(game_loop);
  } else {
    handle_game_over();
  }
}

function handle_game_over() {
  if (leaderboard.determine_high_score(current_score) === true) {
    let name = prompt("Please enter a name for your highscore! : ", "name");
    console.log(name);
    if (name.length !== 0 && name !== null) {
      leaderboard.add_highscore(name, current_score);
      alert("Highscore added!");
    }

    const again = confirm("Do you want to play again?");
    if (again === true) {
      start_game();
    }
  } else {
    const again = confirm("Do you want to play again?");
    if (again === true) {
      start_game();
    }
  }
}
function start_game() {
  current_score = 0;
  game_grid.init_state(game_grid.game_state);
  game_grid.current_shapes.length = 0;
  game_over = false;
  draw();
  requestAnimationFrame(game_loop);
}
function updateScore() {
  score_element.innerText = current_score;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTools.draw_state(game_grid.get_state());
  drawTools.draw_grid(canvas.width, canvas.height, columns, rows);
}

window.addEventListener(
  "keypress",
  (e) => {
    switch (e.key) {
      case "a":
        //A : Move left
        game_grid.move_shape(-1, 0, game_grid.active_shape);
        game_grid.sync_state(game_grid.game_state, game_grid.current_shapes);
        draw();
        break;
      case "d":
        //D Move right
        game_grid.move_shape(1, 0, game_grid.active_shape);
        game_grid.sync_state(game_grid.game_state, game_grid.current_shapes);
        draw();
        break;
      case "s":
        //Move Down
        if (game_grid.move_shape(0, 1, game_grid.active_shape) === false) {
          game_grid.set_active_shape(null);
          game_grid.remove_full_lines(game_grid.check_lines(0, rows));
        }
        current_score += 1;
        game_grid.sync_state(game_grid.game_state, game_grid.current_shapes);
        draw();
        break;
      case "e":
        //Rotate
        game_grid.rotate_shape(game_grid.active_shape);
        game_grid.sync_state(game_grid.game_state, game_grid.current_shapes);
        break;
      default:
        return;
    }
  },
  true,
);
