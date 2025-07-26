<template>
  <Transition name="bounce">
    <slot></slot>
  </Transition>
</template>

<style scoped>
.bounce-enter-active {
  animation: bounce-in 0.2s;
}
.bounce-leave-active {
  animation: bounce-in 0.2s reverse;
}
.bounce-enter-active,
.bounce-leave-active {
  transition: opacity 0.2s ease;
}
.bounce-enter-from,
.bounce-leave-to {
  opacity: 0;
}

@keyframes bounce-in {
  0% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>
