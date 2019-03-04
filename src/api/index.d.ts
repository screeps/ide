interface IResponse {
    ok?: string;
    error?: string;
}

interface IApiSettings {
    url: string;
    token?: string;
}

interface ICredentials {
    email: string;
    password: string;
}

interface IModules {
    [key: string]: string;
}

interface IUserCodeRequest {
    branch: string;
    modules: IModules;
}

interface IUserCodeResponse extends IResponse {
    branch: string;
    modules: IModules;
}

interface IAuthResponse extends IResponse {
    token: string;
}

interface IBranches {
    _id: string;
    branch: string;
    activeWorld?: boolean;
    activeSim: boolean;
}

interface IUserBranchesResponse extends IResponse {
    list: IBranches[];
}

interface IUserConsoleParams {
    expression: string;
    shard: string;
}

interface IGameShardInfo {
    cpuLimit: number;
    lastTicks: number[];
    name: string;
    rooms: number;
    tick: number;
    users: number;
}

interface IGameShardInfoResponse extends IResponse {
    shards: IGameShardInfo[];
}

interface IUserMemoryRequest {
    path: string;
    shard: string;
}

interface IUserMemoryResponse extends IResponse {
    data: string;
}

interface IAuthTokenRequest {
    description: string;

    endpoints: {
        [key: string]: boolean;
    };

    memorySegments: string;

    type: string;

    websockets: {
        console: boolean;
        rooms: boolean;
    }
}

interface IAuthTokenResponse extends IResponse {
    token: string;
}

interface IAuthMeResponse extends IResponse {
    _id: string;
    badge: any;
    cpu: number;
    cpuShard: {
        [key: string]: number;
    };
    cpuShardUpdatedTime: number;
    credits: number;
    email: string;
    gcl: number;
    lastRespawnDate: number;
    money: number;
    notifyPrefs: {
        [key: string]: boolean;
    };
    password: boolean;
    promoPeriodUntil: number;
    runtime: {
        [key: string]: boolean;
    }
    steam: {
        [key: string]: any;
    }
    subscriptionTokens: 0;
    username: string;
}

interface IUserMemorySegmentRequest {
    segment: string;
    shard: string;
}

interface IUserMemorySegmentBodyRequest {
    segment: string;
    shard: string;
    data: string;
}

interface IUserMemorySegmentResponse extends IResponse {
    data: string;
}
