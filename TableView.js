//  https://github.com/MuZiLaoYou/cocos-creator-utils


cc.Class({
    name : "TableView",
    extends: cc.Node,

    properties: {
        
    },

    /**
     * 
     * @param {Number} viewW 
     * @param {Number} viewH 
     * @param {Number} cellH 
     * @param {Number} cellNum 
     * @param {Function} updateCell 
     */
    initTableView : function(viewW, viewH, cellH, cellNum, updateCell) {
        let T = this;

        T.setContentSize(viewW, viewH);
        let scv = T.addComponent(cc.ScrollView);
        T.scv = scv;
        T.updateCell = updateCell;

        let visualView = new cc.Node();
        visualView.parent = T;
        visualView.addComponent(cc.Mask).type = cc.Mask.Type.RECT; //Big Pit
        visualView.setContentSize(viewW, viewH);

        let cnt = new cc.Node();
        cnt.parent = visualView;
        cnt.setContentSize(viewW, cellH * cellNum);
        
        scv.content = cnt;
        scv.vertical = true;
        scv.horizontal = false;

        T.viewH = viewH;
        T.cellW = viewW;
        T.cellH = cellH;
        T.cellNum = cellNum;
        T.maxOffY = T.scv.getMaxScrollOffset().y;

        scv.node.on("scroll-began", T.onScrollBegan, T);
        scv.node.on("scrolling", T.onScrolling, T);

        T.cellPool = [];
        T._refreshData();
    },

    _refreshData : function() {
        let T = this;

        T.upHideNum = 0;
        let LEN = Math.min(Math.ceil(T.viewH / T.cellH), T.cellNum);
        T.downHideNum = T.cellNum - LEN;
        for (let i = 0; i < LEN; ++i) {
            let cell = T._getCell();
            cell.name = String(i);
            T.updateCell(cell, i);
            T._setCellPosWithIdx(cell, i);
        }
        T.scv.scrollToTop();
    },

    onScrollBegan : function(scv) {
        let T = this;
        T.preOffsetY = T.scv.getScrollOffset().y;
    },

    onScrolling : function(scv) {
        let T = this;

        let curOffsetY = T.scv.getScrollOffset().y;
        let isDown = (curOffsetY - T.preOffsetY > 0);

        if (curOffsetY < 0) {
            curOffsetY = 0;
        } else if (curOffsetY > T.maxOffY) {
            curOffsetY = T.maxOffY;
        }

        if (isDown) {
            let upHideNum = Math.floor(curOffsetY / T.cellH);
            if (upHideNum > T.upHideNum) {
                for (let i = T.upHideNum; i < upHideNum; ++i) {
                    let delCell = T.scv.content.getChildByName(String(i));
                    if (delCell) {
                        T._removeCell(delCell);
                    }
                }

                T.upHideNum = upHideNum;
            }

            let nextNum = Math.ceil((curOffsetY + T.viewH) / T.cellH);
            
            for (let i = T.cellNum - T.downHideNum; i < nextNum ; ++i) {
                let nextCell = T.scv.content.getChildByName(String(i));
                if (!nextCell) {
                    let newCell = T._getCell();
                    newCell.name = String(i);
                    T._setCellPosWithIdx(newCell, i);
                    T.updateCell(newCell, i);
                }
            }

            T.downHideNum = T.cellNum - nextNum;
        } else {
            let downHideNum = T.cellNum - Math.ceil((curOffsetY + T.viewH) / T.cellH);
            if (downHideNum > T.downHideNum) {
                for (let i = T.downHideNum; i < downHideNum; ++i) {
                    let delCell = T.scv.content.getChildByName(String(T.cellNum - i - 1));
                    if (delCell) {
                        T._removeCell(delCell);
                    }
                }
                T.downHideNum = downHideNum;
            }

            let nextNum = Math.floor(curOffsetY / T.cellH);
            for (let i = T.upHideNum - 1; i >= nextNum; --i) {
                let nextCell = T.scv.content.getChildByName(String(i));
                if (!nextCell) {
                    let newCell = T._getCell();
                    newCell.name = String(i);
                    T._setCellPosWithIdx(newCell, i);
                    T.updateCell(newCell, i);
                }
            }

            T.upHideNum = nextNum;
        }

        T.preOffsetY = curOffsetY;
    },

    _getCell : function() {
        let T = this;

        let cell = null;
        if (T.cellPool.length > 0) {
            cell = T.cellPool.pop();
        } else {
            cell = new cc.Node();
            let spr = cell.addComponent(cc.Sprite);
            spr.type = cc.Sprite.Type.SLICED;
        }
        cell.parent = T.scv.content;
        return cell;
    },

    _removeCell : function(cell) {
        let T = this;

        cell.removeFromParent(true);
        cell.removeAllChildren(true);
        T.cellPool.push(cell);
    },

    _setCellPosWithIdx : function(cell, idx) {
        let T = this;
        cell.y = T.scv.content.height / 2 - T.cellH / 2 * (idx * 2 + 1);
    },

    getScrollOffset : function() {
        return this.scv.getScrollOffset();
    },

    /**
     * 
     * @param {Boolean} elastic 
     */
    setElastic : function(elastic) {
        this.scv.elastic = elastic;
    },

    /**
     * 
     * @param {Number} brake 
     */
    setBrake : function(brake) {
        this.scv.brake = brake;
    },

    /**
     * 
     * @param {cc.SpriteFrame} barBgFrm 
     * @param {cc.SpriteFrame} barFrm 
     */
    addVerticalScrollBar : function(barBgFrm, barFrm) {
        let T = this;

        let vBarBg = new cc.Node();
        let bgSpr = vBarBg.addComponent(cc.Sprite);
        bgSpr.spriteFrame = barBgFrm;
        bgSpr.type = cc.Sprite.Type.SLICED;
        vBarBg.parent = T;
        vBarBg.opacity = 0;

        let barSlide = new cc.Node();
        let sldSpr = barSlide.addComponent(cc.Sprite);
        sldSpr.spriteFrame = barFrm;
        sldSpr.type = cc.Sprite.Type.SLICED;
        barSlide.parent = vBarBg;

        let bar = vBarBg.addComponent(cc.Scrollbar);
        bar.direction = cc.Scrollbar.Direction.VERTICAL;
        bar.autoHideTime = 0.5;
        bar.handle = sldSpr;

        T.scv.verticalScrollBar = bar;

        let wgt = vBarBg.addComponent(cc.Widget);
        wgt.alignMode = cc.Widget.AlignMode.ONCE;
        wgt.isAlignTop = true;
        wgt.isAlignBottom = true;
        wgt.isAlignRight = true;
        wgt.top = 0;
        wgt.bottom = 0;
        wgt.right = 0;
        T.wgt = wgt;
    },

    /**
     * 
     * @param {Number} offX 
     */
    setBarWgtX : function(offX) {
        this.wgt.right = offX;
    },
});
