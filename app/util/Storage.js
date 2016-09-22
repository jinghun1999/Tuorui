/**
 * Created by User on 2016-09-22.
 */
import { AsyncStorage } from 'react-native';
import Storage from 'react-native-storage';
import NetUtil from './NetUtil';
var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: true,
    sync: {
        USER(params) {
            let {id, resolve, reject } = params;
            storage.load({key: 'LoginData'}).then(l=> {
                let url = CONSTAPI.LOGIN + '?identity=' + l.identity + '&password=' + l.password + '&type=m';
                //let url = CONSTAPI.LOGIN + '?identity=18307722503&password=abc123&type=m';
                fetch(url)
                    .then((response) => response.text())
                    .then((responseText) => {
                        let r = {};
                        try {
                            r = JSON.parse(responseText);
                            if (r.Sign && r.Message) {
                                storage.save({
                                    key: 'USER',
                                    rawData: {
                                        user: r.Message,
                                    },
                                    expires: 1000 * 60,
                                });
                                resolve && resolve({user: r.Message});
                            }else{
                                reject && reject(new Error('登陆信息已过期，请重新登陆'));
                            }
                        } catch (e) {
                            reject && reject(new Error('data parse error'));
                        }
                    }).done();
            }).catch(err=> {
                reject && reject(new Error(err.message));
            });
        }
    }
});global.storage = storage;
