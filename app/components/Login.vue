/**
 * Composant de connexion pour l'application
 * 
 * Ce composant gère l'authentification des utilisateurs avec les fonctionnalités suivantes :
 * - Saisie des identifiants (email et mot de passe)
 * - Validation des credentials via le service d'authentification
 * - Gestion des sessions utilisateur
 * - Redirection vers la page d'accueil après connexion réussie
 */
<template>
  <Page>
    <ActionBar title="Connexion" />
    <StackLayout padding="20">
      <!-- Champs de saisie avec liaison de données (v-model) pour email et mot de passe -->
      <TextField v-model="email" hint="Courriel" keyboardType="email" autocorrect="false" :isEnabled="!loading" />
      <TextField v-model="password" hint="Mot de passe" secure="true" :isEnabled="!loading" />
      
      <!-- Bouton de connexion avec indicateur de chargement -->
      <Button :text="loading ? 'Connexion en cours...' : 'Connexion'" @tap="login" :isEnabled="!loading" backgroundColor="#2196F3" color="white" />
      
      <!-- Indicateur de chargement -->
      <ActivityIndicator v-if="loading" :busy="loading" class="activity-indicator" />
      
      <!-- Affichage conditionnel des erreurs de connexion -->
      <Label v-if="error" :text="error" class="error" color="red" textAlignment="center" textWrap="true" />
      
      <!-- Bouton de navigation vers l'inscription -->
      <Button text="S'inscrire" @tap="register" :isEnabled="!loading" />
    </StackLayout>
  </Page>
</template>

<script>
import authService from "../services/authService";
import Register from "./Register.vue";
import Home from "./Home.vue";

export default {
  /**
   * État initial du composant
   * @returns {Object} État réactif pour la gestion de la connexion
   */
  data() {
    return {
      email: "",        // Stockage de l'email saisi
      password: "",     // Stockage du mot de passe saisi
      error: null,      // Gestion des messages d'erreur
      loading: false,   // Indicateur de chargement pendant l'authentification
    };
  },
  methods: {
    /**
     * Méthode de navigation vers le composant d'inscription
     * Utilise la navigation intégrée de NativeScript-Vue
     */
    async register() {
      this.$navigateTo(Register);
    },

    /**
     * Méthode de connexion avec gestion complète de l'authentification
     * 
     * Étapes principales :
     * 1. Envoi des credentials au service d'authentification
     * 2. Validation de la réponse
     * 3. Redirection vers la page d'accueil
     */
    async login() {
      try {
        // Activation de l'indicateur de chargement
        this.loading = true;
        this.error = null;

        // Connexion via le service d'authentification
        await authService.login(this.email, this.password);
          
        // Navigation vers la page d'accueil après connexion réussie
        this.$navigateTo(Home);
      } catch (error) {
        // Gestion des erreurs de connexion
        this.error = "Identifiants de connexion invalides";
      } finally {
        // Désactivation de l'indicateur de chargement
        this.loading = false;
      }
    },
  },
  
  /**
   * Hook de montage : vérifie si une session existe déjà
   * Redirection automatique si un token valide est présent
   */
  mounted() {
    if (authService.isAuthenticated()) {
      this.$navigateTo(Home);
    }
  },
};
</script>

<style scoped>
/* Styles spécifiques au composant de connexion */
TextField {
  margin: 10;
  padding: 10;
}
Button {
  margin: 10;
  padding: 10;
}
.error {
  margin: 10;
}
.activity-indicator {
  margin: 10;
}
</style>
