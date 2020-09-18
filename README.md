# vue-clampy
[![Build Status](https://img.shields.io/travis/clampy-js/vue-clampy.svg)](https://travis-ci.org/clampy-js/vue-clampy)
[![GitHub issues](https://img.shields.io/github/issues/clampy-js/vue-clampy.svg)](https://github.com/clampy-js/vue-clampy/issues)
[![GitHub license](https://img.shields.io/github/license/clampy-js/vue-clampy.svg)](https://github.com/clampy-js/vue-clampy/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/dt/@clampy-js/vue-clampy.svg)](https://www.npmjs.com/package/@clampy-js/vue-clampy)

Vue.js (2+) directive that clamps the content of an element by adding an ellipsis to it if the content inside is too long.

It uses [@clampy-js/clampy](https://github.com/clampy-js/clampy) library (a fork of [Clamp.js](https://github.com/josephschmitt/Clamp.js)) behind the scene to apply the ellipsis.

It automatically re-clamps itself when the element or the browser window change size.

#### Installation
You can install @clampy-js/vue-clampy using NPM or Yarn:

```
npm install @clampy-js/vue-clampy
```

```
yarn add @clampy-js/vue-clampy
```

#### Usage
```typescript
<script>
import clampy from '@clampy-js/vue-clampy';
import Vue from 'vue';

Vue.use(clampy);

export default {
  name: 'app',
  directives: {
    clampy
  }
};
</script>
<template>
  <p v-clampy="3">Long text to clamp here</p>
</template>  
```

#### Options
You can also override default options globally:

```typescript

Vue.use(clampy, {
  truncationChar: '✂️'
});
 
```
