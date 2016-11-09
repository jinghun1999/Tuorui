/**
 * Created by tuorui on 2016/11/9.
 */
/**
 * Created by tuorui on 2016/11/8.
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
import DatePicker from 'react-native-datepicker';
import Util from '../../util/Util';
import SideMenuStyle from '../../theme/sidemenustyle';
class AppointMenu extends React.Component {
    static propTypes = {
        onItemSelected: React.PropTypes.func.isRequired,
    };

    render() {
        return (
            <View style={SideMenuStyle.menu}>
                <View style={SideMenuStyle.searchView}>
                    <Text style={SideMenuStyle.item}>时间</Text>
                    <View style={SideMenuStyle.datePickerView}>
                        <DatePicker
                            date={this.props.dateFrom}
                            mode="date"
                            placeholder="选择日期"
                            format="YYYY-MM-DD"
                            minDate="2015-01-01"
                            maxDate="2020-01-01"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            showIcon={false}
                            style={SideMenuStyle.datePic}
                            customStyles={{dateInput: {height:30,borderWidth:StyleSheet.hairlineWidth,},}}
                            onDateChange={(date) => {this.props.onItemSelected("dateForm:"+date)}}/>
                        <Text style={SideMenuStyle.text}> - </Text>
                        <DatePicker
                            date={this.props.dateTo}
                            mode="date"
                            placeholder="选择日期"
                            format="YYYY-MM-DD"
                            minDate="2010-01-01"
                            maxDate="2020-01-01"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            showIcon={false}
                            style={SideMenuStyle.datePic}
                            customStyles={{dateInput: {height:30,borderWidth:StyleSheet.hairlineWidth,}}}
                            onDateChange={(date) => {this.props.onItemSelected("dateTo:"+date)}}
                        />
                    </View>
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
module.exports = AppointMenu;