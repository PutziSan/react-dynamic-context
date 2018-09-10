import { ContextStore } from './types';

const defaultSetValue = (key: string) => (value: any) => {
  const jsonVal = JSON.stringify(value);
  const errorText = `you try to update a React-Context for the key "${key}" but the associated provider is currently not above the tree of the component. To prevent this error you could also use the PowerProvider-Component. Value: ${jsonVal}`;

  throw new Error(errorText);
};

export function toDefaultStore<Values extends Required<Values>>(
  defaultValues: Values
) {
  const res = {} as ContextStore<Values>;

  const keys = Object.keys(defaultValues) as (keyof Values)[];

  keys.forEach(
    key =>
      (res[key] = {
        value: defaultValues[key],
        setValue: defaultSetValue(key as string),
        handleInputChange: defaultSetValue(key as string)
      })
  );

  return res;
}
