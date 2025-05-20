<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
}

body {
  padding-top: 0; /* 移除顶部内边距，由各组件自行控制与导航栏的距离 */
}

#app, .app-container {
  height: 100%;
}

* {
  box-sizing: border-box;
}
</style> 