'use strict';
import React, {
    Component
    } from 'react';
/*https://github.com/sunnylqm/react-native-storage/blob/master/README-CHN.md*/
import Storage from 'react-native-storage';
var API_ADDRESS ='http://120.24.89.243:16000/TR.PHM.Service';
//var API_ADDRESS ='http://192.168.1.114/TR.PHM.Service';
//var API_ADDRESS ='http://192.168.1.120/TR.PHM.Service';
var storage = new Storage({
    // 最大容量，默认值1000条数据循环存储
    size: 1000,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    // 如果storage中没有相应数据，或数据已过期，
    // 则会调用相应的sync同步方法，无缝返回最新数据。
    sync : {
        // 同步方法的具体说明会在后文提到
    },
});
var GLOBAL = {
    HOST: API_ADDRESS,
    LOGIN: API_ADDRESS + '/api/Persons/Login',
    GETGOODS: API_ADDRESS + '/api/ItemTypeLeftJoinItemCount/SearchSellListByPage',
    SAVESALES: API_ADDRESS + '/api/Store_DirectSell/DirectSellBillSave',
    GETGUEST: API_ADDRESS + '/api/Gest/GetModelListWithSort',
    GETSTORES: API_ADDRESS + '/api/Warehouse/GetModelList',
    ENTCODE: '2D24-D13F-45C3-3584-DF26-E2D5',
};
global.storage = storage;






module.exports = GLOBAL;
