{
    let view = {
        el: '.page>main',
        init() {
            this.$el = $(this.el)
        },
        template: `
       
        <form class='form'>
            <div class='row'>
                <label>
                歌名
                
                 </label>
                <input name="name" type="text" value="__name__">
            </div>
            <div class="row">
                <label>
                    歌手
                   
                </label>
                <input name="singer" type="text" value="__singer__">
            </div>
            <div class="row">
                <label>
                    歌曲链接  
                </label>
                <input name="url" type="text" value="__url__">
            </div>
            <div class="row active">
                <button type="submit">保存</button>
            </div>
        </form>
        `,
        render(data = {}) {
            let placeholders = ['name', 'singer', 'url', 'id']
            let html = this.template
            placeholders.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
            if (data.id) {
                $(this.el).prepend('<h1>编辑歌曲</h1>')

            } else {
                $(this.el).prepend('<h1>新建歌曲</h1>')
            }
        },
        reset() {
            this.render({})
        }

    }
    let model = {
        data: {
            name: '',
            singer: '',
            url: '',
            id: ''
        },
        create(data) {
            // 声明类型
            var Song = AV.Object.extend('Song');
            // 新建对象
            var song = new Song();
            // 设置名称
            song.set('name', data.name);
            song.set('singer', data.singer);
            song.set('url', data.url);
            // 设置优先级
            // song.set('priority', 1);
            return song.save().then((newSong) => {
                let { id, attributes } = newSong
                // this.data.id=id
                // this.data.name=attributes.name
                // this.data.singer=attributes.singer
                // this.data.url=attributes.url
                // this.data = {
                //         id: id,
                //         // ...attributes信誉发
                //         name: attributes.name,
                //         singer: attributes.singer,
                //         url: attributes.url

                //     }
                Object.assign(this.data, {
                    id: id,
                    // ...attributes信誉发
                    name: attributes.name,
                    singer: attributes.singer,
                    url: attributes.url

                })


            }, (error) => {
                console.error(error);
            });
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.view.render(this.model.data)
            this.bindEvernts()
            window.eventHub.on('upload', (data) => {
                this.model.data = data
                this.view.render(this.model.data)
                    // this.reset(data)
            })
            window.eventHub.on('select', (data) => {
                console.log(data)
                this.model.data = data
                this.view.render(this.model.data)
            })
            window.eventHub.on('new', (data) => {
                // if (data === undefined) {
                //     data = {
                //         name: '',
                //         url: '',
                //         id: '',
                //         singer: ''
                //     }
                // }

                if (this.model.data.id) {
                    this.model.data = {
                        name: '',
                        url: '',
                        id: '',
                        singer: ''
                    }
                } else {
                    Object.assign(this.model.data, data)
                }
                // this.model.data = data
                this.view.render(this.model.data)

            })

        },
        reset(data) {
            this.view.render(data)
        },
        bindEvernts() {
            this.view.$el.on('submit', 'form', (e) => {
                e.preventDefault()
                let needs = 'name singer url'.split(' ')
                let data = {}
                needs.map((string) => {
                    data[string] = this.view.$el.find(`[name="${string}"]`).val()
                })

                this.model.create(data)
                    .then(() => {
                        this.view.reset()
                        let string = JSON.stringify(this.model.data)
                        let object = JSON.parse(string)
                        window.eventHub.emit('create', object)
                            // console.log(this.model.data)

                    })

            })
        }
    }

    controller.init(view, model)


}