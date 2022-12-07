import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Header } from '../../components/Header';
import styles from './styles.module.scss';
import { FiRefreshCcw } from 'react-icons/fi';

import { setupAPIClient } from '../../services/api';

import Modal from 'react-modal';
import { ModalOrder } from '../../components/ModalOrder';


type orderProps = {
  id: string;
  table: string | number;
  status: boolean;
  draft: boolean;
  name: string | null;
}

interface HomeProps {
  pedidos: orderProps[];
}

// Este tipo será usado no Modal. Por isso exportamos.
export type OrderItemProps = {
  id: string;
  amount: number;
  order_id: string;
  product_id: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: string;
    banner: string;
  };
  order: {
    id: string;
    table: string | number;
    status: boolean;
    name: string | null;
  }
}

export default function Dashboard({ pedidos }: HomeProps) {
  // console.log(pedidos);
  const [orders,setOrders] = useState(pedidos || []);
  // States relacionados com o Modal
  const [modalItem,setModalItem] = useState<OrderItemProps[]>();
  const [modalVisible,setModalVisible] = useState(false);

  function handleCloseModal(){
    setModalVisible(false);
  }

  async function handleModal(id: string){
    // Aqui precisaremos dos dados do pedido
    const api = setupAPIClient();
    const response = await api.get('/items', {
      params: {
        order_id: id
      }
    });
    // Enviamos os dados para o modal
    setModalItem(response.data);
    setModalVisible(true);
  }

  async function handleFinishOrder(id: string){
      // Vamos fechar o pedido especificado
      const api = setupAPIClient();

      // Fechamos o pedido selecionado
      await api.put('/finish', {
        order_id: id
      });

      // Após fechar, vamos renvoar a lista de pedidos
      const response = await api.get('/orders');
      setOrders(response.data);

      // Podemos fechar o modal tb
      setModalVisible(false);
  }

  async function handleRefresh(){
    // Vamos fechar o pedido especificado
    const api = setupAPIClient();

    // Após fechar, vamos renvoar a lista de pedidos
    const response = await api.get('/orders');
    setOrders(response.data);

    // Forma neanderthal, usando javascript
    // document.location.reload();
  }

  // Configuração do Modal
  Modal.setAppElement('#__next');

  return (
        <>
        <Head>
          <title>Salão Principal @cerroDigital</title>
        </Head>
        <div>
          <Header/>

          <main className={styles.container}>
            <div className={styles.containerHeader}>
              <h1>Ultimos Pedidos</h1>
              <button onClick={handleRefresh}>
                <FiRefreshCcw color="#3FFFA3" size={25} />
              </button>
            </div>

            <article className={styles.pedidos}>

              {
                orders.length === 0 && (
                  <span className={styles.semPedidos}>
                    Não temos pedidos no momento!
                  </span>
                )
              }

            {
              orders.map((item,index) => (

                <section key={item.id} className={styles.pedido}>
                  <button onClick={ () => {handleModal(item.id) }}>
                    <div className={styles.tag}></div>
                    <span>Mesa {item.table}</span>
                  </button>
                </section>

              ) )
            }

            </article>
          </main>

          {
            modalVisible && (
              <ModalOrder
                isOpen={modalVisible}
                onRequestClose={handleCloseModal}
                order={modalItem}
                onFinishOrder={handleFinishOrder}
                 />
            )
          }
        </div>
        </>
    )
}


// Vamos criar a estrutura para verificar do lado do servidor.
// Somente usuários não conectados terão acesso a esta página.
// Quem não estiver conectado será redirecionado para o login.
import { allowConnected } from '../../utils/allowConnected';

export const getServerSideProps = allowConnected(async ctx => {
  // Vamos recuperar a lista de pedidos abertos
  const api = setupAPIClient(ctx);
  const response = await api.get('/orders');
  // console.log(response.data);

  return {
    props: {
      pedidos: response.data
    }
  }
})