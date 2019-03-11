# The fn api

The fn api is accessible via actions.

## updateState & updateMulti

`fn.updateState(node, value, options)` - Updates the state at a given node with the value.  
The application will refresh unless `options.rerender` is set to false.  
`node` can either be in directory format 
- eg. `a/nested/node` or an array of strings 
- eg. `[ 'a', 'nested', 'node' ]`

`fn.updateMulti([ { node: node, value: value }, {...} ], options)` - The same as `updateState`, however allows multiple updates to state at once.

eg. 

```javascript

fn.updateMulti([
  { node: 'a/nested/node', value: 'hello' },
  { node: 'another/node', value: 'hello again'}
], { rerender: false })

```

## Route Changes with fn.goto()

`fn.goto(route)` - Changes the URL to the new route. This updates `state.route` with the new url broken into segments.

eg. `myapp.com/page1/part_a` will produce `state.route` of `[ '', 'page1', 'part_a']`.

`fn.goto()` always triggers a state change and therefore an app refresh.

## Dynamically add new actions with fn.addActions()

TODO