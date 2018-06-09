import React from 'react';
import flatten from 'lodash.flatten';

const lifecycleWhitelist = {
  instance: [
    'componentWillMount',
    'UNSAFE_componentWillMount',
    'componentDidMount',
    'componentWillReceiveProps',
    'UNSAFE_componentWillReceiveProps',
    'shouldComponentUpdate',
    'componentWillUpdate',
    'UNSAFE_componentWillUpdate',
    'getSnapshotBeforeUpdate',
    'componentDidUpdate',
    'componentWillUnmount',
    'componentDidCatch',
  ],
  static: ['getDerivedStateFromProps'],
  other: ['getInitialState', 'mapStateToProps'],
};

const allReactFunctions = flatten(Object.values(lifecycleWhitelist));

function defaultMapStateToProps(state) {
  return { state };
}

export default function withLifecyles(lifecycles = {}) {
  const mapStateToProps = lifecycles.mapStateToProps || defaultMapStateToProps;

  const nonReactFunctions = Object.keys(lifecycles).filter(
    method => allReactFunctions.includes(method) === false
  );

  return function lifecycleCreator(Component) {
    class LifecycleComponent extends React.Component {
      constructor(props) {
        super(props);

        this.state = lifecycles.getInitialState
          ? lifecycles.getInitialState(props)
          : {};

        this.boundSetState = this.setState.bind(this);
      }

      render() {
        const componentProps = mapStateToProps(this.state);

        nonReactFunctions.forEach(
          fnName =>
            (componentProps[fnName] = event =>
              lifecycles[fnName]({
                event,
                state: this.state,
                props: this.props,
                setState: this.boundSetState,
              }))
        );

        return <Component {...componentProps} />;
      }
    }

    lifecycleWhitelist.instance.forEach(methodName => {
      const methodValue = lifecycles[methodName];
      if (!methodValue) {
        return;
      }
      LifecycleComponent.prototype[methodName] = methodValue;
    });

    return LifecycleComponent;
  };
}
