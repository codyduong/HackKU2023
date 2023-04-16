import {
  createSignal,
  createContext,
  useContext,
  JSX,
  Accessor,
  Setter,
  onMount,
} from 'solid-js';
import app, { auth } from '~/auth';
import { getAuth, Auth, User, signOut } from 'firebase/auth';

export type UserContextValue = [
  state: Accessor<User | null>,
  actions: {
    setUser: Setter<User | null>;
    signOut: () => Promise<void>;
  }
];

const defaultUserContext = [
  () => null,
  {
    setUser: () => undefined,
    signOut: () =>
      new Promise((resolve) => {
        resolve(undefined);
      }),
  },
] as UserContextValue;

const UserContext = createContext(defaultUserContext);

interface UserProviderProps {
  auth: Auth;
  children: JSX.Element;
}

export function UserProvider(props: UserProviderProps) {
  const [user, setUser] = createSignal(getAuth(app).currentUser),
    value = [
      user,
      {
        setUser,
        signOut: async () => {
          setUser(null);
          await signOut(auth);
        },
      },
    ] as UserContextValue;

  onMount(() => {
    setUser(getAuth(app).currentUser);
  });

  return (
    <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
