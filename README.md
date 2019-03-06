# React-Fn v.2
A simple, functional approach to React

# Migrating from v1 to v2

v2 sees a simplification, dropping the need for `fn.getState()` and `fn.relay()`. 
Instead `state` and `actions` can simply be used from components and actions.

v2 has also been re-written in plain javascript as rather than typescript.

## Install

Globally install parcel.js (This is the project bundler).

```

npm install -g parcel-bundler

```

Globally install douglas (This unwraps the seed project )

```

npm install -g douglas

```

Get react-fn-seed and install using douglas

```

douglas get react-fn-seed

```

Now you can run using `npm start`

## The Low-down

React-fn is a functional approach to React. Take a look at this basic app below. You'll notice that State and Actions are decoupled from Components altogether, making things clean and simple.

- Components take in State and Actions
- Components can display State, but Components must call Actions to update State
- Upon state-change, the app refreshes

## Basic App

```jsx

// global state
const state = {
  greeting: 'hello world'
};

// functional component has state and actions passed in
const MyComponent = ({ state, actions }) => (
  <div>
    <h1>{state.greeting}</h1>
    <button onClick={ actions.changeGreeting('hello ben') }>Change greeting</button>
    {/* Pass state and actions into any child components */}
    <childComponent state={state} actions={actions}></childComponent>
  </div>
);

// actions have the fn api passed in and fn.updateState can be used to update the App's State
const actions = (fn) => {
  changeGreeting: (fn) => (newGreeting) => fn.updateState('greeting', newGreeting)
}

// This is where your app will be mounted
const mount = document.querySelector('#app');

// run your app
app(state, MyComponent, actions, mount);

```

## Actions

Actions are functions that cause side-effects (Usually state changes).  
As you can see above, Actions are passed in to the first component.  
Actions are then passed down to child components.  
Actions can also be passed into actions to enable action-chaining.

### State

Rather than State existing within the components, it is stored in a single global state object.
State is just a pure javascript object (no methods).  
State is passed into the first component and can be passed down to child components.

Changing state is done in Actions via the `fn.updateState` method...

Let's say your state is 

```

some: {
  nested: {
    node: 'hello'
  }
}

```

and you want to make a change to `some.nested.node`, then...

```javascript

fn.updateState('some/nested/node', 'here i am');

```

State is now changed to 

```

some: {
  nested: {
    node: 'here i am'
  }
}

```

Whenever `fn.updateState` is called, the app is rerendered, unless the flag `rerender: false` is passed in ...

```javascript

// The following will not rerender the app
fn.updateState('some/nested/node', 'here i am', { rerender: false });

```

## The Advanced Guide

### The fn api

The fn api is accessible via actions.

#### updateState & updateMulti

`fn.updateState(node, value, options)` - Updates the state at a given node with the value.
The application will refresh unless `options.rerender` is set to false.
`node` can either be in directory format - eg. `a/nested/node` or an array of strings -eg. `[ 'a', 'nested', 'node' ]`

`fn.updateMulti([ { node: node, value: value }, {...} ], options)` - The same as `updateState`, however allows multiple updates to state at once.

eg. 

```javascript

fn.updateMulti([
  { node: 'a/nested/node', value: 'hello' },
  { node: 'another/node', value: 'hello again'}
], { rerender: false })

```

#### Route Changes with fn.goto()

`fn.goto(route)` - Changes the URL to the new route. This updates `state.route` with the new url broken into segments.

eg. `myapp.com/page1/part_a` will produce `state.route` of `[ '', 'page1', 'part_a']`.

`fn.goto()` always triggers a state change and therefore an app refresh.

#### Dynamically add new actions with fn.addActions()

TODO

### Action Chaining

Actions can be chained together by simply passing `actions` into a given action as a parameter. 
`actions` can then simply be called in the same way as you would from a component.

### Async Actions

There is nothing special that needs to be done to perform async actions.
Since `state` is the same `state` throughout the app, if the `state` outside the action changes, 
the `state` inside the action changes too. Everything just stays in sync.

> Make sure that you never reassign `state`. i.e. something like `state = newState`, as this 
will destroy any references to `state` throughout the app.

**Async example**

```javascript

const actions = (fn) => {
  ...
  // incNumber always increments the current state
  incNumber(fn) => (state) => {
    setInterval( () => {
      return fn.updateState('counter', state.counter + 1)
    }, 1000);
  }
  ...
}

```

### Engines. Actions that produce ongoing value streams

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
