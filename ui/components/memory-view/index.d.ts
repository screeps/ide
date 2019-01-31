interface IMemoryViewState {
    shard: any;
    shards: any;
    view: string;
    watches: any;
}

interface IMemoryViewProps {
    pipe?: any;
    shard: string;
    shards: any;
    watches: any;

    onShard?: Function;
    onClick?: Function;
    onClose?: Function;
    onResizeStart?:Function;
}
