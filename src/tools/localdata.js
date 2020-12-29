import * as tools from './tool'
import * as api from '../mocks/api'
import AsyncStorage from '@react-native-community/async-storage';

const defaultUserInfo = {
    location: '',
}

export function LoadUserInfo() {
    return new Promise((resolve, reject) => {
        tools.GetFromLocal('AUTHTOKEN')
            .then((v) => {
                var userInfo = JSON.parse(v);
                if (userInfo !== undefined && userInfo !== null && userInfo !== "") {
                    resolve(userInfo);
                }
                else {
                    resolve(defaultUserInfo);
                }
            }, (err) => {
                resolve(defaultUserInfo);
            })
    });
}

export function LoadLocations() {
    return new Promise((resolve, reject) => {
        tools.GetFromLocal('Static_Cities')
            .then(res => {
                if (res === undefined || res === null || res === '') {
                    LoadCities(resolve, reject);
                }
                else {
                    let currentData = [];
                    if (typeof (res) === 'string') {
                        currentData = JSON.parse(res);
                    } else {
                        currentData = res;
                    }
                    if (currentData.length > 0) {
                        resolve(currentData);
                    } else {
                        resolve([]);
                    }
                }
            }, () => {
                resolve([]);
            })
    });
}

function LoadCities(resolve, reject) {
    api.GetCities()
        .then(res => {
            if (res.data.result === 1) {
                tools.SetToLocal('Static_Cities', res.data.data);
                tools.SetToLocal('Static_Forums', res.data.forum);
                if (res.data.data.length > 0) {
                    resolve(res.data.data);
                } else {
                    resolve([]);
                }
            } else {
                resolve([]);
            }
        }, err => {
            resolve([])
        })
}

function LoadPrepareFormType(type, resolve, reject) {
    api.PrepareFormByType(type)
        .then(res => {
            //tools.SetToLocal(`Form_${type}`, res.data.data);
            resolve(res.data.data);
        }, err => {
            reject(err)
        })
}

export function PrepareFormType(type) {
    return new Promise((resolve, reject) => {
        LoadPrepareFormType(type, resolve, reject);
        // tools.GetFromLocal(`Form_${type}`)
        //     .then(data => {
        //         if (data === undefined || data === null || data === '') {
        //             LoadPrepareFormType(type, resolve, reject);
        //         } else {
        //             let currentData = [];
        //             if (typeof (data) === 'string') {
        //                 currentData = JSON.parse(data);
        //             } else {
        //                 currentData = data;
        //             }
        //             resolve(currentData);
        //         }
        //     }, () => {
        //         LoadPrepareFormType(type, resolve, reject);
        //     })
    });
}

export function LoadForumPlates(){
    return new Promise((resolve, reject) => {
        tools.GetFromLocal('Static_Forums')
            .then(res => {
                if (res === undefined || res === null || res === '') {
                    LoadForumCategories(resolve, reject);
                }
                else {
                    let currentData = [];
                    if (typeof (res) === 'string') {
                        currentData = JSON.parse(res);
                    } else {
                        currentData = res;
                    }
                    if (currentData.length > 0) {
                        resolve(currentData);
                    } else {
                        resolve([]);
                    }
                }
            }, () => {
                resolve([]);
            })
    });
}

function LoadForumCategories(resolve, reject) {
    api.GetCities()
        .then(res => {
            if (res.data.result === 1) {
                tools.SetToLocal('Static_Cities', res.data.data);
                tools.SetToLocal('Static_Forums', res.data.forum);
                if (res.data.forum.length > 0) {
                    resolve(res.data.forum);
                } else {
                    resolve([]);
                }
            } else {
                resolve([]);
            }
        }, err => {
            resolve([])
        })
}

export function ClearStorageInfo() {
    tools.RemoveFromLocal('Static_Cities');
    tools.RemoveFromLocal('Static_Forums');
    AsyncStorage.getAllKeys((errors, keys) => {
        keys.map(item => {
            if (item.indexOf('Form_') !== -1) {
                tools.RemoveFromLocal(item);
            }
        })
    })
}


