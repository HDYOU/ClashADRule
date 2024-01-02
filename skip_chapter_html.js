
//java.log(result)
skip_chapter=true;
text_relu="a@text";
url_relu="a@href";
info_relu=""
check_len=50;

// 移除非章节
is_check_chapter_name=true;

function skip_check_chapter(){
	
	base_src=src;
	
	text=result;
	java.setContent(text);
	name_list=java.getStringList(text_relu);
	// java.log(JSON.stringify(name_list))

	
        url_list=java.getStringList(url_relu);
        
        info_list=[]
        has_info_list=false;
        if(!info_relu  || info_relu !=0){
          has_info_list=true
          info_list=java.getStringList(info_relu);
          if(!info_list){
           info_list=[]
           has_info_list=false;
          }
        }
        
        java.setContent(base_src);
        
        function get_list_iitem(__list, __iindx){
          if(!__list || __list.length == 0) return ""
          let in_len=__list.length
          let s_in=__iindx;
          if(s_in < 0) s_in=0
          if(s_in >= in_len-1) s_in=in_len-1
          return __list[s_in]
        }
        
        function get_info(__iindx){
          return get_list_iitem(info_list, __iindx);
        }
        
        // 输出
        //java.log(JSON.stringify(url_list))
        //java.log(JSON.stringify(name_list))
        
        len=name_list.length;
        if(check_len>=len) return result;
        	
        	host=baseUrl.substring(0,baseUrl.indexOf("/",9));
        
        len=url_list.length;
        for(let i=0;i< len;i++){
        	tt=String(url_list[i]);
        	
        	if(tt.indexOf("/") ==0){
        	   tt =host+tt;
        	}else if(tt.toLowerCase().indexOf("http") ==0){
        	   tt=tt;
        	} else{
        	  tt =baseUrl+tt;
        	}
         url_list[i]=tt;
       }
       
        //	java.log(JSON.stringify(url_list))
        
        //  // 移除非章节
      if(is_check_chapter_name){
       new_name_list=[];
       len=name_list.length;
       
       new_url_list=[];
       let remove_count=0;
       let remove_name_list=[];
       let new_info_list=[]
      for(let i=0;i< len;i++){
          s_t_name=String(name_list[i]);
          t_url=url_list[i];
          
          t_name=remove_no_num_chapter_name(s_t_name);
          
          //java.log(t_name)
          if(!t_name || t_name=="") {
             remove_name_list.push(s_t_name);
             remove_count++;
            continue;
          }
          
          if(has_info_list){
            new_info_list.push(get_info(i))
          }
       
         new_url_list.push(t_url);
         new_name_list.push(t_name);
       }
       url_list=new_url_list;
       name_list=new_name_list;
       java.log("移除 可能非章节:"+(remove_count) +" 章");
       java.log("移除 可能非章节名: "+(JSON.stringify(remove_name_list)));
       
       info_list=new_info_list;
      }
        
        
        
        header={}
        
        function getImageUrl(image_index){
           return get_list_iitem(url_list, image_index);
         }

    function find(base, step) {
        var start, end, mid, maxEnd;
        start = base;
        end = start + step;
        rs_end=base + step;
        
        stop=0-step-1
        while (!isAllow([end,start]) && start>stop ) {
        	end = start;
            start = start -step;
            if(end < 0){
              end=0
            }
        }
        
        if(end < 0 || start <= stop){      
             // 保留一章，方便验证
        	  return 0;
        	}
        	
        if( end == rs_end){
          return end
        }
        	
        	
        
        start = end;
        end = end + step;
        if(end>=len){
          end=len-1;
        }

        maxEnd = end;
        while (end - start > 1) {
            mid = parseInt((end + start) / 2);
            let ss_list=[mid,start,end,parseInt((end + mid) / 2),parseInt((mid + start) / 2)];
            
            
            
            if (isAllow(ss_list)) {
                start = mid;
            } else {
                end = mid;
            }
        }
        return start;
    }

    var count = 0;

    dic={}
    function isAllow(_t_index_list) {
        
        count = count + 1
        
        let _t_len=_t_index_list.length
        if(_t_len==0) return false;
        
        let _first=_t_index_list[0];
        if(dic.hasOwnProperty(_first)){
          return dic[_first];
        }
        
        let _url_list=[];
        let _new_index_list=[];
        for(let _y=0;_y<_t_len;_y++){
          let tmp_index=_t_index_list[_y]
          if(dic.hasOwnProperty(tmp_index)){
             continue;
           }
           _new_index_list.push(tmp_index)
           _url_list.push(getImageUrl(tmp_index))
        }
        
        java.log(JSON.stringify(_t_index_list))
        java.log(JSON.stringify(_url_list))
        let resq_list = java.ajaxAll(_url_list);
        
        for (let resii = 0; resii < resq_list.length; resii++) {
            let tmp_index=_new_index_list[resii];
           try{
            
            let resq = resq_list[resii]
            if (!resq) {
                dic[tmp_index]=false;
                continue;
            }
            __html=resq.body();
            java.setContent(__html);
            
        	_data=java.getString(source.ruleContent.content);
        	//java.log(_data.slice(0,20));
        	//java.log(_data)
        	let _is_f=!_data || _data == ""
        	//java.log(_is_f);
        	if(_is_f){ 
        	  dic[tmp_index]=false;
        	} else {
        	  dic[tmp_index]=true;
        	}
        	
          }catch(e){
              java.log(e.message)
               dic[tmp_index]=false;
        
           }
            
            
        }
        
        return dic[_first] || false;
        
        
    }
    
    find_index=url_list.length-1;
    if(skip_chapter ) {
	
    img_start_index=url_list.length-check_len-1;
    start_time = new Date().getTime()
    find_index = find(img_start_index, check_len)
    end_time = new Date().getTime()

    java.log("time:"+ (end_time-start_time) +" ms")
    java.log("count:"+ "查找 "+(count) +" 次")
    java.log("跳过:"+(url_list.length-find_index-1) +" 章");
    java.log("find_index:"+find_index);
    java.log(name_list[find_index] )
    java.log(url_list[find_index] )
    
    }

    // source.getVariable()
    
    cc_list = []
    _start_index=0
    for (i = _start_index; i <= find_index; i++) {
    	name=name_list[i];
    url=	url_list[i];
    obj={
        	"text":name,
        	"href":url
        	};
     if(has_info_list){
       obj["info"]=get_info(i)
     
     }
    //JSON.stringify()
        cc_list.push(obj)
    }
      java.setContent(base_src);
	  return cc_list;
	
	}
	// 调用 skip_check_chapter();
	// skip_check_chapter()
	
	
	
	
	// 移除非章节
	function remove_no_num_chapter_name(__txt){
	
	if(!is_check_chapter_name) return __txt;
	
	if(!__txt || __txt== "") return __txt;
	if(__txt.match(/[前|序|绪|叙|引]言|楔子|序/)) return __txt;
	
	m=__txt.match(/^([^\d〇零二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟第章番外])+$|.*520快乐.*/)
	
	 if(m){
	    //java.log(JSON.stringify(m))
	 	 return "";
	 	}
	 	
	 if(__txt.match(/^([\d〇零一二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟])+更.*|^晚一会.*/)){
	     g=1
	 	 return "";
	 	}
	 	//java.log(JSON.stringify(__txt))
	 	__txt=String(__txt).replace(/正文卷.|正文.|VIP卷.|默认卷.|卷_|VIP章节.|免费章节.|章节目录.|最新章节.|[\(（【][\D]*?[求更票谢乐发订合补加架字修Kk].*?[】）\)]|[(（]精校[）)]/,"");
	 	//java.log(JSON.stringify(__txt))
	 return __txt;
	}
