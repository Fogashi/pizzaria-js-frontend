import Head from "next/head"
import {useContext, FormEvent, useState} from 'react'
import Image from "next/image";
import styles from '../../styles/Home.module.scss'

import logoimg from '../../public/logo.svg';
import { Input } from "../components/ui/input";
import { Button } from '../components/ui/button'
import Link from "next/link";
import { AuthContext } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { canSSRGuest } from "../utils/canSSRGuest";





export default function Home() {
  const {signIn}  = useContext(AuthContext)

  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');

  const [loading, setLoading] = useState(false);
;

  async function handleLogin(event: FormEvent){
    event.preventDefault();

    if(email === '' || password === ''){
      toast.warning("preencha os campos")
      
      return;
    }

    setLoading(true);

    let data ={
      email,
      password
    }

    await signIn(data)

    setLoading(false);

  }

  return (
    <>
      <Head>
        <title>
          pizzaria js
        </title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logoimg} alt="logo principal" />

        <div className={styles.login}>
          <form onSubmit={handleLogin}>
            <Input placeholder="Digite seu email"
              type="text"
              value={email}
              onChange={ (e) => setEmail(e.target.value)}
              />
            <Input placeholder="Digite sua senha"
              type="password" 
              value={password}
              onChange={ (e) => setPassword(e.target.value)}
              />

            <Button
              type="submit"
              loading={loading}
            >
              Acessar
            </Button>
          </form>
          <Link href="/signup" legacyBehavior>
            <a>Não possui uma conta? Cadastre-se</a>
          </Link>
        </div>

      </div>
    </>
  )
}


export const getServerSideProps = canSSRGuest(async(ctx) =>{
  return{
    props:{}
  }
})