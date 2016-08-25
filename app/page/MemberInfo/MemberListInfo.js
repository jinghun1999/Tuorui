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
    Dimensions,
} from 'react-native';
import Head from '../../commonview/Head';
import AddMemberInfo from './AddMemberInfo';
class MemberListInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    };
    _onBack() {
        let _this=this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.pop();
        }
    }
    _addInfo(){
        let _this=this;
        const {navigator}=_this.props;
        if(navigator){
            navigator.push({
                name:'AddMemberInfo',
                component:AddMemberInfo,
                params:{
                    headTitle:'新增会员'
                }
            })
        }
    }
    render() {
        return (
            <View Style={styles.container}>
                <Head title="会员列表" canAdd={true} canBack={true} onPress={this._onBack.bind(this)} addInfo={this._addInfo.bind(this)} />
            </View>
        )

    }
}
const styles=StyleSheet.create({
    container:{

    },
});
module.exports = MemberListInfo;