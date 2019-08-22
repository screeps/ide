"use strict";
/// <reference path='./index.d.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
function default_1(props) {
    const [showOnStartup, setShowOnStartup] = react_1.useState(props.showOnStartup);
    react_1.useEffect(() => {
        setShowOnStartup(props.showOnStartup);
    }, [props.showOnStartup]);
    return (React.createElement("div", { className: 'screeps-ide screeps-welcome' },
        React.createElement("div", { className: 'screeps-welcome__content' },
            React.createElement("div", { className: 'screeps-welcome__logo' }),
            React.createElement("section", { className: 'screeps-welcome__section' },
                React.createElement("p", null, "Screeps is a MMO sandbox game for programmers. How to get started:"),
                React.createElement("ul", null,
                    React.createElement("li", null,
                        "Visit our ",
                        React.createElement("a", { href: 'https://screeps.com', target: '_blank' }, "website"),
                        " to create an account."),
                    React.createElement("li", null,
                        React.createElement("button", { className: 'btn', onClick: onSignin }, "Log into your account"),
                        " using your email and password. Your password is not stored in Atom, we only use it to create an auth token."),
                    React.createElement("li", null,
                        "Browse your code branches and modules, or ",
                        React.createElement("button", { className: 'btn', onClick: onCreateNewProject }, "Create a new project"),
                        " to sync local files."),
                    React.createElement("li", null, "Use any other third-party packages to work with your local project files."))),
            React.createElement("section", { className: 'screeps-welcome__section' },
                React.createElement("label", null,
                    React.createElement("input", { className: 'input-checkbox', type: 'checkbox', checked: showOnStartup, onChange: onChangeShowOnStartup }),
                    "Show Welcome Guide when opening Atom")))));
    function onSignin() {
        props.onSignin && props.onSignin();
    }
    function onCreateNewProject() {
        props.onCreateNewProject && props.onCreateNewProject();
    }
    function onChangeShowOnStartup() {
        setShowOnStartup(!showOnStartup);
        props.onChangeShowOnStartup && props.onChangeShowOnStartup(!showOnStartup);
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map