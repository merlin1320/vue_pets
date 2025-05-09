<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { Pet } from './PetsType.d.ts'
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
const showAddModal = ref(false)
const newPet = ref<Pet>({
  id: 0,
  name: '',
  ownerName: '',
  age: 0,
  favoriteFood: '',
  isFed: false,
})

function openAddModal() {
  newPet.value = {
    id: Date.now(),
    name: '',
    ownerName: '',
    age: 0,
    favoriteFood: '',
    isFed: false,
  }
  showAddModal.value = true
}
function closeAddModal() {
  showAddModal.value = false
}
function addPet() {
  if (
    newPet.value.name &&
    newPet.value.ownerName &&
    newPet.value.favoriteFood &&
    newPet.value.age > 0
  ) {
    pets.value.push({ ...newPet.value })
    closeAddModal()
  }
}

const ownerFilter = ref('All')
const fedFilter = ref('All')

const uniqueOwners = computed(() => Array.from(new Set(pets.value.map((p) => p.ownerName))))

const filteredPets = computed(() => {
  return pets.value.filter((pet) => {
    const ownerMatch = ownerFilter.value === 'All' || pet.ownerName === ownerFilter.value
    const fedMatch =
      fedFilter.value === 'All' ||
      (fedFilter.value === 'Fed' && pet.isFed) ||
      (fedFilter.value === 'Hungry' && !pet.isFed)
    return ownerMatch && fedMatch
  })
})

function downloadPets() {
  const dataStr =
    'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(pets.value, null, 2))
  const downloadAnchorNode = document.createElement('a')
  downloadAnchorNode.setAttribute('href', dataStr)
  downloadAnchorNode.setAttribute('download', 'pets-list.json')
  document.body.appendChild(downloadAnchorNode)
  downloadAnchorNode.click()
  downloadAnchorNode.remove()
}
</script>

<template>
  <div class="pet-list">
    <div class="header-row">
      <h1>Pet List</h1>
      <button class="add-pet" @click="openAddModal">Add Pet</button>
      <div class="header-actions">
        <div class="filters" style="margin-bottom: 1rem">
          <label>
            Owner:
            <select v-model="ownerFilter">
              <option value="All">All</option>
              <option v-for="owner in uniqueOwners" :key="owner" :value="owner">{{ owner }}</option>
            </select>
          </label>
          <label style="margin-left: 0.5rem">
            Fed Status:
            <select v-model="fedFilter">
              <option value="All">All</option>
              <option value="Fed">Fed</option>
              <option value="Hungry">Hungry</option>
            </select>
          </label>
        </div>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Owner</th>
          <th>Age</th>
          <th>Favorite Food</th>
          <th>Fed</th>
          <th>Remove Pet</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pet in filteredPets" :key="pet.id" class="pet-row">
          <td>{{ pet.name }}</td>
          <td>{{ pet.ownerName }}</td>
          <td>{{ pet.age }}</td>
          <td>{{ pet.favoriteFood }}</td>
          <td>
            <input
              type="checkbox"
              :checked="pet.isFed"
              @change="toggleFed(pet.id)"
              :aria-label="pet.isFed ? 'Fed' : 'Hungry'"
            />
            <span>{{ pet.isFed ? 'Fed' : 'Hungry' }}</span>
          </td>
          <td>
            <button @click="removePet(pet.id)">Remove</button>
          </td>
        </tr>
      </tbody>
    </table>
    <button class="download-btn" @click="downloadPets">Download Pets as JSON</button>

    <div v-if="showAddModal" class="modal-overlay" @click.self="closeAddModal">
      <div class="modal-content">
        <h2>Add New Pet</h2>
        <form @submit.prevent="addPet">
          <label>
            Name:
            <input v-model="newPet.name" required />
          </label>
          <label>
            Owner:
            <input v-model="newPet.ownerName" required />
          </label>
          <label>
            Age:
            <input type="number" v-model.number="newPet.age" min="1" required />
          </label>
          <label>
            Favorite Food:
            <input v-model="newPet.favoriteFood" required />
          </label>
          <label>
            Fed:
            <input type="checkbox" v-model="newPet.isFed" />
          </label>
          <div class="modal-actions">
            <button type="submit">Add</button>
            <button type="button" @click="closeAddModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pet-list {
  padding: 1rem;
  background-color: #420bba;
  border-radius: 8px;
  max-width: 900px;
  margin: 2rem auto; /* Center the pet list on the page */
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
  background: rgb(2, 182, 2);
  border-radius: 8px;
  overflow: hidden;
}

th,
td {
  border: 1px solid #4f0202;
  padding: 12px 16px;
  text-align: left;
}

th {
  background-color: #0f8dd6;
}

tr.pet-row {
  background-color: #0f8dd6;
}

tr.pet-row:hover {
  background-color: #0f8dd6;
}
td input[type='checkbox'] + span {
  margin-left: 8px;
}
.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.add-pet {
  background-color: #0f8dd6;
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 4px;
  margin-left: 0.5rem;
}
.filters label {
  margin-left: 0.5rem;
  color: #222;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  min-width: 300px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
}
.download-btn {
  background-color: #0f8dd6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}
</style>
