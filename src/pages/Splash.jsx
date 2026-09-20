import { useNavigate } from 'react-router-dom'
import BubbleLogo from '../components/BubbleLogo'
import Moldura from '../components/Moldura'

/* ============================================================
   Página inicial do Bolha. O logo é o protagonista da tela: caminha
   por toda a área disponível (keyframe `bolha-caminhar` em
   tokens.css, `top`/`left` em vez de um `translateY` pequeno), não
   fica só balançando no lugar. Os botões ficam discretos embaixo, na
   ordem de quem é mais comum primeiro: Cadastre-se (novo por aqui),
   Login (quem já tem conta) e Seja parceiro (empresa) como link, já
   que é o público menos comum de quem abre o app pela primeira vez.

   "Cadastre-se" e "Login" não navegam de verdade: o componente pai
   (EntradaNaoLogada, em App.jsx) troca pra Entrar.jsx com o modo
   certo. "Seja parceiro" navega pra /parceiro, rota própria — ver
   App.jsx.
   ============================================================ */
export default function Splash({ onCadastro, onLogin }) {
  const navigate = useNavigate()

  return (
    <Moldura>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        background: 'radial-gradient(circle at 50% 30%, #142248, var(--deep) 70%)',
      }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <div style={{ position: 'absolute', transform: 'translate(-50%, -50%)', animation: 'bolha-caminhar 16s ease-in-out infinite' }}>
            <BubbleLogo height={104} />
          </div>
        </div>

        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          padding: '0 32px 40px', animation: 'bolha-entra .6s .15s ease both',
        }}>
          <button onClick={onCadastro} style={botaoPrimario}>Cadastre-se</button>
          <button onClick={onLogin} style={botaoSecundario}>Login</button>
          <button onClick={() => navigate('/parceiro')} style={linkParceiro}>É uma empresa? Seja parceiro</button>
        </div>
      </div>
    </Moldura>
  )
}

const botaoPrimario = {
  width: '100%', maxWidth: 260, padding: '13px 18px', borderRadius: 999, border: 'none', cursor: 'pointer',
  fontWeight: 600, fontSize: 14.5, background: 'linear-gradient(90deg, var(--sea), #0f6f66)', color: '#052e2a',
}

const botaoSecundario = {
  width: '100%', maxWidth: 260, padding: '13px 18px', borderRadius: 999, cursor: 'pointer',
  fontWeight: 600, fontSize: 14.5, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--line)', color: 'var(--text)',
}

const linkParceiro = {
  marginTop: 4, padding: 6, border: 'none', background: 'none', cursor: 'pointer',
  fontSize: 12.5, fontWeight: 600, color: 'var(--text-muted)', textDecoration: 'underline',
}
