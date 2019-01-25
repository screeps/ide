/// <reference path='./index.d.ts' />

import * as SockJS from 'sockjs-client';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

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

    // TODO: set private
    public _messagesSbj = new Subject();
    public messages$ = this._messagesSbj.asObservable();

    private _afterConnectSbj = new Subject();
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

        this.messages$
            .pipe(filter((msg: any) => isAuth(msg)))
            .subscribe(() => {
                this.connected = true;
                this._afterConnectSbj.next();
            });
    }

    on(channel: string) {
        if (this.connected) {
            this._socket.send(`subscribe ${ channel }`);
        } else {
            this.afterConnect$.subscribe(() => {
                this._socket.send(`subscribe ${ channel }`);
            });
        }

        const pipe$ = this.messages$.pipe(filter((msg: any) => isSubscribe(channel, msg)));

        return pipe$;
    }
}
