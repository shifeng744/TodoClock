console.log(2)
(function(){
	/*
store.set('user', { name:'Marcus' });
store.set("gg",12312);
store.clearAll()*/

/*var arr=[1,23,4,5];
store.set("gg", arr);
store.clearAll()*/
 
var task_list=[];  //任务列表
var $add_task=$(".add-task");  //提交
init();  //初始化
//console.log(task_list);

$add_task.on("submit",function(ev){
    ev.preventDefault(); //阻止默认事件
    //console.log(1)
    var obj={};
    obj.content=$add_task.find("input").eq(0).val();
	//obj.com=false;
    if (!obj.content) return;
    //console.log(obj)

    add_task(obj);
    
    createHtml(); //生成thml
    $add_task.find("input").eq(0).val(null);  //清空
     

});

//
function  init() {
    task_list=store.get("gg") || [];
    createHtml(); //生成thml
    clock_time();
}

//把对像push数组里面
function add_task(obj) {
    task_list.push(obj);
    //console.log(task_list)
    //把数据存到浏览器
    store.set("gg",task_list);
}


//1.创建一个对像  push数组里面
//2.把数据存到浏览器
//3.把数据取出来

//生成hmtl
function createHtml() {
    var $task_list=$(".task-list");
    $task_list.html(null); //清空
    var complate_items=[];
        for(var i=0; i<task_list.length; i++){
            if (task_list[i].complated){ //选中了
                complate_items[i]=task_list[i]
            }
            else{
                var $item=bindHtml(task_list[i],i);
                $task_list.append($item);
                clock_time($item);
            }

        }
        for(var j=0; j<complate_items.length; j++){
            //
			if(complate_items[j]){
				 $item=bindHtml(complate_items[j],j);
				 $item.addClass("cur")
            //if (!$item) continue;
            $task_list.append($item);
			}
          

        }
    btnclick()//点击删除事件
    btnclick2()//点击详细事件
    add_complated();
}

//绑定html
function bindHtml(data,index){
    var str='<li data-index="'+index+'">'+
        '<input type="checkbox" class="complate" '+(data.complated ? "checked": "")+'>'+
        '<p class="content">'+data.content+'</p>'+
        '<div class="right">'+
        '<span class="delete r-main">删除</span>'+
        '<span class="detail r-main">详细</span>'+
        '</div>'+
        '</li>';
    return $(str);
}
//删除---------------------------------------------------------------------------------------------------
//点击事件
function btnclick(){
	var $delete=$(".delete.r-main");
	
	$delete.click(function(){
		var index=$(this).parent().parent().data("index");
		var off=false;
		$(".Alert").show();
		$(".primary.confirm").bind("click",function(){
			off=true
			task_list.splice(index,1)
			$(".Alert").hide();
			Refresh();
			$(".primary.confirm").unbind()
		})
		$(".cancel").click(function(){
			off=false
			$(".Alert").hide();
			
			
		})
		
	})
}
//删除事件
/*function dele(index){
	
	
	/*if(!off) return;
	task_list.splice(index,1);*/
	//console. log(task_list)
	//Refresh()
//}

//更新
function Refresh(){
	store.set("gg",task_list);
	createHtml();
}
//------------------------------------------------删除--------------------------------------------------------------------------
/*================================================详细==========================================================*/
function btnclick2(){
	var $detail=$(".detail.r-main");
	
	$detail.click(function(){
		var index=$(this).parent().parent().data("index");
		
		
		cre(task_list[index],index);
		jQuery.datetimepicker.setLocale('ch');
   		 $('.datetimepicker').datetimepicker();
	})
}
function cre(data,index){
	 var str='<div class="task-detail-mask"></div>'+
            '<div class="task-detail">'+
            '<form class="up-task">'+
            '<h2 class="content">'+(data.content || "")+'</h2>'+'<input type="text" class="modify"  style="display:none"/>'+
            '<div class="input-item">'+
            '<textarea class="taile">'+(data.tatil || "")+'</textarea>'+
            '</div>'+
            '<div class="remind input-item">'+
            '<label for="b">提醒时间</label>'+
            '<input id="b" class="datetime datetimepicker" type="text" value="'+(data.datetime || "")+'">'+
            '</div>'+
            '<div class="input-item">'+
            '<button class="ut-data">更新</button>'+
            '</div>'+
            '<div class="colse">X</div>'+
            '</form>'+
            '</div>';
$(".container .task-list").after(str);
		rem();//删除
		updata1(index);//更新
		xiugai();//修改

}
//删除
function rem(){
	$task_detail_mask=$(".task-detail-mask,.colse");
	$task_detail_mask.click(function(){
		$(".task-detail-mask,.task-detail").remove();
	})
}

 
/*================================================详细end==========================================================*/

/*================================================点击更新==========================================================*/
 function updata1(index){
 	 $(".up-task").on("submit",function (ev) {
            ev.preventDefault();
            // console.log(index)
            //新建一个对像  newobj={};
            var newobj={};
            newobj.content=$(this).find(".content").text();
            newobj.tatil=$(this).find(".taile").val();
            newobj.datetime=$(this).find(".datetime").val();

            //console.log(newobj)
            //task_list[index] = newobj
            //console.log(task_list);
            up_data(newobj,index);//更新详细数据
            $(".task-detail-mask,.task-detail").remove(); //删除详细框
           	createHtml()
 			
 	})
 }
 function up_data(newobj,index){
        //task_list[index] = newobj;
        task_list[index] = $.extend({}, task_list[index],newobj);
        store.set("gg",task_list);
        //cre(task_list[index],index);
        //createHtml();
    }
/*================================================点击更新end==========================================================*/
/*================================================点击修改==========================================================*/
function xiugai(){
	
	$(".up-task .content").dblclick(function(){
		var $that=$(this);
		$cont=$(".up-task .content");
		//console.log()
		$mod=$(".container .up-task .modify")
		$cont.hide();
		$mod.show();
		
		
		$mod.focus();
		
		$mod.on("blur",function(){
			$that.show();
			$(this).hide();
			if(!$(this).val()) return;
			$that.text($(this).val());
		})
		
	})
	
}


/*================================================点击修改end==========================================================*/
/*================================================点击选中==========================================================*/
	function add_complated(){
		var complate=$(".task-list .complate");
		complate.on("click",function(){
			var $that=$(this);
			var index=$(this).parent().data("index");
			if(task_list[index].complated){
			up_data({complated:false},index)
			//$that.parent().removeClass("cur");
			
		}
		else{
			up_data({complated:true},index)
			//$that.parent().addClass("cur");
			
		}
		createHtml();
		})
		
		
		
	}


/*================================================点击选中end==========================================================*/
	    var timer=null;
    //clock_time();


    function clock_time(obj){
        if (!$(obj)[0]) return;

        ///console.log($(obj)[0]);
       clearInterval($(obj)[0].timer);
        $(obj)[0].timer=setInterval(function(){
            //1.获取 start_time=  当前的时间
            var start_time=new Date().getTime();
            var $item=task_list;
            for(var i=0; i<$item.length; i++){
                //2.过滤
                if ($item[i].complated || !$item[i].datetime || $item[i].off) continue;

                //3.end_time= 结束时间   task_list[i].datetime
                var end_time=(new Date($item[i].datetime)).getTime();

                if (end_time - start_time <=1){

                    clearInterval($(obj)[0].timer);
                    console.log("播放音乐");

                   //播放音乐
                    play_music();
                    //弹出提醒框
                    show_alert(task_list[i],i);

            }
            }
        },1000);
    }
    
    function show_alert(item,i) {
        $(".msg").show();
        $(".msg-content").text(item.content);
        $(".msg-btn").click(function(){
            up_data({off:true},i);  //添加属性
            $(".msg").hide();
        })
    }

    //播放音乐
    function play_music() {
        var music=document.getElementById("music");
        music.play();
    }





}())
