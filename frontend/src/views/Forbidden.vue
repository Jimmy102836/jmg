<template>
  <div class="forbidden-container">
    <div class="forbidden-content">
      <h1>403</h1>
      <h2>禁止访问</h2>
      <p>很抱歉，您没有权限访问此页面</p>
      <router-link to="/" class="back-btn">返回首页</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Forbidden'
}
</script>

<style scoped>
.forbidden-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f9f9f9;
}

.forbidden-content {
  text-align: center;
  padding: 2rem;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 6rem;
  margin: 0;
  color: #f56c6c;
}

h2 {
  font-size: 2rem;
  margin: 0.5rem 0 1rem;
  color: #606266;
}

p {
  color: #909399;
  margin-bottom: 1.5rem;
}

.back-btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #409eff;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.back-btn:hover {
  background-color: #66b1ff;
}
</style> 