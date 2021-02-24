<template>
  <p>{{ gretting }} World</p>
</template>
<script>
export default {
  data() {
    return {
      gretting: 'Hello',
    }
  },
}
</script>

<style scoped>
p {
  font-size: 2em;
  text-align: center;
}
</style>