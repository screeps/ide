interface IWelcomeViewProps {
    showOnStartup: boolean;

    onSignin?(): Promise<void>;
    onCreateNewProject?(): Promise<void>;
    onChangeShowOnStartup?(value: boolean): void;
}
