/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {Component} from 'react';
import{
    AppRegistry,
    StyleSheet,
    Text,
    ScrollView,
    Image,
    View,
} from 'react-native';
import Head from './app/commonview/Head';
import Icon from 'react-native-vector-icons/Ionicons';
import IconButton from './app/commonview/HomeIcon';
import Sale from './app/page/Sales/Sale';
import Member from './app/page/Member/MemberManage';
class HealthTools extends Component {
    constructor(props) {
        super(props);
        this.state = {
            memberName:'天津拓瑞宠物医院',
            memberAddress:'天津市滨海新区大同路120号',
            memberNumber:123,
            memberPetNumber:456
        }
    };
    _member() {
        const{navigator} = this.props;
        var _this=this;
        if(navigator){
            navigator.push({
                name:'member',
                component:Member,
                params:{
                    headTitle:'会员管理'
                }
            })
        }
    }

    _more() {
        alert('没有更多了')
    }
    _salesPress() {
        const { navigator } = this.props;
        var _this = this;
        if (navigator) {
            navigator.push({
                name: 'Sale',
                id: 'page',
                component: Sale,
                params: {
                    id: _this.state.id,
                }
            })
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <Head title="应用服务"/>
                <View style={{flex:1}}>
                    <View
                        style={{flexDirection:'row',borderBottomColor:'#666',borderBottomWidth:StyleSheet.hairlineWidth}}>
                        <Icon name={'ios-home-outline'} size={80} style={{marginTop:15,marginLeft:30}}/>
                        <View style={{flexDirection:'column',height:80,marginLeft:30,marginTop:30}}>
                            <Text style={{justifyContent:'center',height:40}}>{this.state.memberName}</Text>
                            <Text style={{justifyContent:'center'}}>{this.state.memberAddress}</Text>
                        </View>
                    </View>
                    <View
                        style={{flexDirection:'row',height:50,borderBottomColor: '#666', borderBottomWidth:StyleSheet.hairlineWidth,}}>
                        <View
                            style={{flex:1,borderRightColor: '#666', borderRightWidth: StyleSheet.hairlineWidth, justifyContent:'center'}}>
                            <Text style={{marginLeft:30,alignItems:'flex-start',}}>会员：{this.state.memberNumber}</Text>
                        </View>
                        <View style={{flex:1,justifyContent:'center'}}>
                            <Text style={{marginLeft:30,alignItems:'flex-start',}}>宠物：{this.state.memberPetNumber}</Text>
                        </View>
                    </View>
                </View>
                <View style={{flexDirection:'row',marginTop:20,borderTopColor:'#666',borderTopWidth:StyleSheet.hairlineWidth}}>
                    <IconButton text="我的会员" iconName={'md-people'} iconColor={'#66CCCC'}
                                onPress={this._member.bind(this)}/>
                    <IconButton text="宠物管理" iconName={'md-paw'} iconColor={'#CCFF66'}
                                onPress={this._more.bind(this)}/>
                    <IconButton text="我的疫苗" iconName={'logo-steam'} iconColor={'#FF99CC'}
                                onPress={this._more.bind(this)}/>
                </View>
                <View style={{flexDirection:'row',marginTop:20}}>
                    <IconButton text="驱虫疫苗" iconName={'ios-pulse'} iconColor={'#CCCC99'}
                                onPress={this._more.bind(this)}/>
                    <IconButton text="商品销售" iconName={'ios-cart'} iconColor={'#CC3399'}
                                onPress={this._salesPress.bind(this)}/>
                    <IconButton text="送检查询" iconName={'ios-search'} iconColor={'#99CC00'}
                                onPress={this._more.bind(this)}/>
                </View>
                <View style={{flexDirection:'row',marginTop:20}}>
                    <IconButton text="分析报表" iconName={'ios-podium'} iconColor={'#FF6666'}
                                onPress={this._more.bind(this)}/>
                    <IconButton text="美容服务" iconName={'ios-rose'} iconColor={'#FFFF00'}
                                onPress={this._more.bind(this)}/>
                    <IconButton text="more" iconName={'ios-more'} iconColor={'#3399CC'}
                                onPress={this._more.bind(this)}/>
                </View>
            </View>
            /*<ScrollView key={'scrollView'}
             //            horizontal={false}
             //            showsVerticalScrollIndicator={true}
             //            scrollEnabled={true}
             //            style={styles.contentContainer}>
             //    <View style={styles.view}>
             //        <Image source={require('./image/tool_lxtz.png')}
             //               style={styles.imageIcon}/>
             //        <View style={styles.view2}>
             //            <Text style={styles.t0}>理想体重计算器</Text>
             //            <Text style={styles.t1}>理想体重指的是体重数值在正常范围内，构成比例...</Text>
             //        </View>
             //        <Image source={require('./image/arrows_right.png')}
             //               style={styles.imageArr}/>
             //    </View>
             //    <View style={styles.view}>
             //        <Image source={require('./image/tool_bmi.png')}
             //               style={styles.imageIcon}/>
             //        <View style={styles.view2}>
             //            <Text style={styles.t0}>体重指数BMI</Text>
             //            <Text style={styles.t1}>想知道您的体重是否超标吗？体重指数(BMI)能反应...</Text>
             //        </View>
             //        <Image source={require('./image/arrows_right.png')}
             //               style={styles.imageArr}/>
             //    </View>
             //    <View style={styles.view}>
             //        <Image source={require('./image/tool_ytb.png')}
             //               style={styles.imageIcon}/>
             //        <View style={styles.view2}>
             //            <Text style={styles.t0}>腰臀比计算</Text>
             //            <Text style={styles.t1}>想知道您的体重是否超标吗？体重指数(BMI)能反应...</Text>
             //        </View>
             //        <Image source={require('./image/arrows_right.png')}
             //               style={styles.imageArr}/>
             //    </View>
             //    <View style={styles.view}>
             //        <Image source={require('./image/tool_nlxq.png')}
             //               style={styles.imageIcon}/>
             //        <View style={styles.view2}>
             //            <Text style={styles.t0}>每日能量需求</Text>
             //            <Text style={styles.t1}>想知道您一天究竟该摄入多少能量吗？根据您提供...</Text>
             //        </View>
             //        <Image source={require('./image/arrows_right.png')}
             //               style={styles.imageArr}/>
             //    </View>
             //    <View style={styles.view}>
             //        <Image source={require('./image/tool_yys.png')}
             //               style={styles.imageIcon}/>
             //        <View style={styles.view2}>
             //            <Text style={styles.t0}>营养素计算器</Text>
             //            <Text style={styles.t1}>每种食物均含有不同的营养素，想了解您摄入食物中...</Text>
             //        </View>
             //        <Image source={require('./image/arrows_right.png')}
             //               style={styles.imageArr}/>
             //    </View>
             //
             //    <View style={styles.view}>
             //        <Image source={require('./image/tool_j.png')} style={styles.imageIcon}/>
             //        <View style={styles.view2}>
             //            <Text style={styles.t0}>减掉一公斤</Text>
             //            <Text style={styles.t1}>不同的运动锻炼方法，能量消耗的数量和方式也不相... </Text>
             //        </View>
             //        <Image source={require('./image/arrows_right.png')} style={styles.imageArr}/>
             //    </View>
             //    <View style={styles.view}>
             //        <Image source={require('./image/tool_ydnh.png')} style={styles.imageIcon}/>
             //        <View style={styles.view2}>
             //            <Text style={styles.t0}>运动能耗计算</Text>
             //            <Text style={styles.t1}>用食物重量图谱可以帮助你... </Text>
             //        </View>
             //        <Image source={require('./image/arrows_right.png')} style={styles.imageArr}/>
             //    </View>
             //</ScrollView>*/

        )
    }
}

const styles = StyleSheet.create({
    container: {},
    contentContainer: {},
    view: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'stretch',
        height: 60,
        alignSelf: 'stretch',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
    },
    view2: {
        flex: 1,
        height: 50,
        padding: 5,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    imageIcon: {
        height: 50,
        width: 50,
        alignSelf: 'center',
        marginLeft: 20,
        marginRight: 20,
    },
    imageArr: {
        height: 30,
        width: 20,
        marginRight: 10,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    t0: {
        fontSize: 20,
    },
    t1: {
        fontSize: 10,
    },
    iconOuter: {
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 30,
        marginLeft: 30,
    },
});

module.exports = HealthTools;
