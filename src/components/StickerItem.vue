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

const { isDraggable } = useStickers();
const elementRef = ref(null);

watch(() => props.sticker.position, (newPosition) => {
  if (newPosition) {
    position.value = { ...newPosition };
  }
}, { deep: true }); 


const position = ref({ ...props.sticker.position });
const isDragging = ref(false);
const zIndex = ref(1);

// Dragging logic
let offsetX = 0;
let offsetY = 0;

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
  position.value.x = event.clientX - offsetX;
  position.value.y = event.clientY - offsetY;
};

const onMouseUp = () => {
  if (!isDragging.value) return;
  isDragging.value = false;
  zIndex.value = 1;
  
  emit('update-position', { id: props.sticker.id, position: position.value });

  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
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
}));

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
});
</script>

<template>
  <div
    ref="elementRef"
    :class="stickerClasses"
    :style="stickerStyle"
    @mousedown="onMouseDown"
  >
    <template v-if="sticker.type === 'note'">
      {{ sticker.content }}
    </template>

    <template v-if="sticker.type === 'imageNote'">
      <img :src="sticker.content" :alt="sticker.options.imageDescription" :style="{ width: sticker.options.imageWidth, height: sticker.options.imageHeight || 'auto' }">
      <p v-if="sticker.options.imageDescription">{{ sticker.options.imageDescription }}</p>
    </template>

    <template v-if="sticker.type === 'imageSticker'">
      <img :src="sticker.content" :style="{ width: sticker.options.imageWidth, height: sticker.options.imageHeight || 'auto' }">
    </template>
    
    <template v-if="sticker.type === 'timeNote'">
        <div class="mark-time">{{ currentTime }}</div>
        <div class="mark-date">{{ currentDate }}</div>
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
}

.sticker:active {
    cursor: grabbing;
}

.note {
  width: 250px;
  min-height: 150px;
  line-height: 1.5;
  white-space: pre-wrap; /* Preserve line breaks from textareas */
}

.imageNote {
  line-height: 1.5;
}
.imageNote p {
  font-size: 13px;
  text-align: center;
  margin-top: 10px;
  color: rgba(0,0,0,0.6);
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