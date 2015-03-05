define(function(require, exports, module) {
	var Util = require('./util'),
		Base = require('./base'),
		Core = require('./core'),
		Animate = require('./animate');

	var transformOrigin = Util.prefixStyle("transformOrigin");

	function OriginScroll(cfg){
		OriginScroll.superclass.constructor.call(this,cfg);
	}

	Util.extend(OriginScroll, Core, {
        init:function(){
            var self = this;
            OriginScroll.superclass.init.call(this);
            self._initContainer();
            self.resetSize();
        },
		_initContainer: function() {
            var self = this;
            if (self.__isContainerInited) return;
            var renderTo = self.renderTo;
            var container = self.container = self.renderTo.querySelector("."+self.containerClsName);
            var content = self.content = self.renderTo.querySelector("."+self.contentClsName);
            self.__isContainerInited = true;
            return self;
        },
		getScrollTop: function() {
			return this.renderTo.scrollTop;
        },
        getScrollLeft: function() {
        	return this.renderTo.scrollLeft;
        },
		scrollTop:function(y, duration, easing, callback){
			var self = this;
            var y = Math.round(y);
            if (self.userConfig.lockY) return;
            var duration = duration || 0;
            var easing = easing || "quadratic";
            var config = {
               css:{
                scrollTop:y
               },
               duration:duration,
               easing:easing,
               run:function(e){
                    //trigger scroll event
                    self.trigger("scroll",{
                        scrollTop:self.getScrollTop(),
                        scrollLeft:self.getScrollLeft()
                    });
               },
               useTransition:false, //scrollTop 
               end:callback
            };
            self.__timers.y = self.__timers.y || new Animate(self.renderTo,config);
            //run
            self.__timers.y.stop();
            self.__timers.y.reset(config);
            self.__timers.y.run();
		},
        scrollLeft:function(x, duration, easing, callback){
            var self = this;
            var x = Math.round(x);
            if (self.userConfig.lockX) return;
            var duration = duration || 0;
            var easing = easing || "quadratic";
            var config = {
               css:{
                scrollLeft:x
               },
               duration:duration,
               easing:easing,
               run:function(e){
                    //trigger scroll event
                    self.trigger("scroll",{
                        scrollTop:self.getScrollTop(),
                        scrollLeft:self.getScrollLeft()
                    });
               },
               useTransition:false, //scrollTop 
               end:callback
            };
            self.__timers.x = self.__timers.x || new Animate(self.renderTo,config);
            //run
            self.__timers.x.stop();
            self.__timers.x.reset(config);
            self.__timers.x.run();
        },
		_bindEvt:function(){
            var self = this;
            if (self.__isEvtBind) return;
            self.__isEvtBind = true;
             var mc = self.mc = new Hammer.Manager(self.renderTo);
            var tap = new Hammer.Tap();
            mc.add([tap,new Hammer.Pan()]);
            self.mc.on("tap", function(e) {
                e.preventDefault();
                e.srcEvent.stopPropagation();
                if(!self._isClickDisabled){
                  self._triggerClick(e);
                  self.trigger(e.type,e);
                }
            });

            self.mc.on("panstart pan panend",function(e){
                self.trigger(e.type,e);
            })

            self.renderTo.addEventListener("scroll",function(e){
                self.trigger("scroll",{
                    scrollTop:self.getScrollTop(),
                    scrollLeft:self.getScrollLeft()
                })
            },false)
        }
	});

	if (typeof module == 'object' && module.exports) {
		module.exports = OriginScroll;
	} else {
		return window.XScroll = OriginScroll;
	}
});


