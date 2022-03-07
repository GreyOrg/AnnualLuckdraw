# Annual Luck Draw
> Using vuex and CSS3 animation to realize lucky draw
## Screen preview

![Image text](/src/assets/preview.gif)





## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```



### User data structure
```
  {
    id: 1,
    name: "Li Yi",
    isused: "",
    award: "",
  }
```
### Lottery information data structure
  ```
  {
    id: 0,
    num: 1,
    name: "Prize name",
    typeTitle: "Prize type",
    img: "Prize information.png",
    content: "Number of people",
    luckusers: [],
    btnshow: true,
  }
```
### Directory structure
```
  '|-- 2022年会抽奖',
  '    |-- package.json',
  '    |-- vue.config.js',
  '    |-- src',
  '        |-- App.vue',
  '        |-- main.js',
  '        |-- api',
  '        |   |-- http.js',
  '        |-- assets',
  '        |   |-- 5000元.svg',
  '        |   |-- 8888元.svg',
  '        |-- components',
  '        |   |-- LuckDraw.vue',
  '        |   |-- UserList.vue',
  '        |-- store',
  '            |-- index.js',
  '            |-- prizeinfo.js',
  '            |-- users.js',
  ''
```
