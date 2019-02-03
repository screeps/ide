import { filter, tap } from 'rxjs/operators';

import { AtomModal } from '../../components/atom-modal';
import { default as PromptModal } from '../../../ui/components/prompt';

export default function(props: { [key: string]: any }): Promise<string> {
    return new Promise((resolve, reject) => {
        const promptModalRef = new AtomModal(PromptModal, props);
        promptModalRef.events$
            .pipe(filter(({ type }) => type === 'MODAL_SUBMIT'))
            .pipe(tap(() => promptModalRef.hide()))
            .pipe(tap(({ payload }) => resolve(payload)))
            .subscribe();
    
        promptModalRef.events$
            .pipe(filter(({ type }) => type === 'MODAL_CANCEL'))
            .pipe(tap(() => reject(null)))
            .subscribe();
    });
}
