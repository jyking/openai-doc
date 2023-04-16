# 介绍

您可以通过 HTTP 请求从任何语言与 API 进行交互，使用我们的官方 Python 绑定、官方 Node.js 库或社区维护的库。

要安装官方 Python 绑定，请运行以下命令：

>pip install openai

要安装官方的Node.js库，请在您的Node.js项目目录中运行以下命令：

>npm install openai

# 认证

OpenAI API使用API密钥进行身份验证。访问您的API密钥页面以检索在请求中使用的API密钥。

请记住，您的API密钥是机密！不要与他人分享或在任何客户端代码（浏览器、应用程序）中公开它。生产请求必须通过您自己的后端服务器路由，其中可以从环境变量或键管理服务安全地加载您的API密钥。

所有 API 请求都应该在 `Authorization` HTTP 头中包含您的 API 密钥，格式如下：

>Authorization: Bearer OPENAI_API_KEY

请求组织

对于属于多个组织的用户，您可以传递一个头来指定用于 API 请求的组织。这些 API 请求的使用将计入指定组织的订阅配额。

示例 curl 命令：

```
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Organization: YOUR_ORG_ID"
```

使用`openai Python`包的示例：

```
import os
import openai
openai.organization = "YOUR_ORG_ID"
openai.api_key = os.getenv("OPENAI_API_KEY")
openai.Model.list()
```

使用 `OpenAI` Node.js 包的示例：

```
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
    organization: "YOUR_ORG_ID",
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const response = await openai.listEngines();
```

组织 ID 可以在您的组织设置页面找到。

# 发出请求

您可以将以下命令粘贴到终端中以运行第一个API请求。请确保用您的秘密API密钥替换`$OPENAI_API_KEY`。

```
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
     "model": "gpt-3.5-turbo",
     "messages": [{"role": "user", "content": "Say this is a test!"}],
     "temperature": 0.7
   }'
```

此请求查询`gpt-3.5-turbo`模型，以完成从提示“Say this is a test”开始的文本。您应该会收到类似以下内容的响应：

```
{
   "id":"chatcmpl-abc123",
   "object":"chat.completion",
   "created":1677858242,
   "model":"gpt-3.5-turbo-0301",
   "usage":{
      "prompt_tokens":13,
      "completion_tokens":7,
      "total_tokens":20
   },
   "choices":[
      {
         "message":{
            "role":"assistant",
            "content":"\n\nThis is a test!"
         },
         "finish_reason":"stop",
         "index":0
      }
   ]
}
```

现在您已经生成了第一个聊天完成。我们可以看到`finish_reason`是`stop`，这意味着API返回了模型生成的完整完成。在上面的请求中，我们只生成了一条消息，但您可以将`n`参数设置为生成多个消息选项。在此示例中，`gpt-3.5-turbo`被用于更传统的文本完成任务。该模型也针对聊天应用进行了优化。

# 模型

列出并描述API中可用的各种模型。您可以参考模型文档以了解可用模型及其之间的区别。

## 列出模型

GET https://api.openai.com/v1/models

列出当前可用的模型，并提供有关每个模型的基本信息，例如所有者和可用性。

```
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
  ```

  ```
{
  "data": [
    {
      "id": "model-id-0",
      "object": "model",
      "owned_by": "organization-owner",
      "permission": [...]
    },
    {
      "id": "model-id-1",
      "object": "model",
      "owned_by": "organization-owner",
      "permission": [...]
    },
    {
      "id": "model-id-2",
      "object": "model",
      "owned_by": "openai",
      "permission": [...]
    },
  ],
  "object": "list"
}

  ```

## 检索模型

>GET ttps://api.openai.com/v1/models/{model}

检索模型实例，提供有关模型的基本信息，例如所有者和权限。

### 路径参数

模型  字符串  必需的

用于此请求的模型ID

```
curl https://api.openai.com/v1/models/text-davinci-003 \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

```
{
  "id": "text-davinci-003",
  "object": "model",
  "owned_by": "openai",
  "permission": [...]
}

```

# 完成

在给定提示的情况下，模型将返回一个或多个预测完成，并且还可以返回每个位置上备选标记的概率。

## 创建完成

POST  https://api.openai.com/v1/completions

为提供的提示和参数创建一个完成项。

### 请求正文

 model 字符串  必填

要使用的模型ID。您可以使用“列出模型”API查看所有可用模型，或者请参阅我们的“模型概述”以了解它们的描述。

---

 prompt 字符串或数组 可选项 默认为

要生成完成的提示，编码为字符串、字符串数组、令牌数组或令牌数组的数组。

请注意 <|endoftext|>这是模型在训练过程中看到的文档分隔符,因此，如果未指定提示，则模型将生成新文档的开头。

---

 suffix 字符串 可选的 默认为 null

插入文本完成后出现的后缀。

---

max_tokens 整数 可选项 默认为16

在完成中生成的最大标记数。

您的提示文本和 `max_tokens` 的令牌数不能超过模型的上下文长度。大多数模型的上下文长度为 2048 个令牌（除了最新的支持 4096 个令牌的模型）。

---

temperature 数字 可选的 默认为1

使用哪个采样温度，在0和2之间。较高的值，如0.8会使输出更随机，而较低的值，如0.2会使其更加集中和确定性。

我们通常建议更改此参数或 `top_p` 参数，但不要同时更改两者。

---

top_p 数字 可选项 默认为1

一种替代温度采样的方法叫做核心采样，模型会考虑到具有 top_p 概率质量的标记结果。因此，0.1 表示只考虑组成前 10% 概率质量的标记。

我们通常建议修改这个或者`temperature`但不能同时拥有。

---

n 整数 可选项 默认为1

每个提示生成多少完成次数。

注意：由于此参数会生成许多完成结果，它可能会快速消耗您的令牌配额。请谨慎使用，并确保您对max_tokens和进行了合理的设置`max_tokens`和`stop`

---

stream 布尔值 可选的 默认为false

是否返回部分进度流。如果设置，令牌将作为数据服务器推送事件随着它们变得可用而被发送,由于a的终止，流被终止`data: [DONE]`信息。

---
logprobs 整数 可选项 默认值为null

在上面包括对数概率`logprobs`最有可能的标记，以及所选的标记.例如，如果`logprobs`如果输入的数字是5，API将返回最有可能的5个标记列表。API将始终返回`logprob`被抽样的标记,因此可能会有多达`logprobs+1`响应中的元素。

最大值为`logprobs`是5。如果您需要更多，请通过我们的帮助中心联系我们，并描述您的使用情况。

---
echo 布尔值 可选的 默认为false

除了完成之外，还要回显提示。

---
stop 字符串或数组 可选项 默认为null

最多生成4个序列，API将停止生成更多的标记。返回的文本不包含停止序列。

---

stop 字符串或数组 可选项 默认为null

最多生成4个序列，API将停止生成更多的标记。返回的文本不包含停止序列。

---
presence_penalty 数字 可选项 默认为0

在-2.0和2.0之间的数字。正值根据它们在文本中出现的情况对新令牌进行惩罚，从而增加模型谈论新主题的可能性。

---
frequency_penalty 数字 可选项 默认为0

在-2.0和2.0之间的数字。正值会根据文本中现有词频惩罚新令牌，从而降低模型重复相同行的可能性。

---
best_of 整数 可选项 默认为1

生成`best_of`完成服务器端的计算并返回“最佳”结果（每个标记具有最高对数概率）。结果无法流式传输。

当与`n`一起使用时，`best_of`控制候选完成的数量，`n`指定要返回多少个 - `best_of`必须大于`n`。

注意：由于此参数会生成许多完成结果，它可能会快速消耗您的令牌配额。请谨慎使用，并确保您对 `max_tokens` 和 `stop` 设置合理。

---

logit_bias 地图 可选项 默认为null

修改指定标记在完成中出现的可能性。

接受一个JSON对象，将令牌（由GPT分词器中的令牌ID指定）映射到从-100到100的相关偏差值。您可以使用此分词器工具（适用于GPT-2和GPT-3）将文本转换为标记ID。在数学上，在采样之前，模型生成的logits会添加偏差。确切的影响因模型而异，但介于-1和1之间的值应该会减少或增加选择可能性；像-100或100这样的值应该会导致禁止或专有选择相关令牌。

例如，您可以传递 `{"50256": -100}` 来防止生成.

---
user 字符串 可选的

一个唯一的标识符，代表您的终端用户，可以帮助OpenAI监测和检测滥用。了解更多信息。

```
curl https://api.openai.com/v1/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "text-davinci-003",
    "prompt": "Say this is a test",
    "max_tokens": 7,
    "temperature": 0
  }'

```

```
{
  "model": "text-davinci-003",
  "prompt": "Say this is a test",
  "max_tokens": 7,
  "temperature": 0,
  "top_p": 1,
  "n": 1,
  "stream": false,
  "logprobs": null,
  "stop": "\n"
}

```

```
{
  "id": "cmpl-uqkvlQyYK7bGYrRHQ0eXlWi7",
  "object": "text_completion",
  "created": 1589478378,
  "model": "text-davinci-003",
  "choices": [
    {
      "text": "\n\nThis is indeed a test",
      "index": 0,
      "logprobs": null,
      "finish_reason": "length"
    }
  ],
  "usage": {
    "prompt_tokens": 5,
    "completion_tokens": 7,
    "total_tokens": 12
  }
}

```

# 聊天

给定一个聊天对话，模型将返回一个聊天完成响应。

## 创建聊天完成
 
>https://api.openai.com/v1/chat/completions

创建聊天消息的完成。

请求正文

---
model 字符串 必填

要使用的模型ID。有关哪些模型适用于Chat API的详细信息，请参见模型端点兼容性表。

---
messages 数组 必需的

用于生成聊天完成的消息，以聊天格式。

---
temperature 数字 可选项 默认为1

使用哪个采样温度，在0和2之间。较高的值，如0.8会使输出更随机，而较低的值，如0.2会使其更加集中和确定性。

我们通常建议更改此参数或 `top_p` 参数，但不要同时更改两者。

---
top_p 数字 可选项 默认为1

一种替代温度采样的方法叫做核心采样，模型会考虑到具有 top_p 概率质量的标记结果。因此，0.1 表示只考虑组成前 10% 概率质量的标记。

我们通常建议修改这个或者`temperature`但不能同时拥有。

---
n 整数 可选项 默认为1

每个输入消息要生成多少聊天完成选项。

---
stream 布尔值 可选的 默认为false

如果设置了，将发送部分消息增量，就像在ChatGPT中一样。令牌将作为数据服务器推送事件随时可用，并通过终止流来发送`data:[DONE]`消息。请参阅OpenAI Cookbook以获取示例代码。

---
stop 字符串或数组 可选项 默认为null

最多生成4个序列，API将停止生成更多的令牌。

---
max_tokens 整数 可选项 默认为无穷大

在聊天完成中生成的最大令牌数。

输入令牌和生成的令牌的总长度受模型上下文长度的限制。

---
presence_penalty 数字 可选项 默认为0

在-2.0和2.0之间的数字。正值根据它们在文本中出现的情况对新令牌进行惩罚，从而增加模型谈论新主题的可能性。

---
frequency_penalty 数字 可选项 默认为0

在-2.0和2.0之间的数字。正值会根据文本中现有词频惩罚新令牌，从而降低模型重复相同行的可能性。

---
logit_bias 地图 可选项 默认为null

修改完成时指定标记出现的可能性。

接受一个JSON对象，将标记（由分词器中的标记ID指定）映射到从-100到100的相关偏差值。在采样之前，模型生成的logits会加上这个偏差。确切的影响因模型而异，但是-1到1之间的值应该会减少或增加选择概率；像-100或100这样的值应该会导致相关标记被禁止或独占选择。

---
user 字符串 可选的

一个唯一的标识符，代表您的终端用户，可以帮助OpenAI监测和检测滥用。了解更多信息。 

```
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'

```

```
{
  "model": "gpt-3.5-turbo",
  "messages": [{"role": "user", "content": "Hello!"}]
}

```

```
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "\n\nHello there, how may I assist you today?",
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 9,
    "completion_tokens": 12,
    "total_tokens": 21
  }
}

```

# 编辑

给定一个提示和一条指令，模型将返回提示的编辑版本。

## 创建编辑

https://api.openai.com/v1/edits

### 请求正文

---
model 字符串 必填

要使用的模型ID。您可以在此端点中使用`text-davinci-edit-001`或`code-davinci-edit-001`
模型。

---
input 字符串 可选项 默认为''

用作编辑起点的输入文本。

---
instruction 字符串 必填

指导模型如何编辑提示的说明。

---
n 整数 可选项 默认为1

输入和指令需要生成多少次编辑。

---
temperature 数字 可选项 默认为1

使用哪个采样温度，在0和2之间。较高的值，如0.8会使输出更随机，而较低的值，如0.2会使其更加集中和确定性。

我们通常建议更改此参数或 `top_p` 参数，但不要同时更改两者。

---
top_p 数字 可选项 默认为1

一种替代温度采样的方法叫做核心采样，模型会考虑到具有 top_p 概率质量的标记结果。因此，0.1 表示只考虑组成前 10% 概率质量的标记。

我们通常建议修改这个或者`temperature`但不能同时.

```
curl https://api.openai.com/v1/edits \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "text-davinci-edit-001",
    "input": "What day of the wek is it?",
    "instruction": "Fix the spelling mistakes"
  }'

```

```
{
  "model": "text-davinci-edit-001",
  "input": "What day of the wek is it?",
  "instruction": "Fix the spelling mistakes",
}

```

```
{
  "object": "edit",
  "created": 1589478378,
  "choices": [
    {
      "text": "What day of the week is it?",
      "index": 0,
    }
  ],
  "usage": {
    "prompt_tokens": 25,
    "completion_tokens": 32,
    "total_tokens": 57
  }
}

```

# 图像

## 创建图像
 
https://api.openai.com/v1/images/generations

根据提示创建图像。

### 请求正文

---
prompt 字符串 必填

所需图像的文本描述。最大长度为1000个字符。

---
n 整数 可选项 默认为1

要生成的图像数量。必须在1和10之间。

---
size  字符串 可选项 默认为1024x1024

生成图像的尺寸。必须是`256x256`、`512x512`或`1024x1024`之一。

---
response_format 字符串 可选项 默认为url

生成的图像返回格式。必须是`url`或`b64_json`之一。

---
user 字符串 可选的

一个唯一的标识符，代表您的终端用户，可以帮助OpenAI监测和检测滥用。了解更多信息。

```
{
  "prompt": "A cute baby sea otter",
  "n": 2,
  "size": "1024x1024"
}

```

```
{
  "created": 1589478378,
  "data": [
    {
      "url": "https://..."
    },
    {
      "url": "https://..."
    }
  ]
}

```

## 创建图像编辑
 
>https://api.openai.com/v1/images/edits

根据原始图像和提示创建编辑或扩展的图像。

## 请求正文

---
image 字符串 必填

要编辑的图像。必须是有效的PNG文件，小于4MB且为正方形。如果未提供遮罩，则图像必须具有透明度，该透明度将用作遮罩。

---
mask 字符串 可选的

另外一张图片，其完全透明的区域（例如 alpha 值为零的区域）指示了哪里`image`应进行编辑。必须是有效的PNG文件，小于4MB，并且具有相同的尺寸`imag`。

---
prompt 字符串 必填

所需图像的文本描述。最大长度为1000个字符。

---
n 整数 可选项 默认为1

要生成的图像数量。必须在1和10之间。

---
size 字符串 可选项 默认为1024x1024

生成图像的尺寸。必须是`256x256`、`512x512`或`1024x1024`之一。

---
user 字符串 可选的

一个唯一的标识符，代表您的终端用户，可以帮助OpenAI监测和检测滥用。了解更多信息。

```
curl https://api.openai.com/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "prompt": "A cute baby sea otter",
    "n": 2,
    "size": "1024x1024"
  }'

```

```
{
  "prompt": "A cute baby sea otter",
  "n": 2,
  "size": "1024x1024"
}

```

```
{
  "created": 1589478378,
  "data": [
    {
      "url": "https://..."
    },
    {
      "url": "https://..."
    }
  ]
}

```

## 创建图像编辑

https://api.openai.com/v1/images/edits

根据原始图像和提示创建编辑或扩展的图像。

### 请求正文

---
image 字符串 必填

要编辑的图像。必须是有效的PNG文件，小于4MB且为正方形。如果未提供遮罩，则图像必须具有透明度，该透明度将用作遮罩。

---
mask 字符串 可选的

另外一张图片，其完全透明的区域（例如 alpha 值为零的区域）指示了哪里`image`应进行编辑。必须是有效的PNG文件，小于4MB，并且具有相同的尺寸`image`。

---
prompt 字符串 必填

所需图像的文本描述。最大长度为1000个字符。

---
n 整数 可选项 默认为1

要生成的图像数量。必须在1和10之间。

---
size  字符串 可选项 默认为1024x1024

生成图像的尺寸。必须是`256x256`、`512x512`或`1024x1024`之一。

---
response_format 字符串 可选项 默认为url

生成的图像返回格式。必须是`url`或`b64_json`之一。

---
user 字符串 可选的

一个唯一的标识符，代表您的终端用户，可以帮助OpenAI监测和检测滥用。了解更多信息。

```
curl https://api.openai.com/v1/images/edits \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F image="@otter.png" \
  -F mask="@mask.png" \
  -F prompt="A cute baby sea otter wearing a beret" \
  -F n=2 \
  -F size="1024x1024"

```

```
{
  "created": 1589478378,
  "data": [
    {
      "url": "https://..."
    },
    {
      "url": "https://..."
    }
  ]
}

```

## 创建图像变体

>https://api.openai.com/v1/images/variations

创建给定图像的变体。

### 请求正文

---
image 字符串 必填

用作变体基础的图像。必须是有效的PNG文件，小于4MB，并且为正方形。

---
n 整数 可选项 默认为1

要生成的图像数量。必须在1和10之间。

---
size 字符串 可选项 默认为1024x1024

生成图像的尺寸。必须是`256x256`、`512x512`或`1024x1024`之一。

---
response_format 字符串 可选项 默认为url

生成的图像返回格式。必须是`url`或`b64_json`之一。

---
user 字符串 可选的

一个唯一的标识符，代表您的终端用户，可以帮助OpenAI监测和检测滥用。了解更多信息。

```
curl https://api.openai.com/v1/images/variations \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F image="@otter.png" \
  -F n=2 \
  -F size="1024x1024"

```

```
{
  "created": 1589478378,
  "data": [
    {
      "url": "https://..."
    },
    {
      "url": "https://..."
    }
  ]
}

```

# 嵌入

获得一个给定输入的向量表示，可以轻松地被机器学习模型和算法使用。

相关指南：嵌入

## 创建嵌入

>https://api.openai.com/v1/embeddings

创建一个嵌入向量，代表输入的文本。

### 请求正文

---
model 字符串 必填

要使用的模型ID。您可以使用“列出模型”API查看所有可用模型，或者请参阅我们的“模型概述”以了解它们的描述。

---
input 字符串或数组 必填

输入文本以获取嵌入，编码为字符串或令牌数组。要在单个请求中获取多个输入的嵌入，请传递字符串数组或令牌数组的数组。每个输入长度不得超过8192个标记。

---
user 字符串 可选的

一个唯一的标识符，代表您的终端用户，可以帮助OpenAI监测和检测滥用。了解更多信息。

```
curl https://api.openai.com/v1/embeddings \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "input": "The food was delicious and the waiter...",
    "model": "text-embedding-ada-002"
  }'

```

```
{
  "model": "text-embedding-ada-002",
  "input": "The food was delicious and the waiter..."
}

```

```
{
  "object": "list",
  "data": [
    {
      "object": "embedding",
      "embedding": [
        0.0023064255,
        -0.009327292,
        .... (1536 floats total for ada-002)
        -0.0028842222,
      ],
      "index": 0
    }
  ],
  "model": "text-embedding-ada-002",
  "usage": {
    "prompt_tokens": 8,
    "total_tokens": 8
  }
}

```

# 音频

学习如何将音频转换为文本

相关指南：语音转文字

## 创建转录

>https://api.openai.com/v1/audio/transcriptions

将音频转录为输入语言。

### 请求正文

---
file 字符串 必填

要转录的音频文件，格式为以下之一：mp3、mp4、mpeg、mpga、m4a、wav 或 webm。

---
model 字符串 必填

要使用的模型ID。目前仅有`whisper-1`可用。

---
prompt 字符串 可选的

一个可选的文本，用于指导模型的风格或继续之前的音频片段。提示应该与音频语言相匹配。

---
response_format 字符串 可选项 默认为json

转换成简体中文：转录输出的格式，可选项包括json、文本、srt、verbose_json或vtt。

---
temperature 数字 可选项 默认为0

采样温度介于0和1之间。较高的值（如0.8）会使输出更随机，而较低的值（如0.2）则会使其更加集中和确定性。如果设置为0，则模型将使用对数概率自动增加温度，直到达到某些阈值。

---
language 字符串 可选的

输入音频的语言。以 ISO-639-1 格式提供输入语言将提高准确性和延迟。

```
curl https://api.openai.com/v1/audio/transcriptions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/file/audio.mp3" \
  -F model="whisper-1"

```

```
{
  "file": "audio.mp3",
  "model": "whisper-1"
}

```

```
{
  "text": "Imagine the wildest idea that you've ever had, and you're curious about how it might scale to something that's a 100, a 1,000 times bigger. This is a place where you can get to do that."
}

```

## 创建翻译

>https://api.openai.com/v1/audio/translations

将音频翻译成英语。

### 请求正文

---
file  字符串 必填

要翻译的音频文件必须是以下格式之一：mp3、mp4、mpeg、mpga、m4a、wav或webm。

---
model 字符串 必填

要使用的模型ID。目前仅有`whisper-`1可用。

---
prompt 字符串 可选的

一个可选的文本，用于指导模型的风格或继续之前的音频片段。提示应该是英语。

---
response_format 字符串 可选项 默认为json

转换成简体中文：转录输出的格式，可选项包括json、文本、srt、verbose_json或vtt。

---
temperature 数字 可选项 默认为0

采样温度介于0和1之间。较高的值（如0.8）会使输出更随机，而较低的值（如0.2）则会使其更加集中和确定性。如果设置为0，则模型将使用对数概率自动增加温度，直到达到某些阈值。

```
curl https://api.openai.com/v1/audio/translations \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/file/german.m4a" \
  -F model="whisper-1"
```

```
{
  "file": "german.m4a",
  "model": "whisper-1"
}
```

```
{
  "text": "Hello, my name is Wolfgang and I come from Germany. Where are you heading today?"
}
```

# 文件

文件用于上传文档，可与Fine-tuning等功能一起使用。

## 列出文件

>https://api.openai.com/v1/files

返回属于用户组织的文件列表。

```
curl https://api.openai.com/v1/files \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

```
{
  "data": [
    {
      "id": "file-ccdDZrC3iZVNiQVeEA6Z66wf",
      "object": "file",
      "bytes": 175,
      "created_at": 1613677385,
      "filename": "train.jsonl",
      "purpose": "search"
    },
    {
      "id": "file-XjGxS3KTG0uNmNOK362iJua3",
      "object": "file",
      "bytes": 140,
      "created_at": 1613779121,
      "filename": "puppy.jsonl",
      "purpose": "search"
    }
  ],
  "object": "list"
}
```

## 上传文件

>https://api.openai.com/v1/files

上传包含文档的文件以在各个端点/功能中使用。目前，一个组织上传的所有文件的大小可以高达1 GB。如果您需要增加存储限制，请与我们联系。

## 请求正文

---
file 字符串 必填

要上传的 JSON Lines 文件的名称。

如果`purpose`被设置为“微调”，每一行都是一个JSON记录，其中包含“prompt”和“completion”字段，表示您的训练示例。

---
purpose 字符串 必填

上传文档的预期用途。

使用“fine-tune”进行微调。这样可以验证上传文件的格式。

```
curl https://api.openai.com/v1/files \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F purpose="fine-tune" \
  -F file="@mydata.jsonl"
```

```
{
  "id": "file-XjGxS3KTG0uNmNOK362iJua3",
  "object": "file",
  "bytes": 140,
  "created_at": 1613779121,
  "filename": "mydata.jsonl",
  "purpose": "fine-tune"
}
```

## 删除文件

>https://api.openai.com/v1/files/{file_id}

删除一个文件。

### 路径参数

---
file_id 字符串 必填

用于此请求的文件ID

```
curl https://api.openai.com/v1/files/file-XjGxS3KTG0uNmNOK362iJua3 \
  -X DELETE \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

```
{
  "id": "file-XjGxS3KTG0uNmNOK362iJua3",
  "object": "file",
  "deleted": true
}
```

## 检索文件

>https://api.openai.com/v1/files/{file_id}

返回有关特定文件的信息。

### 路径参数

---
file_id 字符串 必填

用于此请求的文件ID

```
curl https://api.openai.com/v1/files/file-XjGxS3KTG0uNmNOK362iJua3 \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

```
{
  "id": "file-XjGxS3KTG0uNmNOK362iJua3",
  "object": "file",
  "bytes": 140,
  "created_at": 1613779657,
  "filename": "mydata.jsonl",
  "purpose": "fine-tune"
}
```

## 检索文件内容

>https://api.openai.com/v1/files/{file_id}/content

返回指定文件的内容

### 路径参数

---
file_id 字符串 必填

用于此请求的文件ID

# 微调

管理微调作业以将模型定制为您的特定训练数据。

相关指南：微调模型

## 创建微调

>https://api.openai.com/v1/fine-tunes

创建一个工作，从给定的数据集中微调指定模型。

响应包括已入队的作业的详细信息，包括作业状态和完成后微调模型的名称。

### 请求正文

---
training_file 字符串 必填

上传的包含训练数据的文件ID。

请参阅上传文件以了解如何上传文件。

您的数据集必须格式化为JSONL文件，其中每个训练示例都是一个带有“prompt”和“completion”键的JSON对象。此外，您必须上传带有目的的文件`fine-tune`。

请查看微调指南以获取更多详细信息。

---
validation_file 字符串 可选的

上传的包含验证数据的文件ID。

如果您提供此文件，则在微调期间会定期使用该数据生成验证指标。这些指标可以在微调结果文件中查看。您的训练和验证数据应该是互斥的。

您的数据集必须格式化为JSONL文件，其中每个验证示例都是一个带有“prompt”和“completion”键的JSON对象。此外，您必须上传您的文件并注明其用途`fine-tune`。

请查看微调指南以获取更多详细信息。

---
model 字符串 可选项 默认为curie

要微调的基础模型名称。您可以选择其中之一："ada"、"babbage"、"curie"、"davinci"，或2022年4月21日后创建的经过微调的模型。要了解这些模型的更多信息，请参阅“Models”文档。

---
n_epochs 整数 可选项 默认为4

训练模型的时期数。一个时期指的是完整地遍历一次训练数据集。

---
batch_size 整数 可选项 默认值为null

用于训练的批次大小。 批次大小是用于训练单个前向和后向传递的训练示例数量。

默认情况下，批处理大小将动态配置为训练集中示例数的约0.2％，上限为256-通常我们发现较大的数据集更适合使用较大的批量大小。

---
learning_rate_multiplier 数字 可选的 默认为 null

用于训练的学习率倍增器。微调学习率是预训练时使用的原始学习率乘以此值得到的。

默认情况下，学习率的倍增器为0.05、0.1或0.2，具体取决于最终结果`batch_size`（较大的学习率往往在较大的批量大小下表现更好）。我们建议尝试使用0.02到0.2范围内的值，以查看哪些值能够产生最佳结果。

---
prompt_loss_weight 数字 可选项 默认为0.01

用于在提示标记上进行减重的权重。这控制了模型尝试学习生成提示的程度（与始终具有1.0权重的完成相比），并且可以在完成很短时为训练添加稳定效果。

如果提示非常长（相对于完成而言），则降低此权重可能是有意义的，以避免过度优先考虑学习提示。

---
compute_classification_metrics 布尔值 可选的 默认为false

如果设置了，我们会在每个 epoch 结束时使用验证集计算特定于分类的指标，例如准确率和 F-1 分数。这些指标可以在结果文件中查看。

为了计算分类指标，您必须提供一个`validation_file`.此外，您必须指定`classification_n_classes`用于多类分类或`classification_positive_class`用于二元分类。

---
classification_n_classes 整数 可选项 默认值为null

分类任务中的类别数量。

这个参数在多分类任务中是必需的。

---
classification_positive_class 字符串 可选的 默认值为null

二元分类中的正类。

在进行二元分类时，需要此参数来生成精确度、召回率和 F1 指标。

---
classification_betas 数组 可选的 默认值为null

如果提供了这个参数，我们会在指定的beta值上计算F-beta分数。F-beta分数是F-1分数的一般化。这仅用于二元分类。

当beta为1时（即F-1分数），精确度和召回率被赋予相同的权重。较大的beta值更加注重召回率而不是精确度。较小的beta值更加注重精确度而不是召回率。

---
suffix 字符串 可选的 默认值为null

最多40个字符的字符串，将添加到您的微调模型名称中。

例如，一个`suffix`为“custom-model-name”的模型名称将生成类似于的模型名称`ada:ft-your-org:custom-model-name-2022-02-15-04-21-04`.

```
curl https://api.openai.com/v1/fine-tunes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "training_file": "file-XGinujblHPwGLSztz8cPS8XY"
  }'

```

```
{
  "id": "ft-AF1WoRqd3aJAHsqc9NY7iL8F",
  "object": "fine-tune",
  "model": "curie",
  "created_at": 1614807352,
  "events": [
    {
      "object": "fine-tune-event",
      "created_at": 1614807352,
      "level": "info",
      "message": "Job enqueued. Waiting for jobs ahead to complete. Queue number: 0."
    }
  ],
  "fine_tuned_model": null,
  "hyperparams": {
    "batch_size": 4,
    "learning_rate_multiplier": 0.1,
    "n_epochs": 4,
    "prompt_loss_weight": 0.1,
  },
  "organization_id": "org-...",
  "result_files": [],
  "status": "pending",
  "validation_files": [],
  "training_files": [
    {
      "id": "file-XGinujblHPwGLSztz8cPS8XY",
      "object": "file",
      "bytes": 1547276,
      "created_at": 1610062281,
      "filename": "my-data-train.jsonl",
      "purpose": "fine-tune-train"
    }
  ],
  "updated_at": 1614807352,
}

```

## 列表微调

>https://api.openai.com/v1/fine-tunes

列出您的组织的微调工作。

```
curl https://api.openai.com/v1/fine-tunes \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

```
{
  "object": "list",
  "data": [
    {
      "id": "ft-AF1WoRqd3aJAHsqc9NY7iL8F",
      "object": "fine-tune",
      "model": "curie",
      "created_at": 1614807352,
      "fine_tuned_model": null,
      "hyperparams": { ... },
      "organization_id": "org-...",
      "result_files": [],
      "status": "pending",
      "validation_files": [],
      "training_files": [ { ... } ],
      "updated_at": 1614807352,
    },
    { ... },
    { ... }
  ]
}

```

## 检索微调

>https://api.openai.com/v1/fine-tunes/{fine_tune_id}

获取有关微调作业的信息。

### 路径参数

---
fine_tune_id 字符串 必填

微调作业的ID

```
curl https://api.openai.com/v1/fine-tunes/ft-AF1WoRqd3aJAHsqc9NY7iL8F \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

```
{
  "id": "ft-AF1WoRqd3aJAHsqc9NY7iL8F",
  "object": "fine-tune",
  "model": "curie",
  "created_at": 1614807352,
  "events": [
    {
      "object": "fine-tune-event",
      "created_at": 1614807352,
      "level": "info",
      "message": "Job enqueued. Waiting for jobs ahead to complete. Queue number: 0."
    },
    {
      "object": "fine-tune-event",
      "created_at": 1614807356,
      "level": "info",
      "message": "Job started."
    },
    {
      "object": "fine-tune-event",
      "created_at": 1614807861,
      "level": "info",
      "message": "Uploaded snapshot: curie:ft-acmeco-2021-03-03-21-44-20."
    },
    {
      "object": "fine-tune-event",
      "created_at": 1614807864,
      "level": "info",
      "message": "Uploaded result files: file-QQm6ZpqdNwAaVC3aSz5sWwLT."
    },
    {
      "object": "fine-tune-event",
      "created_at": 1614807864,
      "level": "info",
      "message": "Job succeeded."
    }
  ],
  "fine_tuned_model": "curie:ft-acmeco-2021-03-03-21-44-20",
  "hyperparams": {
    "batch_size": 4,
    "learning_rate_multiplier": 0.1,
    "n_epochs": 4,
    "prompt_loss_weight": 0.1,
  },
  "organization_id": "org-...",
  "result_files": [
    {
      "id": "file-QQm6ZpqdNwAaVC3aSz5sWwLT",
      "object": "file",
      "bytes": 81509,
      "created_at": 1614807863,
      "filename": "compiled_results.csv",
      "purpose": "fine-tune-results"
    }
  ],
  "status": "succeeded",
  "validation_files": [],
  "training_files": [
    {
      "id": "file-XGinujblHPwGLSztz8cPS8XY",
      "object": "file",
      "bytes": 1547276,
      "created_at": 1610062281,
      "filename": "my-data-train.jsonl",
      "purpose": "fine-tune-train"
    }
  ],
  "updated_at": 1614807865,
}

```

## 取消微调

>https://api.openai.com/v1/fine-tunes/{fine_tune_id}/cancel

立即取消微调工作。

### 路径参数

---
fine_tune_id 字符串 必填

要取消微调作业的ID

```
curl https://api.openai.com/v1/fine-tunes/ft-AF1WoRqd3aJAHsqc9NY7iL8F/cancel \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

```
{
  "id": "ft-xhrpBbvVUzYGo8oUO1FY4nI7",
  "object": "fine-tune",
  "model": "curie",
  "created_at": 1614807770,
  "events": [ { ... } ],
  "fine_tuned_model": null,
  "hyperparams": { ... },
  "organization_id": "org-...",
  "result_files": [],
  "status": "cancelled",
  "validation_files": [],
  "training_files": [
    {
      "id": "file-XGinujblHPwGLSztz8cPS8XY",
      "object": "file",
      "bytes": 1547276,
      "created_at": 1610062281,
      "filename": "my-data-train.jsonl",
      "purpose": "fine-tune-train"
    }
  ],
  "updated_at": 1614807789,
}

```

## 列出微调事件

>https://api.openai.com/v1/fine-tunes/{fine_tune_id}/events

获取微调作业的细粒度状态更新。

### 路径参数

fine_tune_id 字符串 必填

获取事件的微调作业ID。

### 查询参数

---
stream 布尔值 可选的 默认为false

是否为微调作业流式传输事件。如果设置为true，则事件将作为仅数据的服务器推送事件随时发送。该流将以"结束符号"终止`data:[DONE]`当工作完成时的消息（成功、取消或失败）

如果设置为false，则只返回到目前为止生成的事件。

```
curl https://api.openai.com/v1/fine-tunes/ft-AF1WoRqd3aJAHsqc9NY7iL8F/events \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

```

{
  "object": "list",
  "data": [
    {
      "object": "fine-tune-event",
      "created_at": 1614807352,
      "level": "info",
      "message": "Job enqueued. Waiting for jobs ahead to complete. Queue number: 0."
    },
    {
      "object": "fine-tune-event",
      "created_at": 1614807356,
      "level": "info",
      "message": "Job started."
    },
    {
      "object": "fine-tune-event",
      "created_at": 1614807861,
      "level": "info",
      "message": "Uploaded snapshot: curie:ft-acmeco-2021-03-03-21-44-20."
    },
    {
      "object": "fine-tune-event",
      "created_at": 1614807864,
      "level": "info",
      "message": "Uploaded result files: file-QQm6ZpqdNwAaVC3aSz5sWwLT."
    },
    {
      "object": "fine-tune-event",
      "created_at": 1614807864,
      "level": "info",
      "message": "Job succeeded."
    }
  ]
}
```

## 删除微调模型

>https://api.openai.com/v1/models/{model}

删除一个经过优化的模型。您必须在组织中拥有所有者角色。

### 路径参数

---
model 字符串 必填

要删除的模型

```
curl https://api.openai.com/v1/models/curie:ft-acmeco-2021-03-03-21-44-20 \
  -X DELETE \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

```
{
  "id": "curie:ft-acmeco-2021-03-03-21-44-20",
  "object": "model",
  "deleted": true
}

```

# 内容审核

给定输入文本，输出模型是否将其分类为违反OpenAI的内容政策。

相关指南：内容审核

## 创建管理

>https://api.openai.com/v1/moderations

分类判断文本是否违反OpenAI的内容政策

### 请求正文

---
input 字符串或数组 必填

要分类的输入文本

---
model 字符串 可选项 默认为text-moderation-latest

有两个内容审核模型可用：`text-moderation-stable`和 `text-moderation-latest`。

默认情况下，使用的是 `text-moderation-latest` 模型，该模型会随着时间自动升级。这确保您始终使用我们最准确的模型。如果您使用 `text-moderation-stable`，则在更新模型之前我们将提供高级通知。`text-moderation-stable `的准确性可能略低于 `text-moderation-latest`。

```
curl https://api.openai.com/v1/moderations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "input": "I want to kill them."
  }'
```

```
{
  "input": "I want to kill them."
}
```

```
{
  "id": "modr-5MWoLO",
  "model": "text-moderation-001",
  "results": [
    {
      "categories": {
        "hate": false,
        "hate/threatening": true,
        "self-harm": false,
        "sexual": false,
        "sexual/minors": false,
        "violence": true,
        "violence/graphic": false
      },
      "category_scores": {
        "hate": 0.22714105248451233,
        "hate/threatening": 0.4132447838783264,
        "self-harm": 0.005232391878962517,
        "sexual": 0.01407341007143259,
        "sexual/minors": 0.0038522258400917053,
        "violence": 0.9223177433013916,
        "violence/graphic": 0.036865197122097015
      },
      "flagged": true
    }
  ]
}
```

# 引擎

>引擎端点已被弃用。

>请使用它们的替代品模型。了解更多信息。

这些端点描述并提供了API中可用的各种引擎的访问。

## 列表引擎

>https://api.openai.com/v1/engines

列出当前可用的（未经微调的）模型，并提供有关每个模型的基本信息，例如所有者和可用性。

```
curl https://api.openai.com/v1/engines \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

```
{
  "data": [
    {
      "id": "engine-id-0",
      "object": "engine",
      "owner": "organization-owner",
      "ready": true
    },
    {
      "id": "engine-id-2",
      "object": "engine",
      "owner": "organization-owner",
      "ready": true
    },
    {
      "id": "engine-id-3",
      "object": "engine",
      "owner": "openai",
      "ready": false
    },
  ],
  "object": "list"
}

```

## 检索引擎

>https://api.openai.com/v1/engines/{engine_id}

检索模型实例，提供基本信息，如所有者和可用性。

### 路径参数

---
engine_id 字符串 必填

用于此请求的引擎ID。

```
curl https://api.openai.com/v1/engines/text-davinci-003 \
  -H "Authorization: Bearer $OPENAI_API_KEY"

```

```
{
  "id": "text-davinci-003",
  "object": "engine",
  "owner": "openai",
  "ready": true
}

```

# 参数细节

频率和存在惩罚

在Completions API中发现的频率和存在惩罚可以用于减少采样重复令牌序列的可能性。它们通过直接修改logits（未归一化的对数概率）来进行加法贡献。

```
mu[j] -> mu[j] - c[j] * alpha_frequency - float(c[j] > 0) * alpha_presence
```

其中：

- `mu[j]` 是第 j 个标记的对数概率
-` c[j]` 是在当前位置之前采样该标记的次数
- `float(c[j] > 0)` 如果 `c[j] > 0` 则为1，否则为0
- `alpha_frequency` 是频率惩罚系数
- `alpha_presence` 是存在惩罚系数

正如我们所看到的，存在惩罚是一次性的加法贡献，适用于所有已经被采样至少一次的标记，并且频率惩罚是与特定标记已经被采样多少次成比例的贡献。

如果目标只是稍微减少重复采样，则惩罚系数的合理值约为0.1到1。如果目标是强烈抑制重复，则可以将系数增加到2，但这可能会明显降低样本质量。可以使用负值来增加重复出现的可能性。
