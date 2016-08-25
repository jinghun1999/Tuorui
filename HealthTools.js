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
    Dimensions,
} from 'react-native';
import Head from './app/commonview/Head';
import Icon from 'react-native-vector-icons/Ionicons';
import IconButton from './app/commonview/HomeIcon';
import Sale from './app/page/Sales/Sale';
//import MemberPet from './app/page/MemberInfo/MemberPetClass';
import Info from './app/page/MemberInfo/MemberPetClass';
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
    _memberInfo() {
        var _this=this;
        const{navigator} = _this.props;
        if(navigator){
            navigator.push({
                name:'MemberPetClass',
                component:Info,
                params:{
                    headTitle:'会员信息列表',
                    id:1,
                }
            })
        }
    }
    _Pet() {
        const{navigator} = this.props;
        var _this=this;
        if(navigator){
            navigator.push({
                name:'MemberPetClass',
                component:Info,
                params:{
                    headTitle:'宠物信息列表',
                    id:2,
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
                <View style={{flex:1,height:120,}}>
                    <View style={styles.homeStyle}>
                        <View  style={styles.IconStyle}>
                        <Icon name={'logo-octocat'} size={60} color={'#CD7054'}/>
                            </View>
                        <View style={styles.titleViewStyle}>
                            <Text style={styles.titleTextStyle}>{this.state.memberName}</Text>
                            <Text style={styles.titleTextStyle}>{this.state.memberAddress}</Text>
                        </View>
                    </View>
                    <View style={styles.homeStyle}>
                        <View style={styles.fontViewStyle}>
                            <Icon name = {'ios-people'} color={'#00BBFF'} size={30} />
                            <Text style={styles.fontStyle}>会员：{this.state.memberNumber}</Text>
                        </View>
                        <View style={styles.fontViewStyle}>
                            <Icon name = {'ios-paw'} color={'#EE9A00'} size={30} />
                            <Text style={styles.fontStyle}>宠物：{this.state.memberPetNumber}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.iconViewStyle}>
                    <IconButton text="我的会员" iconName={'md-people'} iconColor={'#FFB6C1'}
                                onPress={this._memberInfo.bind(this)}/>
                    <IconButton text="宠物管理" iconName={'md-paw'} iconColor={'#5CACEE'}
                                onPress={this._Pet.bind(this)}/>
                    <IconButton text="我的疫苗" iconName={'logo-steam'} iconColor={'#6666CC'}
                                onPress={this._more.bind(this)}/>
                </View>
                <View style={styles.iconViewStyle}>
                    <IconButton text="驱虫疫苗" iconName={'ios-pulse'} iconColor={'#9999CC'}
                                onPress={this._more.bind(this)}/>
                    <IconButton text="商品销售" iconName={'ios-cart'} iconColor={'#DEB887'}
                                onPress={this._salesPress.bind(this)}/>
                    <IconButton text="送检查询" iconName={'ios-search'} iconColor={'#666699'}
                                onPress={this._more.bind(this)}/>
                </View>
                <View style={styles.iconViewStyle}>
                    <IconButton text="分析报表" iconName={'ios-podium'} iconColor={'#6666FF'}
                                onPress={this._more.bind(this)}/>
                    <IconButton text="美容服务" iconName={'ios-rose'} iconColor={'#66CCFF'}
                                onPress={this._more.bind(this)}/>
                    <IconButton text="more" iconName={'ios-more'} iconColor={'#FF9999'}
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
    container: {

    },
    homeStyle:{
        height:80,
        flexDirection:'row',
    },
    titleViewStyle:{
        flex:1,
        height:50,
        marginTop:10,
        flexDirection:'column',
        justifyContent:'center',
    },
    titleTextStyle:{
        margin:10,
    },
    IconStyle:{
        height:50,
        width:120,
        alignSelf:'center',
        alignItems:'center',
        justifyContent:'center',
    },
    fontViewStyle:{
        flex:1,
        height:40,
        flexDirection:'row',
        borderColor:'#666',
        alignItems:'center',
        justifyContent:'center',
        borderWidth:StyleSheet.hairlineWidth,
    },
    fontStyle:{
        fontSize:16,
        marginLeft:5,
    },
    iconViewStyle:{
        marginTop:20,
        flexDirection:'row',
    },
});

module.exports = HealthTools;
