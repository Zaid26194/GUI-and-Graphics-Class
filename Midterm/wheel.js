var gl = null;
var wheel = null;
var cube = null;
var angle = 0;

function init() {
	//finds the webgl-canvas in .html file
    var canvas = document.getElementById( "webgl-canvas" );


	//Tells WebGLUtils to setup the canvas
    gl = WebGLUtils.setupWebGL( canvas );

    wheel = new Wheel(gl, 360, 2.0);

    spokes = new Spokes();

    if ( !gl ) {
        alert("Unable to setup WebGL");
        return;
    }

	//Color for clearColor
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    render();
}

function render() {
	//Gives the entire canvas the clearColor defined before
    gl.clear( gl.DEPTH_BUFFER_BIT );

    angle += 2.0; // degrees

    wheel.MV = rotate(angle, [0, 0, 1]);
    spokes.MV = rotate(angle, [0, 0, 1]);

    spokes.render();
    wheel.render();


    requestAnimationFrame( render ); 
}

window.onload = init;