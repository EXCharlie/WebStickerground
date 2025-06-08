<script setup>
import { onMounted, computed } from 'vue';
import { useStickers } from './composables/useStickers';
import StickerItem from './components/StickerItem.vue';

import StickerToolbar from './components/StickerToolbar.vue';
const { stickers, backgroundImageUrl, pageBackgroundColor, loadStickers, updateStickerPosition } = useStickers();

const handlePositionUpdate = ({ id, position }) => {
  updateStickerPosition(id, { x: position.x, y: position.y });
};

const backgroundStyle = computed(() => ({
  backgroundColor: pageBackgroundColor.value,
  backgroundImage: backgroundImageUrl.value ? `url(${backgroundImageUrl.value})` : 'none',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
}));


onMounted(async () => {
  try {
    const response = await fetch('/stickerground.json');
    const data = await response.json();
    loadStickers(data);
  } catch (error) {
    console.error("Failed to load initial sticker data:", error);
  }
});
</script>

<template>
  <div id="stickerground" :style="backgroundStyle">
    <StickerItem
      v-for="sticker in stickers"
      :key="sticker.id"
      :sticker="sticker"
      @update-position="handlePositionUpdate"
    />
    <StickerToolbar />
  </div>
</template>

<style>
#stickerground {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden; 
}
</style>
