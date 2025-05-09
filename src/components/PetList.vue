<script lang="ts" setup>
import { ref } from 'vue'
import type { Pet } from './PetsType.d.ts'
import YourPets from './YourPets.vue'
const pets = ref<Pet[]>([
  {
    id: 1,
    name: 'Fluffy',
    ownerName: 'Frank',
    age: 3,
    favoriteFood: 'Fish',
    isFed: false,
  },
  {
    id: 2,
    name: 'Buddy',
    ownerName: 'Fred',
    age: 5,
    favoriteFood: 'Beef',
    isFed: true,
  },
])
function toggleFed(id: number) {
  const pet = pets.value.find((pet) => pet.id === id)
  if (pet) {
    pet.isFed = !pet.isFed
  }
}
function removePet(id: number) {
  const index = pets.value.findIndex((pet) => pet.id === id)
  if (index !== -1) {
    pets.value.splice(index, 1)
  }
}
</script>

<template>
  <div class="pet-list">
    <h1>Pet List</h1>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Owner</th>
          <th>Age</th>
          <th>Favorite Food</th>
          <th>Fed</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pet in pets" :key="pet.id" class="pet-row">
          <td>{{ pet.name }}</td>
          <td>{{ pet.ownerName }}</td>
          <td>{{ pet.age }}</td>
          <td>{{ pet.favoriteFood }}</td>
          <td>
            <button @click="toggleFed(pet.id)">
              {{ pet.isFed ? 'Fed' : 'Hungry' }}
            </button>
            <button @click="removePet(pet.id)">Remove</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.pet-list {
  padding: 1rem;
  background-color: #420bba;
  border-radius: 8px;
}
.pet-row {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  gap: 1rem;
}
.pet-row button {
  background-color: #5a0507;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px; /* Adds vertical space between rows */
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

th,
td {
  border: 1px solid #ccc;
  padding: 12px 16px;
  text-align: left;
}

th {
  background-color: #e0e0ff;
}

tr.pet-row {
  background-color: #f9f9ff;
}

tr.pet-row:hover {
  background-color: #e6e6fa;
}
</style>
