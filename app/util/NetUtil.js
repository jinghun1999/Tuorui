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
                    result = {Sign: false, Message: '【解析远程数据失败】' + responseText};
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

    static getAuth(success, error) {
        storage.load({
            key: 'USER',
            autoSync: true,
            syncInBackground: true
        }).then(user => {
            storage.load({
                key: 'HOSPITAL',
                autoSync: false,
                syncInBackground: false
            }).then(hos=> {
                success(user.user, hos);
            }).catch(e=> {
                success(user.user, {});
            })
        }).catch(err => {
            switch (err.name) {
                case 'NotFoundError':
                    error('not found user');
                    break;
                case 'ExpiredError':
                    error('user login expired');
                    break;
                default :
                    error('请重新登陆应用');
                    break;
            }
        });
    }

    static url_healthmonitnorm(checkItemCode) {
        const time = Util.getTime();
        const ul = Global.HOST + "?token=" + Util.getToken(time);
        return ul;
    }

    static headerAuthorization(mobile, hospitalcode, token) {
        return 'Mobile ' + Util.base64Encode(mobile + ':' + hospitalcode + ":" + token);
    }

    static headerClientAuth(user, hos) {
        let hoscode = '';
        if (hos && hos.hospital) {
            hoscode = hos.hospital.Registration
        }
        return {
            'Authorization': 'Mobile ' + Util.base64Encode(user.Mobile + ':' + hoscode + ":" + user.Token.token)
        }
    }

}

module.exports = NetUtil;
