import * as React from 'react';
import { ContextStore, ContextValues } from './types';

export function createValuesConsumer<Values extends Required<Values>>(
  defaultValues: ContextValues<Values>,
  newContext: React.Context<ContextStore<Values>>
) {
  const valueKeys = Object.keys(defaultValues) as (keyof Values)[];

  return class ValuesConsumer extends React.PureComponent<{
    children: (contextValues: ContextValues<Values>) => React.ReactNode;
  }> {
    renderValues = (store: ContextStore<Values>) => {
      const values = {} as ContextValues<Values>;

      valueKeys.forEach(key => (values[key] = store[key].value));

      return this.props.children(values);
    };

    render() {
      return <newContext.Consumer>{this.renderValues}</newContext.Consumer>;
    }
  };
}
