import Loading from './loading.vue'

const Mermaid = {
    name: 'Mermaid',
    props: {
        id: {
            type: String,
            required: false,
            default() {
                return 'diagram_'+Date.now()
            }
        },
        graph: {
            type: String,
            required: false
        }
    },
    data () {
        return {
            svg: undefined
        }
    },
    computed: {
        graphData() {
            if (this.graph) {
                return this.graph
            }

            return this.$slots.default[0].text
        }
    },
    render (h) {
        if (this.svg === undefined) {
            return h('Loading')
        }

        return h('div', {
            class: ['mermaid-diagram'],
            domProps: {
                innerHTML: this.svg,
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
                    this.svg = svg
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
