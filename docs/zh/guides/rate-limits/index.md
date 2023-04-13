# 速率限制

## 概述

### 什么是速率限制？

速率限制是API对用户或客户端在指定时间内访问服务器的次数所施加的限制。

### 为什么我们有速率限制？

速率限制是API的常见做法，它们出于几个不同的原因而被设置：

- 它们有助于防止滥用或误用API。例如，恶意行为者可能会通过请求洪水攻击API，试图使其超载或导致服务中断。通过设置速率限制，OpenAI可以防止这种活动。

- 速率限制有助于确保每个人都能公平地访问API。如果一个人或组织发出过多的请求，可能会拖慢其他所有用户的API。通过调节单个用户可以进行的请求数量，OpenAI确保尽可能多的人有机会使用API而不经历减速。

- 速率限制可以帮助OpenAI管理其基础设施上的总负载。如果对API的请求急剧增加，则可能会对服务器造成压力并导致性能问题。通过设置速率限制，OpenAI可以帮助所有用户维护平稳一致体验。

>请完整阅读此文档，以更好地了解OpenAI的速率限制系统如何工作。我们提供代码示例和处理常见问题的可能解决方案。建议在填写“速率限制增加请求”表格之前遵循本指南，并详细说明最后一节中如何填写该表格的细节。

### 我们的API有什么速率限制？

我们根据使用的特定端点和您拥有的帐户类型，在组织级别而不是用户级别强制执行速率限制。速率限制以两种方式衡量：RPM（每分钟请求）和TPM（每分钟令牌）。下表突出显示了我们API的默认速率限制，但在填写“速率限制增加请求”表格后，这些限制可以增加。

TPM |单位因型号而异：
--|--
类型  |  1 TPM 相当于
达芬奇 |  每分钟 1 个代币
居里 |  每分钟 25 个代币
巴贝奇 | 每分钟 100 个代币
艾达 |  每分钟 200 个代币


从实际角度来看，这意味着您可以每分钟向`ada`模型发送大约200倍的令牌，而相对于`davinci`模型则更多。
---|文本和嵌入式| 聊天 |代码库| 编辑| 图像| 音频
--|--|--|--|--|--|--
免费试用用户 | 20 RPM 150,000 TPM|	20 RPM 40,000 TPM	|20 RPM 40,000 TPM	|20 RPM 150,000 TPM	| 50 images/ min |	50 RPM
按使用量付费的用户（前48小时）|60 RPM 250,000 TPM| 60 RPM 60,000 TPM |	20 RPM 40,000 TPM | 20 RPM 150,000 TPM	 |50 imagesmin / min |	50 RPM
按使用量付费的用户（48小时后）| 3,500 RPM 350,000 TPM	|3,500 RPM 90,000 TPM |	20 RPM 40,000 TPM	| 20 RPM 150,000 TPM | 50 images / min	|50 RPM

需要注意的是，速率限制可能会因为两个选项中的任何一个先达到而被触发。例如，您可能会向Codex端点发送20个请求，并且只使用了100个令牌，这将填满您的限制，即使在这些20个请求中没有发送40k令牌。

### GPT-4速率限制

在GPT-4推出期间，为了满足需求，该模型将有更加严格的速率限制。`gpt-4`/`gpt-4-0314`的默认速率限制为40k TPM和200 RPM。`gpt-4-32k`/`gpt-4-32k-0314`的默认速率限制为80k PRM和400 RPM。联系我们以请求提高速率限制或订购专用容量；请注意，我们可能无法及时处理所有请求。

### 速率限制如何工作？

如果您的速率限制是每分钟60个请求和每分钟150,000个`davinci`令牌，则您将受到两者中先达到上限的约束。例如，如果您最大每分钟请求数是60，则应能够每秒发送1个请求。如果您每800毫秒发送1个请求，在达到您的速率极限后，只需要使程序休眠200毫秒即可再次发送一个请求，否则后续请求将失败。对于默认值3,000个/分钟，请客户有效地可以每20ms或0.02秒发送1个请求。

### 如果我遇到速率限制错误会发生什么？

速率限制错误看起来像这样：

>在组织机构 org-{id} 中，default-text-davinci-002 的请求每分钟达到了速率限制。限制为：20.000000 / 分钟。当前为：24.000000 / 分钟。

如果您遇到速率限制，这意味着您在短时间内发出了太多的请求，API 拒绝进一步处理请求直到指定的时间过去。

### 速率限制与最大令牌数

我们提供的每个模型都有一个可以传递为输入的令牌数量上限。您无法增加模型接受的最大令牌数。例如，如果您正在使用 `text-ada-001`，则可以发送给该模型的最大令牌数为每个请求 2,048 个令牌。

## 错误缓解

### 我可以采取哪些步骤来缓解这个问题？

OpenAI Cookbook有一个Python笔记本，详细说明了如何避免速率限制错误。

在提供编程访问、批量处理功能和自动化社交媒体发布时，您还应谨慎考虑 - 只为可信客户启用这些功能。

为了防止自动化和高容量的滥用，在指定时间范围内（每日、每周或每月），为单个用户设置使用限制。考虑对超过限制的用户实施硬性上限或手动审核流程。

### 使用指数退避重试

避免速率限制错误的一种简单方法是使用随机指数退避自动重试请求。 指数回退意味着在达到速率限制错误时执行短暂休眠，然后重试未成功的请求。 如果请求仍然不成功，则增加睡眠时间并重复该过程。 这将继续进行，直到请求成功或达到最大重试次数为止。 这种方法有许多好处：

自动重试意味着您可以从速率限制错误中恢复而无需崩溃或丢失数据

指数回退意味着您的第一次尝试可以快速尝试，同时如果前几次尝试失败，则仍可获得更长的延迟。

向延迟添加随机抖动有助于防止所有重新发送命中同一时间。

请注意，未成功的请求会对每分钟限制产生贡献，因此连续重新发送请求将无效。

以下是使用指数回退的Python示例解决方案。

### 示例＃1：使用Tenacity库

Tenacity是一个Apache 2.0许可的通用重试库，用Python编写，旨在简化将重试行为添加到几乎任何内容的任务。要向您的请求添加指数退避，请使用tenacity.retry装饰器。下面的示例使用tenacity.wait_random_exponential函数向请求添加随机指数退避。

```
import openai
from tenacity import (
    retry,
    stop_after_attempt,
    wait_random_exponential,
)  # for exponential backoff
 
@retry(wait=wait_random_exponential(min=1, max=60), stop=stop_after_attempt(6))
def completion_with_backoff(**kwargs):
    return openai.Completion.create(**kwargs)
 
completion_with_backoff(model="text-davinci-003", prompt="Once upon a time,")
```

请注意，Tenacity库是第三方工具，OpenAI不对其可靠性或安全性做出任何保证。

### 示例＃2：使用backoff库

另一个提供回退和重试功能修饰符的Python库是backoff：

```
import backoff 
import openai 
@backoff.on_exception(backoff.expo, openai.error.RateLimitError)
def completions_with_backoff(**kwargs):
    return openai.Completion.create(**kwargs)
 
completions_with_backoff(model="text-davinci-003", prompt="Once upon a time,")
```

像Tenacity一样，backoff库是第三方工具，OpenAI不保证其可靠性或安全性。

### 示例3：手动退避实现

如果您不想使用第三方库，可以按照此示例实现自己的退避逻辑：

```
# imports
import random
import time
 
import openai
 
# define a retry decorator
def retry_with_exponential_backoff(
    func,
    initial_delay: float = 1,
    exponential_base: float = 2,
    jitter: bool = True,
    max_retries: int = 10,
    errors: tuple = (openai.error.RateLimitError,),
):
    """Retry a function with exponential backoff."""
 
    def wrapper(*args, **kwargs):
        # Initialize variables
        num_retries = 0
        delay = initial_delay
 
        # Loop until a successful response or max_retries is hit or an exception is raised
        while True:
            try:
                return func(*args, **kwargs)
 
            # Retry on specific errors
            except errors as e:
                # Increment retries
                num_retries += 1
 
                # Check if max retries has been reached
                if num_retries > max_retries:
                    raise Exception(
                        f"Maximum number of retries ({max_retries}) exceeded."
                    )
 
                # Increment the delay
                delay *= exponential_base * (1 + jitter * random.random())
 
                # Sleep for the delay
                time.sleep(delay)
 
            # Raise exceptions for any errors not specified
            except Exception as e:
                raise e
 
    return wrapper
    
@retry_with_exponential_backoff
def completions_with_backoff(**kwargs):
    return openai.Completion.create(**kwargs)
    
```

 再次强调，OpenAI 对此解决方案的安全性或效率不作任何保证，但它可以成为您自己解决方案的良好起点。

### 批量请求

OpenAI API 对每分钟请求数和每分钟令牌数有单独的限制。

如果您达到了每分钟请求的限制，但在每分钟令牌方面有可用容量，则可以将多个任务批处理到每个请求中以增加吞吐量。这将允许您处理更多的标记，特别是对于我们较小的模型。

发送一批提示与正常的 API 调用完全相同，只需将字符串列表传递给 prompt 参数即可。

没有批处理的示例

```
import openai  # for making OpenAI API requests
 
 
num_stories = 10
prompts = ["Once upon a time,"] * num_stories
 
# batched example, with 10 story completions per request
response = openai.Completion.create(
    model="curie",
    prompt=prompts,
    max_tokens=20,
)
 
# match completions to prompts by index
stories = [""] * len(prompts)
for choice in response.choices:
    stories[choice.index] = prompts[choice.index] + choice.text
 
# print stories
for story in stories:
    print(story)
```

>警告：响应对象可能不会按照提示的顺序返回完成情况，因此请始终记得使用索引字段将响应与提示匹配。

## 请求增加

### 何时应考虑申请速率限制增加？

我们的默认速率限制有助于最大化稳定性并防止滥用我们的API。 我们会提高限制以启用高流量应用程序，因此申请速率限制增加的最佳时间是当您认为已经具备必要的流量数据来支持增加速率限制的强有力案例时。 没有支持数据的大型速率限制增加请求不太可能获得批准。 如果您正在为产品发布做准备，请通过10天分阶段发布获取相关数据。

请记住，速率限制增加有时需要7-10天，因此如果存在支持当前发展数字将达到您的速率限制所需数据，则尽早计划并提交是明智之举。

### 我的速率限制增加请求会被拒绝吗？

速率限制增加请求最常被拒绝是因为缺乏证明增加的数据。我们在下面提供了数值示例，展示如何最好地支持速率限制增加请求，并尽力批准所有符合我们安全策略和显示支持数据的请求。我们致力于使开发人员能够通过我们的API进行扩展并取得成功。

### 我已经为我的文本/代码API实现了指数退避，但我仍然遇到了这个错误。如何增加我的速率限制？

目前，我们不支持增加免费测试版端点（例如编辑端点）的速率限制。我们也不会增加ChatGPT的速率限制，但您可以加入ChatGPT专业访问的等待列表。

我们理解有限的速率限制可能会引起沮丧，并且我们很想为每个人提高默认值。然而，由于共享容量约束，我们只能批准已通过我们的速率限制增加请求表单证明需要的付费客户进行速率限制增加。为了帮助我们适当评估您的需求，请在表单中“分享需求证据”部分提供关于当前使用情况或基于历史用户活动预测的统计数据。如果没有这些信息，则建议采用分阶段发布方法。首先以当前速率限制将服务发布给一组用户，在10个工作日内收集使用数据，然后根据该数据提交正式的速度上升请求供我们审查和批准。

如果您提交了请求并获得批准，则在7-10个工作日内通知您批准结果。

以下是填写此表格时可能使用的示例：

### DALL-E API 示例

模型 每分钟估计令牌数 每分钟估计请求数量 用户数量 需求证明 1小时最大吞吐量成本

DALL-E API N/A 50 1000 我们的应用程序目前正在生产中，并且根据过去的流量，我们大约每分钟进行10次请求。 60美元

DALL-E API N/A 150 10,000 我们的应用程序在App Store上越来越受欢迎，我们开始遇到速率限制。 我们能否获得三倍于默认限制的50个img/min？ 如果需要更多，我们将提交新表单。 谢谢！ $180

### 语言模型示例

MODEL 每分钟估计令牌数 每分钟估计请求次数 用户数量 需求证据 1小时最大吞吐量成本

text-davinci-003 325,000 4,000 50 我们将发布给一组初始的alpha测试人员，并需要更高的限制来适应他们的初始使用。我们在这里提供了一个链接，显示分析和API使用情况。$390

text-davinci-002 750,000 10,000 10,000 我们的应用程序受到了很多关注；我们有50,000人在等待名单上。我们想以每天1,000人/组的方式推出，直到达到50,000个用户为止。请参见此链接，查看过去30天内当前令牌/分钟流量情况。这是针对500个用户的，根据他们的使用情况，我们认为每分钟750,000个令牌和10,000个请求是一个很好的起点。$900

### 代码模型示例

模型 每分钟估计令牌数 每分钟估计请求数量 用户数量 需求证明 1小时最大吞吐量成本

code-davinci-002 150,000 1,000 15 我们是一组正在撰写论文的研究人员。我们估计在月底之前需要更高的速率限制才能完成我们的研究。这些估计基于以下计算[...] Codex 模型目前处于免费测试版，因此我们可能无法立即提供这些模型的增加。

请注意，这些示例仅为一般用例场景，实际使用率将根据具体的实现和使用情况而有所不同。






