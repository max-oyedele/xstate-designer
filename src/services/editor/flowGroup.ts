import { IGroupItem, IKeyShape } from '@antv/g6'
import { IFlow, IFlowNodeOptions } from '@antv/g6-editor'
import anchor from './anchor'

export default (Flow: IFlow) => {
	Flow.registerGroup('flow-group', {
		// getSelectedStyle() {
		// 	return { fill: '#1890ff' }
		// },
		draw(this: IFlowNodeOptions, item: IGroupItem): IKeyShape {
			const model = item.getModel()
			const group = item.getGraphicGroup()

			const childBox = item.getChildrenBBox()

			const padding = 20
			const paddingTop = 30
			const width = childBox.maxX - childBox.minX + padding * 2
			const height = childBox.maxY - childBox.minY + padding * 2 + paddingTop

			// const collapsed = model.collapsed

			// group container
			const keyShape: IKeyShape = group.addShape('rect', {
				attrs: {
					x: childBox.x - padding,
					y: childBox.y - (padding + paddingTop),
					width,
					height,
					radius: 4,
					fill: '#F7F9FB',
					stroke: '#CED4D9',
				},
			})

			model.initial = model.initial || false
			model.label = model.label || model.id
			model.onEntry = model.onEntry || []
			model.onExit = model.onExit || []

			// group title
			group.addShape('text', {
				attrs: {
					text: model.label,
					x: childBox.minX + padding,
					y: childBox.minY - paddingTop,
					textAlign: 'center',
					textBaseline: 'top',
					fill: 'rgba(0,0,0,0.65)',
				},
			})

			// parallel icon
			const isParallel = model.parallel || false
			group.addShape('image', {
				attrs: {
					img: isParallel
						? `${process.env.PUBLIC_URL}/assets/icons/parallel.svg`
						: null,
					x: childBox.maxX - padding,
					y: childBox.minY - paddingTop,
					width: 16,
					height: 16,
				},
			})

			const isInitial = model.initial || false
			group.addShape('image', {
				attrs: {
					img: isInitial
						? `${process.env.PUBLIC_URL}/assets/icons/initial-state.svg`
						: null,
					x: childBox.minX + width / 2 - 29,
					y: childBox.minY - paddingTop - 60,
					width: 19,
					height: 40,
				},
			})

			return keyShape
		},
		anchor,
	})
}
