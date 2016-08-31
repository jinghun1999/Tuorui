/**
 * Created by tuorui on 2016/8/25.
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
    ListView,
    TouchableOpacity,
} from 'react-native';
import Head from '../../commonview/Head';
import AddMemberInfo from './AddMemberInfo';
import MyHomeIcon from '../../commonview/ComIconView';
import MemberDetails from './MemberDetails';
import Icon from 'react-native-vector-icons/Ionicons';
class MemberListInfo extends Component {
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var data = {
            'data': [{'id': 1, 'name': '张三', 'phone': '13838383338', 'memberLevel': '白金会员'},
                {'id': 2, 'name': '李四', 'phone': '14141414441', 'memberLevel': '普通会员'},
                {'id': 3, 'name': '王五', 'phone': '16866888886', 'memberLevel': '铂金会员'},
            ]
        };
        this.state = {
            dataSource: ds.cloneWithRows(data.data),
            memberInfo: {},
        }
    };

    componentWillMount() {
    }

    _onBack() {
        let _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    _addInfo() {
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.push({
                name: 'AddMemberInfo',
                component: AddMemberInfo,
                params: {
                    headTitle: '新增会员'
                }
            })
        }
    }

    _memberShipDetails(g) {
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.push({
                name: 'MemberDetails',
                component: MemberDetails,
                params: {
                    headTitle: '会员详情',
                    memberInfo: _this.state.memberInfo,
                    name: g.name,
                    phone: g.phone,
                    level: g.memberLevel,
                }
            })
        }
    }

    _onRenderRow(g) {
        return (
            <TouchableOpacity style={styles.touchStyle} onPress={()=>this._memberShipDetails(g)}>
                <Icon name={'ios-person'} size={30} color={'#00BBFF'}/>
                <View style={{flex:1,marginLeft:10,}}>
                    <Text>{g.name}</Text>
                    <View style={{flex:1,flexDirection:'row',marginTop:5,}}>
                        <Text>手机: {g.phone}</Text>
                        <Text style={{marginLeft:50}}>等级: {g.memberLevel}</Text>
                    </View>
                </View>
                <Icon name={'ios-arrow-forward'} size={15} color={'#666'}/>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View Style={styles.container}>
                <Head title={this.props.headTitle} canAdd={true} canBack={true} edit="新增" onPress={this._onBack.bind(this)}
                      editInfo={this._addInfo.bind(this)}/>
                <ListView dataSource={this.state.dataSource}
                          renderRow={this._onRenderRow.bind(this)}/>
            </View>
        )

    }
}
const styles = StyleSheet.create({
    container: {},
    touchStyle: {
        flex: 1,
        flexDirection: 'row',
        height: 50,
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        margin: 10,
    },
});
module.exports = MemberListInfo;