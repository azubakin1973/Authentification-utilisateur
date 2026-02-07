/**
 * Composant de profil utilisateur pour l'application
 * 
 * Fonctionnalités principales :
 * - Affichage des informations personnelles de l'utilisateur
 * - Modification du nom d'utilisateur
 * - Déconnexion sécurisée avec nettoyage de session
 * - Communication avec le service d'authentification pour la mise à jour du profil
 */
<template>
  <Page>
    <ActionBar title="Profil utilisateur">
      <NavigationButton text="Retour" android:systemIcon="ic_menu_back" @tap="goBack" />
    </ActionBar>
    <StackLayout padding="20">
      <!-- Champ de saisie pour le nom d'utilisateur (modifiable) -->
      <TextField v-model="userName" hint="Nom d'utilisateur" />

      <!-- Champ de courriel (lecture seule) -->
      <TextField v-model="userEmail" hint="Courriel" keyboardType="email" isEnabled="false" class="email-field" />

      <!-- Bouton de sauvegarde des modifications -->
      <Button text="Sauvegarder" @tap="saveChanges" backgroundColor="#2196F3" color="white" />

      <!-- Bouton de déconnexion -->
      <Button text="Déconnexion" @tap="logout" class="logout-btn" />
    </StackLayout>
  </Page>
</template>

<script>
import authService from "../services/authService";
import Login from "./Login.vue";

export default {
  /**
   * État initial du composant
   * @returns {Object} État réactif pour le profil utilisateur
   */
  data() {
    return {
      userName: "",    // Nom d'utilisateur affiché et modifiable
      userEmail: "",   // Courriel de l'utilisateur (lecture seule)
    };
  },
  methods: {
    /**
     * Navigation vers la page précédente
     * Utilise la navigation intégrée de NativeScript-Vue
     */
    goBack() {
      this.$navigateBack();
    },

    /**
     * Sauvegarde des modifications du profil utilisateur
     * 
     * Étapes principales :
     * 1. Envoi de la requête via le service d'authentification
     * 2. Mise à jour automatique du stockage local (géré par le service)
     * 3. Affichage d'un message de confirmation
     */
    async saveChanges() {
      try {
        // Mise à jour du profil via le service d'authentification
        await authService.updateProfile(this.userName, this.userEmail);

        // Affichage d'un message de succès
        alert({
          title: "Succès",
          message: "Nom d'utilisateur mis à jour avec succès !",
          okButtonText: "OK"
        });
      } catch (error) {
        console.error("Détails de l'erreur :", error.message);
        
        // Alerte d'erreur détaillée
        alert({
          title: "Erreur de mise à jour",
          message: `Échec de la mise à jour du nom d'utilisateur.\nErreur : ${error.message}`,
          okButtonText: "OK"
        });
      }
    },

    /**
     * Déconnexion de l'utilisateur
     * 
     * Utilise le service d'authentification pour nettoyer la session
     * et redirige vers la page de connexion avec nettoyage de l'historique
     */
    logout() {
      // Déconnexion via le service d'authentification
      authService.logout();
      
      // Navigation vers la page de connexion avec nettoyage de l'historique
      this.$navigateTo(Login, { clearHistory: true });
    }
  },

  /**
   * Hook de montage : chargement des données utilisateur
   * 
   * Vérifie l'authentification et récupère les informations utilisateur
   * depuis le service d'authentification.
   * Redirige vers la page de connexion si aucune session n'est active.
   */
  mounted() {
    // Vérification de l'authentification
    if (!authService.isAuthenticated()) {
      this.$navigateTo(Login, { clearHistory: true });
      return;
    }

    // Récupération des données utilisateur via le service
    const userData = authService.getUserData();
    if (userData) {
      this.userName = userData.name || "";
      this.userEmail = userData.email || "";
    }
  }
};
</script>

<style scoped>
/* Styles spécifiques au composant de profil utilisateur */
TextField {
  margin: 10;
  padding: 10;
}

Button {
  margin: 10;
  padding: 10;
}

.logout-btn {
  background-color: rgba(50, 148, 5, 0.842);
  color: white;
  margin-top: 20;
}

.email-field {
  opacity: 1;
  color: gray;
  background-color: transparent;
}
</style>
