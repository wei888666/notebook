<template>
  <div>
    <svg-icon :icon-class="isFullscreen ? 'exit-fullscreen':'fullscreen'" @click="clickFn" />
  </div>
</template>

<script>
import screenfull from 'screenfull'
export default {
  name: 'Screenfull',
  data() {
    return {
      isFullscreen: false
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    clickFn() {
      screenfull.toggle()
      this.isFullscreen = !this.isFullscreen
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen
    },
    init() {
      if (screenfull.enabled) {
        screenfull.on('change', this.change)
      }
    },
    destroy() {
      if (screenfull.enabled) {
        screenfull.off('change', this.change)
      }
    }
  }
}
</script>

<style scoped>
.screenfull-svg {display: inline-block; cursor: pointer; fill: #5a5e66;; width: 20px; height: 20px; vertical-align: 10px;}
</style>