// import * as React from 'react';
import * as React from 'react';
import { useState } from 'react';

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

export default function(props: CreateProjectProps) {
    const [branch, setBranchValue] = useState(props.branch);

    const [projectPath, setProjectPathValue] = useState(props.projectPath || '');
    const [projectPathLabel] = useState(props.projectPathLabel || 'Please enter a new project folder path');
    const [projectPathReadonly] = useState(props.projectPathReadonly || false);

    const [download, setDownloadValue] = useState(true);
    const [downloadReadonly] = useState(props.downloadReadonly || false);

    const [submitBtn] = useState(props.submitBtn || 'Create');

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
                    <legend>Select branch</legend>
                    <select className='native-key-bindings input-select'
                        name='branch-name'
                        value={ branch }

                        onChange={(event) => onBranch(event)}

                        tabIndex={ 2 }
                    >
                        { props.branches.map(({ _id, branch }) => {
                            return (<option key={ _id } value={ branch }>{ branch }</option>);
                        })}
                    </select>
                </fieldset>
                <fieldset className='screeps-field'>
                    <label>
                        <input className='native-key-bindings input-checkbox' type='checkbox'
                            name='download'
                            checked={ download }
                            onChange={() => !downloadReadonly && setDownloadValue(!download)}

                            readOnly={ downloadReadonly }

                            tabIndex={ 3 }
                        />
                        Download modules from screeps to this folder
                    </label>
                </fieldset>
            </form>
            <footer>
                <button
                    className='btn btn--big btn--transparent'
                    onClick={onCancel}

                    tabIndex={ 4 }
                >Cancel</button>
                <button
                    className='btn btn--big btn--primary' type='submit'
                    disabled={ !projectPath }

                    onClick={onSubmit}

                    tabIndex={ 5 }
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

        setBranchValue(value);
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
}