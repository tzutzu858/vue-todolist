<template>
  <input
    type="text"
    class="form-control"
    placeholder="請輸入 todo"
    v-model="inputText"
  />
</template>

<script>
export default {
  name: "AddTodo",
  props: {
      newTodoComponent:{
      type:String,
      required:true,
    }
  },
  computed: {
    inputText: {
      get() {
        return this.newTodoComponent;
      },
      set(val) {
        this.$emit("change-text", val); //子組件傳出去
      },
    },
  },
};
</script>

<style scoped></style>
