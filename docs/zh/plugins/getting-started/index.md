# 入门指南

### 创建插件需要三个步骤：

1. 构建 API
2. 使用 OpenAPI yaml 或 JSON 格式记录 API 文档
3. 创建一个 JSON 清单文件，定义插件的相关元数据。

 本节的重点是通过定义 OpenAPI 规范和清单文件来创建待办事项列表插件

浏览示例插件

浏览覆盖多种用例和身份验证方法的示例插件。

每个插件都需要一个 `ai-plugin.json `文件，该文件需要托管在 API 的域名上。例如，一个名为 `example.com `的公司将使插件 JSON 文件通过 https://example.com 域名访问，因为这是他们的 API 所托管的地方。当您通过 ChatGPT UI 安装插件时，在后端我们会查找位于` /.well-known/ai-plugin.json `的文件。`/.well-known` 文件夹是必需的，并且必须存在于您的域中，以便 ChatGPT 与您的插件连接。如果没有找到文件，则无法安装插件。对于本地开发，可以使用 HTTP，但如果指向远程服务器，则需要使用 HTTPS。

所需 `ai-plugin.json `文件的最小定义如下：

```
{
  "schema_version": "v1",
  "name_for_human": "TODO Plugin",
  "name_for_model": "todo",
  "description_for_human": "Plugin for managing a TODO list. You can add, remove and view your TODOs.",
  "description_for_model": "Plugin for managing a TODO list. You can add, remove and view your TODOs.",
  "auth": {
    "type": "none"
  },
  "api": {
    "type": "openapi",
    "url": "http://localhost:3333/openapi.yaml",
    "is_user_authenticated": false
  },
  "logo_url": "http://localhost:3333/logo.png",
  "contact_email": "support@example.com",
  "legal_info_url": "http://www.example.com/legal"
}
```

如果您想查看插件文件的所有可能选项，可以参考下面的定义。

领域	|  类型	|  描述/选项
--| --|--
schema_version   |	String	|  清单模式版本
name_for_model   |	String	|  用于定位插件的模型名称
name_for_human   | 	String	| 人类可读的名称，例如完整公司名称
description_for_model |	String |	更适合模型的描述，例如令牌上下文长度考虑或关键字使用以改进插件提示。
description_for_human |	String |	插件的人类可读描述
auth | ManifestAuth | 认证架构 
api |	Object API | 规范 
logo_url |  String |  用于获取插件徽标的 URL 
contact_email  | String|  安全/调节、支持和停用联系电子邮件 
legal_info_url | String | 用户查看插件信息的重定向 URL 
HttpAuthorizationType |	HttpAuthorizationType |"bearer" 或 "basic"
ManifestAuthType | ManifestAuthType | "none"、"user_http"、"service_http" 或 "oauth"
interface BaseManifestAuth |	BaseManifestAuth	| type: ManifestAuthType; instructions: string;
ManifestNoAuth | ManifestNoAuth | 不需要身份验证：BaseManifestAuth 和 {type:'none',}
ManifestServiceHttpAuth,| ManifestUserHttpAut, and ManifestOAuthAutn |需要身份验证：BaseManifetstAuh & {type:'service_http'/'user_http'/'oauth'}
ManifestAuth	|ManifestAuth	|ManifestNoAuth, ManifestServiceHttpAuth, ManifestUserHttpAuth, ManifestOAuthAuth

以下是使用不同身份验证方法的示例：

```
# App-level API keys
type ManifestServiceHttpAuth  = BaseManifestAuth & {
  type: 'service_http';
  authorization_type: HttpAuthorizationType;
  verification_tokens: {
    [service: string]?: string;
  };
}

# User-level HTTP authentication
type ManifestUserHttpAuth  = BaseManifestAuth & {
  type: 'user_http';
  authorization_type: HttpAuthorizationType;
}

type ManifestOAuthAuth  = BaseManifestAuth & {
  type: 'oauth';

  # OAuth URL where a user is directed to for the OAuth authentication flow to begin.
  client_url: string;

  # OAuth scopes required to accomplish operations on the user's behalf.
  scope: string;

  # Endpoint used to exchange OAuth code with access token.
  authorization_url: string;

  # When exchanging OAuth code with access token, the expected header 'content-type'. For example: 'content-type: application/json'
  authorization_content_type: string;

  # When registering the OAuth client ID and secrets, the plugin service will surface a unique token. 
  verification_tokens: {
    [service: string]?: string;
  };
}
```

还有一些限制，即清单文件中某些字段的长度可能随时间而变化：

最多50个字符`name_for_human`
最多50个字符`name_for_model`
最多120个字符`description_for_human`
最多8000个字符仅限于`description_for_model`（会随着时间的推移而减少）

另外，我们的API响应体长度也有一个10万字符的限制（随时间减少），这个限制也可能会发生变化。

另外，我们还有一个API响应正文长度的100k字符限制（将随时间减少），这也可能会发生变化。

## OpenAPI定义

下一步是构建OpenAPI规范以记录API。ChatGPT中的模型除了在OpenAPI规范和清单文件中定义的内容外，不知道您的API的任何信息。这意味着如果您有一个广泛的API，则无需将所有功能暴露给模型，并且可以选择特定的端点。例如，如果您有一个社交媒体API，则可能希望通过GET请求使模型访问站点上的内容，但防止模型能够评论用户发布以减少垃圾邮件机会。

OpenAPI规范是包装在您的API之上的封套。基本OpenAPI规范如下所示：

```
openapi: 3.0.1
info:
  title: TODO Plugin
  description: A plugin that allows the user to create and manage a TODO list using ChatGPT.
  version: 'v1'
servers:
  - url: http://localhost:3333
paths:
  /todos:
    get:
      operationId: getTodos
      summary: Get the list of todos
      responses:
        "200":
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/getTodosResponse'
components:
  schemas:
    getTodosResponse:
      type: object
      properties:
        todos:
          type: array
          items:
            type: string
          description: The list of todos.
```

我们首先定义规范版本、标题、描述和版本号。当在ChatGPT中运行查询时，它将查看信息部分中定义的描述，以确定插件是否与用户查询相关。您可以在编写描述部分了解更多有关提示的内容。

请记住以下限制，这些限制可能会发生变化：

- API规范中每个API端点描述/摘要字段最多200个字符
- API规范中每个API参数描述字段最多200个字符

由于我们正在本地运行此示例，因此我们希望将服务器设置为指向您的本地主机URL。其余的OpenAPI规范遵循传统的OpenAPI格式，您可以通过各种在线资源了解有关OpenAPI格式的更多信息。还有许多工具可以根据您底层的API代码自动生成OpenAPI规范。

## 运行插件

一旦您已经为API、清单文件和OpenAPI规范创建了一个，现在就可以通过ChatGPT UI连接插件。您的插件可能运行在两个不同的地方，即本地开发环境或远程服务器上。

如果您有一个正在运行的API本地版本，则可以将插件界面指向本地主机服务器。要将插件与ChatGPT连接，请导航到插件商店并选择“开发自己的插件”。输入您的localhost和端口号（例如`localhost:3333`）。请注意，目前仅支持auth类型`none`用于本地主机开发。

如果插件正在远程服务器上运行，则需要首先选择“开发自己的插件”进行设置，然后选择“安装未经验证的插件”以便为自己安装它。您可以将插件清单文件简单地添加到`yourdomain.com/.well-known/`路径中，并开始测试API。但是，对于清单文件的后续更改，您必须部署新更改到公共站点，这可能需要很长时间。在这种情况下，我们建议设置本地服务器作为API代理。这样可以快速原型化OpenAPI规范和清单文件的更改。

### 设置本地代理公共API

以下Python代码是如何设置您的公共API简单代理的示例。

```
import requests
import os

import yaml
from flask import Flask, jsonify, Response, request, send_from_directory
from flask_cors import CORS

app = Flask(__name__)

PORT = 3333

# Note: Setting CORS to allow chat.openapi.com is required for ChatGPT to access your plugin
CORS(app, origins=[f"http://localhost:{PORT}", "https://chat.openai.com"])

api_url = 'https://example.com'


@app.route('/.well-known/ai-plugin.json')
def serve_manifest():
    return send_from_directory(os.path.dirname(__file__), 'ai-plugin.json')


@app.route('/openapi.yaml')
def serve_openapi_yaml():
    with open(os.path.join(os.path.dirname(__file__), 'openapi.yaml'), 'r') as f:
        yaml_data = f.read()
    yaml_data = yaml.load(yaml_data, Loader=yaml.FullLoader)
    return jsonify(yaml_data)


@app.route('/openapi.json')
def serve_openapi_json():
    return send_from_directory(os.path.dirname(__file__), 'openapi.json')


@app.route('/<path:path>', methods=['GET', 'POST'])
def wrapper(path):

    headers = {
    'Content-Type': 'application/json',
    }

    url = f'{api_url}/{path}'
    print(f'Forwarding call: {request.method} {path} -> {url}')

    if request.method == 'GET':
        response = requests.get(url, headers=headers, params=request.args)
    elif request.method == 'POST':
        print(request.headers)
        response = requests.post(url, headers=headers, params=request.args, json=request.json)
    else:
        raise NotImplementedError(f'Method {request.method} not implemented in wrapper for {path=}')
    return response.content


if __name__ == '__main__':
    app.run(port=PORT)
```

## 写作描述

当用户进行可能会发送到插件的潜在请求的查询时，模型将查看OpenAPI规范中端点的描述以及清单文件中的`description_for_model`。就像提示其他语言模型一样，您需要尝试多个提示和描述来确定哪个效果最佳。

OpenAPI规范本身是一个很好的地方，可以为模型提供有关API的各种详细信息 - 可用的功能、参数等。除了为每个字段使用富有表现力和信息丰富的名称之外，规范还可以包含每个属性的“描述”字段。例如，这些描述可以用于提供函数执行什么操作或查询字段期望哪些信息等自然语言描述。模型将能够看到这些内容，并指导其使用API。如果某个字段仅限于特定值，则还可以提供具有描述性类别名称的“枚举”。

`description_for_model`属性为您提供了自由，可以指示模型通常如何使用您的插件。总体而言，ChatGPT背后的语言模型非常擅长理解自然语言并遵循指令。因此，这是一个好地方来放置关于您的插件做什么以及模型应该如何正确使用它的一般说明。请使用自然语言，最好用简洁但描述性和客观的语气。您可以查看一些示例以了解其外观应该是怎样的。我们建议从“Plugin for…”开始编写`description_for_model`，并列举API提供的所有功能。

### 最佳实践

以下是编写您的`description_for_model`和OpenAPI规范中的描述以及设计API响应时要遵循的最佳实践：

1. 您的描述不应试图控制ChatGPT的情绪、个性或确切反应。 ChatGPT旨在编写适当的插件响应。

不好的例子：

>当用户要求查看待办事项清单时，总是回复“我能找到你的待办事项清单！ 你有[x]个待办事项：[在此列出待办事项]。 如果您愿意，我可以添加更多待办事项！

好的例子：

>[这不需要任何说明]

2. 您的描述不应该鼓励ChatGPT在用户没有要求您插件的特定服务类别时使用插件。

不好的例子：

>每当用户提到任何类型的任务或计划时，请问他们是否想使用TODOs插件将某些内容添加到待办事项列表中。

好的例子：

>TODO清单可以添加、删除和查看用户的待办事项。

3. 您的描述不应指定 ChatGPT 使用插件的特定触发器。ChatGPT 设计为在适当时自动使用您的插件。

不好的例子：

>当用户提到任务时，回复“您是否希望我将其添加到您的待办事项列表中？说 '是' 继续。”

好的例子：

>[此处无需说明]

4. 插件API响应应该返回原始数据，而不是自然语言响应，除非必要。 ChatGPT将使用返回的数据提供自己的自然语言响应。

不好的例子：

>我能找到你的待办事项清单！ 你有2个待办事项：买菜和遛狗。 如果您愿意，我可以添加更多待办事项！

好的例子：

>{“todos”：[“买菜”，“遛狗”]}

## 调试

默认情况下，聊天不会显示插件调用和其他未向用户展示的信息。为了更全面地了解模型如何与您的插件交互，您可以在与插件交互后单击插件名称旁边的向下箭头以查看请求和响应。

对于插件的模型调用通常包括来自模型的消息，其中包含类似JSON格式的参数发送到插件中，然后是来自插件的响应，并最终是使用由该插件返回信息的模型消息。







