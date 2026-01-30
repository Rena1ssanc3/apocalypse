import { Typography } from 'antd'

const { Title, Paragraph } = Typography

function About() {
  return (
    <div>
      <Title level={2}>About</Title>
      <Paragraph>
        This is the about page of the application.
      </Paragraph>
      <Paragraph>
        Built with React, TypeScript, Ant Design, and Spring Boot.
      </Paragraph>
    </div>
  )
}

export default About
