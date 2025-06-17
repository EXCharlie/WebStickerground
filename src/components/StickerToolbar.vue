
<script setup>
import { ref } from 'vue';
import AddStickerModal from './AddStickerModal.vue';
import SettingsModal from './SettingsModal.vue';

const showAddModal = ref(false);
const showSettingsModal = ref(false);
//默认隐藏添加按钮
const showAddButton = ref(false);

</script>

<template>
    <div class="nav">
        <button v-if="showAddButton" @click="showAddModal = true" class="nav-button">+</button>
        <button @click="showSettingsModal = true" class="nav-button">⚙️</button>
    </div>

    <AddStickerModal v-if="showAddModal" @close="showAddModal = false" />
    <SettingsModal v-if="showSettingsModal" @close="showSettingsModal = false" />
</template>

<style scoped>
.nav {
    position: fixed; /* 修改为 fixed 使其不受画布移动影响 */
    z-index: 1000;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
}

.nav-button {
    background-color: rgba(242, 242, 247, 0.7);
    backdrop-filter: blur(10px);
    border: none;
    color: rgba(0, 0, 0, 0.8);
    font-weight: 600;
    font-size: 16px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    padding: 10px 20px;
    border-radius: 12px;
    cursor: pointer;
    transition: transform 0.2s ease;
    min-width: 50px;
    text-align: center;
}

.nav-button:hover {
    transform: scale(1.05);
}
</style>
