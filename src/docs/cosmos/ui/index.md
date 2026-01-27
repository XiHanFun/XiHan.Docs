# UI 组件库

## 概述

**XiHan.UI** 是一个基于 Vue 3 的企业级组件库，采用 TypeScript 编写，提供 58+ 个高质量组件，帮助您快速构建美观、易用的前端应用。

## 核心特性

### 丰富的组件

提供 58+ 个企业级组件，涵盖常见业务场景：

- **基础组件** - Button、Icon、Divider、Space 等
- **导航组件** - Menu、Tabs、Breadcrumb、Pagination 等
- **数据录入** - Input、Select、Form、Upload 等
- **数据展示** - Table、Card、Tree、Timeline 等
- **反馈组件** - Message、Notification、Modal、Drawer 等

### 主题系统

灵活强大的主题定制能力：

- 基于 CSS Variables 实现
- 支持明暗主题切换
- 跟随系统主题
- 运行时动态切换
- 主题持久化
- 自定义主题颜色

### TypeScript 支持

完整的 TypeScript 类型定义：

- 类型安全的 API
- 优秀的 IDE 智能提示
- Props 类型检查
- Events 类型推断

### Composition API

基于 Vue 3 Composition API：

- 提供 30+ 实用 Hooks
- 更好的逻辑复用
- 更好的类型推断
- 更灵活的代码组织

### 国际化

内置国际化支持：

- 支持中文、英文
- 组件文案国际化
- 与 Vue I18n 集成
- 易于扩展新语言

### 高性能

性能优化：

- 按需加载
- Tree Shaking
- 虚拟滚动
- 懒加载
- 防抖节流

## 技术架构

### Monorepo 架构

采用 Turborepo + pnpm workspace 的 Monorepo 架构：

```
XiHan.UI/
├── packages/
│   ├── components        # 组件库核心
│   ├── themes            # 主题系统
│   ├── utils             # 工具函数
│   ├── hooks             # Composition API Hooks
│   ├── icons             # 图标库
│   ├── locales           # 国际化
│   ├── directives        # Vue 指令
│   ├── plugins           # 插件系统
│   └── constants         # 常量定义
└── playground/           # 开发演示环境
```

### 技术栈

- **Vue 3.5** - 核心框架
- **TypeScript 5.8** - 类型系统
- **Vite** - 构建工具
- **pnpm** - 包管理器
- **Unbuild** - 打包工具
- **Vitest** - 测试框架

## 组件分类

### 基础组件（6 个）

#### Button 按钮
多种类型、尺寸和状态的按钮组件：
- 支持类型：primary、default、dashed、text、link
- 支持尺寸：large、middle、small
- 支持形状：default、round、circle
- 支持状态：loading、disabled
- 内置涟漪效果

#### Icon 图标
图标组件和图标库：
- 支持多个图标包
- 动态注册图标
- SVG 优化
- 完整类型定义

#### Divider 分割线
内容分割组件：
- 水平和垂直分割
- 文字分割线
- 虚线样式

#### Space 间距
设置组件间距：
- 水平和垂直间距
- 自动换行
- 对齐方式

#### Row / Col 栅格
响应式栅格布局：
- 24 栅格系统
- 响应式断点
- Flex 布局
- 间距设置

#### ButtonGroup 按钮组
按钮组合组件：
- 统一样式
- 紧凑布局

### 导航组件（6 个）

#### Menu 菜单
导航菜单组件：
- 多级菜单
- 水平和垂直布局
- 展开折叠
- 菜单分组

#### Tabs 标签页
标签页切换组件：
- 多种样式
- 可编辑标签页
- 拖拽排序
- 滚动标签

#### Breadcrumb 面包屑
显示当前页面路径：
- 自定义分隔符
- 路由集成
- 下拉菜单

#### Pagination 分页
数据分页组件：
- 多种布局
- 快速跳转
- 页码显示控制
- 每页数量选择

#### Steps 步骤条
引导用户完成流程：
- 水平和垂直布局
- 多种状态
- 自定义图标

#### Anchor 锚点
锚点导航组件：
- 自动高亮
- 平滑滚动
- 固定位置

### 数据录入（13 个）

#### Input 输入框
文本输入组件：
- 多种尺寸
- 前后缀
- 密码输入
- 文本域
- 字数统计

#### InputNumber 数字输入框
数字输入组件：
- 步进器
- 精度控制
- 最大最小值
- 格式化

#### Select 选择器
下拉选择组件：
- 单选和多选
- 搜索过滤
- 分组
- 远程搜索
- 虚拟滚动

#### Cascader 级联选择
级联选择组件：
- 多级联动
- 懒加载
- 搜索
- 多选

#### DatePicker 日期选择
日期选择组件：
- 日期、月份、年份
- 范围选择
- 快捷选择
- 禁用日期

#### TimePicker 时间选择
时间选择组件：
- 时分秒选择
- 范围选择
- 12/24 小时制

#### Checkbox 多选框
多选组件：
- 单个复选框
- 复选框组
- 全选功能

#### Radio 单选框
单选组件：
- 单个单选框
- 单选框组
- 按钮样式

#### Switch 开关
开关切换组件：
- 多种尺寸
- 自定义文字
- 加载状态

#### Slider 滑块
滑块输入组件：
- 范围滑块
- 刻度显示
- 垂直模式

#### Rate 评分
评分组件：
- 半星评分
- 自定义图标
- 只读模式

#### Upload 上传
文件上传组件：
- 多种上传方式
- 拖拽上传
- 文件列表
- 预览
- 进度显示

#### ColorPicker 颜色选择
颜色选择组件：
- 多种颜色模式
- 色板
- 透明度
- 预设颜色

#### Form 表单
表单管理组件：
- 表单验证
- 表单布局
- 动态表单
- 联动校验

### 数据展示（17 个）

#### Table 表格
数据表格组件：
- 排序、筛选
- 固定列
- 展开行
- 树形数据
- 虚拟滚动
- 编辑单元格

#### Card 卡片
卡片容器组件：
- 标题和操作
- 栅格卡片
- 加载状态

#### Tree 树形控件
树形数据展示：
- 展开折叠
- 复选框
- 拖拽排序
- 懒加载
- 搜索过滤

#### TreeSelect 树选择
树形选择组件：
- 树形下拉
- 多选
- 搜索

#### Timeline 时间轴
时间轴展示：
- 垂直和水平
- 自定义节点
- 颜色标识

#### Tag 标签
标签展示组件：
- 多种颜色
- 可关闭
- 动态编辑

#### Avatar 头像
头像展示组件：
- 图片头像
- 文字头像
- 图标头像
- 头像组

#### Image 图片
图片展示组件：
- 懒加载
- 预览
- 错误处理
- 占位图

#### Carousel 走马灯
轮播图组件：
- 自动播放
- 多种切换效果
- 指示器

#### Collapse 折叠面板
折叠面板组件：
- 手风琴模式
- 自定义标题
- 嵌套面板

#### Descriptions 描述列表
描述列表组件：
- 多列布局
- 响应式
- 边框样式

#### Empty 空状态
空状态展示：
- 自定义图片
- 自定义描述

#### Progress 进度条
进度展示组件：
- 线形进度条
- 环形进度条
- 仪表盘

#### Result 结果页
结果页面组件：
- 成功、失败、警告
- 自定义图标

#### Skeleton 骨架屏
骨架屏加载：
- 多种形状
- 动画效果

#### Statistic 统计数值
统计数值展示：
- 数字动画
- 倒计时
- 前后缀

#### Calendar 日历
日历展示组件：
- 月历、年历
- 事件标记
- 自定义内容

#### Segmented 分段控制器
分段选择器：
- 多个选项切换
- 自定义内容

### 反馈组件（8 个）

#### Message 全局提示
全局消息提示：
- 成功、错误、警告、信息
- 自动关闭
- 可关闭

#### Notification 通知提醒框
通知提醒组件：
- 多种类型
- 位置可选
- 自定义内容

#### Modal 对话框
模态对话框：
- 确认对话框
- 信息对话框
- 自定义内容
- 拖拽

#### Drawer 抽屉
抽屉组件：
- 四个方向
- 多层抽屉

#### Alert 警告提示
警告提示组件：
- 四种类型
- 可关闭
- 图标

#### Popconfirm 气泡确认框
气泡确认框：
- 确认操作
- 自定义内容

#### Popover 气泡卡片
气泡卡片组件：
- 自定义内容
- 触发方式
- 位置控制

#### Tooltip 文字提示
文字提示组件：
- 多种触发方式
- 位置控制
- 自定义样式

#### Tour 漫游式引导
用户引导组件：
- 步骤引导
- 高亮目标
- 自定义内容

### 布局组件（4 个）

#### Affix 固钉
固定定位组件：
- 固定在顶部或底部
- 滚动监听

#### BackTop 回到顶部
返回顶部组件：
- 平滑滚动
- 自定义触发距离

#### Dropdown 下拉菜单
下拉菜单组件：
- 多种触发方式
- 嵌套菜单

### 其他组件（4 个）

#### ConfigProvider 全局配置
全局配置组件：
- 主题配置
- 国际化配置
- 组件默认值

#### Watermark 水印
水印组件：
- 文字水印
- 图片水印
- 防删除

#### Transfer 穿梭框
数据穿梭组件：
- 左右穿梭
- 搜索过滤

#### DiffChecker 差异对比
代码差异对比：
- 代码对比
- 高亮差异

## 主题系统

### CSS Variables

使用 CSS 变量实现主题：

- 运行时切换
- 无需重新编译
- 支持局部覆盖
- 性能优秀

### 明暗主题

内置明暗主题：

- Light 主题
- Dark 主题
- 跟随系统
- 自动切换

### 自定义主题

轻松自定义主题：

- 修改主题色
- 调整圆角
- 修改字体
- 调整间距

### 主题管理器

主题管理功能：

- 主题注册
- 主题切换
- 主题持久化
- 主题回调

## Hooks 系统

### 状态管理

- `useStorage` - 存储管理
- `useAsync` - 异步状态
- `useCounter` - 计数器
- `useLocalState` - 本地状态
- `useSessionState` - 会话状态

### 事件相关

- `useClickOutside` - 点击外部
- `useEventBus` - 事件总线

### 性能优化

- `useDebounce` - 防抖
- `useThrottle` - 节流

### 生命周期

- `useInterval` - 定时器
- `useTimeout` - 延时器

### 响应式

- `useWindowSize` - 窗口尺寸
- `useNetwork` - 网络状态
- `useResizeObserver` - 尺寸监听

### SSR 相关

- `useSSR` - SSR 判断
- `useHydration` - 水合状态
- `useClientOnly` - 仅客户端
- `useDeferredHydration` - 延迟水合
- `useProgressiveHydration` - 渐进式水合

### 组件相关

- `useComponent` - 组件管理
- `useTeleport` - 传送
- `useModal` - 模态框
- `usePopover` - 气泡框

### 主题相关

- `useTheme` - 主题管理

## 工具函数

### 浏览器工具

- Cookie 操作
- Credentials 凭证
- Fullscreen 全屏
- History 历史
- IndexedDB 数据库
- Storage 存储

### 核心工具

- Array 数组处理
- Date 日期处理
- String 字符串处理
- Number 数字处理
- Object 对象处理

### 数据处理

- CSV 处理
- Formatter 格式化
- Transform 转换
- XLSX Excel 处理

### DOM 工具

- Color 颜色处理
- Element 元素操作

### 文件工具

- File 文件处理
- Image 图片处理
- Video 视频处理
- Audio 音频处理
- Compression 压缩
- Zip 打包

### 性能优化

- Lazy 懒加载
- Memoize 缓存
- Metrics 指标
- Throttle 节流

### 安全工具

- Crypto 加密
- Mask 脱敏
- Token 令牌
- Validate 验证
- XSS 防护

## 指令系统

### 内置指令

- `v-click-outside` - 点击外部触发
- `v-copy` - 复制到剪贴板
- `v-debounce` - 防抖
- `v-focus` - 自动聚焦
- `v-loading` - 加载状态
- `v-resize` - 尺寸变化监听

## 安装使用

### 安装

通过 npm、yarn 或 pnpm 安装：

```bash
# npm
npm install xihan-ui

# yarn  
yarn add xihan-ui

# pnpm
pnpm add xihan-ui
```

### 完整引入

在 main.ts 中完整引入：

```typescript
import { createApp } from 'vue'
import XiHanUI from 'xihan-ui'
import 'xihan-ui/dist/style.css'

const app = createApp(App)
app.use(XiHanUI)
```

### 按需引入

推荐使用按需引入，减小打包体积：

```typescript
import { Button, Input, Table } from 'xihan-ui'
```

## 配置

### 全局配置

使用 ConfigProvider 进行全局配置：

```typescript
// 配置主题
// 配置国际化
// 配置组件默认值
```

### 主题配置

配置主题色和样式：

```typescript
// 设置主题色
// 切换明暗主题
// 自定义主题变量
```

## 最佳实践

### 按需加载

- 使用 Tree Shaking
- 按需引入组件
- 动态导入

### 性能优化

- 使用虚拟滚动
- 启用懒加载
- 使用防抖节流

### 主题定制

- 使用 CSS Variables
- 创建自定义主题
- 主题切换优化

### TypeScript

- 利用类型定义
- 组件 Props 类型
- 事件类型

## 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 更多资源

- [组件演示](https://ui.xihanfun.com)
- [Playground](https://play.xihanfun.com)
- [GitHub 仓库](https://github.com/XiHanFun/XiHan.UI)
