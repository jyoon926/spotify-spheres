/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { RoutesProps } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-js";

interface AuthContextType {
  token: string | null;
  user: SpotifyApi.UserObjectPrivate | null;
  loading: boolean;
  isAuthenticated: boolean;
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: RoutesProps) => {
  const [user, setUser] = useState<SpotifyApi.UserObjectPrivate | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("access_token") || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [spotifyApi, setSpotifyApi] = useState<SpotifyWebApi.SpotifyWebApiJs | null>(null);

  useEffect(() => {
    const fetchUser = async (accessToken: string) => {
      let spotify = spotifyApi;
      if (!spotify) {
        spotify = new SpotifyWebApi();
        spotify.setAccessToken(accessToken);
        setSpotifyApi(spotify);
      }
      try {
        const response = await spotify.getMe();
        setUser(response);
        setLoading(false);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error fetching user data", error);
        logout();
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("access_token");

    if (accessToken) {
      setToken(accessToken);
      localStorage.setItem("access_token", accessToken);
      fetchUser(accessToken);
      window.history.replaceState({}, document.title, "/");
    } else if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = () => {
    const clientId = import.meta.env.VITE_REACT_APP_SPOTIFY_CLIENT_ID;
    const baseUrl = window.location.origin;
    const scope = "playlist-modify-public playlist-modify-private";
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${baseUrl}/callback`;
    window.location.href = authUrl;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setSpotifyApi(null);
    setIsAuthenticated(false);
    localStorage.removeItem("access_token");
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, loading, login, logout, spotifyApi }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
