// rollup.config.js
import sourceMaps from 'rollup-plugin-sourcemaps';
import nodeResolve from 'rollup-plugin-node-resolve';
import cjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

function getPlugins() {
  const plugins = [
    sourceMaps(),
    nodeResolve({
      mainFields: 'module',
      browser: true,
    }),
    typescript({
      tsconfig: './tsconfig.rollup.json',
      clean: true,
    }),
    cjs({
      include: ['node_modules/**', 'lib/**'],
    }),
  ];

  return plugins;
}

export default {
  input: 'src/index.ts',
  plugins: getPlugins(),
  output: {
    file: 'dist/bundle.js',
    format: 'cjs',
  },
};
