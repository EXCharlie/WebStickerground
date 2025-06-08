module.exports = {
  root: true,
  env: {
    node: true,
    'vue/setup-compiler-macros': true // **这行是关键**
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    // 'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 'vue/multi-word-component-names': 'off' // 如果你不想改组件名，可以关闭此规则，但不推荐
  }
};