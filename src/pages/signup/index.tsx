import { useState, FormEvent, useContext } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import styles from '../../../styles/home.module.scss';
import logoImg from '../../../public/logo.svg';

import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

export default function SignUp() {

  // Vejamos o nosso contexto
  const { signUp } = useContext(AuthContext);

  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [loading,setLoading] = useState(false);

  async function handleSignUp(event: FormEvent) {
    event.preventDefault();

    // Sem dados não vamos tentar logar
    if(name === '' || email ==='' || password === ''){
      toast.warning("Favor informar nome, e-mail e senha");
      return;
    }

    // Indicação de loading
    setLoading(true);

    // Passamos diretamente os valores guardados no nosso state
    await signUp({ name, email, password });

    // Retiramos o sinal de Loading
    setLoading(false);
  }
  
  return (
    <>
      <Head>
        <title>@cerroDigital - Faça seu cadastro agora!</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logoImg} alt="Logo Pizzaria" />

        <div className={styles.login}>
          <h1>Criando sua conta - @cerroDigital</h1>
          <form onSubmit={handleSignUp}>
            <Input placeholder='Digite seu nome' type='text' required 
                   value={name}
                   onChange={e => setName(e.target.value)} />
            <Input placeholder='Digite seu e-mail' type='email' required 
                   value={email}
                   onChange={e => setEmail(e.target.value)} />
            <Input placeholder='Digite sua senha' type='password'
                   value={password} 
                   onChange={e => setPassword(e.target.value)} />

            <Button type="submit" loading={loading}> Cadastrar </Button>
          </form>
          <Link legacyBehavior href="/">
            <a className={styles.text}> Já possui uma conta? Faça o login.</a>
          </Link>
        </div>
      </div>
    </>
  )
}
