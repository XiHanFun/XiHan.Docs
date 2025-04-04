---
title: npm 包依赖关系
index: false
prev:
  text: "目录"
  link: "./index"
next:
  text: "npm 关系"
  link: "./npm-package"
---

# 依赖关系

## 1. utils/ (最底层，被所有模块依赖)

```
utils/
├── types/      // TypeScript 类型定义
├── dom/        // DOM 操作工具
├── vue/        // Vue 相关工具
└── common/     // 通用工具函数

依赖关系：无外部依赖
被依赖：被所有其他模块依赖
```

## 2. constants/ (基础常量，几乎被所有模块依赖)

```
constants/
├── tokens.ts   // 注入令牌
├── events.ts   // 事件常量
└── props.ts    // 公共Props定义

依赖关系：
- 依赖 utils/types
被依赖：被大多数模块依赖
```

## 3. themes/ (主题系统，依赖基础设施)

```
themes/
├── default/    // 默认主题
├── tokens/     // 设计标记
└── dark/       // 暗黑主题

依赖关系：
- 依赖 utils/
- 依赖 constants/
被依赖：
- 被 components/ 依赖
- 被 plugins/theme 依赖
```

## 4. hooks/ (组合式函数，依赖多个基础模块)

```
hooks/
├── useNamespace/  // BEM命名空间
├── useConfig/     // 全局配置
├── useTheme/      // 主题钩子
└── useLocale/     // 国际化钩子

依赖关系：
- 依赖 utils/
- 依赖 constants/
- 依赖 themes/ (useTheme)
- 依赖 locales/ (useLocale)
被依赖：
- 被 components/ 依赖
- 被 plugins/ 依赖
```

## 5. locales/ (国际化资源)

```
locales/
├── zh-CN/     // 中文语言包
└── en-US/     // 英文语言包

依赖关系：
- 依赖 utils/
- 依赖 constants/
被依赖：
- 被 hooks/useLocale 依赖
- 被 plugins/locale 依赖
- 被 components/ 依赖
```

## 6. directives/ (Vue 指令)

```
directives/
├── click-outside/
├── resize/
└── loading/

依赖关系：
- 依赖 utils/
- 依赖 constants/
- 依赖 hooks/ (可选)
被依赖：
- 被 components/ 依赖
```

## 7. icons/ (图标系统)

```
icons/
├── components/  // 图标组件
└── svg/         // SVG资源

依赖关系：
- 依赖 utils/
- 依赖 constants/
- 依赖 hooks/useNamespace
被依赖：
- 被 components/ 依赖
```

## 8. plugins/ (插件系统，整合各个模块)

```
plugins/
├── theme/      // 主题插件
├── locale/     // 国际化插件
└── icons/      // 图标插件

依赖关系：
- 依赖 utils/
- 依赖 constants/
- 依赖 hooks/
- 依赖 themes/
- 依赖 locales/
- 依赖 icons/
被依赖：
- 被 xihan-ui/ 依赖
```

## 9. components/ (组件库核心)

```
components/
├── button/
├── input/
└── form/

依赖关系：
- 依赖 utils/
- 依赖 constants/
- 依赖 hooks/
- 依赖 themes/
- 依赖 locales/
- 依赖 directives/
- 依赖 icons/
被依赖：
- 被 xihan-ui/ 依赖
```

## 10. xihan-ui/ (入口模块)

```
xihan-ui/
├── index.ts    // 主入口
└── installer.ts // 安装器

依赖关系：
- 依赖所有其他模块
被依赖：无（最顶层模块）
```

# 依赖层级（从底到顶）

1. **第一层（基础设施）**

   - utils/
   - constants/

2. **第二层（基础功能）**

   - themes/
   - locales/
   - icons/

3. **第三层（功能模块）**

   - hooks/
   - directives/

4. **第四层（核心实现）**

   - components/
   - plugins/

5. **第五层（入口模块）**
   - xihan-ui/
