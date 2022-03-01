<template>
  <LuckDraw />
</template>
<script>
import LuckDraw from "./components/LuckDraw.vue";
export default {
  name: "App",
  components: {
    LuckDraw,
  },
};
</script>

<style lang="less">
@font-face {
  font-family: "Poppins-Bold";
  src: url("./assets/Poppins-Bold.ttf") format("truetype");
}
html {
  height: 100%;
}
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  border: none;
  background: black;
  background-image: url(assets/bg.jpg);
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100% 100%;
  font-family: "Poppins-Bold";
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: relative;
  height: 100%;
  overflow: hidden;
}
</style>
