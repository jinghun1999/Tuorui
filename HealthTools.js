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
import memberPet from './app/page/Member/MemberPetClass';
var deviceWidth = Dimensions.get('window').width;
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
                name:'memberPet',
                component:memberPet,
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
                name:'memberPet',
                component:memberPet,
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
                <View style={{flex:1}}>
                    <View style={styles.homeStyle}>
                        <Icon name={'ios-home-outline'} size={80} style={{marginTop:5,marginLeft:30,color:'#802A2A'}}/>
                        <View style={{flexDirection:'column',height:60,marginLeft:30,marginTop:20}}>
                            <Text >{this.state.memberName}</Text>
                            <Text style={{marginTop:10}}>{this.state.memberAddress}</Text>
                        </View>
                    </View>
                    <View style={styles.homeStyle}>
                        <View style={styles.fontViewStyle}>
                            <Text style={styles.fontStyle}>会员：{this.state.memberNumber}</Text>
                        </View>
                        <View style={styles.fontViewStyle}>
                            <Text style={styles.fontStyle}>宠物：{this.state.memberPetNumber}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.iconViewStyle}>
                    <IconButton text="我的会员" iconName={'md-people'} iconColor={'#669999'}
                                onPress={this._member.bind(this)}/>
                    <IconButton text="宠物管理" iconName={'md-paw'} iconColor={'#7FFFD4'}
                                onPress={this._Pet.bind(this)}/>
                    <IconButton text="我的疫苗" iconName={'logo-steam'} iconColor={'#6666CC'}
                                onPress={this._more.bind(this)}/>
                </View>
                <View style={{flexDirection:'row',marginTop:20}}>
                    <IconButton text="驱虫疫苗" iconName={'ios-pulse'} iconColor={'#9999CC'}
                                onPress={this._more.bind(this)}/>
                    <IconButton text="商品销售" iconName={'ios-cart'} iconColor={'#FF9999'}
                                onPress={this._salesPress.bind(this)}/>
                    <IconButton text="送检查询" iconName={'ios-search'} iconColor={'#666699'}
                                onPress={this._more.bind(this)}/>
                </View>
                <View style={{flexDirection:'row',marginTop:20}}>
                    <IconButton text="分析报表" iconName={'ios-podium'} iconColor={'#6666FF'}
                                onPress={this._more.bind(this)}/>
                    <IconButton text="美容服务" iconName={'ios-rose'} iconColor={'#66CCFF'}
                                onPress={this._more.bind(this)}/>
                    <IconButton text="more" iconName={'ios-more'} iconColor={'#CCFF66'}
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
        flexDirection:'row',
        borderBottomColor:'#666',
        borderBottomWidth:StyleSheet.hairlineWidth,
    },
    iconViewStyle:{
        flexDirection:'row',
        marginTop:20,
        borderTopColor:'#666',
        borderTopWidth:StyleSheet.hairlineWidth,
    },
    fontStyle:{
        marginLeft:30,
        alignItems:'flex-start',
    },
    fontViewStyle:{
        flex:1,
        height:50,
        borderRightColor: '#666',
        borderRightWidth: StyleSheet.hairlineWidth,
        justifyContent:'center',
    },
    memberFont:{
        fontSize:16,
        marginLeft:30,
        width:deviceWidth/2,
    },

});

module.exports = HealthTools;
