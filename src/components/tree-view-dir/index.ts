const path = require('path');

import { Directory } from 'atom';

// import { Service } from '../../service';
import { configGetter } from '../../config';
import { commitCommand } from '../../commands';
import { ModulesPane } from '../modules-pane';

export class TreeViewDir {
    private _dir: Directory;
    private _elementRef: HTMLElement | null;

    private _btnRef: HTMLButtonElement | null = null;

    constructor(
        private _modulesPane: ModulesPane
    ) {
        const srcDir = configGetter('src');
        const projectPath = atom.project.getPaths()[0];
        const fullPath = path.resolve(projectPath, srcDir);

        this._dir = new Directory(fullPath);
        this._elementRef = document.querySelector(`[data-path="${ fullPath.replace(/["\\]/g, '\\$&')}"]`);

        if (this._elementRef && this._elementRef.parentElement) {
            this._btnRef = document.createElement('button');
            this._btnRef.innerText = 'commit';
            this._btnRef.classList.add('btn', 'btn-commit');

            this._btnRef.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                commitCommand(this._modulesPane.state.branch);

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
        // @ts-ignore
        Object.entries(this._modulesPane.state.modules).forEach(async ([moduleName, { content }]) => {
            const file = this._dir.getFile(`${ moduleName }.js`);
            const _content = await file.read(true) as String;

            if (_content !== content && this._btnRef) {
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
