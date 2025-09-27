attribute vec4 a_position;
varying vec2 pos;

void main() {
    gl_Position = 2. * a_position - 1.;
    pos = a_position.xy;
}