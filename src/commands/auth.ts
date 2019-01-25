import { filter, switchMap } from 'rxjs/operators';

import { AtomModal } from '../components/atom-modal';
import { AuthModal } from '../../ui';

import { getApi } from '../utils';

export function authCommand() {
    console.log('SCREEPS__AUTH');
    const api = getApi();

    const authModalRef = new AtomModal(AuthModal);
    authModalRef.events$
        .pipe(filter(({ type }) => type === 'AUTH_SUBMIT'))
        .pipe(switchMap(({ payload }) => api.signIn(payload)))
        .subscribe();
  }
