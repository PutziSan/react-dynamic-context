import { mount } from 'enzyme';
import * as React from 'react';
import { Consumer } from 'react';
import { ContextStore, createDynamicContext, DynamicProvider } from '../src';

interface TestContextValues {
  foo: string;
  bar: string;
}

const testDefaultValues = {
  foo: 'current-foo-value',
  bar: 'current-bar-value'
};

const TestContext = createDynamicContext<TestContextValues>(testDefaultValues);

const otherDefaultValues = {
  baz: 'current-baz-value'
};

const OtherContext = createDynamicContext<{ baz: string }>(otherDefaultValues);

describe('when render some Context without a Provider', () => {
  it('should render the defaultValue-store with Consumer', () => {
    const testFn = jest.fn();
    mount(<TestContext.Consumer>{testFn}</TestContext.Consumer>);

    expect(testFn.mock.calls[0][0]).toMatchObject({
      foo: { value: testDefaultValues.foo },
      bar: { value: testDefaultValues.bar }
    });
  });

  it('should render the defaultValue with ValuesConsumer', () => {
    const testFn = jest.fn();
    mount(<TestContext.ValuesConsumer>{testFn}</TestContext.ValuesConsumer>);

    expect(testFn.mock.calls[0][0]).toMatchObject(testDefaultValues);
  });

  it('should throw when trying to change value via setValue', () => {
    const testFn = jest.fn();
    mount(<TestContext.Consumer>{testFn}</TestContext.Consumer>);

    const renderProps = testFn.mock.calls[0][0] as ContextStore<
      TestContextValues
    >;

    expect(renderProps.bar.setValue).toThrow();
  });

  it('should throw when trying to change value via handleInputChange', () => {
    const testFn = jest.fn();
    mount(<TestContext.Consumer>{testFn}</TestContext.Consumer>);

    const renderProps = testFn.mock.calls[0][0] as ContextStore<
      TestContextValues
    >;

    expect(renderProps.bar.handleInputChange).toThrow();
  });
});

describe('when render Context with generic Provider', () => {
  const getTestHelpers = () => {
    const testFn = jest.fn();
    const valuesTestFn = jest.fn();
    const component = (
      <DynamicProvider>
        <TestContext.Consumer>{testFn}</TestContext.Consumer>
        <TestContext.ValuesConsumer>{valuesTestFn}</TestContext.ValuesConsumer>
      </DynamicProvider>
    );

    return { testFn, component, valuesTestFn };
  };

  it('should render the defaultValues withConsumer', () => {
    const { testFn, component } = getTestHelpers();
    mount(component);

    expect(testFn.mock.calls[0][0]).toMatchObject({
      foo: { value: testDefaultValues.foo },
      bar: { value: testDefaultValues.bar }
    });
  });

  it('should render the defaultValue with ValuesConsumer', () => {
    const { valuesTestFn, component } = getTestHelpers();
    mount(component);

    expect(valuesTestFn.mock.calls[0][0]).toMatchObject(testDefaultValues);
  });

  it('should call the render-function only 1 time for Consumer', () => {
    const { testFn, component } = getTestHelpers();
    mount(component);
    expect(testFn.mock.calls.length).toBe(1);
  });

  it('should call the render-function only 1 time for ValuesConsumer', () => {
    const { valuesTestFn, component } = getTestHelpers();
    mount(component);
    expect(valuesTestFn.mock.calls.length).toBe(1);
  });

  it('should only render one time more for Consumer when changing values', () => {
    const { testFn, component } = getTestHelpers();
    mount(component);

    const changedValue = testDefaultValues.foo + '1';

    const renderProps = testFn.mock.calls[0][0] as ContextStore<
      TestContextValues
    >;

    renderProps.foo.setValue(changedValue);

    expect(testFn.mock.calls.length).toBe(2);
  });

  it('should only render one time more for ValuesConsumer when changing values', () => {
    const { testFn, valuesTestFn, component } = getTestHelpers();
    mount(component);

    const changedValue = testDefaultValues.foo + '1';

    const renderProps = testFn.mock.calls[0][0] as ContextStore<
      TestContextValues
    >;

    renderProps.foo.setValue(changedValue);

    expect(valuesTestFn.mock.calls.length).toBe(2);
  });

  it('should change the value via setValue', () => {
    const { testFn, component } = getTestHelpers();
    mount(component);

    const changedValue = testDefaultValues.foo + '1';

    const renderProps = testFn.mock.calls[0][0] as ContextStore<
      TestContextValues
    >;

    renderProps.foo.setValue(changedValue);

    expect(testFn.mock.calls[testFn.mock.calls.length - 1][0]).toMatchObject({
      foo: { value: changedValue },
      bar: { value: testDefaultValues.bar }
    });
  });

  it('should change the value via handleInputChange', () => {
    const { testFn, component } = getTestHelpers();
    mount(component);

    const changedValue = testDefaultValues.foo + '1';

    const renderProps = testFn.mock.calls[0][0] as ContextStore<
      TestContextValues
    >;

    renderProps.foo.handleInputChange({
      target: { value: changedValue }
    } as React.ChangeEvent<HTMLInputElement>);

    expect(testFn.mock.calls[testFn.mock.calls.length - 1][0]).toMatchObject({
      foo: { value: changedValue },
      bar: { value: testDefaultValues.bar }
    });
  });

  it('should only mutate fields which changed', () => {
    const { testFn, component } = getTestHelpers();
    mount(component);

    const changedValue = testDefaultValues.foo + '1';

    const renderProps = testFn.mock.calls[0][0] as ContextStore<
      TestContextValues
    >;

    renderProps.foo.setValue(changedValue);

    const secRenderProps = testFn.mock.calls[1][0] as ContextStore<
      TestContextValues
    >;

    expect(renderProps.foo).not.toBe(secRenderProps.foo);
    expect(renderProps.bar).toBe(secRenderProps.bar);
  });
});

describe('when using multiple contexts', () => {
  const getTestHelpers = (
    TestConsumer: Consumer<any>,
    OtherConsumer: Consumer<any>
  ) => {
    const testFn = jest.fn();
    const otherTestFn = jest.fn();
    const component = (
      <DynamicProvider>
        <TestConsumer>{testFn}</TestConsumer>
        <OtherConsumer>{otherTestFn}</OtherConsumer>
      </DynamicProvider>
    );

    return { testFn, otherTestFn, component };
  };

  it('should render all contexts with correct values', () => {
    const { testFn, otherTestFn, component } = getTestHelpers(
      TestContext.Consumer,
      OtherContext.Consumer
    );
    mount(component);

    expect(testFn.mock.calls[0][0]).toMatchObject({
      foo: { value: testDefaultValues.foo },
      bar: { value: testDefaultValues.bar }
    });

    expect(otherTestFn.mock.calls[0][0]).toMatchObject({
      baz: { value: otherDefaultValues.baz }
    });
  });

  it('should only update changed contexts', () => {
    const { testFn, otherTestFn, component } = getTestHelpers(
      TestContext.Consumer,
      OtherContext.Consumer
    );
    mount(component);

    const changedValue = testDefaultValues.foo + '1';

    const renderProps = testFn.mock.calls[0][0] as ContextStore<
      TestContextValues
    >;

    renderProps.foo.setValue(changedValue);

    expect(testFn.mock.calls.length).toBe(2);
    expect(otherTestFn.mock.calls.length).toBe(1);
  });
});
