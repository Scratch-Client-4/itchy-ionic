<template>
  <div class="error">
    <h1>{{ code }}</h1>
    <p>{{ message }}</p>
  </div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "Error",
  props: {
    code: {
      type: Number,
      default: 404,
    },
    message: {
      type: String,
      default: "Whoops, something went wrong.",
    },
  },
});
</script>

<style scoped>
.error {
  text-align: center;
  opacity: 0.5;
}

h1 {
  font-size: 30vw;
}

p {
  font-size: 0.9em;
}
</style>