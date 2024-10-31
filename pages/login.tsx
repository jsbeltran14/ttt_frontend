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

export default function Login() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const router = useRouter();

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();

        await fetch('http://localhost:8000/api/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({
                email,
                password
            })
        });

        await router.push('/');
    }
  return (
    <Layout>
    
      <main className={styles.main}>
      <form className={styles.loginForm} onSubmit={submit}>
        <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
        <input type="email" className="form-control" placeholder="Email" required 
        onChange={e => setEmail(e.target.value)}/>
        <input type="password" className="form-control" placeholder="Password" required 
          onChange={e => setPassword(e.target.value)}/>
        <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
      </form>
    </main>


  </Layout>
  );
}