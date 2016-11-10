/**
 * Created by User on 2016-09-07.
 */

'use strict';
import React, {Component} from 'react';
import{
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    ListView,
    TextInput,
    InteractionManager,
} from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import Loading from '../../commonview/Loading';
import { toastShort } from '../../util/ToastUtil';
import Icon from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-datepicker';
import AppStyle from '../../theme/appstyle';
import SideMenu from 'react-native-side-menu';
import SaleMenu from './SaleMenu';
import SearchTitle from '../../commonview/SearchTitle';
class GoodSales extends React.Component {
    constructor(props) {
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        super(props);
        this.state = {
            user: {},
            ds: ds,
            dataSource: [],
            loaded: false,
            dateFrom: Util.GetDateStr(-30),
            dateTo: Util.GetDateStr(0),
            kw: '',
            totalCount: 0,
            totalAmount: 0,
            selectedItem:'全部',
            isOpen:false,
        };
    }

    _onBack() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            this.fetchData();
        });
    }

    fetchData() {
        let _this = this;
        _this.setState({
            loaded: false,
        })
        NetUtil.getAuth(function (user, hos) {
            let header = NetUtil.headerClientAuth(user, hos);
            let querystr = 'startDate=' + _this.state.dateFrom + '&endDate=' + _this.state.dateTo + ' 23:59:59&itemName=' + _this.state.kw;
            NetUtil.get(CONSTAPI.HOST + '/Report/GetCountItemSellDataTable?' + querystr, header, function (data) {
                if (data.Sign && data.Message != null) {
                    let a1 = 0, a2 = 0, json = data.Message;
                    json.forEach((d)=> {
                        a1 += parseInt(d.总数量);
                        a2 += parseFloat(d.总金额);
                    });
                    _this.setState({
                        dataSource: json,
                        loaded: true,
                        totalCount: a1,
                        totalAmount: a2.toFixed(2),
                    });
                } else {
                    toastShort("获取数据失败：" + data.Message);
                    _this.setState({
                        loaded: true,
                    });
                }
            });
        }, function (err) {
            toastShort(err);
        });
    }

    _search() {
        this.fetchData();
    }

    _renderHead() {
        return (
            <View style={{backgroundColor:'#e7e7e7'}}>
                <View style={AppStyle.groupTitle}>
                    <Text style={AppStyle.groupText}>销售汇总</Text>
                </View>
                <View style={AppStyle.outerRow}>
                    <View style={AppStyle.sumRow}>
                        <Text style={AppStyle.sumValue}>{this.state.totalCount}</Text>
                        <Text style={AppStyle.sumTitle}>总数量</Text>
                    </View>
                    <View style={AppStyle.sumRow}>
                        <Text style={AppStyle.sumValue}><Text
                            style={AppStyle.moneyText}>¥</Text>{this.state.totalAmount}</Text>
                        <Text style={AppStyle.sumTitle}>总金额</Text>
                    </View>
                </View>
                <View style={AppStyle.groupTitle}>
                    <Text style={AppStyle.groupText}>销售记录</Text>
                </View>
            </View>
        );
    }

    _onRenderRow(obj) {
        return (
            <View style={AppStyle.listRow}>
                <View style={{flexDirection:'row'}}>
                    <Text style={AppStyle.itemName}>{obj.商品名}</Text>
                    <Text style={AppStyle.subName}>{obj.条码}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                    <Text>总数:{obj.总数量} {obj.单位}</Text>
                    <Text style={{marginLeft:8,}}>均价:¥{obj.平均售价}</Text>
                    <Text style={{marginLeft:8,}}>总价:¥{obj.总金额}</Text>
                </View>
            </View>
        );
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }

    updateMenuState(isOpen) {
        //修改值
        let _this = this;
        _this.setState({isOpen,});
    }


    render() {
        let body = <Loading type={'text'}/>;
        if (this.state.loaded) {
            body = <ListView dataSource={this.state.ds.cloneWithRows(this.state.dataSource)}
                              renderRow={this._onRenderRow.bind(this)}
                              renderHeader={this._renderHead.bind(this)}
                              initialListSize={15}
                              pageSize={15}
                              enableEmptySections={true}
                    />
        }
        const menu = <SaleMenu dateFrom={this.state.dateFrom} dateTo={this.state.dateTo} value={this.state.kw}
                               onItemSelected={(item)=>{
            if(item=='submit'){
                //完成
                this.setState({isOpen:false,selectedItem:'时间:'+this.state.dateFrom+'至'+this.state.dateTo})
                if(this.state.kw != null && this.state.kw != ''){
                    this.setState({selectedItem:this.state.selectedItem+' 关键字:'+this.state.kw})
                }
                this.fetchData();
            } if(item =='cancel'){
                //取消
                this.setState({isOpen:false})
            } if(item.indexOf('Form')>0){
                //日期
                 var dateFrom = item.split(':')[1];
                 this.setState({dateFrom:dateFrom,})
            } if(item.indexOf('To')>0){
                var dateTo = item.split(':')[1];
                this.setState({dateTo:dateTo})
            } if(item.indexOf('ey')>0){
                var key = item.split(':')[1];
                this.setState({kw:key,})
            }
        }}
        />
        return (
            <SideMenu menu={menu}
                      menuPosition={'right'}
                      disableGestures={true}
                      isOpen={this.state.isOpen}
                      onChange={(isOpen)=>this.updateMenuState(isOpen)}
            >
                <View style={AppStyle.container}>
                    <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                    <SearchTitle onPress={()=>this.toggle()} selectedItem={this.state.selectedItem}/>
                    {body}
                </View>
            </SideMenu>
        )
    }
}

const styles = StyleSheet.create({});

module.exports = GoodSales;