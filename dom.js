$.get("data.json", function(response) {
	//response里大概有13万条数据
	loadAll(response);
});

function loadAll(response) {
	var html = "";
	for (var i = 0; i < response.length; i++) {
		var item = response[i];
		html += "<li>title:" + item.title + " content:" + item.content + "</li>";
	}
	$("#content").html(html);
}
/*data.json中大概有13万条数据左右， 通过ajax获取数据后以最简单粗暴的方法展示数据，
在chrome浏览器下， 刷新页面到数据显示，我心中默数， 整个过程大概花掉5秒钟左右的时间，
 卡顿非常明显。 我大致观察了一下代码的运行时间，发现循环生成字符串这过程其实并不算太耗时， 
 性能瓶颈是在将html字符串插入到文档中这个过程上， 也就是 $("#content").html(html); 这句代码的执行， 
 毕竟有13万个li元素要被挺入到文档里面， 页面渲染速度缓慢也在情理之中。
既然一次渲染13万条数据会造成页面加载速度缓慢，那么我们可以不要一次性渲染这么多数据，
而是分批次渲染， 比如一次10000条，分13次来完成， 这样或许会对页面的渲染速度有提升。 
然而，如果这13次操作在同一个代码执行流程中运行，那似乎不但无法解决糟糕的页面卡顿问题，反而会将代码复杂化。 
类似的问题在其它语言最佳的解决方案是使用多线程，Javascript虽然没有多线程，但是setTimeout和setInterval两个函数却能起到和多线程差不多的效果。
 因此，要解决这个问题， 其中的setTimeout便可以大显身手。 setTimeout函数的功能可以看作是在指定时间之后启动一个新的线程来完成任务。*/

$.get("data.json", function(response) {
	//response里大概有13万条数据
	loadAll(response);
});

function loadAll(response) {
	//将13万条数据分组， 每组500条，一共260组
	var groups = group(response);
	for (var i = 0; i < groups.length; i++) {
		//闭包， 保持i值的正确性
		window.setTimeout(function() {
			var group = groups[i];
			var index = i + 1;
			return function() {
				//分批渲染
				loadPart(group, index);
			}
		}(), 1);
	}
} //数据分组函数（每组500条）
function group(data) {
	var result = [];
	var groupItem;
	for (var i = 0; i < data.length; i++) {
		if (i % 500 == 0) {
			groupItem != null && result.push(groupItem);
			groupItem = [];
		}
		groupItem.push(data[i]);
	}
	result.push(groupItem);
	return result;
}

var currIndex = 0;

//加载某一批数据的函数
function loadPart(group, index) {
	var html = "";
	for (var i = 0; i < group.length; i++) {
		var item = group[i];
		html += "<li>title:" + item.title + index + " content:" + item.content + index + "</li>";
	}
	//保证顺序不错乱
	while (index - currIndex == 1) {
		$("#content").append(html);
		currIndex = index;
	}
}
/*以上代码大致的执行流程是
1. 用ajax获取到需要处理的数据， 共13万条
2. 将数组分组，每组500条，一共260组
3. 循环这260组数据，分别处理每一组数据， 
利用setTimeout函数开启一个新的执行线程（异步），
防止主线程因渲染大量数据导致阻塞。*/

//loadPart函数中有这段代码：
while (index - currIndex == 1) {
	$("#content").append(html);
	currIndex = index;
}

/*是为了保证不同的线程中最终插入html到文档中时顺序的一致性， 不至于同时执行的代码在插入html时互相篡位。
通过这种方式执行， 页面瞬间就刷出来了，不用丝毫等待时间。 从同步改为异步，虽然代码的整体资源消耗增加了， 
但是页面却能瞬间响应， 而且， 前端的运行环境是用户的电脑，因此些许的性能损失带来的用户体验提升相对来说还是值得的。
虽然示例中提到的情况在现实环境中几乎不可能出现， 但是在我们平时的工作中总会有一些似是而非的场景出现， 利用里面的处理思路，
 或许对我们解决问题会有一定的帮助。

ps：setTimeout并不算真正的多线程， 但是为了方便表达，便借用了线程一词
以上就是本文的全部内容，希望本文的内容对大家的学习或者工作能带来一定的帮助，同时也希望多多支持脚本之家！--引自job51.net*/