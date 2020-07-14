<template>
  <div>
    <home/>
    <div class="account">
      <button type="button" v-on:click="getKey()">{{ "Generate Key" }}</button>
      <button type="button">{{ "Download" }}</button>
    </div>
  </div>
</template>

<script>
  import Home from '@/components/roots/Home.vue'
  import BlockchainRequest from '@/requests/BlockchainRequest'

  export default {
    components: {
      Home
    },
    data() {
      return {
        
      }
    },
    methods: {
      async getKey() {
        console.log('------------')
        const validKey = await BlockchainRequest.generateKey()
        console.log("generateKey -> validKey", validKey)
      }
    }
  }
</script>

<style scoped>
  button {
    background: #000000;
    width: 100%;
    border: 0;
    padding: 15px;
    color: #FFFFFF;
    font-size: 17px;
    border-radius: 3px;
    width: 155px;
    margin-left: 15px;
  }
  .account {
    margin-top: 150px;
    text-align: center;
  }
</style>