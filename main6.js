import * as THREE from 'three';

function main() {

	container = document.createElement( 'canvas' );
    container.setAttribute("id", "c");
    document.body.appendChild( container );
    const canvas = document.querySelector( '#c' );
    const renderer = new THREE.WebGLRenderer( { antialias: true, canvas: canvas } );

	const fov = 75;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 5;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.z = 2;

	const scene = new THREE.Scene();

	const boxWidth = 0.8;
	const boxHeight = 1;
	const boxDepth = 0.03;
	const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth,
                                            50, 50);

	const cubes = []; // just an array we can use to rotate the cubes
	const loader = new THREE.TextureLoader();

	const texture = loader.load( 'https://static.turbosquid.com/Preview/2014/08/01__20_40_40/Wooden+door+01.JPGe46ee0f5-e921-453f-aaa6-4a6f2fb157e5Large.jpg' );
	texture.colorSpace = THREE.SRGBColorSpace;
    //texture.magFilter = THREE.NearestFilter;

	const material = new THREE.MeshBasicMaterial( {
		map: texture
	} );
	const cube = new THREE.Mesh( geometry, material );
	scene.add( cube );
	cubes.push( cube ); // add to our list of cubes to rotate

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

	function render( time ) {

		time *= 0.001;

		if ( resizeRendererToDisplaySize( renderer ) ) {

			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();

		}

		cubes.forEach( ( cube, ndx ) => {

			const speed = .2 + ndx * .1;
			const rot = time * speed;
			//cube.rotation.x = rot;
			cube.rotation.y = rot;

		} );

		renderer.render( scene, camera );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );

}

main();
