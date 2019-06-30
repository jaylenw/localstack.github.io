import axios from 'axios';

const baseURL = 'https://api.localstack.cloud/v1/';

export class UsersService {
    signin(username, password) {
        const url = `${baseURL}user/signin`;
        const data = {username, password};
        return axios.post(url, data).then((res) => {
            return res.data;
        });
    }
    signup(firstname, lastname, email, password) {
        const url = `${baseURL}user/signup`;
        const data = {firstname, lastname, email, password};
        return axios.post(url, data).then((res) => {
            return res.data;
        })
    }
    getUserInfo() {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
          try {
              return JSON.parse(userInfo);
          } catch (e) {
              console.log('ERROR: Unable to parse user info');
          }
        }
        return undefined;
    }
    getUserName() {
        const userInfo = this.getUserInfo();
        if (!userInfo) {
            return undefined;
        }
        return userInfo.displayName;
    }
}

export const usersService = new UsersService();
