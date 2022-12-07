import axios, { AxiosError } from 'axios';
import { parseCookies } from 'nookies';
import { AuthTokenError } from './errors/AuthTokenError';
import { signOut } from '../contexts/AuthContext';

export function setupAPIClient(ctx = undefined) {
    // Vejamos as cookies atraves do contexto
    let cookies = parseCookies(ctx);

    // Preparamos o nosso objeto para consumo da API
    const api = axios.create({
        baseURL: 'http://localhost:3333',
        headers: {
            Authorization: `Bearer ${cookies['@nextauth.token']}`
        }
    });

    api.interceptors.response.use(response => {
        return response;
    }, (error: AxiosError) => {
        if(error.response.status === 401){
            // Diante de um 401 (unauthorized), vamos desligar o usuário
            if(typeof window !== undefined){
                // Se estivermos dentro de um browser, vamos executar o logout
                signOut();
            } else {
                // Assumindo que estamos no server-side (Não estamos num browser), retornamos um erro de autenticação
                return Promise.reject(new AuthTokenError());
            }
        }

        // Caso o erro seja de outra natureza, vamos devolver o erro recebido
        return Promise.reject(error);
    });

    // Podemos sair
    return api;
}