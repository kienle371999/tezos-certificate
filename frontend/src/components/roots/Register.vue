<template>
  <div class="register">
    <div class="form">
      <h1>{{ "Register" }}</h1>
      <form class="register-form">
        <input type="text" v-model="userName" placeholder="Username"/>
        <input type="email" v-model="email" placeholder="Email"/>
        <input type="password" v-model="password" placeholder="Password"/>
        <button type="button" @click="submit()">{{ "Submit" }}</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  
} 
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h1 {
  color: #000000;
  margin-bottom: 15px;
}
.register {
  font-family: Arial, Helvetica, sans-serif;
  position: fixed;
  top: 0%;
  left: 0%;
  height: 100%;
  width: 100%;
  display: flex;
  background: #051926;
}
.form {
  position: relative;
  display: inline-block;
  z-index: 1;
  background: #FFFFFF;
  max-width: 360px;
  margin: 70px auto auto auto;
  padding: 45px;
  text-align: center;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
}
.form input {
  font-size: 15px;
  color: #031532;
  border-radius: 3px;
  padding: 12px 15px;
  margin-bottom: 10px;
  background-color: #f3f4f5;
  border: solid 1px rgba(3,21,50,0.13);
  box-sizing: border-box;
  width: 100%;
}
.form button {
  background: #000000;
  width: 100%;
  border: 0;
  padding: 15px;
  color: #FFFFFF;
  font-size: 17px;
  border-radius: 3px;
  position: relative;
}
</style>
