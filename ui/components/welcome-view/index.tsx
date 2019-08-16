/// <reference path='./index.d.ts' />

import * as React from 'react';
import { useState, useEffect } from 'react';

export default function(props: IWelcomeViewProps) {

    const [showOnStartup, setShowOnStartup] = useState(props.showOnStartup);

    useEffect(() => {
        setShowOnStartup(props.showOnStartup);
    }, [props.showOnStartup]);

    return (
        <div className='screeps-ide screeps-welcome'>
            <div className='screeps-welcome__content'>
                {/* <header> */}
                <div className='screeps-welcome__logo'></div>
                {/* </header> */}

                <section className='screeps-welcome__section'>
                    <p>Screeps is a MMO sandbox game for programmers. How to get started:</p>

                    <ul>
                        <li>
                            Visit our <a href='https://screeps.com' target='_blank'>website</a> to create an account.
                        </li>
                        <li>
                            <button className='btn' onClick={ onSignin }>Log into your account</button> using your email and password. Your password is not stored in Atom, we only use it to create an auth token.
                        </li>
                        <li>
                            Browse your code branches and modules, or <button className='btn' onClick={ onCreateNewProject }>Create a new project</button> to sync local files.
                        </li>
                        <li>
                            Use any other third-party packages to work with your local project files.
                        </li>
                    </ul>
                </section>

                <section className='screeps-welcome__section'>
                    <label>
                        <input className='input-checkbox' type='checkbox' checked={ showOnStartup } onChange={ onChangeShowOnStartup } />
                        Show Welcome Guide when opening Atom
                    </label>
                </section>
            </div>
        </div>
    );

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