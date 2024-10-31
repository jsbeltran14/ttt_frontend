import React from 'react';
import Head from "next/head";
import Link from "next/link";
import {useRouter} from "next/router";
import styles from "@/styles/Home.module.css";


const Layout = (props) => {
    const router = useRouter();

    const logout = async () => {
        await fetch('http://localhost:8000/api/logout', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
        })

        await router.push('/login');
    }

    let menu;

    if (!props.auth) {
        menu = (
            <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link href="/login">Login</Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/register">Register</Link>
        </li>
      </ul>
        )
    } else {
        menu = (
            <ul className={styles.navList}>
        
        <li className={styles.navItem}>
          <Link href="#" onClick={logout}>Logout</Link>
        </li>
      </ul>
            
        )
    }

    return (
        <>
            <Head>
                
            </Head>
            <nav className={styles.navbar}>
    <div className={styles.logo}>
      <Link href="/">Home</Link>
    </div>
    <div className={styles.navLinks}>
      {menu}
    </div>
  </nav>

            <main className={`${styles.page}`}>
                {props.children}
            </main>
        </>
    );
};

export default Layout;