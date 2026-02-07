/**
 * Configuration de base de l'instance Axios pour l'application
 * 
 * Ce module crée une instance Axios préconfigurée avec :
 * - L'URL de base de l'API backend
 * - Un intercepteur de requêtes pour l'ajout automatique du token d'authentification
 * - Un intercepteur de réponses pour la gestion centralisée des erreurs
 * 
 * @module services/api
 */

import axios from "axios";
import { ApplicationSettings } from "@nativescript/core";
import { API_BASE_URL } from "../config";

/**
 * Instance Axios préconfigurée avec l'URL de base de l'API
 * Toutes les requêtes passent par cette instance pour bénéficier
 * des intercepteurs et de la configuration centralisée
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Intercepteur de requêtes
 * 
 * Ajoute automatiquement le token d'authentification JWT
 * à chaque requête sortante si un token est disponible
 * dans le stockage local de l'application
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = ApplicationSettings.getString("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Intercepteur de réponses
 * 
 * Gère les erreurs HTTP de manière centralisée :
 * - 401 (Non autorisé) : Nettoie la session utilisateur
 * - Autres erreurs : Propage l'erreur pour traitement par le composant
 * 
 * Ceci permet de gérer la déconnexion automatique si le token expire
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si le serveur retourne 401, le token est invalide ou expiré
    if (error.response && error.response.status === 401) {
      ApplicationSettings.remove("userToken");
      ApplicationSettings.remove("userData");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
