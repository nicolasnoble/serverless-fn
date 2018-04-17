'use strict';

const { fnRouteUrl } = require('../utils/util');
const axios = require('axios');
const BB = require('bluebird');

class FNInvoke {
    constructor(serverless, options) {
        this.serverless = serverless;
        this.options = options || {};
        this.provider = this.serverless.getProvider('fn');

        this.hooks = {
            'invoke:invoke': () => BB.bind(this)
                .then(this.invokeFunction)
                .then((data) => data.data)
                .then(console.log),
        };
    }

    invokeFunction() {
        const f = this.serverless.service.functions[this.options.f];
        if (f === undefined || f === null) {
            return BB.reject(`${this.options.f} is not a valid function for this service.`);
        }
        const url = fnRouteUrl();
        let funcpath = f.path;
        if (funcpath === undefined) {
            funcpath = f.name;
        }
        if (this.options.data !== undefined) {
            return axios.post(`${url}${this.serverless.service.serviceObject.name}/${funcpath}`
                , this.options.data);
        }
        return axios.get(`${url}${this.serverless.service.serviceObject.name}/${funcpath}`);
    }
}

module.exports = FNInvoke;
