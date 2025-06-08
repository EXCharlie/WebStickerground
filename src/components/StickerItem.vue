[file name]: StickerItem.vue
[file content begin]
<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useStickers } from '../composables/useStickers.js';

const props = defineProps({
    sticker: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['update-position']);
const { isDraggable, canvasPosition } = useStickers();
const elementRef = ref(null);

watch(() => props.sticker.position, (newPosition) => {
    if (newPosition) {
        position.value = { ...newPosition };
    }
}, { deep: true });

const position = ref({ ...props.sticker.position });
const isDragging = ref(false);
const zIndex = ref(1);

let offsetX = 0;
let offsetY = 0;

// 鼠标事件处理
const onMouseDown = (event) => {
    if (!isDraggable.value || !elementRef.value) return;
    isDragging.value = true;
    zIndex.value = 100;
    const rect = elementRef.value.getBoundingClientRect();
    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
};

const onMouseMove = (event) => {
    if (!isDragging.value) return;
    position.value.x = event.clientX - offsetX - canvasPosition.value.x;
    position.value.y = event.clientY - offsetY - canvasPosition.value.y;
};

const onMouseUp = () => {
    if (!isDragging.value) return;
    isDragging.value = false;
    zIndex.value = 1;

    emit('update-position', { id: props.sticker.id, position: position.value });

    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
};

// 触摸事件处理
const onTouchStart = (event) => {
    if (!isDraggable.value || !elementRef.value || event.touches.length !== 1) return;
    isDragging.value = true;
    zIndex.value = 100;
    const rect = elementRef.value.getBoundingClientRect();
    offsetX = event.touches[0].clientX - rect.left;
    offsetY = event.touches[0].clientY - rect.top;
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    event.preventDefault(); // 防止触摸滚动
};

const onTouchMove = (event) => {
    if (!isDragging.value || event.touches.length !== 1) return;
    position.value.x = event.touches[0].clientX - offsetX - canvasPosition.value.x;
    position.value.y = event.touches[0].clientY - offsetY - canvasPosition.value.y;
    event.preventDefault(); // 防止触摸滚动
};

const onTouchEnd = () => {
    if (!isDragging.value) return;
    isDragging.value = false;
    zIndex.value = 1;

    emit('update-position', { id: props.sticker.id, position: position.value });

    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', onTouchEnd);
};

const currentTime = ref('');
const currentDate = ref('');
let timeInterval = null;

if (props.sticker.type === 'timeNote') {
    const updateTime = () => {
        const now = new Date();
        currentTime.value = now.toLocaleTimeString('en-US', { hour12: false });
        currentDate.value = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(now);
    };
    onMounted(() => {
        updateTime();
        timeInterval = setInterval(updateTime, 1000);
    });
    onUnmounted(() => {
        clearInterval(timeInterval);
    });
}

const stickerClasses = computed(() => [
    'sticker',
    props.sticker.type,
    props.sticker.options.customStyleName ? `mark-${props.sticker.options.customStyleName}` : ''
]);

const stickerStyle = computed(() => ({
    left: `${position.value.x}px`,
    top: `${position.value.y}px`,
    zIndex: zIndex.value,
    cursor: isDraggable.value ? 'grab' : 'default',
    backgroundColor: props.sticker.options.backgroundColor,
    touchAction: 'none' // 禁用默认触摸行为
}));

onUnmounted(() => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', onTouchEnd);
});
</script>

<template>
    <div ref="elementRef" :class="stickerClasses" :style="stickerStyle" @mousedown="onMouseDown"
        @touchstart="onTouchStart">
        <template v-if="sticker.type === 'note'">
            {{ sticker.content }}
        </template>

        <template v-if="sticker.type === 'imageNote'">
            <img :src="sticker.content" :alt="sticker.options.imageDescription"
                :style="{ width: sticker.options.imageWidth, height: sticker.options.imageHeight || 'auto' }">
            <p v-if="sticker.options.imageDescription">{{ sticker.options.imageDescription }}</p>
            <div v-if="sticker.options.userName" class="quote-user-name">- {{ sticker.options.userName }}</div>
        </template>

        <template v-if="sticker.type === 'imageSticker'">
            <img :src="sticker.content"
                :style="{ width: sticker.options.imageWidth, height: sticker.options.imageHeight || 'auto' }">
        </template>

        <template v-if="sticker.type === 'timeNote'">
            <div class="mark-time">{{ currentTime }}</div>
            <div class="mark-date">{{ currentDate }}</div>
        </template>
        <template v-if="sticker.type === 'quotenote'">
            <div>{{ sticker.content }}</div>
            <div class="quote-user-name">- {{ sticker.options.userName }}</div>
        </template>
    </div>
</template>

<style scoped>
.sticker {
    position: absolute;
    color: rgba(0, 0, 0, 0.8);
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15), inset 0 0 20px rgba(0, 0, 0, 0.05);
    backdrop-filter: blur(10px);
    padding: 20px;
    user-select: none;
    /* 防止文本选择 */
}

.quote-user-name {
    font-style: italic;
    opacity: 0.5;
    text-align: right;
    margin-top: 10px;
}

.sticker:active {
    cursor: grabbing;
}

.note {
    width: 250px;
    min-height: 150px;
    line-height: 1.5;
    white-space: pre-wrap;
}

.quotenote {
    width: 250px;
    min-height: 150px;
    line-height: 1.5;
    white-space: pre-wrap;
}

.imageNote {
    line-height: 1.5;
}

.imageNote p {
    font-size: 13px;
    text-align: center;
    margin-top: 10px;
    color: rgba(0, 0, 0, 0.6);
}

.imageSticker {
    background-color: transparent !important;
    box-shadow: none;
    backdrop-filter: none;
    padding: 0;
}

.timeNote {
    text-align: center;
    padding: 20px 30px;
}

.mark-time {
    font-family: "digital-7", monospace;
    font-size: 48px;
    font-weight: 900;
    letter-spacing: 5px;
}

.mark-date {
    font-family: "digital-7", monospace;
    font-size: 18px;
    font-weight: 200;
}

.mark-filter1 {
    filter:
        drop-shadow(2px 0px 0 #FF00FF) drop-shadow(-4px 0px 0 #00FFFF) drop-shadow(0px 5px 0 #00FF00) drop-shadow(0px -2px 0 #FF0000) drop-shadow(6px 2px 0 #FFFF00) drop-shadow(-2px -5px 0 #FF7F00) drop-shadow(2px -7px 0 #0000FF) drop-shadow(-6px 6px 0 #8B00FF);
}

/* 大字 */
.mark-filter3 {
    font-size: 24px;

}

/* 小字单行 */
.mark-filter4 {
    font-size: 10px;
    min-height: 10px;
    text-align: center;
}

.mark-style2 {
    width: 250px;
    font-size: 64px;
    font-weight: 900;
    display: flex;
    align-items: center;
    text-align: center;
    background: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8);
    background-size: 400% 400%;
    animation: gradient 15s linear infinite;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>
