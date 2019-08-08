export { default as AuthView, MODAL_CLOSE } from './components/auth-view';
export { default as TokenModal } from './components/token';
export { default as ModulesView} from './components/modules-view';
export { default as ConsoleView } from './components/console-view';
export { default as MemoryView } from './components/memory-view';
export { default as ResizablePanel } from './components/resizable-panel';
export { default as WelcomeView } from './components/welcome-view';
export {
    BTN_CLONE as BTN_BRANCHES_CLONE,
    BTN_DELETE as BTN_BRANCHES_DELETE,
    default as BranchesView
} from './components/branches-view';

export {
    BTN_REMOVE as PATH_BTN_REMOVE,
    BTN_DELETE as PATH_BTN_DELETE,
    BTN_UPDATE as PATH_BTN_UPDATE,
    BTN_RELOAD as PATH_BTN_RELOAD,
    BTN_CANCEL as PATH_BTN_CANCEL
} from './components/memory-view/components/item';
export {
    MEMORY_MAIN_VIEW,
    MEMORY_SEGMENTS_VIEW
} from './components/memory-view/components/controls';
export {
    BTN_SAVE as BTN_SEGMENTS_SAVE,
    BTN_RELOAD as BTN_SEGMENTS_RELOAD
} from './components/memory-view/components/segment-controls';
