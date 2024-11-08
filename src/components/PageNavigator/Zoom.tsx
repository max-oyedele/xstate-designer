import React, { useState, useEffect } from 'react'
import { IZoom } from '@antv/g6'

interface IProps {
	getFlow(): any
	children(params: any): any
}

export const Zoom: React.FC<IProps> = ({ children, getFlow }) => {
	const [zoom, setZoom] = useState<number>(1)
	const [maxZoom, setMaxZoom] = useState<number>(2)
	const [minZoom, setMinZoom] = useState<number>(0.5)

	let flow: any = null
	useEffect(() => {
		// TODO: cleanup flow hack
		const afterZoom = setTimeout(() => {
			flow = getFlow()
			flow.on('afterzoom', (ev: IZoom) => {
				changeZoom(ev.updateMatrix[0])
			})
		}, 300)

		return () => {
			clearTimeout(afterZoom)
		}
	}, [])

	const changeZoom = (zoom: number) => {
		flow.zoom(zoom)
		setZoom(zoom)
	}

	const output = {
		zoom,
		maxZoom,
		minZoom,
		changeZoom,
	}

	return children(output)
}
