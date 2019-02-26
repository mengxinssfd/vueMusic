<template>
  <transition name="dlg">
    <div class="dialog" @click.stop="closeDialog">
      <div class="dialog-body-wrapper" :style="dialog.css?dialog.css:''">
        <div class="dialog-body"  @click.stop>
          <div class="content">
            <p>{{dialog.content}}</p>
          </div>
          <div class="select">
            <div class="no" @click="clickNo">{{dialog.no}}</div>
            <div class="yes" @click="clickYes">{{dialog.yes}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      dialog: {
        type: Object,
        default: {}
      }
    },
    methods: {
      closeDialog() {
        this.$emit('closeDialog');
      },
      clickNo() {
        if (this.dialog.noHandler) {
          this.dialog.noHandler();
        }
        this.closeDialog();
      },
      clickYes() {
        if (this.dialog.yesHandler) {
          this.dialog.yesHandler();
        }
        this.closeDialog();
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import "~common/stylus/variable.styl"
  .dialog
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    background: rgba(0, 0, 0, 0.2)
    .dialog-body-wrapper
      position: absolute
      top: 50%
      left: 50%
      width: 260px
      transform: translate3d(-50%, -50%, 0)
      .dialog-body
        text-align: center
        background: $color-highlight-background
        border-radius: 10px
        font-size: $font-size-medium
        color: $color-text
        .content
          min-height: 50px
          line-height: 50px
          padding: 10px
        .select
          display: flex
          border-top: 1px solid $color-background-d
          text-align: center
          color: $color-theme
          & > div
            flex: 1
            line-height: 36px
            & + div
              border-left: 1px solid $color-background-d

  .dlg-enter-active, .dlg-leave-active
    transition: all .5s
    .dialog-body
      transition: all .5s

  .dlg-enter, .dlg-leave-to
    opacity: 0
    .dialog-body
      transform: scale(0.5)
</style>
