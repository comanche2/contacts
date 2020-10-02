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
          @submit.prevent="onSubmit($event)"
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
                class="round remove-btn"
                :key="key + '_delete'"
                @click="$store.commit('DELETE_CONTACT_FIELD', {key, id: contact.id})"
            >
              +
            </button>
          </template>
        </template>
      </form>
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
      staticFields: ['name', 'number', 'email']
    }
  },
  computed: {
    contact() {
      return this.$store.state.contacts.find(el => el.id === parseInt(this.$route.query.id))
    }
  },
  methods: {
    onEditField(e, key) {
      if (this.editingField.key) return;
      e.preventDefault();
      this.editingField.key = key;
      this.editingField.oldVal = this.contact[key]
    },
    onSubmit() {
      if (this.editingField.key) {
        if (this.editingField.newVal) {
          this.$store.commit('SET_CONTACT_FIELD', {
            key: this.editingField.key,
            value: this.editingField.newVal,
            id: this.contact.id
          });
        }
        for (let field in this.editingField) {
          this.editingField[field] = ''
        }
      }
    },
    onAddField({key, value}) {
      if (this.contact[key]) return window.alert(`${key} field already exists`);
      this.$store.commit('SET_CONTACT_FIELD', {key, value, id: this.contact.id});
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
    grid-template-columns: auto 1fr auto 20px;
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
        grid-column-start: 3;
        grid-column-end: 5;
      }
    }
  }

  .add-field {
    margin-top: 10px;
    grid-column-start: 1;
    grid-column-end: 5;
  }
}
</style>