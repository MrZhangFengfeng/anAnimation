// var swipe = Swipe($('#content'));
// swipe.scrollTo($('#content').width()*2,500000);
var container = $("#content");
// 页面可视区域
visualWidth = container.width();
visualHeight = container.height();


// 动画结束事件
var animationEnd = (function() {
	var explorer = navigator.userAgent;
	if (~explorer.indexOf('WebKit')) {
		return 'webkitAnimationEnd';
	}
	return 'animationend';
})();

// 获取数据
var getValue = function(className) {
    var $elem = $('' + className + '');
        // 走路的路线坐标
        return {
        	height: $elem.height(),
        	top: $elem.position().top
        };
    };

function doorAction(left,right,time){
	var door = $('.door');
	var doorLeft = $('.door-left');
	var doorRight = $('.door-right');
	var dfd = $.Deferred();
	var count = 2;

	function complete(){
		if(count==1){
			dfd.resolve();
			return;
		}
		count--;
	}

	doorLeft.transition({
		'left':left	        	
	},time,complete);

	doorRight.transition({
		'left':right	        	
	},time,complete);

	return dfd;
}

function openDoor(){
	return doorAction('-50%','100%',2000);
}

function closeDoor(){
	return doorAction('0','50%',2000);
}

///////////
// 灯动画 //
///////////
var lamp = {
	elem : $('.b_background'),
	bright : function(){
		this.elem.addClass('lamp-bright');
	},
	dark : function(){
		this.elem.removeClass('lamp-bright');
	}
}

var bird = {
	bird : $('.bird'),
	fly:function(){
		this.bird.addClass('birdFly')
		this.bird.transition({
			right: $('#content').width()
		}, 15000, 'linear');
	}
}
// $('#open').click(function(){
// 	openDoor().then(function(){
// 		lamp.bright();
// 	});
// });

// $('#close').click(function(){
// 	closeDoor().then(function(){
// 		lamp.dark();
// 	});
// });
var bridgeY = function(){
	var data = getValue('.c_background_middle');
	return data.top;
}
var girl = {
	elem : $('.girl'),
	getHeight : function(){
		return this.elem.height();
	},
	//转身动作
	rotate : function(){
		this.addClass('girl-rotate');
	},
	setOffset : function(){
		return this.elem.css({
			left : visualWidth / 2,
			top : bridgeY - this.getHeight()
		});
	},
	getOffset : function(){
		return this.elem.offset();
	},
	getWidth: function() {
        return this.elem.width();
    },
    // 转身
    rotate : function (){
    	this.elem.addClass('girl-rotate');
    }
};
//修正小女孩的位置
girl.setOffset();

var logo={
	elem : $('.logo'),
	run:function(){
		this.elem.addClass('logolightSpeedIn').on(animationEnd,function(){
			$(this).addClass('logoshake').off();
		})
	}
}

//玫瑰花飘落
var roses = [
    "./images/snowflake/snowflake1.png",
    "./images/snowflake/snowflake2.png",
    "./images/snowflake/snowflake3.png",
    "./images/snowflake/snowflake4.png",
    "./images/snowflake/snowflake5.png",
    "./images/snowflake/snowflake6.png"
]

function snowflake(){
    var  flakeContainer = $('#snowflake');
    function getImageName (){
    	var index = Math.floor(Math.random()*6);
        return roses[index];
    }
    //创建一朵玫瑰花
    function  createSnowBox(){
        var url = getImageName ();
        return $("<div class='snowbox'></div>").css({
            'width': 41,
            'height': 41,
            'position': 'absolute',
            'backgroundSize': 'cover',
            'zIndex': 100000,
            'top': '-41px',
            'backgroundImage':'url('+url+')'
        }).addClass('snowRoll');
    }

    //开始飘落
    setInterval(function(){
        var startPositionLeft = Math.random()*visualWidth-100,
            startOpacity = 1,
            endPositionTop = visualHeight - 40,
            endPositionLeft = startPositionLeft - 100 + Math.random() * 500,
            duration = visualHeight * 10 + Math.random() * 5000;

        //随机透明度，不小于0.5
        var randomOpacity =Math.random();
        randomOpacityStart = randomOpacity < 0.5 ? startOpacity : randomOpacity;

        //创建一朵玫瑰花
        var rose = createSnowBox();

        rose.css({
            left : startPositionLeft,
            opacity : randomOpacityStart
        });
        
        flakeContainer.append(rose);

        rose.transition({
            top:endPositionTop,
            left:endPositionLeft,
            opacity:0.5
        },duration,'ease-out', function() {
            $(this).remove() //结束后删除
        });
    },200)
}


//audio
function audio(url,isloop){
	var audio = new Audio(url);
	audio.autoPlay = true;
	audio.loop = isloop || false;
	audio.play();
	return {
		end: function(callback) {
			audio.addEventListener('ended', function() {
				callback();
			}, false);
		},
		pause:function(){
			audio.pause();
		},
		play:function(){
			audio.play();
		}
	};
}

