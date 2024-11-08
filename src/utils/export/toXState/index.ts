import { IData, IEdge, IGroup, INode } from '@antv/g6' // IGroup
import { get, set } from 'lodash'
import { getEdgesByNode, getLabel, getStart } from './utils'

export default (data: IData) => {
	data.edges = data.edges || []
	data.groups = data.groups || []

	// normalize nodes & edges
	const nodesById: { [key: string]: INode | IGroup } = {}
	const edgesById: { [key: string]: IEdge } = {}

	// xstate setup
	const xstate: any = {
		states: {},
	}

	if (!data.nodes) {
		return xstate
	}

	// normalize nodes
	const allNodes: Array<INode | IGroup> = [...data.nodes, ...data.groups]
	allNodes.forEach((node: INode) => {
		nodesById[node.id] = node
	})

	const start: INode | IGroup = getStart(allNodes)

	// collect nodes to avoid calling a node twice
	const traversedStates = new Set()

	// if no edges, cannot continue
	if (!data.edges) {
		return xstate
	}

	// normalize edges
	data.edges.forEach((edge: IEdge) => {
		edgesById[edge.id] = edge
	})

	function traverseEdges(edgeList: IEdge[], path: string[]): void {
		edgeList.forEach((edge: IEdge) => {
			if (xstate.states) {
				// add state
				const node = nodesById[edge.target]
				if (!node) {
					// BUG HERE, should have node
					throw new Error(
						'Node does not exist. This is likely a bug in the toXstate function',
					)
				}
				const target: string = node.label || node.id || ''
				if (!get(xstate, [...path, target])) {
					set(xstate, [...path, target], {})
				}
				const nextNode = allNodes.find((n) => n.id === edge.target)
				if (nextNode) {
					traverseNode(nextNode, path)
				}

				// add state.on
				const source: string = nodesById[edge.source].label || ''
				set(xstate, [...path, source, 'on', edge.label], target)
			}
		})
	}

	const arrayFields = ['onEntry', 'onExit']
	const booleanFields = ['history', 'parallel']

	function traverseNode(
		node: INode | IGroup,
		path: string[] = ['states'],
	): void {
		// node has not been checked yet
		if (!traversedStates.has(node.id)) {
			traversedStates.add(node.id)

			const label = getLabel(node.label)

			if (!get(xstate, [...path, label])) {
				set(xstate, [...path, label], {})
			}

			// set initial state
			if (node.initial) {
				set(xstate, [...path.slice(0, path.length - 1), 'initial'], node.label)
			}

			// set id
			set(xstate, [...path, label, 'id'], node.id)

			for (const field of booleanFields) {
				// @ts-ignore
				const item = node[field]
				if (item) {
					set(xstate, [...path, label, field], true)
				}
			}

			for (const field of arrayFields) {
				// @ts-ignore
				const items = node[field]
				if (items && items.length) {
					set(xstate, [...path, label, field], items)
				}
			}

			// traverse children
			const isGroup = !node.hasOwnProperty('type')
			if (isGroup) {
				const childNodes = allNodes.filter((n) => n.parent === node.id)
				childNodes.forEach((n) => {
					traverseNode(n, [...path, label, 'states'])
				})
			}

			// TODO: traverse parent
			const parentId = node.parent
			if (parentId && !traversedStates.has(parentId)) {
				const parent = allNodes.find((n) => n.id === parentId)
				if (parent) {
					traverseNode(parent, [...path, label, 'states'])
				}
				// TODO: handle parent
				// console.warn('WARNING: parent not yet handled', parent)
			}

			// traverse edges
			const nodeEdges = getEdgesByNode(data, node)
			traverseEdges(nodeEdges || [], path)
		}
		return
	}

	traverseNode(start)

	return xstate
}
