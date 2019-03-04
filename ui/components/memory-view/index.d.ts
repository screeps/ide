interface IMemoryViewState {
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
    watches: any;
    segment: string;

    onInput?: Function;
    onDelete?: Function;
    onShard?: Function;
    onClick?: Function;
    onClose?: Function;
    onResizeStart?:Function;

    onSegment?: Function;
    onSegmentRefresh?: Function;
    onSegmentUpdate?: Function;
}
