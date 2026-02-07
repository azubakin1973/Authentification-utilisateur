/**
 * Point d'entrée de l'application NativeScript-Vue
 * 
 * Initialise l'application avec le composant Login comme écran initial.
 * La navigation vers les autres composants (Register, Home, UserProfile)
 * est gérée par la navigation intégrée de NativeScript-Vue.
 */
import Vue from 'nativescript-vue';
import Login from './components/Login.vue';

new Vue({
  render: (h) => h('frame', [h(Login)]),
}).$start();
