<script setup>
import { ref, watch } from 'vue';
import { useStickers } from '../composables/useStickers';

const emit = defineEmits(['close']);
const {
  backgroundImageUrl,
  pageBackgroundColor,
  isDraggable,
  toggleDrag,
  exportStickers,
  loadStickers
} = useStickers();

const backgroundOption = ref(backgroundImageUrl.value ? 'image' : 'color');

// Watch for changes
watch(backgroundImageUrl, (newValue) => {
  if (newValue) {
    backgroundOption.value = 'image';
  }
});

watch(pageBackgroundColor, (newValue) => {
  if (newValue && !backgroundImageUrl.value) {
    backgroundOption.value = 'color';
  }
});


const clearBackground = () => {
  backgroundImageUrl.value = '';
  pageBackgroundColor.value = '#f0f0f0';
  backgroundOption.value = 'color';
};

const importFromFile = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importData = JSON.parse(event.target.result);
        loadStickers(importData);
      } catch (error) {
        alert('Import failed. Please check the file format.');
        console.error('Import Error:', error);
      }
    };
    reader.readAsText(file);
  };
  input.click();
};

const done = () => {

  if (backgroundOption.value === 'color') {
    backgroundImageUrl.value = '';
  } else if (backgroundOption.value === 'image' && !backgroundImageUrl.value) {
     pageBackgroundColor.value = '#f0f0f0';
  }
  emit('close');
}
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h2>Settings</h2>

      <div class="setting-item-group">
        <label>Background:</label>
        <div class="radio-options">
          <label>
            <input type="radio" value="image" v-model="backgroundOption"> Image URL
          </label>
          <label>
            <input type="radio" value="color" v-model="backgroundOption"> Color
          </label>
        </div>
      </div>

      <div class="setting-item" v-if="backgroundOption === 'image'">
        <label>Image URL:</label>
        <input type="text" v-model="backgroundImageUrl" placeholder="Enter image URL">
      </div>

      <div class="setting-item" v-if="backgroundOption === 'color'">
        <label>Background Color:</label>
        <input type="color" v-model="pageBackgroundColor">
      </div>

      <div class="setting-item">
        <label>Lock Stickers:</label>
        <button class="toggle-button" @click="toggleDrag">
          {{ isDraggable ? 'Unlocked 🔓' : 'Locked 🔐' }}
        </button>
      </div>

      <div class="form-buttons">
        <button @click="clearBackground">Clear Background</button>
        <button @click="importFromFile">Import</button>
        <button @click="exportStickers">Export</button>
        <button class="primary" @click="done">Done</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

.modal-content {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(15px);
  padding: 25px;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

h2 {
  margin-top: 0;
  margin-bottom: 10px;
  text-align: center;
}

.setting-item, .setting-item-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.setting-item-group {
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.radio-options {
  display: flex;
  gap: 20px;
  margin-top: 5px;
}

.radio-options label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.radio-options input[type="radio"] {
  margin-right: 5px;
}


label {
  font-weight: 500;
}

input[type="text"] {
  width: 60%;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
}
input[type="color"] {
  width: 100px;
  height: 35px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 2px;
}

.toggle-button, .form-buttons button {
  padding: 8px 15px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  background-color: #e0e0e0;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  flex-wrap: wrap; 
  gap: 10px;
}

.form-buttons button {
    flex-grow: 1; 
    min-width: 80px;
}

.form-buttons button.primary {
  background-color: #007aff;
  color: white;
}
</style>
