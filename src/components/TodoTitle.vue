<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: "TodoTitle",
  props: {
    msg:{
      type:String,
      required:true,
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  font-size: 40px;
  color: cadetblue;
}
</style>
