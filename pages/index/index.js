// pages/main/index.js
var QR = require("../../utils/qrcode.js");
Page({
  data: {
    maskHidden: true,
    imagePath: '',
    placeholder: '如：1234567'
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var size = this.setCanvasSize();//动态设置画布大小
    const dateTime = Date.now();
    const timestamp = Math.floor(dateTime / 1000);
    var initUrl = "xyhui://user/" + this.data.placeholder + "/" + timestamp;
    this.createQrCode(initUrl, "mycanvas", size.w, size.h);
  },
  onLaunch: function () {
    // 小程序启动之后 触发
    var size = this.setCanvasSize();//动态设置画布大小
    const dateTime = Date.now();
    const timestamp = Math.floor(dateTime / 1000);
    var initUrl = "xyhui://user/" + this.data.placeholder + "/" + timestamp;
    this.createQrCode(initUrl, "mycanvas", size.w, size.h);
  },
  //适配不同屏幕大小的canvas
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 686;//不同屏幕下canvas的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      var height = width;//canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  createQrCode: function (url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    QR.qrApi.draw(url, canvasId, cavW, cavH);
    var that = this;
    //二维码生成之后调用canvasToTempImage();延迟3s，否则获取图片路径为空
    var st = setTimeout(function () {
      that.canvasToTempImage();
      clearTimeout(st);
    }, 3000);

  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        console.log(tempFilePath);
        that.setData({
          imagePath: tempFilePath,
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  formSubmit: function (e) {
    var that = this;
    var url = e.detail.value.url;
    const dateTime = Date.now();
    const timestamp = Math.floor(dateTime / 1000);
    url = url == '' ? ('xyhui://user/' + that.data.placeholder + '/' + timestamp) : ('xyhui://user/' + url + '/' + timestamp);
    that.setData({
      maskHidden: false,
    });
    wx.showToast({
      title: '生成中...',
      icon: 'loading',
      duration: 2000
    });
    var st = setTimeout(function () {
      wx.hideToast()
      var size = that.setCanvasSize();
      //绘制二维码
      that.createQrCode(url, "mycanvas", size.w, size.h);
      that.setData({
        maskHidden: true
      });
      clearTimeout(st);
    }, 2000)

  }

})