import VueClampy from "./directive";

const install = function(Vue, options) {
    if (options) setDefaults(options);
    Vue.directive("clampy", VueClampy);
    Vue.prototype.$clampy = VueClampy.clampy;
};

if (typeof window !== "undefined" && window.Vue) {
    window.VueClampy = VueClampy;
    Vue.use(install);
}

VueClampy.install = install;
export default VueClampy;