<template>
  <div>
    <div class="container my-5">
      <div class="row">
        <div class="col-md-9 post">
          <TodoTitle :msg="title" />
          <div id="app">
            <AddTodo
              :newTodoComponent="newTodo"
              @change-text="changeTextHandler"
              @onEnter="addTodo"
              @onClick="addTodo"
            />
            <div class="card text-center">
              <DisplayTable />
              <div class="card-footer d-flex justify-content-between">
                <span>還有{{ showNoCompleted }}筆任務未完成</span>
                <a href="#" @click="allTodosClean">清除所有任務</a>
              </div>
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
      visibility: "all",
      cacheTodo: {},
      cacheTitle: "",
    };
  },

  methods: {
    changeTextHandler(val) {
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
