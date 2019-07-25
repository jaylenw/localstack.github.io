import axios from 'axios';

import { BaseService } from './base';

export class EventsService extends BaseService {
    defaultPath = 'events';

    getStats(apiKey, offset) {
        const data = {
            api_key: apiKey,
            offset: offset
        };
        return axios.post(this.url('events/stats'), data, this.getAuthHeaders()).then((res) => {
            return res.data;
        });
    }
}

export const eventsService = new EventsService();
