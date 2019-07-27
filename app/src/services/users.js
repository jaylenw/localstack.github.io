import axios from 'axios';

import { BaseService } from './base';

export class UsersService extends BaseService {
    defaultPath = 'user';

    signin(username, password) {
        const data = {username, password};
        return axios.post(this.url('user/signin'), data).then((result) => {
            localStorage.setItem('userInfo', JSON.stringify(result.data));
            return result.data;
        });
    }
    signup(firstname, lastname, email, password) {
        const data = {firstname, lastname, email, password};
        return axios.post(this.url('user/signup'), data).then((res) => {
            return res.data;
        });
    }
    getUserDetails() {
        return axios.get(this.url(), this.getAuthHeaders()).then((res) => {
            return res.data;
        });
    }
    getLocalUserDetails() {
        return JSON.parse(localStorage.getItem('userInfo'));
    }
    getUserName() {
        const userInfo = this.getUserInfo();
        if (!userInfo) {
            return undefined;
        }
        return userInfo.displayName;
    }
    saveUserDetails(details) {
        return axios.post(this.url(), details, this.getAuthHeaders()).then((res) => {
            return res.data;
        });
    }
    getCreditCard() {
        return axios.get(this.url('user/cards'), this.getAuthHeaders()).then((res) => {
            return res.data;
        });
    }
    saveCreditCard(card) {
        return axios.post(this.url('user/cards'), card, this.getAuthHeaders()).then((res) => {
            return res.data;
        });
    }
    updatePassword(password) {
        const details = { password };
        return this.saveUserDetails(details).then(
          (res) => this.signin(this.getLocalUserDetails().email, password)
        );
    }
}

export const usersService = new UsersService();