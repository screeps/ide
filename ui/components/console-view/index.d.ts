declare interface IConsoleViewState {
    shards: any;
    paused: boolean;
    messages: any[];
}

declare interface IConsoleViewProps {
    output: any;
    shards: any;

    onShard?: Function;
    onInput?: Function;
    onClose?: Function;
    onResizeStart?:Function;
}
