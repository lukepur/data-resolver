<template>
  <div>
    <el-form label-width="120px">
      <el-form-item label="JSON">
        <el-input type="textarea" v-model="localJson" />
      </el-form-item>
    </el-form>
    <div>
      <el-button @click="attemptJsonLoad">Load</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'json-editor',
  props: {
    json: {
      type: String
    },
    onLoadSuccess: {
      type: Function,
      default: () => {}
    }
  },

  data () {
    return {
      localJson: ''
    };
  },

  methods: {
    attemptJsonLoad () {
      try {
        this.onLoadSuccess(JSON.parse(this.localJson));
      } catch (e) {
        // handle attempt to load invalid JSON
      }
    }
  },

  watch: {
    json (newValue) {
      this.localJson = newValue;
    }
  }
};
</script>
