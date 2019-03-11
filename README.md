# React-Fn v.2
A simple, functional approach to React

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

## State

Rather than State existing within components, it is stored in a single State object.
State is just a pure javascript object (no methods).  
State is passed into the first component and can be passed down to child components.

Changing state is done by Actions via the `fn.updateState` method...

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

https://github.com/attack-monkey/react-fn/tree/develop/docs/TOC.md
