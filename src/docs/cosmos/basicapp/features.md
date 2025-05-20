---
title: 基础功能
index: false
next:
  text: "权限管理"
  link: "./permissions"
---

# XiHan.BasicApp 基础功能

XiHan.BasicApp 是一个功能丰富的企业级应用框架，提供了丰富的基础功能模块，让开发人员可以快速构建各类业务系统。本文将详细介绍 XiHan.BasicApp 的基础功能模块及其使用方法。

## 用户管理

用户管理是系统的基础功能，提供对系统用户的全面管理能力。

### 用户列表

用户列表页面提供了对系统用户的综合查看和管理功能：

- 用户搜索：支持按用户名、邮箱、手机号等条件搜索
- 批量操作：支持批量启用/禁用/删除用户
- 状态过滤：可以按照用户状态进行过滤
- 数据导出：支持将用户数据导出为 Excel 文件

![用户列表](../images/user-list.png)

### 用户创建与编辑

系统提供了完善的用户信息管理功能：

- 基本信息：用户名、姓名、邮箱、手机号等基础信息
- 角色分配：为用户分配一个或多个角色
- 部门设置：设置用户所属部门
- 状态管理：启用/禁用用户账号
- 密码管理：重置用户密码，强制下次登录修改密码

### 用户导入

支持通过 Excel 模板批量导入用户数据：

1. 下载导入模板
2. 填写用户信息
3. 上传文件并验证数据
4. 确认无误后导入

系统会自动验证数据有效性，避免重复用户和格式错误。

## 角色与权限

### 角色管理

角色是权限的集合，系统提供了灵活的角色管理功能：

- 角色创建：设置角色名称、编码、描述等信息
- 权限分配：为角色分配菜单和操作权限
- 数据权限：设置角色的数据访问范围
- 角色复制：基于现有角色快速创建新角色

### 权限设置

权限控制粒度分为菜单权限和操作权限两级：

- 菜单权限：控制用户可以访问哪些功能模块
- 操作权限：控制用户在特定功能模块中可以执行哪些操作（如增、删、改、查、导出等）

通过权限设置页面，管理员可以使用直观的树形结构为角色分配权限：

```js
// 权限数据结构示例
const permissions = [
  {
    id: "system",
    name: "系统管理",
    children: [
      {
        id: "user",
        name: "用户管理",
        operations: [
          { id: "user:view", name: "查看" },
          { id: "user:create", name: "新增" },
          { id: "user:edit", name: "编辑" },
          { id: "user:delete", name: "删除" },
          { id: "user:export", name: "导出" },
        ],
      },
      // 其他菜单...
    ],
  },
];
```

## 组织管理

### 部门管理

系统支持灵活的多级部门管理：

- 部门树形结构：直观展示公司组织架构
- 部门增删改：维护部门信息
- 人员关联：查看部门下的所有用户
- 部门排序：调整同级部门的显示顺序

### 岗位管理

岗位是组织中的职位分类：

- 岗位创建：设置岗位名称、编码、排序等信息
- 岗位分配：为用户分配特定岗位
- 批量操作：支持批量启用/禁用岗位

## 系统监控

### 操作日志

系统自动记录用户的关键操作，方便审计和问题排查：

- 操作分类：记录登录日志、操作日志、错误日志等不同类型
- 详细信息：记录操作人、操作时间、IP 地址、操作模块、操作内容等
- 高级搜索：支持多条件组合查询
- 日志导出：支持导出日志数据

### 服务监控

实时监控系统服务状态和性能指标：

- CPU 使用率：监控服务器 CPU 负载情况
- 内存使用：监控内存占用变化
- 磁盘空间：监控磁盘使用情况
- 网络流量：监控网络带宽占用
- 服务状态：监控关键服务的运行状态
- 数据库监控：监控数据库连接数、执行时间等指标

![系统监控](../images/system-monitor.png)

### 在线用户

查看当前系统的在线用户：

- 用户列表：显示当前在线的用户信息
- 会话管理：支持强制用户下线
- 活动追踪：记录用户最后活动时间和访问页面

## 系统设置

### 参数配置

系统提供了灵活的参数配置功能，可以在不修改代码的情况下调整系统行为：

- 系统参数：如系统名称、LOGO、主题色等
- 业务参数：业务相关的配置项
- 安全设置：密码策略、登录限制等安全相关设置
- 缓存设置：系统缓存策略配置

参数示例：

```json
{
  "system": {
    "name": "XiHan管理系统",
    "logo": "/assets/logo.png",
    "footer": "© 2023 XiHanFun.com",
    "defaultTheme": "light"
  },
  "security": {
    "passwordMinLength": 8,
    "passwordExpireDays": 90,
    "loginLockThreshold": 5,
    "enableCaptcha": true
  }
}
```

### 字典管理

字典用于维护系统中使用的各类枚举值：

- 字典类型：定义不同类别的字典，如性别、状态、级别等
- 字典数据：维护每种字典类型下的具体数据项
- 字典缓存：系统自动缓存字典数据，提高访问性能
- 字典调用：前端和后端可以方便地引用字典数据

使用示例：

```vue
<template>
  <xh-select v-model="form.gender" placeholder="请选择性别">
    <xh-option
      v-for="dict in genderOptions"
      :key="dict.value"
      :label="dict.label"
      :value="dict.value"
    ></xh-option>
  </xh-select>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getDictData } from "@/api/system/dict";

const form = ref({ gender: "" });
const genderOptions = ref([]);

onMounted(async () => {
  // 从字典API获取性别选项
  const data = await getDictData("sys_user_sex");
  genderOptions.value = data;
});
</script>
```

### 菜单管理

菜单管理功能用于维护系统的导航结构：

- 菜单树：直观展示系统菜单结构
- 菜单维护：支持添加、编辑、删除菜单
- 菜单配置：设置菜单名称、图标、路由、组件等信息
- 权限标识：为菜单设置权限标识，用于权限控制

菜单配置示例：

```json
{
  "name": "用户管理",
  "path": "/system/user",
  "component": "system/user/index",
  "icon": "user",
  "orderNum": 1,
  "isFrame": false,
  "isCache": false,
  "visible": true,
  "status": "0",
  "perms": "system:user:list"
}
```

## 通用功能

### 文件管理

系统提供了完善的文件管理功能：

- 文件上传：支持单文件和批量上传
- 文件分类：按业务类型对文件进行分类
- 文件预览：支持图片、文档、视频等常见格式预览
- 存储策略：支持本地存储、对象存储等多种存储方式

文件上传示例：

```vue
<template>
  <xh-upload
    action="/api/file/upload"
    :headers="headers"
    :on-success="handleSuccess"
    :on-error="handleError"
    :file-list="fileList"
  >
    <xh-button type="primary">点击上传</xh-button>
  </xh-upload>
</template>
```

### 消息通知

系统内置消息通知功能，支持多种通知方式：

- 站内消息：系统内的消息通知，显示在消息中心
- 邮件通知：通过邮件发送重要通知
- 短信通知：通过短信发送验证码、提醒等信息
- 消息模板：支持自定义各类消息的模板

消息通知示例：

```csharp
// 发送站内消息
await _notificationService.SendNotificationAsync(new Notification
{
    Title = "系统更新通知",
    Content = "系统将于今晚22:00-23:00进行例行维护，请做好数据保存工作。",
    Type = NotificationType.System,
    RecipientIds = new[] { "user1", "user2" }
});

// 发送邮件通知
await _notificationService.SendEmailAsync(
    to: "user@example.com",
    subject: "账号激活",
    templateCode: "ACCOUNT_ACTIVATION",
    parameters: new Dictionary<string, string>
    {
        { "username", "张三" },
        { "activationLink", "https://example.com/activate?token=abc123" }
    }
);
```

### 数据导入导出

系统支持多种数据格式的导入导出：

- Excel 导入导出：支持 Excel 格式的数据交换
- CSV 导入导出：支持 CSV 格式的数据交换
- 模板下载：提供标准导入模板下载
- 数据校验：导入时自动校验数据格式和业务规则

Excel 导出示例：

```csharp
// 后端导出Excel
public async Task<IActionResult> ExportUsers(UserSearchDto searchDto)
{
    var users = await _userService.QueryUsersAsync(searchDto);

    var excelData = users.Select(u => new
    {
        用户名 = u.Username,
        姓名 = u.RealName,
        手机号 = u.PhoneNumber,
        邮箱 = u.Email,
        部门 = u.DepartmentName,
        状态 = u.Status ? "启用" : "禁用",
        创建时间 = u.CreateTime.ToString("yyyy-MM-dd HH:mm:ss")
    }).ToList();

    return await _excelExportService.ExportAsync(
        "用户数据.xlsx",
        "用户列表",
        excelData
    );
}
```

### 工作流

系统集成了轻量级的工作流引擎，支持灵活的业务流程定义和执行：

- 流程设计：可视化流程设计器
- 任务管理：待办任务、已办任务、我发起的流程
- 流程监控：实时查看流程执行状态
- 流程报表：统计流程执行效率和分布

![工作流设计器](../images/workflow-designer.png)

## 移动端支持

XiHan.BasicApp 提供了完善的移动端支持：

### 响应式布局

所有页面采用响应式设计，自动适配不同屏幕尺寸：

- 桌面端：适配大屏和常规显示器
- 平板端：优化平板设备的操作体验
- 移动端：重新排列布局，适应手机屏幕

### 移动应用

提供基于 XiHan.UI 的移动应用程序：

- WebApp：基于浏览器的 Web 应用，无需安装
- 原生 App：封装的原生应用，提供更好的用户体验和设备访问能力
- 小程序：支持微信小程序等小程序平台

## 开发工具

### 代码生成器

系统提供了强大的代码生成器，可以快速生成标准的 CRUD 功能：

1. 选择数据表：选择需要生成代码的数据表
2. 配置生成选项：设置包名、作者、是否覆盖等
3. 配置列信息：设置字段的显示名称、是否显示等
4. 预览代码：预览将生成的前后端代码
5. 生成代码：生成并下载完整代码包

生成的代码包括：

- 实体类：对应数据表的实体类定义
- 数据访问：包含仓储接口和实现
- 服务层：业务逻辑服务
- 控制器：API 接口控制器
- 前端视图：包含列表、表单等页面
- 前端 API：调用后端接口的方法

### API 文档

系统集成了 Swagger API 文档，方便开发和调试：

- 接口列表：展示所有 API 接口
- 参数说明：详细的请求参数和响应说明
- 在线测试：可以直接在文档中测试 API
- 模型定义：展示数据模型结构

访问路径：`/swagger/index.html`

## 下一步

- 了解 [权限管理](./permissions) 的详细配置
- 学习如何使用 [工作流](./workflow) 功能
- 探索系统的 [API 接口](./api) 文档
