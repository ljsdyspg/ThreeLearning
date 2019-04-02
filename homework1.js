function init() {
    // alert("计算机图形学-第一次作业-胡宇翔");

    // 初始化监控
    var stats = initStats();

    // 初始化场景
    var scene = new THREE.Scene();

    // 初始化相机
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    // 初始化渲染器
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColorHex();
    renderer.setClearColor(new THREE.Color(0xFFFFFF));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;

    var axes = new THREE.AxisHelper(50);
    scene.add(axes);

    // 创建立方体
    var cube = createMesh(new THREE.BoxGeometry(10, 10, 10), "MyInfo.jpg");
    cube.position.set(0, 0, 0);
    cube.castShadow = true;
    scene.add(cube);

    // 创建平面
    var planeColor = "#888888";
    var planeGeometry = new THREE.PlaneGeometry(600, 200, 20, 20);
    var planeMaterial = new THREE.MeshLambertMaterial({color: planeColor});
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.position.set(0, -15, 0);
    plane.rotation.x = -0.5 * Math.PI;
    scene.add(plane);

    camera.position.set(-50, 50, 50);
    camera.lookAt(scene.position);

    // 全局光照
    var ambiLightColor = "#555555";
    var ambiLight = new THREE.AmbientLight(ambiLightColor);
    scene.add(ambiLight);

    var lightColor = "#CCCCCC";
    var light = new THREE.DirectionalLight();
    light.intensity = 1;
    light.position.set(100, 100, 100);
    light.castShadow = true;
    light.shadowCameraVisible = true;

    light.shadowCameraNear = 2;
    light.shadowCameraFar = 2000;
    light.shadowCameraLeft = -30;
    light.shadowCameraRight = 30;
    light.shadowCameraTop = 30;
    light.shadowCameraBottom = -30;

    scene.add(light);

    // 新建轨道控制器
    var orbitControls = new THREE.OrbitControls(camera);
    // orbitControls.autoRotate = true;
    // 更新控制器
    var clock = new THREE.Clock();


    var step = 0;

    var controls = new function () {
        this.scaleX = 1;
        this.scaleY = 1;
        this.scaleZ = 1;

        this.positionX = 0;
        this.positionY = 10;
        this.positionZ = 0;

        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;
        this.scale = 1;

        this.translateX = 0;
        this.translateY = 0;
        this.translateZ = 0;

        this.visible = true;
        this.autoRotate = true;

        this.translate = function () {
            cube.translateX(controls.translateX);
            cube.translateY(controls.translateY);
            cube.translateZ(controls.translateZ);

            controls.positionX = cube.position.x;
            controls.positionY = cube.position.y;
            controls.positionZ = cube.position.z;
        }
    };

    var gui = new dat.GUI();
    guiScale = gui.addFolder('比例');
    guiScale.add(controls, 'scaleX', 0, 5);
    guiScale.add(controls, 'scaleY', 0, 5);
    guiScale.add(controls, 'scaleZ', 0, 5);

    guiPosition = gui.addFolder('位置');
    var contX = guiPosition.add(controls, 'positionX', -10, 10);
    var contY = guiPosition.add(controls, 'positionY', -4, 20);
    var contZ = guiPosition.add(controls, 'positionZ', -10, 10);

    contX.listen();
    contX.onChange(function () {
        cube.position.x = controls.positionX;
    });

    contY.listen();
    contY.onChange(function () {
        cube.position.y = controls.positionY;
    });

    contZ.listen();
    contZ.onChange(function () {
        cube.position.z = controls.positionZ;
    });

    guiRotation = gui.addFolder('旋转');
    guiRotation.add(controls, 'rotationX', -4, 4);
    guiRotation.add(controls, 'rotationY', -4, 4);
    guiRotation.add(controls, 'rotationZ', -4, 4);

    guiTranslate = gui.addFolder('变换');

    guiTranslate.add(controls, 'translateX', -10, 10);
    guiTranslate.add(controls, 'translateY', -10, 10);
    guiTranslate.add(controls, 'translateZ', -10, 10);
    guiTranslate.add(controls, 'translate');

    gui.add(controls, 'visible');

    gui.add(controls, 'autoRotate');


    function createMesh(geom, imageFile) {
        var texture = THREE.ImageUtils.loadTexture("" + imageFile);
        var mat = new THREE.MeshPhongMaterial();
        mat.map = texture;
        var mesh = new THREE.Mesh(geom, mat);
        return mesh;
    }

    document.getElementById("WebGL").appendChild(renderer.domElement);


    var step = 0.01;

    // 动画
    render();

    function render() {
        stats.update();

        //sphere.rotation.y=step+=0.01;
        var delta = clock.getDelta();
        orbitControls.update(delta);

        cube.visible = controls.visible;


        if (controls.autoRotate) {
            cube.rotation.x += step;
            cube.rotation.y += step;
            cube.rotation.z += step;
        } else {
            cube.rotation.x = controls.rotationX;
            cube.rotation.y = controls.rotationY;
            cube.rotation.z = controls.rotationZ;
        }


        cube.scale.set(controls.scaleX, controls.scaleY, controls.scaleZ);

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }


    /**
     *  初始化帧数监控
     * @returns {{REVISION, domElement, dom, showPanel, setMode, addPanel, update, end, begin}}
     */
    function initStats() {
        var stats = new Stats();
        stats.setMode(0);

        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.left = '0px';

        document.getElementById("Stats").appendChild(stats.domElement);
        return stats;
    }
}

window.onload = init;