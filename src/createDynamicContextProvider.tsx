import memoizeOne from 'memoize-one';
import * as React from 'react';
import {
  CalcValueStateMap,
  ContextStore,
  ContextValues,
  HandleInputChangeMap,
  SetterMap
} from './types';

export function createDynamicContextProvider<Values extends Required<Values>>(
  defaultValues: ContextValues<Values>,
  newContext: React.Context<ContextStore<Values>>
) {
  const valueKeys = Object.keys(defaultValues) as (keyof Values)[];

  return class DynamicContextProvider extends React.PureComponent<{}> {
    setterMap: SetterMap<Values>;
    handleInputChangeMap: HandleInputChangeMap<Values>;
    memoizedValueStateGetters: CalcValueStateMap<Values>;

    state = defaultValues;

    constructor(props: {}) {
      super(props);

      this.setterMap = this.calcSetterMap();
      this.handleInputChangeMap = this.calcHandleInputChangeMap();
      this.memoizedValueStateGetters = this.calcValueStateMap();
    }

    calcSetterMap() {
      const res = {} as SetterMap<Values>;
      valueKeys.forEach(
        key => (res[key] = newValue => this.setState({ [key]: newValue }))
      );
      return res;
    }

    calcHandleInputChangeMap() {
      const res = {} as HandleInputChangeMap<Values>;
      valueKeys.forEach(
        key =>
          (res[key] = (e: React.ChangeEvent<HTMLInputElement>) =>
            this.setState({ [key]: e.target.value }))
      );
      return res;
    }

    calcValueStateMap() {
      const res = {} as CalcValueStateMap<Values>;
      valueKeys.forEach(
        key =>
          (res[key] = memoizeOne((value, setValue, handleInputChange) => ({
            value,
            setValue,
            handleInputChange
          })))
      );
      return res;
    }

    getContextValue() {
      const res = {} as ContextStore<Values>;
      valueKeys.forEach(
        key =>
          (res[key] = this.memoizedValueStateGetters[key](
            this.state[key],
            this.setterMap[key],
            this.handleInputChangeMap[key]
          ))
      );
      return res;
    }

    render() {
      const NewContextProvider = newContext.Provider;

      return (
        <NewContextProvider value={this.getContextValue()}>
          {this.props.children}
        </NewContextProvider>
      );
    }
  };
}
