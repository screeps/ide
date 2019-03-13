"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const atom_1 = require("atom");
// import { Service } from '../../service';
const config_1 = require("../../config");
const commands_1 = require("../../commands");
class TreeViewDir {
    constructor(_modulesPane) {
        this._modulesPane = _modulesPane;
        this._btnRef = null;
        const srcDir = config_1.configGetter('src');
        const projectPath = atom.project.getPaths()[0];
        const fullPath = path.resolve(projectPath, srcDir);
        this._dir = new atom_1.Directory(fullPath);
        this._elementRef = document.querySelector(`[data-path="${fullPath.replace(/["\\]/g, '\\$&')}"]`);
        if (this._elementRef && this._elementRef.parentElement) {
            this._btnRef = document.createElement('button');
            this._btnRef.innerText = 'commit';
            this._btnRef.classList.add('btn', 'btn-commit');
            this._btnRef.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                commands_1.commitCommand(this._modulesPane.state.branch);
                if (this._btnRef) {
                    this._btnRef.disabled = true;
                }
            });
            this._elementRef.parentElement.appendChild(this._btnRef);
        }
        atom.project.onDidChangeFiles(async (events) => {
            let diffed = false;
            events.forEach(({ path }) => {
                if (path.includes(fullPath)) {
                    diffed = true;
                }
            });
            diffed && this._diff();
        });
    }
    _diff() {
        Object.entries(this._modulesPane.state.modules).forEach(async ([moduleName, moduleContent]) => {
            const file = this._dir.getFile(`${moduleName}.js`);
            const content = await file.read(true);
            if (moduleContent !== content && this._btnRef) {
                this._btnRef.disabled = false;
            }
        });
    }
    destroy() {
        if (!this._btnRef) {
            return;
        }
        this._btnRef.remove();
    }
}
exports.TreeViewDir = TreeViewDir;
//# sourceMappingURL=index.js.map