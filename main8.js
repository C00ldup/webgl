import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import Stats from 'three/addons/libs/stats.module.js';

function main() {
	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
	RectAreaLightUniformsLib.init();

    let whichBrowser = function() {
        // Opera 8.0+
        if ( (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0 )
            return "isOpera";

        // Firefox 1.0+
        if ( typeof InstallTrigger !== 'undefined' )
            return "isFirefox";

        if ( !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime) )
            return "isChrome";

        // Edge (based on chromium) detection
        if ( isChrome && (navigator.userAgent.indexOf("Edg") != -1) )
            return "isEdgeChromium";
    }

    let encoding = (whichBrowser() == "isFirefox")?'video/webm':'video/webm;codecs=h264'

    // canvas recording
    const canvasStream = canvas.captureStream(60);
    const mediaRecorder = new MediaRecorder(canvasStream, { mimeType: encoding, videoBitsPerSecond: 10000000 });
    console.log(mediaRecorder);
    let chunks = [];
    mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
    };
    mediaRecorder.onstop = () => {
        const blob = new Blob(chunks);
        const recordedVideoUrl = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        downloadLink.download = "video.mp4";
        downloadLink.href = recordedVideoUrl;
        downloadLink.click();
    };
    //mediaRecorder.start();

	const fov = 75;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 70;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    let cameraSetting = function( xP, yP, zP, xV, yV, zV, xUp, yUp, zUp) {
        camera.position.set( xP, yP, zP );
        camera.lookAt( xV, yV, zV );
        camera.up.set( xUp, yUp, zUp );
    };
    //cameraSetting( 50, 100, 0, 50, 50, 0, 1, 0, 0 ); // camera alta
    cameraSetting( 0, 5, 0, 1, 5, 0, 0, 1, 0 ); // camera inizio

/*
	const controls = new OrbitControls( camera, canvas );
	controls.target.set( 0, 5, 0 );
	controls.update();
*/
	const scene = new THREE.Scene();
	scene.background = new THREE.Color( 'black' );

    //const axesHelper = new THREE.AxesHelper( 20 );
    //scene.add( axesHelper );

    //const stats = new Stats();
    //document.body.appendChild( stats.dom );

    const planeSize = 100;
	{
		const loader = new THREE.TextureLoader();
		const texture = loader.load( 'https://threejs.org/manual/examples/resources/images/checker.png' );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.magFilter = THREE.NearestFilter;
		texture.colorSpace = THREE.SRGBColorSpace;
		const repeats = planeSize / 2;
		texture.repeat.set( repeats,  repeats / (repeats / (40/2)) );

		const planeGeo = new THREE.PlaneGeometry( planeSize, planeSize-planeSize+20 );
		const planeMat = new THREE.MeshStandardMaterial( {
			map: texture,
			side: THREE.DoubleSide,
		} );
		const mesh = new THREE.Mesh( planeGeo, planeMat );
		mesh.rotation.x = Math.PI * - .5;
        mesh.position.x = repeats;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
		scene.add( mesh );
	}

	let lights = function(x, y, z){
        {
            const color = 0xFFFFFF;
            const intensity = 4;
            const width = 4.5;
            const height = 2.5;
            const light = new THREE.RectAreaLight( color, intensity, width, height );
            light.position.set( x, y, z );
            light.rotation.x = THREE.MathUtils.degToRad( - 90 );
            scene.add( light );

            const helper = new RectAreaLightHelper( light );
            light.add( helper );
        }
	};
    for (let i=0; i<(planeSize/20)-1; i++)
        lights((i*20)+20, 10, 0);

	function resizeRendererToDisplaySize( renderer ) {

		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if ( needResize ) {

			renderer.setSize( width, height, false );

		}

		return needResize;

	}

	function render() {

		if ( resizeRendererToDisplaySize( renderer ) ) {
			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
		}

        console.log(camera.position);
        console.log(camera.far);
        console.log(planeSize);
        if(camera.position.x + camera.far >= planeSize) {

        }
        if(camera.position.x >= planeSize) {
            return;
        } else {
            camera.position.x += 0.2;
        }
        if(camera.position.x >= planeSize && mediaRecorder.state == "recording"){
            console.log(mediaRecorder.state);
            mediaRecorder.stop();
        }

		renderer.render( scene, camera );
        //stats.update();

        setTimeout(function(){
            requestAnimationFrame( render );
        }, 1000 / 60);

	}

	requestAnimationFrame( render );

}

main();
