import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    isLoggedin: true,
    user: {
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png',
      firstName: 'Billy',
      lastName: 'Boop',
      phone: '123-456-7891',
      email: 'billyboop@test.com',
      dateJoined: '01/15/2018',
      website: 'blog.billyboop.com',
      memberCode: '3',
      memberType: 'Gold',
      points: '2500',
      periodMonth: '6',
      recurring: '1'
    },
    rooms: [
      'Green Room',
      'Da Vinci Room',
      'Zen Room',
      'Epic Room',
      'Sun Room',
      'Studio'
    ],
    demoEvents: [{
      date: '2018/05/03',
      title: 'Green Room',
      desc: '8am - 3pm',
      customClass: 'disabled highlight'
    }, {
      date: '2018/05/02',
      title: 'Epic Room',
      desc: '8am-5pm'
    }, {
      date: '2018/05/04',
      title: 'Green Room',
      desc: '8am - 3pm',
      customClass: 'disabled highlight'
    }, {
      date: '2018/05/02',
      title: 'Epic Room',
      desc: '8am-5pm'
    }, {
      date: '2018/05/05',
      title: 'Green Room',
      desc: '8am - 3pm',
      customClass: 'disabled highlight'
    }, {
      date: '2018/05/03',
      title: 'Epic Room',
      desc: '8am-5pm'
    }, {
      date: '2018/05/06',
      title: 'Green Room',
      desc: '8am - 3pm',
      customClass: 'disabled highlight'
    }, {
      date: '2018/05/04',
      title: 'Epic Room',
      desc: '8am-5pm'
    }, {
      date: '2018/05/09',
      title: 'Green Room',
      desc: '8am - 3pm',
      customClass: 'disabled highlight'
    }, {
      date: '2018/05/05',
      title: 'Epic Room',
      desc: '8am-5pm'
    }, {
      date: '2018/05/10',
      title: 'Green Room',
      desc: '8am - 3pm',
      customClass: 'disabled highlight'
    }, {
      date: '2018/05/07',
      title: 'Epic Room',
      desc: '8am-5pm'
    }, {
      date: '2018/05/15',
      title: 'Green Room',
      desc: '8am - 3pm',
      customClass: 'disabled highlight'
    }, {
      date: '2018/05/08',
      title: 'Epic Room',
      desc: '8am-5pm'
    }, {
      date: '2018/04/30',
      title: 'Green Room',
      desc: '8am - 3pm',
      customClass: 'disabled highlight'
    }, {
      date: '2018/05/09',
      title: 'Epic Room',
      desc: '8am-5pm'
    }, {
      date: '2018/04/30',
      title: 'Green Room',
      desc: '8am - 3pm',
      customClass: 'disabled highlight'
    }, {
      date: '2018/05/01',
      title: 'Epic Room',
      desc: '8am-5pm'
      }],
    demoEvents1: [{
        date: '2018/08/20',
        title: 'Epic Room',
        desc: '8am-5pm'
    }]

  },
  mutations: {
    addEvent (state, event) {
      this.state.demoEvents.push(event)
    },
    profileSubmit (state, data) {
      if (data.firstName !== '') {
        this.state.user.firstName = data.firstName
      }
      if (data.lastName !== '') {
        this.state.user.lastName = data.lastName
      }

      if (data.phoneNumber !== '') {
        this.state.user.phone = data.phoneNumber
      }
      if (data.email !== '') {
        this.state.user.email = data.email
      }
      if (data.website !== '') {
        this.state.user.website = data.website
      }
      if (data.pictureLink !== '') {
        this.state.user.avatar = data.pictureLink
      }
    }
  }
})
