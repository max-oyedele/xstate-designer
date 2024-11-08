import React from 'react'
import { Navigator } from './Navigator'
import { Zoom } from './Zoom'

interface IProps {
	flow: any
}

export const PageNavigator: React.FC<IProps> = ({ flow }) => {
	return (
		<Zoom getFlow={() => flow}>
			{({ zoom, minZoom, maxZoom, changeZoom }: any) => (
				<Navigator
					zoom={zoom}
					minZoom={minZoom}
					maxZoom={maxZoom}
					changeZoom={changeZoom}
				/>
			)}
		</Zoom>
	)
}
