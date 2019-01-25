/// <reference path='./index.d.ts' />

// const fetch = require('node-fetch');

export class Api {
    public url: string;

    private __token: string | null = null;
    private get _token():string | null {
        return this.__token;
        // return localStorage.getItem('auth') as string;
    }
    private set _token(token: string | null) {
        this.__token = token;
        // localStorage.setItem('auth', token);
    }

    private get headers(): any {
        return {
            'Content-Type': 'application/json',
            'X-Token': this._token
        }
    }

    constructor({ url, token }: IApiSettings) {
        this.url = url;

        if (token) {
            this._token = token;
        }
    }

    async signIn(credentials: ICredentials): Promise<IAuthResponse> {
        const headers: any = {
            'Content-Type': 'application/json'
        };
        
        let data: IAuthResponse;
        try {
            const response = await fetch(`${ this.url }/auth/signin`, {
                method: 'POST',
                headers,
                body: JSON.stringify(credentials)
            });
            data = await response.json();

            this._token = data.token;
        } catch(err) {
            return err;
        }

        return data;
    }

    async getGameShardsInfo(): Promise<IGameShardInfoResponse> {
        let data: IGameShardInfoResponse;

        try {
            const response = await fetch(`${ this.url }/game/shards/info`, {
                method: 'GET',
                headers: this.headers
            });
            data = await response.json();
        } catch(err) {
            return err;
        }

        return data;
    }
    
    getUserCode(branch = '$activeWorld'): Promise<IUserCodeReponse> {
        const promise = fetch(`${ this.url }/user/code?branch=${ branch }`, {
            method: 'GET',
            headers: this.headers
        })
            .then((response: any) => response.json());

        return promise;
    }

    getUserBranches() {
        const promise = fetch(`${ this.url }/user/branches`, {
            method: 'GET',
            headers: this.headers
        })
            .then((response: any) => response.json());

        return promise;
    }

    async sendUserConsole(body: IUserConsoleParams) {
        let data: IAuthResponse;

        try {
            const response = await fetch(`${ this.url }/user/console`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(body)
            });
            data = await response.json();
        } catch(err) {
            return err;
        }

        return data;
    }

    updateUserCode(data: IUserCode) {
        const headers: any = {
            'Content-Type': 'application/json',
            'X-Token': this._token
        };

        const promise = fetch(`${ this.url }/user/code`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        })
            .then((response: any) => response.json());

        return promise;
    }
}
