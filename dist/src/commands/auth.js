"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operators_1 = require("rxjs/operators");
const atom_modal_1 = require("../components/atom-modal");
const ui_1 = require("../../ui");
const utils_1 = require("../utils");
function authCommand() {
    console.log('SCREEPS__AUTH');
    const api = utils_1.getApi();
    const authModalRef = new atom_modal_1.AtomModal(ui_1.AuthModal);
    authModalRef.events$
        .pipe(operators_1.filter(({ type }) => type === 'AUTH_SUBMIT'))
        .pipe(operators_1.switchMap(({ payload }) => api.signIn(payload)))
        .subscribe();
}
exports.authCommand = authCommand;
//# sourceMappingURL=auth.js.map