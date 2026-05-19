# Fork 后的改造步骤

Fork 本项目后，按以下 5 步完成品牌定制，通常 30 分钟内即可完成。

---

## 第 1 步：替换项目名称

修改以下文件中的项目名：

```bash
# package.json
"name": "your-project-name"

# index.html
<title>Your Project Name</title>

# src/config/menu.ts（可选）
# 修改应用标题和 Logo 文字
```

---

## 第 2 步：替换 Logo 和 Favicon

1. 替换 `public/favicon.ico`（建议尺寸：32×32 和 64×64）
2. 替换 Logo 图片（若使用图片 Logo）：放在 `src/assets/logo.svg`
3. 修改 `src/components/layout/AppLogo.tsx` 中的 Logo 渲染逻辑

---

## 第 3 步：修改主题色

编辑 `src/styles/index.css`，替换主色相关变量：

```css
:root {
  /* 将 210 100% 56%（科技蓝）替换为你的品牌色 */
  --primary: [H] [S%] [L%];
  --primary-foreground: 0 0% 100%;   /* 浅色文字（主色较深时） */
  --ring: [H] [S%] [L%];

  /* 侧边栏背景可保留深色，或改为品牌色 */
  --sidebar: [H] [S%] [L%];
  --sidebar-accent: [H] [S%] [L%];
  --sidebar-primary: [H] [S%] [L%];
  --sidebar-ring: [H] [S%] [L%];
}

.dark {
  --primary: [H] [S%] [L+10%];      /* 暗色模式适当提亮 */
  --primary-foreground: 0 0% 100%;
}
```

HSL 转换参考见 [docs/theme-guide.md](../docs/theme-guide.md)。

---

## 第 4 步：配置环境变量

```bash
cp .env.example .env
```

编辑 `.env`：

```env
# 后端 API 根路径
VITE_API_BASE_URL=https://your-api.example.com/api

# 高德地图 Key（使用地图组件时必填）
# 申请地址：https://console.amap.com/
VITE_AMAP_KEY=your_amap_key_here
```

---

## 第 5 步：配置菜单路由

编辑 `src/config/menu.ts`，根据业务需求增删菜单项：

```ts
export const menuConfig = [
  {
    key: 'dashboard',
    label: '控制台',
    icon: 'LayoutDashboard',
    path: '/dashboard',
  },
  {
    key: 'user',
    label: '用户管理',
    icon: 'Users',
    children: [
      { key: 'user-list', label: '用户列表', path: '/user/list' },
      { key: 'user-role', label: '角色权限', path: '/user/role' },
    ],
  },
  // 删除不需要的组件预览菜单...
]
```

---

## 完成！

完成以上 5 步后：

- 运行 `npm run dev` 验证效果
- 运行 `npm run build` 确认构建无错误
- 按需删除 `src/pages/components/` 下的组件预览页（生产环境不需要）

如需进一步定制（字体、圆角、间距等），参考 [docs/theme-guide.md](../docs/theme-guide.md) 中的 CSS Token 清单。
