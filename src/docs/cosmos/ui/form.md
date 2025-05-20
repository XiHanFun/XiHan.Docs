# XiHan UI 表单组件

XiHan UI 提供了丰富的表单组件，支持数据收集、校验和提交，本文将详细介绍这些表单组件的用法和配置选项。

## Form 表单

表单组件用于收集、验证和提交数据，是用户输入的主要途径。

### 基础用法

```vue
<template>
  <xh-form :model="form" :rules="rules" ref="formRef" label-width="100px">
    <xh-form-item label="用户名" prop="username">
      <xh-input v-model="form.username" placeholder="请输入用户名"></xh-input>
    </xh-form-item>
    <xh-form-item label="密码" prop="password">
      <xh-input
        v-model="form.password"
        type="password"
        placeholder="请输入密码"
      ></xh-input>
    </xh-form-item>
    <xh-form-item>
      <xh-button type="primary" @click="submitForm">提交</xh-button>
      <xh-button @click="resetForm">重置</xh-button>
    </xh-form-item>
  </xh-form>
</template>

<script setup>
import { ref, reactive } from "vue";

const formRef = ref(null);
const form = reactive({
  username: "",
  password: "",
});

const rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" },
  ],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      console.log("提交表单", form);
    } else {
      console.log("表单验证失败");
      return false;
    }
  });
};

const resetForm = () => {
  formRef.value.resetFields();
};
</script>
```

### 行内表单

```vue
<template>
  <xh-form :inline="true" :model="formInline" ref="formInlineRef">
    <xh-form-item label="用户名" prop="user">
      <xh-input v-model="formInline.user" placeholder="用户名"></xh-input>
    </xh-form-item>
    <xh-form-item label="活动区域" prop="region">
      <xh-select v-model="formInline.region" placeholder="活动区域">
        <xh-option label="区域一" value="shanghai"></xh-option>
        <xh-option label="区域二" value="beijing"></xh-option>
      </xh-select>
    </xh-form-item>
    <xh-form-item>
      <xh-button type="primary" @click="onSubmit">查询</xh-button>
    </xh-form-item>
  </xh-form>
</template>
```

### 表单属性

| 属性                   | 说明                           | 类型    | 可选值                | 默认值 |
| ---------------------- | ------------------------------ | ------- | --------------------- | ------ |
| model                  | 表单数据对象                   | object  | —                     | —      |
| rules                  | 表单验证规则                   | object  | —                     | —      |
| inline                 | 是否行内表单模式               | boolean | —                     | false  |
| label-position         | 表单标签的位置                 | string  | right/left/top        | right  |
| label-width            | 表单标签的宽度                 | string  | —                     | —      |
| label-suffix           | 表单标签的后缀                 | string  | —                     | —      |
| hide-required-asterisk | 是否隐藏必填字段的星号         | boolean | —                     | false  |
| show-message           | 是否显示校验错误信息           | boolean | —                     | true   |
| size                   | 用于控制该表单内所有组件的尺寸 | string  | medium / small / mini | —      |

## Input 输入框

基础的文本输入组件，支持各种文本和数字输入。

### 基础用法

```vue
<template>
  <xh-input v-model="input" placeholder="请输入内容"></xh-input>
</template>

<script setup>
import { ref } from "vue";
const input = ref("");
</script>
```

### 禁用状态

```vue
<template>
  <xh-input v-model="input" disabled placeholder="禁用状态"></xh-input>
</template>
```

### 可清空

```vue
<template>
  <xh-input v-model="input" clearable placeholder="可清空"></xh-input>
</template>
```

### 密码框

```vue
<template>
  <xh-input
    v-model="password"
    type="password"
    placeholder="请输入密码"
    show-password
  ></xh-input>
</template>
```

### 文本域

```vue
<template>
  <xh-input
    v-model="textarea"
    type="textarea"
    :rows="4"
    placeholder="请输入内容"
  ></xh-input>
</template>
```

### 输入长度限制

```vue
<template>
  <xh-input
    v-model="text"
    maxlength="10"
    show-word-limit
    placeholder="最多输入10个字符"
  ></xh-input>
  <xh-input
    v-model="textarea"
    type="textarea"
    :rows="4"
    maxlength="100"
    show-word-limit
    placeholder="最多输入100个字符"
  ></xh-input>
</template>
```

### 输入框属性

| 属性        | 说明                                 | 类型             | 可选值                           | 默认值  |
| ----------- | ------------------------------------ | ---------------- | -------------------------------- | ------- |
| type        | 类型                                 | string           | text/textarea/password           | text    |
| value       | 绑定值                               | string / number  | —                                | —       |
| maxlength   | 最大输入长度                         | number           | —                                | —       |
| minlength   | 最小输入长度                         | number           | —                                | —       |
| placeholder | 输入框占位文本                       | string           | —                                | —       |
| clearable   | 是否可清空                           | boolean          | —                                | false   |
| disabled    | 是否禁用                             | boolean          | —                                | false   |
| size        | 输入框尺寸                           | string           | large / default / small          | default |
| prefix-icon | 输入框头部图标                       | string           | —                                | —       |
| suffix-icon | 输入框尾部图标                       | string           | —                                | —       |
| rows        | 输入框行数，只对 textarea 有效       | number           | —                                | 2       |
| autosize    | 自适应内容高度，只对 textarea 有效   | boolean / object | —                                | false   |
| readonly    | 是否只读                             | boolean          | —                                | false   |
| max         | 原生属性，最大值                     | —                | —                                | —       |
| min         | 原生属性，最小值                     | —                | —                                | —       |
| step        | 原生属性，设置输入字段的合法数字间隔 | —                | —                                | —       |
| resize      | 控制是否能被用户缩放                 | string           | none, both, horizontal, vertical | —       |
| autofocus   | 自动获取焦点                         | boolean          | —                                | false   |
| form        | 原生属性                             | string           | —                                | —       |
| label       | 输入框关联的 label 文字              | string           | —                                | —       |
| tabindex    | 输入框的 tabindex                    | string / number  | —                                | —       |

## Select 选择器

当选项过多时，使用下拉菜单展示并选择选项。

### 基础用法

```vue
<template>
  <xh-select v-model="value" placeholder="请选择">
    <xh-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
    </xh-option>
  </xh-select>
</template>

<script setup>
import { ref } from "vue";

const value = ref("");
const options = [
  { value: "选项1", label: "黄金糕" },
  { value: "选项2", label: "双皮奶" },
  { value: "选项3", label: "蚵仔煎" },
  { value: "选项4", label: "龙须面" },
  { value: "选项5", label: "北京烤鸭" },
];
</script>
```

### 禁用选项

```vue
<template>
  <xh-select v-model="value" placeholder="请选择">
    <xh-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled"
    >
    </xh-option>
  </xh-select>
</template>

<script setup>
import { ref } from "vue";

const value = ref("");
const options = [
  { value: "选项1", label: "黄金糕" },
  { value: "选项2", label: "双皮奶", disabled: true },
  { value: "选项3", label: "蚵仔煎" },
  { value: "选项4", label: "龙须面" },
  { value: "选项5", label: "北京烤鸭" },
];
</script>
```

### 多选

```vue
<template>
  <xh-select v-model="value" multiple placeholder="请选择">
    <xh-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
    </xh-option>
  </xh-select>
</template>

<script setup>
import { ref } from "vue";

const value = ref([]);
const options = [
  // 选项同上
];
</script>
```

### 可搜索

```vue
<template>
  <xh-select v-model="value" filterable placeholder="请选择">
    <xh-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
    </xh-option>
  </xh-select>
</template>
```

### 远程搜索

```vue
<template>
  <xh-select
    v-model="value"
    filterable
    remote
    reserve-keyword
    placeholder="请输入关键词"
    :remote-method="remoteMethod"
    :loading="loading"
  >
    <xh-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
    </xh-option>
  </xh-select>
</template>

<script setup>
import { ref } from "vue";

const value = ref("");
const options = ref([]);
const loading = ref(false);

const remoteMethod = (query) => {
  if (query !== "") {
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
      options.value = [
        { value: "选项1", label: query + "黄金糕" },
        { value: "选项2", label: query + "双皮奶" },
        { value: "选项3", label: query + "蚵仔煎" },
      ];
    }, 200);
  } else {
    options.value = [];
  }
};
</script>
```

### Select 属性

| 属性            | 说明                                          | 类型                              | 可选值 | 默认值 |
| --------------- | --------------------------------------------- | --------------------------------- | ------ | ------ |
| value / v-model | 绑定值                                        | boolean / string / number / array | —      | —      |
| multiple        | 是否多选                                      | boolean                           | —      | false  |
| disabled        | 是否禁用                                      | boolean                           | —      | false  |
| clearable       | 是否可以清空选项                              | boolean                           | —      | false  |
| collapse-tags   | 多选时是否将选中值合并为一段文字              | boolean                           | —      | false  |
| multiple-limit  | 多选时用户最多可以选择的项目数，为 0 则不限制 | number                            | —      | 0      |
| name            | 原生属性 name                                 | string                            | —      | —      |
| placeholder     | 占位符                                        | string                            | —      | 请选择 |
| filterable      | 是否可搜索                                    | boolean                           | —      | false  |
| remote          | 是否为远程搜索                                | boolean                           | —      | false  |
| remote-method   | 远程搜索方法                                  | function                          | —      | —      |
| loading         | 是否正在从远程获取数据                        | boolean                           | —      | false  |
| loading-text    | 远程加载时显示的文字                          | string                            | —      | 加载中 |

## 其他表单组件

除了上述组件外，XiHan UI 还提供了以下表单组件：

### Radio 单选框

```vue
<template>
  <xh-radio v-model="radio" label="1">选项1</xh-radio>
  <xh-radio v-model="radio" label="2">选项2</xh-radio>

  <xh-radio-group v-model="radio">
    <xh-radio :label="3">选项A</xh-radio>
    <xh-radio :label="6">选项B</xh-radio>
    <xh-radio :label="9">选项C</xh-radio>
  </xh-radio-group>
</template>
```

### Checkbox 多选框

```vue
<template>
  <xh-checkbox v-model="checked">选项1</xh-checkbox>

  <xh-checkbox-group v-model="checkList">
    <xh-checkbox label="选项1"></xh-checkbox>
    <xh-checkbox label="选项2"></xh-checkbox>
    <xh-checkbox label="选项3" disabled></xh-checkbox>
  </xh-checkbox-group>
</template>
```

### Switch 开关

```vue
<template>
  <xh-switch
    v-model="value"
    active-text="开启"
    inactive-text="关闭"
  ></xh-switch>
  <xh-switch
    v-model="value"
    active-color="#13ce66"
    inactive-color="#ff4949"
  ></xh-switch>
</template>
```

### Slider 滑块

```vue
<template>
  <xh-slider v-model="value" show-input></xh-slider>
  <xh-slider v-model="rangeValue" range show-stops :max="10"></xh-slider>
</template>

<script setup>
import { ref } from "vue";

const value = ref(50);
const rangeValue = ref([4, 8]);
</script>
```

### TimePicker 时间选择器

```vue
<template>
  <xh-time-picker
    v-model="value"
    placeholder="选择时间"
    :picker-options="{
      selectableRange: '18:30:00 - 20:30:00',
    }"
  ></xh-time-picker>
</template>
```

### DatePicker 日期选择器

```vue
<template>
  <xh-date-picker
    v-model="value"
    type="date"
    placeholder="选择日期"
  ></xh-date-picker>
  <xh-date-picker
    v-model="dateRange"
    type="daterange"
    range-separator="至"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
  ></xh-date-picker>
</template>
```

### ColorPicker 颜色选择器

```vue
<template>
  <xh-color-picker v-model="color"></xh-color-picker>
</template>

<script setup>
import { ref } from "vue";

const color = ref("#409EFF");
</script>
```

### Rate 评分

```vue
<template>
  <xh-rate v-model="value"></xh-rate>
  <xh-rate v-model="value" :colors="colors" show-text></xh-rate>
</template>

<script setup>
import { ref } from "vue";

const value = ref(3.5);
const colors = ["#99A9BF", "#F7BA2A", "#FF9900"];
</script>
```

### Upload 上传

```vue
<template>
  <xh-upload
    action="https://jsonplaceholder.typicode.com/posts/"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    multiple
    :limit="3"
    :on-exceed="handleExceed"
    :file-list="fileList"
  >
    <xh-button size="small" type="primary">点击上传</xh-button>
    <template #tip>
      <div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </template>
  </xh-upload>
</template>
```

## 表单布局技巧

### 栅格布局

```vue
<template>
  <xh-form :model="form" label-width="100px">
    <xh-row :gutter="20">
      <xh-col :span="12">
        <xh-form-item label="姓名">
          <xh-input v-model="form.name"></xh-input>
        </xh-form-item>
      </xh-col>
      <xh-col :span="12">
        <xh-form-item label="年龄">
          <xh-input v-model="form.age"></xh-input>
        </xh-form-item>
      </xh-col>
    </xh-row>
    <xh-row :gutter="20">
      <xh-col :span="12">
        <xh-form-item label="邮箱">
          <xh-input v-model="form.email"></xh-input>
        </xh-form-item>
      </xh-col>
      <xh-col :span="12">
        <xh-form-item label="电话">
          <xh-input v-model="form.phone"></xh-input>
        </xh-form-item>
      </xh-col>
    </xh-row>
  </xh-form>
</template>
```

### 动态表单项

```vue
<template>
  <xh-form :model="dynamicForm" ref="dynamicFormRef">
    <xh-form-item
      v-for="(domain, index) in dynamicForm.domains"
      :key="domain.key"
      :label="'域名' + index"
      :prop="'domains.' + index + '.value'"
      :rules="{
        required: true,
        message: '域名不能为空',
        trigger: 'blur',
      }"
    >
      <xh-input v-model="domain.value"></xh-input>
      <xh-button @click.prevent="removeDomain(domain)">删除</xh-button>
    </xh-form-item>
    <xh-form-item>
      <xh-button type="primary" @click="submitForm">提交</xh-button>
      <xh-button @click="addDomain">新增域名</xh-button>
    </xh-form-item>
  </xh-form>
</template>

<script setup>
import { ref, reactive } from "vue";

const dynamicFormRef = ref(null);
const dynamicForm = reactive({
  domains: [{ value: "", key: Date.now() }],
});

const removeDomain = (item) => {
  const index = dynamicForm.domains.indexOf(item);
  if (index !== -1) {
    dynamicForm.domains.splice(index, 1);
  }
};

const addDomain = () => {
  dynamicForm.domains.push({
    value: "",
    key: Date.now(),
  });
};

const submitForm = () => {
  dynamicFormRef.value.validate((valid) => {
    if (valid) {
      console.log("提交表单", dynamicForm);
    } else {
      console.log("表单验证失败");
      return false;
    }
  });
};
</script>
```

## 下一步

- 了解 [数据展示组件](./data-display) 的使用方法
- 探索 [导航组件](./navigation) 的配置选项
- 学习 [反馈组件](./feedback) 的功能
