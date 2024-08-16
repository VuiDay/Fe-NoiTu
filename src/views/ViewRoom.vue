<template>
  <div>Room {{ route.params.id }}</div>
  <div v-for="(u, i) of inforRoom.players">
    <div class="flex items-center">
      <p class="mr-[10px]" v-if="u.role === 'owner'">Owner</p>
      {{ u.name }}
    </div>
  </div>
  <!-- <p v-for="(u, i) of inforRoom.player">{{ u }}</p> -->
  <div v-if="btnStart" v-for="(u, i) of inforRoom.players">
    <button v-if="u.role === 'owner' && u.idu === query.idu" @click="startGame">
      Start
    </button>
  </div>
  <v-dialog v-model="dialog" width="auto" persistent>
    <v-card
      max-width="400"
      prepend-icon="mdi-update"
      title="Nối từ"
      class="py-[10px] px-[20px]"
    >
      <template v-slot:actions>
        <div class="flex flex-col">
          <div>
            <p
              class="capitalize w-[100%] text-center text-[30px] font-semibold mb-[10px]"
            >
              {{ word }}
            </p>
            <div class="flex justify-center">
              <p class="bg-[#ccc] py-[5px] px-[10px] capitalize">
                {{ firstWord }}
              </p>
              <input
                type="text"
                class="!border-[1px] !border-[#ccc] outline-none border-solid rounded-none py-[5px] px-[10px] capitalize"
                v-model="secondtWord"
                @keyup.enter="sendWord"
              />
            </div>
          </div>
          <!-- <v-btn class="ms-auto" text="Ok" @click="dialog = false"></v-btn> -->
        </div>
      </template>
    </v-card>
  </v-dialog>
  <v-dialog v-model="rankings">
    <v-table>
      <thead>
        <tr>
          <th class="text-left">Tên</th>
          <th class="text-left">Điểm</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data, i) in userarray" :key="i">
          <td>{{ data.name }}</td>
          <td>{{ data.score }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-dialog>
</template>

<script setup>
import { onMounted, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { useDrinkStore } from "@/stores/useStore";
import toast from "../utils/toast";

const route = useRoute();
const store = useDrinkStore();
const inforRoom = ref("");
const query = route.query;
const id = route.params.id;
const word = ref("");
const dialog = ref(false);
const firstWord = ref("");
const secondtWord = ref("");
const btnStart = ref(true);
const rankings = ref(false);
const userarray = ref([]);

let websocket;

async function startGame() {
  const url = `https://noitu.hoptv.workers.dev/api/game/start?id=${id}`;
  try {
    const response = await fetch(url, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const data = await response.json();
    console.log("Game started:", data);
    return data;
  } catch (error) {
    console.error("Failed to start game:", error);
    throw error;
  }
}

const sendWord = () => {
  // if (secondtWord.value.split(" ").length > 1) {
  //   return toast.toastFailed("Yêu cầu nhập 1 từ!");
  // }
  websocket.send(
    JSON.stringify({
      action: "play",
      idu: query.idu,
      word: `${firstWord.value} ${secondtWord.value}`,
    })
  );
  secondtWord.value = "";
  dialog.value = false;
};

onMounted(() => {
  store.connectSocket(id);
  websocket = store.websocket;
  websocket.onopen = () => {
    console.log("WebSocket connection opened.");
    if (websocket) {
      websocket.send(
        JSON.stringify({
          name: query.name,
          idu: query.idu,
          role: query.role,
          action: query.action,
        })
      );
    }
  };

  websocket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    console.log(data);
    if (data.action === "playgame") {
      if (query.idu === data.id) {
        word.value = data.word;
        firstWord.value = word.value.split(" ")[1];
        dialog.value = true;
      }
    }
    if (data.action === "failedgame") {
      toast.toastFailed("Hết game!");
      userarray.value = data.table?.sort((a, b) => b.score - a.score);
      btnStart.value = !btnStart.value;
      if (userarray.value) {
        rankings.value = !rankings.value;
      }
    }
    if (data.action === "connectRoom") {
      inforRoom.value = data.room;
    }
    if (data.action === "startgame") {
      if (query.idu === data.id) {
        word.value = data.word;
        firstWord.value = word.value.split(" ")[1];
        dialog.value = true;
        btnStart.value = !btnStart.value;
      }
    }
  });
});

watchEffect(() => {});
</script>

<style scoped></style>
