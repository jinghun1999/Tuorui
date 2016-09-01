import React, {Component} from 'react';
import{
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    View,
    TextInput,
    TouchableHighlight,
} from 'react-native';
import Modal from 'react-native-root-modal';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#fff',
        padding: 10,
        flex:1,
    },
    modal: {
        top: 300,
        right: 40,
        bottom: 350,
        left: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DCDCDC',
        overflow: 'hidden'
    },
    close: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        right: 15,
        top: 5,
        backgroundColor: '#ccc'
    },
    modalContainer: {
        height: 150,
        width: 300,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DCDCDC',
    },
    text: {
        color: 'black'
    }
});

class AlertInputForm extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            visible: false,
            textInput:'',
        };
    }

    showModal = () => {
        this.setState({
            visible: true
        });
    };
    hideAndSave=()=>{
        let _this= this;
        _this.setState({
            visible:false,
            textInput:_this.state.textInput,
        })
    }
    hideModal = () => {
        this.setState({
            visible: false
        });
    };

    render() {
        return <View style={styles.container}>
            <TouchableHighlight
                style={styles.button}
                underlayColor="#aaa"
                onPress={this.showModal}
            >
                <Text>{this.props.title}</Text>
            </TouchableHighlight>
            <Modal
                style={styles.modal}
                visible={this.state.visible}
            >
                <TouchableHighlight
                    style={ styles.close}
                    underlayColor="#666"
                    onPress={this.hideModal}
                >
                    <Text style={{color:'black'}}>x</Text>
                </TouchableHighlight>

                <View style={styles.modalContainer}>
                    <Text style={styles.text}>{this.props.name}</Text>
                    <View
                        style={{flexDirection:'row',margin:10,backgroundColor:'#fff',borderRadius:5,
                        height: 40,borderWidth:StyleSheet.hairlineWidth,borderColor:'#666',}}>
                        <TextInput placeholder={this.props.text}
                                   onChangeText={(text)=>{
                                        this.setState({
                                            textInput:text,
                                        })
                                   }}
                                   style={{height: 35,flex:1,}}
                                   underlineColorAndroid='transparent'
                        />
                    </View>
                    <View style={{flexDirection:'row',height:30,justifyContent:'flex-end',alignSelf:'flex-end'}}>
                        <TouchableOpacity onPress={this.hideModal}
                            style={{margin:5,width:40,borderRadius:5,backgroundColor:'#BEBEBE'}}>
                            <Text style={{color:'white',textAlign:'center'}}>取消</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.hideAndSave}
                            style={{margin:5,width:40,borderRadius:5,backgroundColor:'#1E90FF'}}>
                            <Text style={{color:'white',textAlign:'center'}}>确定</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>;
    }
}
module.exports = AlertInputForm;