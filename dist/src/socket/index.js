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
        // TODO: set private
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
        this.messages$
            .pipe(operators_1.filter((msg) => isAuth(msg)))
            .subscribe(() => {
            this.connected = true;
            this._afterConnectSbj.next();
        });
    }
    on(channel) {
        if (this.connected) {
            this._socket.send(`subscribe ${channel}`);
        }
        else {
            this.afterConnect$.subscribe(() => {
                this._socket.send(`subscribe ${channel}`);
            });
        }
        const pipe$ = this.messages$.pipe(operators_1.filter((msg) => isSubscribe(channel, msg)));
        return pipe$;
    }
    off(channel) {
        this._socket.send(`unsubscribe ${channel}`);
    }
}
exports.Socket = Socket;
//# sourceMappingURL=index.js.map