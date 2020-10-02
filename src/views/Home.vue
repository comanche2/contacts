<template>
  <div class="contacts">
    <button
        v-show="!addingContact"
        @click="addingContact = true"
    >
      Add Contact
    </button>
    <!--new contact-->
    <div
        v-show="addingContact"
        class="contacts_new-contact"
    >
      <add-field @addField="$set(newContact, $event.key, $event.value)" />
      <template v-for="(item, key) in newContact">
        <div
            v-if="item"
            :key="key"
            class="contacts_new-contact_field"
        >
          {{key}}:{{item}}
          <button @click="onFieldRemove(key)">
            X
          </button>
        </div>
      </template>
      <button
          class="contacts_new-contact_cancel"
          @click="addingContact = false"
      >
        cancel
      </button>
      <button
          :disabled="!Object.keys(newContact).length"
          class="contacts_new-contact_submit"
          @click="addContact()"
      >
        Add contact
      </button>
    </div>

    <!--contacts-->
    <div v-if="contacts.length">
      Contacts:
      <div
          v-for="(contact, index) in contacts"
          :key="index + '_contact'"
      >
        {{ contact }}
      </div>
    </div>
  </div>
</template>

<script>

import AddField from "@/components/AddField";
export default {
  name: 'Home',
  components: {AddField},
  data() {
    return {
      addingContact: false,
      contacts: [],
      newField: {
        key: '',
        value: ''
      },
      newContact: {}
    }
  },
  methods: {
    addContact() {
      if (!Object.keys(this.newContact).length) {
        window.alert('Contact is empty')
      } else {
        this.contacts.push({...this.newContact});
        this.newContact = {}
      }
    },
    onFieldRemove(key) {
      const res = window.confirm(`Are you sure you want to delete field '${key}'?`);
      if (res) this.newContact[key] = undefined
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

    &_new-contact {
      max-width: 90vw;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      padding: 10px;
      border: 1px solid grey;
      border-radius: 5px;

      &_field {
        width: 100%;

        &:first-of-type {
          margin: 10px 0 5px;
        }

        &:last-of-type {
          margin: 5px 0 10px;
        }

        margin: 5px 0;
      }

      &_submit,
      &_cancel {
        margin: 10px 5px;
        width: fit-content;
      }

      .add-field {
        width: 100%;
      }
    }
  }
</style>
