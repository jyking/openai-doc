# 适度

## 概述

Moderation endpoint是一个工具，您可以使用它来检查内容是否符合OpenAI的使用政策。开发人员因此可以识别出我们的使用政策禁止的内容，并采取行动，例如通过过滤它。

该模型分类以下类别：

类别    描述

仇恨    表达、煽动或宣传基于种族、性别、民族、宗教、国籍、性取向、残疾状态或种姓的仇恨内容。

仇恨/威胁   包括针对特定群体的暴力或严重伤害的仇恨内容。

自我伤害    促进、鼓励或描绘自我伤害行为，如自杀，割伤和饮食失调等内容。

色情    旨在引起性兴奋的内容，例如描述性活动或推广性服务（不包括性教育和健康）。

色情/未成年人    涉及未满18岁个体的色情内容。

暴力    推广或美化暴力，庆祝他人遭受苦难或屈辱的内容。

暴力/图形化     以极端详细方式描绘死亡、暴力或严重身体损伤等具有暴力倾向的内容。

当监控OpenAI API的输入和输出时，中介端点可免费使用。我们目前不支持监控第三方流量。

>我们正在不断努力改进我们的分类器准确性，特别是在仇恨、自残和暴力/图形内容方面进行改进。我们目前对非英语语言的支持还有限。

## 快速入门

要为一段文本获取分类，请像以下代码片段中演示的那样向审核终端点发出请求：

```
curl https://api.openai.com/v1/moderations \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{"input": "Sample text goes here"}'
  ```

  以下是端点的示例输出。它返回以下字段：

flagged：如果模型将内容分类为违反OpenAI使用政策，则设置为true，否则为false。

categories：包含每个类别二进制使用政策违规标志的字典。对于每个类别，如果模型将相应的类别标记为违规，则该值为true，否则为false。

category_scores：包含由模型输出的每个类别原始分数的字典，表示模型对输入是否违反OpenAI该类别政策的信心度。该值介于0和1之间，其中较高的值表示更高的置信度。不应将得分解释为概率。

```{
  "id": "modr-XXXXX",
  "model": "text-moderation-001",
  "results": [
    {
      "categories": {
        "hate": false,
        "hate/threatening": false,
        "self-harm": false,
        "sexual": false,
        "sexual/minors": false,
        "violence": false,
        "violence/graphic": false
      },
      "category_scores": {
        "hate": 0.18805529177188873,
        "hate/threatening": 0.0001250059431185946,
        "self-harm": 0.0003706029092427343,
        "sexual": 0.0008735615410842001,
        "sexual/minors": 0.0007470346172340214,
        "violence": 0.0041268812492489815,
        "violence/graphic": 0.00023186142789199948
      },
      "flagged": false
    }
  ]
}
```

OpenAI将持续升级Moderation Endpoint的基础模型。因此，依赖于category_scores的自定义策略可能需要随时间重新校准。
