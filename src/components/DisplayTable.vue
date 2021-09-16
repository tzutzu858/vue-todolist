<template>
  <div>
    <div class="card-header">
      <ul class="nav nav-tabs card-header-tabs">
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: visibility == 'all' }"
            @click="visibility = 'all'"
            href="#"
            >全部</a
          >
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: visibility == 'active' }"
            @click="visibility = 'active'"
            href="#"
            >進行中</a
          >
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: visibility == 'completed' }"
            @click="visibility = 'completed'"
            href="#"
            >已完成</a
          >
        </li>
      </ul>
    </div>
    <ul class="list-group list-group-flush text-left">
      <li
        class="list-group-item"
        v-for="(item, index) of filteredTodos"
        :key="index"
        @dblclick="editTodo(item)"
      >
        <!-- filteredTodos 可以不用加 this 的原因是vue 在背後幫忙省略 this，要加也是可以 -->
        <div class="d-flex" v-if="item.id !== cacheTodo.id">
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              v-model="item.completed"
              @change="saveDataToStorage"
              :id="item.id"
            />
            <!-- 不要用 @click="saveDataToStorage" 
                        時間順序關係:因為v-modal 的時間是一個異步的，會導致 click 綁定事件裡面拿到的 data 數據不是最新的-->
            <label
              class="form-check-label"
              :class="{ completed: item.completed }"
              :for="item.id"
            >
              {{ item.title }}
            </label>
          </div>
          <button
            type="button"
            class="close ml-auto"
            aria-label="Close"
            @click="removeTodo(item)"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <input
          type="text"
          class="form-control"
          v-if="item.id === cacheTodo.id"
          v-model="cacheTitle"
          @keyup.esc="cancleEdit()"
          @keyup.enter="downEdit(item)"
        />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "DisplayTable",
  props: {
    displayTableComponent: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },

  data() {
    return {
      title: "Todo 範例製作",
      newTodo: "",
      todos: [],
      visibility: "all",
      cacheTodo: {},
      cacheTitle: "",
    };
  },

  methods: {
    editTodo(item) {
      this.cacheTodo = item;
      this.cacheTitle = item.title;
    },
    cancleEdit() {
      this.cacheTodo = {};
    },
    downEdit(item) {
      item.title = this.cacheTitle;
      this.saveDataToStorage();
      this.cacheTitle = "";
      this.cacheTodo = {};
    },
    removeTodo(item) {
      // this.todos.splice(this.todos.indexOf(item), 1);
      this.todos = this.filterdata(this.todos, item.id);
      // this.todos = this.todos.filter(({ id }) => id != item.id); //盡量把 filter 功能直接變成一個 function，這樣在其他地方也可以用上
      // this.todos.splice(index, 1) //如果用 index 來修改資料，在切換分類頁面時，data 會變，這樣 index 也跟著變
    },
    filterdata(array, id) {
      return array.filter((item) => id != item.id);
    },
    judgeCompleted() {
      const noCompleted = [];
      this.todos.forEach(function (item) {
        if (!item.completed) {
          noCompleted.push(item);
        }
      });
      return noCompleted;
    },
    allTodosClean() {
      this.todos = [];
    },
    saveDataToStorage() {
      localStorage.aaa = JSON.stringify(this.todos);
    }, 
  },
  computed: {
      //computed 裡的 function 一定要 return
      filteredTodos: function () {
        if (this.visibility == "all") {
          return this.todos;
        } else if (this.visibility == "active") {
          return this.judgeCompleted();
        } else if (this.visibility == "completed") {
          return this.todos.filter(({ completed }) => completed); //如果用解構帶參數，()不能省
          //return this.todos.filter(item => item.completed); //箭頭函式如果沒有 return 就要{}
          //return this.todos.filter(function (item) { return item.completed });  //舊寫法
        }
        return [];
      },
      showNoCompleted() {
        let num = this.judgeCompleted().length;
        return num;
      },
    },
    mounted() {
      const allTodos = JSON.stringify(this.todos);
      if (!localStorage.aaa) {
        localStorage.setItem("aaa", allTodos);
      } else {
        this.todos = JSON.parse(localStorage.aaa);
      }
    },
    watch: {
      todos(newTodos) {
        localStorage.aaa = JSON.stringify(newTodos);
      },
    },
};
</script>

<style scoped></style>