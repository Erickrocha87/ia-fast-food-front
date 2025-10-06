import Head from "next/head";
import LoginCard from "../components/LoginCard";


export default function loginPage() {
  return (
    <>
      <Head>
        <title>ServeAI - Login</title>
        <meta
          name="description"
          content="Login para o sistema AI OrderAssist da ServeAI"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <LoginCard />
      </main>
    </>
  );
}
