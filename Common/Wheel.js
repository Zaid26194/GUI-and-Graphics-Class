const DefaultNumSides = 16;
const DefaultSizeReduction = 1.0;

function Wheel( gl, numSides, sizeReduction, vertexShaderId, fragmentShaderId) {

    // Initialize the shader pipeline for this object using either shader ids
    //   declared in the application's HTML header, or use the default names.
    //
    
    var vertShdr = vertexShaderId || "Wheel-vertex-shader";
    var fragShdr = fragmentShaderId || "Wheel-fragment-shader";

    this.program = initShaders(gl, vertShdr, fragShdr);

    if ( this.program < 0 ) {
        alert( "Error: Cone shader pipeline failed to compile.\n\n" +
            "\tvertex shader id:  \t" + vertShdr + "\n" +
            "\tfragment shader id:\t" + fragShdr + "\n" );
        return; 
    }

    var n = numSides || DefaultNumSides; // Number of sides 
    var size = sizeReduction || DefaultSizeReduction

    var theta = 0.0;
    var dTheta = 2.0 * Math.PI / n;
    
    // Record the number of components for each vertex's position in the Cone object's 
    //   positions property. (that's why there's a "this" preceding the positions here).
    //   Here, we both create the positions object, as well as initialize its
    //   numComponents field.
    //
    this.positions = { numComponents: 3 };
    
    // Initialize temporary arrays for the Wheel's indices and vertex positions
    //
    var positions = [0.0, 0.0, 0.0];
    var indices = [ 0 ];

    for ( var i = 0; i < n; ++i ) {
        theta = i * dTheta;

        positions.push(Math.cos(theta) / size, Math.sin(theta) / size, 0.0);
        indices.push(n - i);
    }


    positions.push( 0.0, 0.0, 1.0 );
    
    // Close the triangle fan by repeating the first (non-center) point.
    //
    indices.push(n);

    this.indices = { count: indices.length };

    indices.push(n + 1);

    indices = indices.concat(indices.slice(1, n + 2).reverse());

    this.positions.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.positions.buffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW );

    this.indices.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indices.buffer );
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    this.positions.attributeLoc = gl.getAttribLocation(this.program, "vPosition");
    gl.enableVertexAttribArray( this.positions.attributeLoc );


    MVLoc = gl.getUniformLocation( this.program, "MV" );
    this.MV = undefined;

    this.render = function () {
        gl.useProgram( this.program );

        gl.bindBuffer( gl.ARRAY_BUFFER, this.positions.buffer );
        gl.vertexAttribPointer( this.positions.attributeLoc, this.positions.numComponents,
            gl.FLOAT, gl.FALSE, 0, 0);
 
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indices.buffer );

        gl.uniformMatrix4fv(MVLoc, gl.FALSE, flatten(this.MV));

        gl.drawElements(gl.POINTS, this.indices.count, gl.UNSIGNED_SHORT, 0);

        var offset = this.indices.count * 2;
        gl.drawElements( gl.POINTS, this.indices.count, gl.UNSIGNED_SHORT, offset );
    }
};


function Spokes(vertexShaderId, fragmentShaderId) {

    // Initialize the shader pipeline for this object using either shader ids
    //   declared in the application's HTML header, or use the default names.
    //
    var vertShdr = vertexShaderId || "Spokes-vertex-shader";
    var fragShdr = fragmentShaderId || "Spokes-fragment-shader";

    this.program = initShaders(gl, vertShdr, fragShdr);

    if (this.program < 0) {
        alert("Error: Cube shader pipeline failed to compile.\n\n" +
            "\tvertex shader id:  \t" + vertShdr + "\n" +
            "\tfragment shader id:\t" + fragShdr + "\n");
        return;
    }

    this.positions = {
        values: new Float32Array([
           0.0, 0.0, 0.0,  // Center of spoke
	    0.5, 0, 0.0,  // Right
	    0, 0.5, 0.0,   // Top
	    -0.5, 0.0, 0.0,   // Left
	    0, -0.5, 0.0,   // Bottom
        ]),
        numComponents: 3
    };

    this.indices = {
        values: new Uint16Array([
            0, 1, 0, 2,
            0, 3, 0, 4
        ])
    };
    this.indices.count = this.indices.values.length;


    this.positions.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positions.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions.values, gl.STATIC_DRAW);

    this.indices.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices.buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices.values, gl.STATIC_DRAW);

    this.positions.attributeLoc = gl.getAttribLocation(this.program, "vPosition");
    gl.enableVertexAttribArray(this.positions.attributeLoc);

    MVLoc = gl.getUniformLocation(this.program, "MV");

    this.MV = undefined;

    this.render = function () {
        gl.useProgram(this.program);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positions.buffer);
        gl.vertexAttribPointer(this.positions.attributeLoc, this.positions.numComponents,
            gl.FLOAT, gl.FALSE, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices.buffer);

        gl.uniformMatrix4fv(MVLoc, gl.FALSE, flatten(this.MV));
        
        gl.lineWidth(10);
        gl.drawElements(gl.LINES, this.indices.count, gl.UNSIGNED_SHORT, 0);
    }
};
