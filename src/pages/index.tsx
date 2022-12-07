import { useContext, FormEvent, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import styles from '../../styles/home.module.scss';
import logoImg from '../../public/logo.svg';

import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

export default function Home() {
  // Vejamos o nosso contexto
  const { signIn } = useContext(AuthContext);
  // Preparamos dados para login
  const [ email, setEmail] = useState('')
  const [ password, setPassword] = useState('')
  const [ loading, setLoading] = useState(false)

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    // Sem dados não vamos tentar logar
    if(email ==='' || password === ''){
      // alert("Favor informar e-mail e senha");
      toast.warning("Favor informar e-mail e senha");
      return;
    }

    // Indicação de loading
    setLoading(true);

    // Passamos diretamente os valores guardados no nosso state
    await signIn({ email, password });

    // Retiramos o sinal de Loading
    setLoading(false);
  }

  //
  return (
    <>
      <Head>
        <title>@cerroDigital - Ingresse</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logoImg} alt="Logo Pizzaria" />
        <h1>@cerroDigital ¯\_(ツ)_/¯</h1>

        <div className={styles.login}>
          <form onSubmit={handleLogin}>
            <Input placeholder='Digite seu e-mail' type='email' required
                   value={email} 
                   onChange={ (e) => setEmail(e.target.value) } />
            {/* pattern=".+@globex\.com" */}
            <Input placeholder='Digite sua senha' type='password'
                   value={password} 
                   onChange={ (e) => setPassword(e.target.value) } />

            <Button type="submit" 
                    loading={loading} 
                    > Acessar </Button>
          </form>
          <Link legacyBehavior href="/signup">
            <a className={styles.text}> Não possui uma conta? Cadastre-se!</a>
          </Link>
        </div>
      </div>
    </>
  )
}


// Vamos criar a estrutura para verificar do lado do servidor.
// A ideia aqui é que somente usuários não conectados tenham acesso a esta página.
// Quem já estiver conectado será redirecionado para o dashboard.
import { allowGuest } from '../utils/allowGuest';

export const getServerSideProps = allowGuest(async ctx => {
  return {
    props: {}
  }
})