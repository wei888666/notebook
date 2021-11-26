<template>
  <div class="dashboard">
    <div class="item">
      <div> 时间日期控件，不予许选择以前的时间日期</div>
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

    <div class="item">
      <div> 格式化时间戳</div>
      <span style="margin:10px 0">{{new Date()}} </span>
      <span>{{format(dateTime)}}</span>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data () {
    return {
      /** 111 时间组件 */
      editForm: {
        time: []
      },
      pickerOptions: {
        disabledDate: time => {
          let nowData = new Date()
          nowData = new Date(nowData.setDate(nowData.getDate() - 1))
          return time < nowData
        }
      },
      /** 222 时间戳 */
      dateTime: new Date(),
    }
  },
  methods: {
    /** 格式化时间 */
    addTime (m) {
      return m < 10 ? '0' + m : m
    },
    format (t) {
      if (t) {
        var time = new Date(t);
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        return y + '-' + this.addTime(m) + '-' + this.addTime(d) + ' ' + this.addTime(h) + ':' + this.addTime(mm) + ':' + this.addTime(s);
      } else {
        return
      }
    },

  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  margin: 30px auto;
  width: 90%;
  .item {
    min-height: 160px;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    width: 100%;
    padding: 20px;
    margin: 15px 0;
    border-radius: 20px;
    display: flex;
    background: #cfcccc;
    text-align: center;
    align-content: flex-end;
    flex-direction: column;
    justify-content: center;

    div {
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 10px;
    }
    p {
      font-size: 14px;
      margin: 0;
      padding: 5px;
    }
  }
}
</style>
