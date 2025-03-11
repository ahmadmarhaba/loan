<template>
  <svg-icon :fa-icon="faPlus" :size="12" flip="horizontal"></svg-icon>
</template>

<script>
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default {
  setup() {
    return {
      faPlus,
    };
  },
};
</script>
