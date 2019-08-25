import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import queryString, { ParsedQuery } from 'query-string';
import { StoreState } from '../store/types';
import * as actions from '../store/action';
import { AppContainer } from './AppContainer';
import Point from '../utils/Point';

export interface MapDispatchProps {
    initState: () => void;
    setScreenSize: (point: Point) => void;
}

const mapStateToProps = (state: StoreState) => {
    return state;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.BindAction>): MapDispatchProps => {
    return {
        initState: () => dispatch(actions.initState()),
        setScreenSize: (point: Point) => dispatch(actions.setScreenSize(point)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AppContainer);
