"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class MemorySegmentView extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = (event) => {
            this.setState({
                segment: event.target.value
            });
            this.props.onChange && this.props.onChange(event.target.value);
        };
        this.state = {
            segment: props.segment
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.segment !== this.state.segment) {
            this.setState({ segment: nextProps.segment ? nextProps.segment : '' });
        }
    }
    render() {
        return (React.createElement("div", { className: 'screeps-memory__segment' },
            React.createElement("textarea", { className: 'native-key-bindings', value: this.state.segment, onChange: this.onChange, placeholder: 'NO DATA' })));
    }
}
exports.default = MemorySegmentView;
//# sourceMappingURL=segment.js.map