import * as ReactDOM from 'react-dom';
import { update } from './updater';

const defaultRenderEngine = (state, view, activatedActions, container) => (
    ReactDOM.render(
        view({ state: state, actions: activatedActions }),
        container
    )
)

export const app = (state, view, actions, container, config) => {

    const run = config && config.renderEngine ? config.renderEngine : defaultRenderEngine;

    const updateState = (node, newState, options) => {
        update(state, node, newState);
        const rerender = (options && options.rerender === false) ? false : true;
        return stateChangeComplete(rerender);
    };

    const updateMulti = (updateArray, options) => {
        updateArray.reduce((ac, cv) => (update(ac, cv.node, cv.value)), state);
        const rerender = (options && options.rerender === false) ? false : true;
        return stateChangeComplete(rerender);
    };

    const stateChangeComplete = (rerender) => {
        if (!rerender) { return; }
        if (config && config.beforeRender) { config.beforeRender(state, activatedActions); }
        run(state, view, activatedActions, container);
        return;
    }

    const goto = (path) => {
        history.pushState(undefined, '', path);
        const route = window.location.pathname.split('/');
        return updateState('route', route);
    }

    const addActions = (actionsToAdd) => {
        const activatedActionsToAdd = actionsToAdd(fn);
        Object.keys(activatedActionsToAdd).forEach(key => activatedActions[key] = activatedActionsToAdd[key]);
        return;
    }

    const fn = {
        updateState: updateState,
        updateMulti: updateMulti,
        goto: goto,
        addActions: addActions,
    };

    const activatedActions = actions(fn, state, actions);
    
    window.onpopstate = (event) => {
        const route = window.location.pathname.split('/');
        return updateState('route', route);
    }
    
    const route = window.location.pathname.split('/');
    return updateState('route', route);
}