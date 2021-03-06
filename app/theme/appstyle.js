/**
 * Created by User on 2016-09-24.
 */
import { StyleSheet, } from 'react-native';
import theme from './theme';
let AppStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e7e7e7',
    },
    groupTitle: {
        flexDirection: 'row',
        margin: 5,
        borderLeftWidth: 3,
        borderLeftColor: '#CC0033',
        paddingLeft: 5,
    },
    groupText: {
        flex: 1,
        color: '#CC0033'
    },
    listRow: {
        flex: 1,
        flexDirection: 'column',
        padding: 10,
        justifyContent: 'center',
        //alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    row: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
    },
    rowTitle: {
        width: 100,
        color: '#1A1A1A',
        fontSize: 16,
    },
    rowVal: {
        flex: 1,
        color: '#696969',
    },
    input: {
        flex: 1,
        height: 30,
        margin: 0,
        padding: 0,
        borderWidth: 0,
    },
    mpName: {
        flex: 1,
        color: '#27408B',
        fontWeight: 'bold',
    },
    mpTitle: {
        fontSize: 14,
        color: '#8B0000',
        marginLeft: 10,
    },
    mpBorder: {
        width: 50,
        margin: 5,
        alignItems: 'center',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
    },
    mpBtn: {
        width: 30,
        backgroundColor: 'red',
        borderRadius: 5,
    },
    smallBtn: {
        alignItems: 'center',
    },
    /*list style*/
    searchRow: {
        backgroundColor: '#eeeeee',
        paddingTop: 15,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
    },
    searchBox: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 10,
    },
    searchBtn: {
        height: 30,
        width: 50,
        marginLeft: 10,
        backgroundColor: '#0099CC',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    searchTextInput: {
        flex: 1,
        backgroundColor: '#fff',
        borderColor: '#cccccc',
        borderRadius: 3,
        borderWidth: 1,
        height: 40,
        paddingLeft: 8,
    },
    titleText: {
        width: 100,
        color: '#292929',
        fontSize: 16,
    },
    money: {
        color: '#CD3333',
        marginRight: 10,
    },
    noMore: {
        padding: 10,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#ccc',
        backgroundColor: '#EDEDED'
    },
    /**
     *Report Used.
     **/
    outerRow: {
        flexDirection: 'row',
    },
    sumRow: {
        flex: 1,
        flexDirection: 'column',
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
        borderRightWidth: StyleSheet.hairlineWidth,
        borderRightColor: '#ccc',
    },
    sumTitle: {
        color: '#CCCC99',
        fontSize: 14,
    },
    sumValue: {
        fontSize: 20,
        color: '#0099CC',
        fontWeight: 'bold',
    },
    moneyText: {
        fontSize: 16,
        paddingRight: 5,
        color: '#FF7F24'
    },
    itemName: {
        flex:1,
        fontSize: 18,
        color: '#000'
    },
    subName:{
        fontSize:16,
        color:'#EE6A50'
    },
    /*
    * FeeSettlement
    * */
    feeView:{
        height:40,
        flexDirection:'row',
        justifyContent:'center',
        backgroundColor:'#ececec',
    },
    feeBtn:{
        width:130,
        backgroundColor:'#FF5809',
        justifyContent:'center',
    },
    feeText:{
        color:'white',
        fontSize:20,
        textAlign:'center',
    },
});
export default AppStyle;