import { useState, FormEvent } from "react";
import Head from "next/head";
import { Header } from '../../components/Header';
import styles from './styles.module.scss';

import { setupAPIClient } from '../../services/api';
import { toast } from "react-toastify";

export default function Category() {
    const [name, setName] = useState('');

    async function handleRegister(e:FormEvent) {
        e.preventDefault();

        // Categoria obrigatória
        if(!name) return false;

        //
        const api = setupAPIClient();
        await api.post('/newcategory',{
            name: name
        });

        toast.success(`Categoria ${name} criada.`);
        setName('');
    }

    return (
        <>
        <Head>
            <title>Nova Categoria @cerroDigital</title>
        </Head>
        <div>
            <Header/>
            <main className={styles.container}>
                <h1>Criar uma nova categoria</h1>
                <form className={styles.form} onSubmit={handleRegister}>
                    <input type="text" required
                           placeholder="Digite o nome da categoria"
                           value={name}
                           onChange={ e => { setName(e.target.value)}}
                           className={styles.input} />

                    <button type="submit" className={styles.buttonAdd}> Criar </button>
                </form>
            </main>
        </div>
        </>
    )
}



// Somente usuários conectados terão acesso a esta página.
// Quem não estiver conectado será redirecionado para o login.
import { allowConnected } from '../../utils/allowConnected';

export const getServerSideProps = allowConnected(async ctx => {
  return {
    props: {}
  }
})