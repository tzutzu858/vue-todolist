// 這支 component 主要是用 props 拿父層的 todos data 來做分類跟顯示畫面  
// 當有編輯 todo 時，會改動 local storage(array)
// 當 checkbox 有更動也是用 @change 去改動 local storage(array)
// 當刪除時，用splice() 改變到原本的 array
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
    //父層只能監聽子層事件的觸發
    allTodos: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },

  watch: {
    allTodos(newValue, oldValue) {
      console.log("new");
      console.log(newValue);
      console.log("old");
      console.log(oldValue);
    },
  },
  data() {
    return {
      title: "Todo 範例製作",
      newTodo: "",
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
       this.allTodos.splice(this.allTodos.indexOf(item), 1); // splice()、sort() 這些都會改動到原本的 array
      // this.allTodos = this.allTodos.filter(({ id }) => id != item.id);  filter() 不會改動到原本的 array
    },
    judgeCompleted() {
      const noCompleted = [];
      this.allTodos.forEach(function (item) {
        if (!item.completed) {
          noCompleted.push(item);
        }
      });
      return noCompleted;
    },
    saveDataToStorage() {
      localStorage.aaa = JSON.stringify(this.allTodos);
    },
  },
  computed: {
    //computed 裡的 function 一定要 return
    filteredTodos: function () {
      if (this.visibility == "all") {
        return this.allTodos;
      } else if (this.visibility == "active") {
        return this.judgeCompleted();
      } else if (this.visibility == "completed") {
        return this.allTodos.filter(({ completed }) => completed); //如果用解構帶參數，()不能省
        //return this.todos.filter(item => item.completed); //箭頭函式如果沒有 return 就要{}
        //return this.todos.filter(function (item) { return item.completed });  //舊寫法
      }
      return [];
    },
  },
};
</script>