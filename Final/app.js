//The Mandelbrot Set is the visual representation of an iterated function on the complex plane

'use strict';

var gl;
var canvas;

var vertexShaderText =
[
'precision highp float;',
'',
'attribute vec2 vPos;',
'',
'void main(){',
'    gl_Position = vec4(vPos, 0.0, 1.0);',
'}'
].join('\n');

var fragmentShaderText =
[
'precision highp float;',
'',
'uniform vec2 viewportDimensions;',
'uniform float minI;',
'uniform float maxI;',
'uniform float minR;',
'uniform float maxR;',
'',
'void main(){',
'',    // [0, 1080] -> [-2.0, 2.0] (1): Multiply by (2.0 - -2.0) / (1080 - 0)
'',   // [0, 4.0] -> [-2.0, 2.0]  (2): Subtracting 2.0 from result
'',    // [-2.0, 2.0]
'',    // 
'    vec2 c = vec2(',
'		gl_FragCoord.x * (maxR - minR) / viewportDimensions.x + minR,',
'		gl_FragCoord.y * (maxI - minI) / viewportDimensions.y + minI',
'	);',
'',
'',    // Mandelbrot formula!
'    vec2 z = c;',
'    float iterations = 0.0;',
'    float maxIterations = 4000.0;',
'    const int imaxIterations = 4000;',
'',
'    for (int i = 0; i < imaxIterations; i++) {',
'		float t = 2.0 * z.x * z.y + c.y;',
'		z.x = z.x * z.x - z.y * z.y + c.x;',
'		z.y = t;',
'		if (z.x * z.x + z.y * z.y > 4.0) {',
'			break;',
'       }',
'',
'       iterations += 1.0;',
'   }',
'',
'   if (iterations < maxIterations) {',
'       gl_FragColor = vec4((iterations/500.0), 0.0, 0.0, 1.0);',
'   } else {',
'       gl_FragColor = vec4(0.0, 0.8, 0.0, 1.0);',
'   }',
'}'
].join('\n');


function AddEvent(object, type, callback) {
    if (object == null || typeof (object) == 'undefined') return;
    if (object.addEventListener) {
        object.addEventListener(type, callback, false);
    } else if (object.attachEvent) {
        object.attachEvent("on" + type, callback);
    } else {
        object["on" + type] = callback;
    }
};

function Init() {
    RunDemo();
}

function RunDemo(){

    //Attach callbacks
    AddEvent(window, 'resize', OnResizeWindow);
    AddEvent(window, 'wheel', OnZoom);
    AddEvent(window, 'mousemove', OnMouseMove);

    canvas = document.getElementById('mandelbrot');
    gl = canvas.getContext('webgl');
    if (!gl) {
        console.log('WebGL not supported, falling back on experimental-webgl');
        gl = canvas.getContext('experimental-webgl');
    }
    if (!gl) {
        alert('Your browser does not support WebGL');
    }

    // Create shader program
    var vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vertexShaderText);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
        console.error('Vertex shader compile error:', gl.getShaderInfoLog(vs));
        return;
    }

    var fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fragmentShaderText);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
        console.error('Fragment shader compile error:', gl.getShaderInfoLog(fs));
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('Shader program link error:', gl.getProgramInfoLog(program));
    }

    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('Shader program validate error:', gl.getShaderInfoLog(program));
    }

    gl.useProgram(program);

    //Get Uniform locations
    var uniforms = {
        viewportDimensions: gl.getUniformLocation(program, 'viewportDimensions'),
        minI: gl.getUniformLocation(program, 'minI'),
        maxI: gl.getUniformLocation(program, 'maxI'),
        minR: gl.getUniformLocation(program, 'minR'),
        maxR: gl.getUniformLocation(program, 'maxR')
    };

    // Set CPU-side variables for all of our shader variables
    var viewportDimensions = [canvas.clientWidth, canvas.clientHeight];
    var minI = -2.0;
    var maxI = 2.0;
    var minR = -2.0;
    var maxR = 2.0;

    //Creating Buffers
    var vertexBuffer = gl.createBuffer();
    var vertices = [
        -1, 1,
		-1, -1,
		1, -1,

		-1, 1,
		1, 1,
		1, -1
    ];
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var vPosAttrib = gl.getAttribLocation(program, 'vPos');
    gl.vertexAttribPointer(
        vPosAttrib,
        2,
        gl.FLOAT,
        gl.FALSE,
        2 * Float32Array.BYTES_PER_ELEMENT,
        0
    );
    gl.enableVertexAttribArray(vPosAttrib);

    var thisFrameTime;
    var lastFrameTime = performance.now();
    var dt;
    var frames = [];
    var lastPrintTime = performance.now();

    var loop = function () {
        //FPS Info
        thisFrameTime = performance.now();
        dt = thisFrameTime - lastFrameTime;
        lastFrameTime = thisFrameTime;
        frames.push(dt);
        if (lastPrintTime + 750 < thisFrameTime) {
            lastPrintTime = thisFrameTime;
            var average = 0;
            for (var i = 0; i < frames.length; i++) {
                average += frames[i];
            }
            average /= frames.length;
            document.title = 1000 / average + ' fps';
        }

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

        gl.uniform2fv(uniforms.viewportDimensions, viewportDimensions);
        gl.uniform1f(uniforms.minI, minI);
        gl.uniform1f(uniforms.maxI, maxI);
        gl.uniform1f(uniforms.minR, minR);
        gl.uniform1f(uniforms.maxR, maxR);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    OnResizeWindow();

    function OnResizeWindow() {
        console.log('Window was resized');

        if (!canvas) {
            return;
        }

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        viewportDimensions = [canvas.width, canvas.height];

        var oldRealRange = maxR - minR;
        maxR = (maxI - minI) * (canvas.clientWidth / canvas.clientHeight) / 1.4 + minR;
        var newRealRange = maxR - minR;

        minR -= (newRealRange - oldRealRange) / 2;
        maxR = (maxI - minI) * (canvas.clientWidth / canvas.clientHeight) / 1.4 + minR;

        gl.viewport(0, 0, canvas.width, canvas.height);
    }

    function OnZoom(e) {
        var imaginaryRange = maxI - minI;
        var newRange;

        if (e.deltaY < 0) {
            newRange = imaginaryRange * 0.95;
        } else {
            newRange = imaginaryRange * 1.05;
        }

        var delta = newRange - imaginaryRange;

        minI -= delta / 2;
        maxI = minI + newRange;

        OnResizeWindow();
    }

    function OnMouseMove(e) {
        if (e.buttons === 1) {
            var imaginaryRange = maxI - minI;
            var realRange = maxR - minR;

            var imaginaryDelta = (e.movementY / canvas.height) * imaginaryRange;
            var realDelta = (e.movementX / canvas.width) * realRange;

            minI += imaginaryDelta;
            maxI += imaginaryDelta;
            minR -= realDelta;
            maxR -= realDelta;
        }
    }
}