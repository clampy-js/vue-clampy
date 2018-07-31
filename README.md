# vue-clampy
Vue.js (2+) directive that clamps the content of an element by adding an ellipsis to it if the content inside is too long.

It uses [@clampy-js/clampy](https://github.com/clampy-js/clampy) library (a fork of [Clamp.js](https://github.com/josephschmitt/Clamp.js)) behind the scene to apply the ellipsis.

It automatically re-clamps itself when the element or the browser window change size.

#### Installation
You can install @clampy-js/vue-clampy using NPM or Yarn:

```
npm install @clampy-js/vue-clampy
```

```
yarn install @clampy-js/vue-clampy
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
