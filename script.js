const $canvas = $('canvas')
const width = 1920;
const height = 1080;

$canvas.width = width;
$canvas.height = height;

const $video = document.createElement('video')
$video.autoplay = true;
$video.playsInline = true;

class MyShader {
    constructor() {
        this.fragSource
        this.vertSource
        this.vertexShader
        this.fragmentShader
        this.gl
        this.program
        this.uniforms = []
        this.camTex
        this.renderSource
    }

    setUniform = (type, name, value) => {
        if (type != 'float' && type != 'vec2' && type != 'bool') {
            console.log('Tipo de uniform inválido')
            return;
        }
        let selectedUniform
        this.uniforms.forEach(uniform => {
            if (name == uniform.name)
                selectedUniform = uniform
        })

        if (!selectedUniform) {
            selectedUniform = {
                name: name,
                location: this.gl.getUniformLocation(this.program, name),
            }
            this.uniforms.push(selectedUniform)
        }
        switch (type) {
            case 'float':
                this.gl.uniform1f(selectedUniform.location, value);
                break;
            case 'vec2':
                console.log(value)
                this.gl.uniform2f(selectedUniform.location, ...value);
                break;
            case 'bool':
                this.gl.uniform1i(selectedUniform.location, value);
        }

    }

    startShader = async () => {
        initVideo()

        this.renderSource = await fetch('render.Js').then(res => res.text())
        this.fragBaseSource = await fetch('base.frag').then(res => res.text())
        this.fragSource = await fetch('shad.frag').then(res => res.text())
        this.vertSource = await fetch('shad.vert').then(res => res.text())

        setupUI(this.renderSource, this.fragSource)

        this.gl = $canvas.getContext("webgl");
        if (!this.gl) {
            console.error("WebGL no está soportado en este navegador.");
            return;
        }

        this.setUpProgram()

        const vertices = new Float32Array([
            -1, -1,
            1, -1,
            -1, 1,
            1, 1
        ]);

        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

        const positionLoc = this.gl.getAttribLocation(this.program, "a_position");
        this.gl.enableVertexAttribArray(positionLoc);
        this.gl.vertexAttribPointer(positionLoc, 2, this.gl.FLOAT, false, 0, 0);

        //Textura de la cámara
        this.camTex = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.camTex);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);

        this.gl.viewport(0, 0, width, height);
        this.gl.clearColor(0, 0, 0, 1);



        this.render();
    }

    render = () => {
        if ($video.readyState >= $video.HAVE_CURRENT_DATA) {
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.camTex);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, $video);
        }

        eval(this.renderSource)

        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

        requestAnimationFrame(this.render);
    }

    setUpProgram = () => {
        this.uniforms = [];
        const tryCompileVertex = this.compileShader(this.vertSource, this.gl.VERTEX_SHADER);
        if (tryCompileVertex[1] == 0) {
            this.vertexShader = tryCompileVertex[0]
        } else {
            return tryCompileVertex[1]
        }

        const tryCompileFragment = this.compileShader(this.fragBaseSource + this.fragSource, this.gl.FRAGMENT_SHADER);
        if (tryCompileFragment[1] == 0) {
            this.fragmentShader = tryCompileFragment[0]
        } else {
            console.log(tryCompileFragment)
            return tryCompileFragment[1]
        }



        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, this.vertexShader);
        this.gl.attachShader(this.program, this.fragmentShader);
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {

            console.error("Error al linkear el programa:", this.gl.getProgramInfoLog(this.program));
            return this.gl.getProgramInfoLog(this.program)
        }

        this.gl.useProgram(this.program);

        return 0
    }

    compileShader = (source, type) => {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            const compileError = this.gl.getShaderInfoLog(shader)
            console.error("Error al compilar shader:", this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return [null, compileError];
        }
        return [shader, 0];
    }

    setUpRender = (newRenderSource) => {
        try {
            eval(newRenderSource)
        } catch (error) {
            return error
        }
        myShader.renderSource = $jsInput.value
        return 0;
    }
}


const initVideo = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        $video.srcObject = stream;
    } catch (err) {
        console.error("Error al acceder a la webcam:", err);
        return;
    }
}



const myShader = new MyShader()

myShader.startShader();


let mouse = [0,0];

document.addEventListener("mousemove", (ev) => {
    mouse = [ev.clientX, ev.clientX];
});
