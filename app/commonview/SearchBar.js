/**
 * Created by tuorui on 2016/8/19.
 */
'use strict';
import React, {Component} from 'react';
import{
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let back = null;
        let canBack = this.props.canBack || this.props.canBack == undefined;
        if (canBack) {
            back = (
                <TouchableOpacity style={styles.buttonStyle} onPress={this.props.onBack}>
                    <Icon name={'ios-arrow-back'} size={25} color={'#666'}/>
                </TouchableOpacity>
            )
        }
        return (
            <View style={styles.container}>
                {back}
                <View style={styles.inputContainer}>
                    <View style={styles.iconStyle}>
                        <Icon name={'ios-search'} size={30} color={'#666'}/>
                    </View>
                    <TextInput value={this.props.value}
                               onChangeText={this.props.onChangeText}
                               keyboardType={this.props.keyboardType}
                               placeholder={this.props.placeholder}
                               underlineColorAndroid={'transparent'}
                               autoFocus={false}
                               maxLength={20}
                               style={{flex:1}}/>
                </View>
                <TouchableOpacity style={styles.buttonStyle} onPress={this.props.onPress}>
                    <Text style={{fontSize:16}}>搜索</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingBottom: 5,
        paddingTop: 5,
        borderBottomColor: '#ccc'
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        borderColor: '#666',
        justifyContent: 'center',
        backgroundColor:'#fff',
        height: 40,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 4,
        marginLeft: 5,
        marginRight: 5,
    },
    buttonStyle: {
        height: 45,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',

    },
    iconStyle: {
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },

})
module.exports = SearchBar;