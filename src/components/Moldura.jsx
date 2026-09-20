/* A "casca" do app: a largura de celular, centralizada na tela.
   Fica num arquivo só pra tela de entrada e o app logado terem
   exatamente o mesmo formato. */
export default function Moldura({ children }) {
  return (
    <div style={{
      maxWidth: 468, height: '100dvh', margin: '0 auto', position: 'relative',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      borderRadius: 22, boxShadow: '0 0 0 1px var(--line)',
    }}>
      {children}
    </div>
  )
}
