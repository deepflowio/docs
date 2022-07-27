import Loading from './loading.vue'

const Mermaid = {
    name: 'Mermaid',
    props: {
        id: {
            type: String,
            required: false,
            default () {
                return 'diagram_' + Date.now()
            }
        },
        graph: {
            type: String,
            required: false
        }
    },
    data () {
        return {
            rendered: false
            // id: Math.random().toString(16)
        }
    },
    computed: {
        graphData () {
            if (this.graph) {
                return this.graph
            }

            return this.$slots.default[0].text
        }
    },
    render (h) {
        if (this.rendered === false) {
            return h('Loading')
        }

        return h('div', {
            class: ['mermaid-diagram'],
            domProps: {
                id: this.id,
                style: 'width: 100%'
            }
        })
    },
    mounted () {
        import('mermaid/dist/mermaid.min').then(mermaid => {
            mermaid.initialize({ startOnLoad: false, ...MERMAID_OPTIONS })
            mermaid.render(
                this.id,
                this.graphData,
                (svg) => {
                    const reomve = appendCanvasChild('canvas_' + this.id)
                    svg = addHeightSvg(svg)
                    window._YS_RENDER_IMAGE(svg, 'canvas_' + this.id, svg => {
                        this.rendered = true
                        this.$nextTick(() => {
                            document.getElementById(this.id).appendChild(svg)
                        })
                        reomve()
                    })
                },
                document.querySelector('.mermaid-contianer')
            )
        })
    },
    components: {
        Loading
    }
}

export default ({ Vue }) => {
    Vue.component(Mermaid.name, Mermaid)
}

function addHeightSvg (svg = '') {
    let index = svg.indexOf('style="max-width')
    index = index + 'style="'.length
    return svg.slice(0, index) + 'height: auto;' + svg.slice(index)
}

function appendCanvasChild (id) {
    const canvas = document.createElement('canvas')
    canvas.id = id
    canvas.style = 'position: absolute;top: -9999px; left: -9999px;'
    document.body.appendChild(canvas)
    return () => {
        canvas.remove()
    }
}