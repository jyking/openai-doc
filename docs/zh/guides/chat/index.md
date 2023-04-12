# 聊天完成   Beta

使用OpenAI聊天API，您可以使用`gpt-3.5-turbo`和`gpt-4`构建自己的应用程序，以执行以下操作：

- 起草电子邮件或其他写作

- 编写Python代码

- 回答有关一组文档的问题

- 创建对话代理人

- 为您的软件提供自然语言界面

- 在各种学科中进行辅导

翻译语言

模拟视频游戏角色等等

本指南介绍了如何调用基于聊天的语言模型的API，并分享了获取良好结果的技巧。您还可以在OpenAI Playground中尝试新的聊天格式。

## 介绍

聊天模型将一系列消息作为输入，并返回一个由模型生成的消息作为输出。

虽然聊天格式旨在使多轮对话变得容易，但它同样适用于没有任何对话的单轮任务（例如以前由指令跟随模型（如`text-davinci-003`）提供服务的任务）。

以下是一个示例API调用：

```
# Note: you need to be using OpenAI Python v0.27.0 for the code below to work
import openai

openai.ChatCompletion.create(
  model="gpt-3.5-turbo",
  messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Who won the world series in 2020?"},
        {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
        {"role": "user", "content": "Where was it played?"}
    ]
)
```

主要输入是消息参数。消息必须是一个消息对象数组，其中每个对象都有一个角色（系统、用户或助手）和内容（消息的内容）。对话可以只有1条信息，也可以填满许多页面。

通常情况下，一次会话以系统消息开头，然后是交替出现的用户和助手消息。

系统消息帮助设置助手的行为。在上面的示例中，指导了“您是一个有用的助手”。

>gpt-3.5-turbo-0301并不总是会特别关注系统消息。未来的模型将被训练以更加重视系统消息。

用户消息有助于指导助手。它们可以由应用程序的最终用户生成，也可以由开发人员设置为指令。

助手消息有助于存储先前的响应。它们也可以由开发人员编写，以帮助提供所需行为的示例。

包括对话历史记录在内有助于当用户指令涉及到之前的消息时。在上面的示例中，“Where was it played?”这个问题只有在关于2020年世界大赛的先前消息背景下才有意义。因为模型没有过去请求的记忆，所有相关信息必须通过对话提供。如果一个会话无法适合模型标记限制，则需要以某种方式缩短它。

### 响应格式

一个API响应的示例如下：

```
{
 'id': 'chatcmpl-6p9XYPYSTTRi0xEviKjjilqrWU2Ve',
 'object': 'chat.completion',
 'created': 1677649420,
 'model': 'gpt-3.5-turbo',
 'usage': {'prompt_tokens': 56, 'completion_tokens': 31, 'total_tokens': 87},
 'choices': [
   {
    'message': {
      'role': 'assistant',
      'content': 'The 2020 World Series was played in Arlington, Texas at the Globe Life Field, which was the new home stadium for the Texas Rangers.'},
    'finish_reason': 'stop',
    'index': 0
   }
  ]
}
```

在Python中，助手的回复可以通过`response['choices'][0]['message']['content']`来提取。

每个响应都将包括一个`finish_reason`。 -`finish_reason` 的可能值为：

- `stop`：API返回完整的模型输出

- `length`：由于max_tokens参数或令牌限制而导致不完整的模型输出

- `content_filter`：由于我们内容过滤器中的标志而省略了内容

- `null`：API响应仍在进行中或不完整

### 管理令牌

语言模型以称为标记的块读取文本。在英语中，一个标记可以短至一个字符或长至一个单词（例如`a`或`apple`），而在某些语言中，标记甚至可以比一个字符更短或比一个单词更长。

例如，字符串`“ChatGPT is great！”`被编码为六个标记：`["Chat", "G", "PT", " is", " great", "!"]`。

API调用中的令牌总数会影响：

您的API调用成本，因为您按令牌付费

您的API调用时间长度，因为编写更多令牌需要更长时间

是否能够成功进行API调用，因为总令牌必须低于模型的最大限制（`gpt-3.5-turbo-0301` 的最大限制是4096个标记）

输入和输出的令牌都计入这些数量。例如，如果您的 API 调用在消息输入中使用了 10 个令牌，并且您在消息输出中收到了 20 个令牌，则将为您计费30个令牌。

要查看 API 调用使用了多少令牌，请检查 API 响应中的 `usage` 字段（例如，`response['usage']['total_tokens']`）。

像 `gpt-3.5-turbo` 和 `gpt-4` 这样的聊天模型以与其他模型相同的方式使用标记，但由于它们基于消息格式化，因此更难计算会话将使用多少标记。

深入探究:

计算聊天API调用的令牌数

以下是一个示例函数，用于计算传递给gpt-3.5-turbo-0301的消息的令牌数。

将消息转换为标记的确切方式可能因模型而异。因此，当发布未来模型版本时，此功能返回的答案可能只是近似值。 ChatML文档解释了OpenAI API如何将消息转换为标记，并且编写自己的函数可能会有所帮助。

```
def num_tokens_from_messages(messages, model="gpt-3.5-turbo-0301"):
  """Returns the number of tokens used by a list of messages."""
  try:
      encoding = tiktoken.encoding_for_model(model)
  except KeyError:
      encoding = tiktoken.get_encoding("cl100k_base")
  if model == "gpt-3.5-turbo-0301":  # note: future models may deviate from this
      num_tokens = 0
      for message in messages:
          num_tokens += 4  # every message follows <im_start>{role/name}\n{content}<im_end>\n
          for key, value in message.items():
              num_tokens += len(encoding.encode(value))
              if key == "name":  # if there's a name, the role is omitted
                  num_tokens += -1  # role is always required and always 1 token
      num_tokens += 2  # every reply is primed with <im_start>assistant
      return num_tokens
  else:
      raise NotImplementedError(f"""num_tokens_from_messages() is not presently implemented for model {model}.
  See https://github.com/openai/openai-python/blob/main/chatml.md for information on how messages are converted to tokens.""")
  ```


  接下来，创建一条消息并将其传递给上面定义的函数，以查看令牌计数。这应该与API使用参数返回的值相匹配：


```
  messages = [
  {"role": "system", "content": "You are a helpful, pattern-following assistant that translates corporate jargon into plain English."},
  {"role": "system", "name":"example_user", "content": "New synergies will help drive top-line growth."},
  {"role": "system", "name": "example_assistant", "content": "Things working well together will increase revenue."},
  {"role": "system", "name":"example_user", "content": "Let's circle back when we have more bandwidth to touch base on opportunities for increased leverage."},
  {"role": "system", "name": "example_assistant", "content": "Let's talk later when we're less busy about how to do better."},
  {"role": "user", "content": "This late pivot means we don't have time to boil the ocean for the client deliverable."},
]

model = "gpt-3.5-turbo-0301"

print(f"{num_tokens_from_messages(messages, model)} prompt tokens counted.")
# Should show ~126 total_tokens
```

为了确认我们上面的函数生成的数字与API返回的相同，请创建一个新的聊天完成：

```
# example token count from the OpenAI API
import openai


response = openai.ChatCompletion.create(
    model=model,
    messages=messages,
    temperature=0,
)

print(f'{response["usage"]["prompt_tokens"]} prompt tokens used.')
```

要查看文本字符串中有多少令牌而不进行API调用，请使用OpenAI的tiktoken Python库。在OpenAI Cookbook的指南中可以找到示例代码，介绍如何使用tiktoken计算令牌数。

每个传递给API的消息都会消耗内容、角色和其他字段中的令牌数量，以及一些额外的幕后格式化所需的令牌。这可能会在未来略微改变。

如果一个对话包含太多令牌超出了模型最大限制（例如gpt-3.5-turbo超过4096个标记），则必须将其截断、省略或缩小文本大小直至符合要求。请注意，如果从输入消息中删除了某条消息，则模型将失去所有相关知识。

还要注意，非常长的对话更有可能收到不完整回复。例如，长度为4090个标记的`gpt-3.5-turbo`对话只能得到6个标记之后被截断回复。

## 指导聊天模型

指导模型的最佳实践可能会随着模型版本的变化而改变。以下建议适用于`gpt-3.5-turbo-0301`，未来的模型可能不适用。

许多对话都以系统消息开始，以温和地指导助手。例如，这是ChatGPT使用的其中一条系统消息：

>你是由OpenAI培训的大语言模型ChatGPT。请尽可能简洁地回答问题。知识截止日期：{knowledge_cutoff} 当前日期：{current_date}

总体而言，gpt-3.5-turbo-0301并不十分关注系统消息，因此重要说明通常更好地放置在用户消息中。

如果模型没有生成您想要的输出，请随意迭代并尝试潜在的改进。您可以尝试以下方法：

使您的指令更加明确

指定所需答案的格式

要求模型逐步思考或辩论利弊，然后再确定答案

为了获得更多的工程思路，请阅读OpenAI Cookbook指南，了解提高可靠性的技术。

除系统消息外，温度和最大标记是开发人员影响聊天模型输出的众多选项之一。对于温度而言，较高值（如0.8）会使输出更随机，而较低值（如0.2）则会使其更加集中和确定性。在max tokens方面，如果您想将响应限制为某个长度，则可以将max tokens设置为任意数字。例如，如果您将max tokens值设置为5，则可能会出现问题，因为输出将被截断，并且结果对用户来说没有意义。

## 聊天对比完成度

由于`gpt-3.5-turbo`的性能类似于`text-davinci-003`，但每个标记的价格只有其10％，因此我们建议在大多数用例中使用`gpt-3.5-turbo`。

对于许多开发人员来说，转换就像重写和重新测试提示一样简单。

例如，如果您使用以下完成度提示将英语翻译为法语：

```
Translate the following English text to French: "{text}"
```

一个等价的聊天对话可能如下：

```
[
  {"role": "system", "content": "You are a helpful assistant that translates English to French."},
  {"role": "user", "content": 'Translate the following English text to French: "{text}"'}
]
```

甚至只是用户留言：

```
[
  {"role": "user", "content": 'Translate the following English text to French: "{text}"'}
]
```

## FAQ常见问题解答

gpt-3.5-turbo 可以进行微调吗？

不可以。截至2023年3月1日，您只能对基础的GPT-3模型进行微调。请参阅微调指南，了解如何使用经过微调的模型。

您是否存储通过API传递的数据？

截至2023年3月1日，我们会保留您的API数据30天，但不再使用通过API发送的数据来改进我们的模型。请在我们的数据使用政策中了解更多信息。

添加一个审查层

如果您想要在聊天API的输出中添加一个审查层，您可以按照我们的审查指南来防止显示违反OpenAI使用政策的内容。






