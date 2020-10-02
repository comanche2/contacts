<template>
  <form
      class="add-field"
      @submit.prevent="addField"
  >
    <label>
      Field Name:
      <input
          v-model="newField.key"
          required
          pattern="[a-zA-Z0-9]+"
          placeholder="field name"
          type="text"
      >
    </label>
    <label>
      Field Value:
      <input
          v-model="newField.value"
          required
          placeholder="field value"
          type="text"
      >
    </label>
    <button>
      +
    </button>
  </form>
</template>

<script>
export default {
  name: "AddField",
  data() {
    return {
      newField: {
        key: '',
        value: ''
      }
    }
  },
  methods: {
    addField() {
      this.$emit('addField', {key: this.newField.key.trim(), value:this.newField.value})
      this.newField.key = '';
      this.newField.value = ''
    },
  }
}
</script>

<style scoped lang="scss">
.add-field {
  display: grid;
  grid-template-columns: 1fr 1fr .2fr;
  grid-gap: 5px;

  label {
    display: inline-flex;
    justify-content: space-around;
    input {
      margin-left: 5px;
      flex: 1 0 auto;
    }
  }

  button {
    display: inline-flex;
    justify-content: center;
  }
}
</style>