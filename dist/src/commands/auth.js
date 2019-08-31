"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const atom_modal_1 = require("../components/atom-modal");
const ui_1 = require("../../ui");
const ui_2 = require("../../ui");
const api_1 = require("../api");
const config_1 = require("../config");
function createTokenCommand(api) {
    let tokenModalRef;
    return rxjs_1.from(api.createAuthToken())
        .pipe(operators_1.switchMap(({ token }) => {
        tokenModalRef = new atom_modal_1.AtomModal(ui_2.TokenModal, {
            token
        });
        return tokenModalRef.events$.pipe(operators_1.map((action) => {
            action.token = token;
            return action;
        }));
    }))
        .pipe(operators_1.filter(({ type }) => type === 'MODAL_SUBMIT'))
        .pipe(operators_1.tap((data) => {
        tokenModalRef.hide();
        config_1.configSetter('global.authToken', data.token);
    }))
        .pipe(operators_1.catchError(() => {
        tokenModalRef.hide();
        return rxjs_1.empty();
    }));
}
exports.createTokenCommand = createTokenCommand;
let auth;
function authCommand() {
    const apiUrl = config_1.configGetter('apiUrl');
    const api = new api_1.Api({ url: apiUrl });
    if (auth) {
        return auth;
    }
    auth = new Promise((resolve, reject) => {
        const authModalRef = new atom_modal_1.AtomModal(ui_1.AuthView);
        authModalRef.events$
            .pipe(operators_1.filter(({ type }) => type === 'MODAL_SUBMIT'))
            .pipe(operators_1.switchMap(({ payload }) => {
            return rxjs_1.from(api.signIn(payload))
                .pipe(operators_1.switchMap(() => {
                authModalRef.hide();
                return createTokenCommand(api);
            }))
                .pipe(operators_1.catchError(() => {
                authModalRef.ref.setState({
                    isInvalid: true,
                    isBlocking: true
                });
                return rxjs_1.empty();
            }));
        }))
            .pipe(operators_1.tap(() => {
            resolve(api);
        }))
            .subscribe();
        authModalRef.events$
            .pipe(operators_1.filter(({ type }) => type === 'MODAL_CANCEL'))
            .pipe(operators_1.tap(() => {
            reject();
        }))
            .subscribe();
        authModalRef.events$
            .pipe(operators_1.tap(() => {
            auth = null;
        }))
            .subscribe();
    });
    return auth;
}
exports.authCommand = authCommand;
//# sourceMappingURL=auth.js.map