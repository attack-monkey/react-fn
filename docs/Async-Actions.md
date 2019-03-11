# Async Actions

There is nothing special that needs to be done to perform async actions.
Since `state` is the same `state` throughout the app, if the `state` outside the action changes, 
the `state` inside the action changes too. Everything just stays in sync.

> Make sure that you never reassign `state`. i.e. something like `state = newState`, as this 
will destroy any references to `state` throughout the app.

## Async example**

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
