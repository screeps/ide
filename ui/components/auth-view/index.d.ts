interface IAuthModalProps {
    onCancel?: Function;
    onSubmit?: Function;
}

interface IAuthModalState {
    isInvalid: boolean;
    isBlocking: boolean;
}
