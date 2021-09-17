<template>
  <div class="input-group mb-3">
    <div class="input-group-prepend">
      <span class="input-group-text" id="basic-addon1">待辦事項</span>
    </div>
    <input
      type="text"
      class="form-control"
      :placeholder="placeholder"
      v-model="inputText"
      @keypress.enter="$emit('onEnter')"
    />
    <div class="input-group-append">
      <button class="btn btn-primary" type="button" @click="$emit('onClick')">
        新增
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddTodo",
  props: {
    newTodoComponent: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: "請輸入 todo",
    },
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
