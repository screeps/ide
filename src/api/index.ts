/// <reference path='./index.d.ts' />

// const fetch = require('node-fetch');

function generateAuthTokenRequest(): IAuthTokenRequest {
    return {
        description: `atom-${ new Date() .getTime() }`,
        endpoints: { },
        memorySegments: '',
        type: 'full',
        websockets: {console: false, rooms: false}
    }
}

export class Api {
    public url: string;

    private __token: string | null = null;
    private get _token():string | null {
        return this.__token;
    }
    private set _token(token: string | null) {
        this.__token = token;
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
            throw err;
        }

        return data;
    }

    async getAuhtMe(): Promise<IAuthMeResponse> {
        let data: IAuthMeResponse;

        try {
            const response = await fetch(`${ this.url }/auth/me`, {
                method: 'GET',
                headers: this.headers
            });

            data = await response.json();

            if (!response.ok) {
                throw data.error;
            }
        } catch(err) {
            throw err;
        }

        return data;
    }

    async createAuthToken(body: IAuthTokenRequest = generateAuthTokenRequest()): Promise<IAuthTokenResponse> {
        let data: IAuthTokenResponse;

        try {
            const response = await fetch(`${ this.url }/user/auth-token`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(body)
            });

            data = await response.json();

            this._token = data.token;
        } catch(err) {
            throw err;
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
            throw err;
        }

        return data;
    }

    async getUserCode(branch = '$activeWorld'): Promise<IUserCodeResponse> {
        let data: IUserCodeResponse;

        try {
            const response = await fetch(`${ this.url }/user/code?branch=${ branch }`, {
                method: 'GET',
                headers: this.headers
            });
            data = await response.json();
        } catch(err) {
            throw err;
        }

        return data;
    }

    async getUserBranches(): Promise<IUserBranchesResponse> {
        let data: IUserBranchesResponse;

        try {
            const response = await fetch(`${ this.url }/user/branches`, {
                method: 'GET',
                headers: this.headers
            });

            data = await response.json();
        } catch(err) {
            throw err;
        }

        return data;
    }

    async deleteUserBranch(branch: string): Promise<IResponse> {
        let data: IResponse;

        try {
            const response = await fetch(`${ this.url }/user/delete-branch`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({ branch })
            });

            data = await response.json();
        } catch(err) {
            throw err;
        }

        return data;
    }

    async cloneUserBranch(body: ICloneUserBranchBodyRequest): Promise<IResponse> {
        let data: IResponse;

        try {
            const response = await fetch(`${ this.url }/user/clone-branch`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(body)
            });

            data = await response.json();
        } catch(err) {
            throw err;
        }

        return data;
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
            throw err;
        }

        return data;
    }

    updateUserCode(data: IUserCodeRequest) {
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

    async getUserMemory({ path, shard }: IUserMemoryRequest): Promise<IUserMemoryResponse> {
        let data: IUserMemoryResponse;

        try {
            const response = await fetch(`${ this.url }/user/memory?path=${ path }&shard=${ shard }`, {
                method: 'GET',
                headers: this.headers
            });
            data = await response.json();
        } catch(err) {
            throw err;
        }

        return data;
    }

    async setUserMemory(body: IUserMemoryBodyRequest): Promise<IResponse> {
        let data: IResponse;

        try {
            const response = await fetch(`${ this.url }/user/memory`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(body)
            });

            data = await response.json();
        } catch(err) {
            throw err;
        }

        return data;
    }

    async getUserMemorySegment({ segment, shard }: IUserMemorySegmentRequest): Promise<IUserMemorySegmentResponse> {
        let data: IUserMemorySegmentResponse;

        try {
            const response = await fetch(`${ this.url }/user/memory-segment?segment=${ segment }&shard=${ shard }`, {
                method: 'GET',
                headers: this.headers
            });
            data = await response.json();
        } catch(err) {
            throw err;
        }

        return data;
    }

    async setUserMemorySegment(body: IUserMemorySegmentBodyRequest): Promise<IResponse> {
        let data: IResponse;

        try {
            const response = await fetch(`${ this.url }/user/memory-segment`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(body)
            });

            data = await response.json();
        } catch(err) {
            throw err;
        }

        return data;
    }

    async setActiveWorld(branch: string): Promise<IResponse> {
        let data: IResponse;

        try {
            const response = await fetch(`${ this.url }/user/set-active-branch`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({
                    branch,
                    activeName: 'activeWorld',
                })
            });

            data = await response.json();
        } catch(err) {
            throw err;
        }

        return data;
    }

    async setActiveSim(branch: string): Promise<IResponse> {
        let data: IResponse;

        try {
            const response = await fetch(`${ this.url }/user/set-active-branch`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({
                    branch,
                    activeName: 'activeSim',
                })
            });

            data = await response.json();
        } catch(err) {
            throw err;
        }

        return data;
    }
}
