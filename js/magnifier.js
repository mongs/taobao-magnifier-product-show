/**
* project-name: 淘宝放大镜展示 模拟
* author: wally
* date: 2017-08-05
* email: 1006900636@qq.com
* qq: 1006900636
*/
;(function($w, $d) {
    /**
    * 封装常用选择器:
    * $cls      getElementsByClassName
    * $clsOne   getElementsByClassName(cls)[0]
    * $tag      getElementsByTagName
    * $id       getElementById(id)
    */
    var $cls = function(cls, parent) {
        parent = parent || $d;
        return parent.getElementsByClassName(cls)
    }
    var $clsOne = function(cls, parent) {
        parent = parent || $d;
        return parent.getElementsByClassName(cls)[0]
    }
    var $tag = function(tag, parent) {
        parent = parent || $d;
        return parent.getElementsByTagName(tag)
    }
    var $id = function(id) {
        return $d.getElementById(id);
    }
    /**
    * contentS  小图片容器 content-s
    * contentB  放大图片显示区域
    * contentM  中图片显示区域
    * imgS      小图片 集合
    * imgM      中图片
    * imgB      放大图片
    * magnifier 放大镜
    * modal     模块框  弹出层
    * carouselLeft  模态框 左侧轮播图容器
    * carouselRight 模态框 右侧小图片容器
    * carouselImg   模态框 小图片 集合
    * carouselArrowLeft     模态框 左箭头
    * carouselArrowRight    模态框 右箭头
    * contentMWidth         中图片容器的宽度
    */
    var contentS = $clsOne('content-s'),
        contentB = $clsOne('content-b'),
        contentM = $clsOne('content-m'),
        imgS = $tag('img', contentS),
        imgM = $id('img-m'),
        imgB = $id('img-b'),
        magnifier = $id('magnifier')
        modal = $clsOne('modal'),
        carouselLeft = $clsOne('carousel-left'),
        carouselRight = $clsOne('carousel-right'),
        carouselImg = $tag('img', carouselRight),
        carouselArrowLeft = $clsOne('arrow-left'),
        carouselArrowRight = $clsOne('arrow-right'),
        contentMWidth = contentM.offsetWidth;
    /**
    * disX              鼠标相对于 contentM  X轴坐标
    * disY              鼠标相对于 contentM  Y轴坐标
    * magnifierWidth    放大镜宽度
    * magnifierWidthHalf    放大镜宽度/2
    * SCALE             放大镜放大比例  实际应是 imgB/imgM  这里做了简化
    * _url              大图片路径   默认值 是第一张图片
    * num               当前显示第几张图片
    * len               图片个数
    */
    var disX,
        disY,
        magnifierWidth,
        magnifierWidthHalf,
        SCALE = 2,
        _url = "images/b01.png",
        num = 1,
        len = imgS.length;
    /**
    * 切换到对应图片
    * 显示模态框
    */
    var showModal = function (num) {
        changeModalImage(num)
        modal.className = "modal"
    }
    /**
    * 改变模态框图片
    */
    var changeModalImage = function(num) {
        carouselLeft.style.backgroundImage = "url(images/b0" + num + '.png)'
        for (var j = 0; j < len; j++) {
            carouselImg[j].className = ""
        }
        carouselImg[num-1].className = "active"
    }


    for (var i = 0; i < len; i++) {
        ;(function(index) {
            /**
            * 鼠标移入content-s下的img
            * 显示对应的 m 图片
            */
            imgS[index].onmouseover = function() {
                imgM.src = "images/m0" + (index + 1) + ".webp.jpg"
                _url = "images/b0" + (index + 1) + ".png"   //设置自定义属性 存储高清图片的地址, 方便后边取
                imgM.setAttribute('data-url',_url)          //有了num以后这里可以简化...

                num = index + 1     //记录当前显示第几张图片
                for (var j = 0; j < len; j++) {
                    imgS[j].className = ""
                }
                this.className = "active"   // 给当前小图片 添加激活样式
            }
            /**
            * 点击小图片 显示模态框
            */
            imgS[index].onclick = function () {
                showModal(num)
            }
            /**
            * 点击中图片 显示模态框
            */
            contentM.onclick = function() {
                showModal(num)
            }
        })(i)
    }
    /**
    * 鼠标移入 imgM
    * magnifier 显示
    * 并设置 大图片imgB 的 src
    */
    contentM.onmouseover = function() {
        magnifier.className = "magnifier"
        magnifierWidth = magnifier.offsetWidth
        magnifierWidthHalf = magnifierWidth/2
        contentB.className = "content-b"
        imgB.src = imgM.getAttribute('data-url') || _url
    }
    /**
    * 鼠标移出中图片
    * 放大镜 隐藏
    * 大图片容器 隐藏
    */
    contentM.onmouseout = function() {
        magnifier.className = "magnifier hidden"
        contentB.className = "content-b hidden"
    }
    /**
    * 鼠标在中图片上移动
    * 放大镜 位置改变
    * 高清大图   位置相应改变
    * l 放大镜的  left值
    * t 放大镜的  top值
    * imgBLeft   高清图的   -left值
    * imgBTop    高清图的   -top值
    */
    contentM.onmousemove = function(e) {
        e = e || window.event;
        e.preventDefault();

        disX = e.clientX - contentM.offsetLeft;
        disY = e.clientY - contentM.offsetTop;

        var l = disX - magnifierWidthHalf,
            t = disY - magnifierWidthHalf;

        if(l<0) {l=0; }
        if(l>(contentMWidth-magnifierWidth)) {l = contentMWidth-magnifierWidth}
        if(t<0) {t=0;}
        if(t>(contentMWidth - magnifierWidth)) {t = contentMWidth-magnifierWidth}

        magnifier.style.left = l + 'px';
        magnifier.style.top = t + 'px';

        var imgBLeft = l*SCALE,
            imgBTop = t*SCALE;
        imgB.style.left = -imgBLeft + 'px';
        imgB.style.top = -imgBTop + 'px'
    }
    /**
    * 点击半透明层  关闭modal
    * 通过 e.target.className 的 className 判断
    */
    modal.onclick = function(e) {
        e = e || window.event;
        if(e.target.className === 'modal') {
            modal.className = "modal hidden"
        }
    }
    /**
    * 点击 carouselArrowLeft
    * 改变 num
    * 切换图片
    */
    carouselArrowLeft.onclick = function () {
        if(num === 1){
            num = len+1
        }
        num--
        changeModalImage(num)
    }
    /**
    * 点击 carouselArrowRight
    * 改变 num
    * 切换图片
    */
    carouselArrowRight.onclick = function () {
        if(num === len){
            num = 0
        }
        num++

        changeModalImage(num)
    }
    /**
    * 点击 model中的小图片
    * 切换图片
    */
    for(var i=0;i<len;i++){
        ;(function (index) {
            carouselImg[index].onclick = function () {
                num = index + 1
                changeModalImage(num)
            }
        })(i)
    }
})(window, document)
