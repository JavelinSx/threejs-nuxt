<template>
    <div ref="sceneContainer"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import testModel from '../GTLFmodels/Pathfinder_1k.glb'
const sceneContainer = ref(null);

onMounted(() => {
    // Создаем сцену, камеру и рендерер
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    sceneContainer.value.appendChild(renderer.domElement);
    scene.background = new THREE.Color(0x87CEEB);
    // Добавляем источник света
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(100, 100, 100);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040); // Мягкий свет
    scene.add(ambientLight);

    // Загрузка 3D модели с анимацией
    const loader = new GLTFLoader();
    let model, mixer;

    loader.load(testModel, (gltf) => {
        model = gltf.scene;
        scene.add(model);

        // Если модель содержит анимацию
        if (gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(model);
            const action = mixer.clipAction(gltf.animations[0]);
            action.play();
        }

        model.position.set(0, 0, 0);
        model.scale.set(1, 1, 1); // Изменение масштаба модели
    });

    camera.position.set(1, 15, 5);
    // Добавляем OrbitControls для управления камерой
    const controls = new OrbitControls(camera, renderer.domElement);
    // Включаем плавное вращение
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Разрешаем панорамирование (перемещение камеры с помощью мышки)
    controls.screenSpacePanning = true; // Позволяет перемещать камеру по всем осям

    // Ограничиваем угол вращения по вертикали, если нужно (0 - свободное вращение)
    controls.maxPolarAngle = Math.PI; // Это позволяет вращать камеру на полный круг по вертикальной оси

    // Настраиваем ограничения приближения/удаления (опционально)
    controls.minDistance = 1;  // Минимальная дистанция камеры
    controls.maxDistance = 100; // Максимальная дистанция камеры

    // Если нужно отключить ограничения углов, чтобы камера могла вращаться свободно:
    controls.minPolarAngle = 0; // Минимальный угол вращения (по умолчанию)
    controls.maxPolarAngle = Math.PI; // Максимальный угол вращения (по умолчанию)

    // Управление вращением камеры
    controls.enableRotate = true; // Вращение камеры (по умолчанию включено)

    // Управление масштабированием (приближение и удаление)
    controls.enableZoom = true;  // Включаем возможность приближения/удаления

    // Управление панорамированием (перемещение камеры по сцене)
    controls.enablePan = true;  // Включаем панорамирование (перемещение)
    // Анимация вращения камеры вокруг модели
    const animate = () => {
        requestAnimationFrame(animate);

        // if (model) {
        //     // Вращаем модель
        //     model.rotation.y += 0.01;
        // }

        // // Анимация движения камеры
        // camera.position.x = 5 * Math.sin(Date.now() * 0.001);
        // camera.position.z = 5 * Math.cos(Date.now() * 0.001);
        // camera.lookAt(0, 1, 0);  // Смотрим на центр сцены

        if (mixer) {
            mixer.update(0.01); // Обновление анимации
        }

        renderer.render(scene, camera);
    };

    animate();

    // Обработка изменения размеров окна
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    });
});
</script>

<style scoped>
div {
    width: 100%;
    height: 100vh;
}
</style>