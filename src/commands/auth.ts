import { empty, from } from 'rxjs';
import { filter, switchMap, tap, map, catchError } from 'rxjs/operators';

import { AtomModal } from '../components/atom-modal';
import { AuthView } from '../../ui';
import { TokenModal } from '../../ui';

import { Api } from '../api';
import { configGetter, configSetter } from '../config';

export function createTokenCommand(api: Api) {
    let tokenModalRef: AtomModal;

    return from(api.createAuthToken())
        .pipe(switchMap(({ token }) => {
            tokenModalRef = new AtomModal(TokenModal, {
                token
            });

            return tokenModalRef.events$.pipe(map((action: any) => {
                action.token = token;
                return action;
            }));
        }))
        .pipe(filter(({ type }) => type === 'MODAL_SUBMIT'))
        .pipe(tap((data) => {
            tokenModalRef.hide();
            configSetter('global.authToken', data.token);
        }))
        .pipe(catchError(() => {
            tokenModalRef.hide();
            return empty();
        }));
}

export function authCommand(): Promise<any> {
    const apiUrl = configGetter('apiUrl') as string;
    const api = new Api({ url: apiUrl });

    return new Promise((resolve, reject) => {
        const authModalRef = new AtomModal(AuthView);

        authModalRef.events$
            .pipe(filter(({ type }) => type === 'MODAL_SUBMIT'))
            .pipe(switchMap(({ payload }) => {
                return from(api.signIn(payload))
                    .pipe(switchMap(() => {
                        authModalRef.hide();
                        return createTokenCommand(api);
                    }))
                    .pipe(catchError(() => {
                        authModalRef.setState({
                            isInvalid: true,
                            isBlocking: true
                        });

                        return empty();
                    }))
            }))
            .pipe(tap(() => {
                resolve(api);
            }))
            .subscribe();

        authModalRef.events$
            .pipe(filter(({ type }) => type === 'MODAL_CANCEL'))
            .pipe(tap(() => {
                reject();
            }))
            .subscribe();
    })
  }
