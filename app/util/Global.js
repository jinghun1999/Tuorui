'use strict';
import React, {
    Component
    } from 'react';
/*https://github.com/sunnylqm/react-native-storage/blob/master/README-CHN.md*/
import Storage from 'react-native-storage';
let API_Service ='http://192.168.1.10:16000/service/api';
let API_Auth = 'http://192.168.1.10:16000/auth/api';
let WEB_HOST = 'http://120.24.89.243/trweb';
let API_APP = 'http://120.24.89.243:20000/api';
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
    WEB: WEB_HOST,
    HOST: API_Service,
    APIAPP: API_APP,
    LOGIN: API_Auth + '/ad',
    GETGOODS: API_Service + '/ItemTypeLeftJoinItemCount/SearchSellListByPage',
    SAVESALES: API_Service + '/Store_DirectSell/DirectSellBillSave',
    GETGUEST: API_Service + '/gest/GetModelListWithSort',
    GETSTORES: API_Service + '/Warehouse/GetModelList',
    ENTCODE: '2D24-D13F-45C3-3584-DF26-E2D5',
};
global.storage = storage;
global.GLOBAL = GLOBAL;
module.exports = GLOBAL;
