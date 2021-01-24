<template>
<div id="container">
  <strong>Messages</strong>
  <p>You opened messages in the browser.</p>
</div>
</template>

<script>
export default {
  name: 'MessagePage',
  props: {
    name: String,
    message: String
  }
}
</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
