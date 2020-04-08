import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    { path: '/', component: '@/pages/index' },
  ],
  proxy:{
    "/msgboard": {
      "target": "http://127.0.0.1:80/",
      "changeOrigin": true
    },
  }
});
