---
title: 多磨提-WALN-Bitmap
description: 蓝河应用 Bitmap
tag: 功能接口
---

# Bitmap
Bitmap 图像简单说来是由像素点构成的一个数组，每个像素代表图像中的一个点。

开发者可以通过该接口读取写入像素数据，获取图像属性和像素格式，还可以对图像进行缩放、旋转、裁剪等处理。
## 接口声明

```json
{ "name": "blueos.media.image" }
```

## 导入模块

```ts
import image from '@blueos.media.image'
```

## 接口定义

### image.BitmapSource.create(OBJECT):BitmapSource
通过传入的文件uri，将图片解码成BitmapSource对象

#### 参数
|参数名|类型|必填|说明|
|---|---|---|---|
|uri|string|是|图片路径，当前仅支持应用沙箱路径。<br><br>支持格式有：.jpg .png .gif .bmp .webp|
|options|BitmapSourceOptions|否|图片属性，包括图片序号与默认属性值。|

#### 返回值
|类型|说明|
|---|---|
|BitmapSource|返回 BitmapSource 类实例，失败时返回undefined。|

  
#### 示例代码
```ts
import image from "@blueos.media.image"
 
const bitmapSourceInstance = image.BitmapSource.create({
    uri: "xxxx",
    options: {
        width: 4,
        height: 5,
        pixelFormat: image.PixelFormat.BRAG_8888
    }
})
```
  

### image.BitmapSource.create(OBJECT):BitmapSource
通过传入的数据缓冲区，将图片解码成BitmapSource对象

#### 参数

|参数名|类型|必填|说明|
|---|---|---|---|
|buf|ArrayBuffer|是|图像缓冲区数组。|
|options|BitmapSourceOptions|否|图片属性，包括图片序号与默认属性值。|

#### 返回值

|类型|说明|
|---|---|
|BitmapSource|返回BitmapSource类实例，失败时返回undefined。|


#### BitmapSourceOptions

 BitmapSource的初始化选项。

|名称|类型|必填|说明|
|---|---|---|---|
|density|number|否|图像源的像素密度，用于 Bitmap 用作默认像素密度。|
|width|number|否|图像源的宽度|
|height|number|否|图像源的高度|
|pixelFormat|PixelFormat|否|图像源的像素格式|


### bitmapSourceInstance.getImageInfo(OBJECT)

#### 参数

|参数名|类型|必填|说明|
|---|---|---|---|
|index|number|否|图像源格式中包含多张图片，可以通过索引指定具体图片|
|success|Function|否|成功回调，返回ImageInfo|
|fail|Function|否|失败回调|

  

#### ImageInfo

图片相关信息对象。

|名称|类型|说明|
|---|---|---|
|width|number|图像宽度|
|height|number|图像高度|
|bytesPerRow|number|每行中的总字节数|
|bitsPerPixel|number|每个像素占据的位数|
|totalBytes|number|图像占据的总字节数|
|pixelFormat|PixelFormat|位图的像素格式,例如BGRA_8888|
|depth|number|采样像素占据的位数|
|alphaInfo|AlphaInfo|Alpha通道信息|
|imageCount|number|图像源中包含图像的数量|
|mimeType|MimeType \| null|返回图像的 MIME 类型。例如： Image/png，image/jpeg。 如果没有则返回null|

  
  

#### PixelFormat
位图的像素格式
|名称|值|描述|
|---|---|---|
|UNKNOWN|0|未知格式|
|ALPHA_8|1|每个像素只存储透明度信息， 以8位表示。|
|RGB_565|2|24位 RGB 格式，红色与蓝色通道使用5位表示，绿色通道使用6位表示|
|RGB_888|3|24位 RGB 格式，每个像素通道以8位表示|
|RGBA_8888|4|32位RGB格式，每个像素通道以8位表示|
|BGRA_8888|5|32位RGB格式，每个像素以8位表示|
|RGBA_1010102|6|32位RGB格式，红、绿、蓝通道都以10位表示，透明度通道使用2位表示|
|RGBA_F16|7|64位RGB格式，每个像素通道使用16位浮点数来表示|
|YV12|8|一种YUV 格式，Y分量存储为一个平面，而U和V分量分别存储在两个独立的平面中。U和V分量通常以1/4的采样率存储，即对于每四个Y像素，只存储一个U和一个V像素。|
|YUV_420_888|9|一种YUV 格式，Y分量以连续的方式存储在一个平面中，每个像素对应一个Y分量。U和V分量分别存储在两个独立的平面中，分别以1/4的采样率存储。|
|NV21|10|一种YUV 格式，以连续的方式存储Y分量的像素数据, UV分量以交替的方式存储在另一个平面中，即一个像素存储V分量，下一个像素存储U分量。|

  

### bitmapSourceInstance.createBitmap(OBJECT)

#### 参数

|名称|类型|必填|说明|
|---|---|---|---|
|index|number|否|图片序号|
|options|DecodeOptions|否|解码成Bitmap的配置项|
|success|Function|否|成功回调。返回 Bitmap|
|fail|Function|否|失败回调|

  

#### DecodeOptions

|名称|数据类型|说明|
|---|---|---|
|sampleSize|number|如果设置为大于1的值，请求解码器对原始图像进行子采样，返回一个较小的图像以节省内存。|
|width|number|期望输出宽度|
|height|number|期望输出高度|
|region|Region|期望解码的区域|
|isMutable|boolean|是否是可变位图，不可变位图不可对Bitmap对象进行编辑操作。|
|pixelFormat|PixelFormat|将位图试图解码到该格式|

  

### bitmapSourceInstance.release():void

释放图片源及相关资源




### image.Bitmap.create(OBJECT)
初始化Bitmap

#### 参数

|名称|类型|必填|默认值|说明|
|---|---|---|---|---|
|colors|ArrayBuffer|是|-|颜色数组|
|width|number|是|-|宽度|
|height|number|是|-|高度|
|bytesPerRow|number|是|-|每行占据的字节数量|
|isMutable|boolean|否|true|是否可变，不可变位图不可对Bitmap对象进行编辑操作|
|pixelFormat|PixelFormat|是|RGBA_8888|像素格式|
|alphaInfo|AlphaInfo|是||Alpha通道信息|
|success|Function|否||成功回调，返回 Bitmap|
|fail|Function|否|-|失败回调|

  

#### AlphaInfo

|名称|值|说明|
|---|---|---|
|UNKNOWN|0|未知格式|
|NONE|1|没有alpha通道。|
|ALPHA_ONLY|2|没有颜色数据，只有一个alpha通道。|
|PREMULTIPLIED|3|颜色分量已经乘以了这个alpha值。例如，预乘的ARGB格式|
|UN_PREMULTIPLIED|4|颜色分量没有乘以了这个alpha值。|

### bitmapInstance.getImageInfo():ImageInfo

获取图像相关信息

### bitmapInstance.pixels.readToBuffer(OBJECT)

读取整个bitmap 或者bitmap特定区域的像素数据，写入到目标buffer中

#### 参数

|名称|类型|必填|说明|
|---|---|---|---|
|targetBuffer|ArrayBuffer|是|将Bitmap的像素数据以 sRGB ColorSpace 中未预乘的 ARGB 值作为结果写入目标 ArrayBuffer 中。 目标buffer大小可以通过bitmapInstance.getImageInfo获取totalBytes。|
|area|Area|否|当没有定义area时，默认读取整个bitMap到目标buffer中；当定义了area参数时，则是读取特定区域像素到目标buffer|
|success|Function|否|成功回调|
|fail|Function|否|失败回调|

#### Area

|名称|类型|说明|
|---|---|---|
|region|Region|特定矩形区域空间|
|offset|number|偏移位置|
|stride|number|像素间的行间距，注意： stride >= region.width*4，也可以是负数。|

### bitmapInstance.pixels.writeWithBuffer(OBJECT)

将源buffer写入bitmap，覆盖整个bitmap或者bitmap特定区域的像素数据

#### 参数

|名称|类型|必填|说明|
|---|---|---|---|
|sourceBuffer|ArrayBuffer|是|用于覆盖的像素数据buffer|
|area|Area|否|当没有定义area时，默认写入覆盖整个bitMap的像素数据；当定义了area参数时，则是写入覆盖特定区域像素数据。|
|success|Function|否|成功回调|
|fail|Function|否|失败回调|


#### Region

|名称|类型|说明|
|---|---|---|
|x|number|横坐标|
|y|number|纵坐标|
|width|number|宽度|
|height|number|高度|

### bitmapInstance.crop(OBJECT)

裁剪

#### 参数

|名称|类型|必填|说明|
|---|---|---|---|
|region|Region|是|裁剪区域|
|success|Function|否|成功回调|
|fail|Function|否|失败回调|

### bitmapInstance.translate(OBJECT)

通过坐标对 bitmap 进行位置变换

#### 参数

|名称|类型|必填|说明|
|---|---|---|---|
|x|number|是|横坐标|
|y|number|是|纵坐标|
|success|Function|否|成功回调,|
|fail|Function|否|失败回调|

### bitmapInstance.scale(OBJECT)

缩放

#### 参数

|名称|类型|必填|说明|
|---|---|---|---|
|x|number|是|横轴缩放倍数|
|y|number|是|纵轴缩放倍数|
|originX|number|否|中心点横坐标|
|originY|number|否|中心点纵坐标|
|success|Function|否|成功回调,|
|fail|Function|否|失败回调|

### bitmapInstance.rotate(OBJECT)

裁剪

#### 参数

|名称|类型|必填|说明|
|---|---|---|---|
|angle|Region|number|旋转的角度，例如60.0 即为旋转 60°|
|originX|number|否|中心点横坐标|
|originY|number|否|中心点纵坐标|
|success|Function|否|成功回调|
|fail|Function|否|失败回调|

### bitmapInstance.release()

释放位图资源

  

### image.BitmapOutput.create(OBJECT):BitmapOutput

创建bitmap输出目标对象

#### 参数

|名称|类型|必填|说明|
|---|---|---|---|
|source|BitmapSource \| Bitmap|是|图像来源|

#### 返回值

BitmapOutput


### bitmapOutputInstance.compress(OBJECT)

图片压缩后异步返回Bitmap压缩后的 ArrayBuffer 数据

#### 参数

|参数名|类型|必填|说明|
|---|---|---|---|
|format|CompressFormat|是|对应的压缩格式|
|quality|number|是|图片压缩质量的参数，取值范围为1-100。|
|success|Function|否|成功回调， 返回压缩后的 ArrayBuffer|
|fail|Function|否|失败回调|

  

#### CompressFormat

|名称|值|说明|
|---|---|---|
|JPEG|0|jpeg 格式|
|PNG|1|png 格式|
|WEBP|2|webp 格式|

  

### bitmapOutputInstance.release()

释放图像输出相关资源