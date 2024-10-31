import React, { SyntheticEvent } from "react";
import localFont from "next/font/local";
import styles from "@/styles/Home.module.css";
import Layout from "@/layouts/layout";
import { useRouter } from "next/router";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Register() {
    const [name, setName] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const router = useRouter();

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();

        await fetch('http://localhost:8000/api/register', {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        await router.push('/login');
    }

  return (
    <Layout>
    
      <main className={styles.main}>
      <form className={styles.loginForm} onSubmit={submit}>
        <h1 className="h3 mb-3 fw-normal">Register</h1>
        <input type="" className="form-control" placeholder="Name" required 
        onChange={e=>setName(e.target.value)}/>
        <input type="email" className="form-control" placeholder="Email" required 
        onChange={e=>setEmail(e.target.value)}/>
        <input type="password" className="form-control" placeholder="Password" required 
        onChange={e=>setPassword(e.target.value)}/>
        <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
      </form>
    </main>
  </Layout>
  );
}