import { rateLimit } from "express-rate-limit";

function limitador({ janelaEmMinutos, maximo, mensagem }) {
  return rateLimit({
    windowMs: janelaEmMinutos * 60 * 1000,
    limit: maximo,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler: (req, res) => res.status(429).json({ erro: mensagem })
  });
}

// Login gasta CPU no bcrypt, então o limite protege contra força bruta e
// contra usar o endpoint como vetor de exaustão de CPU.
export const limitadorDeLogin = limitador({
  janelaEmMinutos: 15,
  maximo: 10,
  mensagem: "Muitas tentativas de login. Tente novamente em alguns minutos."
});

export const limitadorDeCadastro = limitador({
  janelaEmMinutos: 60,
  maximo: 5,
  mensagem: "Muitas contas criadas a partir deste endereço. Tente novamente mais tarde."
});
