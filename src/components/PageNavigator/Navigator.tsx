import React from 'react'
import { Dropdown, Menu, Slider } from 'antd'
import { DownCircleFilled } from '@ant-design/icons'
import styled from 'styled-components'
import { Title } from 'components/Panel'

const Container = styled.div`
	width: 225px;
	height: 176px;
`

const ZoomSlider = styled(Slider)`
	margin: 7px 10px 10px;
	float: left;
	width: 120px;
`

const MiniMap = styled.div`
	width: 100%;
	height: 120px;
`

const ZoomDropdownButton = styled.a`
	color: rgba(0, 0, 0, 0.45);
	margin-left: 4px;
	line-height: 24px;
	font-weight: 100;
	text-decoration: none;
`

interface IProps {
	zoom: number
	maxZoom: number
	minZoom: number
	changeZoom(zoom: number): void
}

export const Navigator: React.FC<IProps> = ({
	zoom,
	maxZoom,
	minZoom,
	changeZoom,
}) => {
	const sliderTipFormatter = (num: number) => {
		const zoom = Math.ceil(num * (maxZoom - minZoom) + minZoom * 100)
		return zoom + '%'
	}
	const sliderChange = (num: number) => {
		changeZoom((num / 100) * (maxZoom - minZoom) + minZoom)
	}
	const dropdownChange = (ev: any) => {
		const item = ev.item
		const zoom = item.props.zoom
		changeZoom(Number(zoom))
	}

	const MenuOverlay = () => {
		return (
			<Menu onClick={dropdownChange}>
				<Menu.Item>50%</Menu.Item>
				<Menu.Item>100%</Menu.Item>
				<Menu.Item>150%</Menu.Item>
				<Menu.Item>200%</Menu.Item>
			</Menu>
		)
	}

	return (
		<Container>
			<Title>Navigator</Title>
			<MiniMap id="minimap" />
			<div>
				<ZoomSlider
					value={((zoom - minZoom) / (maxZoom - minZoom)) * 100}
					tipFormatter={sliderTipFormatter}
					onChange={sliderChange}
				/>
				<Dropdown overlay={<MenuOverlay />}>
					<ZoomDropdownButton href="#">
						{Math.ceil(zoom * 100)} %<DownCircleFilled />
					</ZoomDropdownButton>
				</Dropdown>
			</div>
		</Container>
	)
}
