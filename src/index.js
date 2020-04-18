import { Reaction } from 'dipole'
import { Component } from 'preact'

import { isStateless, getComponentName } from './utils'

function makeComponentClass(component) {
    const classComponent = class extends Component {
        render(props, state, context) {
            return component(props, context)
        }
    }
    const componentName = getComponentName(component) || 'Component'
    Object.defineProperty(classComponent, 'name', { 
        value: componentName
    })
    classComponent.displayName = componentName
    return classComponent
}

function makeObserver(component) {
    const observerComponent = class extends component {
        constructor(props, context) {
            super(props, context)
            this._reaction = new Reaction(
                component.prototype.render, 
                this,
                () => this.forceUpdate(),
            )
        }

        componentWillUnmount() {
            if (component.prototype.componentWillUnmount != null) {
                component.prototype.componentWillUnmount.call(this)
            }
            this._reaction.destroy()
        }

        render(props, state, context) {
            return this._reaction.run(props, state, context)
        }
    }
    const componentName = getComponentName(component) || 'Component'
    Object.defineProperty(observerComponent, 'name', { 
        value: componentName
    })
    observerComponent.displayName = componentName
    return observerComponent
}

export function observer(component) {
    if (isStateless(component)) {
        component = makeComponentClass(component)
    }
    return makeObserver(component)
}