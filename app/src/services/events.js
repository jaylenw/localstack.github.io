import axios from 'axios';

import { BaseService } from './base';

export class EventsService extends BaseService {
    defaultPath = 'events';

    getStats(username, password) {
        const data = {};
        return axios.post(this.url('events/stats'), data, this.getAuthHeaders()).then((res) => {
            console.log(res.data);
            return res.data;
        });
    }
}

export const eventsService = new EventsService();
