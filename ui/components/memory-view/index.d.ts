interface IMemoryViewState {
    shards: any;
    view: string;
}

interface IMemoryViewProps {
    shards: any;
    watches: any;

    onClose?: Function;
    onResizeStart?:Function;
}
