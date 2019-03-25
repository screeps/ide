"use strict";
/// <reference path='./index.d.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class WelcomeView extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (React.createElement("div", { className: 'screeps-ide screeps-welcome' },
            React.createElement("div", { className: 'screeps-welcome__content' },
                React.createElement("div", { className: 'screeps-welcome__logo' }),
                React.createElement("section", { className: 'screeps-welcome__section' },
                    React.createElement("p", null, "Welcome to the Screeps. Get familiar with the game and explore our API."),
                    React.createElement("ul", null,
                        React.createElement("li", null,
                            React.createElement("a", { href: 'https://screeps.com/a/#!/sim/tutorial' }, "Tutorial"),
                            " - Learn game basics step by step in our interactive tutorial"),
                        React.createElement("li", null,
                            React.createElement("a", { href: 'https://docs.screeps.com/api' }, "API Reference"),
                            " - Reference of all game objects, methods and prototypes"),
                        React.createElement("li", null,
                            React.createElement("a", { href: 'https://docs.screeps.com/contributed/rules.html' }, "Contributed articles"),
                            " - Read articles written by other players, or contribute your own"),
                        React.createElement("li", null,
                            React.createElement("a", { href: 'http://chat.screeps.com' }, "Chat"),
                            " - Join the game community in our Slack chat network"))),
                React.createElement("section", { className: 'screeps-welcome__section' },
                    React.createElement("label", null,
                        React.createElement("input", { className: 'input-checkbox', type: 'checkbox', checked: true, onChange: () => this.onChange() }),
                        "Show Welcome Guide when opening Atom")))));
    }
    onChange() {
    }
}
exports.default = WelcomeView;
//# sourceMappingURL=index.js.map