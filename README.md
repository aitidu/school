# 宿舍管理系统 — 微信小程序

基于微信小程序 + 云开发（CloudBase）的宿舍报修管理系统。

## 项目结构

```
├── miniprogram/                  # 小程序前端
│   ├── app.js                    # 入口，云开发初始化 & 自动登录
│   ├── app.json                  # 全局配置、页面路由、TabBar
│   ├── app.wxss                  # 全局样式（卡片、容器）
│   ├── pages/
│   │   ├── index/                # 首页
│   │   ├── repair/
│   │   │   ├── index/            # 报修提交页
│   │   │   ├── list/             # 我的报修列表
│   │   │   └── detail/           # 报修详情 & 评价
│   │   └── mine/
│   │       ├── index/            # 个人中心
│   │       ├── editProfile/      # 修改资料
│   │       └── realnameAuth/     # 实名认证
│   ├── utils/
│   │   ├── cloud.js              # 云函数调用封装
│   │   └── upload.js             # 图片上传工具
│   └── images/                   # TabBar 图标资源
├── cloudfunctions/               # 云函数
│   ├── userLogin/                # 登录 & 自动注册
│   ├── authUser/                 # 实名认证
│   ├── updateUser/               # 更新用户资料
│   ├── createRepair/             # 创建报修工单
│   ├── getMyRepairs/             # 查询本人报修列表
│   └── evaluateRepair/           # 完工评价
├── project.config.json           # 微信开发者工具配置
└── README.md
```

## 数据库集合

| 集合 | 说明 | 关键字段 |
|------|------|----------|
| `users` | 用户信息 | `_openid`, `role`, `realName`, `studentId`, `phone`, `dormitory`, `isAuth` |
| `repairs` | 报修工单 | `_openid`, `type`, `description`, `images`, `status`, `worker`, `evaluation`, `createTime` |

### repairs 状态流转

```
pending → assigned → in_progress → completed → archived
                                          ↓ (学生评价后)
```

## 启动方式

1. 用**微信开发者工具**打开项目根目录（`project.config.json` 所在目录）。
2. 在 `miniprogram/app.js` 中将 `your-env-id` 替换为你的云开发环境 ID。
3. 在 `project.config.json` 中填入你的小程序 AppID。
4. 添加 TabBar 所需的 6 个图标文件到 `miniprogram/images/`。
5. 在微信开发者工具中右键每个云函数目录，选择「上传并部署」。
6. 点击「编译」即可预览。

## TabBar 页面

| 页面 | 路径 | 说明 |
|------|------|------|
| 首页 | `pages/index/index` | 欢迎页 |
| 报修 | `pages/repair/index` | 报修申请 |
| 我的 | `pages/mine/index` | 个人中心 |

## 报修功能

1. **提交报修** — 选择类型（水电/门窗/网络/其他）、填写描述、上传图片（可选，最多 9 张），提交后生成工单。
2. **我的报修** — 查看所有报修记录，按时间倒序排列，状态标签区分颜色。
3. **工单详情** — 查看完整信息，待处理/已指派/处理中可催单，已完成可星评并提交评价。
