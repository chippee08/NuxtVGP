<template>
  <v-app-bar color="black" dark>
    <v-toolbar-title>
        <v-icon icon="mdi-rocket" class="mr-2" />
        SpaceX
    </v-toolbar-title>
    <v-spacer />
    <v-btn to="/" text>Home</v-btn>
    <v-btn to="/spaceXLaunches" text>Launches</v-btn>
    <v-btn to="/rocketsDetails" text>Rockets</v-btn>
  </v-app-bar>
</template>