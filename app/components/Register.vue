/**
 * Composant d'inscription pour l'application
 * 
 * Fonctionnalités principales :
 * - Formulaire d'inscription avec validation côté client
 * - Vérification des données utilisateur
 * - Communication avec le service d'authentification pour créer un nouveau compte
 * - Gestion des erreurs d'inscription
 */
<template>
  <Page>
    <ActionBar title="Inscription" />
    <StackLayout padding="20">
      <!-- Champs de saisie avec validation et liaison de données -->
      <TextField v-model="username" hint="Nom d'utilisateur" autocorrect="false" :isEnabled="!loading" />
      <TextField v-model="email" hint="Courriel" keyboardType="email" autocorrect="false" :isEnabled="!loading" />
      <TextField v-model="password" hint="Mot de passe" secure="true" :isEnabled="!loading" />
      <TextField v-model="confirmPassword" hint="Confirmer le mot de passe" secure="true" :isEnabled="!loading" />
      
      <!-- Bouton d'inscription avec indicateur de chargement -->
      <Button :text="loading ? 'Inscription en cours...' : 'S\'inscrire'" @tap="register" :isEnabled="!loading" backgroundColor="#2196F3" color="white" />
      
      <!-- Indicateur de chargement -->
      <ActivityIndicator v-if="loading" :busy="loading" class="activity-indicator" />
      
      <!-- Bouton de retour à la page de connexion -->
      <Button text="Retour à la connexion" @tap="goToLogin" :isEnabled="!loading" />
      
      <!-- Affichage conditionnel des messages d'erreur -->
      <Label v-if="error" :text="error" class="error" color="red" textAlignment="center" textWrap="true" />
    </StackLayout>
  </Page>
</template>

<script>
import authService from "../services/authService";
import Login from "./Login.vue";

export default {
  /**
   * État initial du composant
   * @returns {Object} État réactif pour le formulaire d'inscription
   */
  data() {
    return {
      username: "",        // Nom d'utilisateur saisi
      email: "",           // Email saisi
      password: "",        // Mot de passe saisi
      confirmPassword: "", // Confirmation du mot de passe
      error: null,         // Message d'erreur de validation
      loading: false,      // Indicateur de chargement pendant l'inscription
    };
  },
  methods: {
    /**
     * Navigation vers la page de connexion
     * Utilise la navigation intégrée de NativeScript-Vue
     */
    goToLogin() {
      this.$navigateTo(Login);
    },
    
    /**
     * Validation complète du formulaire d'inscription
     * 
     * Vérifie :
     * - Présence et format du nom d'utilisateur
     * - Présence et format de l'email
     * - Longueur et correspondance des mots de passe
     * 
     * @returns {boolean} Validité du formulaire
     */
    validateForm() {
      // Validation du nom d'utilisateur
      if (!this.username.trim()) {
        this.error = "Le nom d'utilisateur est requis";
        return false;
      }
      
      // Validation du format du nom d'utilisateur
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!usernameRegex.test(this.username)) {
        this.error = "Le nom d'utilisateur doit contenir entre 3 et 20 caractères (lettres, chiffres et underscores uniquement)";
        return false;
      }

      // Validation de l'email
      if (!this.email.trim()) {
        this.error = "Le courriel est requis";
        return false;
      }
      
      // Nettoyage et normalisation de l'email
      this.email = this.email.trim().toLowerCase();
      
      // Validation du format de l'email
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(this.email)) {
        this.error = "Format de courriel invalide";
        return false;
      }
      
      // Validation de la longueur du mot de passe (minimum 8 caractères pour la sécurité)
      if (this.password.length < 8) {
        this.error = "Le mot de passe doit contenir au moins 8 caractères";
        return false;
      }
      
      // Nettoyage des mots de passe
      this.password = this.password.trim();
      this.confirmPassword = this.confirmPassword.trim();
      
      // Validation de la correspondance des mots de passe
      if (this.password !== this.confirmPassword) {
        this.error = "Les mots de passe ne correspondent pas";
        return false;
      }
      return true;
    },

    /**
     * Méthode d'inscription asynchrone
     * 
     * Étapes principales :
     * 1. Validation du formulaire
     * 2. Préparation des données utilisateur
     * 3. Envoi de la requête d'inscription via le service d'authentification
     * 4. Gestion des réponses et des erreurs
     */
    async register() {
      try {
        // Réinitialisation des erreurs
        this.error = null;
        
        // Validation du formulaire avant soumission
        if (!this.validateForm()) {
          return;
        }

        // Activation de l'indicateur de chargement
        this.loading = true;

        // Inscription via le service d'authentification
        await authService.register(
          this.username.trim(),
          this.email.trim().toLowerCase(),
          this.password.trim()
        );
        
        // Affichage d'une alerte de succès
        alert({
          title: "Succès",
          message: "Inscription réussie ! Veuillez vous connecter.",
          okButtonText: "OK"
        });
        // Navigation vers la page de connexion
        this.$navigateTo(Login);
      } catch (error) {
        // Gestion détaillée des erreurs d'inscription
        if (error.response?.status === 500) {
          this.error = "Erreur serveur. Veuillez vérifier vos informations et réessayer.";
        } else if (error.response?.status === 409) {
          this.error = "Nom d'utilisateur ou courriel déjà enregistré";
        } else if (error.response?.status === 400) {
          this.error = "Format de saisie invalide";
        } else if (error.response?.data?.message) {
          this.error = error.response.data.message;
        } else {
          this.error = "Erreur lors de l'inscription. Veuillez réessayer.";
        }
      } finally {
        // Désactivation de l'indicateur de chargement
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Styles spécifiques au composant d'inscription */
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
