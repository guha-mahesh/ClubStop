import { createContext, useState, useEffect, useContext, ReactNode } from 'react';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

interface User {
  id: string;
  username: string;
}



interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (data: LoginResponse) => void;
  logout: () => void;
  school: string | null;
  checkAuth: () => Promise<void>;
}

interface LoginResponse {
  user: User;
  school: string;

  
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [school, setSchool] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  
  const checkAuth = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/verify`, {
        method: 'GET',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setIsAuthenticated(true);
          setUser(data.user);
          setSchool(data.school);
          
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('school', JSON.stringify(data.school));
        } else {
          
          setIsAuthenticated(false);
          setUser(null);
          setSchool(null);
          localStorage.removeItem('user');
          localStorage.removeItem('school');
        }
      } else {
        
        setIsAuthenticated(false);
        setUser(null);
        setSchool(null);
        localStorage.removeItem('user');
        localStorage.removeItem('school');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setUser(null);
      setSchool(null);
      localStorage.removeItem('user');
      localStorage.removeItem('school');
    }
    finally{
      setLoading(false); 
    }
  };

  useEffect(() => {
    
    const userData = localStorage.getItem('user');
    const schoolData = localStorage.getItem('school');

    if (userData && schoolData) {
      setUser(JSON.parse(userData));
      setSchool(JSON.parse(schoolData));
      
      checkAuth();
    } else {
      
      checkAuth();
    }
    

  }, []);

  const login = (data: LoginResponse) => {
    
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('school', JSON.stringify(data.school));
    
    setIsAuthenticated(true);
    setUser(data.user);
    setSchool(data.school);
  };

  const logout = async () => {
    try {
      
      await fetch(`${backendUrl}/api/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    }

    
    localStorage.removeItem('user');
    localStorage.removeItem('school');
    setIsAuthenticated(false);
    setUser(null);
    setSchool(null);
    
    
    window.location.reload();
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    loading,
    school,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};