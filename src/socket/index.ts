/// <reference path='./index.d.ts' />

import * as SockJS from 'sockjs-client';
import { Subject, Observable, Observer } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

function isAuth(msg: any): boolean {
    return msg.data && msg.data.match && msg.data.match(/^auth ok (.*)$/);
}

function isSubscribe(channel: string, msg: any): boolean {
    if (msg.data[0] === channel) {
        return true;
    }

    return false;
}

export class Socket {
    private _socket: WebSocket;

    public url: string;
    public token: string | null = null;

    public connected: boolean = false;

    _unsubscribeSbj = new Subject();

    _messagesSbj = new Subject();
    public messages$ = this._messagesSbj.asObservable();

    _afterConnectSbj = new Subject();
    public afterConnect$ = this._afterConnectSbj.asObservable();

    constructor({ url, token }: ISocketSettings) {
        this.url = url;

        if (token) {
            this.token = token;
        }

        this._socket = new SockJS(this.url);

        this._socket.onopen = () => {
            this._socket.send(`auth ${ this.token }`);
        }

        this._socket.onmessage = (msg) => {
            let data;

            try {
                data = JSON.parse(msg.data);
            } catch(err) {
                data = msg.data;
            }

            this._messagesSbj.next({
                ...msg,
                data
            });
        }

        // TODO: Можно удалять после того как подключились
        this.messages$
            .pipe(filter((msg: any) => isAuth(msg)))
            .subscribe(() => {
                this.connected = true;
                this._afterConnectSbj.next();
            });
    }

    on(channel: string) {
        return Observable.create((observer: Observer<any>) => {
            if (this.connected) {
                this._socket.send(`subscribe ${ channel }`);
            } else {
                this.afterConnect$.subscribe(() => {
                    this._socket.send(`subscribe ${ channel }`);
                });
            }

            const destroy$ = this._unsubscribeSbj.asObservable()
                .pipe(filter((msg) => msg === `unsubscribe ${ channel }`));

            this.messages$
                .pipe(takeUntil(destroy$))
                .pipe(filter((msg: any) => isSubscribe(channel, msg)))
                .subscribe((data) => {
                    observer.next(data);
                }, () => {}, () => {
                    observer.complete();
                });
        });
    }

    off(channel: string) {
        const msg = `unsubscribe ${ channel }`;
        this._unsubscribeSbj.next(msg);
        this._socket.send(msg);
    }
}
