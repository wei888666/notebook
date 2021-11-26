<template>
  <div class="dashboard">
    <div class="item">
      <!-- 1.去重方法 -->
      <div>1.去重</div>
      <p>unique (arr, val) {</p>
      <p>const res = new Map();</p>
      <p>return arr.filter(item = !res.has(item[val]) && res.set(item[val], 1))</p>
      <p> },</p>
      <p>let arr = this.unique(this.editParams.rules, 'ruleStart')</p>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  margin: 30px auto;
  width: 90%;
  .item {
    margin: 20px;
    padding: 10px;
    border-radius: 20px;
    background: rgb(207, 204, 204);
    div {
      font-weight: 600;
      font-size: 16px;
    }
    p {
      font-size: 14px;
      margin: 0;
      padding: 5px;
    }
  }
}
</style>
