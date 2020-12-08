<template>
  <div>
    <home :activeInfo="true"/>
    <div class="info">
      <div class="form">
        <h1>{{ "Information" }}</h1>
        <form class="info-form">
          <input type="text" v-model="name" placeholder="Name"/>
          <input type="text" v-model="identity" placeholder="Student ID"/>
          <input type="email" v-model="email" placeholder="Email"/>
          <input type="text" v-model="type" placeholder="Diploma Type"/>
          <button type="button" @click="submit()" :disable="getDisabled">{{ "Submit" }}</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Home from '@/components/roots/Home.vue'
import ServerRequest from '@/requests/ServerRequest'

export default {
  components: {
    Home
  },
  data() {
    return {
      name: null,
      identity: null,
      email: null,
      type: null,
      getDisabled: false,
    }
  },
  methods: {
    async submit() {
      if (!this.name) {
        window.EventBus.$emit('ERROR', 'Empty name')
        this.getDisabled = true
        this.disable()
        return
      }
      if (!this.identity) {
        window.EventBus.$emit('ERROR', 'Empty Student ID')
        this.getDisabled = true
        this.disable()
        return
      }
      if (!this.email) {
        window.EventBus.$emit('ERROR', 'Empty email')
        this.getDisabled = true
        this.disable()
        return
      }
      if (!this.type) {
        window.EventBus.$emit('ERROR', 'Empty Diploma Type')
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

      const result = await ServerRequest.generateCertificate({
        name: this.name,
        identity: this.identity,
        email: this.email,
        type: this.type
      })

      if(result) {
        window.EventBus.$emit('SUCCESS', 'Success')
        this.refresh()
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
    },
    refresh() {
      this.name = null
      this.identity = null
      this.email = null
      this.type = null
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
    margin: 95px auto auto auto;
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
    margin-left: 0px;
  }
  li {
    background-color: #000000;
  }
  li.background {
    background-color: #000000;
  }
</style>
