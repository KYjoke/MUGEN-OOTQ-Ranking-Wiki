# MUGEN OOTQ Ranking Wiki

MUGEN 论外分级制度角色 Wiki，基于 **GitHub Issue CMS**。

## 架构

- 角色数据存储在 GitHub Issues 中，页面运行时通过 GitHub API 拉取
- 角色 Issue 使用 `character` 标签，正文包含一个 JSON 代码块
- 详情页自动拉取 Issue 评论作为评论区
- 描述支持 **HTML** 和 **GitHub Flavored Markdown** 渲染
- Issue Template 提供角色投稿、Bug 报告、功能建议三种模板

## 角色 Issue 数据格式

在 Issue 正文粘贴：

```json
{
  "slug": "chizomeno",
  "title": { "zh": "Chizomeno", "en": "Chizomeno", "ja": "Chizomeno" },
  "summary": { "zh": "摘要", "en": "Summary", "ja": "要約" },
  "ootqTier": "low",
  "ootqLevel": { "zh": "论外下位C", "en": "Out-of-Topic Low C", "ja": "論外下位C" },
  "origin": "MUGEN",
  "author": "BlackCurl",
  "activation": ["%n启动"],
  "techniques": ["LIFE改写"],
  "tags": { "zh": ["参考"], "en": ["Reference"], "ja": ["参考"] },
  "image": "https://example.com/cover.png",
  "downloadUrl": "https://example.com/download",
  "description": { "zh": "<p>详情</p>", "en": "<p>Details</p>", "ja": "<p>詳細</p>" }
}
```

### 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `slug` | 是 | URL 标识，英文小写+连字符 |
| `title` | 是 | 多语言标题 `{ zh, en, ja }` |
| `summary` | 否 | 多语言摘要 |
| `ootqTier` | 是 | 分级：`top` / `high` / `mid` / `low` |
| `ootqLevel` | 否 | 展示用层级文本 |
| `origin` | 否 | 来源 |
| `author` | 否 | 作者 |
| `activation` | 否 | 启动方式数组 |
| `techniques` | 否 | 技术数组 |
| `tags` | 否 | 多语言标签 |
| `image` | 否 | 图片 URL 或 `docs/img/` 下文件名 |
| `downloadUrl` | 否 | 下载链接 |
| `description` | 否 | 多语言详细描述，支持 HTML 和 Markdown |

### 标签

- 必填：`character`（模板自动添加）
- 辅助：`slug:<slug>`、`tier:top|high|mid|low`、`level:<text>`

### 增删改查

| 操作 | 方式 |
|------|------|
| 增 | 通过角色投稿模板新建 Issue |
| 查 | 页面自动从 GitHub API 拉取 |
| 改 | 编辑 Issue 正文/标签 |
| 删 | 关闭或删除 Issue |

## 本地构建

```bash
npm install
npm run build
```

构建输出目录：`docs/`

## 项目结构

```
src/
  assets/          # 静态资源 (github.svg)
  scripts/         # 客户端脚本 (i18n.js)
  styles/          # 样式 (main.css, github-markdown.css)
  templates/       # EJS 模板
scripts/
  build.js         # 构建脚本
docs/              # 构建输出 (GitHub Pages)
.github/
  ISSUE_TEMPLATE/  # Issue 模板
```
