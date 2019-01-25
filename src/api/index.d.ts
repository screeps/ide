interface IApiSettings {
    url: string;
    token?: string;
}

interface ICredentials {
    email: string;
    password: string;
}

interface IUserCode {
    branch: string;
    modules: IModules;
}

interface IAuthResponse {
    ok: number;
    token: string;
}

interface IUserCodeReponse extends IUserCode {
    ok: number;
}

interface IBranches {
    _id: string;
    branch: string;
    activeWorld?: boolean;
    activeSim: boolean;
}

interface IModules {
    [key: string]: String;
}

interface IUserBranches {
    ok: number;
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

interface IGameShardInfoResponse {
    ok: number;
    shards: IGameShardInfo[];
}
