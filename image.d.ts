/**
 * Bitmap 图像简单说来是由像素点构成的一个数组，每个像素代表图像中的一个点。
 * 接口声明: {"name": "blueos.media.image"}
 */
declare module '@blueos.media.image' {
   
  const BitmapSource:{
    create:(obj:{uri:string,options?:{density?:number,width?:number,height?:number,pixelFormat?:any}})=>{
      getImageInfo:(obj:{
        /**
       * @desc 图像源格式中包含多张图片，可以通过索引指定具体图片
       */
        index?:number,
       /**
       * @desc 成功回调
       * @param {size} 内容入参 {number}
       */
      success?: (ImageInfo:{
         /**
       * @desc 图像宽度
       */
        width:number,
         /**
       * @desc 图像高度
       */
        height:number,
         /**
       * @desc 每行中的总字节数
       */
        bytesPerRow:number,
         /**
       * @desc 每个像素占据的位数
       */
        bitsPerPixel:number,
         /**
       * @desc 图像占据的总字节数
       */
        totalBytes:number,
         /**
       * @desc 位图的像素格式,例如BGRA_8888
       */
        pixelFormat:any,
         /**
       * @desc 采样像素占据的位数
       */
        depth:number,
         /**
       * @desc Alpha通道信息
       */
        alphaInfo:any,
         /**
       * @desc 图像源中包含图像的数量
       */
        imageCount:number,
         /**
       * @desc 返回图像的 MIME 类型
       */
        mimeType:any
      }) => void
      /**
       * @desc 失败回调
       * @param {data} 失败回调的返回值 {any}
       * @param {code} 失败回调的返回状态码 {number}
       */
      fail?: (data: any, code: number) => void
    })=>void

    createBitmap:(obj:{
       /**
       * @desc 图片序号
       */
       index?:number,
       
       /**
       * @desc 解码成Bitmap的配置项
       */
       options?:{
         /**
       * @desc 如果设置为大于1的值，请求解码器对原始图像进行子采样，返回一个较小的图像以节省内存。
       */
        sampleSize:number,
         /**
       * @desc 期望输出宽度
       */
        width:number,
         /**
       * @desc 期望输出高度
       */
        height:number,
        /**
       * @desc 期望解码的区域
       */
        region:{
            /**
       * @desc 横坐标
       */
          x:number,
            /**
       * @desc 纵坐标
       */
          y:number,
            /**
       * @desc 宽度
       */
          width:number,
            /**
       * @desc 高度
       */
          height:number
        }
       }
       /**
       * @desc 成功回调
       * @param {size} 内容入参 {number}
       */
      success?: (Bitmap:any) => void
      /**
       * @desc 失败回调
       * @param {data} 失败回调的返回值 {any}
       * @param {code} 失败回调的返回状态码 {number}
       */
      fail?: (data: any, code: number) => void

    })=>void

   },
   
  }
}