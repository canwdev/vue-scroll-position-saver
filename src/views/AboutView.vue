<template>
  <div class="about">
    <h1>This is an about page</h1>

    <div class="list" ref="listRef">
      <div v-for="i in 100" :key="i" class="list-item">{{ i }}</div>
    </div>
  </div>
</template>

<script>
import {ScrollPositionSaver} from '@/utils/scroll-position-saver'
export default {
  mounted() {
    this.sps = new ScrollPositionSaver({
      // targetEl: this.$refs.listRef,
      name: 'demo',
      // timeout: 1 * 1000,
      debug: true,
      // refreshOnly: true
    })
  },
  beforeDestroy() {
    this.sps && this.sps.destroy()
  }
};
</script>

<style lang="scss" scoped>
.list {
  // width: 500px;
  // height: 200px;
  // overflow: auto;

  .list-item {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:nth-child(2n) {
      background: rgb(173, 173, 173);
    }
  }
}
</style>