<template>
  <div class="contact">
    <router-link to="/">
      Explore contacts
    </router-link>
    <template v-if="!contact">
      Contact not found
    </template>
    <template v-else>
      <form
          class="contact_card"
          @submit.prevent="onSubmit()"
      >
        <template v-for="(value, key) in contact">
          <template v-if="key !== 'id'">
            <div
                :key="key"
                class="contact_card_field-key"
            >
              {{ key }}:
            </div>
            <div
                v-show="editingField.key !== key"
                class="contact_card_field-value"
                :key="key + '_value_' + value"
            >
              {{ value }}
            </div>
            <input
                v-show="editingField.key === key"
                v-model="editingField.newVal"
                :placeholder="editingField.oldVal"
                :key="'edit-input_' + key"
            >
            <button
                :key="key + '_undo'"
                :disabled="editingField.key !== key"
                @click.prevent="undoField(key)"
            >
              undo
            </button>
            <input
                type="submit"
                :value="editingField.key === key ? 'done' : 'edit'"
                :key="key + '_edit-submit'"
                class="contact_card_edit-btn"
                :class="{'persistent': staticFields.indexOf(key) > -1}"
                @click="onEditField($event, key)"
            >
            <button
                v-if="staticFields.indexOf(key) === -1"
                :title="'Delete field ' + key"
                class="round remove-btn"
                :key="key + '_delete'"
                @click="onDeleteField(key)"
            >
              +
            </button>
          </template>
        </template>
      </form>
      <button
          :disabled="!actions.length"
          @click="onStepBack()"
      >
        Step back
      </button>
      <add-field @addField="onAddField($event)"/>
    </template>
  </div>
</template>

<script>
import AddField from "@/components/AddField";
export default {
  name: 'Contact',
  components: {AddField},
  data() {
    return {
      editingField: {
        key: '',
        newVal: '',
        oldVal: ''
      },
      actions: [],
      staticFields: ['name', 'number', 'email']
    }
  },
  computed: {
    contact() {
      return this.$store.state.contacts.find(el => el.id === +this.$route.query.id)
    }
  },
  methods: {
    async onEditField(e, key) {
      await e.preventDefault();
      if (key !== this.editingField.key) {
        const res = await this.undoField(this.editingField.key);
        if (res) {
          this.editingField.key = key;
          this.editingField.oldVal = this.contact[key]
        }
      } else {
        this.onSubmit()
      }
    },
    onSubmit(value) {
      if (this.editingField.key) {
        if (value || this.editingField.newVal) {
          this.$store.commit('SET_CONTACT_FIELD', {
            key: this.editingField.key,
            value: value || this.editingField.newVal,
            id: this.contact.id
          });
        }
        if (!value
            && this.editingField.newVal
            && this.editingField.oldVal !== this.editingField.newVal) this.actions.push({
          type: 'edit',
          field: this.editingField.key,
          value: this.editingField.oldVal
        });
        for (let field in this.editingField) {
          this.editingField[field] = ''
        }
      }
    },
    onAddField({key, value}) {
      if (this.contact[key]) return window.alert(`${key} field already exists.`);
      this.$store.commit('SET_CONTACT_FIELD', {key, value, id: this.contact.id});
      this.actions.push({
        type: 'add',
        field: key
      })
    },
    async undoField(key) {
      if (!key || !this.editingField.newVal) return true;
      const res = await window.confirm(`Are you sure you want undo changes to field ${key}?`);
      if (res) this.onSubmit(this.editingField.oldVal)
      return res
    },
    onDeleteField(key) {
      this.actions.push({
        type: 'delete',
        field: key,
        value: this.contact[key]
      });
      this.$store.commit('DELETE_CONTACT_FIELD', {key, id: this.contact.id})
    },
    onStepBack() {
      const action = this.actions.pop();
      console.log(action)
      switch (action.type) {
        case 'add':
          this.$store.commit('DELETE_CONTACT_FIELD', {
            key: action.field,
            id: this.contact.id
          });
          break;
        case 'delete':
        case 'edit':
          this.$store.commit('SET_CONTACT_FIELD', {
            key: action.field,
            value: action.value,
            id: this.contact.id
          });
          break;
      }
    }
  }
}
</script>

<style lang="scss">
.contact {
  padding: 0 10px;

  &_card {
    border: 1px solid black;
    padding: 10px;
    border-radius: 5px;
    display: grid;
    grid-template-columns: auto 1fr auto auto 20px;
    grid-gap: 5px;
    align-items: center;

    &_field-key {
      justify-self: end;
    }

    &_field-value {
      justify-self: start;
    }

    &_edit-btn {
      &.persistent {
        grid-column-start: 4;
        grid-column-end: 6;
      }
    }
  }

  & > button, .add-field {
    margin-top: 10px;
    grid-column-start: 1;
    grid-column-end: 6;
  }
}
</style>