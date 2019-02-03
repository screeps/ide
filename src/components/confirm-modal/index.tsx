import { filter, tap } from 'rxjs/operators';

import { AtomModal } from '../../components/atom-modal';
import { default as ConfirmModal } from '../../../ui/components/confirm';

export default function(props: { [key: string]: any }): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const confirmModalRef = new AtomModal(ConfirmModal, props);
        confirmModalRef.events$
            .pipe(filter(({ type }) => type === 'MODAL_SUBMIT'))
            .pipe(tap(() => confirmModalRef.hide()))
            .pipe(tap(() => resolve(true)))
            .subscribe();
    
        confirmModalRef.events$
            .pipe(filter(({ type }) => type === 'MODAL_CANCEL'))
            .pipe(tap(() => reject(false)))
            .subscribe();
    });
}
