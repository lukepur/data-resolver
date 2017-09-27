<template>
  <div>
    <el-form label-width="170px">
      <el-form-item label="JSON">
        <el-input type="textarea" v-model="localJson" :rows="10"/>
      </el-form-item>
      <el-form-item>
        <div class="controls">
          <el-button class="load-sample-button" @click="loadSample" type="text">Load Sample</el-button>
          <el-button @click="attemptJsonLoad" type="primary">Load</el-button>
        </div>
      </el-form-item>
    </el-form>
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
    },

    loadSample () {
      this.localJson = JSON.stringify(genSample(), null, 2);
    }
  },

  watch: {
    json (newValue) {
      this.localJson = newValue;
    }
  }
};

function genSample () {
  return {
    test: 2
  };
}
</script>

<style scoped>
.controls {
  display: flex;
  justify-content: flex-end;
}

.load-sample-button {
  margin-right: 20px;
}
</style>
