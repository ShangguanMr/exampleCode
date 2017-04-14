/**
 * Created by ShangguanMr on 2017/4/14.
 */
const Helloc = React.createClass({
    propTypes:{title:React.PropTypes.string.isRequired},
    getDefaultProps(){
        return {name:"大胖",age:"23",sex:"男"}
    },
    render(){
    return <div>
          <p>显示出来的文字{this.props.title}<br/>
              {this.props.name}<br/>
              {this.props.age}<br/>
              {this.props.sex}</p>
    </div>
}
});
var data="123";
ReactDOM.render(
    <Helloc title={data}/>,
    document.getElementById("div3")
);
//创建组件；
   function List(props){
       return <div>
           <p>无状态组件创建方式:{props.name}</p>
       </div>
   }
//渲染到现有的DOM元素上。
   ReactDOM.render(
       <List name="上勇"/>,
       document.getElementById("div4")
   );
//创建组件；
 var Item = React.createClass({
      propTypes:{data_id:React.PropTypes.string.isRequired},
      getDefaultProps(){
      return {name:"刘晶晶",age:"24",sex:"女"}
},
      render(){
           return <div>
               <p>显示刘晶晶信息:<br/>
                   姓名：{this.props.name}<br/>
                   年龄:{this.props.age}<br/>
                   性别：{this.props.sex}<br/>
               </p>
           </div>
}
  });
                   var data="123";
    ReactDOM.render(
                   <Item data_id={data}/>,
                   document.getElementById("div5")
                   );