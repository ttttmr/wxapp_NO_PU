# PU码生成器

微信小程序：PU码生成器

UI设计和JavaScript生成二维码参考

[wxapp-qrcode - 微信小程序--二维码生成器](https://github.com/demi520/wxapp-qrcode)

**2018.3 因可能存在的侵权问题，小程序已暂停服务**

## 功能

一键生成pu签到二维码

## 使用

可以把并没有什么大用的pu卸载了，直接用小程序

搜索“PU码生成器”，或扫描下图即可

![](./PU.jpg)

## 原理

> 2018.4 pu二维码规则已改，下面的无效了，进一步分析可能需要逆向一下

将pu二维码解析一下，例如

`xyhui://user/1234567/1511336448`

结构非常简单，伪协议 + 目录 + puid + Unix时间戳

然而这个puid在pu的二维码下方写了，这样就非常简单了

python3示例代码

```python
import qrcode,time
url='xyhui://user/'
puid=input('puid:')
t=str(int(time.time()))
img = qrcode.make(url+str(puid)+'/'+t)
img.save("pu.png")
```