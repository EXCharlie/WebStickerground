<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['close']);
</script>

<template>

  <div class="modal-overlay">
    <div class="modal-content welcome-modal">
      <h2>Welcome to Messagesground! 👋</h2>
      <p>Some people say that the holiday during the college entrance examination is the last dinner（最后的晚餐） for senior high
        school sophomores. Share your thoughts.</p>
      <div class="feature-list">
        <div>👂 We listen,We don't judge.</div>
        <div>🌿 Keep harmonious words.</div>
        <div>📖 Leave some thoughts for our high school life.</div>
        <div>🌟 Share experience for school life.</div>
      </div>
      <button class="primary" @click="emit('close')">Got it!</button>
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
  background-color: rgba(0, 0, 0, 0.6);
  /* Slightly darker overlay for welcome */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1002;
  /* Higher z-index than settings modal */
}

.modal-content {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  padding: 30px;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: center;
}

h2 {
  color: #333;
  margin-bottom: 15px;
}

p {
  color: #555;
  line-height: 1.6;
}

.feature-list {
  text-align: left;
  margin-top: 10px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 0.95em;
  color: #666;
  font-weight: bold;
}

.feature-list div {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 10px 15px;
  border-radius: 10px;
}

button.primary {
  background-color: #007aff;
  color: white;
  padding: 12px 25px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  font-size: 1.1em;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

button.primary:hover {
  background-color: #005bb5;
  transform: translateY(-2px);
}
</style>