varying vec2 pos;

uniform float time;
uniform float width;
uniform float height;
uniform float pixSize;
uniform float mouseX;
uniform float mouseY;
uniform float pi;
uniform float aspRatio;
uniform float camAspRatio;

uniform sampler2D camTex;

void main() {

vec2 rPos = vec2(pos.x * aspRatio, pos.y);

vec4 camCol = texture2D(camTex, vec2(.5 + pos.x * .5, .5 - pos.y * .5 / camAspRatio));

vec4 newCol = camCol;

gl_FragColor = vec4(newCol.xyz, 1.);
}