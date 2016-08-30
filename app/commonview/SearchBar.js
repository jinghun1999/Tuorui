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
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.buttonStyle} onPress={this.props.onBack}>
                <Icon name={'ios-arrow-back'} size={25} color={'#666'}/>
                </TouchableOpacity>
                <View style={styles.searchStyle}>
                    <View style={styles.iconStyle}>
                        <Icon name={'ios-search'} size={20} color={'#666'} />
                    </View>
                    <TextInput value={this.props.value}
                               onChangeText={this.props.onChangeText}
                               keyboardType={this.props.keyboardType}
                               placeholder={this.props.value}
                               underlineColorAndroid={'transparent'}
                               style={{flex:1, height:30}}/>
                </View>
                <TouchableOpacity style={styles.buttonStyle} onPress={this.props.onPress}>
                    <Text>搜索</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 40,
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingBottom:5,
        borderBottomColor: '#ccc'
    },
    searchStyle: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 5,
        borderColor: '#666',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 10,
    },
    buttonStyle: {
        height: 40,
        width: 50,
        marginTop:5,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',

    },
    iconStyle: {
        height: 40,
        width: 25,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },

})
module.exports = SearchBar;