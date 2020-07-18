<template>
  <div class="home">
    <div class="item">
      <ul>
        <li>
          <img src="@/assets/icon.png" class="icon">
        </li>
        <li><a class="active" href="/account">{{ "Account" }}</a></li>
        <li><a href="#news">{{ "Certificate" }}</a></li>
        <li><a href="#contact">{{ "Transaction" }}</a></li>
        <li><a href="#about">{{ "Authentication" }}</a></li>
        <li><a @click="submit()">{{ "Log out" }}</a></li>
      </ul>
    </div>
  </div>
</template>

<script>

export default {
  methods: {
    async submit() {
      const result = await this.$auth.logOut()
      if(result) {
        this.$router.push('/')
      }
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.item {
  font-family: Arial, Helvetica, sans-serif;
  position: fixed;
  top: 0%;
  left: 0%;
  width: 100%;
  ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #051926;
  }
  li {
    float: left;
    .active {
      margin-left: 15px;
    }
    &:hover, &:active, &:focus {
      background-color: #000000;
    }
  }
  li a {
    display: block;
    color: white;
    text-align: center;
    padding: 20px 25px;
    text-decoration: none;
    font-size: 16px;
    font-weight: 700;
  }
}

.icon {
  width: 40px;
  height: 40px;
  padding-top: 8px;
  padding-left: 20px;
}
</style>
