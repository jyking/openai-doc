# 图像生成测试版

学习如何使用我们的DALL·E模型生成或操作图像

## 介绍

Images API提供了三种与图像交互的方法：

根据文本提示从头开始创建图像

基于新的文本提示创建现有图像的编辑版本

创建现有图像的变体

该指南涵盖了使用这三个API端点的基础知识，并提供有用的代码示例。要查看它们的实际应用，请查看我们的DALL·E预览应用程序。

```
Images API 处于测试阶段。在此期间，API 和模型将根据您的反馈不断发展。为确保所有用户都能舒适地进行原型设计， 默认速率限制为每分钟 50 张图片。如果您想增加速率限制，请查看此帮助中心文章。随着我们了解更多关于使用和容量需求的信息，我们将增加默认速率限制。
```

## 用法

### 生成

图像生成端点允许您根据文本提示创建原始图像。生成的图像可以具有256x256、512x512或1024x1024像素的大小。较小的尺寸生成速度更快。您可以使用n参数一次请求1-10张图片。

```
response = openai.Image.create(
  prompt="a white siamese cat",
  n=1,
  size="1024x1024"
)
image_url = response['data'][0]['url']
```

描述越详细，您或最终用户想要的结果就越可能得到。您可以在DALL·E预览应用程序中探索示例以获得更多启发灵感。以下是一个快速示例：

提示          生成

一只白色暹罗猫

一张特写的、工作室拍摄的白色暹罗猫肖像，看起来很好奇，耳朵背光。

每个图像都可以使用response_format参数作为URL或Base64数据返回。 URL将在一小时后过期。

### 编辑

图像编辑端点允许您通过上传掩码来编辑和扩展图像。掩码的透明区域指示应该在哪里编辑图像，提示应描述完整的新图像，而不仅仅是擦除区域。此端点可以启用类似于我们DALL·E预览应用程序中的编辑器的体验。

```
response = openai.Image.create_edit(
  image=open("sunlit_lounge.png", "rb"),
  mask=open("mask.png", "rb"),
  prompt="A sunlit indoor lounge area with a pool containing a flamingo",
  n=1,
  size="1024x1024"
)
image_url = response['data'][0]['url']
```

图像      掩膜     输出


提示：一个阳光明媚的室内休息区，里面有一个装着火烈鸟的游泳池。

上传的图像和掩模必须都是小于4MB大小的正方形PNG图像，并且它们必须具有相同的尺寸。生成输出时不使用掩模中透明部分，因此它们不一定需要像上面的示例那样与原始图像匹配。

### 变体

图像变体端点允许您生成给定图像的变体。

```
response = openai.Image.create_variation(
  image=open("corgi_and_cat_paw.png", "rb"),
  n=1,
  size="1024x1024"
)
image_url = response['data'][0]['url']
```

图像       输出

与编辑端点类似，输入图像必须是小于4MB的正方形PNG图像。

## 内容审核

基于我们的内容政策过滤提示和图片，当提示或图片被标记时返回错误。如果您对误报或相关问题有任何反馈，请联系我们。

NODE.JS

### 使用内存中的图像数据

上面指南中的Node.js示例使用fs模块从磁盘读取图像数据。在某些情况下，您可能已经将图像数据存储在内存中。以下是一个示例API调用，它使用存储在Node.js缓冲区对象中的图像数据：

```
// This is the Buffer object that contains your image data
const buffer = [your image data];
// Set a `name` that ends with .png so that the API knows it's a PNG image
buffer.name = "image.png";
const response = await openai.createImageVariation(
  buffer,
  1,
  "1024x1024"
);
```

### 使用TypeScript

如果您正在使用TypeScript，可能会遇到一些与图像文件参数有关的怪异问题。以下是通过显式转换参数来解决类型不匹配的示例：

这里有一个类似的例子，用于内存中的图像数据：

```
// This is the Buffer object that contains your image data
const buffer: Buffer = [your image data];
// Cast the buffer to `any` so that we can set the `name` property
const file: any = buffer;
// Set a `name` that ends with .png so that the API knows it's a PNG image
file.name = "image.png";
const response = await openai.createImageVariation(
  file,
  1,
  "1024x1024"
);
``` 

### 错误处理

API请求可能由于无效输入、速率限制或其他问题而返回错误。这些错误可以使用try...catch语句进行处理，错误详细信息可以在error.response或error.message中找到：

```
try {
  const response = await openai.createImageVariation(
    fs.createReadStream("image.png"),
    1,
    "1024x1024"
  );
  console.log(response.data.data[0].url);
} catch (error) {
  if (error.response) {
    console.log(error.response.status);
    console.log(error.response.data);
  } else {
    console.log(error.message);
  }
}
```

PYTHON

使用内存中的图像数据

上面指南中的Python示例使用open函数从磁盘读取图像数据。在某些情况下，您可能已经将图像数据存储在内存中。以下是一个使用BytesIO对象中存储的图像数据的API调用示例：

```
from io import BytesIO

# This is the BytesIO object that contains your image data
byte_stream: BytesIO = [your image data]
byte_array = byte_stream.getvalue()
response = openai.Image.create_variation(
  image=byte_array,
  n=1,
  size="1024x1024"
)
```

### 在图像数据上操作

在将图像传递给API之前，对图像执行操作可能很有用。以下是使用PIL调整图像大小的示例：

```
from io import BytesIO
from PIL import Image

# Read the image file from disk and resize it
image = Image.open("image.png")
width, height = 256, 256
image = image.resize((width, height))

# Convert the image to a BytesIO object
byte_stream = BytesIO()
image.save(byte_stream, format='PNG')
byte_array = byte_stream.getvalue()

response = openai.Image.create_variation(
  image=byte_array,
  n=1,
  size="1024x1024"
)
```

### 错误处理

API请求可能由于无效输入、速率限制或其他问题而返回错误。这些错误可以使用try...except语句进行处理，错误详细信息可以在e.error中找到：

```
try:
  openai.Image.create_variation(
    open("image.png", "rb"),
    n=1,
    size="1024x1024"
  )
  print(response['data'][0]['url'])
except openai.error.OpenAIError as e:
  print(e.http_status)
  print(e.error)
  ```

  