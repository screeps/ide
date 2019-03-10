interface IMemoryPath {
    path: string;
    value: any;
}

interface IMemoryViewState {
    isProgressing: boolean;

    shard: any;
    shards: any;
    view: string;
    watches: IMemoryPath[];

    segment: string;
    segmentData: string;
    _segmentData: string;
    segmentHasChange: boolean;
}

interface IMemoryViewProps {
    pipe?: any;
    shard: string;
    shards: any;

    onInput?: Function;
    onShard?: Function;
    onClose?: Function;

    watches: IMemoryPath[];
    onMemory?: Function;
    onMemoryRefresh?: Function;
    onMemoryUpdate?: Function;
    onMemoryRemove?: Function;
    onMemoryDelete?: Function;

    segment: string;
    onSegment?: Function;
    onSegmentRefresh?: Function;
    onSegmentUpdate?: Function;
}
