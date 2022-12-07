import { createContext, ReactNode, useState, useEffect } from 'react';
import { destroyCookie, setCookie, parseCookies } from 'nookies';
import Router from 'next/router';
import { api } from '../services/apiClient';
import {toast} from 'react-toastify';

type UserProps = {
    id: string;
    name: string;
    email: string;
}

type SignInProps = {
    email: string;
    password: string;
}

type SignUpProps = {
    name: string;
    email: string;
    password: string;
}

type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>;
}

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function signOut(){
    // Desconectar nada mais é do que limpar o nosso cookie..
    try {

        // O nome do cookie está no api.ts
        destroyCookie(undefined, '@nextauth.token' );

        // Após destruir o cookie, redirecionaremos para o login
        Router.push('/');

    } catch(e) {
        // Em caso de problemas
        console.error("SignOut Error: " + e);
    }
}

export function AuthProvider({ children }: AuthProviderProps ){
    const [user, setUser] = useState<UserProps>();
    const isAuthenticated = !!user;   // True quando existe user; False em outros casos

    // Este effect eh para validar as informações do usuário conectado
    useEffect(() => {
        // Vamos começar recuperando o token do nosso cookie
        const { '@nextauth.token': token } = parseCookies();
        // console.log(`Token [${token}]`);
        if(token){
            api.get('/whoami')
            .then( response => {
                const { id, name, email } = response.data;
                // console.log(`Usuário [${id}] Nome [${name}] E-mail [${email}] `);
                // Guardamos no nosso state
                setUser({ id, name, email });
            })
            .catch( () => {
                // Mesmo com um token na mão, não foi possível recuperar as informações do usuário
                // portanto vamos desconectar esse usuário (limpar esse cookie)
                signOut();
            })
        }
    }, []);

    async function signIn({ email, password}: SignInProps){
        // console.log(`Conectando ${email} / ${password}..`);
        try {
            // Executamos a requisição
            const response = await api.post('/authuser',{ email, password });

            // Se estamos aqui eh porque conseguimos logar com sucesso
            toast.success('Conectado com sucesso.');

            const { id, name, token } = response.data;
            setCookie(undefined,'@nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30,   // expirar em 30 dias
                path: '/',   // Caminhos que terão acesso ao cookie
            });

            // Guardamos o usuário no nosso state
            setUser({ id, name, email });

            // Disponilizar o token para o povo..
            api.defaults.headers['Authorization'] = `Bearer ${token}`;

            // Após login, vamos redirecionar para um dashboard
            Router.push('/dashboard');

        } catch(err) {
            // Tem coisa errada que não está certa..
            toast.error(`${err.response.data['error']}`);
            console.error(err);
        }
    }

    async function signUp({ name, email, password}: SignUpProps){
        // console.log(`Cadastrando ${name} / ${email} / ${password}..`);

        try {
            // Let's go
            const response = await api.post('/newuser',{ name, email, password });

            // Se estamos aqui eh porque conseguimos cadastrar de boa
            toast.success('Cadastrado com sucesso.');

            // Após login, vamos redirecionar para um dashboard
            Router.push('/');

        } catch(err) {
            // Alguma coisa errada que não está certa..
            toast.error(err.response.data['error']);
            console.error(err);
        }

    }


    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp }}>
            {children}
        </AuthContext.Provider>
    )
}