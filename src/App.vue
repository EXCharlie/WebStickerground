
<script setup>
import { onMounted,onUnmounted, computed, ref } from 'vue';
import { useStickers } from './composables/useStickers';
import StickerItem from './components/StickerItem.vue';
import StickerToolbar from './components/StickerToolbar.vue';
import WelcomeModal from './components/WelcomeModal.vue';

const { 
    stickers, 
    backgroundImageUrl, 
    pageBackgroundColor, 
    canvasPosition, 
    loadStickers, 
    updateStickerPosition, 
    updateCanvasPosition 
} = useStickers();

const showWelcomeModal = ref(true);

const isDraggingCanvas = ref(false);
const dragStartPos = ref({ x: 0, y: 0 });

const handlePositionUpdate = ({ id, position }) => {
    updateStickerPosition(id, { x: position.x, y: position.y });
};


const backgroundStyle = computed(() => ({
    backgroundColor: pageBackgroundColor.value,
    backgroundImage: backgroundImageUrl.value ? `url(${process.env.BASE_URL}${backgroundImageUrl.value.startsWith('/') ? backgroundImageUrl.value.substring(1) : backgroundImageUrl.value})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
}));

const onCanvasMouseDown = (e) => {
    if (e.target.id === 'stickerground') {
        isDraggingCanvas.value = true;
        dragStartPos.value = { x: e.clientX, y: e.clientY };
    }
};

const onCanvasMouseMove = (e) => {
    if (isDraggingCanvas.value) {
        const deltaX = e.clientX - dragStartPos.value.x;
        const deltaY = e.clientY - dragStartPos.value.y;
        updateCanvasPosition(deltaX, deltaY);
        dragStartPos.value = { x: e.clientX, y: e.clientY };
    }
};

const onCanvasMouseUp = () => {
    isDraggingCanvas.value = false;
};

// 触摸事件处理
const onTouchStart = (e) => {
    if (e.target.id === 'stickerground' && e.touches.length === 1) {
        isDraggingCanvas.value = true;
        dragStartPos.value = { 
            x: e.touches[0].clientX, 
            y: e.touches[0].clientY 
        };
        e.preventDefault(); // 防止触摸滚动
    }
};

const onTouchMove = (e) => {
    if (isDraggingCanvas.value && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - dragStartPos.value.x;
        const deltaY = e.touches[0].clientY - dragStartPos.value.y;
        updateCanvasPosition(deltaX, deltaY);
        dragStartPos.value = { 
            x: e.touches[0].clientX, 
            y: e.touches[0].clientY 
        };
        e.preventDefault(); // 防止触摸滚动
    }
};

const onTouchEnd = () => {
    isDraggingCanvas.value = false;
};

onMounted(() => {

    window.addEventListener('mousemove', onCanvasMouseMove);
    window.addEventListener('mouseup', onCanvasMouseUp);
    
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    fetch(`${process.env.BASE_URL}stickerground.json`)
        .then(response => response.json())
        .then(data => loadStickers(data))
        .catch(error => console.error("Failed to load initial sticker data:", error));

    showWelcomeModal.value = true;
});

onUnmounted(() => {
    window.removeEventListener('mousemove', onCanvasMouseMove);
    window.removeEventListener('mouseup', onCanvasMouseUp);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', onTouchEnd);
});

const stickerContainerStyle = computed(() => ({
    transform: `translate(${canvasPosition.value.x}px, ${canvasPosition.value.y}px)`,
    position: 'absolute',
    top: 0,
    left: 0,
}));
</script>

<template>
   <div class="app" v-title title="这是标题"></div>
    <div 
        id="stickerground" 
        :style="backgroundStyle"
        @mousedown="onCanvasMouseDown"
        @touchstart="onTouchStart"
    >
        <div :style="stickerContainerStyle">
            <StickerItem
                v-for="sticker in stickers"
                :key="sticker.id"
                :sticker="sticker"
                @update-position="handlePositionUpdate"
            />
        </div>
        <StickerToolbar />
        <WelcomeModal v-if="showWelcomeModal" @close="showWelcomeModal = false" />
    </div>
</template>

<style>
#stickerground {
    width: 100vw;
    height: 100vh;
    position: relative;
    overflow: hidden;
    cursor: grab;
    touch-action: none; /* 禁用默认触摸行为 */
}

#stickerground:active {
    cursor: grabbing;
}
</style>
[file content end]