# Python库

我们提供一个Python库，您可以按照以下步骤安装：

>$ pip install openai

安装完成后，您可以使用绑定和您的密钥来运行以下操作：

```
import os
import openai

# Load your API key from an environment variable or secret management service
openai.api_key = os.getenv("OPENAI_API_KEY")

response = openai.Completion.create(model="text-davinci-003", prompt="Say this is a test", temperature=0, max_tokens=7)
```
这些绑定还会安装一个命令行实用程序，您可以按以下方式使用：

>$ openai api completions.create -m text-davinci-003 -p "Say this is a test" -t 0 -M 7 --stream


## Node.js库


我们还有一个 Node.js 库，您可以通过在 Node.js 项目目录中运行以下命令来安装：

> $ npm install openai

安装完成后，您可以使用库和您的密钥来运行以下操作：



```
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const response = await openai.createCompletion({
  model: "text-davinci-003",
  prompt: "Say this is a test",
  temperature: 0,
  max_tokens: 7,
});
```



## 社区图书馆

以下的图书馆是由更广泛的开发者社区建立和维护的。如果您想在此处添加新库，请按照我们帮助中心文章中关于添加社区库的说明进行操作。

请注意，OpenAI不验证这些项目的正确性或安全性。

