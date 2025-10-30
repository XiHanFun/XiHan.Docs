# XiHan.UI 包依赖关系

XiHan.UI 采用 monorepo 结构进行组织，包含多个子包，各子包之间有明确的依赖关系。下面详细说明各个包的功能和依赖关系。

## 包概览

| 包名                 | 描述               | 依赖                               |
| -------------------- | ------------------ | ---------------------------------- |
| xihan-ui             | 主包，导出所有子包 | 所有子包                           |
| @xihan-ui/utils      | 工具函数           | 无外部依赖                         |
| @xihan-ui/constants  | 常量和类型定义     | utils                              |
| @xihan-ui/themes     | 主题系统           | utils, constants                   |
| @xihan-ui/hooks      | Vue 组合式函数     | utils, constants, themes           |
| @xihan-ui/icons      | 图标组件           | utils, constants                   |
| @xihan-ui/locales    | 国际化资源         | utils, constants                   |
| @xihan-ui/directives | Vue 自定义指令     | utils, constants                   |
| @xihan-ui/components | UI 组件            | utils, constants, hooks, themes 等 |
| @xihan-ui/plugins    | Vue 插件           | utils, constants, hooks, themes 等 |

## 详细依赖结构

### 1. @xihan-ui/utils (基础工具)

```
@xihan-ui/utils/
├── src/
│   ├── dom/        // DOM操作工具
│   ├── vue/        // Vue相关工具
│   ├── common/     // 通用工具函数
│   └── types/      // TypeScript类型定义

依赖: 无
被依赖: 所有其他包
```

### 2. @xihan-ui/constants (常量定义)

```
@xihan-ui/constants/
├── src/
│   ├── tokens.ts   // 注入令牌
│   ├── events.ts   // 事件常量
│   └── props.ts    // 公共Props定义

依赖: @xihan-ui/utils
被依赖: 大部分其他包
```

### 3. @xihan-ui/themes (主题系统)

```
@xihan-ui/themes/
├── src/
│   ├── default/    // 默认主题
│   ├── dark/       // 暗黑主题
│   └── tokens/     // 设计标记

依赖:
- @xihan-ui/utils
- @xihan-ui/constants
被依赖:
- @xihan-ui/components
- @xihan-ui/hooks
- @xihan-ui/plugins
```

### 4. @xihan-ui/hooks (组合式函数)

```
@xihan-ui/hooks/
├── src/
│   ├── useNamespace.ts  // BEM命名空间
│   ├── useConfig.ts     // 全局配置
│   ├── useTheme.ts      // 主题钩子
│   └── useLocale.ts     // 国际化钩子

依赖:
- @xihan-ui/utils
- @xihan-ui/constants
- @xihan-ui/themes
- @xihan-ui/locales
被依赖:
- @xihan-ui/components
- @xihan-ui/plugins
```

### 5. @xihan-ui/icons (图标系统)

```
@xihan-ui/icons/
├── src/
│   ├── components/  // 图标组件
│   ├── packs/       // 打包的图标集合
│   └── svg/         // SVG资源

依赖:
- @xihan-ui/utils
- @xihan-ui/constants
被依赖:
- @xihan-ui/components
```

### 6. @xihan-ui/locales (国际化)

```
@xihan-ui/locales/
├── src/
│   ├── zh-CN/     // 中文语言包
│   └── en-US/     // 英文语言包

依赖:
- @xihan-ui/utils
- @xihan-ui/constants
被依赖:
- @xihan-ui/hooks
- @xihan-ui/components
- @xihan-ui/plugins
```

### 7. @xihan-ui/directives (Vue 指令)

```
@xihan-ui/directives/
├── src/
│   ├── clickOutside/  // 点击外部指令
│   ├── resize/        // 调整大小指令
│   └── loading/       // 加载指令

依赖:
- @xihan-ui/utils
- @xihan-ui/constants
被依赖:
- @xihan-ui/components
```

### 8. @xihan-ui/components (UI 组件)

```
@xihan-ui/components/
├── src/
│   ├── button/      // 按钮组件
│   ├── input/       // 输入框组件
│   ├── form/        // 表单组件
│   └── ...          // 其他组件

依赖:
- @xihan-ui/utils
- @xihan-ui/constants
- @xihan-ui/hooks
- @xihan-ui/themes
- @xihan-ui/icons
- @xihan-ui/locales
- @xihan-ui/directives
被依赖:
- xihan-ui (主包)
```

### 9. @xihan-ui/plugins (Vue 插件)

```
@xihan-ui/plugins/
├── src/
│   ├── theme/      // 主题插件
│   ├── locale/     // 国际化插件
│   └── icons/      // 图标插件

依赖:
- @xihan-ui/utils
- @xihan-ui/constants
- @xihan-ui/hooks
- @xihan-ui/themes
- @xihan-ui/locales
- @xihan-ui/icons
被依赖:
- xihan-ui (主包)
```

### 10. xihan-ui (主包)

```
xihan-ui/
├── src/
│   ├── index.ts    // 主入口
│   ├── installer.ts // 安装器
│   └── resolvers/  // 自动导入解析器

依赖: 所有子包
被依赖: 无 (用户应用直接依赖)
```

## 依赖层级图

```
                      +---------------+
                      |   xihan-ui   |
                      +-------+-------+
                              |
          +------------------++-----------------+
          |                  |                  |
+---------v----------+ +-----v------+ +---------v--------+
| @xihan-ui/components| |@xihan-ui/plugins|  其他导出子包   |
+--------+------------+ +-----+------+ +-----------------+
         |                   |
         |                   |
+--------v---------+  +------v-----+  +--------+-------+
| @xihan-ui/hooks  |  |@xihan-ui/themes| |@xihan-ui/icons  |
+--------+---------+  +------+-----+  +--------+-------+
         |                   |                |
         |                   |                |
+--------v---------+  +------v-----+  +-------v-------+
|@xihan-ui/locales |  |@xihan-ui/directives|
+--------+---------+  +------+-----+
         |                   |
         |                   |
+--------v---------+  +------v-----+
|@xihan-ui/constants|  |             |
+--------+---------+  |             |
         |             |             |
         |             |             |
+--------v-------------v-------------v-----+
|           @xihan-ui/utils               |
+----------------------------------------+
```

## 构建流程

XiHan.UI 使用 TurboRepo 进行任务编排，确保各个包按正确的依赖顺序进行构建。使用 Unbuild 作为构建工具，生成 ESM 和 CommonJS 格式的产物，并提供完整的 TypeScript 类型定义。

## 包导入路径

在应用中导入 XiHan.UI 组件库时，可以使用以下路径：

```js
// 导入主包
import XiHanUI from "xihan-ui";

// 导入特定组件
import { XhButton, XhInput } from "@xihan-ui/components";

// 导入工具函数
import { deepMerge } from "@xihan-ui/utils";

// 导入组合式函数
import { useTheme } from "@xihan-ui/hooks";

// 导入图标
import { XhIcon } from "@xihan-ui/icons";
```
