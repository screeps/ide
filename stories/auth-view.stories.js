import React from 'react';
import { useRef } from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { default as AuthView } from '../ui/components/auth-view';

function AuthViewInvalid() {
    const authViewRef = useRef(null);

    setTimeout(() => {
        if (!authViewRef.current) {
            return;
        }

        authViewRef.current.setState({
            isInvalid: true,
            isBlocking: true
        });
    });

    return (<AuthView ref={ authViewRef } />)
}

storiesOf('UI Components|Auth View', module)
    .add('Clear', () => (
        <AuthView />
    ))
    .add('Invalid', () => (
        <AuthViewInvalid />
    ));
