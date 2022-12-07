import { useState, ChangeEvent, FormEvent } from "react";
import Head from "next/head";
import styles from './styles.module.scss';
import { Header } from '../../components/Header';
import { FiUpload } from "react-icons/fi";
import { setupAPIClient } from "../../services/api";
import { toast } from 'react-toastify';

type category = {
    id: string;
    name: string;
}

type categories = {
    categorias: category[]
}


export default function Product({ categorias }: categories) {
    // Estados dos nossos campos
    const [nome,setNome] = useState('');
    const [preco,setPreco] = useState('');
    const [descricao,setDescricao] = useState('');
    //
    const [url, setUrl] = useState('');
    const [image,setImage] = useState(null);
    //
    const [categories,setCategories] = useState(categorias || []);
    const [category,setCategory] = useState(0);   //Posição da categoria selecionada dentro da lista

    // Tratamento na seleção do arquivo
    function handleFile(e:ChangeEvent<HTMLInputElement>){
        // console.log(e.target.files);

        // Se não veio nenhuma imagem, caimso fora
        if(!e.target.files) return false;

        // Só interessa a primeira, caso existam várias
        const image = e.target.files[0];
        if(!image) return false;

        // Vamos validar o tipo de imagem recebida
        if(image.type === "image/jpeg" || image.type === "image/png"){
            setImage(image);
            setUrl(URL.createObjectURL(image));
        }
    }

    // Tratamento na seleção da categoria
    function handleCategory(ev:ChangeEvent<HTMLSelectElement>){
        // 
        console.log( `Categoria ${ev.target.value} - ${categorias[ev.target.value].name}`  );
        setCategory(parseInt(ev.target.value));
    }

    async function handleRegister(ev: FormEvent){
        ev.preventDefault();
        //
        try {

            // Validamos que existam todos os dados
            if(nome === '' || preco === '' || descricao === '' || image === null){
                toast.error("Preencha todos os dados!");
                return false;
            }

            // Preparamos nosso multipart formdata
            const data = new FormData();
            data.append('name', nome);
            data.append('price', preco);
            data.append('description', descricao);
            data.append('category_id', categorias[category].id);
            data.append('banner', image);

            // Agora sim, podemos cadastrar
            const api = setupAPIClient();
            await api.post('/newproduct',data);
            toast.success("Produto cadastrado!");

            // Agora só falta limpar a página
            setNome('');
            setPreco('');
            setDescricao('');
            setUrl('');
            setImage(null);

        } catch (err) {
            console.error(err);
            toast.error("Alguma coisa errada não está certa!");
        }
    }

    return (
        <>
        <Head>
            <title>Novo Produto @cerroDigital</title>
        </Head>
        <div>
            <Header/>
            <main className={styles.container}>
                <h1>Novo produto</h1>
                <form className={styles.form} onSubmit={handleRegister}>

                    <label className={styles.labelAvatar}>
                        <span>
                            <FiUpload size={25} color="#FFF" />
                        </span>
                        <input type="file" accept="image/png, image/jpeg" onChange={handleFile} />
                        { url && (
                            <img
                                className={styles.preview}
                                alt="Foto do produto"
                                width={250}
                                height={250}
                                src={url} />
                        )}

                    </label>

                    <select value={category} onChange={handleCategory}>
                        {
                            categories.map( (item,index) => {
                                // 
                                return (
                                    <option key={item.id} value={index}>{item.name}</option>
                                )
                            })
                        }
                        {/* <option>Bebida</option>
                        <option>Pizzas</option> */}
                    </select>

                    <input type="text" placeholder="Nome do produto"
                        value={nome}
                        onChange={e => {setNome(e.target.value)}}
                        className={styles.input} />

                    <input type="text" placeholder="Valor" 
                        value={preco}
                        onChange={e => {setPreco(e.target.value)}}
                        className={styles.input} />

                    <textarea
                        placeholder="Descreva o produto..."
                        value={descricao}
                        onChange={e => {setDescricao(e.target.value)}}
                        className={styles.input} ></textarea>

                    <button className={styles.buttonAdd} type="submit"> Criar </button>

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

    // Antes de montar a página vamos recuperar a lista de categirias no sistema
    const api = setupAPIClient(ctx);
    const response = await api.get('/listcategories');
    // console.log(response.data);

    //
    return {
        props: {
            categorias: response.data
        }
    }
})