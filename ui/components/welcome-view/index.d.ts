interface IWelcomeViewState {
    showOnStartup: boolean;
}

interface IWelcomeViewProps {
    showOnStartup: boolean;

    onChangeShowOnStartup?(value: boolean): void;
}
