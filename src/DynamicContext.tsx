import * as React from 'react';
import { createDynamicContextProvider } from './createDynamicContextProvider';
import { createValuesConsumer } from './createValuesConsumer';
import { toDefaultStore } from './toDefaultStore';
import {
  ContextStore,
  ContextValues,
  CreateDynamicContextOptions
} from './types';

let providers: React.ComponentType[] = [];
const powerProviders: DynamicProvider[] = [];

const pushProvider = (Provider: React.ComponentType) => {
  // providers = [...providers, Provider]; // spread-syntax is not used to avoid the babel-polyfill (saves ~0.12 KB minified + gzipped).
  providers = providers.slice();
  providers.push(Provider);

  powerProviders.forEach(powerProvider =>
    powerProvider.setState({ providers })
  );
};

export class DynamicProvider extends React.PureComponent<
  {},
  { providers: React.ComponentType[] }
> {
  constructor(props: {}) {
    super(props);

    this.state = {
      // tslint:disable-next-line: object-literal-shorthand
      providers: providers
    };

    powerProviders.push(this);
  }

  componentWillUnmount() {
    powerProviders.splice(powerProviders.indexOf(this), 1);
  }

  render() {
    return this.state.providers.reduce(
      (ele, Provider) => React.createElement(Provider, null, ele),
      React.createElement(React.Fragment, null, this.props.children)
    );
  }
}

export function createDynamicContext<Values>(
  defaultValues: ContextValues<Values>,
  { addToDynamicProvider = true }: CreateDynamicContextOptions = {}
) {
  const newContext = React.createContext<ContextStore<Values>>(
    toDefaultStore(defaultValues)
  );

  const Provider = createDynamicContextProvider(defaultValues, newContext);

  if (addToDynamicProvider) {
    pushProvider(Provider);
  }

  const ValuesConsumer = createValuesConsumer(defaultValues, newContext);

  return { Provider, Consumer: newContext.Consumer, ValuesConsumer };
}
