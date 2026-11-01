function formatField(id: string, value: string): string {
  const length = value.length.toString().padStart(2, '0')
  return `${id}${length}${value}`
}

function calculateCRC16(payload: string): string {
  let crc = 0xffff
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff
      } else {
        crc = (crc << 1) & 0xffff
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

interface GeneratePixParams {
  pixKey: string
  merchantName?: string
  merchantCity?: string
  amountInCents: number
  txid?: string
}

export function generatePixPayload({
  pixKey,
  merchantName = 'Referency Barber',
  merchantCity = 'Sapiranga',
  amountInCents,
  txid = '***',
}: GeneratePixParams): string {
  const cleanKey = pixKey.trim()
  const amountStr = (amountInCents / 100).toFixed(2)

  const merchantAccountInfo =
    formatField('00', 'br.gov.bcb.pix') + formatField('01', cleanKey)

  let payload =
    formatField('00', '01') +
    formatField('26', merchantAccountInfo) +
    formatField('52', '0000') +
    formatField('53', '986') +
    formatField('54', amountStr) +
    formatField('58', 'BR') +
    formatField('59', merchantName.slice(0, 25)) +
    formatField('60', merchantCity.slice(0, 15)) +
    formatField('62', formatField('05', txid)) +
    '6304'

  const crc = calculateCRC16(payload)
  return `${payload}${crc}`
}