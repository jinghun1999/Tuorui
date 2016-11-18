/**
 * Created by tuorui on 2016/11/16.
 */
import React, { Component } from 'react';
import {
    Dimensions,
    StyleSheet,
    ScrollView,
    View,
    Image,
    Text,
    TouchableOpacity,
    TextInput,
}from 'react-native';
const window = Dimensions.get('window');
import Util from '../../util/Util';
import SideMenuStyle from '../../theme/sidemenustyle';
class FeesMenu extends React.Component {
    static propTypes = {
        onItemSelected: React.PropTypes.func.isRequired,
    };

    render() {
        return (
            <View style={SideMenuStyle.menu}>
                <View style={SideMenuStyle.searchView}>
                    <Text style={SideMenuStyle.item}>关键字搜索</Text>
                    <TextInput value={this.props.value}
                               placeholder={'会员编号/姓名/电话'}
                               editable={true}
                               underlineColorAndroid={'transparent'}
                               keyboardType={'default'}
                               style={SideMenuStyle.searchKey}
                               onChangeText={(text)=>{this.props.value = text; this.props.onItemSelected('key:'+text)}}
                    />
                </View>
                <View style={SideMenuStyle.bottomContainer}>
                    <View style={[SideMenuStyle.buttonView,{backgroundColor:'#F75000'}]}>
                        <Text onPress={() => {this.props.onItemSelected('submit')}}
                              style={SideMenuStyle.buttonText}>
                            完成</Text>
                    </View>
                    <View style={[SideMenuStyle.buttonView,{backgroundColor:'#d0d0d0'}]}>
                        <Text onPress={() => {this.props.onItemSelected('cancel')}}
                              style={SideMenuStyle.buttonText}>
                            取消</Text>
                    </View>
                </View>
            </View>
        );
    }
}
;
const styles = StyleSheet.create({})
module.exports = FeesMenu;