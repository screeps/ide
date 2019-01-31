"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(_data) {
        this._data = _data;
        console.log(this._data);
    }
    get id() {
        return this._data._id;
    }
    get shard() {
        const shards = Object.keys(this._data.cpuShard);
        return shards[0];
    }
}
exports.User = User;
//# sourceMappingURL=user.js.map