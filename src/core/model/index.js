import elementVNode from "./elementVNode"
const creatElement = elementVNode.createElement
function render (vnode, root) {
    const dom = renderDom(vnode)
    root.appendChild(dom)
}
function renderDom (vnode) {
    const dom = vnode.render()
    if (vnode.children) {
        vnode.children.forEach(vn => {
            const child = renderDom(vn)
            dom.appendChild(child)
        });
    }
    return dom
}
export {
    render,
    creatElement
}