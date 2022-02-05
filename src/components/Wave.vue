<template>
  <div id="wave">
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<script>
export default {
  name: 'Wave',
};
</script>

<style lang="scss" scoped>
@keyframes wave {
  0% {
    height: 100%;
  }
  50% {
    height: 20%;
  }
  100% {
    height: 100%;
  }
}

#wave {
  height: 80%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  div {
    max-width: 8px;
    min-width: 8px;
    border-radius: 8px;
    background: #1ed760;
  }

  div:nth-child(1) {
    animation: wave 1s cubic-bezier(0.075, 0.82, 0.165, 1) 0s infinite;
  }

  div:nth-child(2) {
    animation: wave 1s cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s infinite;
  }

  div:nth-child(3) {
    animation: wave 1s cubic-bezier(0.075, 0.82, 0.165, 1) 0.15s infinite;
  }
}
</style>