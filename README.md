# MUGEN OOTQ Ranking Wiki

MUGEN 论外分级制度角色 Wiki，基于 **GitHub Issue CMS**。

## 架构

- 角色数据存储在 GitHub Issues 中，页面运行时通过 GitHub API 拉取
- 角色 Issue 使用 `character` 标签，正文使用多语言 markdown 表格格式
- 详情页自动拉取 Issue 评论作为评论区
- 标签和分级从 `Tag-System.json` 中定义，前端通过关键词匹配自动检测
- 描述支持 **GitHub Flavored Markdown** 渲染
- 构建脚本将 `Tag-System.json` 注入前端模板

## 角色 Issue 数据格式

在 Issue 正文中使用 wrapper 格式包裹不同语言的内容：

```markdown
<!-- zh -->
## 基本信息

| 字段 | 值 |
|------|-----|
| **作者** | BlackCurl |
| **来源** | MUGEN |
| **启动方式** | %n启动 |
| **技术** | DTC型亲捏造:LIFE弄、noko解除 |
| **分级** | 论外下位C |
| **标签** | 参照, 西行寺幽幽子 |
| **下载链接** | [点击下载](https://example.com) |

## 角色介绍

![Chizomeno](https://github.com/user-attachments/assets/xxx)
<!-- zh -->
<!-- en -->
## Basic Info

| Field | Value |
|-------|-------|
| **Author** | BlackCurl |
| **Origin** | MUGEN |
| **Activation** | %N Trigger |
| **Techniques** | DTC-Type Fabrication Attack:LIFE Manipulation, NOKO Removal |
| **Tier** | Out-of-Topic Low C |
| **Tags** | Reference, 西行寺幽幽子 |
| **Download** | [Click to Download](https://example.com) |

## Character Introduction

![Chizomeno](https://github.com/user-attachments/assets/xxx)
<!-- en -->
```

图片直接拖拽上传到 Issue 正文中即可，前端自动提取。

### 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| **作者** | 是 | 角色作者 |
| **来源** | 是 | 角色来源作品/引擎 |
| **启动方式** | 否 | %n启动 / %N Trigger 等 |
| **技术** | 否 | 角色使用的技术，用逗号分隔 |
| **分级** | 是 | 填写 **标签关键词**（如 `论外下位C`），须与 `Tag-System.json` 中 `tier_system` 的 level 对应 |
| **标签** | 是 | 填写 **标签关键词**（如 `参照`、`Reference`），用逗号分隔，须与 `Tag-System.json` 中的条目对应 |
| **下载链接** | 否 | 角色下载地址 |

### 标签系统

标签和分级在 `Tag-System.json`（仓库根目录）中定义：

```json
{
  "character_system": {
    "reference": {
      "zh": ["参照", "参考角色"],
      "en": ["Reference"],
      "ja": ["参照"]
    }
  },
  "tier_system": {
    "Lower_Out_C": { "zh": "论外下位C", "en": "Out-of-Topic Low C", "ja": "論外下位C" }
  }
}
```

- 前端自动扫描正文全文，匹配任意语言的标签关键词（大小写不敏感）
- 所有标签内容均从 `Tag-System.json` 读取，无需在 JS 中硬编码

### 分级检测规则

- 在正文中找到的标签如果属于 `tier_system`，则自动为该角色设置对应分级
- 分级显示层级文本（如 `论外下位C`），样式按 `tier` 类（low/mid/high/top）区分

### 图片引用

正文中的图片自动提取，支持：
- 直接嵌入：`![alt](url)`
- HTML `<img>` 标签
- `<!-- image:N -->` 标识符引用（在 JSON 块中引用正文第 N 张图片）

### 增删改查

| 操作 | 方式 |
|------|------|
| 增 | 通过角色投稿模板新建 Issue |
| 查 | 页面自动从 GitHub API 拉取 |
| 改 | 编辑 Issue 正文 |
| 删 | 关闭或删除 Issue |

## 多语言切换

页面右上角提供语言下拉框（中文 / English / 日本語），切换后：
- 标签文本自动切换为对应语言
- 角色简介摘要切换为对应语言
- 详情页正文显示对应语言的内容块
- 语言偏好保存在 `localStorage` 中

## 本地构建

```bash
npm install
npm run build
```

构建输出目录：`docs/`

### 构建产物

- `docs/characters/index.html` — 角色列表页（主页面）
- `docs/index.html` — 首页（带跳转）
- `docs/glossary/index.html` — 术语表页（带跳转）

## 项目结构

```
Tag-System.json      # 标签/分级定义（多语言）
scripts/
  build.js           # 构建脚本（注入 Tag-System.json）
  convert-issues.js  # 旧格式迁移工具
src/
  assets/            # 静态资源
  styles/            # 样式
  templates/         # EJS 模板
    character-list.ejs  # 角色列表页模板（主模板，含全部 JS 逻辑）
    layout.ejs          # 布局模板（导航栏）
docs/                # 构建输出 (GitHub Pages)
.github/
  ISSUE_TEMPLATE/    # Issue 模板
```
