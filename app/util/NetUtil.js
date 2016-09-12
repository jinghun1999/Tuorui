'use strict';
import React, {
    Component,
    } from 'react';
import Util from './Util';
import Global from './Global';
class NetUtil extends React.Component {

    static postJson(url, data, header, callback) {
        if (!header) {
            header = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };
        } else {
            if (!header.hasOwnProperty('Accept')) {
                header['Accept'] = 'application/json';
            }
            if (!header.hasOwnProperty('Content-Type')) {
                header['Content-Type'] = 'application/json';
            }
        }
        var fetchOptions = {
            method: 'POST',
            headers: header,
            body: JSON.stringify(data)
        };

        fetch(url, fetchOptions)
            .then((response) => response.text())
            .then((responseText) => {
                let result = {};
                try {
                    result = JSON.parse(responseText);
                } catch (e) {
                    result = {Sign: false, Message: '【解析JSON失败】' + responseText};
                }
                callback(result);
            }).done();
    }

    //get请求
    static get(url, header, callback) {
        if (!header) {
            header = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };
        } else {
            if (!header.hasOwnProperty('Accept')) {
                header['Accept'] = 'application/json';
            }
            if (!header.hasOwnProperty('Content-Type')) {
                header['Content-Type'] = 'application/json';
            }
        }
        var fetchOptions = {
            method: 'GET',
            headers: header
        };
        try {
            fetch(url, fetchOptions)
                .then((response) => response.text())
                .then((responseText) => {
                    let result = {};
                    try {
                        result = JSON.parse(responseText);
                    } catch (e) {
                        result = {Sign: false, Message: '【解析JSON失败】' + responseText};
                    }
                    callback(result);
                }).done();
        } catch (e) {
            return e;
        }
    }

    /*get请求
     static get(url, callback) {
     fetch(url)
     .then((response) => response.text())
     .then((responseText) => {
     callback(JSON.parse(responseText));
     }).done();
     }*/

    log(obj) {
        var description = "";
        for (var i in obj) {
            var property = obj[i];
            description += i + " = " + property + "\n";
        }
        alert(description);
    }

    static url_healthmonitbase() {
        const time = Util.getTime();
        const s = Global.HOST + "/healthmonitbase?customerid=0010000022464&density=480&ko=0000&time=" + time + "&token=" + Util.getToken(time);
        return s;
    }

    static url_healthmonitnorm(checkItemCode) {
        const time = Util.getTime();
        const ul = Global.HOST + "?token=" + Util.getToken(time);
        return ul;
    }

    static headerAuthorization(mobile, pwd, hospitalcode, token) {
        return 'Mobile ' + Util.base64Encode(mobile + ':' + hospitalcode + ":" + token);
    }
}

module.exports = NetUtil;
