# 错误代码

本指南包括您可能从API和我们的官方Python库中看到的错误代码概述。概述中提到的每个错误代码都有一个专门的部分，提供进一步的指导。

## API错误

代码 |概述
--|--
401 - 无效的身份验证 |原因：身份验证无效。 |解决方案：确保使用了正确的API密钥和请求组织。
401 - 提供了不正确的API密钥 |原因：请求的API密钥不正确。解决方案：确保使用的API密钥是正确的，清除浏览器缓存或生成一个新的API密钥。
401 - 您必须是组织成员才能使用API |原因：您的帐户不属于任何组织。 解决方案：联系我们以加入新组织，或要求您所在组织管理员邀请您加入该组织。
429 - 请求速率达到限制 |原因：您发送请求过快。  解决方案：控制好请求速率。阅读速率限制指南。
429 - 您已超出当前配额，请检查计划和账单详细信息。| 原因: 您已达到最大月度支出（硬性限制），可以在账户结算部分中查看此限制.解决方案: 申请增加配额.
429 - 引擎目前负载过高，请稍后再试。| 原因: 我们服务器正在经历高流量情况. 解决方法: 请稍等片刻后重试你的请求.
500-服务器处理您的请求时发生错误. |原因: 我们的服务器出现问题.  解决方案: 请稍等片刻后重试您的请求，如果问题仍然存在，请联系我们。检查状态页面。

### 401 - 无效身份验证

此错误消息表示您的身份验证凭据无效。这可能会发生多种原因，例如：

- 您正在使用已撤销的API密钥。

- 您正在使用与请求组织分配的不同API密钥。

- 您正在使用一个没有所调用端点所需权限的API密钥。

要解决此错误，请按照以下步骤操作：

- 检查在请求头中是否正确使用了 API 密钥和组织 ID。 您可以在帐户设置中找到 API 密钥和组织 ID。

- 如果不确定 API 密钥是否有效，则可以生成新的 API 密钥。 确保将旧 API 密钥替换为新密钥，并遵循我们的最佳实践指南。

### 401 - 提供的API密钥不正确

此错误消息表示您在请求中使用的API密钥不正确。这可能会发生多种原因，例如：

- 您的API密钥中有错别字或额外空格。

- 您正在使用属于其他组织的API密钥。

- 您正在使用已删除或停用的API密钥。

- 旧版被吊销的API密钥可能会在本地缓存。

要解决此错误，请按照以下步骤操作：

- 尝试清除浏览器缓存和Cookie，然后重试。

- 检查是否在请求头中使用了正确的API密钥。

- 如果您不确定自己的API密钥是否正确，则可以生成一个新的。确保替换代码库中旧版 API 密钥，并遵循我们最佳实践指南。

### 401 - 您必须是组织的成员才能使用API

此错误消息表示您的帐户不属于任何组织。这可能有几个原因，例如：

- 您已经离开或被移除了之前所在的组织。

- 您所在的组织已被删除。

要解决此错误，请按照以下步骤操作：

- 如果您已经离开或被移除了之前所在的组织，则可以请求一个新的组织或者加入现有的一个。

- 要请求新组织，请通过help.openai.com与我们联系

- 现有组织所有者可以通过成员面板邀请您加入他们的组织。

### 429- 请求速率限制已达上限

此错误消息表示您已达到API的分配速率限制。这意味着您在短时间内提交了太多令牌或请求，并超过了允许的请求数量。可能会出现以下几种情况：

- 您正在使用频繁或并发请求的循环或脚本。

- 您正在与其他用户或应用程序共享API密钥。

- 您正在使用具有低速率限制的免费计划。

要解决此错误，请按照以下步骤操作：

- 控制请求速度，避免进行不必要或重复调用。

- 如果您正在使用循环或脚本，请确保实施回退机制或重试逻辑以尊重速率限制和响应标头。您可以在我们的速率限制指南中阅读更多关于我们的速率限制策略和最佳实践。

- 如果您与其他用户共享组织，请注意每个组织都会应用限制，而不是每个用户。值得检查团队其余部分的使用情况，因为这将对极限产生影响。

- 如果您正在使用免费计划或低级别计划，请考虑升级到按需付款计划，该计划提供更高的速率限制。您可以在我们的速率限制指南中比较每个计划的限制。

### 429 - 您已超出当前配额，请检查您的计划和账单详细信息

此错误消息表示您已达到 API 的最大月度支出。您可以在 [帐户结算设置](/account/billing/limits) 中的“硬限制”下查看您的最大月度限制。这意味着您已经消耗了分配给您计划的所有信用点，并且已经达到了当前结算周期的限制。这可能是由于以下几个原因造成：

- 您正在使用一个消耗大量信用点或令牌的高容量或复杂服务。

- 您为组织使用设置了过低的限制。

要解决此错误，请按照以下步骤操作：

-  在帐户设置中检查当前配额。在帐户使用情况部分，可以看到请求所消耗令牌数量。

- 如果您正在使用免费计划，请考虑升级为按需付费计划以获得更高的配额。

-  如果需要增加配额，则可以申请并提供有关预期使用情况的相关详细信息。我们将审核您的请求，并在 7-10 个工作日内回复给你。

### 429 - 引擎当前超载，请稍后再试

此错误消息表示我们的服务器正在经历高流量，并且暂时无法处理您的请求。这可能会发生多种原因，例如：

- 我们的服务突然出现了需求激增或浪涌。

- 我们的服务器上有计划或未计划的维护或更新。

- 我们的服务器上发生了意外或不可避免的故障或事件。

要解决此错误，请按照以下步骤操作：

- 在短暂等待后重试您的请求。 我们建议使用指数退避策略或尊重响应标头和速率限制的重试逻辑。 您可以阅读更多关于我们速率限制最佳实践方面内容。

- 检查我们状态页面以获取有关服务和服务器方面任何更新或公告信息。

- 如果一段合理时间后仍然收到此错误，请联系我们寻求进一步帮助。 我们为任何不便道歉，并感谢您耐心和理解。

## Python库错误类型

类型 |概述
--|--
API错误| 原因：我们这边出现问题。  解决方案：稍等片刻后重试请求，如果问题仍然存在，请联系我们。
超时 | 原因：请求超时。  解决方案：稍等片刻后重试请求，如果问题仍然存在，请联系我们。
请求频率限制错误 | 原因：您已达到分配的速率限制。 解决方案：控制您的请求速度。在我们的速率限制指南中阅读更多信息。
API连接错误| 原因：连接到我们服务时出现问题。  解决方案: 检查您的网络设置、代理配置、SSL证书或防火墙规则等。
无效请求错误 |原因: 请求格式不正确或缺少某些必需参数，例如令牌或输入内容。  解决方法: 错误消息应该会提示具体错误信息。检查调用特定 API 方法所需的文档，并确保发送有效和完整参数。还可能需要检查请求数据的编码、格式或大小。
认证错误 |原因: 您的 API 密钥或令牌无效、过期或被撤销了。 解决方法: 检查您的 API 密钥或令牌，并确保其正确且处于活动状态。您可能需要从帐户面板生成一个新密钥。
服务不可用错误 |原因: 我们服务器上出现了问题.  解決方法 :稍等片刻后重试请求，如果问题仍然存在，请联系我们。请检查状态页面。

### API错误

“API错误”表示在处理您的请求时我们出现了问题。这可能是由于临时错误、漏洞或系统故障引起的。

对此给您带来的不便，我们深表歉意，并正在努力尽快解决任何问题。您可以查看我们的系统状态页面获取更多信息。

如果遇到`APIError`，请尝试以下步骤：

- 等待几秒钟并重试您的请求。有时候，问题可能会很快得到解决，并且第二次尝试可能会成功。

- 检查我们的状态页面以获取可能影响我们服务的任何持续事件或维护情况。如果存在活动事件，请关注更新并等待其解决后再重新尝试请求。

- 如果问题仍然存在，请查看我们的“持续错误下一步”部分。

我们支持团队将调查该问题，并尽快回复您。请注意，由于需求量大，支持队列时间可能较长。 您也可以在社区论坛中发布文章，但请确保省略任何敏感信息。

### 超时错误

“超时错误”表示您的请求花费的时间太长，我们的服务器关闭了连接。这可能是由于网络问题、我们服务负载过重或需要更多处理时间的复杂请求引起的。

如果遇到`Timeout`，请尝试以下步骤：

- 等待几秒钟并重试您的请求。有时候，网络拥堵或我们服务负载会减少，第二次尝试可能会成功。

- 检查您的网络设置，并确保您拥有稳定和快速的互联网连接。您可能需要切换到不同的网络、使用有线连接或减少使用带宽设备或应用程序数量。

- 如果问题仍然存在，请查看我们持久性错误下一步操作部分。

### 请求频率限制错误

"请求频率限制错误" 表示您已达到分配的速率限制。这意味着您在给定时间段内发送了太多令牌或请求，我们的服务暂时阻止您发送更多请求。

我们实施速率限制以确保公平和有效地使用我们的资源，并防止滥用或超载我们的服务。

如果遇到`RateLimitError`，请尝试以下步骤：

减少令牌或请求数量，放慢速度。您可能需要降低请求频率或数量、批处理令牌或实现指数退避。您可以阅读我们的速率限制指南获取更多详细信息。

等待直到你的速率限制重置（一分钟）并重试你的请求。错误消息应该让你知道你的使用率和允许使用情况。

您还可以从帐户控制面板检查 API 使用统计数据。

###API连接错误

“APIConnectionError”表示您的请求无法到达我们的服务器或建立安全连接。这可能是由于网络问题、代理配置、SSL证书或防火墙规则引起的。

如果遇到`APIConnectionError`，请尝试以下步骤：

- 检查您的网络设置，确保您拥有稳定和快速的互联网连接。您可能需要切换到不同的网络、使用有线连接或减少使用带宽的设备或应用程序数量。

- 检查代理配置，并确保其与我们的服务兼容。您可能需要更新代理设置、使用不同代理或完全绕过代理。

- 检查SSL证书并确保它们有效且最新。您可能需要安装或更新证书、使用不同证书颁发机构或禁用SSL验证。

- 检查防火墙规则并确保它们没有阻止或过滤我们的服务。您可能需要修改防火墙设置。

- 如适当，检查容器是否具有发送和接收流量所需权限。

- 如果问题仍然存在，请参考我们持久性错误下一步操作部分。

### 无效请求错误

`InvalidRequestError`表示您的请求格式不正确或缺少某些必需参数，例如令牌或输入。这可能是由于代码中的拼写错误、格式错误或逻辑错误引起的。

如果遇到`InvalidRequestError`，请尝试以下步骤：

- 仔细阅读错误消息，并确定具体出错原因。错误消息应该会提示哪个参数无效或缺失，以及期望的值或格式。

- 检查您调用的特定API方法的API参考文档，并确保发送有效和完整的参数。您可能需要查看参数名称、类型、值和格式，并确保它们与文档匹配。

- 检查请求数据的编码、格式或大小，并确保它们与我们的服务兼容。您可能需要将数据编码为UTF-8，在JSON中对数据进行格式化，如果数据太大，则压缩数据。

- 使用Postman或curl等工具测试请求并确保其按预期工作。您可能需要调试代码并修复任何请求逻辑中存在的错误或不一致性。

- 如果问题仍然存在，请查看我们持久性错误下一步操作部分。

### 身份验证错误

“身份验证错误”表示您的API密钥或令牌无效、过期或被撤销。这可能是由于打字错误、格式错误或安全漏洞引起的。

如果遇到`AuthenticationError`，请尝试以下步骤：

- 检查您的API密钥或令牌，确保它正确且处于活动状态。您可能需要从API密钥控制面板生成新密钥，确保没有额外的空格或字符，或者如果有多个，则使用不同的键或令牌。

- 确保已按照正确格式进行操作。

### 服务不可用错误

“服务不可用错误”表示我们的服务器暂时无法处理您的请求。这可能是由于计划或非计划维护、系统升级或服务器故障引起的。在高流量期间，也可能返回这些错误。

对此给您带来不便，我们深表歉意，并正在努力尽快恢复服务。

如果遇到`ServiceUnavailableError`，请尝试以下步骤：

- 等待几分钟并重试您的请求。有时候问题可能会很快解决，下一次尝试就可以成功。

- 查看我们的状态页面以了解任何影响我们服务的持续事件或维护情况。如果存在活动事件，请关注更新并等待其解决后再重新尝试请求。

- 如果问题仍然存在，请查看我们持久性错误下一步部分。

### 持续出现错误

如果问题仍然存在，请通过聊天联系我们的支持团队，并向他们提供以下信息：

- 您使用的模型

- 您收到的错误消息和代码

- 您发送的请求数据和标头

- 您请求时的时间戳和时区

- 任何其他相关详细信息，可能有助于我们诊断问题。

我们的支持团队将调查该问题，并尽快回复您。请注意，由于需求量大，我们的支持队列时间可能很长。 您也可以在我们的社区论坛上发布帖子，但务必省略任何敏感信息。

### 处理错误

我们建议您以编程方式处理API返回的错误。为此，您可能希望使用以下代码片段：

```
try:
  #Make your OpenAI API request here
  response = openai.Completion.create(prompt="Hello world",
                                      model="text-davinci-003")
except openai.error.APIError as e:
  #Handle API error here, e.g. retry or log
  print(f"OpenAI API returned an API Error: {e}")
  pass
except openai.error.APIConnectionError as e:
  #Handle connection error here
  print(f"Failed to connect to OpenAI API: {e}")
  pass
except openai.error.RateLimitError as e:
  #Handle rate limit error (we recommend using exponential backoff)
  print(f"OpenAI API request exceeded rate limit: {e}")
  pass
```









