<template>
<div>
  <h1 class="main-title">data-resolver Demo</h1>

  <h3 class="section-title">Load JSON</h3>
  <div>
    <json-editor :onLoadSuccess="onJsonLoadSuccess" />
  </div>
  
  <h3 class="section-title">Edit Resolvable</h3>
  <div>
    <resolvable-editor :context="context" :onSave="onResolvableSave"/>
  </div>

  <h3 class="section-title">Target Path</h3>
  <el-form label-width="170px">
    <el-form-item label="Target Path (optional)">
      <el-input v-model="targetPath" />
    </el-form-item>
  </el-form>

  <div class="main-controls">
    <el-button type="primary" @click="runResolve" :disabled="!isResolvableValid">Run Resolve</el-button>
  </div>

  <div v-if="result">
    <h3 class="section-title">Result</h3>
    <pre class="result-panel">{{ JSON.stringify(result, null, 2) }}</pre>
  </div>
</div>
</template>

<script>
import _ from 'lodash';
import resolver from 'data-resolver';
import JsonEditor from '@/components/json-editor';
import ResolvableEditor from '@/components/resolvable-editor';

export default {
  name: 'data-resolver-demo-page',

  data () {
    return {
      jsonObj: { test: '' },
      context: { ..._ },
      resolvable: { resolvableType: '', value: '', args: [] },
      targetPath: '',
      result: null
    };
  },

  computed: {
    isResolvableValid () {
      return true;
    }
  },

  methods: {
    onJsonLoadSuccess (obj) {
      this.jsonObj = { ...obj };
    },

    onResolvableSave (r) {
      this.resolvable = { ...r };
    },

    runResolve () {
      const r = resolver(this.resolvable, this.jsonObj, this.context, this.targetPath || undefined);
      if (r !== undefined && r !== null) {
        this.result = r;
      } else {
        this.result = null;
      }
    }
  },

  components: {
    JsonEditor,
    ResolvableEditor
  }
};
</script>

<style scoped>
.main-title {
  text-align: center;
}

.section-title {
  margin-left: 170px;
  margin-bottom: 10px;
}

.main-controls {
  display: flex;
  justify-content: flex-end;
}

.result-panel {
  padding: 15px;
  border: 1px solid #d3d3d3;
  background: #fbfbfb;
  border-radius: 3px;
  margin-left: 170px;
}
</style>
