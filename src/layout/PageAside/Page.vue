<template>
  <div id="pageAsideContainer">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'PageAside',
};
</script>

<style lang="scss" scoped>
#pageAsideContainer {
  display: flex;
  flex: 1;
  color: #fff;
  overflow-y: auto;
  overflow-x: hidden;
  max-width: 100vw;
  scroll-behavior: smooth;
  flex-direction: column-reverse;

  @include md {
    flex-direction: row;
  }

  > main {
    display: flex;
    flex-direction: column;
    flex: 1;
    /* TODO put 400 in variable */
    max-width: 100%;

    @include md {
      max-width: calc(100% - 400px);
    }
  }
}
</style>
