/**
 * Service d'authentification pour l'application
 * 
 * Ce module centralise toute la logique d'authentification :
 * - Connexion et inscription des utilisateurs
 * - Gestion des tokens JWT
 * - Stockage et récupération des données utilisateur
 * - Mise à jour du profil
 * - Déconnexion
 * 
 * @module services/authService
 * 
 * Pour intégrer avec une base de données :
 * - Modifier les méthodes login(), register(), updateProfile()
 *   pour pointer vers les nouveaux endpoints ou la connexion directe à la BD
 * - Le reste du code (composants) n'a pas besoin de changer
 */

import { ApplicationSettings } from "@nativescript/core";
import apiClient from "./api";

/**
 * Clés de stockage utilisées dans ApplicationSettings
 * Centralisées ici pour éviter les erreurs de frappe
 */
const STORAGE_KEYS = {
  TOKEN: "userToken",
  USER_DATA: "userData",
};

/**
 * Connexion de l'utilisateur
 * 
 * @param {string} email - Courriel de l'utilisateur
 * @param {string} password - Mot de passe de l'utilisateur
 * @returns {Promise<Object>} Données utilisateur (email, name)
 * @throws {Error} Erreur de connexion si les identifiants sont invalides
 */
async function login(email, password) {
  const response = await apiClient.post("/auth/login", {
    email,
    password,
  });

  if (response.data && response.data.token) {
    // Sauvegarde du token JWT
    setToken(response.data.token);

    // Décodage du token JWT pour extraire les informations utilisateur
    const tokenParts = response.data.token.split(".");
    const tokenPayload = JSON.parse(atob(tokenParts[1]));

    // Sauvegarde des données utilisateur
    const userData = {
      email: email,
      name: tokenPayload.username || "Utilisateur",
    };
    setUserData(userData);

    return userData;
  }

  throw new Error("Réponse de connexion invalide");
}

/**
 * Inscription d'un nouvel utilisateur
 * 
 * @param {string} username - Nom d'utilisateur choisi
 * @param {string} email - Courriel de l'utilisateur
 * @param {string} password - Mot de passe choisi
 * @returns {Promise<Object>} Données de la réponse du serveur
 * @throws {Error} Erreur d'inscription (409: doublon, 400: format invalide, etc.)
 */
async function register(username, email, password) {
  const response = await apiClient.post("/auth/users", {
    username,
    email,
    password,
  });
  return response.data;
}

/**
 * Mise à jour du profil utilisateur
 * 
 * @param {string} username - Nouveau nom d'utilisateur
 * @param {string} email - Courriel de l'utilisateur (non modifiable)
 * @returns {Promise<Object>} Données de la réponse du serveur
 * @throws {Error} Erreur de mise à jour
 */
async function updateProfile(username, email) {
  const response = await apiClient.put("/auth/users", {
    username,
    email,
  });

  // Mise à jour du stockage local avec le nouveau nom
  const userData = getUserData();
  if (userData) {
    userData.name = username;
    setUserData(userData);
  }

  return response.data;
}

/**
 * Déconnexion de l'utilisateur
 * 
 * Supprime toutes les données de session stockées localement
 * (token JWT et données utilisateur)
 */
function logout() {
  ApplicationSettings.remove(STORAGE_KEYS.TOKEN);
  ApplicationSettings.remove(STORAGE_KEYS.USER_DATA);
}

/**
 * Vérifie si l'utilisateur est authentifié
 * 
 * @returns {boolean} true si un token JWT est présent
 */
function isAuthenticated() {
  const token = ApplicationSettings.getString(STORAGE_KEYS.TOKEN);
  return !!token;
}

/**
 * Récupère le token JWT stocké
 * 
 * @returns {string|null} Le token JWT ou null si absent
 */
function getToken() {
  return ApplicationSettings.getString(STORAGE_KEYS.TOKEN) || null;
}

/**
 * Sauvegarde le token JWT dans le stockage local
 * 
 * @param {string} token - Le token JWT à stocker
 */
function setToken(token) {
  ApplicationSettings.setString(STORAGE_KEYS.TOKEN, token);
}

/**
 * Récupère les données utilisateur stockées localement
 * 
 * @returns {Object|null} Les données utilisateur {email, name} ou null si absentes
 */
function getUserData() {
  try {
    const dataString = ApplicationSettings.getString(STORAGE_KEYS.USER_DATA);
    if (dataString) {
      return JSON.parse(dataString);
    }
  } catch (error) {
    console.error("Erreur lors de la lecture des données utilisateur :", error);
  }
  return null;
}

/**
 * Sauvegarde les données utilisateur dans le stockage local
 * 
 * @param {Object} userData - Les données utilisateur à stocker {email, name}
 */
function setUserData(userData) {
  ApplicationSettings.setString(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
}

export default {
  login,
  register,
  updateProfile,
  logout,
  isAuthenticated,
  getToken,
  setToken,
  getUserData,
  setUserData,
};
