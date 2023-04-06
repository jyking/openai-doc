# 微调

学习如何为您的应用程序定制模型。

## 介绍

微调可以通过提供以下内容，使您从API中可用的模型中获得更多收益：

比提示设计更高质量的结果

能够训练更多无法适应提示的示例

由于提示较短而节省令牌

请求延迟较低

GPT-3已经在开放互联网上的大量文本中进行了预训练。当只给出几个示例提示时，它通常可以直观地理解您要执行的任务并生成一个合理的完成结果。这通常被称为“少样本学习”。

通过对比提示中无法容纳的更多示例进行训练，微调可以改善少样本学习，并使您在许多任务上获得更好的结果。一旦模型被微调，您就不需要再提供提示中的示例了。这节省成本并实现低延迟请求。

在高层次上，微调包括以下步骤：

准备并上传训练数据

训练新的微调模型

使用您的微调模型

请访问我们的定价页面，了解有关精细调整模型培训和使用计费方式的更多信息。

## 哪些模型可以进行微调？

目前，只有以下基础模型支持微调：davinci、curie、babbage和ada。这些是原始模型，在训练后没有任何指令（例如text-davinci-003）。您还可以继续对已经微调的模型进行微调，以添加额外的数据而无需从头开始。

## 安装

我们建议使用我们的OpenAI命令行界面（CLI）。要安装它，请运行

>pip install --upgrade openai

（以下说明适用于版本0.9.4及以上。此外，OpenAI CLI需要Python 3。）

通过将以下行添加到您的shell初始化脚本（例如.bashrc、zshrc等）或在fine-tuning命令之前在命令行中运行它来设置OPENAI_API_KEY环境变量：

>export OPENAI_API_KEY="<OPENAI_API_KEY>"

## 准备训练数据

训练数据是教GPT-3说出你想要的话的方法。

您的数据必须是JSONL文档，其中每行都是与一个训练示例相对应的提示-完成对。 您可以使用我们的CLI数据准备工具轻松将您的数据转换为此文件格式。

```
{"prompt": "<prompt text>", "completion": "<ideal generated text>"}
{"prompt": "<prompt text>", "completion": "<ideal generated text>"}
{"prompt": "<prompt text>", "completion": "<ideal generated text>"}
...
```

设计用于微调的提示和完成方式与设计用于我们基础模型（Davinci、Curie、Babbage、Ada）的提示不同。特别是，对于基础模型的提示通常由多个示例组成（“少量学习”），而对于微调，每个训练示例通常包括单个输入示例及其相关输出，无需提供详细说明或在同一提示中包含多个示例。

有关如何为各种任务准备培训数据的更详细指导，请参阅我们准备数据集最佳实践。

您拥有的培训样本越多，效果就越好。我们建议至少有几百个样本。总体而言，我们发现数据集大小翻倍会线性增加模型质量。

###  CLI数据准备工具

我们开发了一个工具，可以验证、提供建议和重新格式化您的数据：

>openai tools fine_tunes.prepare_data -f <LOCAL_FILE>

BASE_MODEL” 是您要从中开始的基础模型的名称（ada、babbage、curie 或 davinci）。您可以使用“suffix”参数自定义微调模型的名称。

运行上述命令会执行以下几个操作：

使用文件 API 上传文件（或使用已经上传的文件）

## 创建一个微调作业

流式传输事件，直到作业完成（这通常需要几分钟，但如果队列中有许多作业或数据集很大，则可能需要数小时）

每个微调工作都始于一个基础模型，该模型默认为Curie。选择的模型会影响模型的性能和运行微调模型的成本。您可以选择以下任意一种模型：Ada、Babbage、Curie或Davinci。请访问我们的定价页面了解有关微调费率的详细信息。

在开始微调作业后，可能需要一些时间才能完成。您的作业可能排在我们系统中其他作业之后，并且根据所选用的数据集大小和模型不同，训练我们的模型可能需要几分钟或数小时时间。如果由于任何原因事件流被中断，则可以通过运行以下命令来恢复它：

>openai api fine_tunes.follow -i <YOUR_FINE_TUNE_JOB_ID>

当工作完成时，它应该显示微调模型的名称。

除了创建微调作业之外，您还可以列出现有的作业、检索作业状态或取消一个作业。

```
# List all created fine-tunes
openai api fine_tunes.list

# Retrieve the state of a fine-tune. The resulting object includes
# job status (which can be one of pending, running, succeeded, or failed)
# and other information
openai api fine_tunes.get -i <YOUR_FINE_TUNE_JOB_ID>

# Cancel a job
openai api fine_tunes.cancel -i <YOUR_FINE_TUNE_JOB_ID>
```

## 使用经过微调的模型

当作业成功完成时，fine_tuned_model字段将填充模型名称。现在，您可以将此模型指定为我们的Completions API参数，并使用Playground向其发出请求。

在作业首次完成后，可能需要几分钟才能使您的模型准备好处理请求。如果对您的模型进行完成请求超时，则很可能是因为正在加载您的模型。如果发生这种情况，请稍后再试。

通过将模型名称作为完成请求的model参数传递来开始发送请求：

OpenAI CLI:

>openai api completions.create -m <FINE_TUNED_MODEL> -p <YOUR_PROMPT>

cURL：

```
curl https://api.openai.com/v1/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt": YOUR_PROMPT, "model": FINE_TUNED_MODEL}'
```

Python:

```
import openai
openai.Completion.create(
    model=FINE_TUNED_MODEL,
    prompt=YOUR_PROMPT)
```

Node.js:

```
const response = await openai.createCompletion({
  model: FINE_TUNED_MODEL
  prompt: YOUR_PROMPT,
});
```

您可以继续在这些请求中使用所有其他完成参数，例如温度、频率惩罚、存在惩罚等，以对微调模型进行优化。

## 删除一个经过优化的模型

要删除一个经过优化的模型，您必须在组织内被指定为“所有者”。

OpenAI CLI:

>openai api models.delete -i <FINE_TUNED_MODEL>

cURL:

```
curl -X "DELETE" https://api.openai.com/v1/models/<FINE_TUNED_MODEL> \
  -H "Authorization: Bearer $OPENAI_API_KEY"
  ```

  Python:

```
  import openai
openai.Model.delete(FINE_TUNED_MODEL)
```

# 准备数据集

微调是一种强大的技术，可以创建一个特定于您使用情况的新模型。在微调模型之前，我们强烈建议阅读以下最佳实践和特定用例的指南。

## 数据格式化

为了微调模型，您需要一组训练示例，每个示例都包含一个单独的输入（“提示”）及其相关输出（“完成”）。这与使用我们的基础模型有明显不同，在基础模型中，您可能会在单个提示中输入详细说明或多个示例。

每个提示应以固定分隔符结尾，以通知模型何时结束提示并开始完成。一个通常有效的简单分隔符是\n\n###\n\n。该分隔符不应出现在任何提示中的其他位置。

由于我们的标记化将大多数词语与前导空格一起标记化，因此每个完成都应以空格开头。

每个完成都应以固定停止序列结尾，以通知模型何时结束完成。停止序列可以是 \n、### 或任何未出现在任何完成中的其他令牌。

对于推理，请按创建训练数据集时相同方式格式化您的提示，并指定相同的停止序列来正确截断完成。

## 一般最佳实践

微调需要更多高质量的示例才能表现得更好。为了微调比使用我们的基础模型和高质量提示表现更好的模型，您应该提供至少几百个经过人类专家审核的高质量示例。从那里开始，性能往往会随着每倍增加数量而线性增加。增加样本数量通常是改善性能的最佳且最可靠的方法。

分类器是入门最容易的模型。对于分类问题，我们建议使用ada，在微调后通常只会略微劣于更强大的模型，同时速度和成本显著降低。

如果您正在对预先存在数据集进行微调而不是从头编写提示，请务必手动检查数据以查找冒犯或不准确内容（如果可能），或者尽可能审查数据集中许多随机样本（如果它很大）。

## 具体指南

微调可以解决各种问题，最佳使用方式可能取决于您的具体用例。以下是微调的最常见用例和相应的指南。

分类

模型是否发表不实言论？

情感分析

### 电子邮件分类

条件生成

根据维基百科文章编写引人入胜的广告

实体提取

客户支持聊天机器人

基于技术属性列表的产品描述

### 分类问题

在分类问题中，每个输入都应该被归类到预定义的某一类别。对于这种类型的问题，我们建议：

在提示语句末尾使用分隔符，例如 \n\n###\n\n。记得在最终向模型发出请求时也要附加此分隔符。

选择映射到单个标记的类别。在推理时，指定 max_tokens=1，因为你只需要第一个标记进行分类。

确保提示 + 完成不超过2048个标记（包括分隔符）。

针对每个类别至少有 ~100 个示例。

如果想获取类别日志概率，则可以在使用模型时指定 logprobs=5（表示5个类别）。

确保用于微调的数据集与模型将要用于的任务结构和类型非常相似。

### 案例研究：模型是否发表不实言论？

假设您想确保网站广告的文本提到正确的产品和公司。换句话说，您希望确保模型没有编造东西。您可能需要微调分类器以过滤掉不正确的广告。

数据集可能如下所示：

```
{"prompt":"Company: BHFF insurance\nProduct: allround insurance\nAd:One stop shop for all your insurance needs!\nSupported:", "completion":" yes"}
{"prompt":"Company: Loft conversion specialists\nProduct: -\nAd:Straight teeth in weeks!\nSupported:", "completion":" no"}
```

在上面的示例中，我们使用了一个结构化输入，其中包含公司名称、产品和相关广告。作为分隔符，我们使用了\nSupported:来清晰地将提示与完成分开。有足够数量的示例时，分隔符并不会产生太大影响（通常少于0.4%），只要它不出现在提示或完成内部即可。

对于这种用例，我们微调了ada模型，因为它速度更快、成本更低，并且性能与较大的模型相当，因为这是一个分类任务。

现在我们可以通过发出“Completion”请求来查询我们的模型。

```
curl https://api.openai.com/v1/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "prompt": "Company: Reliable accountants Ltd\nProduct: Personal Tax help\nAd:Best advice in town!\nSupported:",
    "max_tokens": 1,
    "model": "YOUR_FINE_TUNED_MODEL_NAME"
  }'
```

将返回“是”或“否”。

### 案例研究：情感分析

假设您想要获得一条特定推文的积极或消极程度。数据集可能如下所示：

```
{"prompt":"Overjoyed with the new iPhone! ->", "completion":" positive"}
{"prompt":"@lakers disappoint for a third straight night https://t.co/38EFe43 ->", "completion":" negative"}
```

一旦模型微调完成，您可以通过在完成请求中设置logprobs=2来获取第一个完成标记的对数概率。正类别的概率越高，情感相对就越高。

现在我们可以通过发出“Completion”请求来查询我们的模型。

```
curl https://api.openai.com/v1/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "prompt": "https://t.co/f93xEd2 Excited to share my latest blog post! ->",
    "max_tokens": 1,
    "model": "YOUR_FINE_TUNED_MODEL_NAME"
  }'
```

将返回：

```
{
  "id": "cmpl-COMPLETION_ID",
  "object": "text_completion",
  "created": 1589498378,
  "model": "YOUR_FINE_TUNED_MODEL_NAME",
  "choices": [
    {
      "logprobs": {
        "text_offset": [
          19
        ],
        "token_logprobs": [
          -0.03597255
        ],
        "tokens": [
          " positive"
        ],
        "top_logprobs": [
          {
            " negative": -4.9785037,
            " positive": -0.03597255
          }
        ]
      },

      "text": " positive",
      "index": 0,
      "finish_reason": "length"
    }
  ]
}
```

### 案例研究：电子邮件分类

假设您想将收到的电子邮件归类为大量预定义的类别之一。对于大量类别的分类，我们建议您将这些类别转换为数字，这在 ~500 个类别以下效果良好。我们观察到，在数字前添加一个空格有时会略微提高性能，因为它可以进行分词处理。您可能希望按以下方式构建培训数据：

```
{"prompt":"Subject: <email_subject>\nFrom:<customer_name>\nDate:<date>\nContent:<email_body>\n\n###\n\n", "completion":" <numerical_category>"}
```

例如：

```
{"prompt":"Subject: Update my address\nFrom:Joe Doe\nTo:support@ourcompany.com\nDate:2021-06-03\nContent:Hi,\nI would like to update my billing address to match my delivery address.\n\nPlease let me know once done.\n\nThanks,\nJoe\n\n###\n\n", "completion":" 4"}
```

在上面的例子中，我们使用了一个最多包含2043个标记的传入电子邮件作为输入。（这允许4个标记分隔符和一个标记完成，总计2048。）作为分隔符，我们使用了\n\n###\n\n，并删除了电子邮件中任何出现的###。

### 条件生成

条件生成是一个问题，需要在给定某种输入的情况下生成内容。这包括改写、摘要、实体提取、根据规格编写产品描述、聊天机器人等。对于这种类型的问题，我们建议：

在提示末尾使用分隔符，例如\n\n###\n\n。记得在最终向模型发出请求时也附加此分隔符。

在完成时使用结束标记，例如END。

记得在推理期间将结束标记添加为停止序列，例如stop=[" END"]。

目标至少达到~500个示例

确保提示+完成不超过2048个令牌（包括分隔符）

确保示例具有高质量并遵循相同的所需格式

确保用于微调的数据集与模型将要用于的任务结构和类型非常相似

### 案例研究：基于维基百科文章编写引人入胜的广告

这是一个生成式用例，因此您需要确保提供的样本具有最高质量，因为微调模型将尝试模仿给定示例的风格（和错误）。一个好的起点大约是500个示例。样本数据集可能如下所示：

```
{"prompt":"<Product Name>\n<Wikipedia description>\n\n###\n\n", "completion":" <engaging ad> END"}
```

```
{"prompt":"Samsung Galaxy Feel\nThe Samsung Galaxy Feel is an Android smartphone developed by Samsung Electronics exclusively for the Japanese market. The phone was released in June 2017 and was sold by NTT Docomo. It runs on Android 7.0 (Nougat), has a 4.7 inch display, and a 3000 mAh battery.\nSoftware\nSamsung Galaxy Feel runs on Android 7.0 (Nougat), but can be later updated to Android 8.0 (Oreo).\nHardware\nSamsung Galaxy Feel has a 4.7 inch Super AMOLED HD display, 16 MP back facing and 5 MP front facing cameras. It has a 3000 mAh battery, a 1.6 GHz Octa-Core ARM Cortex-A53 CPU, and an ARM Mali-T830 MP1 700 MHz GPU. It comes with 32GB of internal storage, expandable to 256GB via microSD. Aside from its software and hardware specifications, Samsung also introduced a unique a hole in the phone's shell to accommodate the Japanese perceived penchant for personalizing their mobile phones. The Galaxy Feel's battery was also touted as a major selling point since the market favors handsets with longer battery life. The device is also waterproof and supports 1seg digital broadcasts using an antenna that is sold separately.\n\n###\n\n", "completion":"Looking for a smartphone that can do it all? Look no further than Samsung Galaxy Feel! With a slim and sleek design, our latest smartphone features high-quality picture and video capabilities, as well as an award winning battery life. END"}
```

在这里，我们使用了多行分隔符，因为维基百科文章包含多个段落和标题。我们还使用了一个简单的结束标记，以确保模型知道何时完成生成文本。

### 案例研究：实体提取

这类似于语言转换任务。为了提高性能，最好将不同的提取实体按字母顺序或与它们在原始文本中出现的顺序相同的方式进行排序。这将有助于模型跟踪需要按顺序生成的所有实体。数据集可能如下所示：

```
{"prompt":"<any text, for example news article>\n\n###\n\n", "completion":" <list of entities, separated by a newline> END"}
```

例如：

```
{"prompt":"Portugal will be removed from the UK's green travel list from Tuesday, amid rising coronavirus cases and concern over a \"Nepal mutation of the so-called Indian variant\". It will join the amber list, meaning holidaymakers should not visit and returnees must isolate for 10 days...\n\n###\n\n", "completion":" Portugal\nUK\nNepal mutation\nIndian variant END"}
```

最好使用多行分隔符，因为文本很可能包含多行。理想情况下，输入提示的类型应该具有高度的多样性（新闻文章、维基百科页面、推特、法律文件等），这反映了在提取实体时可能遇到的文本类型。

### 案例研究：客户支持聊天机器人

聊天机器人通常会包含与对话相关的上下文（订单详情）、迄今为止对话的摘要以及最近的消息。对于这种用例，同一过去的对话可以生成数据集中不同上下文稍微不同但每次都是代理生成完成语句所需的多个行。由于它可能涉及不同类型的请求和客户问题，因此此用例将需要几千个示例。为确保性能高质量，我们建议审核对话样本以确保代理消息质量。摘要可以使用单独调整后模型进行生成。数据集如下所示：

```
{"prompt":"Summary: <summary of the interaction so far>\n\nSpecific information:<for example order details in natural language>\n\n###\n\nCustomer: <message1>\nAgent: <response1>\nCustomer: <message2>\nAgent:", "completion":" <response2>\n"}
{"prompt":"Summary: <summary of the interaction so far>\n\nSpecific information:<for example order details in natural language>\n\n###\n\nCustomer: <message1>\nAgent: <response1>\nCustomer: <message2>\nAgent: <response2>\nCustomer: <message3>\nAgent:", "completion":" <response3>\n"}
```

在这里，我们有意地将不同类型的输入信息分开，但保持了客户代理对话在提示和完成之间的相同格式。所有的完成都应该由代理人完成，在进行推断时可以使用 \n 作为停止序列。

### 案例研究：基于技术属性列表的产品描述

在这种情况下，将输入数据转换为自然语言非常重要，这可能会导致更好的性能。例如，以下格式：

```
{"prompt":"Item=handbag, Color=army_green, price=$99, size=S->", "completion":" This stylish small green handbag will add a unique touch to your look, without costing you a fortune."}
```

不会像...一样有效：

```
{"prompt":"Item is a handbag. Colour is army green. Price is midrange. Size is small.->", "completion":" This stylish small green handbag will add a unique touch to your look, without costing you a fortune."}
```

为了获得高性能，请确保完成是基于提供的描述。如果经常查阅外部内容，则以自动化方式添加此类内容将改善性能。如果描述基于图像，则使用算法提取图像的文本描述可能会有所帮助。由于完成只有一句话长，因此我们可以在推理过程中使用“。”作为停止序列。

# 高级用法

## 自定义模型名称

您可以使用后缀参数将最多40个字符的后缀添加到您的微调模型名称中。

OpenAI CLI:

>openai api fine_tunes.create -t test.jsonl -m ada --suffix "custom model name"

结果的名称将是：

>ada:ft-your-org:custom-model-name-2022-02-15-04-21-04

## 分析您的微调模型

一旦作业完成，我们会将结果文件附加到每个作业中。当您检索微调时，此结果文件ID将被列出，并且在查看微调事件时也会显示。 您可以下载这些文件：

OpenAI CLI：

>openai api fine_tunes.results -i <YOUR_FINE_TUNE_JOB_ID>

CURL：

```
curl https://api.openai.com/v1/files/$RESULTS_FILE_ID/content \
  -H "Authorization: Bearer $OPENAI_API_KEY" > results.csv
```

_results.csv文件包含每个训练步骤的一行，其中一步指的是对数据批次进行前向和后向传递。除了步数之外，每行还包含以下与该步骤相应的字段：

elapsed_tokens：模型到目前为止已经看到的标记数量（包括重复）

elapsed_examples：模型到目前为止已经看到的示例数量（包括重复），其中一个示例是批处理中的一个元素。例如，如果batch_size = 4，则每个步骤将使elapsed_examples增加4。

training_loss：训练批次上的损失

training_sequence_accuracy：在训练批次中完成百分比，在这些完成中，模型预测出来的标记完全匹配真实完成标记。例如，使用batch_size为3时，如果您的数据包含[[1,2]、[0,5]、[4,2]]这些完成，并且模型预测[[1,1]、[0,5]、[4,2]]这些结果，则准确率将是2/3=0.67

training_token_accuracy: 模型正确预测出训练批次中令牌百分比。例如，在batch_size为3时，如果您的数据包含[[1, 2], [0, 5], [4 , 2]] 这些完成，并且模型预测 [[1 , 1], [0 , 5], [4 , 2]] 这些结果，则准确率将是5/6=0.83

### 分类特定指标

我们还提供了在结果文件中生成额外的分类特定指标的选项，例如准确度和加权F1分数。这些指标会定期针对完整验证集进行计算，并在微调结束时计算。您将在结果文件中看到它们作为附加列。

要启用此功能，请设置参数--compute_classification_metrics。另外，您必须提供一个验证文件，并设置classification_n_classes参数（多类分类）或classification_positive_class参数（二元分类）。

OpenAI CLI:

```
# For multiclass classification
openai api fine_tunes.create \
  -t <TRAIN_FILE_ID_OR_PATH> \
  -v <VALIDATION_FILE_OR_PATH> \
  -m <MODEL> \
  --compute_classification_metrics \
  --classification_n_classes <N_CLASSES>

# For binary classification
openai api fine_tunes.create \
  -t <TRAIN_FILE_ID_OR_PATH> \
  -v <VALIDATION_FILE_OR_PATH> \
  -m <MODEL> \
  --compute_classification_metrics \
  --classification_n_classes 2 \
  --classification_positive_class <POSITIVE_CLASS_FROM_DATASET>
```

如果您设置了 --compute_classification_metrics，以下指标将显示在结果文件中：

对于多类分类

分类/准确率: 准确率

分类/加权F1分数: 加权F-1分数

对于二元分类

以下指标基于0.5的分类阈值（即当概率> 0.5时，将示例归类为正类）。

分类/准确率

分类/精度

分类/召回率

分类/f{beta}

分类/auroc - AUROC曲线下面积

classification/auprc - AUPRC曲线下面积

请注意，这些评估假定您使用文本标签来表示令牌化为单个标记的类别，如上所述。如果不满足这些条件，则您得到的数字可能是错误的。

### 验证

您可以保留一些数据进行验证。验证文件与训练文件具有完全相同的格式，并且您的训练和验证数据应该互斥。

如果在创建微调作业时包括一个验证文件，则生成的结果文件将包括对模型在训练期间定期针对您的验证数据表现如何进行评估。

OpenAI CLI:

```
openai api fine_tunes.create -t <TRAIN_FILE_ID_OR_PATH> \
  -v <VALIDATION_FILE_ID_OR_PATH> \
  -m <MODEL>
```

如果您提供了验证文件，我们会在训练期间定期计算验证数据批次的指标。您将在结果文件中看到以下额外的指标：

validation_loss：验证批次上的损失

validation_sequence_accuracy：模型预测令牌与真实完成令牌完全匹配的验证批次中完成百分比。例如，如果您的数据包含完成[[1,2]，[0,5]，[4,2]]并且模型预测[[1,1]，[0,5]，[4,2]] ，则准确率为 2/3 = 0.67。

validation_token_accuracy：模型正确预测出来的验证批次中令牌百分比。例如，如果您的数据包含完成[[1,2]，[0,5]，[4,2]]并且模型预测[[1,1]，[0 ,5 ] ， [4、2 ]] ，则准确率为 5/6 = 0.83 。

### 超参数

我们选择了适用于各种用例的默认超参数。唯一必需的参数是训练文件。

话虽如此，调整用于微调的超参数通常可以导致产生更高质量输出的模型。特别是，您可能想要配置以下内容：

模型：要微调的基础模型名称。您可以选择其中之一：“ada”、“babbage”、“curie”或“davinci”。有关这些模型的更多信息，请参阅Models文档。

n_epochs-默认为4。训练模型的时期数。一个时期是指完整地通过训练数据集进行一次循环。

batch_size-默认为训练集中示例数量的约0.2％，上限为256个。批量大小是用于训练单个前向和后向传递的训练示例数量。通常，我们发现较大的批量大小 tend to work better for larger datasets.

learning_rate_multiplier-默认值为0.05、0.1或0.2，具体取决于最终batch_size。微调学习率是用于预先培训原始学习率乘以此倍增器得到的结果。我们建议尝试在范围内使用值 0.02 到 0.2 来查看哪种方法产生最佳结果。根据经验，我们发现较大的学习速度通常与较大 的 batch size 配合使用效果更好。

compute_classification_metrics - 默认值为False 。如果设置为True，则对分类任务进行微调，在每个 epoch 结束时计算验证集上特定于分类任务（准确性、F-1 分数等） 的度量标准。

要配置这些额外超参数，请通过OpenAI CLI的命令行标志传递它们，例如：

```
openai api fine_tunes.create \
  -t file-JD89ePi5KMsB3Tayeli5ovfW \
  -m ada \
  --n_epochs 1
```

### 从已经微调的模型继续微调

如果您已经为任务微调了一个模型，并且现在有额外的训练数据需要加入，您可以从该模型中继续进行微调。这将创建一个从所有训练数据中学习而不必重新从头开始训练的模型。

要做到这一点，在创建新的微调作业时传递已经微调好的模型名称（例如 -m curie:ft-<org>-<date>）。其他培训参数不必更改，但是如果您的新培训数据比以前的培训数据小得多，则可能会发现将 learning_rate_multiplier 减少2至4倍很有用。

# 权重与偏差

您可以将微调同步到权重和偏差中，以跟踪实验、模型和数据集。

要开始使用，您需要一个权重和偏差帐户和一个付费的OpenAI计划。为确保您正在使用openai和wandb的最新版本，请运行：

>pip install --upgrade openai wandb

要将您的微调与Weights＆Biases同步，请运行：

>openai wandb sync

您可以阅读 Weights & Biases 的文档以获取有关此集成的更多信息。

# 示例笔记本

分类

finetuning-classification.ipynb

本笔记本将演示如何微调模型，以分类输入文本是否与棒球或曲棍球相关。我们将在笔记本中执行以下四个步骤：

数据探索将概述数据源和示例的外观

数据准备将把我们的数据源转换为可用于微调的jsonl文件。

微调将启动微调作业并解释所得到的模型性能。

使用该模型将演示如何向经过微调的模型发出请求以获取预测结果。

Collapse

问题回答

olympics-1-collect-data.ipynb

olympics-2-create-qa.ipynb

olympics-3-train-qa.ipynb

这个项目的想法是创建一个基于几段提供的文本的问答模型。基于GPT-3模型，当答案包含在段落中时，它们能够很好地回答问题，但是如果答案不包含在内，则基础模型通常会尽力回答，并且经常导致混淆的答案。

为了创建一个只有在有足够上下文情况下才能回答问题的模型，我们首先创建了一个基于文本段落的问题和答案数据集。为了训练该模型仅在存在正确上下文时才作出回应，我们还添加了对抗性示例，在这些情况下，问题与上下文不匹配。对于这些情况，我们要求该模型输出“无足够上下文来回答问题”。

我们将在三个笔记本上执行此任务：

第一个笔记本专注于收集最近的数据，这些数据是GPT-3在预训练期间没有看到的。我们选择了2020年奥运会（实际上是在2021年夏季举行），并下载了713个独特页面。我们通过单独的部分组织了数据集，这些部分将作为提问和回答的背景。

第二个笔记本将利用Davinci-instruct根据维基百科章节提出一些问题，并根据该章节回答这些问题。

第三个笔记本将利用上下文、问题和答案对的数据集，另外创建对抗性问题和上下文对，在这种情况下，模型将被提示回答“无足够的上下文来回答问题”。我们还将训练一个鉴别器模型，该模型预测是否可以基于上下文来回答问题。


