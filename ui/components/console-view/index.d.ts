declare interface IConsoleViewState {
    shard: any;
    shards: any;
    paused: boolean;
    messages: any[];
}

declare interface IConsoleViewProps {
    shard?: string;
    output: any;
    shards: any;

    onShard?: Function;
    onInput?: Function;
    onClose?: Function;
    onResizeStart?:Function;
}
