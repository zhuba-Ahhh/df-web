import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import { visualizer } from 'rollup-plugin-visualizer';
import viteImagemin from 'vite-plugin-imagemin';
import importToCDN from 'vite-plugin-cdn-import';
import { qrcode } from 'vite-plugin-qrcode';

// https://vitejs.dev/config/
// eslint-disable-next-line import/no-unused-modules
export default defineConfig({
  envDir: './env',
  resolve: {
    // 配置别名
    alias: {
      '@': '/src', // @表示src目录
    },
  },
  css: {
    // 启用 CSS Modules
    modules: {
      localsConvention: 'camelCase', // 或者 'dashes' | 'camelCaseOnly'
    },
  },
  plugins: [
    react(),
    tsconfigPaths(),
    svgrPlugin(),
    visualizer({
      // 打包完成后自动打开浏览器，显示产物体积报告
      open: false,
    }),
    qrcode(),
    importToCDN({
      // enableInDevMode: true,
      modules: ['react', 'react-dom', 'axios'],
    }),
    // createExternal({
    //   interop: 'auto', // 这个声明很重要
    //   externals: {
    //     react: 'React',
    //     'react-dom': 'ReactDOM',
    //     'react-router-dom': 'ReactRouterDOM',
    //     'react-router': 'ReactRouter',
    //   },
    // }),
    viteImagemin({
      gifsicle: {
        // gif图片压缩
        optimizationLevel: 3, // 选择1到3之间的优化级别
        interlaced: false, // 隔行扫描gif进行渐进式渲染
        // colors: 2 // 将每个输出GIF中不同颜色的数量减少到num或更少。数字必须介于2和256之间。
      },
      optipng: {
        // png
        optimizationLevel: 7, // 选择0到7之间的优化级别
      },
      mozjpeg: {
        // jpeg
        quality: 20, // 压缩质量，范围从0(最差)到100(最佳)。
      },
      pngquant: {
        // png
        quality: [0.8, 0.9], // Min和max是介于0(最差)到1(最佳)之间的数字，类似于JPEG。达到或超过最高质量所需的最少量的颜色。如果转换导致质量低于最低质量，图像将不会被保存。
        speed: 4, // 压缩速度，1(强力)到11(最快)
      },
      svgo: {
        // svg压缩
        plugins: [
          {
            name: 'removeViewBox',
          },
          {
            name: 'removeEmptyAttrs',
            active: false,
          },
        ],
      },
    }),
    // viteCompression({
    //   algorithm: 'gzip',
    //   threshold: 10240,
    //   verbose: true, // 是否在控制台中输出压缩结果
    //   ext: '.gz',
    //   deleteOriginFile: true, // 源文件压缩后是否删除
    // }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://df-api.vercel.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  base: process.env.NODE_ENV === 'production' ? './' : '/',
  esbuild: {
    // drop: ['console', 'debugger'], // dev执行
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 500, // 单位 kb
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
        entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
        assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
        experimentalMinChunkSize: 10 * 1024, // 单位b 合并小chunk
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
      treeshake: {
        preset: 'recommended',
        manualPureFunctions: ['console.log'],
      },
      external: ['react', 'react-dom', 'axios'],
    },
    minify: 'terser', // 启用 terser 压缩
    terserOptions: {
      // 生产环境时移除console等
      compress: {
        pure_funcs: ['console.log'], // 只删除 console.log
        drop_console: true, // 删除所有 console
        drop_debugger: true,
      },
    },
  },
});
