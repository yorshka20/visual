// rollup.config.js
import cjs from 'rollup-plugin-commonjs';
import html from 'rollup-plugin-gen-html';
import livereload from 'rollup-plugin-livereload';
import resolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import typescript from 'rollup-plugin-typescript2';

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
    livereload('dist'),
    serve({
      open: true, // 自动打开页面
      port: 3000,
      openPage: 'index.html', // 打开的页面
      dirs: ['dist'],
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