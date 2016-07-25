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
    View,
    TouchableHighlight
    } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
class Head extends Component {
    constructor(props) {
        super(props);
        this.state = {
            canBack: false,
        };
    }

    render() {
        if (this.props.canBack) {
            return (
                <View style={styles.container}>
                    <TouchableHighlight underlayColor='#52b0ff' style={styles.backBtn} onPress={this.props.onPress}>
                        <Icon name={'angle-left'} size={40} color={'white'}/>
                    </TouchableHighlight>

                    <View style={styles.titleBox}>
                        <Text style={{fontSize: 20, color:'#fff'}}>
                            {this.props.title}
                        </Text>
                    </View>
                    <View style={styles.backBtn}>

                    </View>
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <View style={styles.titleBox}>
                    <Text style={{fontSize: 20, color:'#fff'}}>
                        {this.props.title}
                    </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'stretch',
        height: 50,
        alignSelf: 'stretch',
        backgroundColor: '#63B8FF',
        justifyContent: 'center',
    },
    backBtn: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleBox: {
        flex: 1,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

module.exports = Head;
