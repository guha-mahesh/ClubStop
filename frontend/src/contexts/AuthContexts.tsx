
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';


interface User {
  id: string;
  username: string;
}
interface School{
  school: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (data: LoginResponse) => void;
  logout: () => void;
  school: School | null;
}

interface LoginResponse {
  token: string;
  user: User;
  school: School;
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
  const [school, setSchool] = useState<School | null>(null)
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    const school = localStorage.getItem('school')


    
    if (token && userData && school) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      setSchool(JSON.parse(school));
    }
    
    setLoading(false);
  }, []);

  const login = (data: LoginResponse) => {
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('school', JSON.stringify(data.school));
    setIsAuthenticated(true);
    setUser(data.user);
    setSchool(data.school)
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    window.location.reload()
    setUser(null);
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    loading,
    school,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};