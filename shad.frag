varying vec2 pos;

uniform float time;
uniform float width;
uniform float height;
uniform float pixSize;
uniform float mouseX;
uniform float mouseY;
uniform float pi;

uniform sampler2D camTex;

void main() {
    vec4 pCamCol = texture2D(camTex, vec2(pos.x, 1. - pos.y));

    vec4 newCol = pCamCol;

    gl_FragColor = vec4(newCol.xyz, 1.);
}