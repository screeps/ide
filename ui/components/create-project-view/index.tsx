// import * as React from 'react';
import * as React from 'react';
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

type CreateProjectProps = {
    branch: string;
    branches: IBranch[];
    projectPath: string;
    projectPathLabel: string;
    projectPathReadonly: boolean;
    downloadReadonly: boolean;
    submitBtn: string;

    onClick(): void,

    onCancel(): void;
    onSubmit(data: {
        projectPath: string;
        download: boolean;
        branch: string;
    }): void;
}

export default forwardRef(function(props: CreateProjectProps, ref) {
    const [valid, setValid] = useState(false);

    const [branch, setBranch] = useState(props.branch);
    const [branches, setBranches] = useState(props.branches || [])

    const [projectPath, setProjectPathValue] = useState(props.projectPath || '');
    const [projectPathLabel] = useState(props.projectPathLabel || 'Please enter a new project folder path');
    const [projectPathReadonly] = useState(props.projectPathReadonly || false);

    const [download, setDownloadValue] = useState(true);
    const [downloadReadonly] = useState(props.downloadReadonly || false);

    const [submitBtn] = useState(props.submitBtn || 'Create');

    useImperativeHandle(ref, () => ({
        setProjectPathValue(path: string) {
            setProjectPathValue(path);
        },
        setBranches(_: IBranch[]) {
            setBranches(_)
        }
    }));

    useEffect(() => {
        let valid = false;
        if (branch && projectPath) {
            valid = true;
        }

        setValid(valid);
    }, [branch, projectPath])

    return (
        <div className='screeps-ide screeps-modal screeps-create-project'>
            <header>
                <div className='logotype' />
                <button className='btn _cross' onClick={onCancel}/>
            </header>
            <form className='--indented'>
                <fieldset className='screeps-field'>
                    <legend>{ projectPathLabel }:</legend>
                    <input
                        className='native-key-bindings'

                        type='text'
                        name='project-path'

                        value={ projectPath }
                        onChange={onInput}
                        onClick={props.onClick}

                        required={ true }
                        readOnly={ projectPathReadonly }
                        autoFocus={ true }

                        tabIndex={ 1 }
                    />
                    <div className='underline' />
                </fieldset>
                <fieldset className='screeps-field'>
                    <legend>Select branch:</legend>
                    <select className='native-key-bindings input-select'
                        name='branch-name'
                        value={ branch }

                        onChange={(event) => onBranch(event)}
                        required={ true }

                        tabIndex={ 2 }
                    >
                        { !branch && (<option value={ branch }></option>) }
                        { branches.map(({ _id, branch }) => {
                            return (<option key={ _id } value={ branch }>{ branch }</option>);
                        })}
                    </select>
                </fieldset>
                <fieldset className='screeps-field' style={ { marginBottom: 0 } }>
                    <legend>Select language:</legend>
                    <label>
                        <input className='native-key-bindings input-radio' type='radio'
                            name='javascript'
                            checked={ true }
                            onChange={() => {}}

                            tabIndex={ 3 }
                        />
                        <span>JavaScript &mdash; Native language for Screeps, no requirements</span>
                    </label>
                    <label>
                        <input className='native-key-bindings input-radio' type='radio'
                            name='typescript'
                            checked={ false }
                            onChange={() => {}}

                            disabled={ true }

                            tabIndex={ 4 }
                        />
                        <span>TypeScript &mdash; Advanced language with types support, requires TypeScript compilator package to run. <em>(UNDER DEVELOPMENT)</em></span>
                    </label>
                </fieldset>
                <fieldset className='screeps-field'>
                    <label>
                        <input className='native-key-bindings input-checkbox' type='checkbox'
                            name='download'
                            checked={ download }
                            onChange={() => !downloadReadonly && setDownloadValue(!download)}

                            readOnly={ downloadReadonly }

                            tabIndex={ 5 }
                        />
                        Fetch to this folder now
                    </label>
                </fieldset>
            </form>
            <footer>
                <button
                    className='btn btn--big btn--transparent'
                    onClick={onCancel}

                    tabIndex={ 6 }
                >Cancel</button>
                <button
                    className='btn btn--big btn--primary' type='submit'
                    disabled={ !valid }

                    onClick={onSubmit}

                    tabIndex={ 7 }
                >{ submitBtn }</button>
            </footer>
        </div>
    );

    // Private component actions.
    function onInput(event: React.ChangeEvent) {
        const target = event.target as HTMLInputElement;
        const value = target.value;

        setProjectPathValue(value);
    }

    function onBranch(event: React.ChangeEvent<HTMLSelectElement>) {
        const target = event.target as HTMLSelectElement;
        const value = target.value;

        setBranch(value);
    }

    // Public component output actions.
    function onCancel() {
        props.onCancel && props.onCancel();
    }

    function onSubmit() {
        props.onSubmit && props.onSubmit({
            projectPath,
            download,
            branch
        });
    }
})
