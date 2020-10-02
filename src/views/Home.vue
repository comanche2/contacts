<template>
  <div class="contacts">
    <button
        v-show="!addingContact"
        @click="addingContact = true"
    >
      Add Contact
    </button>
    <!--new contact-->
    <form
        v-if="addingContact"
        class="contacts_new-contact"
        @submit.prevent="addContact($event)"
    >
      <label
          v-for="(item, key) in newContact"
          :for="key"
          :key="key"
          class="contacts_new-contact_field"
      >
        {{ key }}:
        <input
            v-model="newContact[key]"
            :name="key"
            required
        >
      </label>
      <input
          type="submit"
          value="Add Contact"
          :disabled="!Object.keys(newContact).length"
          class="contacts_new-contact_submit"
      >
      <input
          type="button"
          value="cancel"
          class="contacts_new-contact_cancel"
          @click="addingContact = false"
      >
    </form>

    <!--contacts-->
    <div
        v-if="contacts && contacts.length"
        class="contacts_list"
    >
      Contacts:
      <router-link
          v-for="(contact, index) in contacts"
          :key="index + '_contact'"
          :to="{name: 'contact', query: {id: contact.id}}"
          class="contacts_contact"
      >
        <button
            class="round remove-btn"
            :title="`Remove Field contact`"
            @click="onContactRemove(index)"
        >
          +
        </button>

        <template
            v-for="(value, key) in contact"
        >
          <template v-if="key !== 'id'">
            <div :key="'key_' + key + '_in_' + contact">
              {{ key }}:
            </div>
            <div :key="'value_of_' + key + '_in_' + contact">
              {{value}}
            </div>
          </template>
        </template>
      </router-link>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Home',
  data() {
    return {
      addingContact: false,
      newField: {
        key: '',
        value: ''
      },
      newContact: {
        name: '',
        number: '',
        email: ''
      },
      lastId: 0
    }
  },
  computed: {
    contacts: {
      get() {
        return this.$store.state.contacts
      }
    }
  },
  methods: {
    async addContact() {
      this.$store.commit('PUSH_CONTACT', {id: this.lastId, ...this.newContact})
      this.lastId++;
      for (let field in this.newContact) {
        this.newContact[field] = ''
      }
      this.addingContact = false
    },
    onFieldRemove(key, obj) {
      const res = window.confirm(`Are you sure you want to delete field '${key}'?`);
      if (res) this.$delete(obj, key);
      if (this.contacts.some(el => el.id === obj.id)) {
        if (Object.keys(obj).length < 2) {
          const index = this.contacts.findIndex(el => el.id === obj.id);
          this.$delete(this.contacts, index)
        }
      }
    },
    onContactRemove(i) {
      const res = window.confirm(`Are you sure you want to delete ${this.contacts[i].name} contact`);
      if (res) {
       this.$delete(this.contacts, i)
      }
    }
  }
}
</script>

<style lang="scss">
  .contacts {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;

    &_new-contact,
    &_contact {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      padding: 10px;
      border: 1px solid grey;
      border-radius: 5px;
    }

    &_new-contact {
      max-width: 40vw;
      width: 100%;

      &_field {
        width: 100%;
        margin: 5px 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;

        input {
          flex: 1 1 auto;
          margin-left: 10px;
        }

        &:first-of-type {
          margin: 10px 0 5px;
        }

        &:last-of-type {
          margin: 5px 0 10px;
        }

      }

      &_submit,
      &_cancel {
        margin: 10px 5px;
        padding: 2px 5px;
        font-size: 14px;
        text-transform: capitalize;
        width: fit-content;
      }

      .add-field {
        width: 100%;
      }
    }

    &_list {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      align-items: center;
      width: 100%;
    }

    &_contact {
      position: relative;
      display: grid;
      grid-template-columns: auto auto;
      grid-gap: 5px;
      justify-items: start;
      text-decoration: none;
      color: initial;

      button {
        position: absolute;
        right: -10px;
        top: -10px;
      }
    }
  }
</style>
