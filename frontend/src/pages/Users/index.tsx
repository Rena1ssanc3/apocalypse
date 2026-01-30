import { useState, useEffect } from 'react'
import { Table, Button, Tag, Switch, Modal, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import MainLayout from '../../components/layout/MainLayout'
import CreateUserModal from './CreateUserModal'
import userService from '../../services/userService'
import type { User } from '../../types/api'

const Users = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await userService.getUsers()
      setUsers(data)
    } catch (error) {
      message.error('Failed to load users')
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleStatusToggle = (user: User) => {
    Modal.confirm({
      title: `${user.enabled ? 'Disable' : 'Enable'} User`,
      content: `Are you sure you want to ${user.enabled ? 'disable' : 'enable'} ${user.username}?`,
      onOk: async () => {
        try {
          await userService.updateUserStatus(user.id, { enabled: !user.enabled })
          message.success(`User ${user.enabled ? 'disabled' : 'enabled'} successfully`)
          fetchUsers()
        } catch (error: any) {
          const errorMsg = error.response?.data || 'Failed to update user status'
          message.error(errorMsg)
        }
      }
    })
  }

  const handleCreateSuccess = () => {
    setIsModalOpen(false)
    fetchUsers()
  }

  const columns: ColumnsType<User> = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => email || '-',
    },
    {
      title: 'Status',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled) => (
        <Tag color={enabled ? 'green' : 'red'}>
          {enabled ? 'Enabled' : 'Disabled'}
        </Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => date ? new Date(date).toLocaleString() : '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Switch
          checked={record.enabled}
          onChange={() => handleStatusToggle(record)}
          checkedChildren="Enabled"
          unCheckedChildren="Disabled"
        />
      ),
    },
  ]

  return (
    <MainLayout>
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>User Management</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            Add User
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={users}
          loading={loading}
          rowKey="id"
        />
        <CreateUserModal
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      </div>
    </MainLayout>
  )
}

export default Users

