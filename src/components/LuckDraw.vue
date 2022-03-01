<template>
  <div class="main fc">
    <!-- 左侧抽奖信息菜单 -->
    <div class="menuList">
      <ul class="menu fc">
        <li
          v-for="item in levelInfo"
          v-bind:key="item.id"
          @click="changeLevel(item)"
          :class="currentLevel == item.id ? 'current' : ''"
        >
          <div class="tip fc">{{ item.name }}</div>
          <div class="id fc">{{ item.id + 1 }}</div>
        </li>
      </ul>
    </div>
    <!-- 右侧具体抽奖信息 -->
    <div class="mainContent">
      <div class="logo"><img src="../assets/logo.svg" /></div>
      <div class="container fc">
        <div class="rewardInfo">
          <!-- 奖品信息 -->
          <div>
            <div class="title">{{ levelInfo[currentLevel].typeTitle }}</div>
            <div class="img">
              <img
                :class="'img' + levelInfo[currentLevel].id"
                :src="require('../assets/' + levelInfo[currentLevel].img)"
              />
            </div>
            <div class="desc">
              {{ levelInfo[currentLevel].content }}
            </div>
          </div>
          <!-- 抽奖按钮 -->
          <div
            v-if="levelInfo[currentLevel].btnshow"
            class="startBtn fc"
            @click="debouncedStartClick"
            v-btnclick
          >
            抽奖
          </div>
          <div v-else class="noneClick fc">抽奖</div>
        </div>
        <!-- 中奖人信息 -->
        <div class="drawContent">
          <!-- loading 异步组件 -->
          <Suspense>
            <template #default>
              <keep-alive>
                <UserList
                  v-for="item in levelInfo"
                  v-bind:key="item.id"
                  :level="item"
                  v-show="item.id == currentLevel"
                  :iscurrent="item.id == currentLevel"
                  :ani="levelInfo[currentLevel].luckusers"
                  v-model:user-count="userCount"
                  @aniend="aniend"
                  @cancelLuckUser="cancelLuckUser"
                />
              </keep-alive>
            </template>
            <template #fallback>
              <div>Loading...</div>
            </template>
          </Suspense>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineAsyncComponent, onMounted, onUnmounted, ref } from "vue";
import { useStore } from "vuex";
import _ from "lodash";
export default {
  name: "LuckDraw",
  props: {
    msg: String,
  },
  components: {
    UserList: defineAsyncComponent({
      timeout: 3000,
      loader: () => import("./UserList.vue"),
    }),
  },
  setup() {
    // 用户总数
    let userCount = ref(0);
    // 当前几等奖
    let currentLevel = ref(9);
    // vuex
    const store = useStore();
    // 奖品信息
    let levelInfo = store.state.prize.prizeInfo;
    // 开始抽奖，通过操作奖品信息中中奖人信息，传递给子组件
    const startFun = function () {
      if (
        userCount.value &&
        levelInfo[currentLevel.value].luckusers.length <
          levelInfo[currentLevel.value].num
      ) {
        // 过滤出所有未中奖用户
        const noneLuckUsers = store.state.users.userList.filter((item) => {
          return !item.isused;
        });
        const luckUser =
          noneLuckUsers[Math.floor(Math.random() * noneLuckUsers.length)];
        // 给子组件传递动画位置,更新vuex时自动更新了levelinfo子组件watch了
        luckUser.updateTime = new Date();
        localStorage.setItem(
          levelInfo[currentLevel.value].name + "-add-" + luckUser.id,
          JSON.stringify(luckUser)
        );
        store
          .dispatch("RECORD_LUCK_USER", {
            type: "add",
            currentLevel: currentLevel.value,
            id: luckUser.id,
          })
          .then(() => {
            store
              .dispatch("CHANGE_USED", {
                id: luckUser.id,
                boo: true,
                award: currentLevel.value,
              })
              .then(() => {
                console.log("add done");
              });
          });
      }
    };
    // 使用 Lodash 实现防抖，开始抽奖方法
    const debouncedStartClick = _.debounce(startFun, 200);
    onUnmounted(() => {
      // 移除组件时，取消定时器
      debouncedStartClick.cancel();
    });
    onMounted(() => {
      userCount.value = store.state.users.userList.length;
    });
    // 抽奖滚动动画结束
    const aniend = function () {};
    // 切换奖品信息
    const changeLevel = function (e) {
      currentLevel.value = e.id;
    };
    // 取消中奖人
    const cancelLuckUser = function (e) {
      // 取消重新抽取幸运用户
      e.updateTime = new Date();
      localStorage.setItem(
        levelInfo[currentLevel.value].name + "-remove-" + e.id,
        JSON.stringify(e)
      );
      store
        .dispatch("RECORD_LUCK_USER", {
          type: "del",
          currentLevel: currentLevel.value,
          id: e.id,
        })
        .then(() => {
          store
            .dispatch("CHANGE_USED", {
              id: e.id,
              boo: true,
              award: "cancel",
            })
            .then(() => {
              console.log("del done");
            });
        });
    };
    return {
      aniend,
      changeLevel,
      cancelLuckUser,
      currentLevel,
      userCount,
      levelInfo,
      debouncedStartClick,
    };
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.fc {
  display: flex;
  align-items: center;
  justify-content: center;
}
div {
  font-size: 1em;
}
.main {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100vw;
  height: 50vw;
  .menuList {
    position: absolute;
    width: 50px;
    left: 30px;
    z-index: 10;

    .menu {
      width: 100%;
      margin-top: 100px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      margin: 0;
      padding: 0;
      .current {
        color: #666666;
      }
      li {
        cursor: pointer;
        background-color: #121212;
        color: #393939;
        width: 50px;
        height: 40px;
        list-style: none;
        display: flex;
        align-content: center;
        justify-content: center;
        border-radius: 5px;
        .tip {
          width: 50%;
          height: 100%;
          font-size: 16px;
          transform: scale(0.5);
          position: relative;
          line-height: 1;
          vertical-align: middle;
        }
        .id {
          width: 50%;
          height: 100%;
          position: relative;

          vertical-align: middle;
        }
      }
      li:nth-child(1n + 2) {
        margin-top: 8px;
      }
    }
  }
  .mainContent {
    width: 80%;
    position: relative;
    height: 100%;
    .logo {
      position: absolute;
      top: 5%;
      left: 50%;
      width: 16vw;
      transform: translateX(-50%);
      img {
        width: 100%;
      }
    }
    .container {
      height: 100%;
      padding-top: 2%;
      justify-content: flex-start;
      .rewardInfo {
        width: 50%;
        .title {
          font-size: 3.5em;
          font-weight: 900;
          color: #fa4238;
          padding-left: 0.3em;
          letter-spacing: 0.3em;
          text-align: center;
        }
        .desc {
          color: white;
          margin-bottom: 4%;
          font-size: 2em;
        }
        .img {
          margin-top: 2%;
          margin-bottom: 2%;
          .img0,
          .img1 {
            height: 100px;
            margin-top: 30px;
            // margin-bottom: 50px;
          }
          .img3 {
            height: 150px;
            margin-top: 25px;
            margin-bottom: 25px;
          }
          .img8,
          .img2,
          .img6,
          .img5,
          .img7,
          .img4,
          .img9 {
            height: 200px;
          }
        }
        .startBtn {
          width: 150px;
          height: 50px;
          // background-color: #fa4238;
          color: white;
          margin: 0 auto;
          cursor: pointer;
          border-radius: 20px;
          font-size: 1.5em;
          line-height: 1;
          border: 1px solid #fa4238;
        }
        .noneClick {
          width: 150px;
          height: 50px;
          color: #555555;
          margin: 0 auto;
          border-radius: 20px;
          font-size: 1.5em;
          line-height: 1;
          border: 1px solid #555555;
        }
      }
      .drawContent {
        width: 45%;
        padding-left: 5%;
      }
    }
  }
}
</style>
