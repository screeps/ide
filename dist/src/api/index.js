"use strict";
/// <reference path='./index.d.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
// const fetch = require('node-fetch');
function generateAuthTokenRequest() {
    return {
        description: `atom-${new Date().getTime()}`,
        endpoints: {},
        memorySegments: '',
        type: 'full',
        websockets: { console: false, rooms: false }
    };
}
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
    }
    set _token(token) {
        this.__token = token;
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
            throw err;
        }
        return data;
    }
    async getAuhtMe() {
        let data;
        try {
            const response = await fetch(`${this.url}/auth/me`, {
                method: 'GET',
                headers: this.headers
            });
            data = await response.json();
            if (!response.ok) {
                throw data.error;
            }
        }
        catch (err) {
            throw err;
        }
        return data;
    }
    async createAuthToken(body = generateAuthTokenRequest()) {
        let data;
        try {
            const response = await fetch(`${this.url}/user/auth-token`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(body)
            });
            data = await response.json();
            this._token = data.token;
        }
        catch (err) {
            throw err;
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
            throw err;
        }
        return data;
    }
    async getUserCode(branch = '$activeWorld') {
        let data;
        try {
            const response = await fetch(`${this.url}/user/code?branch=${branch}`, {
                method: 'GET',
                headers: this.headers
            });
            data = await response.json();
        }
        catch (err) {
            throw err;
        }
        return data;
    }
    async getUserBranches() {
        let data;
        try {
            const response = await fetch(`${this.url}/user/branches`, {
                method: 'GET',
                headers: this.headers
            });
            data = await response.json();
        }
        catch (err) {
            throw err;
        }
        return data;
    }
    async deleteUserBranch(branch) {
        let data;
        try {
            const response = await fetch(`${this.url}/user/delete-branch`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({ branch })
            });
            data = await response.json();
        }
        catch (err) {
            throw err;
        }
        return data;
    }
    async cloneUserBranch(body) {
        let data;
        try {
            const response = await fetch(`${this.url}/user/clone-branch`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(body)
            });
            data = await response.json();
        }
        catch (err) {
            throw err;
        }
        return data;
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
            throw err;
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
    async getUserMemory({ path, shard }) {
        let data;
        try {
            const response = await fetch(`${this.url}/user/memory?path=${path}&shard=${shard}`, {
                method: 'GET',
                headers: this.headers
            });
            data = await response.json();
        }
        catch (err) {
            throw err;
        }
        return data;
    }
    async setUserMemory(body) {
        let data;
        try {
            const response = await fetch(`${this.url}/user/memory`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(body)
            });
            data = await response.json();
        }
        catch (err) {
            throw err;
        }
        return data;
    }
    async getUserMemorySegment({ segment, shard }) {
        let data;
        try {
            const response = await fetch(`${this.url}/user/memory-segment?segment=${segment}&shard=${shard}`, {
                method: 'GET',
                headers: this.headers
            });
            data = await response.json();
        }
        catch (err) {
            throw err;
        }
        return data;
    }
    async setUserMemorySegment(body) {
        let data;
        try {
            const response = await fetch(`${this.url}/user/memory-segment`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(body)
            });
            data = await response.json();
        }
        catch (err) {
            throw err;
        }
        return data;
    }
    async setActiveWorld(branch) {
        let data;
        try {
            const response = await fetch(`${this.url}/user/set-active-branch`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({
                    branch,
                    activeName: 'activeWorld',
                })
            });
            data = await response.json();
        }
        catch (err) {
            throw err;
        }
        return data;
    }
    async setActiveSim(branch) {
        let data;
        try {
            const response = await fetch(`${this.url}/user/set-active-branch`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({
                    branch,
                    activeName: 'activeSim',
                })
            });
            data = await response.json();
        }
        catch (err) {
            throw err;
        }
        return data;
    }
}
exports.Api = Api;
//# sourceMappingURL=index.js.map