import expect from 'expect';
import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { render, unmountComponentAtNode } from 'react-dom';

import withLifecycles from 'src/';

describe('withLifecycles', () => {
  let node;
  let componentProps;

  const Counter = props => {
    componentProps = props;
    const { count, incrementCount } = props;
    return (
      <div>
        <div>Current count: {count}</div>
        <button onClick={incrementCount}>Increment</button>
      </div>
    );
  };

  beforeEach(() => {
    node = document.createElement('div');
    componentProps = undefined;
  });

  afterEach(() => {
    unmountComponentAtNode(node);
  });

  it('when no arguments are given', () => {
    const Wrapped = withLifecycles()(Counter);
    render(<Wrapped />, node, () => {
      expect(node.innerHTML).toContain('Current count: ');
    });
  });

  it('when a lifecycle method is given', () => {
    let didMount = false;
    const Wrapped = withLifecycles({
      componentDidMount: () => (didMount = true),
    })(Counter);

    render(<Wrapped />, node, () => {
      expect(node.innerHTML).toContain('Current count: ');
      expect(didMount).toEqual(true);
    });
  });

  it('when initial state is given', () => {
    const Wrapped = withLifecycles({
      getInitialState: () => ({ count: 0 }),
    })(({ state }) => {
      componentProps = state;
      return <span>Content: {state.count}</span>;
    });

    render(<Wrapped />, node, () => {
      expect(node.innerHTML).toContain('Content: 0');

      expect(componentProps).toEqual({ count: 0 });
    });
  });

  it('when initial state is given with custom mapStateToProps', () => {
    let mapState;
    let mapProps;
    const Wrapped = withLifecycles({
      getInitialState: () => ({ count: 0 }),
      mapStateToProps: (state, props) => {
        mapState = state;
        mapProps = props;
        return { count: state.count };
      },
    })(Counter);

    render(<Wrapped foo="bar" />, node, () => {
      expect(node.innerHTML).toContain('Current count: 0');

      expect(componentProps).toEqual({ count: 0 });
      expect(mapState).toEqual({ count: 0 });
      expect(mapProps).toEqual({ foo: 'bar' });
    });
  });

  it('when custom method is given', done => {
    let methodArgs;
    const Wrapped = withLifecycles({
      getInitialState: () => ({ count: 0 }),
      mapStateToProps: state => ({ count: state.count }),
      incrementCount: args => {
        methodArgs = args;
        const { props, state, setState } = args;
        setState({ count: state.count + 1 });
      },
    })(Counter);

    render(<Wrapped />, node, () => {
      expect(node.innerHTML).toContain('Current count: 0');

      expect(componentProps).toIncludeKeys(['count', 'incrementCount']);

      ReactTestUtils.Simulate.click(node.querySelector('button'));

      setImmediate(() => {
        expect(node.innerHTML).toContain('Current count: 1');
        expect(methodArgs).toIncludeKeys([
          'event',
          'props',
          'state',
          'setState',
        ]);

        done();
      });
    });
  });
});
