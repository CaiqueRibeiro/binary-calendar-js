function createCalendar() {
  const DAYS_IN_YEAR = 365;
  // Inicializa o calendário todo vazio (tudo com 0)
  // Como estou usando um array de Integers com 8 bits, cada índice pode guardar 8 dias, logo precisa de 46 índices para guardar o ano todo
  const calendar = new Uint8Array(Math.ceil(DAYS_IN_YEAR / 8));
  return calendar;
}

function occupyDay(date, calendar) {
  // Transforma o ISO String em um integer
  const dayNumber = convertISOStringToInteger(new Date(date));
  // Verifica em qual posição o dia está no array de bits. Como cada índice representa 8 dias: Número do dia / 8
  const index = Math.floor(dayNumber / 8); // index X no array calendar
  // Calcula a posição do dia dentro do array. Como cada índice representa 8 dias: Número do dia % 8 (é sempre o dia o ano - 1 pois o ano começa no dia 1 mas o array no indice 0). Ex
  // dia 8 de janeiro -> 7 = 7 % 8 = 7, então índice 7 do array no índice 0 ([0, 0, 0, 0, 0, 0, 0, 1])
  // dia 13 de janeiro -> 12 = 12 % 8 = 4, então índice 4 do array no índice 1 ([0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 1, 0, 0, 0])
  // dia 23 de janeiro -> 22 - 22 % 8 = 6, então índice 6 do array no índice 2 ([0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 1, 0])
  const position = dayNumber % 8;
  // Insere o dia 12 (posição 4 no índice 1) usando bitwise OR.
  // calendar[1] |= 1 << 4
  // 1 << 4 => 16 => convertido em binário (0 0 0 0 1 0 0 0 0)
  // CALENDARIO: 0 0 0 0 0 0 0 0 0
  // DIA:        0 0 0 0 1 0 0 0 0
  // RESULTADO:  0 0 0 0 1 0 0 0 0 => atualiza o array do índice 1 com esse valor
  calendar[index] |= 1 << position;
}


function verifyDay(date, calendar) {
  const dayNumber = convertISOStringToInteger(new Date(date));
  const index = Math.floor(dayNumber / 8);
  const position = dayNumber % 8;
  // verifica se o dia passado está ocupado (valor 1 no bit array) usando bitwise AND
  // Se procurar por um dia ocupado:
      // CALENDARIO: 0 0 0 0 1 0 0 0 0
      // DIA:        0 0 0 0 1 0 0 0 0
      // RESULTADO:  0 0 0 0 1 0 0 0 0 => Retorna o valor (em number pq no JS não retorna binário) => 16

  // Se procurar por um dia vazio:
      // CALENDARIO: 0 0 0 0 1 0 0 0 0
      // DIA:        0 0 0 0 0 0 1 0 0
      // RESULTADO:  0 0 0 0 0 0 0 0 0 => Retorna 0 (em number pq no JS não retorna binário)
  const isDayBusy = (calendar[index] & (1 << position)) !== 0;
  return isDayBusy
}

function convertISOStringToInteger(dateToFormat) {
  const date = new Date(Date.parse(dateToFormat));
  // Calcula o inteiro se baseando tempo que falta entre o dia solicitado e o dia primeiro. Ex:
  // Dia 08 de Janeiro vai ser número 7 (contando o dia 1 como 0)
  const dayNumber = Math.floor((date - new Date(date.getFullYear(), 0, 1)) / (1000 * 60 * 60 * 24));
  return dayNumber;
}