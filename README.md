# cocos-creator-utils
cocos-creator 相关方法、模块。
基于 **2.0.10** 版本

---

## [FntLabel.js](https://github.com/MuZiLaoYou/cocos-creator-utils/blob/master/FntLabel.js)
>使用TexturePacker等软件生成的fnt图集，来创建Label，有缓存。

## [TableView.js](https://github.com/MuZiLaoYou/cocos-creator-utils/blob/master/TableView.js)
>基于cc.ScrollView扩展的TableView，带scrollbar。目前只支持竖直方向的滑动，暂不支持动态删减，感兴趣的可自行实现。如果在代码中使用应注意如下：

``` javascript
let tbv = new TableView();
tbv.parent = this; //这行代码必须在下行代码之前，否则报错，因为cc.Mask的影响。
tbv.initTableView(400, 360, 80, 20, function(cell, idx){});
```
