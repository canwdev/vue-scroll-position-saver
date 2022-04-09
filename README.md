# ScrollPositionSaver

保存滚动位置的JS类，可记住滚动的top和left，保存在 localStorage，重新加载组件时还原。

![img](./preview.png)

使用方式：

```js
import {ScrollPositionSaver} from '@/utils/scroll-position-saver'
export default {
  mounted() {
    this.sps = new ScrollPositionSaver({
      name: 'demo',
      debug: true,
    })
  },
  beforeDestroy() {
    this.sps && this.sps.destroy()
  }
};
```

默认配置：

```js
const {
  targetEl = window, // 执行滚动监听的dom元素，默认window
  name = 'default', // 保存 localStorage 的标识符名称后缀
  timeout = -1, // 超时自动清除滚动进度（毫秒），传入-1关闭
  debug = false, // 是否开启调试日志
  autoRestore = 0, // 是否开启自动恢复，默认在实例化0毫秒后恢复，传入-1关闭
  refreshOnly = false, // 是否只在刷新之后恢复，切换页面或关闭页面重新载入不恢复
  debounceInterval = 300, // 滚动监听防抖间隔时间（毫秒）
} = options
```

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
