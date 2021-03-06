//统一事件注册
(function(w){
	var evObj={};
	
	w.EvObj={
		bind:function(ev,fn,area,first){//绑定事件监听
			if(!fn || typeof fn !== 'function') return this;
			if(!evObj[ev]){
				evObj[ev]=[];
			}
			if(first){
				evObj[ev].push([fn,area]);
			}else{
				evObj[ev].unshift([fn,area]);
			}
			return this;
		},
		norepeat:function(ev,fn,area,first){//限制该类型事件只可绑定本次监听
			if(!evObj[ev]){
				EvObj.bind(ev,fn,area,first);
			}
			return this;
		},
		unbind:function(ev,fn,area){//解除事件监听
			if(evObj[ev] && Object.prototype.toString.call(evObj[ev])==='[object Array]'){
				if(fn){
					for(var i=evObj[ev].length;i--;){
						if(evObj[ev][i][0]===fn){
							if(!area || (area && area===evObj[ev][i][1])){
								evObj[ev].splice(i,1);
								if(!evObj[ev].length){
									evObj[ev]=null;
									delete evObj[ev];
								}
							}
						}
					}
				}else{
					evObj[ev]=null;
					delete evObj[ev];
				}
			}
			return this;
		},
		once:function(ev,fn,area,first){//本次监听执行一次后立即解除绑定
			var _self=this;
			var tmpfn = function(){
				fn.apply(this,arguments);
				_self.unbind(ev,tmpfn);
			};
			return this.bind(ev,tmpfn,area,first);
		},
		fire:function(ev,area){//触发事件
			var args=[];
			for(var i=2,l=arguments.length;i<l;i++){
				args.push(arguments[i]);
			}
			if(evObj[ev]){
				for(var j=evObj[ev].length;j--;){
					if(!evObj[ev][j][1] || area===evObj[ev][j][1]){
						if(evObj[ev][j][0].apply(area || evObj[ev][j][1] || window,args) === false){
							break;
						}
					}
				}
			}
			return this;
		}
	};
})(window);
