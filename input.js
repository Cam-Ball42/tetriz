export default class InputHandler {


        constructor(_grid, _on_hit_down) {
                this.stack = {};
                this.grid = _grid;
                this.on_hit_down = _on_hit_down
        }

        startHandler() {
                window.addEventListener('keydown',
                        (e) => {
                                if (!this.stack[e.code]) {
                                        this.stack[e.code] = {
                                                pressed: true,
                                                frames: 0,
                                                key: e.key
                                        };
                                }
                        });
                window.addEventListener('keyup',
                        (e) => {
                                if (this.stack[e.code]) {
                                        delete this.stack[e.code];
                                }
                        });
        }


        handleInputStack() {
                for (const event in this.stack) {
                        if (this.stack[event].key !== undefined) {
                                if (this.stack[event].frames % 6 === 0 &&
                                        this.stack[event].frames > 2) {
                                        this.handleKey(this.stack[event].key);
                                }
                                this.stack[event].frames += 1;
                                if (this.stack[event].key === "e") {
                                        this.handleKey(this.stack[event].key);
                                        delete this.stack[event].key;
                                }
                        }
                }
        }

        handleKey(key) {
                switch (key) {
                        case "a":
                        case "ArrowLeft":
                                //A : Move left
                                this.grid.move_shape(-1, 0, this.grid.active_shape);
                                this.grid.sync_state(this.grid.game_state, this.grid.current_shapes);
                                break;
                        case "d":
                        case "ArrowRight":
                                //D Move right
                                this.grid.move_shape(1, 0, this.grid.active_shape);
                                this.grid.sync_state(this.grid.game_state, this.grid.current_shapes);
                                break;
                        case "s":
                        case "ArrowDown":
                                //Move Down
                                if (this.grid.move_shape(0, 1, this.grid.active_shape) === false) {
                                        this.on_hit_down();
                                }
                                this.grid.sync_state(this.grid.game_state, this.grid.current_shapes);
                                break;
                        case "e":
                                //Rotate
                                this.grid.rotate_shape(this.grid.active_shape);
                                this.grid.sync_state(this.grid.game_state, this.grid.current_shapes);
                                break;
                        case " ":
                                console.log("space pressed");
                                break;

                        default:
                                console.log(`Invalid key ${key}`);
                                return;
                }

        }
}
