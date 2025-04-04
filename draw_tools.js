let ctx;
let current_cell_size;


export function set_ctx(_ctx){
  ctx = _ctx;
}

export function draw_grid(width, height,columns,rows){
ctx.lineWidth = 0.5;
for(let x =0; x < width; x += width / columns) {
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, height);
  ctx.closePath();
  ctx.stroke();
  }

for(let y =0; y <height; y += height/rows) {
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(width, y);
  ctx.closePath();
  ctx.stroke();
  }
}

export function draw_square(x, y, size){
  ctx.fillRect(x, y, size, size);
}

export function draw_state(state){
 
  for (const [key,value] of state) {
    if (value != 'X'){
      draw_square(key.x, key.y, 20)
    }

  } 
    
  
}
