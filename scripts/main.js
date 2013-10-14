jQuery(function($){
	//jQuery Document Ready
	$('html').removeClass('no-js');
	addCSS3Classes($);

    init();
    animate();

});

function addCSS3Classes($){
	//CSS3 Selector Classes
	$(':first-child').toggleClass('first-child', true);
	$(':last-child').toggleClass('last-child', true);
}

//Stub Console Methods if they don't exist.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

var container, stats;
var camera, scene, renderer, particles, geometry, materials = [], parameters, notes, i, h, color;
var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 );
    camera.position.z = 1000;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0x000000, 0.0007 );

    geometry = new THREE.Geometry();

    for ( i = 0; i < 400; i++ ) {

        var vertex = new THREE.Vector3();
        vertex.x = Math.random() * 2000 - 1000;
        vertex.y = Math.random() * 2000 - 1000;
        vertex.z = Math.random() * 2000 - 1000;

        geometry.vertices.push( vertex );

    }

    parameters = [ 5, 10, 15, 20, 25, 30, 35 ];

    notes = [
        "quarter-note.png",
        "eighth-note.png",
        "beamed-eighth-notes.png",
        "beamed-sixteenth-notes.png",
        "sharp.png",
        "flat.png",
        "natural.png"
    ];
    var tempNotes = new Array();

    for ( i = 0; i < parameters.length; i++ ) {
        if(tempNotes.length == 0){
            tempNotes = shuffleArray(notes);
        }
        size  = parameters[i];

        materials[i] = new THREE.ParticleBasicMaterial( {
            size: size,
            map: THREE.ImageUtils.loadTexture("../images/" + tempNotes.pop()),
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthTest: false,
            opacity: 0.4
        } );

        if(i%2){
            materials[i].color.setHex(0x8e6d2d);
        }else{
            materials[i].color.setHex(0xffffff);
        }

        particles = new THREE.ParticleSystem( geometry, materials[i] );

        particles.rotation.x = 0;
        particles.rotation.y = Math.random() * 6;
        particles.rotation.z = Math.random() * 6;

        //particles.sortParticles = true;

        scene.add( particles );
    }

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColorHex( 0x000000, 0 );
    $(renderer.domElement).css({
        background: 'url("images/bg.jpg") black',
        backgroundSize: 'cover'
    }).attr('id', 'note-canvas');
    container.appendChild( renderer.domElement );

    /*
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild( stats.domElement );
    */

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    document.addEventListener( 'touchmove', onDocumentTouchMove, false );

    //

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;

}

function onDocumentTouchStart( event ) {

    if ( event.touches.length === 1 ) {

        event.preventDefault();

        mouseX = event.touches[ 0 ].pageX - windowHalfX;
        mouseY = event.touches[ 0 ].pageY - windowHalfY;

    }

}

function onDocumentTouchMove( event ) {

    if ( event.touches.length === 1 ) {

        event.preventDefault();

        mouseX = event.touches[ 0 ].pageX - windowHalfX;
        mouseY = event.touches[ 0 ].pageY - windowHalfY;

    }

}

//

function animate() {

    requestAnimationFrame( animate );

    render();
    stats.update();

}

function render() {

    var time = Date.now() * 0.000005;

    camera.position.x += ( mouseX - camera.position.x ) * 0.005;
    camera.position.y += ( mouseY - camera.position.y ) * 0.005;

    camera.lookAt( scene.position );

    for ( i = 0; i < scene.children.length; i ++ ) {

        var object = scene.children[ i ];

        if ( object instanceof THREE.ParticleSystem ) {

            object.rotation.y = time * ( i < 2 ? i + 1 : - ( i + 1 ) );

        }

    }
    renderer.render( scene, camera );

}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}