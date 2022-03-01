<template>
  <div>
    <div>
      <div class="windowParent">
        <ul
          v-for="(i, index) in level.num"
          :class="[
            'window',
            'movePos',
            level.num <= 3 ? 'full' : '',
            ani[index] ? 'selected' : '',
          ]"
          v-bind:key="'ul' + i.id"
          @animationend="aniendfun"
        >
          <li
            :class="['item', 'fc', level.num > 1 ? 'normal' : 'big']"
            v-for="(item, inx) in users.value"
            v-bind:key="'t' + item.id"
            :style="{
              animationName: inx == 0 ? 'ani' + ani[index] : '',
            }"
          >
            {{ inx == 0 ? "等待揭晓" : item.name }}
          </li>
          <li
            v-for="item in users.value"
            v-bind:key="item.id"
            :class="[
              'item',
              'fc',
              ani[index] == item.id ? 'current' : 'id' + item.id,
              level.num > 1 ? 'normal' : 'big',
            ]"
          >
            {{ item.name }}
            <div
              class="cancelBtn"
              v-if="ani[index] == item.id"
              @click="$emit('cancelLuckUser', item)"
            >
              取消
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { getUserList } from "../api/http.js";
import { reactive, watchEffect, ref } from "vue";
export default {
  name: "UserList",
  props: {
    ani: Array,
    level: Object,
    iscurrent: Boolean,
  },
  emits: ["update:userCount", "aniend", "cancelLuckUser"],
  async setup(props, context) {
    const users = reactive([]);
    let aniTime = ref(1);
    let lineH = 90;
    // 监听奖品信息中中奖人信息，来判断是否播放动画
    watchEffect(() => {
      if (props.iscurrent && props.ani && users.value) {
        props.ani.map((item) => {
          const itemIndex = users.value.findIndex((list) => list.id == item);
          if (itemIndex != -1) {
            // css 中增加对应的 css 动画样式
            document.styleSheets[0].insertRule(
              "@keyframes ani" +
                item +
                "" +
                "{" +
                "100%{margin-top: " +
                -(itemIndex + users.value.length) * lineH +
                "px;}" +
                "}"
            );
          }
        });
      }
    });
    // await 异步初始化，传递给父组件 Suspense 使用
    let newres = await getUserList();
    users.value = newres.sort(function () {
      return 0.5 - Math.random();
    });
    const aniendfun = function () {
      context.emit("aniend");
      // 判断当前页面是否抽奖结束了
      if (props.ani.length == props.level.num) {
        // 发完了，动画停止
        aniTime.value = 0;
      } else {
        aniTime.value = 1;
      }
    };
    if (props.level.num < 2) {
      lineH = 150;
    } else if (props.level.num <= 3) {
      lineH = 120;
    }
    return { users, aniTime, aniendfun, lineH };
  },
};
</script>
<style scope lang="less">
@ani: v-bind(ani);
@at: v-bind(aniTime);
@lineH: v-bind(lineH);
.fc {
  display: flex;
  align-items: center;
  justify-content: center;
}
ul {
  margin: 0;
  padding: 0;
}
.windowParent {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-content: center;
}
.window {
  width: 49%;
  height: calc(1px * @lineH);
  overflow: hidden;

  .item {
    height: calc(1px * @lineH);
    color: white;
    position: relative;
    font-weight: 900;
  }
  .cancelBtn {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 14px;
    cursor: pointer;
    opacity: 0.8;
  }
  .normal {
    font-size: 2em;
  }
  .big {
    font-size: 3em;
  }
}
@keyframes ani {
  100% {
    margin-top: calc(-100px * @ani);
  }
}
@keyframes aniundefined {
  100% {
    margin-top: 0;
  }
}
.selected li:first-child {
  // animation-name: ani;
  animation-duration: calc(1.5s * @at); //calc(0.1s * @at);
  animation-timing-function: ease-in-out;
  animation-fill-mode: forwards;
}
.current {
  font-weight: bold;
}
.full {
  width: 100%;
}
</style>
