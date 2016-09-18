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
    TouchableOpacity,
    ListView,
    InteractionManager,
    } from 'react-native';
import Head from './app/commonview/Head';
import IconButton from './app/commonview/HomeIcon';

import SaleList from './app/page/Sales/SaleList';
import MemberListInfo from './app/page/Member/MemberListInfo';
import MyInspect from './app/page/Inspect/MyInspect';
import PetListInfo from './app/page/Vaccine/VaccineListInfo';
import Loading from './app/commonview/Loading';
import AppointListInfo from './app/page/Appoint/AppointListInfo';
import BeautyServices from './app/page/Beauty/BeautyListInfo';
import ReportIndex from './app/page/Report/ReportIndex';
import NJY from './app/page/Device/NJY';

import Immutable from 'immutable';
import Icon from 'react-native-vector-icons/Ionicons';
var {List, Map}= Immutable;
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ds: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
            hospitals: [],
            hospital: {},
            user: null,
            userloaded: false,
            hosloaded: false,
        }
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            this._loadData();
        });
    }

    componentWillUnmount() {

    }

    _loadData() {
        var _this = this;
        storage.load({key: 'USER', autoSync: false, syncInBackground: false}).then(ret => {
            _this.setState({
                user: ret.user,
                infoLoaded: true,
                isRefreshing: false,
                userloaded: true,
                hospitals: ret.user.Hospitals,
            });
        }).catch(err => {
            _this.setState({userloaded: true,});
            alert('请登录' + err);
        });
        storage.load({key: 'HOSPITAL', autoSync: false, syncInBackground: false}).then(ret => {
            _this.setState({
                hospital: ret.hospital,
                hosloaded: true,
            });
        }).catch(err => {
            _this.setState({hosloaded: true,});
            alert('您还没有选择默认医院' + err.message);
        });
    }

    _onPress(com, name, title) {
        var _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.push({
                name: name,
                component: com,
                params: {
                    headTitle: title
                }
            });
        }
    }

    setHospital(hos) {
        this.setState({
            hospital: hos,
        });
        storage.save({
            key: 'HOSPITAL',
            rawData: {
                hospital: hos,
            }
        });
    }

    clearHospital() {
        this.setState({
            hospital: {},
        });
        storage.remove({
            key: 'HOSPITAL',
        });
    }

    //shouldComponentUpdate(nextProps, nextState){
    //return nextProps.value !== this.props.value;
    //}
    _renderHos(hos) {
        return (
            <TouchableOpacity style={styles.rows} onPress={()=>this.setHospital(hos)}>
                {/*<Ionicons name={'local-post-office'} size={20} color={'#ADD8E6'} style={styles.icon}/>*/}
                <Text style={styles.rowTitle}>{hos.FULLName}</Text>
                <Text>{hos.Address}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        let body;
        let noTips = (
            <View style={styles.rows}>
                <Text style={styles.rowTitle}>您的手机还未绑定任何医院！</Text>
            </View>
        );
        if (!this.state.userloaded || !this.state.hosloaded) {
            body = (<Loading type={'text'}/>);
        }
        else if (this.state.hospital.ID != null && this.state.hospital.ID != '') {
            body = (
                <View>
                    <View style={{flex:1, borderBottomWidth:StyleSheet.hairlineWidth, borderBottomColor:'#ccc'}}>
                        <View style={[styles.homeStyle,{height:80, }]}>
                            <Image style={styles.IconStyle}
                                   source={{uri:'http://www.easyicon.net/api/resizeApi.php?id=1173423&size=96'}}/>
                            <TouchableOpacity onPress={this.clearHospital.bind(this)} style={styles.titleViewStyle}>
                                <Text style={styles.titleTextStyle}>{this.state.hospital.FULLName}</Text>
                                <Text>地址：{this.state.hospital.Address}</Text>
                            </TouchableOpacity>
                        </View>
                        {/*<View style={styles.homeStyle}>
                         <View style={styles.fontViewStyle}>
                         <Icon name={'ios-people'} color={'#00BBFF'} size={30}/>
                         <Text style={styles.fontStyle}>会员：{this.state.memberNumber}</Text>
                         </View>
                         <View style={[styles.fontViewStyle,{borderLeftWidth:0}]}>
                         <Icon name={'ios-paw'} color={'#EE9A00'} size={30}/>
                         <Text style={styles.fontStyle}>宠物：{this.state.memberPetNumber}</Text>
                         </View>
                         </View>*/}
                    </View>
                    <View style={styles.iconViewStyle}>
                        <TouchableOpacity style={styles.grid_view}
                                          onPress={this._onPress.bind(this, MemberListInfo, 'MemberListInfo', '会员信息')}>
                            <View style={styles.iconOuter}>
                                <Icon name={'md-people'} size={40} color={'#FF6600'}/>
                                <Text style={{fontSize:15}}>会员宠物</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.grid_view}
                                          onPress={this._onPress.bind(this, PetListInfo, 'PetListInfo', '疫苗接种')}>
                            <View style={styles.iconOuter}>
                                <Icon name={'ios-medkit'} size={40} color={'#FF9933'}/>
                                <Text style={{fontSize:15}}>疫苗接种</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.grid_view}
                                          onPress={this._onPress.bind(this, BeautyServices, 'BeautyServices', '美容服务')}>
                            <View style={styles.iconOuter}>
                                <Icon name={'ios-color-palette'} size={40} color={'#FF6666'}/>
                                <Text style={{fontSize:15}}>美容服务</Text>
                            </View>
                        </TouchableOpacity>
                        {/*<IconButton text="会员宠物" iconName={'md-people'} iconColor={'#FFB6C1'}
                         onPress={this._onPress.bind(this, MemberListInfo, 'MemberListInfo', '会员信息')}/>
                         <IconButton text="疫苗接种" iconName={'ios-medkit'} iconColor={'#6666CC'}
                         onPress={this._onPress.bind(this, PetListInfo, 'PetListInfo', '疫苗接种')}/>
                         <IconButton text="美容服务" iconName={'ios-color-palette'} iconColor={'#66CCFF'}
                         onPress={this._onPress.bind(this, BeautyServices, 'BeautyServices', '美容服务')}/>*/}
                    </View>
                    <View style={styles.iconViewStyle}>
                        <TouchableOpacity style={styles.grid_view}
                                          onPress={this._onPress.bind(this, AppointListInfo, 'AppointListInfo', '我的预约')}>
                            <View style={styles.iconOuter}>
                                <Icon name={'ios-clock'} size={40} color={'#0066CC'}/>
                                <Text style={{fontSize:15}}>我的预约</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.grid_view}
                                          onPress={this._onPress.bind(this, SaleList, 'SaleList', '商品销售')}>
                            <View style={styles.iconOuter}>
                                <Icon name={'ios-cart'} size={40} color={'#CCCC00'}/>
                                <Text style={{fontSize:15}}>商品销售</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.grid_view}
                                          onPress={this._onPress.bind(this, MyInspect, 'MyInspect', '拓瑞检测')}>
                            <View style={styles.iconOuter}>
                                <Icon name={'ios-paper'} size={40} color={'#FF6666'}/>
                                <Text style={{fontSize:15}}>拓瑞检测</Text>
                            </View>
                        </TouchableOpacity>{/*
                     <IconButton text="我的预约" iconName={'ios-clock'} iconColor={'#9999CC'}
                     onPress={this._onPress.bind(this, AppointListInfo, 'AppointListInfo', '我的预约')}/>
                     <IconButton text="商品销售" iconName={'ios-cart'} iconColor={'#DEB887'}
                     onPress={this._onPress.bind(this, SaleList, 'SaleList', '商品销售')}/>
                     <IconButton text="拓瑞检测" iconName={'ios-paper'} iconColor={'#666699'}
                     onPress={this._onPress.bind(this, MyInspect, 'MyInspect', '拓瑞检测')}/>*/}
                    </View>
                    <View style={styles.iconViewStyle}>
                        <TouchableOpacity style={styles.grid_view}
                                          onPress={this._onPress.bind(this, NJY, 'NJY', '尿检结果')}>
                            <View style={styles.iconOuter}>
                                <Icon name={'md-phone-landscape'} size={40} color={'#FF9900'}/>
                                <Text style={{fontSize:15}}>尿检结果</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.grid_view, {borderRightWidth:StyleSheet.hairlineWidth, borderRightColor:'#ccc'}]}
                                          onPress={this._onPress.bind(this, ReportIndex, 'ReportIndex', '数据报表')}>
                            <View style={styles.iconOuter}>
                                <Icon name={'ios-podium'} size={40} color={'#99CCFF'}/>
                                <Text style={{fontSize:15}}>数据报表</Text>
                            </View>
                        </TouchableOpacity>
                        {/*<IconButton text="我的设备" iconName={'md-phone-landscape'} iconColor={'#336666'}
                         onPress={this._onPress.bind(this, NJY, 'NJY', '尿检结果')}/>
                         <IconButton text="数据报表" iconName={'ios-podium'} iconColor={'#6666FF'}
                         onPress={this._onPress.bind(this, ReportIndex, 'ReportIndex', '数据报表')}/>*/}
                        <View style={{flex:1}}></View>
                    </View>

                </View>);
        } else {
            body = (
                <View style={{flexDirection:'column', margin:15,}}>
                    <View style={{height:30, justifyContent:'center'}}>
                        <Text>您当前还没有默认医院，请先选择默认医院</Text>
                    </View>
                    {this.state.hospitals.length > 0 ? null : noTips}
                    <ListView dataSource={this.state.ds.cloneWithRows(this.state.hospitals)}
                              renderRow={this._renderHos.bind(this)}
                              initialListSize={15}
                              pageSize={10}
                              enableEmptySections={true}
                        />
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <Head title="应用服务"/>
                <ScrollView key={'scrollView'} horizontal={false}
                            showsVerticalScrollIndicator={true}
                            scrollEnabled={true}
                            style={styles.contentContainer}>
                    {body}
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {},
    contentContainer: {},
    homeStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    grid_view: {
        flex: 1,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
        borderLeftWidth: StyleSheet.hairlineWidth,
        borderLeftColor: '#ccc',
        //borderRightWidth: StyleSheet.hairlineWidth,
        //borderRightColor: '#ccc',
    },
    iconOuter: {
        flex: 1,
        paddingTop: 30,
        paddingBottom: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    IconStyle: {
        height: 60,
        width: 60,
        marginLeft: 20,
        marginRight: 10,
        alignSelf: 'center',
    },
    titleViewStyle: {
        height: 60,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    titleTextStyle: {
        fontSize: 15,
        color: '#003366',
    },
    fontViewStyle: {
        flex: 1,
        flexDirection: 'row',
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
    },
    fontStyle: {
        fontSize: 16,
        marginLeft: 5,
    },
    iconViewStyle: {
        flexDirection: 'row',
    },
    rows: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 5,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#FFFFCC'
    },
    rowTitle: {
        color: '#663300',
        fontSize: 18
    }
});

module.exports = App;
