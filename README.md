# react-dynamic-context

> This Documentation is currently under construction

Type-safe dynamic context with only a few lines of code.

## install

```shell
yarn add react-dynamic-context
# or
npm i react-dynamic-context
```

## basic example

```tsx
import * as React from 'react';
import { createDynamicContext, DynamicProvider } from 'react-dynamic-context';

const SomeContext = createDynamicContext<{ foo: string }>({
  foo: 'default-value'
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

live-examples on codesandbox:

- [TypeScript-example](https://codesandbox.io/s/8z6zwjyw7l)
- [JS-example](https://codesandbox.io/s/24ry9jwvlj)

## optional values for context-value-interface

The interface must not contain any optional values:

```typescript
import { createDynamicContext } from 'react-dynamic-context';

// ERROR: Type '{ foo?: string | undefined; }' does not satisfy the constraint 'Required<{ foo?: string | undefined; }>'.
createDynamicContext<{ foo?: string }>({});

// CORRECT:
createDynamicContext<{ foo: string | undefined }>({ foo: undefined });
```

## further reading

### advanced example

```tsx
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
