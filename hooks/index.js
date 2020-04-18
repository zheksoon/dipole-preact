import { useState, useEffect } from 'preact/hooks'
import { Reaction } from 'dipole'

import { getComponentName } from '../src/utils'

export function observer(component) {
	let updatesCount = 0
	const observerComponent = function() {
		const [_, setUpdatesCount] = useState(updatesCount)
		
		const reaction = new Reaction(
			component, this, () => setUpdatesCount(++updatesCount)
		)
		useEffect(() => {
			return () => reaction.destroy()
		})
		
		return reaction.run.apply(reaction, arguments);
	}
    const componentName = getComponentName(component) || 'Component'
    Object.defineProperty(observerComponent, 'name', { 
        value: componentName
    })
    observerComponent.displayName = componentName
    return observerComponent
}
