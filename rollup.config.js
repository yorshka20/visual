// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import cjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';
import html from 'rollup-plugin-gen-html';

function getPlugins() {
  const plugins = [
    typescript({
      tsconfig: './tsconfig.json',
      clean: true,
    }),
    // 支持代码中引用的 node_modules 中的文件
    resolve({
      module: true,
      jsnext: true,
      main: true,
      browser: true,
    }),
    // 支持代码中引用 CommonJS 规格的模块
    cjs({
      include: ['node_modules/**'],
    }),
    html({
      template: 'index.html',
      target: './dist/index.html',
      hash: false,
    }),
    livereload({
      watch: 'src',
    }),
    serve({
      open: true,
      port: 5000,
      openPage: 'index.html',
    }),
  ];

  return plugins;
}

export default {
  input: 'src/index.ts',
  plugins: getPlugins(),
  output: {
    file: 'dist/bundle.js',
    format: 'es',
    sourcemap: true,
  },
};
