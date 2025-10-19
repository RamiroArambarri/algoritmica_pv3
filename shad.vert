attribute vec4 a_position;
varying vec2 pos;

void main() {
    gl_Position = a_position;
    pos = vec2(a_position.x, a_position.y);
}