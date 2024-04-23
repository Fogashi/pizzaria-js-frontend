
import {createContext, ReactNode, useState,useEffect} from 'react'
import { destroyCookie, setCookie,parseCookies } from 'nookies';
import Router from 'next/router';
import { api } from '../services/apiClient';
import { toast } from 'react-toastify';


type AuthContexData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>;
}

type UserProps = {
    id: string;
    name: string;
    email: string;
}

type SignInProps = {
    email: string;
    password: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

type SignUpProps = {
    name: string;
    email: string;
    password: string;
}



export const AuthContext = createContext({} as AuthContexData)

export function signOut(){
    try {
        destroyCookie(undefined,'@nextauth.token')
        Router.push('/')
    } catch  {
        console.log('erro ao deslogar')
    }
}

export function AuthProvider({children}: AuthProviderProps){
    const [user,setUser] = useState<UserProps>()
    const isAuthenticated = !!user;

    useEffect(() =>{

        const {'@nextauthtoken': token} = parseCookies();

        if(token){
            api.get('/me').then(response =>{
                const {id,name,email} = response.data;

                setUser({
                    id,
                    name,
                    email
                })
            })
            .catch(() =>{
                signOut();
            })
        }     
    
        
    },[])

    async function signIn({email,password}: SignInProps ){

        try {
            const response = await api.post('/session',{
                email,
                password
            })

            //console.log(response.data);
            const {id,name,token} = response.data;
            setCookie(undefined, '@nextauth.token',token,{
                maxAge: 60 * 60 * 24 * 30,
                path: "/"
                
            })
            setUser({
                id,
                name,
                email,
            })

            api.defaults.headers['Authorization'] = `Bearer ${token}`

            toast.success('Logado com sucesso!')
            Router.push('/dashboard')

        } catch  {
            toast.error('Erro ao acessar!')
            console.log("Erro ao acessar!");

        }
    }

    async function signUp({name,email,password}:SignUpProps ){

        try {
            const response = await api.post('/users',{
                name,
                email,
                password
            })
            
            toast.success("Conta criada!")

            Router.push('/')

        } catch {
            toast.error('Erro ao cadastrar!')
            console.log("erro ao cadastrar");
        }

      
    }

    return(
        <AuthContext.Provider value={{user, isAuthenticated, signIn, signOut,signUp}}>
        {children}
        </AuthContext.Provider>
    )
}