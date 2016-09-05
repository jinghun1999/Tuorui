'use strict';
import React, {Component} from 'react';
import{
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    View,
    Alert
    } from 'react-native';
import Head from './app/commonview/Head';
import Icon from 'react-native-vector-icons/Ionicons';
import ComIconView from './app/commonview/ComIconView';
import MyInfo from './app/page/uc/myinfo';
import IndexPage from './Index';
import NButton from './app/commonview/NButton';
class UC extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            memberNumber: 123,
        };
    }

    _more() {
        //alert('no more');
        //alertA('a')
        Alert.alert('提醒','功能未启用');
    }
    _myInfo(){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'MyInfo',
                component: MyInfo,
                params: {}
            })
        }
    }
    Logout(){
        let _this = this;
        Alert.alert(
            '注销提示',
            '您确定要注销登陆吗？',
            [
                {text: '取消', onPress: () => console.log('Cancel Pressed!')},
                {text: '确定', onPress: () => {
                    storage.remove({key:'USER'});
                    const { navigator } = _this.props;
                    if (navigator) {
                        navigator.pop();
                        navigator.push({
                            name: 'IndexPage',
                            component: IndexPage,
                            params: {}
                        })
                    }
                }},
            ]
        )
    }
    render() {
        return (
            <View style={styles.container}>
                <Head title="个人中心"/>
                <ScrollView key={'scrollView'}
                            horizontal={false}
                            style={{flex:1, backgroundColor:'#f7f7f7'}}>
                    <View style={styles.basicBox}>
                        <Image source={require('./image/Head_physician_128px.png')} style={styles.imageStyle}/>
                        <View style={styles.basicText}>
                            <Text style={{fontSize:18, fontWeight:'bold', color:'#fff'}}>李东海</Text>
                            <Text style={{marginTop:5, color:'#fff'}}>
                                <Icon name={'ios-phone-portrait'} size={14} color={'yellow'}/>
                                18307722403
                            </Text>
                        </View>
                    </View>
                    <View style={styles.fanBox}>
                        <View style={styles.fontViewStyle}>
                            <Text style={styles.fontStyle}>粉丝：{this.state.memberNumber}</Text>
                        </View>
                        <View
                            style={[styles.fontViewStyle,{borderLeftWidth:StyleSheet.hairlineWidth, borderLeftColor:'#ccc'}]}>
                            <Text style={styles.fontStyle}>关注：{this.state.memberNumber}</Text>
                        </View>
                    </View>
                    <View style={{backgroundColor:'#fff', marginTop:15, marginBottom:30}}>
                        <ComIconView text="我的信息" icon={'ios-contact'} color={'#00BBFF'}
                                     onPress={this._myInfo.bind(this)}/>
                        <ComIconView text="邀请朋友" icon={'md-contacts'} color={'#FF3333'}
                                     onPress={this._more.bind(this)}/>
                        <ComIconView text="我的问题" icon={'ios-help-circle'} color={'#BDB76B'}
                                     onPress={this._more.bind(this)}/>
                        <ComIconView text="我的收藏" icon={'ios-star'} color={'#FF6666'}
                                     onPress={this._more.bind(this)}/>
                        <ComIconView text="我的优惠券" icon={'ios-card'} color={'#9370DB'}
                                     onPress={this._more.bind(this)}/>
                        <ComIconView text="我的积分" icon={'ios-timer'} color={'#FF9900'}
                                     onPress={this._more.bind(this)}/>
                        <ComIconView text="设置" icon={'ios-settings'} color={'#BBBB00'}
                                     onPress={this._more.bind(this)}/>
                        <View style={{height:20}}></View>
                        <NButton onPress={this.Logout.bind(this)} backgroundColor={'#FF6666'} text="注 销"/>
                        <View style={{height:50}}></View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    //用了render方法后，组件加载成功并被成功渲染出来以后所执行的hook函数，一般会将网络请求等加载数据的操作，放在这个函数里进行，来保证不会出现UI上的错误
    componentDidMount() {

    }

    //指父元素对组件的props或state进行了修改
    componentWillReceiveProps() {
    }

    //一般用于优化，可以返回false或true来控制是否进行渲染
    //shouldComponentUpdate() {
        //return true;
    //}

    //组件刷新前调用，类似componentWillMount
    componentWillUpdate() {
    }

    //更新后的hook
    componentDidUpdate() {
    }

    componentWillMount() {
    }

    //销毁期，用于清理一些无用的内容，如：点击事件Listener
    componentWillUnmount() {
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    basicBox: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 100,
        backgroundColor: '#003333'
    },
    imageStyle: {
        height: 80,
        width: 80,
        borderRadius: 40,
        marginLeft: 20,
        borderWidth: 2,
        borderColor: '#fff',
    },
    basicText: {
        flexDirection: 'column',
        marginLeft: 20,
    },
    fanBox: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 35,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
        backgroundColor: '#fff',
    },
    fontViewStyle: {
        flex: 1,
        justifyContent: 'center',
    },
    fontStyle: {
        color: '#666',
        textAlign: 'center',
    },

});

module.exports = UC;