'use strict';
import React, {
    Component
    } from 'react';
/*https://github.com/sunnylqm/react-native-storage/blob/master/README-CHN.md*/
import Storage from 'react-native-storage';
var API_ADDRESS ='http://120.24.89.243:16000/TR.PHM.Service';
var LOCAL_HOST_ADDRESS='http://192.168.1.105:8989/';
//var API_ADDRESS ='http://192.168.1.114/TR.PHM.Service';
//var API_ADDRESS ='http://192.168.1.120/TR.PHM.Service';
var storage = new Storage({
    // ���������Ĭ��ֵ1000������ѭ���洢
    size: 1000,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    // ���storage��û����Ӧ���ݣ��������ѹ��ڣ�
    // ��������Ӧ��syncͬ���������޷췵���������ݡ�
    sync : {
        // ͬ�������ľ���˵�����ں����ᵽ
    },
});
var GLOBAL = {
    HOST: API_ADDRESS,
    LOGIN: API_ADDRESS + '/api/Persons/Login',
    GETGOODS: API_ADDRESS + '/api/ItemTypeLeftJoinItemCount/SearchSellListByPage',
    SAVESALES: API_ADDRESS + '/api/Store_DirectSell/DirectSellBillSave',
    GETGUEST: API_ADDRESS + '/api/Gest/GetModelListWithSort',
    GETSTORES: API_ADDRESS + '/api/Warehouse/GetModelList',
    GETDURG:LOCAL_HOST_ADDRESS+'durg.html',
    ENTCODE: '2D24-D13F-45C3-3584-DF26-E2D5',
};
global.storage = storage;

module.exports = GLOBAL;
