const KEYWORDS = new Set([
  'SELECT',
  'FROM',
  'WHERE',
  'AND',
  'OR',
  'AS',
  'ORDER',
  'GROUP',
  'BY',
  'LIMIT',
  'JOIN',
  'ON',
  'INSERT',
  'UPDATE',
  'DELETE',
  'INTERVAL',
  'IS',
  'NULL',
  'NOT',
  'IN',
  'BETWEEN',
  'LEFT',
  'RIGHT',
  'INNER',
  'OUTER',
  'DISTINCT',
  'HAVING',
  'DESC',
  'ASC',
])

const TOKEN_PATTERN =
  /('[^']*')|(\b\w+\b(?=\())|(\b\d+(?:\.\d+)?\b)|(\b\w+\b)|(\s+)|([^\s\w]+)/g

export const highlightSql = (sql: string) => {
  const tokens = sql.match(TOKEN_PATTERN) ?? []

  return tokens.map((token, index) => {
    const key = `${index}-${token}`

    if (token.startsWith("'")) {
      return (
        <span key={key} className="text-accent">
          {token}
        </span>
      )
    }
    if (/^\s+$/.test(token)) {
      return token
    }
    if (KEYWORDS.has(token.toUpperCase())) {
      return (
        <span key={key} className="text-violet">
          {token}
        </span>
      )
    }
    if (/^[^\s\w]+$/.test(token)) {
      return (
        <span key={key} className="text-ink-faint">
          {token}
        </span>
      )
    }
    if (/^\d+(\.\d+)?$/.test(token)) {
      return (
        <span key={key} className="text-ink">
          {token}
        </span>
      )
    }
    // bare word followed by '(' → function call
    if (sql.includes(`${token}(`)) {
      return (
        <span key={key} className="text-amber">
          {token}
        </span>
      )
    }
    return (
      <span key={key} className="text-ink">
        {token}
      </span>
    )
  })
}
