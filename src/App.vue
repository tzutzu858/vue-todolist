<template>
  <div>
    <div class="container my-5">
      <div class="row">
        <div class="col-md-9 post">
          <TodoTitle :msg="title" />
          <div id="app">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">待辦事項</span>
              </div>

              <AddTodo
                :newTodoComponent="newTodo"
                @change-text="changeTextHandler"
                @keyup.enter="addTodo"
              />
              <div class="input-group-append">
                <button class="btn btn-primary" type="button" @click="addTodo">
                  新增
                </button>
              </div>
            </div>
            <div class="card text-center">
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
                  <!-- filteredTodos 可以不用加 this 的原因是vue 在背後幫忙省略 this，要加也是可以 了 -->
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
                      @click="removeTodo(item, index)"
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

export default {
  //一個檔案僅能有唯一的 default export
  name: "App",
  components: {
    TodoTitle,
    AddTodo,
  },

  data() {
    return {
      title: "Todo 範例製作",
      newTodo: "",
      todos: [],
      visibility: "all",
      cacheTodo: {},
      cacheTitle: "",
      noCompletedNum: 0,
    };
  },

  methods: {
    changeTextHandler(val) {
      this.newTodo = val;
    },

    addTodo() {
      let value = this.newTodo.trim(); // 把資料存起來  //trim() 會移除字串起始及結尾處的空白字元。
      let timestamp = Math.floor(Date.now()); // 要一個隨機的 id，這邊用時間轉成數字
      if (!value) return;
      this.todos.push({
        id: timestamp,
        title: value,
        completed: false,
      });
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
      this.todos = this.filterdata(this.todos, item.id);
      // this.todos = this.todos.filter(({ id }) => id != item.id); //盡量把 filter 功能直接變成一個 function，這樣在其他地方也可以用上
      //this.todos.splice(index, 1) //如果用 index 來修改資料，在切換分類頁面時，data 會變，這樣 index 也跟著變
    },
    filterdata(array, id) {
      return array.filter((item) => id != item.id);
    },
    judgeCompleted() {
      const noCompleted = [];
      // const _this = this
      this.todos.forEach(function (item) {
        // console.log(_this);
        // console.log(this);
        if (!item.completed) {
          noCompleted.push(item);
        }
      });

      //this.showNoCompleted = noCompleted.length
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
    //computed 一定要 return
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
      // this.noCompletedNum = num;
      return num;
    },
  },
  mounted() {
    const allTodos = JSON.stringify(this.todos);
    if (!localStorage) {
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
