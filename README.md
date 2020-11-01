### 遇见问题在 develop 环境请不要使用 extrass-css 插件无法热更新 css
### mode production js 自动压缩，但是 css 使用压缩插件处理之后，js 就无法在该模式下被压缩，所以使用 uglify 插件才能都压缩。
### webpack 打包 umd 模式需要在一个一个文件导出所有，否则居然是 undefined ，需要研究一下
### 本次 lib es 打包使用的是样式和图片原样输出使用的是only use babel，然后根据 module 是false 为 es 否则就是 cjs
### 使用命令如下 gulp + webpack 其实我感觉这个 gulp 用得很牵强--

### 执行开发验证卡片

```
npm run card
```

### 执行获得 es
```
npm run es
```

### 执行获得 lib
```
npm run lib
```


### 执行获得 dist
```
npm run dist
```

### 执行 eslint 校验文件
```
npm run eslint
```
### 执行 deploy 打包文件上传到 github
```
npm run deploy
```