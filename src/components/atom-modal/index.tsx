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

  constructor(Component: any) {
    this._element = document.createElement('div');
    this.events$ = this._eventsSbj.asObservable();

    ReactDOM.render(
      <Component onCancel={this.onCancel} onSubmit={this.onSubmit}/>,
      this._element as HTMLElement
    );

    this._atomModalPanelRef = atom.workspace.addModalPanel({
      item: this._element,
      visible: true
    });
  }

  onCancel = () => {
    this._eventsSbj.next({ type: 'AUTH_CANCEL '});
    this._atomModalPanelRef.hide();
  };

  onSubmit = (payload: ICredentials) => {
    console.log(1, 'onSubmit', payload);
    this._eventsSbj.next({ type: 'AUTH_SUBMIT', payload });
  }
}
