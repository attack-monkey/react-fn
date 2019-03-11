# Engines. Actions that produce ongoing value streams

Engines are Asynchronous Actions that are able to be turned on and off. While in an 'on' state, they produce a value-stream (Multiple updates to State) until the 'off' switch is triggered.

A simple example is a button that when pushed, triggers a number to increment every second until the button is pushed again.

The actions for such an engine might look like...

```typescript

startCountEngine: () => {
  if ( !state.countEngine.active ) {
      const countEngineId = setInterval(() => {
          fn.updateState('countEngine/value', state.countEngine.value + 1 )
      }, 1000);
      fn.updateMulti([
          { node: 'countEngine/active', value: true },
          { node: 'countEngine/id', value: countEngineId }
      ])
  }
  return;
},
stopCountEngine: () => {
    clearInterval(state.countEngine.id);
    fn.updateMulti([
        { node: 'countEngine/active', value: false },
        { node: 'countEngine/id', value: undefined }
    ], { rerender: false })
    return;
}
```

This is all well and good, however sometimes we want to trigger an engine start when a particular component is in view and stop the engine when it is not.

React-Fn provides a `beforeRender` function that can be included in the app function's config object. This function takes in both State and Actions, and is called whenever the app is about to rerender (refresh).

By using `beforeRender`, and checking `state.route`, actions such as `stopCountEngine` can be called when a `route` meets a particular condition.

eg. The below example will trigger the `stopCountEngine` action when the route is myapp.com/page3.

```typescript

const appContainer = document.getElementById('app');

app(state, firstComponent, actions, appContainer, {
    beforeRender: (state, actions) => {
        switch(state.route[1]) {
            case 'page3':
                actions.stopCountEngine();
            break;
        }
    }
});

```

> Note: It's very important to set ` { rerender: false } ` on any state changes within `beforeRender`, otherwise the app will loop continuously as it tries to rerender, followed by rerender, etc.