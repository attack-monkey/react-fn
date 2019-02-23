import * as ReactDOM from 'react-dom';
import { iu } from 'iu-ts';

interface UpdateOptions {
    rerender: false
}

interface Multi { node: string | string[], value: any };

export interface Fn {
    updateState: (node: string, newState: any, options?: UpdateOptions) => any,
    updateMulti: (updateArray: Multi[], options?: UpdateOptions) => any,
    getState: () => any,
    relay: () => any,
    goto: (path: string) => void,
    addActions: (actionsToAdd: any) => void,
}

interface Config {
    renderEngine?: any,
    beforeRender?: (state: any, actions: any) => void
}

const defaultRenderEngine = (state: any, view: any, activatedActions: any, container: any) => (
    ReactDOM.render(
        view({ state: state, actions: activatedActions }),
        container
    )
)

export const app = (state: any, view: any, actions: any, container: any, config?: Config) => {

    const run = config && config.renderEngine ? config.renderEngine : defaultRenderEngine;

    const getState = () => (() => {
        try { return JSON.parse(JSON.stringify(state)) } catch (e) { return {} }
    })();

    const updateState = (node: string, newState: any, options?: UpdateOptions) => {
        state = iu(state, node, newState);
        const rerender = (options && options.rerender === false) ? false : true;
        return stateChangeComplete(rerender);
    };

    const updateMulti = (updateArray: Multi[], options?: UpdateOptions) => {
        state = updateArray.reduce((ac: any, cv) => (iu(ac, cv.node, cv.value)), state);
        const rerender = (options && options.rerender === false) ? false : true;
        return stateChangeComplete(rerender);
    };

    const stateChangeComplete = (rerender: boolean) => {
        if (!rerender) { return; }
        if (config && config.beforeRender) { config.beforeRender(state, activatedActions); }
        run(state, view, activatedActions, container, fn);
        return;
    }

    const relay: any = () => actions(fn);

    const goto: (path: string) => void = (path: string) => {
        history.pushState(undefined, '', path);
        const route = window.location.pathname.split('/');
        return updateState('route', route);
    }

    const addActions = (actionsToAdd: any) => {
        const activatedActionsToAdd = actionsToAdd(fn);
        Object.keys(activatedActionsToAdd).forEach(key => activatedActions[key] = activatedActionsToAdd[key]);
        return;
    }

    const fn: Fn = {
        updateState: updateState,
        updateMulti: updateMulti,
        getState: getState,
        relay: relay,
        goto: goto,
        addActions: addActions,
    };

    const activatedActions = actions(fn);
    
    window.onpopstate = (event) => {
        const route = window.location.pathname.split('/');
        return updateState('route', route);
    }
    
    const route = window.location.pathname.split('/');
    return updateState('route', route);
}