import { Modal, Form, Input, message } from 'antd'
import { useState } from 'react'
import userService from '../../services/userService'
import type { CreateUserRequest } from '../../types/api'

interface CreateUserModalProps {
  open: boolean
  onCancel: () => void
  onSuccess: () => void
}

const CreateUserModal = ({ open, onCancel, onSuccess }: CreateUserModalProps) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: CreateUserRequest) => {
    setLoading(true)
    try {
      await userService.createUser(values)
      message.success('User created successfully')
      form.resetFields()
      onSuccess()
    } catch (error: any) {
      const errorMsg = error.response?.data || 'Failed to create user'
      message.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  return (
    <Modal
      title="Create New User"
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: 'Please enter username' }]}
        >
          <Input placeholder="Enter username" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please enter password' },
            { min: 8, message: 'Password must be at least 8 characters' }
          ]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input placeholder="Enter email (optional)" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateUserModal

