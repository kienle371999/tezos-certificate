<template>
  <div class="login">
    <div class="form">
      <h1>{{ "Login" }}</h1>
      <form class="login-form">
        <input type="email" v-model="email" placeholder="Email"/>
        <input type="password" v-model="password" placeholder="Password"/>
        <button type="button" @click="submit()" :disabled="getDisabled">{{ "Submit" }}</button>
        <div class="addition">
          <a href="/forgot-password" class="external-link1">{{ "Forgot Password" }}</a>
          <a href="/register" class="external-link2">{{ "Register" }}</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      email: null,
      password: null,
      getDisabled: null
    }
  },
  methods: {
    async submit () {
      if (!this.email) {
        window.EventBus.$emit('ERROR', 'Empty email')
        this.getDisabled = true
        this.disable()
        return
      }
      if (!this.password) {
        window.EventBus.$emit('ERROR', 'Empty password')
        this.getDisabled = true
        this.disable()
        return
      }
      if (!this.validEmail(this.email)) {
        window.EventBus.$emit('ERROR', 'Invalid email')
        this.getDisabled = true
        this.disable()
        return
      }
      const result = await this.$auth.logIn({
        email: this.email,
        password: this.password
      })

      if(result) {
        while(!localStorage.getItem('user')) 
        window.EventBus.$emit('SUCCESS', 'Success')
        this.$router.push('/account')
      }
    },
    validEmail (email) {
      var re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
      return re.test(email)
    },
    disable() {
      setTimeout(() => {
        this.getDisabled = window.EventBus.$data.disable
      }, 2500);
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h1 {
  color: #000000;
  margin-bottom: 15px;
}
.login {
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
    cursor: pointer;
  }
  .addition {
    margin-top: 25px;
    font-weight: 500;
    font-size: 12px;
    display: flex;
    .external-link1 {
      color: #979FAF;
    }
    .external-link2 {
      color: #979FAF;
      padding-left: 224px;
    }
  }
</style>
