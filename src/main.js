import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
const main = createApp(App);

// 注册一个全局自定义指令 `v-btnclick`
main.directive("btnclick", {
  mounted(el) {
    el.onmousedown = () => {
      el.style.opacity = 0.5;
    };
    el.onmouseup = () => {
      el.style.opacity = 1;
    };
  },
});
main.use(store).mount("#app");
