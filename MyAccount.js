'use strict';
import React, {Component} from 'react';
import{
    AppRegistry,
    StyleSheet,
    Text,
    Image,
    Navigator,
    Dimensions,
    ToastAndroid,
    TouchableOpacity,
    WebView,
    BackAndroid,
    View
} from 'react-native';
import Head from './app/commonview/Head';
import Login from './app/page/Login';
import Icon from 'react-native-vector-icons/Ionicons';
import NButton from './app/commonview/NButton';
import MyHomeIcon from './app/commonview/ComIconView';
class MyAccount extends React.Component {

    constructor(props) {
        super(props);
    }


    /**
     *组件将要被加载在视图
     */
    componentWillMount() {

    }

    _more(){
        alert('no more');
    }
    render() {

        return (
            <View style={styles.container}>
                <Head title="我的"/>
                <View style={{flex:1}}>
                    <View style={styles.viewStyle}>
                        <Image source={require('./image/my_account_on.png')}
                            style={styles.imageStyle} />
                        <View style={{flexDirection:'column',height:60,marginLeft:30,marginTop:20}}>
                            <Text style={{justifyContent:'center',height:40}}>天津拓瑞宠物医院</Text>
                            <Text style={{justifyContent:'center'}}>天津市滨海新区大同路120号</Text>
                        </View>
                    </View>
                    <View style={styles.viewStyle}>
                        <View style={styles.fontViewStyle}>
                            <Text style={styles.fontStyle}>会员：123</Text>
                        </View>
                        <View style={styles.fontViewStyle}>
                            <Text
                                style={styles.fontStyle}>宠物：333</Text>
                        </View>
                    </View>
                </View>
                <View style={{marginTop:20,borderTopColor:'#666',borderTopWidth:StyleSheet.hairlineWidth}}>
                    <MyHomeIcon text="我的信息" icon={'ios-mail'} color={'#00BBFF'} IconColor={'white'}  onPress={this._more.bind(this)}/>
                    <MyHomeIcon text="邀请朋友" icon={'md-person-add'} color={'#FF3333'} IconColor={'white'}  onPress={this._more.bind(this)}/>
                    <MyHomeIcon text="我的问题" icon={'ios-quote'} color={'#7FFFD4'} IconColor={'white'}  onPress={this._more.bind(this)}/>
                    <MyHomeIcon text="我的收藏" icon={'ios-star'} color={'#FF6666'} IconColor={'white'}  onPress={this._more.bind(this)}/>
                    <MyHomeIcon text="我的优惠券" icon={'ios-card'} color={'#9370DB'} IconColor={'white'}  onPress={this._more.bind(this)}/>
                    <MyHomeIcon text="设置" icon={'ios-settings'} color={'#BBBB00'} IconColor={'white'}  onPress={this._more.bind(this)}/>
                    <MyHomeIcon text="我的积分" icon={'md-closed-captioning'} color={'#0066FF'} IconColor={'white'}  onPress={this._more.bind(this)}/>
                </View>
            </View>
        );

    }

    //用了render方法后，组件加载成功并被成功渲染出来以后所执行的hook函数，一般会将网络请求等加载数据的操作，放在这个函数里进行，来保证不会出现UI上的错误
    componentDidMount() {

    }

    //指父元素对组件的props或state进行了修改
    componentWillReceiveProps() {
        //BackAndroid.removeEventListener('hardwareBackPress');
    }

    //一般用于优化，可以返回false或true来控制是否进行渲染
    shouldComponentUpdate() {
        return true;
    }

    //组件刷新前调用，类似componentWillMount
    componentWillUpdate() {
    }

    //更新后的hook
    componentDidUpdate() {
    }

    //销毁期，用于清理一些无用的内容，如：点击事件Listener
    componentWillUnmount() {
    }
}


const styles = StyleSheet.create({
    container: {

    },
    viewStyle:{
        flexDirection:'row',
        borderBottomColor:'#666',
        borderBottomWidth:StyleSheet.hairlineWidth,
    },
    fontViewStyle:{
        flex:1,
        height:50,
        borderRightColor: '#666',
        borderRightWidth: StyleSheet.hairlineWidth,
        justifyContent:'center'
    },
    fontStyle:{
        marginLeft:30,
        alignItems:'flex-start',
    },
    imageStyle:{
        height: 50,
        width: 50,
        alignSelf: 'center',
        marginLeft: 20,
        marginTop:10,
    }
});

module.exports = MyAccount;