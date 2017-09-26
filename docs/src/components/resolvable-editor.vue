<template>
  <div class="resolvable-editor-container">
    <el-form label-width="120px">
      <el-form-item label="Resolvable Type">
        <el-select v-model="currentlyEditingNode.resolvableType">
          <el-option label="literal" value="literal" /> 
          <el-option label="lookup" value="lookup" /> 
          <el-option label="fn" value="fn" /> 
          <el-option label="fnRefLookup" value="fnRefLookup" /> 
        </el-select>
      </el-form-item>

      <el-form-item label="Value" v-if="showValue">
        <el-input v-model="currentlyEditingNode.value" v-if="!isFnType"/>
        <el-select v-model="currentlyEditingNode.value" v-if="isFnType">
          <el-option v-for="fn in fns" :key="fn" :label="fn" :value="fn" />
        </el-select>
      </el-form-item>

      <el-form-item label="Args" v-if="showArgs">
        <el-table :data="currentlyEditingNode.args" v-if="currentlyEditingNode.args.length">
          <el-table-column prop="resolvableType" label="Type" width="120px" />
          <el-table-column prop="value" label="Value" width="350px" />
          <el-table-column label="Actions" >
            <template scope="scope">
              <el-button size="small" @click="editArg(scope.$index)" icon="edit" title="Edit this arg">Edit</el-button>
              <el-button size="small" @click="removeArg(scope.$index)" icon="delete" title="Remove this arg">Remove</el-button>
              <el-button size="small" @click="moveArgUp(scope.$index)" :disabled="!canArgMoveUp(scope.$index)" icon="caret-top" title="Move this arg up in the list"></el-button>
              <el-button size="small" @click="moveArgDown(scope.$index)" :disabled="!canArgMoveDown(scope.$index)" icon="caret-bottom" title="Move this arg down in the list"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button @click="addArg">Add Arg</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'resolvable-editor',

  props: {
    resolvable: {
      type: Object
    },
    context: {
      type: Object
    },
    onSave: {
      type: Function,
      default: () => {}
    }
  },

  data () {
    return {
      currentlyEditingPath: [],
      localResolvable: { resolvableType: '', value: '', args: [] }
    };
  },

  computed: {
    fns () {
      return Object.keys(this.context).filter(key => typeof this.context[key] === 'function');
    },

    currentlyEditingNode () {
      let node = this.localResolvable;

      if (this.currentlyEditingPath === []) return node;

      this.currentlyEditingPath.forEach((i) => {
        node = node.args[i];
      });

      return node;
    },

    showValue () {
      return this.currentlyEditingNode.resolvableType;
    },

    showArgs () {
      return this.isFnType && this.currentlyEditingNode.value;
    },

    isFnType () {
      const { resolvableType } = this.currentlyEditingNode;
      return resolvableType === 'fn' || resolvableType === 'fnRefLookup';
    }
  },

  watch: {
    resolvable (newVal) {
      this.localResolvable = { ...newVal };
    },

    'currentlyEditingNode.resolvableType': function clearValue () {
      this.currentlyEditingNode.value = '';
    }
  },

  methods: {
    addArg () {
      this.currentlyEditingNode.args = [...this.currentlyEditingNode.args, { resolvableType: '', value: '', args: [] }];
    },

    editArg (index) {
      this.currentlyEditingPath.push(index);
    },

    removeArg (index) {
      this.currentlyEditingNode.args.splice(index, 1);
    },

    canArgMoveUp (index) {
      return index > 0;
    },

    canArgMoveDown (index) {
      return index < this.currentlyEditingNode.args.length - 1;
    },

    moveArgUp (index) {
      const args = this.currentlyEditingNode.args;
      if (this.canArgMoveUp(index)) {
        args.splice(index - 1, 0, (args.splice(index, 1)[0]));
      }
    },

    moveArgDown (index) {
      const args = this.currentlyEditingNode.args;
      if (this.canArgMoveDown(index)) {
        args.splice(index + 1, 0, (args.splice(index, 1)[0]));
      }
    }
  }
};
</script>

<style scoped>
.resolvable-editor-container {
  max-width: 920px;

}
.resolvable-editor-container  .el-select {
  width: 100%;
}
</style>