import { route } from 'quasar/wrappers';
import { createRouter, createWebHistory } from 'vue-router/auto';

import { setupLayouts } from 'virtual:generated-layouts';

export const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  extendRoutes: (routes) => setupLayouts(routes),
  history: createWebHistory(process.env.VUE_ROUTER_BASE),
});

export default router;
