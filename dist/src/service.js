"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
// import { }
const utils_1 = require("./utils");
class Service {
    constructor() {
        this.state = new rxjs_1.BehaviorSubject({
            modules: {},
            branch: '',
            branches: []
        });
        this.state$ = this.state.asObservable();
        this.shards = new rxjs_1.BehaviorSubject([]);
        this.shards$ = this.shards.asObservable();
        this.getGameShardsInfo();
    }
    getUserBranches() {
        this._api.getUserBranches()
            .then(({ list }) => {
            const data = this.state.getValue();
            this.state.next(Object.assign({}, data, { branches: list }));
        });
    }
    getUserCode(branch) {
        const data = this.state.getValue();
        this.state.next(Object.assign({}, data, { branch, modules: {} }));
        this._api.getUserCode(branch)
            .then(({ branch, modules }) => {
            const data = this.state.getValue();
            this.state.next(Object.assign({}, data, { branch,
                modules }));
        });
    }
    async getGameShardsInfo() {
        const api = await utils_1.getApi();
        const { shards } = await api.getGameShardsInfo();
        this.shards.next(shards);
    }
}
exports.Service = Service;
//# sourceMappingURL=service.js.map