# 介绍

## 概述

OpenAI API 可应用于理解或生成自然语言、代码或图像的几乎所有任务。我们提供一系列不同功率级别的模型，适用于不同的任务，并具有微调自定义模型的能力。这些模型可以用于从内容生成到语义搜索和分类的一切。

### 关键概念

我们建议完成我们的快速入门教程，通过实践交互式实例熟悉关键概念。

### 提示

设计您的提示本质上是如何“编程”模型，通常是通过提供一些说明或几个示例。这与大多数其他 NLP 服务不同，这些服务设计用于单个任务，例如情感分类或命名实体识别。取而代之的是，在内容或代码生成、摘要、扩展、对话、创意写作、样式转换等几乎任何任务中，可以使用完成和聊天完成端点。

### 令牌

我们的模型通过将文本分解为令牌来理解和处理文本。令牌可以是单词或字符块。例如，“汉堡包”一词被分成“ham”，“bur”和“ger”三个令牌，而像“梨子”这样短小常见的单词则是一个令牌。许多令牌以空格开头，例如“你好”和“再见”。

在给定的 API 请求中处理的令牌数量取决于您输入和输出的长度。作为一个粗略的经验法则，对于英文文本，1 个标记大约是 4 个字符或 0.75 个单词。需要注意的一点限制是您的文本提示和生成完成组合必须不超过模型最大上下文长度（对于大多数模型，这是2048个标记或约1500个单词）。请查看我们的分词器工具以了解有关如何将文本转换为标记的更多信息。

### 模型

该API由一组具有不同功能和价格点的模型驱动。 GPT-4是我们最新且最强大的模型。 GPT-3.5-Turbo是ChatGPT所使用的模型，专为对话格式进行了优化。要了解更多关于这些模型以及我们提供的其他内容，请访问我们的模型文档。

## 下一步

- 在开始构建您的应用程序时，请牢记我们的使用政策。
- 探索我们的示例库以获得灵感。
- 阅读我们的指南之一，开始构建。

### 指南

聊天 Beta     
学习如何使用基于聊天的语言模型

文本填充
学习如何生成或编辑文本

嵌入式
学习如何搜索、分类和比较文本

语音转文字测试版
学习如何将音频转换为文本

图像生成 Beta
学习如何生成或编辑图像

微调
学习如何为您的用例训练模型
