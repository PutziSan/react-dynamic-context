import * as React from 'react';

export type SetValue<Value> = (newValue: Value) => void;
export type SetterMap<Values> = { [K in keyof Values]: SetValue<Values[K]> };

export type HandleInputChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => void;
export type HandleInputChangeMap<Values> = {
  [K in keyof Values]: HandleInputChange
};

export interface ContextValueState<Value> {
  value: Value;
  setValue: SetValue<Value>;
  handleInputChange: HandleInputChange;
}

export type ContextStore<Values extends Required<Values>> = {
  [K in keyof Values]: ContextValueState<Values[K]>
};

export type CalcValueState<Value> = (
  value: Value,
  setValue: SetValue<Value>,
  handleInputChange: HandleInputChange
) => ContextValueState<Value>;

export type CalcValueStateMap<Values> = {
  [K in keyof Values]: CalcValueState<Values[K]>
};

export type ContextValues<Values> = { [K in keyof Values]: Values[K] };

export interface CreateDynamicContextOptions {
  addToDynamicProvider?: boolean;
}
