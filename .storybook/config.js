import { configure, addParameters } from '@storybook/react';
import { create } from '@storybook/theming';

// coral / ocean highlights
const theme = create({
    base: 'dark',

    colorPrimary: '#FF4785',
    colorSecondary: '#1EA7FD',

    // UI
    appBg: '#21252b',
    appContentBg: '#21252b',
    appBorderColor: 'black',
    appBorderRadius: 4,

    // Toolbar default and active colors
    barTextColor: 'silver',
    barSelectedColor: 'black',
    barBg: '#21252b',
});
addParameters({
    options: { theme }
});
import './style.less';

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /\.stories\.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
