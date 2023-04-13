# 插件认证

插件提供多种认证模式以适应各种用例。要指定插件的身份验证模式，请使用清单文件。我们的插件域策略概述了我们解决域安全问题的策略。有关可用身份验证选项的示例，请参阅示例部分，其中展示了所有不同的选择。

请注意，`ai-plugin.json` 文件需要设置一个`auth`待设置的架构。即使您选择不使用身份验证，仍然需要指定 `"auth": { "type": "none" }`。

## 无需身份验证

我们支持无需身份验证的应用程序，其中用户可以直接向您的API发送请求而不受任何限制。如果您有一个开放式API希望让所有人都能使用，这将非常有用，因为它允许来自除OpenAI插件请求之外的其他来源的流量。

```
"auth": {
  "type": "none"
},
```

## 服务水平

如果您想要专门启用OpenAI插件与您的API一起工作，可以在插件安装流程中提供客户端密钥。这意味着来自OpenAI插件的所有流量都将得到身份验证，但不是在用户级别上进行的。此流程具有简单的最终用户体验，但从API角度来看控制较少。

- 首先，开发者需要粘贴他们的访问令牌（全局密钥）
- 然后，他们必须将验证令牌添加到其清单文件中
- 我们存储令牌的加密版本
- 用户在安装插件时不需要做任何事情
- 最后，在向插件发送请求时，我们通过授权标头传递它（“Authorization”：“[Bearer/Basic][user’s token]”）

```
"auth": {
  "type": "service_http",
  "authorization_type": "bearer",
  "verification_tokens": {
    "openai": "cb7cdfb8a57e45bc8ad7dea5bc2f8324"
  }
},
```

## 用户级别

就像用户可能已经在使用您的API一样，我们通过启用最终用户将其秘密API密钥复制并粘贴到ChatGPT UI中来允许用户级别身份验证。虽然我们在存储它时加密了秘密密钥，但考虑到糟糕的用户体验，我们不建议采用这种方法。

- 首先，在安装插件时，用户会粘贴其访问令牌
- 我们存储令牌的加密版本
- 然后，在向插件发出请求时将其传递给Authorization标头（“Authorization”：“[Bearer / Basic] [user's token]”）

```
"auth": {
  "type": "user_http",
  "authorization_type": "bearer",
},
```

## OAuth

该插件协议与OAuth兼容。我们在清单中期望的OAuth流程的简单示例如下：

- 首先，开发人员粘贴他们的OAuth客户端ID和客户端密钥
- 然后，他们必须将验证令牌添加到其清单文件中
- 我们存储客户端密钥的加密版本
- 用户在安装插件时通过插件网站登录
- 这为我们提供了用户的OAuth访问令牌（以及可选的刷新令牌），我们对其进行加密存储。
- 最后，在向插件发送请求时，在Authorization标头中传递该用户令牌（“Authorization”：“[Bearer / Basic] [user's token]”）

```
"auth": {
  "type": "oauth",
  "client_url": "https://my_server.com/authorize",
  "scope": "",
  "authorization_url": "https://my_server.com/token",
  "authorization_content_type": "application/json",
  "verification_tokens": {
    "openai": "abc123456"
  }
},
```

为了更好地理解OAuth的URL结构，这里简要介绍一下字段：

- 当您在ChatGPT上设置插件时，将被要求提供您的`client_id`和`client_secret`。

- 当用户登录插件时，ChatGPT将会指引用户的浏览器前往`"[client_url]?response_type=code&client_id=[client_id]&scope=[scope]&redirect_uri=https%3A%2F%2Fchat.openai.com%2Faip%2F[plugin_id]%2Foauth%2Fcallback"`

- 在您的插件重定向回给定的redirect_uri之后，ChatGPT将通过向其发出POST请求来完成OAuth流程`authorization_url`具有内容类型`authorization_content_type`
和参数`{ “grant_type”: “authorization_code”, “client_id”: [client_id], “client_secret”: [client_secret], “code”: [the code that was returned with the redirect], “redirect_uri”: [the same redirect uri as before] }`








