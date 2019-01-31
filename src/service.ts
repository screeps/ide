import { BehaviorSubject } from 'rxjs';
// import { }

import { getApi } from './utils';

export class Service {
    public state: BehaviorSubject<any> = new BehaviorSubject({
        modules: {},
        branch: '',
        branches: []
    });
    public state$ = this.state.asObservable();

    public shards: BehaviorSubject<any> = new BehaviorSubject([]);
    public shards$ = this.shards.asObservable();

    private _api: any;

    constructor() {
        this.getGameShardsInfo();
    }

    getUserBranches() {
        this._api.getUserBranches()
            .then(({ list }: { list: any }) => {
                const data = this.state.getValue();
                this.state.next({
                    ...data,
                    branches: list
                });
            });
    }

    getUserCode(branch?: string) {
        const data = this.state.getValue();
        this.state.next({
            ...data,
            branch,
            modules: {}
        });

        this._api.getUserCode(branch)
            .then(({ branch, modules }: { branch: any, modules: any }) => {
                const data = this.state.getValue();
                this.state.next({
                    ...data,
                    branch,
                    modules
                });
            });
    }

    async getGameShardsInfo() {
        const api = await getApi();
        const { shards } = await api.getGameShardsInfo();

        this.shards.next(shards);
    }
}