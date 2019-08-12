interface IMemoryPath {
    _id: string;
    path: string;
    value: any;
}

interface IMemoryViewProps {
    view?: string;
    onChangeView?(view: string): void;
    isProgressing?: boolean;

    onInput?: Function;
    onClose?: Function;

    shard: string;
    shards?: any;
    onShard?(shard: string): Promise<void>;

    memory?: IMemoryPath[];
    onMemory(path: string, shard: string): Promise<void>;
    onMemoryReload(path: string, shard: string): Promise<void>;
    onMemoryUpdate(path: string, value: any, shard: string): Promise<void>;
    onMemoryRemove(path: string, shard: string): Promise<void>;
    onMemoryDelete(path: string): Promise<void>;
    onMemoryCancel(path: string): Promise<void>;

    segment: string;
    segmentData: string;
    onSegment(segment: string, shard: string): Promise<void>;
    onSegmentRefresh(segment: string, shard: string): Promise<void>;
    onSegmentUpdate(segment: string, data: string, shard: string): Promise<void>;
}
