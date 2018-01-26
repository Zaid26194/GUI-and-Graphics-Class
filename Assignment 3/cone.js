var gl = null;
var cone = null;

function init() {
	//finds the webgl-canvas in .html file
    var canvas = document.getElementById( "webgl-canvas" );


	//Tells WebGLUtils to setup the canvas
    gl = WebGLUtils.setupWebGL( canvas );

    cone = new Cone(gl);

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
    gl.clear( gl.COLOR_BUFFER_BIT );
    cone.render();
}

window.onload = init;