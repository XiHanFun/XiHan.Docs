# XiHan UI 基础组件

XiHan UI 提供了一系列基础组件，这些组件是构建用户界面的基本元素。本文将详细介绍这些基础组件的用法和配置选项。

## Button 按钮

按钮用于触发操作，是用户界面中最常用的交互元素之一。

### 基础用法

```vue
<template>
  <xh-button>默认按钮</xh-button>
  <xh-button type="primary">主要按钮</xh-button>
  <xh-button type="success">成功按钮</xh-button>
  <xh-button type="warning">警告按钮</xh-button>
  <xh-button type="danger">危险按钮</xh-button>
  <xh-button type="info">信息按钮</xh-button>
</template>
```

### 按钮尺寸

提供大、中、小三种尺寸的按钮。

```vue
<template>
  <xh-button size="large">大型按钮</xh-button>
  <xh-button>默认按钮</xh-button>
  <xh-button size="small">小型按钮</xh-button>
</template>
```

### 按钮状态

按钮可以处于禁用状态或加载状态。

```vue
<template>
  <xh-button disabled>禁用按钮</xh-button>
  <xh-button loading>加载中</xh-button>
  <xh-button loading type="primary">加载中</xh-button>
</template>
```

### 图标按钮

按钮可以包含图标，提高辨识度。

```vue
<template>
  <xh-button icon="search">搜索</xh-button>
  <xh-button icon="edit" type="primary">编辑</xh-button>
  <xh-button icon="delete" type="danger"></xh-button>
</template>
```

### 按钮组

将多个按钮组合在一起。

```vue
<template>
  <xh-button-group>
    <xh-button icon="left" type="primary">上一页</xh-button>
    <xh-button icon="right" type="primary">下一页</xh-button>
  </xh-button-group>
</template>
```

### 属性

| 属性      | 说明             | 类型    | 可选值                                      | 默认值  |
| --------- | ---------------- | ------- | ------------------------------------------- | ------- |
| type      | 按钮类型         | string  | primary / success / warning / danger / info | default |
| size      | 按钮尺寸         | string  | large / small                               | default |
| disabled  | 是否禁用         | boolean | true / false                                | false   |
| loading   | 是否加载中       | boolean | true / false                                | false   |
| icon      | 图标名称         | string  | -                                           | -       |
| round     | 是否圆角按钮     | boolean | true / false                                | false   |
| circle    | 是否圆形按钮     | boolean | true / false                                | false   |
| plain     | 是否朴素按钮     | boolean | true / false                                | false   |
| link      | 是否链接按钮     | boolean | true / false                                | false   |
| text      | 是否文本按钮     | boolean | true / false                                | false   |
| autofocus | 是否自动获取焦点 | boolean | true / false                                | false   |

### 事件

| 事件名 | 说明           | 回调参数 |
| ------ | -------------- | -------- |
| click  | 点击按钮时触发 | event    |

## Typography 排版

排版组件提供了文本的基本格式化功能。

### 基础用法

```vue
<template>
  <xh-typography>
    <xh-typography-title>标题</xh-typography-title>
    <xh-typography-text>这是一段普通文本</xh-typography-text>
    <xh-typography-paragraph>
      这是一个段落，可以包含多行文本。这是一个段落，可以包含多行文本。
      这是一个段落，可以包含多行文本。这是一个段落，可以包含多行文本。
    </xh-typography-paragraph>
  </xh-typography>
</template>
```

### 文本类型

```vue
<template>
  <xh-typography-text>默认文本</xh-typography-text>
  <xh-typography-text type="primary">主要文本</xh-typography-text>
  <xh-typography-text type="success">成功文本</xh-typography-text>
  <xh-typography-text type="warning">警告文本</xh-typography-text>
  <xh-typography-text type="danger">危险文本</xh-typography-text>
  <xh-typography-text disabled>禁用文本</xh-typography-text>
  <xh-typography-text mark>标记文本</xh-typography-text>
  <xh-typography-text code>代码文本</xh-typography-text>
  <xh-typography-text underline>下划线文本</xh-typography-text>
  <xh-typography-text delete>删除线文本</xh-typography-text>
  <xh-typography-text strong>加粗文本</xh-typography-text>
  <xh-typography-text italic>斜体文本</xh-typography-text>
</template>
```

### 标题级别

```vue
<template>
  <xh-typography-title :level="1">h1. XiHan UI</xh-typography-title>
  <xh-typography-title :level="2">h2. XiHan UI</xh-typography-title>
  <xh-typography-title :level="3">h3. XiHan UI</xh-typography-title>
  <xh-typography-title :level="4">h4. XiHan UI</xh-typography-title>
  <xh-typography-title :level="5">h5. XiHan UI</xh-typography-title>
</template>
```

### 可交互文本

```vue
<template>
  <xh-typography-paragraph copyable>这是可复制的文本</xh-typography-paragraph>
  <xh-typography-paragraph :ellipsis="{ rows: 2, expandable: true }">
    这是一段很长的文本，当超过指定行数时会自动省略，并显示展开按钮。
    这是一段很长的文本，当超过指定行数时会自动省略，并显示展开按钮。
    这是一段很长的文本，当超过指定行数时会自动省略，并显示展开按钮。
  </xh-typography-paragraph>
  <xh-typography-paragraph editable>这是可编辑的文本</xh-typography-paragraph>
</template>
```

### 属性

#### Typography

| 属性      | 说明               | 类型   | 可选值 | 默认值    |
| --------- | ------------------ | ------ | ------ | --------- |
| component | 要渲染的 HTML 元素 | string | -      | 'article' |

#### Typography.Title

| 属性     | 说明       | 类型    | 可选值                               | 默认值 |
| -------- | ---------- | ------- | ------------------------------------ | ------ |
| level    | 标题级别   | number  | 1-5                                  | 1      |
| type     | 文本类型   | string  | primary / success / warning / danger | -      |
| copyable | 是否可复制 | boolean | true / false                         | false  |
| editable | 是否可编辑 | boolean | true / false                         | false  |

#### Typography.Text

| 属性      | 说明         | 类型    | 可选值                               | 默认值 |
| --------- | ------------ | ------- | ------------------------------------ | ------ |
| type      | 文本类型     | string  | primary / success / warning / danger | -      |
| disabled  | 禁用文本     | boolean | true / false                         | false  |
| mark      | 添加标记样式 | boolean | true / false                         | false  |
| code      | 添加代码样式 | boolean | true / false                         | false  |
| underline | 添加下划线   | boolean | true / false                         | false  |
| delete    | 添加删除线   | boolean | true / false                         | false  |
| strong    | 是否加粗     | boolean | true / false                         | false  |
| italic    | 是否斜体     | boolean | true / false                         | false  |
| copyable  | 是否可复制   | boolean | true / false                         | false  |

#### Typography.Paragraph

| 属性     | 说明         | 类型             | 可选值                                       | 默认值 |
| -------- | ------------ | ---------------- | -------------------------------------------- | ------ |
| type     | 文本类型     | string           | primary / success / warning / danger         | -      |
| copyable | 是否可复制   | boolean          | true / false                                 | false  |
| editable | 是否可编辑   | boolean          | true / false                                 | false  |
| ellipsis | 自动溢出省略 | boolean / object | true / { rows: number, expandable: boolean } | false  |

## Icon 图标

XiHan UI 提供了一套丰富的图标集合。

### 基础用法

```vue
<template>
  <xh-icon name="home" />
  <xh-icon name="user" />
  <xh-icon name="settings" />
  <xh-icon name="search" />
</template>
```

### 图标尺寸

```vue
<template>
  <xh-icon name="home" size="small" />
  <xh-icon name="home" />
  <xh-icon name="home" size="large" />
  <xh-icon name="home" :size="32" />
</template>
```

### 图标颜色

```vue
<template>
  <xh-icon name="home" color="primary" />
  <xh-icon name="user" color="success" />
  <xh-icon name="settings" color="warning" />
  <xh-icon name="search" color="danger" />
  <xh-icon name="message" color="#8c0776" />
</template>
```

### 自定义图标

```vue
<template>
  <xh-icon>
    <svg viewBox="0 0 24 24">
      <!-- SVG 路径 -->
      <path d="M12 2L2 12h3v8h14v-8h3L12 2z" />
    </svg>
  </xh-icon>
</template>
```

### 属性

| 属性  | 说明     | 类型            | 可选值                                                   | 默认值 |
| ----- | -------- | --------------- | -------------------------------------------------------- | ------ |
| name  | 图标名称 | string          | -                                                        | -      |
| size  | 图标大小 | string / number | small / large / 具体数值                                 | -      |
| color | 图标颜色 | string          | primary / success / warning / danger / info / 自定义颜色 | -      |
| spin  | 是否旋转 | boolean         | true / false                                             | false  |

## Grid 栅格

栅格系统是用于页面布局的基础组件，XiHan UI 的栅格系统基于 24 列布局。

### 基础用法

```vue
<template>
  <xh-row>
    <xh-col :span="24">col-24</xh-col>
  </xh-row>
  <xh-row>
    <xh-col :span="12">col-12</xh-col>
    <xh-col :span="12">col-12</xh-col>
  </xh-row>
  <xh-row>
    <xh-col :span="8">col-8</xh-col>
    <xh-col :span="8">col-8</xh-col>
    <xh-col :span="8">col-8</xh-col>
  </xh-row>
  <xh-row>
    <xh-col :span="6">col-6</xh-col>
    <xh-col :span="6">col-6</xh-col>
    <xh-col :span="6">col-6</xh-col>
    <xh-col :span="6">col-6</xh-col>
  </xh-row>
</template>
```

### 列间距

```vue
<template>
  <xh-row :gutter="16">
    <xh-col :span="12">col-12</xh-col>
    <xh-col :span="12">col-12</xh-col>
  </xh-row>
</template>
```

### 列偏移

```vue
<template>
  <xh-row>
    <xh-col :span="8">col-8</xh-col>
    <xh-col :span="8" :offset="8">col-8 offset-8</xh-col>
  </xh-row>
</template>
```

### 响应式布局

```vue
<template>
  <xh-row>
    <xh-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">响应式列</xh-col>
    <xh-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">响应式列</xh-col>
    <xh-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">响应式列</xh-col>
    <xh-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">响应式列</xh-col>
  </xh-row>
</template>
```

### Flex 布局

```vue
<template>
  <xh-row type="flex" justify="center" align="middle">
    <xh-col :span="6">col-6</xh-col>
    <xh-col :span="6">col-6</xh-col>
    <xh-col :span="6">col-6</xh-col>
  </xh-row>
</template>
```

### 属性

#### Row

| 属性    | 说明                      | 类型    | 可选值                                              | 默认值 |
| ------- | ------------------------- | ------- | --------------------------------------------------- | ------ |
| gutter  | 列间距                    | number  | -                                                   | 0      |
| type    | 布局模式                  | string  | flex                                                | -      |
| justify | flex 布局下的水平排列方式 | string  | start / end / center / space-around / space-between | start  |
| align   | flex 布局下的垂直对齐方式 | string  | top / middle / bottom                               | top    |
| wrap    | 是否自动换行              | boolean | true / false                                        | true   |

#### Col

| 属性   | 说明               | 类型            | 可选值 | 默认值 |
| ------ | ------------------ | --------------- | ------ | ------ |
| span   | 栅格占据的列数     | number          | 1-24   | -      |
| offset | 栅格左侧的间隔列数 | number          | 0-24   | 0      |
| push   | 栅格向右移动格数   | number          | 0-24   | 0      |
| pull   | 栅格向左移动格数   | number          | 0-24   | 0      |
| xs     | <768px 响应式栅格  | number / object | -      | -      |
| sm     | ≥768px 响应式栅格  | number / object | -      | -      |
| md     | ≥992px 响应式栅格  | number / object | -      | -      |
| lg     | ≥1200px 响应式栅格 | number / object | -      | -      |
| xl     | ≥1920px 响应式栅格 | number / object | -      | -      |

## Layout 布局

布局组件用于组织页面的整体结构。

### 基础用法

```vue
<template>
  <xh-layout>
    <xh-header>Header</xh-header>
    <xh-content>Content</xh-content>
    <xh-footer>Footer</xh-footer>
  </xh-layout>
</template>
```

### 常见页面布局

```vue
<template>
  <!-- 顶部-内容-底部 -->
  <xh-layout>
    <xh-header>Header</xh-header>
    <xh-content>Content</xh-content>
    <xh-footer>Footer</xh-footer>
  </xh-layout>

  <!-- 顶部-侧边栏-内容 -->
  <xh-layout>
    <xh-header>Header</xh-header>
    <xh-layout>
      <xh-sider>Sider</xh-sider>
      <xh-content>Content</xh-content>
    </xh-layout>
    <xh-footer>Footer</xh-footer>
  </xh-layout>

  <!-- 侧边栏-内容 -->
  <xh-layout>
    <xh-sider>Sider</xh-sider>
    <xh-layout>
      <xh-header>Header</xh-header>
      <xh-content>Content</xh-content>
      <xh-footer>Footer</xh-footer>
    </xh-layout>
  </xh-layout>
</template>
```

### 可收起的侧边栏

```vue
<template>
  <xh-layout>
    <xh-sider collapsible v-model:collapsed="collapsed"> Sider </xh-sider>
    <xh-layout>
      <xh-header>Header</xh-header>
      <xh-content>Content</xh-content>
      <xh-footer>Footer</xh-footer>
    </xh-layout>
  </xh-layout>
</template>

<script setup>
import { ref } from "vue";

const collapsed = ref(false);
</script>
```

### 属性

#### Layout

| 属性      | 说明             | 类型   | 可选值                | 默认值   |
| --------- | ---------------- | ------ | --------------------- | -------- |
| direction | 子元素的排列方向 | string | horizontal / vertical | 自动判断 |

#### Layout.Sider

| 属性           | 说明                 | 类型            | 可选值                 | 默认值 |
| -------------- | -------------------- | --------------- | ---------------------- | ------ |
| collapsed      | 当前收起状态         | boolean         | -                      | false  |
| collapsible    | 是否可收起           | boolean         | -                      | false  |
| width          | 宽度                 | number / string | -                      | 200    |
| collapsedWidth | 收缩时的宽度         | number          | -                      | 80     |
| breakpoint     | 触发响应式布局的断点 | string          | xs / sm / md / lg / xl | -      |

### 事件

#### Layout.Sider

| 事件名     | 说明                       | 回调参数           |
| ---------- | -------------------------- | ------------------ |
| collapse   | 展开-收起时的回调函数      | collapsed: boolean |
| breakpoint | 触发响应式布局断点时的回调 | broken: boolean    |

## Space 间距

Space 组件用于设置组件之间的间距。

### 基础用法

```vue
<template>
  <xh-space>
    <xh-button>按钮1</xh-button>
    <xh-button>按钮2</xh-button>
    <xh-button>按钮3</xh-button>
  </xh-space>
</template>
```

### 垂直间距

```vue
<template>
  <xh-space direction="vertical">
    <xh-button>按钮1</xh-button>
    <xh-button>按钮2</xh-button>
    <xh-button>按钮3</xh-button>
  </xh-space>
</template>
```

### 间距大小

```vue
<template>
  <xh-space size="small">
    <xh-button>小间距</xh-button>
    <xh-button>小间距</xh-button>
  </xh-space>

  <xh-space>
    <xh-button>默认间距</xh-button>
    <xh-button>默认间距</xh-button>
  </xh-space>

  <xh-space size="large">
    <xh-button>大间距</xh-button>
    <xh-button>大间距</xh-button>
  </xh-space>

  <xh-space :size="20">
    <xh-button>自定义间距</xh-button>
    <xh-button>自定义间距</xh-button>
  </xh-space>
</template>
```

### 对齐方式

```vue
<template>
  <xh-space align="center">
    <xh-button>按钮</xh-button>
    <xh-card style="height: 100px">卡片</xh-card>
  </xh-space>

  <xh-space align="start">
    <xh-button>按钮</xh-button>
    <xh-card style="height: 100px">卡片</xh-card>
  </xh-space>

  <xh-space align="end">
    <xh-button>按钮</xh-button>
    <xh-card style="height: 100px">卡片</xh-card>
  </xh-space>
</template>
```

### 属性

| 属性      | 说明                     | 类型                               | 可选值                            | 默认值     |
| --------- | ------------------------ | ---------------------------------- | --------------------------------- | ---------- |
| direction | 间距方向                 | string                             | vertical / horizontal             | horizontal |
| size      | 间距大小                 | string / number / [number, number] | small / middle / large / 自定义值 | middle     |
| align     | 对齐方式                 | string                             | start / end / center / baseline   | center     |
| wrap      | 是否自动换行             | boolean                            | true / false                      | false      |
| fill      | 是否填充父容器           | boolean                            | true / false                      | false      |
| fillRatio | 填充父容器时子元素的比例 | number                             | -                                 | 100        |

## Divider 分割线

分割线用于分隔内容。

### 基础用法

```vue
<template>
  <p>段落内容</p>
  <xh-divider></xh-divider>
  <p>段落内容</p>
</template>
```

### 垂直分割线

```vue
<template>
  <span>文本</span>
  <xh-divider direction="vertical"></xh-divider>
  <span>文本</span>
  <xh-divider direction="vertical"></xh-divider>
  <span>文本</span>
</template>
```

### 带文本的分割线

```vue
<template>
  <p>段落内容</p>
  <xh-divider orientation="left">左侧文本</xh-divider>
  <p>段落内容</p>

  <p>段落内容</p>
  <xh-divider orientation="right">右侧文本</xh-divider>
  <p>段落内容</p>
</template>
```

### 自定义样式

```vue
<template>
  <p>段落内容</p>
  <xh-divider dashed></xh-divider>
  <p>段落内容</p>

  <p>段落内容</p>
  <xh-divider style="border-color: #f56c6c;"></xh-divider>
  <p>段落内容</p>
</template>
```

### 属性

| 属性         | 说明             | 类型    | 可选值                | 默认值     |
| ------------ | ---------------- | ------- | --------------------- | ---------- |
| direction    | 分割线方向       | string  | horizontal / vertical | horizontal |
| orientation  | 分割线标题的位置 | string  | left / right / center | center     |
| dashed       | 是否为虚线       | boolean | true / false          | false      |
| border-style | 分割线样式       | string  | CSS 边框样式          | solid      |

## 下一步

- 了解 [表单组件](./form) 的使用方法
- 探索 [数据展示组件](./data-display) 的功能
- 学习 [导航组件](./navigation) 的配置选项
