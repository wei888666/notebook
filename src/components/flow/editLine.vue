<template>
  <el-form :model="line" ref="dataForm" label-width="100px" class="flowEditForm margin13" size="mini">
    <!-- <el-form-item label="GUID">
      <el-input disabled v-model="line.id"></el-input>
    </el-form-item>
    <el-form-item label="源活动">
      <el-input disabled v-model="line.from"></el-input>
    </el-form-item>
    <el-form-item label="目标活动">
      <el-input disabled v-model="line.to"></el-input>
    </el-form-item> -->

    <!-- <el-form-item label="状态" v-if="line.label">
      <el-select v-model="line.label" placeholder="请选择" :disabled="pageType == 3 ? true : false">
        <el-option label="yes" value="yes"></el-option>
        <el-option label="no" value="no"></el-option>
      </el-select>
    </el-form-item> -->
  </el-form>
</template>

<script>
export default {
  props: {
    pageType: {
      type: String,
      default: 1
    }
  },
  name: 'EditLine',
  data() {
    return {
      line: { label: '' },
      isUpdate: false
    }
  },
  watch: {
    line: {
      handler(val) {
        if (this.isUpdate) {
          this.$emit('line-save', this.line)
        }
      },
      deep: true
    }
  },
  methods: {
    init(item) {
      this.isUpdate = false
      this.line = item
      /* if (this.line.label != 'yes' && this.line.label != 'no') {
        setTimeout(() => {
          this.line.label = this.line.label == 1 ? '' : ''
        })
      } */
      this.$nextTick(function () {
        this.isUpdate = true
      })
    }
  }
}
</script>
