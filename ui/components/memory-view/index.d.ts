interface IMemoryPath {
    path: string;
    value: any;
}

interface IMemoryViewState {
    isProgressing: boolean;

    shard: any;
    shards: any;
    view: string;
    memory: IMemoryPath[];

    segment: string;
    segmentData: string;
    _segmentData: string;
    segmentHasChange: boolean;
}

interface IMemoryViewProps {
    onInput?: Function;
    onClose?: Function;

    shard: string;
    shards?: any;
    onShard?(shard: string): Promise<void>;

    memory?: IMemoryPath[];
    onMemory(path: string, shard: string): Promise<void>;
    onMemoryRefresh(path: string, shard: string): Promise<void>;
    onMemoryUpdate(path: string, value: any, shard: string): Promise<void>;
    onMemoryRemove(path: string, shard: string): Promise<void>;
    onMemoryDelete(path: string): Promise<void>;

    segment: string;
    onSegment(segment: string, shard: string): Promise<void>;
    onSegmentRefresh(segment: string, shard: string): Promise<void>;
    onSegmentUpdate(segment: string, data: string, shard: string): Promise<void>;
}
