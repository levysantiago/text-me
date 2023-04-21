import { ReactNode } from 'react'
import { Container, Main } from './styles'

interface IWebsiteContainerProps {
  children: ReactNode
}

export function WebsiteContainer({ children }: IWebsiteContainerProps) {
  return (
    <Container style={{ backgroundColor: '#383b41' }}>
      <Main>{children}</Main>
    </Container>
  )
}
