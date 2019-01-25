"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const ui_1 = require("../../../ui");
let clientY;
class MemoryPane {
    constructor(_service) {
        this._service = _service;
        this.onClose = () => {
            this._panel.destroy();
        };
        this.onResizeStart = (event) => {
            clientY = event.clientY;
            document.addEventListener('mousemove', this.onResize);
            document.addEventListener('mouseup', this.onResizeStop);
        };
        this.onResize = (event) => {
            const offsetY = event.clientY - clientY;
            clientY = event.clientY;
            //@ts-ignore
            const height = parseInt(this.element.style.height, 10);
            this.element.style.height = `${height - offsetY}px`;
        };
        this.onResizeStop = () => {
            document.removeEventListener('mousemove', this.onResize);
            document.removeEventListener('mouseup', this.onResizeStop);
        };
        this.element = document.createElement('div');
        this.element.style.height = '300px';
        this.render({});
        this._panel = atom.workspace.addBottomPanel({
            item: this.element,
            visible: true
        });
    }
    render({}) {
        ReactDOM.render(React.createElement(ui_1.MemoryView, { shards: this._service.shards$, watches: [], onClose: this.onClose, onResizeStart: this.onResizeStart }), this.element);
    }
    getURI() {
        return 'atom://screeps-ide-memory-view';
    }
    getTitle() {
        return '';
    }
    isPermanentDockItem() {
        return true;
    }
    getAllowedLocations() {
        return ['top'];
    }
}
exports.MemoryPane = MemoryPane;
//# sourceMappingURL=index.js.map