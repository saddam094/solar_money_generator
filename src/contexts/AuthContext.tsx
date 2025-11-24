import { createContext, useContext, useEffect, useState } from 'react';
import bcrypt from 'bcryptjs';

type LocalUser = {
  id: string;
  full_name: string | null;
  mobile_number: string | null;
  referral_code?: string | null;
  balance?: number | null;
};

interface AuthContextType {
  user: LocalUser | null;
  loading: boolean;
  signUp: (mobileNumber: string, password: string, fullName: string, referralCode?: string) => Promise<{ error: Error | null }>;
  signIn: (mobileNumber: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const USERS_KEY = 'smg_users';
const SESSION_KEY = 'smg_session';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function stripPassword(user: any): LocalUser {
  const { password: _p, ...rest } = user;
  return rest as LocalUser;
}

function readUsers(): any[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch (_) {
    return [];
  }
}

function writeUsers(users: any[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = localStorage.getItem(SESSION_KEY);
    if (sessionId) {
      const users = readUsers();
      const found = users.find((u) => u.id === sessionId);
      if (found) setUser(stripPassword(found));
    }
    setLoading(false);
  }, []);

  const signUp = async (mobileNumber: string, password: string, fullName: string, referralCode?: string) => {
    try {
      const users = readUsers();
      if (users.find((u) => u.mobile_number === mobileNumber)) {
        return { error: new Error('Mobile number already registered') };
      }

      // hash password before storing
      const saltRounds = 10;
      const hashed = await new Promise<string>((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err: any, hash: any) => {
          if (err) reject(err);
          else resolve(hash as string);
        });
      });

      const id = 'local-' + Date.now().toString(36);
      const newUser = {
        id,
        full_name: fullName,
        mobile_number: mobileNumber,
        referral_code: referralCode ?? null,
        balance: 0,
        password: hashed,
      };
      users.push(newUser);
      writeUsers(users);
      localStorage.setItem(SESSION_KEY, id);
      setUser(stripPassword(newUser));
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (mobileNumber: string, password: string) => {
    try {
      const users = readUsers();
      const found = users.find((u) => u.mobile_number === mobileNumber);
      if (!found) return { error: new Error('Invalid credentials') };

      const stored = found.password as string | undefined;
      let ok = false;

      if (!stored) {
        // no password stored — reject
        return { error: new Error('Invalid credentials') };
      }

      // detect if stored password is bcrypt hash (starts with $2a$ or $2b$ or $2y$)
      const isHashed = stored.startsWith('$2a$') || stored.startsWith('$2b$') || stored.startsWith('$2y$') || stored.startsWith('$2$');

      if (isHashed) {
        ok = await new Promise<boolean>((resolve) => {
          bcrypt.compare(password, stored, (err: any, res: any) => {
            resolve(Boolean(res && !err));
          });
        });
      } else {
        // legacy plain-text password: compare and migrate to hashed
        if (stored === password) {
          ok = true;
          try {
            const saltRounds = 10;
            const hashed = await new Promise<string>((resolve, reject) => {
              bcrypt.hash(password, saltRounds, (err: any, hash: any) => {
                if (err) reject(err);
                else resolve(hash as string);
              });
            });
            // write back hashed password
            const updated = users.map((u) => (u.id === found.id ? { ...u, password: hashed } : u));
            writeUsers(updated);
          } catch (_) {
            // ignore migration error
          }
        }
      }

      if (!ok) return { error: new Error('Invalid credentials') };

      localStorage.setItem(SESSION_KEY, found.id);
      setUser(stripPassword(found));
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
