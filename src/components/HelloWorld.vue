<template>
  <div class="list-wrap" ref="listRef">
    <div v-for="i in 100" :key="i" class="list-item">
      <div class="title">{{ i }}. </div>
      <div class="content">
        <span v-for="j in 20" :key="j">{{j}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {ScrollPositionSaver} from '@/utils/scroll-position-saver'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  mounted() {
    this.sps = new ScrollPositionSaver({
      targetEl: this.$refs.listRef,
      name: 'hello',
      debug: true,
    })
  },
  beforeDestroy() {
    this.sps && this.sps.destroy()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.list-wrap {
  width: 500px;
  height: 200px;
  overflow: auto;
  margin: 0 auto;
  border: 1px solid #42b983;

  .list-item {
    height: 50px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    width: fit-content;
    position: relative;

    &+.list-item {
      border-top: 1px solid #35495e;
    }

    &:nth-child(2n) {
      .title {
        background-color: #42b983;
      }
    }

    .title {
      width: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #35495e;
      height: 100%;
      color: white;
      position: sticky;
      left: 0;
    }
    .content {
      height: 100%;
      display: flex;
      span {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
      }
    }
  }
}
</style>
