## 概述

改插件用于 允许暴露一个模块（整体或者部分）给全局对象（self、window 和 global），等同于 webpack 中 `expose-loader` 插件

## 用法

vite.config.js

```js
import { vitePluginExpose } from 'vite-plugin-expose'
export default defineConfig((configEnv) => {
    plugins:[
          // 可选，默认为 'self' (同时适用于 window 和 global)
        globalObject: 'window', // 或 'window' 或 'global'

        // 要暴露的模块配置
        exposes: [
          {
            modulePath: 'dayjs', // 模块路径或名称
            globalName: 'dayjsGlobal',  // 全局名称 (可选)
          },
          // {
          //   modulePath: 'vue', // 模块路径或名称
          //   globalName: 'VueGlobal',      // 全局名称 (可选)
          // },

          {
            modulePath: 'echarts', // 模块路径或名称
            globalName: 'echartsGlobal',  // 全局名称 (可选)
          },
          // {
          //   modulePath: './src/utils/my-utils.js',
          //   globalName: 'myUtils',
          //   members: ['formatDate', 'debounce'] // 只暴露这些方法
          // }
    ]

})
```
