<template>
  <div class="search-box" @click="setInputGetFocus">
    <div class="icon">
      <i class="icon-search"></i>
    </div>
    <div class="input">
      <input ref="input" type="text" v-model="inputContent" :placeholder="placeholder" title="">
    </div>
    <div class="clear">
      <div class="btn icon-cross" v-show="inputContent" @click.stop="clickClearBtn"></div>
    </div>
  </div>
</template>

<script>
  import {debounce} from "../../common/js/util";

  export default {
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    data() {
      return {
        inputContent: ''
      }
    },
    created() {
      let time = debounce((newValue) => {
        this.$emit('query', newValue);
      }, 300);
      this.$watch('inputContent', time);
    },
    methods: {
      clickClearBtn() {
        // this.$emit('clickClear');
        this.inputContent = '';
      },
      setInputGetFocus() {
        this.$refs.input.focus();
      },
      setInputContent(text) {
        this.inputContent = text;
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import "~common/stylus/variable.styl"
  .search-box
    position: relative
    align-items: center
    padding: 10px 0
    background: $color-highlight-background
    font-size: $font-size-medium
    line-height: $font-size-medium-x
    border-radius: 4px
    .icon
      position: absolute
      left: 0
      top: 50%
      transform: translateY(-50%)
      width: 30px
      display: inline-block
      vertical-align: top
      text-align: center
      font-size: $font-size-medium-x
      line-height: $font-size-medium-x
    .input
      box-sizing: border-box
      padding: 0 30px
      width: 100%
      & > input
        width: 100%
        background: $color-highlight-background
        color: $color-text-l
        line-height: $font-size-medium-x
        -webkit-user-modify: read-write-plaintext-only
        font-size:16px
        &:focus
          outline: none
          color: $color-text-ll
    .clear
      position: absolute
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 30px
      text-align: center
      line-height: $font-size-medium-x
      .icon-cross
        font-size: 12px
</style>
