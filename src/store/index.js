import { createStore } from "vuex";
import { userList } from "./users.js";
import { prizeInfo } from "./prizeinfo.js";
const users = {
  state: () => ({
    userList,
  }),
  mutations: {
    changeUsed(state, params) {
      state.userList.forEach((element) => {
        if (element.id == params.id) {
          element.isused = params.boo;
          element.award = params.award;
        }
      });
    },
  },
  actions: {
    // 在用户表中，修改用户信息列表是否已经中过奖
    CHANGE_USED(context, params) {
      context.commit("changeUsed", params);
    },
  },
};
const prize = {
  state: () => ({
    prizeInfo,
  }),
  mutations: {
    // 添加中奖用户
    addLuckUser(state, params) {
      if (
        state.prizeInfo[params.currentLevel].luckusers.indexOf(params.id) == -1
      ) {
        state.prizeInfo[params.currentLevel].luckusers.push(params.id);
      }
      if (
        state.prizeInfo[params.currentLevel].num <=
        state.prizeInfo[params.currentLevel].luckusers.length
      ) {
        // 不显示
        state.prizeInfo[params.currentLevel].btnshow = false;
      } else {
        state.prizeInfo[params.currentLevel].btnshow = true;
      }
    },
    // 删除中奖用户
    delLuckUser(state, params) {
      const pos = state.prizeInfo[params.currentLevel].luckusers.indexOf(
        params.id
      );

      if (pos != -1) {
        state.prizeInfo[params.currentLevel].luckusers.splice(pos, 1);
        console.log(state.prizeInfo[params.currentLevel].luckusers);
      }
      if (
        state.prizeInfo[params.currentLevel].num <=
        state.prizeInfo[params.currentLevel].luckusers.length
      ) {
        // 不显示
        state.prizeInfo[params.currentLevel].btnshow = false;
      } else {
        state.prizeInfo[params.currentLevel].btnshow = true;
      }
    },
  },
  actions: {
    // 在奖品信息表中，记录 or 删除中奖用户
    RECORD_LUCK_USER(context, params) {
      if (params.type == "add") {
        context.commit("addLuckUser", params);
      } else {
        context.commit("delLuckUser", params);
      }
    },
  },
};

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    users,
    prize,
  },
});
