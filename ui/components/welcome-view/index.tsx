/// <reference path='./index.d.ts' />

import * as React from 'react';

export default class WelcomeView extends React.Component<IWelcomeViewProps> {
    //@ts-ignore
    props: IWelcomeViewProps;

    constructor(props: IWelcomeViewProps) {
        super(props);
    }

    public render() {
        return (
            <div className='screeps-ide screeps-welcome'>
                {/* <header> */}
                <div className='screeps-welcome__logo'></div>
                {/* </header> */}

                <section className='screeps-welcome__section'>
                    <p>Welcome to the Screeps. Get familiar with the game and explore our API.</p>

                    <ul>
                        <li>
                            <a href='https://screeps.com/a/#!/sim/tutorial'>Tutorial</a> - 
                            Learn game basics step by step in our interactive tutorial
                        </li>
                        <li>
                            <a href='https://docs.screeps.com/api'>API Reference</a> - 
                            Reference of all game objects, methods and prototypes
                        </li>
                        <li>
                            <a href='https://docs.screeps.com/contributed/rules.html'>Contributed articles</a> - 
                            Read articles written by other players, or contribute your own
                        </li>
                        <li>
                            <a href='http://chat.screeps.com'>Chat</a> - 
                            Join the game community in our Slack chat network
                        </li>
                    </ul>
                </section>

                <section className='screeps-welcome__section'>
                    <label>
                        <input className='input-checkbox' type='checkbox' checked={ true } onChange={() => this.onChange()} />
                        Show Welcome Guide when opening Atom
                    </label>
                </section>
            </div>
        );
    }

    onChange() {

    }
}