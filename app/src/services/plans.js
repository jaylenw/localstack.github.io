import axios from 'axios';

import { BaseService } from './base';

export class PlansService extends BaseService {
    defaultPath = 'plans';

    loadPlans() {
        return axios.get(this.url(), this.getAuthHeaders()).then((res) => {
            return res.data;
        });
    }
    loadSubscriptions() {
        return axios.get(this.url('plans/subscriptions'), this.getAuthHeaders()).then((res) => {
            return res.data;
        });
    }
    createSubscription(product, quantity) {
        const data = {product, quantity};
        return axios.post(this.url('plans/subscriptions'), data, this.getAuthHeaders()).then((res) => {
            return res.data;
        });
    }
}

export const plansService = new PlansService();
