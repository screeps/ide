"use strict";
/// <reference path='./index.d.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
const SockJS = require("sockjs-client");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
function isAuth(msg) {
    return msg.data && msg.data.match && msg.data.match(/^auth ok (.*)$/);
}
function isSubscribe(channel, msg) {
    if (msg.data[0] === channel) {
        return true;
    }
    return false;
}
class Socket {
    constructor({ url, token }) {
        this.token = null;
        this.connected = false;
        this._unsubscribeSbj = new rxjs_1.Subject();
        this._messagesSbj = new rxjs_1.Subject();
        this.messages$ = this._messagesSbj.asObservable();
        this._afterConnectSbj = new rxjs_1.Subject();
        this.afterConnect$ = this._afterConnectSbj.asObservable();
        this.url = url;
        if (token) {
            this.token = token;
        }
        this._socket = new SockJS(this.url);
        this._socket.onopen = () => {
            this._socket.send(`auth ${this.token}`);
        };
        this._socket.onmessage = (msg) => {
            let data;
            try {
                data = JSON.parse(msg.data);
            }
            catch (err) {
                data = msg.data;
            }
            this._messagesSbj.next(Object.assign({}, msg, { data }));
        };
        // TODO: Можно удалять после того как подключились
        this.messages$
            .pipe(operators_1.filter((msg) => isAuth(msg)))
            .subscribe(() => {
            this.connected = true;
            this._afterConnectSbj.next();
        });
    }
    on(channel) {
        return rxjs_1.Observable.create((observer) => {
            if (this.connected) {
                this._socket.send(`subscribe ${channel}`);
            }
            else {
                this.afterConnect$.subscribe(() => {
                    this._socket.send(`subscribe ${channel}`);
                });
            }
            const destroy$ = this._unsubscribeSbj.asObservable()
                .pipe(operators_1.filter((msg) => msg === `unsubscribe ${channel}`));
            this.messages$
                .pipe(operators_1.takeUntil(destroy$))
                .pipe(operators_1.filter((msg) => isSubscribe(channel, msg)))
                .subscribe((data) => {
                observer.next(data);
            }, () => { }, () => {
                observer.complete();
            });
        });
    }
    off(channel) {
        const msg = `unsubscribe ${channel}`;
        this._unsubscribeSbj.next(msg);
        this._socket.send(msg);
    }
}
exports.Socket = Socket;
//# sourceMappingURL=index.js.map