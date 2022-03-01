import { useStore } from "vuex";
// import {users} from "../store/index.js"
export function http(url, type, data) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      fetch(url, {
        method: type,
        body: data,
      })
        .then((response) => {
          let result = response.text();
          result.then((res) => {
            resolve(JSON.parse(res));
          });
        })
        .catch((err) => {
          reject(err);
        });
    }, 1000);
  });
}
export function getUserList() {
  //   const data = new FormData();
  //   data.append("action", "getlist");
  //   return http(process.env.VUE_APP_APIURL, "post", data);
  return new Promise(function (resolve) {
    const store = useStore();
    resolve(store.state.users.userList);
  });
}
