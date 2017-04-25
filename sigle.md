#JS是多线程的吗？
##多线程编程相信大家都很熟悉，比如在界面开发中，如果一个事件的响应需要较长时间，那么一般做法就是把事件处理程序写在另外一个线程中，在处理过程中，在界面上面显示类似进度条的元素。这样界面就不会卡住，并且能够显示任务执行进度。记得刚开始做前端的时候，老板交代在界面上面做一个定时器，每秒更新用户的在线时间。当时拥有Java和C++开发经验的我自信满满的说我加一个线程就可以分分钟搞定了。所以查阅文档，发现setTimeout和setInterval可以很方便的实现该功能。那时候我就认为这就是JS中的多线程。setTimeout相当于启动一个线程，等待一段时间后执行函数，setInterval则是在另外的一个线程中，每隔一段时间执行函数。这个观念在我的头脑中存在了一年左右，直到遇到了这样的一个问题。
 ##demo
    测试人员发现一个按钮的点击响应时间较长，在响应过程中，界面卡住了，我检查代码发现代码中做了这样的事情。
   $("#submit").on("click", function() {  
    bigTask(); // 这个函数需要较长时间来执行  
    });
  所以我想很简单啊，把这个函数放在另外的一个线程执行就好了啊，所以代码改成了这样， 以为可以轻松解决问题。但是事实上发现毫无用处，界面还是原来一样的行为，点击按钮之后卡住了几秒。
   $("#submit").on("click", function() {  
    setTimeout(function() {  
        bigTask()  
    }, 0)  
   });  
#解决办法：
##1、浏览器中的JS是单线程的。
##2、setInterval和setTimeout并不是多线程，这两个函数根本上其实是事件触发函数
想证明setInterval和setTimeout不是多线程很简单，你可以试试这样一段代码
  setTimeout(function() {  
    while(true){}  
}, 0);
setTimeout(function() {  
    alert("foo")  
}, 1000);
##不出意外，你的浏览器无法响应了，页面上面的按钮不能点，Gif也不能动，那个alert肯定也出不来。这是为什么呢？

##为了解释上面的问题，我们来深入解析一下浏览器。浏览器中有三个常驻的线程，分别是JS引擎，界面渲染，事件响应。由于这三个线程同时要访问DOM树，所以为了线程安全，浏览器内部需要做互斥：当JS引擎在执行代码的时候，界面渲染和事件响应两个线程是被暂停的。所以当JS出现死循环，浏览器无法响应点击，也无法更新界面。现在的浏览器的JS引擎都是单线程的，尽管多线程功能强大，但是线程同步比较复杂，并且危险，稍有不慎就会崩溃死锁。单线程的好处不必考虑线程同步这样的复杂问题，简单而安全。下面的一幅图来简要说明JS引擎的执行流程：



##JS引擎基于事件来执行代码。事件响应线程在接到事件后，把响应的代码放到JS引擎的队列中，JS引擎按顺序执行代码。在JS引擎没有代码可以执行的时候，比如图中蓝色方框的间隙中，事件线程和渲染线程得以有机会运行。基于这些信息，能够的出下面的结论

 

##setTimeout，setInterval并不是多线程，只是一个定时的事件触发器，它们在合适的时间把一些JS代码塞到JS引擎的队列中。
setTimeout(aFunction, 0)，这行代码看似的意思是在0秒之后执行aFunction, 但这并不意味着立即执行。其它真正的意思是立刻把aFunction的代码放到当前JS引擎的队列中。所以当前代码块执行完成之前，aFunction的代码是得不到执行的。比如这段代码，一定是world先出来，hello后出来。尽管setTimeout的参数是0，但这并不意味着立即执行
setTimeout(function() {  
    alert("hello");  
}, 0)  
alert("world")  
##在一个事件的响应代码执行完成之后，即使队列中有待执行的代码，浏览器也会先执行页面渲染和响应事件，完成之后再执行队列中的代码。
#异步Ajax
看到这边相信各位应该对JS的单线程以及setTimeout，setInterval的本质有所了解了，那么我们再继续讨论下一个问题，异步Ajax。上文说了，JS是单线程的，当一个函数执行的时候，JS引擎会锁住DOM树，其他事件的响应代码只能在队列中等待，并且此时页面卡死。那么异步Ajax是怎么回事呢？一个常用的开发实践就是发起一个异步的Ajax，界面显示一个进度条样式的Gif，说好的单线程呢？事实上异步Ajax确实用了多线程，只是Ajax请求的Http连接部分由浏览器另外开了一个线程执行，执行完毕之后给JS引擎发送一个事件，这时候异步请求的回调代码得以执行。它的执行流程是这样的：


##Http请求的执行在另外一个线程中，由于这个线程并不会操作DOM树，所以是可以保证线程安全的。发起Ajax请求和回调函数中间是没有JS执行的，所以页面不会卡死。
#真正的多线程：
##在HTML5中，引入了Web Worker这个概念。它能够在另外一个线程中执行计算密集的JS代码而不引起页面卡死，这是真正的多线程。然而为了保证线程安全，Worker中的代码是不能访问DOM的。其具体使用方法在此不作赘述，请参考：http://www.w3school.com.cn/html5/html_5_webworkers.asp;
#总结：
 ##结合上面的分析，总结出出下面的一些实践供各位参考。

##1、避免编写计算密集的前端代码。
##2、使用异步Ajax。
##3、避免编写一个需要较长时间来执行的JS代码，比如生成一个大型的表。遇到这种情况，可以分批执行，比如用setInterval来每秒生成20行，或是用户向下拖动滚动条时候再继续产生新的行。
##4、在页面初始化时候不要执行很多的初始化代码，否则会影响页面渲染变慢。一些不需要立即执行的代码可以在页面渲染完成之后再执行，比如绑定事件，生成菜单之类的控件。
##5、对于复杂页面（像淘宝首页），可以结合异步Ajax分批产生页面。先生成页面框架，页面内容自上而下用异步Ajax逐步加载并填充到框架中。这样能够让用户更早的看到页面。
##6、setTimeout(function, 0)是有用的。它可以让callback作为另外一个事件响应代码来执行。实现了当前事件的代码执行完成之后，再渲染DOM，再执行setTimeout的callback。这样能够让一部分代码延后执行，并且在这之前渲染DOM。  