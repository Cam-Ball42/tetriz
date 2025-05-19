let ctx;
let fxctx;

let canvas_height;
let canvas_width;
let columns;
let rows;
let cell_height;
let cell_width;
let delta_time = 0;

//Init FX
export function set_fxctx(_fxctx) {
  fxctx = _fxctx;
}

export function set_ctx(_ctx) {
  ctx = _ctx;
  //Fix for fuzzyness on moblie?
  //ctx.translate(0.5, 0.5)
}
export function init_tools(_canvas_width, _canvas_height, _columns, _rows) {
  canvas_height = _canvas_height;
  canvas_width = _canvas_width;
  columns = _columns;
  rows = _rows;
  cell_height = canvas_height / rows;
  cell_width = canvas_width / columns;
}

export function draw_grid() {
  ctx.lineWidth = 0.15;
  for (let x = 0; x < canvas_width; x += cell_width) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas_height);
    ctx.closePath();
    ctx.stroke();
  }

  for (let y = 0; y < canvas_height; y += cell_height) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas_width, y);
    ctx.closePath();
    ctx.stroke();
  }
}
function roundedRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x, y + radius);
  ctx.arcTo(x, y + height, x + radius, y + height, radius);
  ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
  ctx.arcTo(x + width, y, x + width - radius, y, radius);
  ctx.arcTo(x, y, x, y + radius, radius);
  ctx.stroke();
  ctx.fill();
}

export function flash_line_anim(y) {
  let a = 0;
  function animate(timestamp) {
    fxctx.fillStyle = `rgba(${a},0,0,0.5)`;
    fxctx.fillRect(0, y * cell_height, canvas_width, cell_height);
    a += 5;
    if (a <= 255) {
      requestAnimationFrame(animate);
    } else {
      fxctx.clearRect(0, y * cell_height, canvas_width, cell_height);
    }
    // console.log(a);
  }
  requestAnimationFrame(animate);
}

export function draw_square(x, y, type) {
  ctx.lineWidth = 1.5;
  switch (type) {
    case "O":
      ctx.fillStyle = "#ff5500";
      break;
    case "T":
      ctx.fillStyle = "#6d0011";
      break;
    case "L":
      ctx.fillStyle = "#ffe600";
      break;
    case "I":
      ctx.fillStyle = "#2480ff";
      break;
    case "S":
      ctx.fillStyle = "#ff00bb";
      break;
    case "Z":
      ctx.fillStyle = "#ff9600";
      break;
    case "J":
      ctx.fillStyle = "#f90009";
      break;
    default:
      ctx.fillStyle = "black";
      break;
  }
  //ctx.fillRect(x, y, cell_width, cell_height, 90);
  roundedRect(x, y, cell_width, cell_height, 7);
}

export function draw_state(state) {
  for (const [key, value] of state) {
    if (value !== "X") {
      const pos = key.split(",");

      draw_square(
        Number.parseInt(pos[0]) * cell_width,
        Number.parseInt(pos[1]) * cell_height,
        value,
      );
    }
  }
}
