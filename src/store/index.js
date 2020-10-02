import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    contacts: []
  },
  mutations: {
    SET_CONTACTS(state, data) {
      state.contacts = data
    },
    PUSH_CONTACT(state, data) {
      state.contacts.push(data)
    },
    SET_CONTACT_FIELD(state, {key, value, id}) {
      const i = state.contacts.findIndex(el => el.id === id);
      Vue.set(state.contacts[i], key, value)
    },
    DELETE_CONTACT_FIELD(state, {key, id}) {
      const i = state.contacts.findIndex(el => el.id === id);
      Vue.delete(state.contacts[i], key)
    }
  },
  actions: {
    loadContacts({commit}) {
      const contacts = localStorage.getItem('contacts');
      if (contacts) commit('SET_CONTACTS', JSON.parse(contacts))
    },
  }
})
