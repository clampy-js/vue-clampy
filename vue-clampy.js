(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global['vue-clampy'] = factory());
}(this, (function () { 'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};



function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var clampy_umd = createCommonjsModule(function (module, exports) {
(function (global, factory) {
	factory(exports);
}(commonjsGlobal, (function (exports) { 'use strict';

var ClampOptions = /** @class */ (function () {
    function ClampOptions(clamp, truncationChar, truncationHTML, splitOnChars) {
        this.clamp = clamp || "auto";
        this.truncationChar = truncationChar || "…";
        this.truncationHTML = truncationHTML;
        this.splitOnChars = splitOnChars || [".", "-", "–", "—", " "];
    }
    return ClampOptions;
}());
var ClampResponse = /** @class */ (function () {
    function ClampResponse(original, clamped) {
        this.original = original;
        this.clamped = clamped;
    }
    return ClampResponse;
}());
/**
 * Clamps (ie. cuts off) an HTML element's content by adding ellipsis to it if the content inside is too long.
 *
 * @export
 * @param {HTMLElement} element The HTMLElement that should be clamped.
 * @param {ClampOptions} [options] The Clamp options
 * @returns {ClampResponse} The Clamp response
 */
function clamp(element, options) {
    var win = window;
    if (!options) {
        options = {
            clamp: "auto",
            truncationChar: "…",
            splitOnChars: [".", "-", "–", "—", " "]
        };
    }
    var opt = {
        clamp: options.clamp || "auto",
        splitOnChars: options.splitOnChars || [".", "-", "–", "—", " "],
        truncationChar: options.truncationChar || "…",
        truncationHTML: options.truncationHTML
    };
    var splitOnChars = opt.splitOnChars.slice(0);
    var splitChar = splitOnChars[0];
    var chunks;
    var lastChunk;
    var sty = element.style;
    var originalText = element.innerHTML;
    var clampValue = opt.clamp;
    var isCSSValue = clampValue.indexOf && (clampValue.indexOf("px") > -1 || clampValue.indexOf("em") > -1);
    var truncationHTMLContainer;
    if (opt.truncationHTML) {
        truncationHTMLContainer = document.createElement("span");
        truncationHTMLContainer.innerHTML = opt.truncationHTML;
    }
    // UTILITY FUNCTIONS __________________________________________________________
    /**
     * Return the current style for an element.
     * @param {HTMLElement} elem The element to compute.
     * @param {string} prop The style property.
     * @returns {number}
     */
    function computeStyle(elem, prop) {
        return win.getComputedStyle(elem).getPropertyValue(prop);
    }
    /**
     * Returns the maximum number of lines of text that should be rendered based
     * on the current height of the element and the line-height of the text.
     */
    function getMaxLines(height) {
        var availHeight = height || element.clientHeight;
        var lineHeight = getLineHeight(element);
        return Math.max(Math.floor(availHeight / lineHeight), 0);
    }
    /**
     * Returns the maximum height a given element should have based on the line-
     * height of the text and the given clamp value.
     */
    function getMaxHeight(clmp) {
        var lineHeight = getLineHeight(element);
        return lineHeight * clmp;
    }
    /**
     * Returns the line-height of an element as an integer.
     */
    function getLineHeight(elem) {
        var lh = computeStyle(elem, "line-height");
        if (lh === "normal") {
            // Normal line heights vary from browser to browser. The spec recommends
            // a value between 1.0 and 1.2 of the font size. Using 1.1 to split the diff.
            lh = parseFloat(parseFloat(computeStyle(elem, "font-size")).toFixed(0)) * 1.1;
        }
        return parseFloat(parseFloat(lh).toFixed(0));
    }
    /**
     * Returns the height of an element as an integer (max of scroll/offset/client).
     * Note: inline elements return 0 for scrollHeight and clientHeight
     */
    function getElemHeight(elem) {
        // The '- 4' is a hack to deal with the element height when the browser(especially IE) zoom level is not 100%.
        // It also doesn't impact clamping when the browser zoom level is 100%.
        return Math.max(elem.scrollHeight, elem.clientHeight) - 4;
    }
    /**
     * Gets an element's last child. That may be another node or a node's contents.
     */
    function getLastChild(elem) {
        if (!elem.lastChild) {
            return;
        }
        // Current element has children, need to go deeper and get last child as a text node
        if (elem.lastChild.children && elem.lastChild.children.length > 0) {
            return getLastChild(Array.prototype.slice.call(elem.children).pop());
        }
        // This is the absolute last child, a text node, but something's wrong with it. Remove it and keep trying
        else if (!elem.lastChild ||
            !elem.lastChild.nodeValue ||
            elem.lastChild.nodeValue === "" ||
            elem.lastChild.nodeValue === opt.truncationChar) {
            if (!elem.lastChild.nodeValue) {
                // Check for void/empty element (such as <br> tag) or if it's the ellipsis and remove it.
                if ((elem.lastChild.firstChild === null ||
                    elem.lastChild.firstChild.nodeValue === opt.truncationChar) &&
                    elem.lastChild.parentNode) {
                    elem.lastChild.parentNode.removeChild(elem.lastChild);
                    // Check if the element has no more children and remove it if it's the case.
                    // This can happen for instance with lists (i.e. <ul> and <ol>) with no items.
                    if ((!elem.children || elem.children.length === 0) && elem.parentNode) {
                        elem.parentNode.removeChild(elem);
                        return getLastChild(element);
                    }
                }
                // Check if it's a text node
                if (elem.lastChild.nodeType === 3) {
                    return elem.lastChild;
                }
                else {
                    return getLastChild(elem.lastChild);
                }
            }
            if (elem.lastChild &&
                elem.lastChild.parentNode &&
                elem.lastChild.nodeValue === opt.truncationChar) {
                elem.lastChild.parentNode.removeChild(elem.lastChild);
            }
            else {
                return elem;
            }
            return getLastChild(element);
        }
        // This is the last child we want, return it
        else {
            return elem.lastChild;
        }
    }
    /**
     * Apply the ellipsis to the element
     * @param elem the element to apply the ellipsis on
     * @param str The string that will be set to the element
     */
    function applyEllipsis(elem, str) {
        elem.nodeValue = str + opt.truncationChar;
    }
    /**
     * Removes one character at a time from the text until its width or
     * height is beneath the passed-in max param.
     */
    function truncate(target, maxHeight) {
        /**
         * Resets global variables.
         */
        function reset() {
            splitOnChars = opt.splitOnChars.slice(0);
            splitChar = splitOnChars[0];
            chunks = null;
            lastChunk = null;
        }
        if (!target || !maxHeight || !target.nodeValue) {
            return;
        }
        var nodeValue = target.nodeValue.replace(opt.truncationChar, "");
        // Grab the next chunks
        if (!chunks) {
            // If there are more characters to try, grab the next one
            if (splitOnChars.length > 0) {
                splitChar = splitOnChars.shift();
            }
            else {
                // No characters to chunk by. Go character-by-character
                splitChar = "";
            }
            chunks = nodeValue.split(splitChar);
        }
        // If there are chunks left to remove, remove the last one and see if
        // the nodeValue fits.
        if (chunks.length > 1) {
            lastChunk = chunks.pop();
            applyEllipsis(target, chunks.join(splitChar));
        }
        else {
            // No more chunks can be removed using this character
            chunks = null;
        }
        // Insert the custom HTML before the truncation character
        if (truncationHTMLContainer) {
            target.nodeValue = target.nodeValue.replace(opt.truncationChar, "");
            element.innerHTML =
                target.nodeValue + " " + truncationHTMLContainer.innerHTML + opt.truncationChar;
        }
        // Search produced valid chunks
        if (chunks) {
            // It fits
            if (element.clientHeight <= maxHeight) {
                // There's still more characters to try splitting on, not quite done yet
                if (splitOnChars.length >= 0 && splitChar !== "") {
                    applyEllipsis(target, chunks.join(splitChar) + splitChar + lastChunk);
                    chunks = null;
                }
                else {
                    // Finished!
                    return element.innerHTML;
                }
            }
        }
        else {
            // No valid chunks produced
            // No valid chunks even when splitting by letter, time to move
            // on to the next node
            if (splitChar === "") {
                applyEllipsis(target, "");
                target = getLastChild(element);
                reset();
            }
        }
        return truncate(target, maxHeight);
    }
    // CONSTRUCTOR ________________________________________________________________
    if (clampValue === "auto") {
        clampValue = getMaxLines().toString();
    }
    else if (isCSSValue) {
        clampValue = getMaxLines(parseInt(clampValue, 10)).toString();
    }
    var clampedText;
    var height = getMaxHeight(Number(clampValue));
    if (height < getElemHeight(element)) {
        clampedText = truncate(getLastChild(element), height);
    }
    return new ClampResponse(originalText, clampedText);
}

exports.ClampOptions = ClampOptions;
exports.ClampResponse = ClampResponse;
exports.clamp = clamp;

Object.defineProperty(exports, '__esModule', { value: true });

})));

});

var clampy_umd$1 = unwrapExports(clampy_umd);


var clampy_ = Object.freeze({
	default: clampy_umd$1,
	__moduleExports: clampy_umd
});

// import * as elementResizeDetectorMaker_ from 'element-resize-detector';

// https://github.com/rollup/rollup/issues/670#issuecomment-284621537
var clampy = clampy_umd$1 || clampy_;
// const elementResizeDetectorMaker = (elementResizeDetectorMaker_).default || elementResizeDetectorMaker_;

// const resizeDetector = elementResizeDetectorMaker({ strategy: 'scroll' });
var clampValue;

var _extends = Object.assign || function (target) {
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
  splitOnChars: ['.', '-', '–', '—', ' '],
  useNativeClamp: false
};

function setDefaults(options) {
  defaults = _extends({}, defaults, options);
}

function setInitialContent(el) {
  if (el.clampInitialContent === undefined) {
    el.clampInitialContent = el.innerHTML.trim();
  }
}

function clampElement(el, clamp) {
  // We use element-resize-detector to trigger the ellipsis.
  // Element-resize-detector adds an inner div to monitor
  // it's scroll events.
  // The process of truncating the text for ellipsis removes this div, so we need to remove and readd it
  var scrollNode = el.querySelector('.erd_scroll_detection_container');
  if (scrollNode) {
    el.removeChild(scrollNode);
  }

  setInitialContent(el);

  if (el.clampInitialContent !== undefined) {
    el.innerHTML = el.clampInitialContent;
  }

  defaults = _extends({}, defaults, { clamp: clamp ? clamp : 'auto' });

  // Set the opactity to 0 to avoid content to flick when clamping.
  el.style.opacity = '0';
  var result = clampy.clamp(el, defaults);

  // Set the opacity back to 1 now that the content is clamped.
  el.style.opacity = '1';

  if (scrollNode) {
    el.appendChild(scrollNode);
  }
}

var VueClampy$1 = {
  inserted: function inserted(el, binding, vnode) {
    clampValue = binding.value;
    // Re-clamp on element resize
    // resizeDetector.listenTo(el, () => {
    //   clampElement(el, clampValue);
    // });

    // Also re-clamp on window resize
    window.addEventListener('resize', function () {
      clampElement(el, clampValue);
    });

    clampElement(el, clampValue);
  },
  update: function update(el, binding, vnode) {
    clampValue = binding.value;
    clampElement(el, clampValue);
  },
  unbind: function unbind(el, binding, vnode) {
    clampValue = binding.value;

    // Remove all listeners
    // resizeDetector.removeAllListeners(el);
    window.removeEventListener('resize', function () {
      clampElement(el, clampValue);
    });
  }
};

var install = function install(Vue, options) {
  if (options) setDefaults(options);
  Vue.directive('clampy', VueClampy$1);
  Vue.prototype.$clampy = VueClampy$1.clampy;
};

if (typeof window !== 'undefined' && window.Vue) {
  window.VueClampy = VueClampy$1;
  window.VueClampy.setDefaults = setDefaults;
  Vue.use(install);
}

VueClampy$1.install = install;

return VueClampy$1;

})));
