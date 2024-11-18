/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { RoutesProps } from "react-router-dom";
import axios from "axios";

interface AuthContextType {
  token: string | null;
  user: SpotifyApi.UserObjectPublic | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: RoutesProps) => {
  const [user, setUser] = useState<SpotifyApi.UserObjectPublic | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("access_token") || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async (accessToken: string) => {
      try {
        const response = await axios.get("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUser(response.data);
        setLoading(false);
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
      setIsAuthenticated(true);
      fetchUser(accessToken);
      window.history.replaceState({}, document.title, "/");
    } else if (token) {
      setIsAuthenticated(true);
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = () => {
    const clientId = import.meta.env.VITE_REACT_APP_SPOTIFY_CLIENT_ID;
    const baseUrl = window.location.origin;
    const scope = "playlist-modify-public playlist-modify-private user-top-read";
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${baseUrl}/callback`;
    window.location.href = authUrl;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("access_token");
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, loading, login, logout }}>
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
