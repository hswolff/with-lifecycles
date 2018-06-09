# with-lifecycles

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

Everyone loves React's [stateless functional components](https://reactjs.org/docs/components-and-props.html#functional-and-class-components) (SFC). The ease and simplicity of writing just a function for a React component is so delicious that you wish you could write your entire app with only functions!

Inevitably, you'll run across a need to use state in your component. Or even scarier, having to use some of the lifecycle methods of a React Class Component.

Then you're met with a horrible quandry: do you keep the beautiful simplicity of your SFC (🤗) or do you rewrite it to be a React Class Component (😢).

And _everyone_ hates that most horrible of all chores of converting a SFC to a Class component.

**...well fear not...**

For this is the library for you! It'll let you have your 🎂 and 👄 it too!

## Example

We have a simple Counter component that can increment a counter.

```js
const Counter = ({ count, incrementCount }) => (
  <div>
    <div>Current count: {count}</div>
    <button onClick={incrementCount}>Increment</button>
  </div>
);
```

This is a nice and simple SFC. However, it doesn't do anything without any state. So let's add that.

```js
const CounterWithLifecycles = withLifecycles({
  getInitialState: () => ({ count: 0 }),
  mapStateToProps: state => ({ count: state.count }),
  incrementCount: ({ props, state, setState }) =>
    setState({ count: state.count + 1 }),
})(Counter);
```

Voila! 🎉 Your SFC now has all the super powers of a React Class component.

Play with a live example on Codesandbox.

[![Edit withLifecycles](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/8nzwmv7x92)

## Documentation

`withLifecycles` is a [Higher-Order Component](https://reactjs.org/docs/higher-order-components.html) which takes in an object which supports every known React Class method, including any additional methods you want to be included in the returned class (such as event handlers), and returns a function which takes in the component you want to wrap.

There's two additional special properties:

**getInitialState(props)**: This is similar to the old `React.createClass` method and is a way for you to set the initial state of the wrapped component. It is called with `props`.

**mapStateToProps(state, props)**: Similar to [react-redux's](https://github.com/reduxjs/react-redux) `mapStateToProps`, it's called with `state` and `props`.

**non-React method**: Any non-React method is called with an object that looks like:

```js
{
    event: event, // Event Handler Event if it exists.
    state: this.state, // State
    props: this.props, // Props
    setState: this.setState, // A copy of setState for updating.
}
```

[build-badge]: https://img.shields.io/travis/hswolff/with-lifecycles/master.png?style=flat-square
[build]: https://travis-ci.org/hswolff/with-lifecycles
[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/with-lifecycles
[coveralls-badge]: https://img.shields.io/coveralls/hswolff/with-lifecycles/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/hswolff/with-lifecycles
