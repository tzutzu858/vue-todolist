<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <a class="navbar-brand" href="/">Vue.js 練習手冊</a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarText"
        aria-controls="navbarText"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarText">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <a class="nav-link" href="/basic/dev.html">基礎教學</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/template/basic.html">模板指令</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/components/basic.html">組件</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/api/vue_set.html">常用 API</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/es6/let_const.html">ES6</a>
          </li>
        </ul>
      </div>
    </nav>
    <div class="container my-5">
      <div class="row">
        <div class="col-md-3">
          <div>
            <h6 class="text-capitalize text-muted">basic</h6>

            <a href="/basic/dev.html" class="btn btn-block btn-link">
              Vue 的開發環境
            </a>

            <a href="/basic/instant.html" class="btn btn-block btn-link">
              建立 Vue 的應用程式
            </a>

            <a href="/basic/mvvm.html" class="btn btn-block btn-link">
              MVVM 是什麼樣的概念
            </a>

            <a href="/basic/directive.html" class="btn btn-block btn-link">
              指令
            </a>

            <a href="/basic/if_for.html" class="btn btn-block btn-link">
              模板語法的延伸 v-if 及 v-for
            </a>

            <a href="/basic/v_on.html" class="btn btn-block btn-link">
              處理互動式行為 v-on 指令
            </a>

            <a href="/basic/defined_var.html" class="btn btn-block btn-link">
              預先定義資料結構
            </a>

            <a href="/basic/modifiers.html" class="btn btn-block btn-link">
              修飾符 與 縮寫
            </a>

            <a href="/basic/v_class.html" class="btn btn-block btn-link">
              切換 Class
            </a>

            <a href="/basic/computed.html" class="btn btn-block btn-link">
              計算屬性
            </a>

            <a href="/basic/form.html" class="btn btn-block btn-link">
              表單雙向綁定
            </a>

            <a href="/basic/components.html" class="btn btn-block btn-link">
              元件化
            </a>

            <a href="/basic/todo.html" class="btn btn-block btn-primary active">
              Todo 範例練習
            </a>

            <a href="/basic/v_lifecycle.html" class="btn btn-block btn-link">
              延伸介紹 - Vue 生命週期
            </a>
          </div>
        </div>

        <div class="col-md-9 post">
          <h1 class="mt-0 text-muted">Todo 範例製作</h1>

          <div class="alert alert-secondary">
            <ol class="mb-0">
              <li>請跟隨課程完成此章節。</li>
            </ol>
          </div>

          <div id="app">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">待辦事項</span>
              </div>
              <input
                type="text"
                class="form-control"
                placeholder="準備要做的任務"
                @keyup.enter="addTodo"
                v-model="newTodo"
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
                <!-- <li class="list-group-item">
                <input type="text" class="form-control">
              </li> -->
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
export default {
  data() {
    return {
      newTodo: "",
      todos: [],
      visibility: "all",
      cacheTodo: {},
      cacheTitle: "",
      noCompletedNum: 0,
    };
  },

  methods: {
    addTodo: function () {
      let value = this.newTodo.trim(); // 把資料存起來
      let timestamp = Math.floor(Date.now()); // 要一個隨機的 id，這邊用時間轉成數字
      if (!value) return;
      this.todos.push({
        id: timestamp,
        title: value,
        completed: false,
      });
      this.newTodo = ""; //value=''這個寫法沒作用
    },
    editTodo: function (item) {
      this.cacheTodo = item;
      this.cacheTitle = item.title;
    },
    cancleEdit: function () {
      this.cacheTodo = {};
    },
    downEdit: function (item) {
      item.title = this.cacheTitle;
      this.saveDataToStorage();
      this.cacheTitle = "";
      this.cacheTodo = {};
    },
    removeTodo: function (item) {
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
