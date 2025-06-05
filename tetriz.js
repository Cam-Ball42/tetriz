import * as drawTools from "./draw_tools.js";
import Grid from "./gridlogic.js";
import * as leaderboard from "./leaderboard.js";
import InputHandler from "./input.js";
import Shape from "./shape.js";
import Position from "./structs/position.js";

//Hello
let delta_time = 0;
let last_time = 0;
let drop_counter = 0;
const base_drop_interval = 500;
let game_over = false;


const rows = 20;
const columns = 10;


let current_score = 0;
let lines_cleared = 0;
let current_level = 1

const score_element = document.getElementById("cur-score");
const level_element = document.getElementById("cur-level");

const game_grid = new Grid();
game_grid.init_state();

const input_handler = new InputHandler(game_grid, on_hit_down);
input_handler.startHandler();

const canvas = document.getElementById("game_canvas");
const canvas_bounds = canvas.getBoundingClientRect();
const fx_canvas = document.getElementById("fx_canvas");
const bg_canvas = document.getElementById("background-canvas");
resize_bg_canvas();
window.addEventListener("resize", resize_bg_canvas);
const ctx = canvas.getContext("2d");
if (canvas.getContext) {
        drawTools.init_tools(
                canvas.width,
                canvas.height,
                canvas_bounds,
                columns,
                rows,
        );
        const fxctx = fx_canvas.getContext("2d");
        const bgctx = bg_canvas.getContext("2d");
        drawTools.set_contexts(ctx, fxctx, bgctx);

        draw();
}
// leaderboard.refresh_leaderboard();

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

        input_handler.handleInputStack();


        if (drop_counter > base_drop_interval - current_level
                * 10) {
                if (game_grid.move_shape(0, 1, game_grid.active_shape) === false) {
                        on_hit_down();

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

function on_hit_down() {
        const full_lines = game_grid.check_lines(0, rows);
        if (full_lines !== null) {
                lines_cleared += full_lines.length;
                current_level = estimate_level();
                current_score += add_score(full_lines.length);

                game_grid.remove_full_lines(game_grid.check_lines(0, rows));
                //TODO: Fix the game over condition, and above need to draw then game over
                for (const point of game_grid.active_shape.points) {
                        if (
                                point.x + game_grid.active_shape.pos.x === 4 &&
                                game_grid.active_shape.pos.y + point.y === 0
                        ) {
                                game_over = true;
                        }
                }
        }
}


function add_score(lines_cleared) {
        switch (lines_cleared) {
                case 1:
                        return 40 * current_level;
                case 2:
                        return 100 * current_level;
                case 3:
                        return 300 * current_level;
                case 4:
                        return 1200 * current_level;
                default:
                        return 0;
        }
}
function estimate_level() {
        return Math.floor(lines_cleared / 10) + 1;
}
function handle_game_over() {
        if (leaderboard.determine_high_score(current_score) === true) {
                const name = prompt("Please enter a name for your highscore! : ", "name");
                console.log(name);
                if (name.length !== 0 && name !== null) {
                        leaderboard.add_highscore(name, current_score);
                        alert("Highscore added!");
                }
        }
        const again = confirm("Do you want to play again?");
        if (again === true) {
                start_game();
        }
}
function start_game() {
        lines_cleared = 0;
        current_score = 0;
        game_grid.init_state(game_grid.game_state);
        game_grid.current_shapes.length = 0;
        game_over = false;
        draw();
        requestAnimationFrame(game_loop);
}
function updateScore() {
        score_element.innerText = current_score;
        level_element.innerText = current_level;
}

function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawTools.draw_state(game_grid.get_state());
        drawTools.draw_grid(canvas.width, canvas.height, columns, rows);
        drawTools.draw_particles();
        if (game_grid.active_shape !== null) {
                drawTools.draw_projection(game_grid.get_downward_projection());
        }
}



function resize_bg_canvas() {
        bg_canvas.width = window.innerWidth;
        bg_canvas.height = window.innerHeight;
}
