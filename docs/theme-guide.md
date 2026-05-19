# 主题定制指南

---

## 如何修改默认主题色

主题色通过 `src/styles/index.css` 中的 CSS 变量控制，格式为 **HSL 三元组**（不含 `hsl()`）。

### 第一步：找到变量位置

```css
/* src/styles/index.css */
:root {
  --primary: 210 100% 56%;          /* 亮色模式主色 */
  --primary-foreground: 0 0% 100%;  /* 主色上的文字色（需保证对比度 ≥ 4.5:1） */
  --ring: 210 100% 56%;             /* 聚焦环颜色，通常与 primary 一致 */
}

.dark {
  --primary: 210 100% 56%;          /* 暗色模式主色（可与亮色不同） */
  --primary-foreground: 0 0% 100%;
}
```

### 第二步：转换品牌色

将十六进制转为 HSL：

| 品牌色 | 十六进制 | HSL |
|--------|---------|-----|
| 科技蓝（默认） | `#1890ff` | `210 100% 56%` |
| 极光绿 | `#52c41a` | `100 77% 44%` |
| 活力橙 | `#fa8c16` | `35 95% 53%` |
| 梦幻紫 | `#722ed1` | `270 67% 50%` |
| 玫瑰红 | `#eb2f96` | `328 83% 55%` |

在线转换工具：https://hslpicker.com

### 第三步：替换变量

```css
:root {
  --primary: 270 67% 50%;           /* 改为梦幻紫 */
  --primary-foreground: 0 0% 100%;
  --ring: 270 67% 50%;

  /* Sidebar 主色同步 */
  --sidebar-accent: 270 67% 50%;
  --sidebar-primary: 270 67% 50%;
  --sidebar-ring: 270 67% 50%;
}

.dark {
  --primary: 270 67% 60%;           /* 暗色模式可适当提亮 */
  --primary-foreground: 0 0% 100%;
}
```

---

## 如何 Fork 新项目并快速改造品牌

详细步骤见 [`.github/FORK_GUIDE.md`](../.github/FORK_GUIDE.md)，共 5 步完成品牌定制。

---

## CSS Token 变量完整清单

> 定义位置：`src/styles/index.css` `:root` 块，Tailwind 通过 `@theme inline` 映射为 `bg-*`、`text-*` 等工具类。

### 基础色彩 Token

| 变量 | Tailwind 类 | 说明 |
|------|------------|------|
| `--background` | `bg-background` / `text-background` | 页面背景色 |
| `--foreground` | `text-foreground` | 页面默认文字色 |
| `--card` | `bg-card` | 卡片背景色 |
| `--card-foreground` | `text-card-foreground` | 卡片文字色 |
| `--popover` | `bg-popover` | 弹出层背景色 |
| `--popover-foreground` | `text-popover-foreground` | 弹出层文字色 |
| `--primary` | `bg-primary` / `text-primary` | **主色**（品牌色） |
| `--primary-foreground` | `text-primary-foreground` | 主色上的文字色 |
| `--secondary` | `bg-secondary` | 次要色（浅灰蓝） |
| `--secondary-foreground` | `text-secondary-foreground` | 次要色文字 |
| `--muted` | `bg-muted` | 静音背景（极浅） |
| `--muted-foreground` | `text-muted-foreground` | 次要文字（灰色） |
| `--accent` | `bg-accent` | 强调色背景 |
| `--accent-foreground` | `text-accent-foreground` | 强调色文字 |

### 语义色彩 Token

| 变量 | Tailwind 类 | 说明 |
|------|------------|------|
| `--destructive` | `bg-destructive` / `text-destructive` | 危险/错误色（红） |
| `--destructive-foreground` | `text-destructive-foreground` | 危险色上的文字 |
| `--success` | `bg-success` / `text-success` | 成功色（绿） |
| `--success-foreground` | `text-success-foreground` | 成功色上的文字 |
| `--warning` | `bg-warning` / `text-warning` | 警告色（橙） |
| `--warning-foreground` | `text-warning-foreground` | 警告色上的文字 |
| `--info` | `bg-info` / `text-info` | 信息色（蓝，通常同 primary） |
| `--info-foreground` | `text-info-foreground` | 信息色上的文字 |

### 边框 & 表单 Token

| 变量 | Tailwind 类 | 说明 |
|------|------------|------|
| `--border` | `border-border` | 通用边框色 |
| `--input` | `border-input` | 表单输入框边框色 |
| `--ring` | `ring-ring` | 聚焦环颜色（通常同 primary） |

### 圆角 Token

| 变量 | Tailwind 类 | 说明 |
|------|------------|------|
| `--radius` | — | 基础圆角值（默认 `0.375rem`） |
| `--radius-lg` | `rounded-lg` | 大圆角（= `--radius`） |
| `--radius-md` | `rounded-md` | 中圆角（= `--radius - 2px`） |
| `--radius-sm` | `rounded-sm` | 小圆角（= `--radius - 4px`） |

### Sidebar Token（侧边栏）

| 变量 | 说明 |
|------|------|
| `--sidebar` | 侧边栏背景色（默认深色） |
| `--sidebar-foreground` | 侧边栏文字色 |
| `--sidebar-border` | 侧边栏边框色 |
| `--sidebar-accent` | 侧边栏选中/悬停高亮色 |
| `--sidebar-accent-foreground` | 侧边栏高亮文字色 |
| `--sidebar-primary` | 侧边栏主色（通常同 primary） |
| `--sidebar-primary-foreground` | 侧边栏主色文字 |
| `--sidebar-ring` | 侧边栏聚焦环 |

### 其他 Token

| 变量 | 说明 |
|------|------|
| `--page-bg` | 内容区背景色（Layout 使用，区别于卡片白色） |
| `--font-sans` | 默认字体族（PingFang SC → Microsoft YaHei → Helvetica Neue） |

---

## 暗色模式

暗色模式变量定义在 `.dark` 选择器下，由 `next-themes` 在 `<html>` 上切换 `dark` class 触发。

应用中所有组件的颜色均通过 CSS 变量引用，暗色模式下自动切换，**无需额外处理**。

若需要针对暗色模式调整某个组件：

```css
/* 不推荐：直接写死颜色 */
.my-component { color: #333; }

/* 推荐：使用 CSS 变量 */
.my-component { color: hsl(var(--foreground)); }

/* 或使用 Tailwind 工具类 */
/* <div className="text-foreground bg-card"> */
```
