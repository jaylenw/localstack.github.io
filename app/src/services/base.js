import { serviceBaseURL } from '../config';


export class BaseService {
    defaultPath = '';

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
    getAuthHeaders() {
        const userInfo = this.getUserInfo();
        if (!userInfo) {
            return undefined;
        }
        return { headers: { Authorization: userInfo.token } };
    }
    url(path) {
        path = path || this.defaultPath;
        return `${serviceBaseURL}${path}`;
    }
}
