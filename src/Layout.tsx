import React, { useState } from 'react'
import { Layout as AntdLayout, Menu } from 'antd'
import { EditFilled, PlayCircleFilled } from '@ant-design/icons'

const { Sider, Content } = AntdLayout

const styles = {
	sider: {
		paddingTop: '1em',
		display: 'flex',
		justifyContent: 'center',
		height: '100vh',
	},
	content: {
		background: '#fff',
		minHeight: 280,
	},
	logo: {
		display: 'flex',
		justifyContent: 'center',
		marginBottom: '5px',
	},
}

interface IProps {
	children: any
	mode: string
	onSelectMode(mode: string): void
}

export const Layout: React.FC<IProps> = ({ children, mode, onSelectMode }) => {
	const [collapsed, setCollapsed] = useState<boolean>(false)

	const toggle = () => {
		setCollapsed(!collapsed)
	}

	const onSelect = ({ key }: { key: string }) => {
		onSelectMode(key)
	}

	return (
		<AntdLayout>
			<Sider
				style={styles.sider}
				trigger={null}
				collapsible={true}
				collapsed={collapsed}>
				<Menu
					theme="dark"
					mode="inline"
					defaultSelectedKeys={[mode]}
					onSelect={onSelect}>
					<Menu.Item key="edit">
						<EditFilled />
						<span>Edit</span>
					</Menu.Item>
					<Menu.Item key="play">
						<PlayCircleFilled />
						<span>Play</span>
					</Menu.Item>
				</Menu>
			</Sider>
			<AntdLayout>
				<Content style={styles.content}>{children || ''}</Content>
			</AntdLayout>
		</AntdLayout>
	)
}
