import { useState,FormEvent,useContext } from "react";
import Head from "next/head"
import Image from "next/image";
import styles from '../../../styles/Home.module.scss'
import logoimg from '../../../public/logo.svg'
import { Input } from "../../components/ui/input";
import {Button} from '../../components/ui/button'
import Link from "next/link";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

export default function SignUp() {

  const {signUp} = useContext(AuthContext)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)


  async function handleSignUp(event:FormEvent) {
      event.preventDefault();

      if(name === '' || email === '' || password === ''){
        toast.error("Preencha todos os campos")
        return;
      }

      setLoading(true);
      let data ={
        name,
        email,
        password
      }
      await signUp(data)
      
      setLoading(false);
  }

  return (
    <>
      <Head>
        <title>
          Faça seu cadastro
        </title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logoimg} alt="logo principal" />
        <h1>Criando sua conta</h1>

        <div className={styles.login}>
          <form onSubmit={handleSignUp}>
            <Input placeholder="Digite seu nome"
              type="text" 
              value={name}
              onChange={(e) =>setName(e.target.value)}
              />
            <Input placeholder="Digite seu email"
              type="text"
              value={email}
              onChange={(e) =>setEmail(e.target.value)}              
              />
            <Input placeholder="Digite sua senha"
              type="password"
              value={password}
              onChange={(e) =>setPassword(e.target.value)}
              />

            <Button
            type="submit"
            loading={loading}
            >
              Cadastrar
              </Button>
          </form>
            
          <Link href="/" legacyBehavior>
            
                <a>Já possui conta? faça login</a>
            </Link>
        
        </div>

      </div>
    </>
  )
}

