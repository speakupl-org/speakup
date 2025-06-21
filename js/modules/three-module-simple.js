// Simplified three-module.js for debugging - GENNADY PHILOSOPHY COMPLIANT
// Using global THREE.js to avoid multiple instances warning
// THREE and its components are available via global script tags

export function setup3DScene(canvas, THREE_NAMESPACE_HACK) {
    console.log("🚀 Initializing SIMPLE 3D scene...");
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    console.log("✅ Basic renderer configured");

    // Simple material
    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const material = new THREE.MeshPhysicalMaterial({
        metalness: 0.0,
        roughness: 0.05,
        transmission: 1.0,
        ior: 1.5,
        thickness: 1.2,
        color: 0x88c0d0,
        specularIntensity: 1.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.visible = false;
    scene.add(cube);
    
    console.log("✅ Cube created");

    // Simple lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);
    
    console.log("✅ Lighting added");

    // Load HDR
    new RGBELoader().load('/images/citrus_orchard_puresky_1k.hdr', (texture) => {
        console.log("✅ HDR loaded successfully");
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
        
        cube.visible = true;
        gsap.from(cube.scale, { duration: 1.0, x: 0.8, y: 0.8, z: 0.8, ease: 'power3.out' });

    }, undefined, (error) => {
        console.error('❌ Failed to load HDR environment map:', error);
        cube.visible = true;
    });

    // Simple animation
    const onResize = () => {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);
    onResize();

    const animate = () => {
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };
    animate();
    
    console.log("✅ Animation started");

    gsap.to(canvas, { delay: 0.1, autoAlpha: 1 });

    return { cube };
}
