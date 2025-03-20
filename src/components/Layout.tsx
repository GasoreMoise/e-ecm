import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
  children: React.ReactNode
  hideHeader?: boolean
  hideFooter?: boolean
}

export default function Layout({ children, hideHeader = false, hideFooter = false }: LayoutProps) {
  return (
    <>
      {!hideHeader && <Header />}
      <main>{children}</main>
      {!hideFooter && <Footer />}
    </>
  )
}