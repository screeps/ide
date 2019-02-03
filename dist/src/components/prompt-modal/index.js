"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operators_1 = require("rxjs/operators");
const atom_modal_1 = require("../../components/atom-modal");
const prompt_1 = require("../../../ui/components/prompt");
function default_1(props) {
    return new Promise((resolve, reject) => {
        const promptModalRef = new atom_modal_1.AtomModal(prompt_1.default, props);
        promptModalRef.events$
            .pipe(operators_1.filter(({ type }) => type === 'MODAL_SUBMIT'))
            .pipe(operators_1.tap(() => promptModalRef.hide()))
            .pipe(operators_1.tap(({ payload }) => resolve(payload)))
            .subscribe();
        promptModalRef.events$
            .pipe(operators_1.filter(({ type }) => type === 'MODAL_CANCEL'))
            .pipe(operators_1.tap(() => reject(null)))
            .subscribe();
    });
}
exports.default = default_1;
//# sourceMappingURL=index.js.map