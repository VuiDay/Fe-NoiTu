<template>
  <div class="h-[100vh] flex items-start justify-center">
    <div class="mt-[100px]">
      <div class="flex flex-col gap-5">
        <input
          placeholder="Tên người chơi"
          type="text"
          class="border-[1px] border-[#ccc] py-[3px] px-[7px]"
          v-model="name"
        />
        <input
          placeholder="Room id"
          type="text"
          class="border-[1px] border-[#ccc] py-[3px] px-[7px]"
          v-model="idRoom"
        />
      </div>

      <div class="flex flex-col justify-center items-center mt-[20px]">
        <!-- <button
          class="bg-[#ccc] py-[5px] px-[10px] mb-[30px]"
          @click="singlePlay"
        >
          Chơi một mình
        </button> -->
        <button
          class="bg-[#ccc] py-[5px] px-[10px] mb-[30px]"
          @click="joinRoom"
        >
          Vào phòng có sẵn
        </button>
        <p>or</p>
        <button
          class="bg-[#ccc] py-[5px] px-[10px] mt-[30px]"
          @click="createRoom"
        >
          Tạo phòng
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useDrinkStore } from "@/stores/useStore";

const store = useDrinkStore();
let websocket;

const name = ref("");
const idRoom = ref("");
const dataRoom = ref("");

const status = ref(false);

const router = useRouter();
const uid = Math.floor(1000 + Math.random() * 9000).toString();

function generateRandomCode() {
  // Tạo mã ngẫu nhiên 6 chữ số
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Sử dụng hàm để tạo mã ngẫu nhiên
const randomCode = generateRandomCode();
console.log(randomCode); // Ví dụ: 482763

const joinRoom = () => {
  router.push({
    path: `/room/${idRoom.value}`,
    query: {
      name: name.value,
      idu: generateRandomCode(),
      action: "joinroom",
    },
  });
};

const singlePlay = () => {
  router.push({
    path: `/room/${uid}`,
    query: {
      name: name.value,
      idu: generateRandomCode(),
      action: "joinroom",
    },
  });
};

const createRoom = () => {
  router.push({
    path: `/room/${uid}`,
    query: {
      name: name.value,
      idu: generateRandomCode(),
      action: "joinroom",
      role: "owner",
    },
  });
};

onMounted(async () => {
  // websocket = store.websocket;
  // websocket.onopen = () => {
  //   console.log("WebSocket connection opened.");
  // };
  // websocket.onmessage = (event) => {
  //   const data = JSON.parse(event.data);
  //   data.room?.forEach((room) => {
  //     if (data.action === "createRoom" && room.id === uid) {
  //       dataRoom.value = room;
  //       store.saveInfoRoom(dataRoom.value);
  //       if (dataRoom.value) {
  //         router.push(`/room/${dataRoom.value.id}`);
  //       }
  //     }
  //     if (data.action === "joinroom" && room.id === idRoom.value) {
  //       dataRoom.value = room;
  //       console.log(true);
  //       store.saveInfoRoom(dataRoom.value);
  //       if (dataRoom.value) {
  //         router.push(`/room/${dataRoom.value.id}`);
  //       }
  //     }
  //   });
  //   if (data.error) {
  //     alert(`Error: ${data.error}`);
  //   }
  // };
  // websocket.onclose = () => {
  //   console.log("WebSocket connection closed.");
  // };
  // websocket.onerror = (error) => {
  //   console.log("WebSocket error:", error);
  // };
});

watchEffect(() => {
  websocket = store.websocket;
});
</script>

<style scoped>
input {
  outline: none;
}
input:focus {
  outline: 1px solid red;
}
</style>
