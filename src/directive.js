import * as clampy_ from '@clampy-js/clampy/dist/clampy.umd.js';
// import * as elementResizeDetectorMaker_ from 'element-resize-detector';

// https://github.com/rollup/rollup/issues/670#issuecomment-284621537
const clampy = (clampy_).default || clampy_;
// const elementResizeDetectorMaker = (elementResizeDetectorMaker_).default || elementResizeDetectorMaker_;

// const resizeDetector = elementResizeDetectorMaker({ strategy: 'scroll' });
var initialContent;
var clampValue;

function setInitialContent(el) {
  if (initialContent === undefined) {
    initialContent = el.innerHTML.trim();
  }
}

function clampElement(el, clamp) {
  // We use element-resize-detector to trigger the ellipsis.
  // Element-resize-detector adds an inner div to monitor
  // it's scroll events.
  // The process of truncating the text for ellipsis removes this div, so we need to remove and readd it
  const scrollNode = el.querySelector('.erd_scroll_detection_container');
  if (scrollNode) {
    el.removeChild(scrollNode);
  }

  setInitialContent(el);

  if (initialContent !== undefined) {
    el.innerHTML = initialContent;
  }

  const options = {
    clamp: clamp ? clamp : 'auto',
    truncationChar: '…',
    // Clampy will try to use native clamp if available in the browser
    // however this can leads to unexpected results so we need to explicitely
    // disable it.
    useNativeClamp: false,
  };

  // Set the opactity to 0 to avoid content to flick when clamping.
  el.style.opacity = '0';
  const result = clampy.clamp(el, options);

  // Set the opacity back to 1 now that the content is clamped.
  el.style.opacity = '1';

  if (scrollNode) {
    el.appendChild(scrollNode);
  }
}

export default {
  inserted(el, binding, vnode) {
    clampValue = binding.value;
    // Re-clamp on element resize
    // resizeDetector.listenTo(el, () => {
    //   clampElement(el, clampValue);
    // });

    // Also re-clamp on window resize
    window.addEventListener('resize', () => {
      clampElement(el, clampValue);
    });

    clampElement(el, clampValue);
  },

  update(el, binding, vnode) {
    clampValue = binding.value;
    clampElement(el, clampValue);
  },

  unbind(el, binding, vnode) {
    clampValue = binding.value;

    // Remove all listeners
    // resizeDetector.removeAllListeners(el);
    window.removeEventListener('resize', () => {
      clampElement(el, clampValue);
    });
  },
};
