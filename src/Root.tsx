import queryString from 'query-string';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import { createStore } from 'redux';

import BindingAppContainer from './container/BindingAppContainer';
import { BindAction } from './store/action';
import { bindReducer } from './store/reducer';
import { StoreState, storeStateInit } from './store/types';

const store = createStore<StoreState, BindAction, any, any>(bindReducer, storeStateInit);

const Root = () => (
    <Provider store={store}>
        <BrowserRouter>
            <Route
                render={props => (
                    <BindingAppContainer
                        query={queryString.parse(props.location.search, {
                            arrayFormat: 'comma',
                        })}
                    />
                )}
            />
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(<Root />, document.getElementById('root'));
