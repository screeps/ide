declare interface IConsoleViewState {
    shard: any;
    shards: any;
    paused: boolean;
    messages: any[];
}

declare interface IConsoleViewProps {
    shard?: string;
    output?: any;
    shards?: any;
    messages?: any[];

    onShard?(shard: string): Promise<void>;
    onInput?(expression: string): Promise<void>;
    onClose?(): Promise<void>;
    onPause?(): Promise<void>;
    onResume?(): Promise<void>;
}
