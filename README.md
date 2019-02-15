# React-Fn
A simple, functional approach to React

## Install

## Basics

```jsx

// global state
const state = {
  greeting: 'hello world'
};

// functional component has state and actions passed in
const myComponent = ({ state, actions }) => (
  <div>
    <h1>{state.greeting}</h1>
    <button onClick={ actions.changeGreeting('hello ben') }>Change greeting</button>
    {/* Pass state and actions into any child components */}
    <childComponent state={state} actions={actions}></childComponent>
  </div>
);

// actions have the fn api passed in
const actions = (fn) => {
  changeGreeting(newGreeting, fn = fn) => fn.updateState('greeting', newGreeting)
}

// where you want to mount your app
const mount = document.querySelector('#app');

// run your app
app(state, myComponent, actions, mount);

```

## Actions

Actions are functions that cause side-effects such as state changes.

### State Changes

Changing state is done via the `fn` api...

Let's say your state is 

```

some: {
  nested: {
    node: 'hello'
  }
}

```

and you want to change `some.nested.node`, then...

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

You can also change state in multiple nodes at once...

```javascript

fn.updateMulti([
  { node: 'some/nested/node1', value: 'here i am' },
  { node: 'some/nested/node2', value: 'another node' }
]);

```

`Rerender : false` is also available to `updateMulti`...

```javascript

fn.updateMulti([
  { node: 'some/nested/node1', value: 'here i am' },
  { node: 'some/nested/node2', value: 'another node' }
], { rerender: false });

```

### Async Actions

Async code causes closures to be created. 
A closure takes a snapshot of state at the time they are created. 
While the state of app continues to change, a closure is none the wiser.

To avoid the state in a closure from being out of sync with the rest of the app, use `fn.getState`, which ensures that the current state of the app is used...

```javascript

const actions = (fn) => {

  // emitNumber always increments the current state
  emitNumber(fn = fn) => {
    setInterval( () => {
      return fn.updateState('counter', fn.getState().counter + 1)
    }, 1000);
  }
  
}

```
