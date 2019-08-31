"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operators_1 = require("rxjs/operators");
const atom_modal_1 = require("../../components/atom-modal");
const confirm_1 = require("../../../ui/components/confirm");
function default_1(props) {
    return new Promise((resolve, reject) => {
        const confirmModalRef = new atom_modal_1.AtomModal(confirm_1.default, props);
        confirmModalRef.events$
            .pipe(operators_1.filter(({ type }) => type === 'MODAL_SUBMIT'))
            .pipe(operators_1.tap(() => confirmModalRef.hide()))
            .pipe(operators_1.tap(() => resolve(true)))
            .subscribe();
        confirmModalRef.events$
            .pipe(operators_1.filter(({ type }) => type === 'MODAL_CANCEL'))
            .pipe(operators_1.tap(() => reject(false)))
            .subscribe();
    });
}
exports.default = default_1;
//# sourceMappingURL=index.js.map