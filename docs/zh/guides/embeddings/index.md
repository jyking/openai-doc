# 嵌入

什么是嵌入？

OpenAI的文本嵌入测量文本字符串之间的相关性。 嵌入通常用于：
1. 搜索（结果按查询字符串相关性排序）

2. 聚类（将文本字符串按相似性分组）

3. 推荐（推荐具有相关文本字符串的项目）

4. 异常检测（识别与其他内容关联度较小的离群值）

5. 多样性测量（分析相似度分布情况）

6. 分类（根据最相似标签对文本字符串进行分类）

-嵌入是一个浮点数向量列表。两个向量之间的距离衡量它们之间的相关性。小距离表示高相关性，大距离表示低相关性。

请访问我们的定价页面了解嵌入价格。请求基于发送输入中令牌数量计费。

```
要查看嵌入的实际应用，请查看我们的代码示例

分类

主题聚类

搜索

推荐

浏览示例
```

### 如何获取嵌入

要获取嵌入，将您的文本字符串发送到嵌入API端点，并选择一个嵌入模型ID（例如`text-embedding-ada-002`）。响应将包含一个嵌入，您可以提取、保存和使用。

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

OpenAI 提供了一个第二代嵌入模型（在模型 ID 中标记为 `-002`）和 16 个第一代模型（在模型 ID 中标记为 `-001`）。

我们建议几乎所有用例都使用 text-embedding-ada-002。它更好、更便宜、更简单易用。请阅读博客文章公告。

模型生成器 | 分词器 | 最大输入标记数 | 知识截断
--|--|--|--
V2 | cl100k_base | 8191 | 2021年9月
V1  |GPT-2/GPT-3 | 2046 | 2020年8月

使用按输入令牌计价，每1000个令牌的费率为$0.0004，或者大约每美元3000页（假设每页约800个令牌）：

型号 | 每美元粗略页面数  |在BEIR搜索评估中的示例性能
--|--|--
文本嵌入ada-002 |  3000 |  53.9
*-davinci-*-001 |  6   | 52.8
*-curie-*-001  |  60   | 50.9
*-babbage-*-001 | 240  |  50.4
*-ada-*-001   |   300  |  49.0

第二代模型

模型名称 | 分词器  |最大输入标记数 | 输出维度
--|--|--|--
text-embedding-ada-002 | cl100k_base | 8191 | 1536

第一代模型（不建议使用）

## 用例

这里我们展示一些代表性的用例。以下示例将使用亚马逊美食评论数据集。

### 获取嵌入
该数据集包含截至2012年10月亚马逊用户留下的共计568,454条食品评论。我们将使用最近1,000条评论的子集进行说明。这些评论是用英语撰写的，往往是积极或消极的。每个评论都有一个产品ID、用户ID、评分、评论标题（摘要）和评论正文（文本）。例如：

产品ID | 用户ID |  得分  | 摘要  |正文
--|--|--|--|--
B001E4KFG0 | A3SGXH7AUHU8GW|  5 | 优质的狗粮| 我已经买了几罐活力罐头...
B00813GRG4 | A1D87F6ZCVE5NK|  1 | 不如广告描述 |该产品标签上写着巨型盐腌花生...

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

### 2D数据可视化

嵌入的大小取决于底层模型的复杂性。为了可视化这个高维数据，我们使用t-SNE算法将数据转换成二维。

我们根据评论者给出的星级评分对每篇评论进行着色：

- 1星：红色

- 2星：深橙色

- 3星：金色

- 4星：青绿色

- 5星：深绿色



这个可视化似乎产生了大约3个聚类，其中一个主要是负面评价。

```
import pandas as pd
from sklearn.manifold import TSNE
import matplotlib.pyplot as plt
import matplotlib

df = pd.read_csv('output/embedded_1k_reviews.csv')
matrix = df.ada_embedding.apply(eval).to_list()

# Create a t-SNE model and transform the data
tsne = TSNE(n_components=2, perplexity=15, random_state=42, init='random', learning_rate=200)
vis_dims = tsne.fit_transform(matrix)

colors = ["red", "darkorange", "gold", "turquiose", "darkgreen"]
x = [x for x,y in vis_dims]
y = [y for x,y in vis_dims]
color_indices = df.Score.values - 1

colormap = matplotlib.colors.ListedColormap(colors)
plt.scatter(x, y, c=color_indices, cmap=colormap, alpha=0.3)
plt.title("Amazon ratings visualized in language using t-SNE")
```

### 嵌入作为文本特征编码器用于机器学习算法

这次，我们不再让算法预测1到5之间的任意值，而是尝试将评论的星级精确分类为从1到5颗星的五个桶。

在训练后，模型学会了更好地预测1和5颗星的评论，而对于更微妙（2-4颗星）的评论则表现得不太好，这可能是由于情感表达更加极端。

```
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score

clf = RandomForestClassifier(n_estimators=100)
clf.fit(X_train, y_train)
preds = clf.predict(X_test)
```

### 零样本分类

我们可以使用嵌入来进行零样本分类，而无需任何标记的训练数据。对于每个类别，我们将类名或类的简短描述嵌入其中。为了以零样本方式对一些新文本进行分类，我们将其嵌入与所有类别嵌入进行比较，并预测相似度最高的类别。

```
from openai.embeddings_utils import cosine_similarity, get_embedding

df= df[df.Score!=3]
df['sentiment'] = df.Score.replace({1:'negative', 2:'negative', 4:'positive', 5:'positive'})

labels = ['negative', 'positive']
label_embeddings = [get_embedding(label, model=model) for label in labels]

def label_score(review_embedding, label_embeddings):
   return cosine_similarity(review_embedding, label_embeddings[1]) - cosine_similarity(review_embedding, label_embeddings[0])

prediction = 'positive' if label_score('Sample Review', label_embeddings) > 0 else 'negative'
```

### 获取用户和产品嵌入以进行冷启动推荐

我们可以通过对用户的所有评论进行平均来获得用户嵌入。同样地，我们可以通过对有关该产品的所有评论进行平均来获得产品嵌入。为了展示这种方法的实用性，我们使用50k个评论的子集以涵盖更多用户和产品的评论。

我们在一个单独的测试集上评估这些嵌入的实用性，在那里我们绘制用户和产品嵌入相似度作为评分函数。有趣的是，基于这种方法，即使在用户收到产品之前，我们也能比随机预测他们是否会喜欢该产品。



```
user_embeddings = df.groupby('UserId').ada_embedding.apply(np.mean)
prod_embeddings = df.groupby('ProductId').ada_embedding.apply(np.mean)
```

### 聚类

聚类是处理大量文本数据的一种方法。嵌入向量对于此任务非常有用，因为它们提供每个文本的语义有意义的向量表示。因此，在无监督的情况下，聚类将揭示我们数据集中隐藏的分组。

在这个例子中，我们发现了四个不同的簇：一个关注狗粮，一个关注负面评论，两个关注正面评论。

```
import numpy as np
from sklearn.cluster import KMeans

matrix = np.vstack(df.ada_embedding.values)
n_clusters = 4

kmeans = KMeans(n_clusters = n_clusters, init='k-means++', random_state=42)
kmeans.fit(matrix)
df['Cluster'] = kmeans.labels_
```

### 使用嵌入进行文本搜索

为了检索最相关的文档，我们使用查询嵌入向量和每个文档之间的余弦相似度，并返回得分最高的文档。

```
from openai.embeddings_utils import get_embedding, cosine_similarity

def search_reviews(df, product_description, n=3, pprint=True):
   embedding = get_embedding(product_description, model='text-embedding-ada-002')
   df['similarities'] = df.ada_embedding.apply(lambda x: cosine_similarity(x, embedding))
   res = df.sort_values('similarities', ascending=False).head(n)
   return res

res = search_reviews(df, 'delicious beans', n=3)
```

### 使用嵌入进行代码搜索

代码搜索与基于嵌入的文本搜索类似。我们提供一种方法，从给定代码库中的所有Python文件中提取Python函数。然后，每个函数都由`text-embedding-ada-002`模型进行索引。

要执行代码搜索，我们使用相同的模型将查询以自然语言形式嵌入。然后，我们计算结果查询嵌入和每个函数嵌入之间的余弦相似度。最高余弦相似度结果最相关。

```
from openai.embeddings_utils import get_embedding, cosine_similarity

df['code_embedding'] = df['code'].apply(lambda x: get_embedding(x, model='text-embedding-ada-002'))

def search_functions(df, code_query, n=3, pprint=True, n_lines=7):
   embedding = get_embedding(code_query, model='text-embedding-ada-002')
   df['similarities'] = df.code_embedding.apply(lambda x: cosine_similarity(x, embedding))

   res = df.sort_values('similarities', ascending=False).head(n)
   return res
res = search_functions(df, 'Completions API tests', n=3)
```

### 使用嵌入推荐

因为嵌入向量之间的距离越短，表示它们之间的相似度越高，所以嵌入可以用于推荐。

下面我们展示一个基本的推荐器。它接收一组字符串和一个“源”字符串，计算它们的嵌入，并返回按相似度从高到低排名的字符串列表。作为具体例子，下面链接中的笔记本应用了这个函数版本来处理AG新闻数据集（采样至2000篇新闻文章描述），以返回与任何给定源文章最相似的前5篇文章。

```
def recommendations_from_strings(
   strings: List[str],
   index_of_source_string: int,
   model="text-embedding-ada-002",
) -> List[int]:
   """Return nearest neighbors of a given string."""

   # get embeddings for all strings
   embeddings = [embedding_from_string(string, model=model) for string in strings]

   # get the embedding of the source string
   query_embedding = embeddings[index_of_source_string]

   # get distances between the source embedding and other embeddings (function from embeddings_utils.py)
   distances = distances_from_embeddings(query_embedding, embeddings, distance_metric="cosine")

   # get indices of nearest neighbors (function from embeddings_utils.py)
   indices_of_nearest_neighbors = indices_of_nearest_neighbors_from_distances(distances)
   return indices_of_nearest_neighbors
```

## 限制和风险

我们的嵌入模型在某些情况下可能不可靠或存在社会风险，并且在缺乏减轻措施的情况下可能会造成伤害。

### 社会偏见

>限制：这些模型通过刻板印象或对某些群体的负面情绪编码了社会偏见。

我们通过运行SEAT（May等人，2019）和Winogender（Rudinger等人，2018）基准测试发现我们的模型存在偏见证据。这些基准测试共包括7个测试，用于衡量模型在应用于性别化名称、地区名称和某些刻板印象时是否含有隐含偏见。

例如，我们发现我们的模型更强烈地将（a）欧洲裔美国人的名字与积极情感联系起来，而与非洲裔美国人的名字相比，则不是那么明显；以及（b）将负面刻板印象与黑女性联系起来。

这些基准测试在多个方面都有限制：(a)它们可能无法推广到您特定的使用案例中；(b)它们仅对可能存在社会偏见的一小部分进行了测试。

这些测试是初步结果，并且我们建议针对您特定的使用案例进行测试。这些结果应被视为该现象存在的证据，并非对您使用案例中该现象作出最终描述。请参阅我们的使用政策以获取更多详细信息和指导。

如果您有任何问题，请通过聊天联系我们支持团队； 我们很乐意为此提供建议。

### 对最近事件的无视

>限制：模型缺乏对2020年8月之后发生事件的了解。

我们的模型是基于包含有关现实世界事件信息的数据集进行训练的，但仅限于2020年8月之前。如果您依赖这些模型来代表最近发生的事件，则它们可能表现不佳

### 常见问题

### 如何在嵌入字符串之前确定它有多少个标记？

在Python中，您可以使用OpenAI的分词器`tiktoken`将字符串拆分为标记。

示例代码：

```
import tiktoken

def num_tokens_from_string(string: str, encoding_name: str) -> int:
    """Returns the number of tokens in a text string."""
    encoding = tiktoken.get_encoding(encoding_name)
    num_tokens = len(encoding.encode(string))
    return num_tokens

num_tokens_from_string("tiktoken is great!", "cl100k_base")
```

对于像`text-embedding-ada-002`这样的第二代嵌入模型，请使用`cl100k_base`编码。

更多细节和示例代码在OpenAI Cookbook指南中，介绍如何使用tiktoken计算标记。

如何快速检索K个最近的嵌入向量？

为了快速搜索许多向量，我们建议使用向量数据库。您可以在我们在GitHub上的Cookbook中找到有关与向量数据库和OpenAI API一起工作的示例。

### 可用的向量数据库选项包括：

- Pinecone，一个完全托管的向量数据库

- Weaviate，一个开源矢量搜索引擎

- Redis作为矢量数据库

- Qdrant，一个矢量搜索引擎

- Milvus，专为可伸缩相似性搜索而构建的矢量数据库

- Chroma，一个开源嵌入存储库

### 我应该使用哪种距离函数？

我们推荐余弦相似度。通常，距离函数的选择并不重要。

OpenAI嵌入已经被归一化为长度1，这意味着：

可以仅使用点积更快地计算余弦相似度

余弦相似度和欧几里得距离将产生相同的排名

### 我可以在线分享我的嵌入向量吗？

客户拥有我们模型的输入和输出，包括嵌入向量。您需要确保您在使用我们的API时输入的内容不违反任何适用法律或我们的使用条款。




