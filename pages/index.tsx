import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Head from 'next/head';
import styles from './index.module.css';
import Story from './Story';

export default function Home() {
  return (
    <div>
      <Head>
        <title>AI Adventure</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <main className={styles.main}>
        <Story />
      </main>
    </div>
  );
}
