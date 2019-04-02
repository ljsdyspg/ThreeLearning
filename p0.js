var camera;
var scene;
var renderer;


function init() {

    // create a stats monitor
    var stats = initStats();

    // create a scene
    scene = new THREE.Scene();

    // create a camera (Perspective Camera)
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    /*innerHeight	返回窗口的文档显示区的高度。
    innerWidth	返回窗口的文档显示区的宽度。*/
    // 新建轨道控制器
    var orbitControls = new THREE.OrbitControls(camera);
    orbitControls.autoRotate = true;
    // 更新控制器
    var clock = new THREE.Clock();



    // create a render
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColorHex();
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0); // set bg color
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;

    // show axes in the screen
    var axes = new THREE.AxisHelper(20);
    scene.add(axes);

    // create the ground plane
    var planeGeometry = new THREE.PlaneGeometry(60, 20);// plane's width and height
    var planeMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc});
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;

    // add the plane to the scene
    scene.add(plane);

    // create spotLight
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);


    // create a cube
    var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;

    // position the cube
    cube.position.x = -10;
    cube.position.y = 3;
    cube.position.z = 0;

    // add the cube to the scene
    scene.add(cube);

    // create a shape
    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.castShadow = true;

    // position the sphere
    sphere.position.x = 20;
    sphere.position.y = 4;
    sphere.position.z = 2;

    // add the sphere to the scene
    scene.add(sphere);

    // position and point the camera to the center of the scene
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    // add the output of the renderer to the html element
    document.getElementById("WebGL-output").appendChild(renderer.domElement);

    // show controls top right
    var controls = new function () {
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;
    };
    var gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.5);// min to max
    gui.add(controls, 'bouncingSpeed', 0, 0.5);


    // render the scene
    // renderer.render(scene,camera);
    renderScene();// to create animation


    // initialize the stat object
    function initStats() {
        var stats = new Stats();
        stats.setMode(0);//  0 = monitor the fps, 1 = show rendering time
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        document.getElementById("Stats-output").appendChild(stats.domElement);
        return stats;
    }

    var step = 0;

    // render the scene every frame
    function renderScene() {
        stats.update(); // update stats information every frame

        // rotate the cube
        cube.rotation.x += 0.02;
        cube.rotation.y += 0.02;
        cube.rotation.z += controls.rotationSpeed;

        // bounce the ball
        step += controls.bouncingSpeed;
        sphere.position.x = 20 + (10 * (Math.cos(step)));
        sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));


        //sphere.rotation.y=step+=0.01;
        var delta = clock.getDelta();
        orbitControls.update(delta);


        requestAnimationFrame(renderScene);
        renderer.render(scene, camera);
    }



}

