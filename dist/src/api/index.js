"use strict";
/// <reference path='./index.d.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
// const fetch = require('node-fetch');
class Api {
    constructor({ url, token }) {
        this.__token = null;
        this.url = url;
        if (token) {
            this._token = token;
        }
    }
    get _token() {
        return this.__token;
        // return localStorage.getItem('auth') as string;
    }
    set _token(token) {
        this.__token = token;
        // localStorage.setItem('auth', token);
    }
    get headers() {
        return {
            'Content-Type': 'application/json',
            'X-Token': this._token
        };
    }
    async signIn(credentials) {
        const headers = {
            'Content-Type': 'application/json'
        };
        let data;
        try {
            const response = await fetch(`${this.url}/auth/signin`, {
                method: 'POST',
                headers,
                body: JSON.stringify(credentials)
            });
            data = await response.json();
            this._token = data.token;
        }
        catch (err) {
            return err;
        }
        return data;
    }
    async getGameShardsInfo() {
        let data;
        try {
            const response = await fetch(`${this.url}/game/shards/info`, {
                method: 'GET',
                headers: this.headers
            });
            data = await response.json();
        }
        catch (err) {
            return err;
        }
        return data;
    }
    getUserCode(branch = '$activeWorld') {
        const promise = fetch(`${this.url}/user/code?branch=${branch}`, {
            method: 'GET',
            headers: this.headers
        })
            .then((response) => response.json());
        return promise;
    }
    getUserBranches() {
        const promise = fetch(`${this.url}/user/branches`, {
            method: 'GET',
            headers: this.headers
        })
            .then((response) => response.json());
        return promise;
    }
    async sendUserConsole(body) {
        let data;
        try {
            const response = await fetch(`${this.url}/user/console`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(body)
            });
            data = await response.json();
        }
        catch (err) {
            return err;
        }
        return data;
    }
    updateUserCode(data) {
        const headers = {
            'Content-Type': 'application/json',
            'X-Token': this._token
        };
        const promise = fetch(`${this.url}/user/code`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json());
        return promise;
    }
}
exports.Api = Api;
//# sourceMappingURL=index.js.map