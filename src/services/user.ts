export class User {
    get id() {
        return this._data._id;
    }

    get shard() {
        const shards = Object.keys(this._data.cpuShard);
        return shards[0];
    }

    constructor(private _data: IAuthMeResponse) {
        console.log(this._data);
    }
}