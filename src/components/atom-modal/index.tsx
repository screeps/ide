import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Subject, Observable } from 'rxjs';

interface ICredentials {
    username: String;
    password: String;
}

interface IAction {
    type: String;
    payload?: any;
}

export class AtomModal {
    private _element: HTMLElement;
    private _atomModalPanelRef: any;

    private _eventsSbj: Subject<IAction> = new Subject();
    public events$: Observable<IAction>;

    public ref: any = React.createRef();

    constructor(Component: any, props: any = {}) {
        this._element = document.createElement('div');
        this.events$ = this._eventsSbj.asObservable();

        ReactDOM.render(
            <Component ref={ this.ref }
                { ...props }

                onCancel={this.onCancel}
                onSubmit={this.onSubmit}
            />,
            this._element as HTMLElement
        );

        this._atomModalPanelRef = atom.workspace.addModalPanel({
            item: this._element,
            visible: true
        });
    }

    hide() {
        this._atomModalPanelRef.hide();
    }

    destroy() {
        this._atomModalPanelRef.destroy();
    }

    setState(state: any) {
        this.ref.current.setState(state);
    }

    onCancel = () => {
        this._eventsSbj.next({ type: 'MODAL_CANCEL '});
        this.destroy();
    }

    onSubmit = (payload: ICredentials) => {
        this._eventsSbj.next({ type: 'MODAL_SUBMIT', payload });
    }
  }
