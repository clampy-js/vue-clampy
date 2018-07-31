import VueClampy from './directive';
import { setDefaults } from './directive';

const install = function(Vue, options) {
  if (options) setDefaults(options);
  Vue.directive('clampy', VueClampy);
  Vue.prototype.$clampy = VueClampy.clampy;
};

if (typeof window !== 'undefined' && window.Vue) {
  window.VueClampy = VueClampy;
  window.VueClampy.setDefaults = setDefaults;
  Vue.use(install);
}

VueClampy.install = install;
export default VueClampy;
