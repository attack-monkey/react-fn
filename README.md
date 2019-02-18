# React-Fn
A simple, functional approach to React

# WORK IN PROGRESS

## Install

## The Low-down

React-fn is a functional approach to React. All components are functional and do not store their own state.
Instead State exists in one place as a pure object (no methods), and can only be changed via Actions. Both State and Actions are injected into your first component and are passed down into child components.

## Basic App

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

// actions have the fn api passed in and fn.updateState can be used to update the App's State
const actions = (fn) => {
  changeGreeting: (newGreeting) => fn.updateState('greeting', newGreeting)
}

// This is where your app will be mounted
const mount = document.querySelector('#app');

// run your app
app(state, myComponent, actions, mount);

```

## Actions

Actions are functions that cause side-effects (Usually state changes).  
As you can see above, Actions are passed in to the first component.  
Actions can be passed down to child components.

### State

Rather than State existing within many components, it instead lives in one place.  
State is just a pure javascript object (no methods).  
State is passed into the first component and can be passed down to child components.


Changing state is done in Actions via the `fn` api...

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

### The Shape of State

### updateState and updateMulti
 
### Chaining Actions with fn.relay()

### Async Actions

Async code causes **closures** to be created.  
A closure takes a snapshot of State at the time it is created.  
While the State of the app continues to change outside of the cosure - the closure is none the wiser.  
The closure keeps it's own version of State.

To avoid the state in a closure from being out of sync with the rest of the app, use `fn.getState`, which ensures that the current state of the app is used...

```javascript

const actions = (fn) => {

  // emitNumber always increments the current state
  emitNumber() => {
    setInterval( () => {
      return fn.updateState('counter', fn.getState().counter + 1)
    }, 1000);
  }
  
}

```

### Engines. Actions that produce ongoing value streams

Engines are Asynchronous Actions that are able to be turned on and off. While in an 'on' state, they produce a value-stream (Multiple updates to State) until the 'off' switch is triggered.


