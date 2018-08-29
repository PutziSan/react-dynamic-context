// tslint:disable:no-console
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  ContextValueState,
  createDynamicContext,
  DynamicProvider
} from '../../src';

const SomeContext = createDynamicContext<{ foo: string; bar: string }>({
  foo: 'current-foo-value',
  bar: 'current-bar-value'
});

const OtherContext = createDynamicContext<{ baz: string }>({
  baz: 'current-baz-value'
});

class ContextFieldInput extends React.PureComponent<{
  name: string;
  field: ContextValueState<string>;
}> {
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.props.field.setValue(e.target.value);

  render() {
    console.log(`render ContextFieldInput-Component for ${this.props.name}`);

    return (
      <input onChange={this.handleChange} value={this.props.field.value} />
    );
  }
}

const Foo = () => (
  <SomeContext.Consumer>
    {vals => (
      <div>
        {console.log('render Foo-Component')}
        <ContextFieldInput name="bar" field={vals.foo} />
        <hr />
        <ContextFieldInput name="bar" field={vals.bar} />
      </div>
    )}
  </SomeContext.Consumer>
);

const Baz = () => (
  <OtherContext.Consumer>
    {vals => (
      <React.Fragment>
        {console.log('render Bar-Component')}
        <input onChange={vals.baz.handleInputChange} value={vals.baz.value} />
      </React.Fragment>
    )}
  </OtherContext.Consumer>
);

const App = () => (
  <DynamicProvider>
    {console.log('render InnerApp')}
    <h2>Foo:</h2>
    <Foo />
    <h2>Baz:</h2>
    <Baz />
    <h2>SomeContext.ValuesConsumer:</h2>
    <SomeContext.ValuesConsumer>
      {values => (
        <div>
          {console.log('render SomeContext.ValuesConsumer')}
          <p>other: {values.foo}</p>
          <p>language: {values.bar}</p>
        </div>
      )}
    </SomeContext.ValuesConsumer>
  </DynamicProvider>
);

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
