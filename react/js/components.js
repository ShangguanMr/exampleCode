/**
 * Created by Administrator on 2017/4/16.
 */
const  Coms =React.createClass({
    getDefaultProps(){
        return {age:"123"}
    },
    getInitialState(){
        alert("initialState");
        return {
           backgroundColor:"#090",
            color:"#fff",
            fontSize:"36px"
        }
    },
    componentWillMount(){
        alert("Will");
    },
    render(){
        alert("render");
        return <div style={this.state}>
            {this.props.name}{this.props.age}
        </div>
    },
    componentDidMount(){
        alert("Did");
    }
});
ReactDOM.render(
    <Coms name="jarry"/>,
    document.getElementById("div9")
);
//创建组件
const Hellp=React.createClass({
    HandeleClick(e){
        alert("您输入的内容："+this.refs.myInput.value);
        alert("您触发了："+e.target.innerHTML);
        console.log(e.target.innerText);
    },
    render(){
        return <div>
            <input type="text" ref="myInput"/>
            <button onClick={this.HandeleClick}>点击</button>
        </div>
    }
});
ReactDOM.render(
    <Hellp></Hellp>,
    document.getElementById("div10")
);
//
const H=React.createClass({
    getInitialState(){
        return {
            x:"hello"
        }
    },
    handlerChange(e){
        this.setState({x:e.target.value});
    },
    render(){
        return <div>
            <input type="text" defaultValue={this.state.x} onChange={this.handlerChange}/>
            <p>{this.state.x}</p>
        </div>
    }
});
ReactDOM.render(
    <H></H>,document.getElementById("div11")
);