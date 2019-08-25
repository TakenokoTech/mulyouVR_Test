import React from 'react';
import queryString, { ParsedQuery } from 'query-string';
import './AppContainer.css';
import { MapDispatchProps } from './BindingAppContainer';
import { StoreState } from '../store/types';

interface AppContainerProps extends MapDispatchProps, StoreState {
    query: ParsedQuery<string>;
}

interface AppContainerState {}

export class AppContainer extends React.Component<AppContainerProps, AppContainerState> {
    constructor(props: AppContainerProps) {
        super(props);
    }

    componentDidMount() {
        console.log('app.componentDidMount');
    }

    shouldComponentUpdate(nextProps: AppContainerProps, nextState: AppContainerState, nextContext: any) {
        console.log('shouldComponentUpdate', nextProps, nextState);
        return true;
    }

    render() {
        return (
            <div className="app-container" ref="frame">
                aaa
            </div>
        );
    }
}
