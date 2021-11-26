<template>
  <div class="dashboard-container">
    <p> 时间日期控件，不予许选择以前的时间日期</p>

    <el-date-picker type="datetimerange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    is-range
                    :picker-options="pickerOptions"
                    v-model="editForm.time"
                    range-separator="-"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间">
    </el-date-picker>

  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data () {
    return {
      editForm: {
        time: []
      },
      pickerOptions: {
        disabledDate: time => {
          let nowData = new Date()
          nowData = new Date(nowData.setDate(nowData.getDate() - 1))
          return time < nowData
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  margin: 100px auto;
  width: 500px;
  p {
    font-weight: 600;
    font-size: 16px;
  }
}
</style>
