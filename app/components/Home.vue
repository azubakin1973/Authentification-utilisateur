/**
 * Composant Home - Page d'accueil après connexion
 * 
 * Ce composant sert de page principale après l'authentification.
 * Il affiche un message de bienvenue personnalisé et donne accès
 * au profil utilisateur et à la déconnexion.
 * 
 * Ce composant est conçu pour être étendu selon les besoins
 * du projet (ajout de fonctionnalités, navigation vers d'autres sections, etc.)
 */
<template>
  <Page>
    <ActionBar title="Accueil">
      <ActionItem 
        icon="res://user"
        text="Profil"
        @tap="showUserProfile"
        ios.position="right"
        android.position="right"
      />
    </ActionBar>
    <GridLayout rows="auto, *, auto">
      <!-- Section de bienvenue -->
      <StackLayout row="0" class="welcome-section" padding="20">
        <Label :text="'Bienvenu, ' + userName" class="welcome-text" />
        <Label text="Vous êtes connecté avec succès." class="subtitle-text" />
      </StackLayout>

      <!-- Section principale - contenu à personnaliser -->
      <StackLayout row="1" verticalAlignment="center" padding="20">
        <Label class="info-text" textWrap="true"
          text="Cette application est prête à être personnalisée selon vos besoins." />
        
        <!-- Bouton d'accès au profil -->
        <Button text="Mon profil" @tap="showUserProfile" backgroundColor="#2196F3" color="white" class="action-btn" />
      </StackLayout>

      <!-- Section de déconnexion -->
      <StackLayout row="2" padding="20">
        <Button text="Déconnexion" @tap="logout" class="logout-btn" />
      </StackLayout>
    </GridLayout>
  </Page>
</template>

<script>
import authService from "../services/authService";
import Login from "./Login.vue";
import UserProfile from "./UserProfile.vue";

export default {
  /**
   * État initial du composant
   * @returns {Object} État réactif pour la page d'accueil
   */
  data() {
    return {
      userName: "",  // Nom de l'utilisateur connecté
    };
  },

  /**
   * Hook de montage : initialisation du composant
   * 
   * Vérifie l'authentification et charge les données utilisateur.
   * Redirige vers la page de connexion si aucune session n'est active.
   */
  mounted() {
    // Vérification de l'authentification
    if (!authService.isAuthenticated()) {
      this.$navigateTo(Login);
      return;
    }

    // Récupération des données utilisateur via le service
    const userData = authService.getUserData();
    if (userData) {
      this.userName = userData.name || userData.email || "Utilisateur";
    } else {
      this.userName = "Utilisateur";
    }
  },

  methods: {
    /**
     * Navigation vers le profil utilisateur
     */
    showUserProfile() {
      this.$navigateTo(UserProfile);
    },

    /**
     * Déconnexion de l'utilisateur
     * 
     * Utilise le service d'authentification pour nettoyer la session
     * et redirige vers la page de connexion
     */
    logout() {
      authService.logout();
      this.$navigateTo(Login, { clearHistory: true });
    },
  },
};
</script>

<style scoped>
/* Styles de la section de bienvenue */
.welcome-section {
  background-color: #2196F3;
  padding: 30;
}

.welcome-text {
  font-size: 24;
  font-weight: bold;
  color: white;
  text-align: center;
  margin-bottom: 5;
}

.subtitle-text {
  font-size: 14;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
}

/* Styles de la section principale */
.info-text {
  font-size: 16;
  text-align: center;
  color: #666666;
  margin-bottom: 20;
}

.action-btn {
  margin: 10;
  padding: 12;
  font-size: 16;
  border-radius: 5;
}

/* Styles du bouton de déconnexion */
.logout-btn {
  background-color: rgba(50, 148, 5, 0.842);
  color: white;
  margin: 10;
  padding: 12;
  font-size: 16;
}
</style>
