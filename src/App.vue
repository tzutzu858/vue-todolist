<template>
  <div>
    <div class="container my-5">
      <div class="row">
        <div class="col-md-9 post">
          <TodoTitle :msg="title" />
          <AddTodo
            :newTodoComponent="newTodo"
            @change-text="changeTextHandler"
            @onEnter="addTodo"
            @onClick="addTodo"
          />
          <div class="card text-center">
            <DisplayTable :allTodos="todos" :key="componenKey" />
            <div class="card-footer d-flex justify-content-between">
              <span>還有{{ showNoCompleted }}筆任務未完成</span>
              <a href="#" @click="allTodosClean">清除所有任務</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TodoTitle from "./components/TodoTitle.vue";
import AddTodo from "./components/AddTodo.vue";
import DisplayTable from "./components/DisplayTable.vue";

export default {
  // 一個檔案僅能有唯一的 default export
  name: "App",
  components: {
    TodoTitle,
    AddTodo,
    DisplayTable,
  },

  data() {
    return {
      title: "Todo 範例製作",
      newTodo: "",
      todos: [],
      componenKey: 0,
    };
  },

  methods: {
    changeTextHandler(val) {
      //處理子組件傳來的 value 放到 newTodo
      this.newTodo = val;
    },
    changeArrayHandler(val) {
      this.todos = val;
    },
    addTodo() {
      let value = this.newTodo.trim(); // 把資料存起來  //trim() 會移除字串起始及結尾處的空白字元。
      let timestamp = Math.floor(Date.now()); // 要一個隨機的 id，這邊用時間轉成數字
      if (!value) {
        return;
      }
      const params = {
        id: timestamp,
        title: value,
        completed: false,
      };
      this.todos.push(params);
      this.newTodo = ""; //value=''這個寫法沒作用
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
  },
  computed: {
    showNoCompleted() {
      let num = this.judgeCompleted().length;
      return num;
    },
  },
  mounted() {
    if (localStorage.aaa.length) {
      this.todos = JSON.parse(localStorage.aaa);
    }
    // const allTodos = JSON.stringify(this.todos);
    // if (!localStorage.aaa) {
    //   localStorage.setItem("aaa", allTodos);
    // } else {
    //   this.todos = JSON.parse(localStorage.aaa);
    // }
  },
  watch: {
    todos(newTodos) {
      localStorage.aaa = JSON.stringify(newTodos);
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.completed {
  text-decoration: line-through;
}
</style>
