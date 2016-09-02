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
    } from 'react-native';
import Head from './app/commonview/Head';
import IconButton from './app/commonview/HomeIcon';
import Sale from './app/page/Sales/Sale';
import Info from './app/page/MemberInfo/MemberListInfo';
import PetListInfo from './app/page/MemberInfo/PetListInfo';
import Loading from './app/commonview/Loading';

import Icon from 'react-native-vector-icons/Ionicons';
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
            hospitals: [],
            hospital: {},
            user: null,
            userloaded: false,
            hosloaded: false,
            memberName: '天津拓瑞宠物医院',
            memberAddress: '天津市滨海新区大同路120号',
            memberNumber: '*',
            memberPetNumber: '*'
        }
    }

    componentDidMount() {
        let _this = this;
        _this.timer = setTimeout(
            () => {
                _this._loadData();
            }, 1
        );
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    _loadData() {
        /*从缓存中读取*/
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
            alert('您还没有选择默认医院' + err);
        });
    }

    _memberInfo() {
        var _this = this;
        const {navigator} = _this.props;
        if (navigator) {
            navigator.push({
                name: 'MemberPetClass',
                component: Info,
                params: {
                    headTitle: '会员信息',
                    id: 1,
                }
            })
        }
    }

    _Pet() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'MemberPetClass',
                component: Info,
                params: {
                    headTitle: '宠物信息',
                    id: 2,
                }
            })
        }
    }

    _more() {
        alertt('没有更多了')
    }

    _salesPress() {
        const { navigator } = this.props;
        var _this = this;
        if (navigator) {
            navigator.push({
                id: 'page',
                name: 'Sale',
                component: Sale,
                params: {
                    id: _this.state.id,
                }
            })
        }
    }

    _onVaccineInfo() {
        let _this = this;
        const {navigator} = _this.props;
        if (navigator) {
            navigator.push({
                name: 'PetListInfo',
                component: PetListInfo,
                params: {
                    headTitle: '疫苗接种',
                }
            })
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
            },
            expires: 1000 * 3600 * 24
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
        if(!this.state.userloaded || !this.state.hosloaded){
            body = (<Loading />);
        }
        else if (this.state.hospital.ID != null && this.state.hospital.ID != '') {
            body = (
                <View>
                    <View style={{flex:1}}>
                        <View style={[styles.homeStyle,{height:80, }]}>
                            <Image style={styles.IconStyle}
                                   source={{uri:'http://www.easyicon.net/api/resizeApi.php?id=1173423&size=96'}}/>
                            <View style={styles.titleViewStyle}>
                                <Text style={styles.titleTextStyle}>{this.state.hospital.FULLName}</Text>
                                <Text>地址：{this.state.hospital.Address}</Text>
                                <TouchableOpacity onPress={this.clearHospital.bind(this)}
                                                  style={{position: 'absolute', top: 20, right:-36, borderWidth:1, borderColor:'#ccc', padding:2,}}>
                                    <Text>修改</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                        <View style={styles.homeStyle}>
                            <View style={styles.fontViewStyle}>
                                <Icon name={'ios-people'} color={'#00BBFF'} size={30}/>
                                <Text style={styles.fontStyle}>会员：{this.state.memberNumber}</Text>
                            </View>
                            <View style={[styles.fontViewStyle,{borderLeftWidth:0}]}>
                                <Icon name={'ios-paw'} color={'#EE9A00'} size={30}/>
                                <Text style={styles.fontStyle}>宠物：{this.state.memberPetNumber}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.iconViewStyle}>
                        <IconButton text="会员宠物" iconName={'md-people'} iconColor={'#FFB6C1'}
                                    onPress={this._memberInfo.bind(this)}/>
                        <IconButton text="疫苗接种" iconName={'ios-medkit'} iconColor={'#6666CC'}
                                    onPress={this._onVaccineInfo.bind(this)}/>
                        <IconButton text="美容服务" iconName={'ios-color-palette'} iconColor={'#66CCFF'}
                                    onPress={this._more.bind(this)}/>
                    </View>
                    <View style={styles.iconViewStyle}>
                        <IconButton text="我的预约" iconName={'ios-clock'} iconColor={'#9999CC'}
                                    onPress={this._more.bind(this)}/>
                        <IconButton text="商品销售" iconName={'ios-cart'} iconColor={'#DEB887'}
                                    onPress={this._salesPress.bind(this)}/>
                        <IconButton text="拓瑞检测" iconName={'ios-paper'} iconColor={'#666699'}
                                    onPress={this._more.bind(this)}/>
                    </View>
                    <View style={styles.iconViewStyle}>
                        <IconButton text="数据报表" iconName={'ios-podium'} iconColor={'#6666FF'}
                                    onPress={this._more.bind(this)}/>
                        <IconButton text="more" iconName={'ios-more'} iconColor={'#FF9999'}
                                    onPress={this._more.bind(this)}/>
                        <View style={{flex:1}}></View>
                    </View>
                </View>);
        } else {
            body = (
                <View style={{flexDirection:'column', margin:15,}}>
                    <View style={{height:30, justifyContent:'center'}}>
                        <Text>您当前还没有默认医院，请先选择默认医院</Text>
                    </View>
                    {this.state.hospitals.length>0?null:noTips}
                    <ListView dataSource={this.state.listSource.cloneWithRows(this.state.hospitals)}
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
        fontSize: 20,
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
        marginTop: 20,
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
