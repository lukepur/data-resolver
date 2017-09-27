<template>
<div>
  <h1>data-resolver Demo</h1>

  <h3>Load JSON</h3>
  <div>
    <json-editor :onLoadSuccess="onJsonLoadSuccess" />
  </div>
  
  <h3>Edit Resolvable</h3>
  <div>
    <resolvable-editor :context="context" :onSave="onResolvableSave"/>
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
      context: { ..._ },
      resolvable: { resolvableType: '', value: '', args: [] }
    };
  },

  methods: {
    onJsonLoadSuccess (obj) {
      this.jsonObj = { ...obj };
    },

    onResolvableSave (r) {
      this.resolvable = { ...r };
    }
  },

  components: {
    JsonEditor,
    ResolvableEditor
  }
};
</script>
