import React, { useState, useEffect } from 'react'
import { notification } from 'antd'
import { HeartFilled } from '@ant-design/icons'
import Editor from 'containers/Editor'
import StateNavigator from 'containers/StateNavigator'
import { Layout } from './Layout'

export default function App() {
	const [mode, setMode] = useState('edit')

	useEffect(() => {
		const fetchData = async () => {
			const informedAlpha = await window.localStorage.getItem(
				'tellYaBoutDaBugs',
			)
			if (!informedAlpha) {
				bugNotify()
				window.localStorage.setItem('tellYaBoutDaBugs', 'DoneToldja')
			}
		}

		fetchData()
	}, [])

	const bugNotify = () => {
		setTimeout(
			() =>
				notification.info({
					icon: <HeartFilled />,
					message: 'Forgive me',
					description: 'I have bugs. Still working things out.',
				}),
			3000,
		)
	}

	const onSelectMode = (mode: string) => {
		setMode(mode)
	}

	return (
		<Layout mode={mode} onSelectMode={onSelectMode}>
			{mode === 'edit' && <Editor />}
			{mode === 'play' && <StateNavigator />}
		</Layout>
	)
}
