# Local Agent Wizard 运营说明

## 上线前检查

- 绑定域名后，把所有页面里的 `https://localagentwizard.com/` 替换为真实域名。
- 在 Google Search Console / Bing Webmaster 提交 `sitemap.xml`。
- 确认 `privacy.html` 中说明了统计和广告方式。

## 统计埋点

当前 `analytics.js` 只把事件写入浏览器 `localStorage`，不上传数据。

已有事件：

- `page_view`
- `click`
- `diagnose_run`

调试方式：

```text
?debug_analytics=1
```

上线后可替换为 Plausible / Umami / Cloudflare Web Analytics。建议继续避免收集用户生成的配置内容和报错全文。

## 广告位

广告配置集中在 `ads.js`。

当前广告位：

- `default`：首页 / 合作页通用赞助位
- `guide-affiliate`：教程页联盟推荐位
- `diagnose-sidebar`：报错诊断页高意图转化位

建议投放顺序：

1. 联盟链接：云 GPU、硬件、AI IDE。
2. 固定赞助：本地 AI 工具、MCP 服务商。
3. 自营产品：模板包、配置诊断、课程。

## SEO 内容计划

优先补这些关键词页面：

- best local ai model for 16gb ram
- ollama cursor mcp setup
- local ai agent windows nvidia
- qwen agent tutorial
- ollama connection refused fix
- cursor mcp filesystem setup

## 转化路径

推荐主路径：

1. SEO 教程页进入。
2. 点击 Wizard 生成配置。
3. 如果失败，进入报错诊断。
4. 诊断页引导到付费配置诊断或重新生成保守配置。

## 商业化 SKU

当前站点已预留 4 类产品：

1. 免费工具
   - 入口：`local-agent-wizard.html`
   - 目标：获客、建立信任、收集需求

2. 高级模板包
   - 入口：`templates.html`
   - 建议价格：单模板 $9-$19，完整包 $29-$49
   - 交付方式：Gumroad / Lemon Squeezy / Stripe Payment Link / 小报童

3. 一对一配置诊断
   - 入口：`pricing.html`、`diagnose.html`
   - 建议价格：$49 起
   - 交付方式：邮件 + 远程会议 + 修复清单

4. 企业私有化部署咨询
   - 入口：`pricing.html`
   - 报价方式：按项目报价
   - 交付内容：硬件评估、模型选型、权限策略、内部 Agent 模板

建议先验证模板包和配置诊断，不要过早开发账号系统。

## 商业化页面

- `pricing.html`：定价和服务梯度
- `templates.html`：高级模板包落地页
- `advertise.html`：广告合作页
- `diagnose.html`：高意图转化页

## 后续可做

- 把邮箱订阅从 `mailto:` 换成 Buttondown / ConvertKit / Resend Form。
- 增加配置评分和智能降级方案。
- 把报错诊断规则扩展到 30+ 条。
- 为每篇教程加真实截图和视频。

## 评论区

当前评论系统由 `comments.js` 提供，只保存在用户浏览器的 `localStorage`，适合 MVP 演示和本地反馈收集，不适合正式社区。

当前能力：

- 发布留言
- 回复留言
- 点赞
- 按页面路径隔离评论
- 导出本页留言 JSON
- 清空本地留言

正式上线可选方案：

1. Giscus
   - 基于 GitHub Discussions
   - 适合开源项目和开发者用户
   - 成本低，天然有反垃圾能力

2. Utterances
   - 基于 GitHub Issues
   - 更轻量，但互动结构不如 Discussions

3. Supabase Comments
   - 自建 `comments` 表
   - 可做审核、置顶、邮件通知
   - 适合后续做账号系统

4. 第三方评论服务
   - 例如 Disqus、Cusdis
   - 接入快，但隐私和广告控制较弱

建议路线：

- MVP：保留当前本地评论演示。
- 开源后：切换到 Giscus。
- 做用户账号/付费诊断后：迁移到 Supabase。

注意：诊断页评论可能包含用户粘贴的报错路径或敏感信息，正式上线前要增加隐私提醒和删除入口。
