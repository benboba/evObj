//统一事件注册
(function(w){
	var evObj={},listend={};
	
	w.EvObj={
		bind:function(ev,fn,area,first){
			if(!fn || Object.prototype.toString.call(fn)!=='[object Function]') return this;
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
		norepeat:function(ev,fn,area,first){
			if(!evObj[ev]){
				EvObj.bind(ev,fn,area,first);
			}
			return this;
		},
		unbind:function(ev,fn,area){
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
		once:function(ev,fn,area,first){
			var _self=this;
			var tmpfn = function(){
				fn.apply(this,arguments);
				_self.unbind(ev,tmpfn);
			};
			return this.bind(ev,tmpfn,area,first);
		},
		fire:function(ev,area){
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
		},
		listen:function(){
			var arg=(Object.prototype.toString.call(arguments[0])=='[object Array]')?arguments[0]:arguments;
			if(arg.length){
				for(var i=0,j=arg.length; i<j; i++){
					switch(arg[i]){
						case 'role':
							if(!listend['role']){
								listend.role=true;
								$('html').bind('mouseover',function(ev){
									var role_tgt=$(ev.target).closest('[data-role]');
									if(role_tgt.length && !role_tgt.data('rollin')){
										ev._tgt_=role_tgt[0];
										role_tgt.data('rollin',1);
										EvObj.fire('enter_'+role_tgt.data('role'),role_tgt[0],ev);
									}
									return false;
								});
								$('html').bind('mouseout',function(ev){
									var role_tgt=$(ev.target).closest('[data-role]');
									if(role_tgt.length){
										if(!$(ev.relatedTarget).closest('[data-role]').is(role_tgt)){
											ev._tgt_=role_tgt[0];
											role_tgt.removeData('rollin');
											EvObj.fire('leave_'+role_tgt.data('role'),role_tgt[0],ev);
										}
									}
									return false;
								});
							}
							break;
						case 'keypress':
						case 'keydown':
						case 'keyup':
							if(!listend[arg[i]]){
								listend[arg[i]]=true;
								$('html').bind(arg[i],(function(_arg){
									return function(ev){
										var key_tgt=$(ev.target).closest('[data-'+_arg+']');
										if(key_tgt.length){
											var ev_name=_arg+'_'+key_tgt.data(_arg);
											ev._tgt_=key_tgt[0];
											ev.ev_name=ev_name;
											EvObj.fire(ev_name,key_tgt[0],ev);
										}
									};
								})(arg[i]));
							}
							break;
					}
				};
			}
			return this;
		}
	};
	$('html').bind('click',function(ev){
		var click_tgt=$(ev.target).closest('[data-click]');
		if(click_tgt.length){
			var ev_name='click_'+click_tgt.data('click');
			ev._tgt_=click_tgt[0];
			ev.ev_name=ev_name;
			EvObj.fire(ev_name,click_tgt[0],ev);
		}
		EvObj.fire('click_body',document.body,ev);
	});
	if($('[data-role]').length){
		EvObj.listen('role');
	}
})(window);
