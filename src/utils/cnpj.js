// Máscara XX.XXX.XXX/XXXX-XX aplicada enquanto a pessoa digita. Só
// confere o formato (14 dígitos) — checar o dígito verificador de
// verdade é trabalho pro backend, que ainda não existe (ver Não
// esquecer.md).
export function formatarCNPJ(valor) {
  return valor
    .replace(/\D/g, '')
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

export function cnpjEhValido(valor) {
  return valor.replace(/\D/g, '').length === 14
}
