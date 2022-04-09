<template>
  <div class="about">
    <h1>This is an about page</h1>

    <div class="list-wrap">
      <div v-for="i in 100" :key="i" class="list-item">{{ i }}111</div>
    </div>
  </div>
</template>

<script>
import {ScrollPositionSaver} from '@/utils/scroll-position-saver'
export default {
  beforeRouteEnter(to, from, next) {
    console.log({to, from})
    next(vm => {
      vm.isRouterChange = to.name !== from.name
    })
  },
  data() {
    return {
      isRouterChange: false
    }
  },
  mounted() {
    this.sps = new ScrollPositionSaver({
      name: 'about',
      // timeout: 1 * 1000,
      refreshOnly: true,
      autoRestore: this.isRouterChange ? -1 : 0,
      debug: true,
    })
  },
  beforeDestroy() {
    this.sps && this.sps.destroy()
  }
};
</script>

<style lang="scss" scoped>
.list-wrap {

  .list-item {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:nth-child(2n) {
      background: rgb(66 185 131);
      color: white;
    }
  }
}
</style>
