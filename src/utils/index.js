import { Component } from 'preact'

export function isStateless(component) {
    return !(component.prototype && component.prototype.render) && !Component.isPrototypeOf(component)
}

export function getComponentName(component) {
    return component.displayName || component.name || (component.constructor && component.constructor.name)
}
