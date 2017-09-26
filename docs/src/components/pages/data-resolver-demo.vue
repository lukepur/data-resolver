<template>
<div>
  <h1>data-resolver Demo</h1>

  <div>
    <json-editor :onLoadSuccess="onJsonLoadSuccess" />
  </div>
  <div>
    <resolvable-editor :context="context" />
  </div>
  <div>{{ jsonObj }}</div>
</div>
</template>

<script>
import _ from 'lodash';
import JsonEditor from '@/components/json-editor';
import ResolvableEditor from '@/components/resolvable-editor';

export default {
  name: 'data-resolver-demo-page',

  data () {
    return {
      jsonObj: { test: '' },
      context: { ..._ }
    };
  },

  methods: {
    onJsonLoadSuccess (obj) {
      this.jsonObj = { ...obj };
    }
  },

  components: {
    JsonEditor,
    ResolvableEditor
  }
};
</script>
