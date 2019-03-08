interface IMemoryViewState {
    isProgressing: boolean;

    shard: any;
    shards: any;
    view: string;
    watches: any;

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
    onDelete?: Function;
    onShard?: Function;
    onClose?: Function;
    onResizeStart?:Function;

    watches: any;
    onMemory?: Function;
    onMemoryRefresh?: Function;
    onMemoryUpdate?: Function;

    segment: string;
    onSegment?: Function;
    onSegmentRefresh?: Function;
    onSegmentUpdate?: Function;
}
