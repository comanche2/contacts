<template>
  <div class="add-field">
    <button
        v-show="!addingField"
        class="add-field_btn"
        @click="addingField = true"
    >
      Add Field
    </button>
    <form
        v-show="addingField"
        class="add-field_form"
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
      <button class="round">
        +
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: "AddField",
  data() {
    return {
      addingField: false,
      newField: {
        key: '',
        value: ''
      }
    }
  },
  methods: {
    addField() {
      this.$emit('addField', {key: this.newField.key.trim(), value:this.newField.value});
      this.addingField = false;
      this.newField.key = '';
      this.newField.value = ''
    },
  }
}
</script>

<style scoped lang="scss">
.add-field {
  &_form {
    display: grid;
    grid-template-columns: 1fr 1fr 20px;
    grid-gap: 5px;

    label {
      display: inline-flex;
      justify-content: space-around;

      input {
        margin-left: 5px;
        flex: 1 0 auto;
      }
    }
  }
}
</style>