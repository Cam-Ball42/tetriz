let ctx;

export function set_ctx(_ctx){
  ctx = _ctx;
}

export function draw_grid(width, height, cellsize){
ctx.lineWidth = 0.5;
for(let x =0; x < width; x += cellsize) {
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, height);
  ctx.closePath();
  ctx.stroke();
  }

for(let y =0; y < height; y += cellsize) {
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
    draw_square()
  } 
    
  
}
