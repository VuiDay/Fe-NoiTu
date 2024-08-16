// stores/counter.js
import { defineStore } from "pinia";

export const useDrinkStore = defineStore("Drink", {
  state: () => ({
    idRoom: "",
    name: "",
    websocket: null,
    hostname: "123",
    inforRoom: {},
  }),
  actions: {
    async connectSocket(name) {
      this.websocket = new WebSocket(
        `wss://noitu.hoptv.workers.dev/websocket/game?id=${name}`
      );
    },
    async saveInfoRoom(data) {
      this.inforRoom = data;
    },
  },
});
