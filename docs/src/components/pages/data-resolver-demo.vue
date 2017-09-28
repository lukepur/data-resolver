<template>
<div>
  <h1 class="main-title">data-resolver Demo</h1>

  <h2 class="section-title">1. Load JSON</h2>
  <div>
    <json-editor :onLoadSuccess="onJsonLoadSuccess" />
  </div>
  
  <h2 class="section-title">2. Edit Resolvable <el-button type="text" @click="()=>{showLoadDialog = true}">Load Resolvable</el-button></h2>
  <div>
    <resolvable-editor :context="context" :onApply="onResolvableApply" :onSave="onResolvableSave" :resolvable="resolvable" />
  </div>

  <h2 class="section-title">3. Target Path</h2>
  <el-form label-width="170px">
    <el-form-item label="Target Path (optional)">
      <el-input v-model="targetPath" />
    </el-form-item>
  </el-form>

  <div class="main-controls">
    <el-button type="primary" @click="runResolve" :disabled="!isResolvableValid">Run Resolve</el-button>
  </div>

  <div v-if="result">
    <h2 class="section-title">4. Result</h2>
    <pre class="result-panel">{{ JSON.stringify(result, null, 2) }}</pre>
  </div>

  <!-- Dialogs -->
  <el-dialog title="Load Resolvable" :visible.sync="showLoadDialog">
    <el-select v-model="loadSelectId">
      <el-option v-for="r in resolvableLibrary" :key="r.id" :label="r.id" :value="r.id" />
    </el-select>
    <el-button type="primary" @click="loadResolvable">Load</el-button>
  </el-dialog>

  <el-dialog title="Save Resolvable" :visible.sync="showSaveDialog">
    <el-input v-model="saveResolvableId" placeholder="Enter an ID for the resolvable" />
    <el-button type="primary" @click="saveResolvable">Save</el-button>
  </el-dialog>
</div>
</template>

<script>
import _ from 'lodash';
import resolver from 'data-resolver';
import { mapGetters, mapActions } from 'vuex';
import JsonEditor from '@/components/json-editor';
import ResolvableEditor from '@/components/resolvable-editor';

export default {
  name: 'data-resolver-demo-page',

  data () {
    return {
      jsonObj: { test: '' },
      context: { ..._, _ },
      resolvable: { resolvableType: '', value: '', args: [] },
      targetPath: '',
      result: null,
      showLoadDialog: false,
      showSaveDialog: false,
      loadSelectId: null,
      saveResolvableId: null
    };
  },

  computed: {
    ...mapGetters(['resolvableLibrary']),
    isResolvableValid () {
      return true;
    }
  },

  methods: {
    ...mapActions({ storeSaveResolvable: 'saveResolvable' }),
    onJsonLoadSuccess (obj) {
      this.jsonObj = { ...obj };
    },

    onResolvableApply (r) {
      this.resolvable = { ...r };
    },

    onResolvableSave (r) {
      // show save dialog
      this.resolvable = { ...r };
      this.showSaveDialog = true;
    },

    runResolve () {
      const r = resolver(this.resolvable, this.jsonObj, this.context, this.targetPath || undefined);
      if (r !== undefined && r !== null) {
        this.result = r;
      } else {
        this.result = null;
      }
    },

    loadResolvable () {
      this.resolvable = { ..._.find(this.resolvableLibrary, { id: this.loadSelectId }).resolvable };
      this.showLoadDialog = false;
      this.loadSelectId = null;
    },

    saveResolvable () {
      this.storeSaveResolvable({ id: this.saveResolvableId, resolvable: this.resolvable });
      this.showSaveDialog = false;
      this.saveResolvableId = null;
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
