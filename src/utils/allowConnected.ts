import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies, destroyCookie } from 'nookies';
import { AuthTokenError } from '../services/errors/AuthTokenError';


// Identificação de usuários conectados.
// Se for um visitante, encaminhamos para o login.
export function allowConnected<P>(fn: GetServerSideProps<P>){

    // Começamos verificando o nosso token..
    return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

        // Procuramos o nosso cookie
        const cookies = parseCookies(context);

        if(!cookies['@nextauth.token']){
            // Não achamos o cookie, portanto não está conectado. Vai pro login..
            console.log("Redirecionando para o login..")
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                }
            }
        }

        // Seguimos adiante, mas com cuidado
        try {
            // Tentamos seguir
            return await fn(context);
        } catch(err) {
            // Se tivermos algum problema..
            if(err instanceof AuthTokenError){
                // Limpamos o cookie e redirecionamos
                destroyCookie(context,'@nextauth.token');
                return {
                    redirect: {
                        destination: '/',
                        permanent: false,
                    }
                }
            }
        }
        
    }
}