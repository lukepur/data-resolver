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
      this.attemptJsonLoad();
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
    movies: [
      {
        name: 'The Terminator',
        year: 1984,
        director: 'James Cameron',
        actors: ['Arnold Schwarzenegger', 'Linda Hamilton']
      },
      {
        name: 'Snatch',
        year: 2000,
        director: 'Guy Ritchie',
        actors: ['Brad Pitt', 'Jason Statham']
      },
      {
        name: 'Inglorious Basterds',
        year: 2008,
        director: 'Quentin Tarantino',
        actors: ['Brad Pitt', 'Christoph Waltz']
      },
      {
        name: 'American Psycho',
        year: 2000,
        director: 'Mary Harron',
        actors: ['Christian Bale', 'Jared Leto']
      }
    ]
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
