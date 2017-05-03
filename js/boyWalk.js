/**
 * 小孩走路
 * @param {[type]} container [description]
 */

 function BoyWalk() {
 	var container = $("#content");
	// 页面可视区域
	var visualWidth = container.width();
	var visualHeight = container.height();
    // 路的Y轴
    var pathY = function() {
    	var data = getValue('.a_background_middle');
    	return data.top + data.height / 2;
    }();

    var boy = $("#boy");
    var boyWidth = boy.width();
    var boyHeight = boy.height();
    // 修正小男孩的正确位置
    boy.css({
    	top: pathY - boyHeight + 25
    });

    // 暂停走路
    function pauseWalk() {
    	boy.addClass('pauseWalk');
    }

    // 恢复走路
    function restoreWalk() {
    	boy.removeClass('pauseWalk');
    }

    // css3的动作变化
    function slowWalk() {
    	boy.addClass('slowWalk');
    }

    // 用transition做运动
    function stratRun(options, runTime) {
    	var dfdPlay = $.Deferred();
        // 恢复走路
        restoreWalk();
        // 运动的属性
        boy.transition(
        	options,
        	runTime,
        	'linear',
        	function() {
                dfdPlay.resolve(); // 动画完成
            });
        return dfdPlay;
    }

    // 开始走路
    function walkRun(time, dist, disY) {
    	time = time || 3000;
        // 脚动作
        slowWalk();
        // 开始走路
        var d1 = stratRun({
        	'left': dist + 'px',
        	'top': disY ? disY : undefined
        }, time);
        return d1;
    }

    // 计算移动距离
    function calculateDist(direction, proportion) {
    	return (direction == "x" ?
    		visualWidth : visualHeight) * proportion;
    }

    // 走进商店
    function walkToShop(runTime) {
    	var defer = $.Deferred();
    	var doorObj = $('.door')
        // 门的坐标
        var offsetDoor = doorObj.offset();
        var doorOffsetLeft = offsetDoor.left;
        // 小孩当前的坐标
        var offsetBoy     = boy.offset();
        var boyOffetLeft = offsetBoy.left;

        // 当前需要移动的坐标
        instanceX = (doorOffsetLeft + doorObj.width() / 2) - (boyOffetLeft + boy.width() / 2);

        // 开始走路
        var walkPlay = stratRun({
        	transform: 'translateX(' + instanceX + 'px),scale(0.3,0.3)',
         	opacity: 0.1
        }, 2000);
            // 走路完毕
	        walkPlay.done(function() {
	         	boy.css({
	          	opacity: 0
	        })
	        	defer.resolve();
	        })
	            return defer;
        }

        // 走出店
    function walkOutShop(runTime) {
     	var defer = $.Deferred();
     	restoreWalk();
        //开始走路
        var walkPlay = stratRun({
         	transform: 'translateX(' + instanceX + 'px),scale(1,1)',
         	opacity: 1
        }, runTime);
        //监听走路完毕
        walkPlay.done(function() {
         	defer.resolve();
        });
        return defer; 
    }

    function takeFlower(){
    	var defer = $.Deferred();
    	setTimeout(function(){
    		boy.addClass('slowFlowerWalk');
            defer.resolve();
    	},1000);
    	return defer;
    }

    return {
	    // 开始走路
	    walkTo: function(time, proportionX, proportionY) {
	     var distX = calculateDist('x', proportionX);
	     var distY = calculateDist('y', proportionY);
	     return walkRun(time, distX, distY);
	    },
	    // 停止走路
	    stopWalk: function() {
      		pauseWalk();
     	},
     	// 走进商店
     	toShop : function(){
     		return walkToShop.apply(null,arguments);
     	},
     	// 走出商店
     	outShop : function (){
     		return walkOutShop.apply(null,arguments);
     	},
     	takeFlower : function(){
     		return takeFlower();	
     	},
     	//恢复初始位置
     	resetOriginal: function() {
            this.stopWalk();
            // 恢复图片
            boy.removeClass('slowWalk slowFlolerWalk').addClass('boyOriginal');
        },
        getWidth:function(){
        	return boyWidth;
        },
        rotate: function(callback) {
        	restoreWalk();
        	boy.addClass('boy-rotate');
                // 监听转身完毕
                if (callback) {
                boy.on(animationEnd, function() {
	                callback();
	                $(this).off();
                })
            }
        }
    }
}