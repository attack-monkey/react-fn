# Why React-Fn?

## Functional

React-Fn is a functional approach to React.

Which in short means:
- All components are functional - with very little logic in them.
- Components do not hold any state information.
- State instead is stored in one place as a pure javascript object.
- State can only be updated through Actions.

## Elegant

This causes an elegant separation of **components** / **state** / **actions**.

Instead of components storing their own state and methods (logic), they simply take in state and actions.
The only logic is how they use state to display something.

Actions are also passed into components, and are the only way that a component can alter state. Actions are where all the logic resides.

## Simple

React-Fn is an alternative to something like React + Redux and in particular simplifies the _Redux-y_ part.

Where Redux uses reducers to update state, React-fn uses utilities called `updateState` and `updateMulti`.

- `updateState` lets developers update a specific node in the state-tree.  
- `updateMulti` lets developers update multiple nodes in the state-tree.

These utilities safely update the state object and re-render the view - greatly simplifying state changes.

## Async

In an OOP framework with a high dependence on asynchronous activity, subscriptions and observables are heavily relied upon. Things can get pretty complex when multiple components all have to subscribe and unsubscribe from various observables.

In contrast React-Fn moves in a single direction (or a loop depending on how you look at it). 

```

     ┌─> The application renders -> an event occurs -> state updates ┐
     └───────────────────────────────────────────────────────────────┘
                                                             
```

This means that subscription hell just disappears. Any state change simply triggers a re-render of any DOM elements that have changed state.