<template>
  <div id="carouselComponentContainer">
    <div class="header">
      <h2>{{ title }}</h2>

      <button :disabled="!!begin" @click="previous">
        <ph-caret-left :size="48" />
      </button>
      <button :disabled="!!end" @click="next">
        <ph-caret-right :size="48" />
      </button>
    </div>
    <div class="content" ref="carouselRef">
      <div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { PhCaretLeft, PhCaretRight } from 'phosphor-vue';

export default {
  name: 'Carousel',
  props: { title: String },
  components: { PhCaretLeft, PhCaretRight },
  data: function() {
    return {
      begin: true,
      end: false,
    };
  },
  methods: {
    next: function() {
      const secureWidth = 300;
      const widthScreen = this.$refs.carouselRef.clientWidth;
      const leftScrool = this.$refs.carouselRef.scrollLeft;

      const maxScroll = this.$refs.carouselRef.scrollWidth - widthScreen;

      this.begin = false;

      if (maxScroll <= widthScreen - secureWidth + leftScrool) {
        this.end = true;
      } else {
        this.end = false;
      }

      this.$refs.carouselRef.scroll({
        top: 0,
        left: widthScreen - secureWidth + leftScrool,
        behavior: 'smooth',
      });
    },

    previous: function() {
      const secureWidth = 300;
      const widthScreen = this.$refs.carouselRef.clientWidth;
      const leftScrool = this.$refs.carouselRef.scrollLeft;

      this.end = false;

      if (leftScrool - widthScreen + secureWidth <= 0) {
        this.begin = true;
      } else {
        this.begin = false;
      }

      this.$refs.carouselRef.scroll({
        top: 0,
        left: leftScrool - widthScreen + secureWidth,
        behavior: 'smooth',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
#carouselComponentContainer {
  max-width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;

  .header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 16px;
    padding: 0 16px;

    @include md {
      padding-left: 48px;
    }

    h2 {
      margin-right: auto;
      font-weight: 500;
      opacity: 0.8;
    }

    button {
      color: #fff;
      padding: 16px;
      display: none;

      @include md {
        display: block;
      }

      &:disabled {
        opacity: 0.5;
      }
    }
  }

  .content {
    overflow: auto;
    padding-left: 16px;

    @include md {
      padding-left: 48px;
    }

    &::-webkit-scrollbar {
      width: 0px;
    }

    > div {
      display: flex;
      gap: 16px;
      margin-top: 16px;
      &:after {
        content: '';
        display: block;
        padding-right: 48px;
      }
    }
  }
}
</style>
