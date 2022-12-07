import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from 'nookies';


// Identificação de visitantes (usuários não conectados)
// Se for um visitante, segue o processamento.
// Se já estiver conectado, encaminhamos ao dashboard
export function allowGuest<P>(fn: GetServerSideProps<P>){

    // Começamos verificando o nosso token..
    return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

        // Procuramos o nosso cookie
        const cookies = parseCookies(context);

        if(cookies['@nextauth.token']){
            // Achamos o cookie, o que significa que já está conectado. Então, redirecionamos para o dashboard
            console.log("Redirecionando..")
            return {
                redirect: {
                    destination: '/dashboard',
                    permanent: false,
                }
            }
        }

        // Seguimos adiante
        return await fn(context);
    }
}