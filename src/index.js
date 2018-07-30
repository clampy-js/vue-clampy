import VueClampy from './directive';

var _extends = Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

var defaults = {
  clamp: 'auto',
  truncationChar: '…',
  splitOnChars: ['.', '-', '–', '—', ' ']
};

function setDefaults(options) {
  defaults = _extends({}, defaults, options);
}

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
