import { Typography } from 'antd'

const { Title, Paragraph } = Typography

function Home() {
  return (
    <div>
      <Title level={2}>Welcome to the Application</Title>
      <Paragraph>
        This is the home page. You are successfully authenticated!
      </Paragraph>
      <Paragraph>
        Use the sidebar to navigate between pages.
      </Paragraph>
    </div>
  )
}

export default Home
