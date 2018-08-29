import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import resolve from 'rollup-plugin-node-resolve';
import { uglify } from 'rollup-plugin-uglify';
import { checkPeerDependenciesForUmdBuild } from './dev/checkPeerDependenciesForUmdBuild';
import pkg from './package.json';

const input = 'src/index.ts';
const external = ['react'];
const extensions = ['.ts', '.tsx', '.js', '.jsx'];

const globals = {
  react: 'React'
};

checkPeerDependenciesForUmdBuild(pkg.peerDependencies, external, globals);

// in CJS/ES the dependencies will added via your bundler so it is not necessary to add them to your bunlde.
const allExternals = external.concat(Object.keys(pkg.dependencies));

// If we only specify the external array, imports from submodules (`import '[PACKAGE]/lib/module'`) are not detected and added to your bundle
const checkIfModuleIsExternal = id =>
  allExternals.filter(ext => id.substr(0, ext.length) === ext).length > 0;

const buildUMD = ({ isProduction = true }) => ({
  input,
  external,
  output: {
    name: 'ReactDynamicContext',
    file: `dist/react-dynamic-context.umd${isProduction ? '.min' : ''}.js`,
    format: 'umd',
    sourcemap: true,
    globals
  },
  plugins: [
    resolve({ extensions }),
    babel({ exclude: 'node_modules/**', runtimeHelpers: true, extensions }),
    commonjs(),
    isProduction && filesize(),
    isProduction &&
      uglify({
        compress: {
          keep_infinity: true,
          pure_getters: true
        },
        warnings: true
      })
  ]
});

const buildBundle = ({ isCommonjs = false }) => ({
  input,
  external: checkIfModuleIsExternal,
  output: {
    file: isCommonjs ? pkg.main : pkg.module,
    format: isCommonjs ? 'cjs' : 'es',
    sourcemap: true
  },
  plugins: [
    resolve({ extensions }),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
      envName: isCommonjs ? 'commonjs' : process.env.NODE_ENV,
      extensions
    }),
    filesize()
  ]
});

export default [
  buildUMD({ isProduction: false }),
  buildUMD({ isProduction: true }),
  buildBundle({ isCommonjs: true }),
  buildBundle({ isCommonjs: false })
];
