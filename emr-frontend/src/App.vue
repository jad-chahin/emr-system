<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'

const route = useRoute()

// Show the public navbar only on public routes
const showNavbar = computed(() => route.meta?.layout !== 'suite' && route.meta?.hideNavbar !== true)
</script>

<template>
  <Navbar v-if="showNavbar" />
  <RouterView />
</template>
