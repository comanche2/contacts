<template>
  <div class="contact">
    <template v-if="!contact">
      Contact not found
    </template>
    <template v-else>
      <form
          class="contact_card"
          @submit.prevent="onSubmit($event)"
      >
        <template v-for="(field, key) in contact">
          <template v-if="key !== 'id'">
            <div :key="key">
              {{ key }}:
            </div>
            <div
                v-show="editingField.key !== key"
                class="contact_card_field-value"
                :key="key + field"
            >
              {{ field }}
            </div>
            <input
                v-show="editingField.key === key"
                v-model="editingField.newVal"
                required
                :placeholder="key"
                :key="'edit_' + key"
            >
            <input
                type="submit"
                :value="editingField.key === key ? 'done' : 'edit'"
                :key="key + '_edit'"
                class="contact_card_edit-btn"
                :class="{'persistent': staticFields.indexOf(key) > -1}"
                @click="editingField.key = key"
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
      <button
          v-show="!addingField"
          @click="addingField = true"
      >
        Add Field
      </button>
      <add-field
          v-show="addingField"
          @addField="onAddField($event)"
      />
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
      addingField: false,
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
    onSubmit(e) {
      console.log(e.value)
    },
    onAddField({key, value}) {
      this.$store.commit('SET_CONTACT_FIELD', {key, value, id: this.contact.id});
      this.addingField = false;
    }
  }
}
</script>

<style lang="scss">
.contact {
  padding: 0 10px;

  &_card {
    border-radius: 5px;
    display: grid;
    grid-template-columns: auto 1fr auto 20px;
    grid-gap: 5px;
    align-items: center;

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