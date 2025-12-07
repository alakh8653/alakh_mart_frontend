import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Layout } from '@/components/Layout'
import { SWRConfig } from 'swr'
import axios from 'axios'
import { SessionProvider } from 'next-auth/react'

const fetcher = (url: string) => axios.get(url).then((r) => r.data)

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <SWRConfig value={{ fetcher }}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SWRConfig>
    </SessionProvider>
  )
}
