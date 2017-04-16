/**
 * Created by Administrator on 2017/4/14.
 */
const ListItem = React.createClass({
    propTypes:{alt:React.PropTypes.string.isRequired},
    getDefaultProps(){
        return {year:"2017",month:"4",day:"14"}
    },
    render(){
     return <span>{this.props.year}
         {this.props.month}
         {this.props.day}</span>
    }
    });
 ReactDOM.render(
    <ListItem alt="不显示"/>,
        document.getElementById("div6")
 );
 //
const Bq=React.createClass({
    getDefaultProps(){
        return {className:"contain",children:{text:"渲染",text1:"内容"}}
    },
    render(){
        return <div className={this.props.className}>
               <p>{this.props.children.text}</p>
               <span>{this.props.children.text1}</span>
        </div>
}
});
ReactDOM.render(
    <Bq/>,document.getElementById("div7")
 );
//
var Com = React.createClass({
    propTypes:{name:React.PropTypes.string.isRequired},
    render(){
        return <div>
            {this.props.name}
        </div>
    }
});
var data ="123";
ReactDOM.render(
    <Com name={data}/>,
    document.getElementById("div8")
);