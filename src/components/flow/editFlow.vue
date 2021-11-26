<template>
  <el-form :model="flowData" ref="dataForm" label-width="100px" class="flowEditForm margin13" size="mini">
    <el-form-item label="GUID">
      <el-input disabled v-model="flowData.Id"></el-input>
    </el-form-item>
    <el-form-item label="流程名称">
      <el-input v-model="flowData.Name" :disabled="pageType == 3 ? true : false"></el-input>
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="flowData.Remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" :disabled="pageType == 3 ? true : false"></el-input>
    </el-form-item>
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
  name: 'EditFlow',
  data() {
    return {
      flowData: {}
    }
  },
  methods: {
    init(data) {
      this.flowData = data
    }
  }
}
</script>
