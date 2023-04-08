# 生产中的插件

## 速率限制

考虑在您公开的API端点上实施速率限制。尽管当前规模有限，但ChatGPT被广泛使用，您应该预期会有大量请求。您可以监视请求数量并相应地设置限制。

## 更新插件

在将插件部署到生产环境后，您可能希望对ai-plugin.json清单文件进行更改。目前，每次更改文件时必须通过“开发自己的插件”流程手动更新清单文件。

ChatGPT会在每次请求时自动获取最新的OpenAPI规范。

## 插件条款

为了注册插件，您必须同意插件条款。

## 域验证和安全性

为确保插件只能在其控制的资源上执行操作，OpenAI 对插件的清单和 API 规范施加要求。

### 定义插件的根域名

清单文件定义了向用户显示的信息（如标志和联系信息）以及托管插件OpenAPI规范的URL。当获取清单时，将按照以下规则建立插件的根域名：

- 如果域名有`www`作为子域名，则根域将从托管清单的域中删除`www`

- 否则，根域与托管清单的域相同。

关于重定向的说明：如果在解析清单时存在任何重定向，则只允许子域名重定向。唯一的例外是从带有www的子域名重定向到没有www的子域名。

根域看起来像以下示例：

- ✅ `https://example.com/.well-known/ai-plugin.json
`
- 根域名：`example.com`

- ✅ `https://www.example.com/.well-known/ai-plugin.json`

- 根域名：`example.com`

- ✅ `https://www.example.com/.well-known/ai-plugin.json` →重定向到
`https://example.com/.well-known/ai-plugin.json`

- 根域名：`example.com`

- ✅ `https://foo.example.com/.well-known/ai-plugin.json` →重定向到
`https://bar.foo.example.com/.well-known/ai-plugin.json`
- 根域名：`bar.foo.example.com`

- ✅ `https://foo.example.com/.well-known/ai-plugin.json` →重定向到
`https://bar.foo.example.com/baz/ai-plugin.json`
- 根域名：`bar.foo.example.com`

- ❌ `https://foo.example.com/.well-known/ai-plugin.json` →重定向到
`https://example.com/.well-known/ai-plugin.json`

- 重定向到父级域名被禁止

- ❌ `https://foo.example.com/.well-known/ai-plugin.json `→ 重定向到
`https://bar.example.com/.well-known/ai-plugin.json`

- 重定向到同级子域名是不允许的

- ❌ `https://example.com/.well-known/ai-plugin.json` ->重定向到
`https://example2.com/.well-known/ai-plugin.json`
- 重定向到另一个域名是不允许的

### 清单验证

清单本身中的特定字段必须满足以下要求：

- `api.url` -提供给 OpenAPI 规范的 URL 必须托管在根域或其子域的同一级别。

- `legal_info` -提供的URL的二级域名必须与根域名的二级域名相同。
- `contact_info` -电子邮件地址的二级域名应与根域名的二级域名相同。

### 解决API规范

这个`api.url`清单中的字段提供了一个链接到 OpenAPI 规范的接口，该规范定义了插件可以调用的 API。OpenAPI 允许指定多个服务器基本 URL。以下逻辑用于选择服务器 URL：

- 遍历服务器URL列表 

- 使用第一个与根域名完全匹配或是根域名的子域名的服务器URL。

如果以上两种情况都不适用，则默认使用 API 规范所托管的域。例如，如果规范托管在`api.example.com`, 然后`api.example.com`将用作OpenAPI规范中路由的基本URL。

注意：请避免使用重定向来托管API规范和任何API端点，因为不能保证重定向始终会被跟随。

### 使用TLS和HTTPS

与插件的所有流量(例如，获取`ai-plugin.json`文件OpenAPI规范，API调用)必须在端口443上使用TLS 1.2或更高版本，并具有有效的公共证书。

### IP 出口范围

ChatGPT 将从 CIDR 块中的 IP 地址调用您的插件`23.102.140.112/28`.您可能希望明确允许这些IP地址。

另外，OpenAI的网络浏览插件从不同的IP地址块爬取网站：`23.98.142.176/28`.

## 常见问题解答

### 插件数据如何使用？

插件将ChatGPT连接到外部应用程序。如果用户启用了插件，则ChatGPT可能会向您的插件发送他们对话的部分内容以及他们所在的国家或州。

### 如果我的 API 请求失败会发生什么？

如果一个 API 请求失败，模型可能会在告知用户无法从该插件获取响应之前尝试重试请求多达 10 次。

### 我可以邀请人们尝试我的插件吗？

是的，所有未经验证的插件最多可供15个用户安装。在发布时，只有其他具有访问权限的开发人员才能安装该插件。我们计划随着时间推移扩大访问范围，并最终推出一个提交您的插件进行审核后向所有用户提供之前的流程。






