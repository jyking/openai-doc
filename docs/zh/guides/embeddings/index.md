# 嵌入

什么是嵌入？

OpenAI的文本嵌入测量文本字符串之间的相关性。 嵌入通常用于：
搜索（结果按查询字符串相关性排序）

聚类（将文本字符串按相似性分组）

推荐（推荐具有相关文本字符串的项目）

异常检测（识别与其他内容关联度较小的离群值）

多样性测量（分析相似度分布情况）

分类（根据最相似标签对文本字符串进行分类）

嵌入是一个浮点数向量列表。两个向量之间的距离衡量它们之间的相关性。小距离表示高相关性，大距离表示低相关性。

请访问我们的定价页面了解嵌入价格。请求基于发送输入中令牌数量计费。

```
要查看嵌入的实际应用，请查看我们的代码示例

分类

主题聚类

搜索

推荐

浏览示例
```

## 如何获取嵌入

要获取嵌入，将您的文本字符串发送到嵌入API端点，并选择一个嵌入模型ID（例如text-embedding-ada-002）。响应将包含一个嵌入，您可以提取、保存和使用。

示例请求：

```
curl https://api.openai.com/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "input": "Your text string goes here",
    "model": "text-embedding-ada-002"
  }'
```

示例回复：

```
{
  "data": [
    {
      "embedding": [
        -0.006929283495992422,
        -0.005336422007530928,
        ...
        -4.547132266452536e-05,
        -0.024047505110502243
      ],
      "index": 0,
      "object": "embedding"
    }
  ],
  "model": "text-embedding-ada-002",
  "object": "list",
  "usage": {
    "prompt_tokens": 5,
    "total_tokens": 5
  }
}
```

在OpenAI Cookbook中查看更多Python代码示例。

使用OpenAI嵌入时，请注意它们的限制和风险。

嵌入模型

OpenAI 提供了一个第二代嵌入模型（在模型 ID 中标记为 -002）和 16 个第一代模型（在模型 ID 中标记为 -001）。

我们建议几乎所有用例都使用 text-embedding-ada-002。它更好、更便宜、更简单易用。请阅读博客文章公告。

模型生成器  分词器  最大输入标记数  知识截断

V2  cl100k_base  8191  2021年9月

V1  GPT-2/GPT-3  2046  2020年8月

使用按输入令牌计价，每1000个令牌的费率为$0.0004，或者大约每美元3000页（假设每页约800个令牌）：

型号  每美元粗略页面数  在BEIR搜索评估中的示例性能

文本嵌入ada-002   3000   53.9

*-davinci-*-001   6    52.8

*-curie-*-001    60    50.9

*-babbage-*-001  240    50.4

*-ada-*-001      300    49.0

第二代模型

模型名称  分词器  最大输入标记数  输出维度

text-embedding-ada-002  cl100k_base  8191  1536

第一代模型（不建议使用）

## 用例

这里我们展示一些代表性的用例。以下示例将使用亚马逊美食评论数据集。

## 获取嵌入
该数据集包含截至2012年10月亚马逊用户留下的共计568,454条食品评论。我们将使用最近1,000条评论的子集进行说明。这些评论是用英语撰写的，往往是积极或消极的。每个评论都有一个产品ID、用户ID、评分、评论标题（摘要）和评论正文（文本）。例如：

产品ID  用户ID   得分   摘要  正文

B001E4KFG0  A3SGXH7AUHU8GW  5  优质的狗粮我已经买了几罐活力罐头...

B00813GRG4  A1D87F6ZCVE5NK  1  不如广告描述该产品标签上写着巨型盐腌花生...

```
def get_embedding(text, model="text-embedding-ada-002"):
   text = text.replace("\n", " ")
   return openai.Embedding.create(input = [text], model=model)['data'][0]['embedding']

df['ada_embedding'] = df.combined.apply(lambda x: get_embedding(x, model='text-embedding-ada-002'))
df.to_csv('output/embedded_1k_reviews.csv', index=False)
```

要从已保存的文件中加载数据，您可以运行以下命令：

```
import pandas as pd

df = pd.read_csv('output/embedded_1k_reviews.csv')
df['ada_embedding'] = df.ada_embedding.apply(eval).apply(np.array)
```

