const reactPreset = require('@babel/preset-react').default;
const typescriptPreset = require('@babel/preset-typescript').default;
const envPreset = require('@babel/preset-env').default;
const classPropertiesPlugin = require('@babel/plugin-proposal-class-properties')
  .default;
const objectSpreadTransformation = require('@babel/plugin-proposal-object-rest-spread')
  .default;
const runtimeTransformPlugin = require('@babel/plugin-transform-runtime')
  .default;

// TODO die Nutzung der API ist von babel noch nicht weiter dokumentiert, es scheint so erstmal zu funktionieren, aber das ist noch nicht ausschließlich schön
module.exports = api => {
  // das wäre eigentlich sauberer, aber api.env() scheint intern bereits cache aufzurufen weswegen man es nicht mehrmals tunen kann
  // api.cache(() => process.env.NODE_ENV + api.env());

  // es funktioniert auch so da UMD und ES-Module aktuell die gleiche config haben
  const env = api.env();

  const isTest = process.env.NODE_ENV === 'test';
  const isProd = process.env.NODE_ENV === 'production';

  const isCommonjs = env === 'commonjs';

  return {
    presets: [
      [
        envPreset,
        {
          modules: isTest ? 'commonjs' : false,
          targets: {
            browsers: ['>0.25%']
          }
        }
      ],
      [reactPreset, { useBuiltIns: true, development: !isProd }],
      typescriptPreset
    ].filter(Boolean),
    plugins: [
      [classPropertiesPlugin, { loose: true }],
      [objectSpreadTransformation, { useBuiltIns: true }],
      isProd && [
        runtimeTransformPlugin,
        { useESModules: !isCommonjs, regenerator: false, corejs: false }
      ]
    ].filter(Boolean)
  };
};
