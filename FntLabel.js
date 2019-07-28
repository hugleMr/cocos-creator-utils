//  https://github.com/MuZiLaoYou/cocos-creator-utils

cc.Class({
    name : "FntLabel",
    extends: cc.Node,

    properties: {
        
    },

    /**
     * 
     * @param {String} numStr 
     * @param {cc.SpriteAtlas} numAtlas 
     */
    createLabel : function(numStr, numAtlas) {
        let T = this;
        
        T.numPool = [];
        T.numAtlas = numAtlas;
        T.maxSize = {w : 0, h : 0};
        T.pNode = new cc.Node();
        T.pNode.parent = T;
        T.setString(numStr);
    },

    /**
     * 
     * @param {String} numStr 
     */
    setString : function(numStr) {
        let T = this;

        T.numStr = numStr;
        for (let i = 0; i < T.numPool.length; ++i) {
            T.numPool[i].active = false;
        }

        let preX = 0;
        let div = 1;
        T.maxSize.h = 0;
        for (let i = 0; i < numStr.length; ++i) {
            let nd = T.numPool[i];
            if (nd) {
                nd.active = true;
            } else {
                nd = new cc.Node();
                nd.addComponent(cc.Sprite);
                nd.parent = T.pNode;
                T.numPool.push(nd);
            }
            nd.getComponent(cc.Sprite).spriteFrame = T.numAtlas.getSpriteFrame(numStr[i]);
            
            nd.x = preX + nd.width / 2 + (i == 0 ? 0 : div);
            preX = nd.x + nd.width / 2;
            T.maxSize.w = preX;
            T.maxSize.h = Math.max(T.maxSize.h, nd.height);
        }

        T._updatePos();
    },

    getString : function() {
        return this.numStr;
    },

    /**
     * 
     * @param {Number} anchorX 
     * @param {Number} anchorY 
     */
    setAnchorPoint : function(anchorX, anchorY) {
        let T = this;
        T.anchorX = anchorX;
        T.anchorY = anchorY;
        T._updatePos();
    },

    _updatePos : function() {
        let T = this;
        T.pNode.x = -T.anchorX * T.maxSize.w;
        T.pNode.y = (0.5 - T.anchorY) * T.maxSize.h;
    },
});
