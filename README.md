# 宿舍管理系统 — 微信小程序

基于微信小程序 + 云开发（CloudBase）的宿舍报修管理系统。

## 项目结构

```
├── miniprogram/           # 小程序前端
│   ├── app.js             # 入口，云开发初始化
│   ├── app.json           # 全局配置 & TabBar
│   ├── app.wxss           # 全局样式
│   ├── pages/
│   │   ├── index/         # 首页
│   │   ├── repair/        # 报修申请
│   │   └── mine/          # 个人中心
│   ├── utils/
│   │   └── cloud.js       # 云函数调用封装
│   └── images/            # 图标资源
├── cloudfunctions/        # 云函数目录
├── project.config.json    # 项目配置
└── README.md
```

## 启动方式

1. 用**微信开发者工具**打开项目根目录（project.config.json 所在目录）。
2. 在 `miniprogram/app.js` 中将 `your-env-id` 替换为你的云开发环境 ID。
3. 在 `project.config.json` 中填入你的小程序 AppID。
4. 添加 TabBar 所需的 6 个图标文件到 `miniprogram/images/`（详见该目录下的 README）。
5. 点击开发者工具中的「编译」即可预览。

## 云开发

- 环境 ID 配置在 `app.js` 中。
- 云函数统一放在 `cloudfunctions/` 目录下，通过微信开发者工具右键上传部署。
- 前端调用云函数使用 `utils/cloud.js` 中的 `callFunction(name, data)` 方法。

## TabBar 页面

| 页面 | 路径 | 说明 |
|------|------|------|
| 首页 | `pages/index/index` | 欢迎页 |
| 报修 | `pages/repair/index` | 报修申请 |
| 我的 | `pages/mine/index` | 个人中心 |
