export function randomColor() {
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += "0123456789ABCDEF"[Math.floor(Math.random() * 16)];
  }
  return color;
}
