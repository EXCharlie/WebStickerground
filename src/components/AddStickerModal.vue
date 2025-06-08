<script setup>
import { ref } from 'vue';
import { useStickers } from '../composables/useStickers';

const emit = defineEmits(['close']);
const { addSticker } = useStickers();

const type = ref('note');
const content = ref('');
const backgroundColor = ref('#ffffff');
const imageDescription = ref('');
const imageWidth = ref('200px');
const customStyleName = ref('');

const handleSubmit = () => {
  if (!content.value && (type.value === 'note' || type.value.startsWith('image'))) {
    alert('Content or Image URL is required.');
    return;
  }
  
  const newStickerData = {
    type: type.value,
    content: content.value,
    options: {
      backgroundColor: backgroundColor.value,
      imageDescription: imageDescription.value,
      imageWidth: imageWidth.value,
      customStyleName: customStyleName.value
    }
  };
  
  addSticker(newStickerData);
  emit('close');
};
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <h2>Create New Sticker</h2>
      <form @submit.prevent="handleSubmit">
        <label>Type:</label>
        <select v-model="type">
          <option value="note">Note</option>
          <option value="timeNote">Time Note</option>
          <option value="imageNote">Image Note</option>
          <option value="imageSticker">Image Sticker</option>
        </select>
        
        <label v-if="type.startsWith('image')">Image URL:</label>
        <input v-if="type.startsWith('image')" type="text" v-model="content" placeholder="e.g., /images/003.png">
        
        <label v-if="type === 'note'">Content:</label>
        <textarea v-if="type === 'note'" v-model="content" rows="4"></textarea>

        <label v-if="type === 'imageNote'">Image Description:</label>
        <input v-if="type === 'imageNote'" type="text" v-model="imageDescription">

        <label v-if="type !== 'timeNote'">Background Color:</label>
        <input type="color" v-model="backgroundColor">
        
        <div class="form-buttons">
          <button type="button" @click="emit('close')">Cancel</button>
          <button type="submit">Create</button>
        </div>
      </form>
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
}

h2 {
  margin-top: 0;
  margin-bottom: 20px;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

label {
  font-weight: 500;
}

input, select, textarea {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

button[type="submit"] {
  background-color: #007aff;
  color: white;
}
</style>