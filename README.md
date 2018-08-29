# react-dynamic-context

Type-safe dynamic context with only a few lines of code.

## basic example

```typescript
import * as React from 'react';
import { createDynamicContext, DynamicProvider } from 'react-dynamic-context';

const SomeContext = createDynamicContext<{ foo: string }>({
  foo: 'bar'
});

const App = () => (
  <DynamicProvider>
    <SomeContext.Consumer>
      {ctx => (
        <input
          onChange={e => ctx.foo.setValue(e.target.value)}
          value={ctx.foo.value}
        />
      )}
    </SomeContext.Consumer>
  </DynamicProvider>
);
```

### advanced example

```typescript
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createDynamicContext, DynamicProvider } from 'react-dynamic-context';

const SomeContext = createDynamicContext<{ foo: string; bar: string }>({
  foo: 'current-foo-value',
  bar: 'current-bar-value'
});

const OtherContext = createDynamicContext<{ baz: string }>({
  baz: 'current-baz-value'
});

const Comp = () => (
  <div>
    <SomeContext.Consumer>
      {ctx => (
        <input
          onChange={e => ctx.bar.setValue(e.target.value)}
          value={ctx.bar.value}
        />
      )}
    </SomeContext.Consumer>
    <OtherContext.Consumer>
      {ctx => (
        <input onChange={ctx.baz.handleInputChange} value={ctx.baz.value} />
      )}
    </OtherContext.Consumer>
    <SomeContext.ValuesConsumer>
      {values => (
        <div>
          <p>other: {values.foo}</p>
          <p>language: {values.bar}</p>
        </div>
      )}
    </SomeContext.ValuesConsumer>
  </div>
);

const App = () => (
  <DynamicProvider>
    <Comp />
  </DynamicProvider>
);

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
```
